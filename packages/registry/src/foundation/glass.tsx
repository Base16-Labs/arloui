/**
 * Arlo UI — Liquid Glass
 *
 * One place that decides what a glass surface is actually made of, and turns a
 * material token into the fill, border, and blur strength a component paints.
 * Every glass-capable component (Button, Card, Sheet, TabBar) resolves through
 * `useGlassSurface` and mounts `GlassBackdrop`, so the material reads identically
 * across the system and only has to be retuned once.
 *
 * There are two implementations behind that seam:
 *
 *   1. **Native.** On iOS 26 and up, `expo-glass-effect` exposes the real system
 *      material — a live, refractive, specular surface the OS renders. Nothing in
 *      React Native reproduces it, so where it exists we hand the surface over
 *      wholesale and paint nothing of our own on top.
 *   2. **Arlo's own.** Everywhere else — older iOS, Android, web, Expo Go, or a
 *      project that simply never installed `expo-glass-effect` — a translucent
 *      overlay from `materials.*` over a host blur layer.
 *
 * Components do not choose between them and must not try to. They ask for a
 * material; this file decides. That is what keeps `surface="glass"` a single
 * concept rather than an iOS feature with a sad Android branch.
 *
 * ## `expo-glass-effect` requires the New Architecture
 *
 * The graceful degradation below is a **runtime** guarantee, and only that. It
 * covers not having the package, not having the native module, being on Android,
 * and being on an iOS older than 26 — but it cannot cover the build.
 *
 * `GlassView` overrides `mountChildComponentView` / `unmountChildComponentView`,
 * which only exist on `ExpoView` under Fabric. In an app with
 * `newArchEnabled: false`, autolinking still compiles the pod and Swift fails
 * with "method does not override any method from its superclass" — a broken
 * build, not a fallback.
 *
 * So: install `expo-glass-effect` only in a New Architecture app. An old-arch
 * project that wants the rest of Arlo keeps the package out and gets the
 * fallback path, which is fully supported and needs nothing installed. If it
 * arrives transitively, exclude it from autolinking in `package.json`:
 *
 *   { "expo": { "autolinking": { "exclude": ["expo-glass-effect"] } } }
 *
 * ## Who paints what
 *
 * `GlassBackdrop` paints the whole surface: the fill, the tint, and the press
 * response. The component takes only the edge and the shape, and never sets a
 * `backgroundColor` of its own on a glass container — a fill there stacks under
 * the backdrop's and turns the material into an almost-opaque panel.
 *
 *   const glass = useGlassSurface('medium');
 *   <View style={{
 *     borderColor: glass.borderColor,
 *     borderWidth: glass.borderWidth,
 *     borderRadius: radius,
 *     overflow: 'hidden',
 *   }}>
 *     <GlassBackdrop material="medium" borderRadius={radius} tintColor={tone} pressed={pressed}>
 *       {blurComponent}
 *     </GlassBackdrop>
 *     …
 *   </View>
 */
import { useSyncExternalStore, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import { useTokens } from './theme-provider';

/** Material weight. Heavier materials blur more and let less of the backdrop through. */
export type GlassMaterial = 'small' | 'medium' | 'large';

export type GlassSurface = {
  /** Translucent overlay fill for the current color scheme. */
  backgroundColor: string;
  /** Hairline that gives the material its lit edge. */
  borderColor: string;
  borderWidth: number;
  /** Blur radius the host blur layer should use, in points. */
  blur: number;
  /**
   * Whether this surface is being drawn by the OS rather than by us.
   *
   * Read it to *stop* painting, never to start: when it is true the system
   * material already carries the fill and its own specular edge, so
   * `backgroundColor` is transparent and `borderWidth` is 0. A component that
   * spreads this object gets the right answer without branching.
   */
  native: boolean;
};

const MATERIAL_TOKEN = {
  small: 'glassSmall',
  medium: 'glassMedium',
  large: 'glassLarge',
} as const;

/**
 * Arlo's three weights onto the system's two.
 *
 * iOS ships `clear` and `regular`; we ship three steps. `small` is the thinnest
 * material we have and maps to `clear`, while `medium` and `large` both land on
 * `regular` — so those two converge natively and stay distinct only in the
 * fallback. That is the honest trade: inventing a difference by tinting the
 * system material would make `large` read as a coloured surface rather than a
 * heavier one.
 */
const MATERIAL_GLASS_STYLE = {
  small: 'clear',
  medium: 'regular',
  large: 'regular',
} as const;

type GlassEffectModule = {
  GlassView: React.ComponentType<Record<string, unknown>>;
  isLiquidGlassAvailable: () => boolean;
  isGlassEffectAPIAvailable: () => boolean;
};

/**
 * `expo-glass-effect` is an optional peer dependency, so this is a guarded
 * `require` rather than an import — the module genuinely may not be there, and a
 * consumer who never installed it must still get a working glass surface.
 *
 * It has to be synchronous: the decision picks which component to render, and an
 * async probe would mean shipping one frame of the wrong surface and then
 * swapping it, which reads as a flicker on every mount.
 */
let moduleLookedUp = false;
let glassModule: GlassEffectModule | null = null;

function loadGlassEffect(): GlassEffectModule | null {
  if (moduleLookedUp) return glassModule;
  moduleLookedUp = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    glassModule = require('expo-glass-effect') as GlassEffectModule;
  } catch {
    glassModule = null;
  }
  return glassModule;
}

let nativeAvailable: boolean | undefined;

/**
 * Whether the OS will draw the glass for us.
 *
 * Both probes are required, and both are wrapped. They call
 * `requireNativeModule('ExpoGlassEffect')` internally, which **throws** when the
 * JS is present but the native module is not — the Expo Go case, and any project
 * that added the package without rebuilding. And they answer different questions:
 * `isLiquidGlassAvailable` says the app is running the Liquid Glass design, while
 * `isGlassEffectAPIAvailable` says the API is safe to call at all. The second
 * exists because several iOS 26 betas ship the design without the API and crash
 * when you use it, so treating the first as sufficient would hard-crash those
 * devices instead of falling back.
 *
 * Cached, because the answer cannot change without the app relaunching.
 */
export function isNativeGlassAvailable(): boolean {
  if (nativeAvailable !== undefined) return nativeAvailable;
  if (Platform.OS !== 'ios') {
    nativeAvailable = false;
    return nativeAvailable;
  }
  const mod = loadGlassEffect();
  if (!mod) {
    nativeAvailable = false;
    return nativeAvailable;
  }
  try {
    nativeAvailable = mod.isLiquidGlassAvailable() && mod.isGlassEffectAPIAvailable();
  } catch {
    nativeAvailable = false;
  }
  return nativeAvailable;
}

/**
 * Reduce Transparency, as one answer for the whole app.
 *
 * This deliberately is **not** per-component state. It used to be: every
 * `useGlassSurface` call owned a `useState(false)` and its own async
 * `isReduceTransparencyEnabled()` probe. That is one store per hook call, and a
 * glass component calls the hook at least twice — once in the component for its
 * border and fill, once inside `GlassBackdrop` for the material itself. Two
 * stores resolving independently can disagree for a frame, and when they
 * disagree the component paints a fallback fill underneath a system material, or
 * hands `GlassBackdrop` a `native` answer its parent has not taken yet. Both
 * read on screen as the surface changing on its own, with nothing touched.
 *
 * A module-level store with a single subscription cannot do that: every consumer
 * reads the same value in the same render, so the surface only ever changes when
 * the setting actually changes.
 *
 * The OS subscription is intentionally never torn down. It is one listener for
 * the process, and dropping it when the last glass component unmounts would just
 * mean re-probing — and re-flickering — the next time one mounts.
 *
 * Glass is the material this setting is aimed at, so it outranks the native
 * path: someone who has asked the OS to stop making surfaces see-through should
 * not be handed the most see-through surface we own because their phone happens
 * to be new enough to render it well. When it is on we fall back, and the
 * fallback's own overlay is what carries the surface.
 */
let reduceTransparency = false;
let reduceTransparencySubscribed = false;
const reduceTransparencyListeners = new Set<() => void>();

function setReduceTransparency(next: boolean): void {
  if (next === reduceTransparency) return;
  reduceTransparency = next;
  for (const listener of reduceTransparencyListeners) listener();
}

function getReduceTransparency(): boolean {
  return reduceTransparency;
}

function subscribeReduceTransparency(listener: () => void): () => void {
  reduceTransparencyListeners.add(listener);
  if (!reduceTransparencySubscribed && Platform.OS === 'ios') {
    reduceTransparencySubscribed = true;
    // `?.` because the method is iOS/Android-only and absent on some hosts; the
    // `catch` because a rejected probe must leave glass working, not unhandled.
    AccessibilityInfo.isReduceTransparencyEnabled?.()
      .then(setReduceTransparency)
      .catch(() => {});
    AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency);
  }
  return () => {
    reduceTransparencyListeners.delete(listener);
  };
}

export function useReduceTransparency(): boolean {
  return useSyncExternalStore(
    subscribeReduceTransparency,
    getReduceTransparency,
    getReduceTransparency,
  );
}

/**
 * `#RGB`, `#RRGGBB`, `#RRGGBBAA`, `rgb()`, and `rgba()` re-alpha'd.
 *
 * Tone colours arrive as opaque hex, and a tint has to be translucent or it
 * stops being glass — so every tint goes through here rather than through a
 * separate set of pre-mixed colour tokens, which would have to be re-derived
 * every time a tone changed.
 *
 * Anything it cannot parse (`transparent`, a named colour, a platform colour) is
 * returned untouched: a tint that renders at full strength is a visible mistake
 * someone will fix, where a silently dropped tint is not.
 */
export function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  const hex = color.trim();

  if (hex.startsWith('#')) {
    const body = hex.slice(1);
    // Widths 4 and 8 carry an alpha. It is read past deliberately: the material
    // token is the authority on how strongly a tint reads, and honouring a
    // tone's own alpha would let a translucent tone quietly under-tint its
    // surface.
    const step = body.length === 3 || body.length === 4 ? 1 : 2;
    if (body.length < step * 3) return color;
    const channel = (index: number) => {
      const raw = body.slice(index * step, index * step + step);
      return parseInt(step === 1 ? raw + raw : raw, 16);
    };
    return `rgba(${channel(0)},${channel(1)},${channel(2)},${a})`;
  }

  const parts = /^rgba?\(([^)]+)\)$/i.exec(hex)?.[1]?.split(',');
  if (parts && parts.length >= 3) {
    const [r, g, b] = parts.map((part) => part.trim());
    return `rgba(${r},${g},${b},${a})`;
  }

  return color;
}

/**
 * Resolve a glass material against the active theme and the platform.
 *
 * Components take `borderColor`, `borderWidth`, and `native` from here and leave
 * `backgroundColor` to `GlassBackdrop`, which is what actually paints it. It is
 * on the returned object because the fallback's overlay and the component's edge
 * come from the same token and have to agree — not as an invitation to paint it
 * on the container, which stacks the material's fill on top of itself.
 */
export function useGlassSurface(material: GlassMaterial = 'medium'): GlassSurface {
  const t = useTokens();
  const reduced = useReduceTransparency();
  const dark = t.name === 'dark';
  const tokens = t.materials[MATERIAL_TOKEN[material]];
  const native = isNativeGlassAvailable() && !reduced;

  if (native) {
    return {
      // The system material is the fill and the edge. Anything we add here sits
      // on top of a live refractive surface and flattens it.
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      blur: tokens.blur,
      native: true,
    };
  }

  return {
    backgroundColor: dark ? tokens.darkOverlay : tokens.lightOverlay,
    borderColor: dark ? tokens.darkBorder : tokens.lightBorder,
    borderWidth: 1,
    blur: tokens.blur,
    native: false,
  };
}

/**
 * Mounts the glass surface behind a component's content.
 *
 * **This is the only thing that paints a glass surface.** A component that also
 * sets `backgroundColor: glass.backgroundColor` on the container stacks the
 * material's overlay on top of itself — 0.64 over 0.64 lands near 0.87, which is
 * an almost-opaque panel wearing a glass token. Take `borderColor`,
 * `borderWidth`, and `borderRadius` from `useGlassSurface`; leave the fill here.
 *
 * On iOS 26 this is the system material, handed the theme's colour scheme
 * explicitly rather than `'auto'` — Arlo has its own `ThemeProvider`, so a user
 * reading a light app on a dark-mode phone must get light glass, and `'auto'`
 * would follow the OS and get it wrong.
 *
 * Everywhere else it is a host blur layer with the material's translucent fill
 * stacked *on top* of it. The order matters. A fill on the parent paints under
 * every child, so the blur layer ends up sampling the fill along with the content
 * behind the surface — and because host blurs are vibrancy effects (`expo-blur`
 * uses `saturate(180%)` on web, `UIBlurEffect` boosts chroma on iOS), the surface
 * comes back carrying an amplified cast of whatever passes beneath it. Over white
 * that reads as nothing; over anything coloured it reads as a coloured reflection
 * sliding across the glass. Fill above blur keeps the material muting the
 * backdrop instead of the other way round.
 *
 * With no `material` and no blur layer this renders nothing, so a glass surface
 * degrades to whatever the parent paints rather than breaking.
 *
 * The parent must set `overflow: 'hidden'` and its own `borderRadius` — the
 * backdrop fills the parent's bounds and is clipped by it. Pass the same radius
 * as `borderRadius` too: `UIGlassEffect` builds its lit edge from the shape it is
 * given, and a rectangular material clipped to a pill loses that edge and reads
 * as a flat cut-out that shifts as the backdrop moves behind it.
 */
export function GlassBackdrop({
  material,
  interactive = false,
  tintColor,
  pressed = false,
  borderRadius,
  children,
}: {
  material?: GlassMaterial;
  /**
   * Hands the press response to the system material.
   *
   * Only meaningful on the native path, and **only when this backdrop is the
   * thing being touched**. It is off by default because the usual arrangement is
   * the opposite one: the backdrop is an `absoluteFill` with `pointerEvents:
   * 'none'` under a `Pressable` ancestor that owns the gesture. Telling
   * `UIGlassEffect` to answer touches on a view that has been told not to receive
   * them gets you a material reacting on its own schedule — sometimes to a press
   * that landed elsewhere, sometimes not to the one that landed on it — on top of
   * whatever response the `Pressable` is already running. Controls should pass
   * `pressed` instead.
   */
  interactive?: boolean;
  /**
   * Tints the material with a component's own colour, so a glass primary button
   * still reads as primary. Pass the solid tone colour — the material's
   * `tintOpacity` token decides how much of it survives. Leave unset for
   * untinted glass.
   */
  tintColor?: string;
  /**
   * Deepens the tint to `tintOpacityPressed` while a control is held.
   *
   * This is the press response for a tinted glass surface, and it is a plain
   * overlay on purpose. The native material's own props cannot carry it:
   * `GlassView` re-assigns `glassEffectView.effect` whenever `tintColor` or
   * `isInteractive` changes — it has to, or the change does not take — and
   * re-assigning the effect makes `UIVisualEffectView` re-render the material,
   * which is a visible flash on every press. So the native material's props stay
   * fixed for the life of the surface and the colour moves above it.
   */
  pressed?: boolean;
  /** The parent's corner radius, so the material builds the right shape. */
  borderRadius?: number;
  children?: ReactNode;
}) {
  const t = useTokens();
  const resolved = material ?? 'medium';
  const surface = useGlassSurface(resolved);
  const tokens = t.materials[MATERIAL_TOKEN[resolved]];

  const tint = tintColor
    ? withAlpha(tintColor, pressed ? tokens.tintOpacityPressed : tokens.tintOpacity)
    : undefined;

  if (surface.native) {
    const mod = loadGlassEffect();
    // `native` is only true once the module resolved, so this is belt-and-braces
    // rather than a real branch — but it keeps the render honest if that ever
    // stops holding.
    if (mod) {
      const GlassView = mod.GlassView;
      return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <GlassView
            glassEffectStyle={MATERIAL_GLASS_STYLE[resolved]}
            colorScheme={t.name === 'dark' ? 'dark' : 'light'}
            isInteractive={interactive}
            // Fixed for the life of the surface — see `pressed` above. The tint
            // is applied at the material's resting opacity and the press delta
            // rides on the overlay below.
            tintColor={tintColor ? withAlpha(tintColor, tokens.tintOpacity) : undefined}
            borderRadius={borderRadius}
            style={StyleSheet.absoluteFill}
          />
          {tint && pressed ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: tint, borderRadius }]} />
          ) : null}
        </View>
      );
    }
  }

  if (!children && !material) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {children}
      {material ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: surface.backgroundColor }]} />
      ) : null}
      {tint ? <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} /> : null}
    </View>
  );
}

/**
 * Test seam. Resets the cached module lookup and availability answer so a suite
 * can exercise both paths in one process — nothing in an app should call it, and
 * the caching it clears is exactly what makes the production path cheap.
 */
export function __resetGlassCacheForTests(): void {
  moduleLookedUp = false;
  glassModule = null;
  nativeAvailable = undefined;
  // The OS subscription is left in place — it is a single process-lifetime
  // listener by design, and re-establishing it per test would only re-probe.
  // Resetting the value is what a suite actually needs.
  setReduceTransparency(false);
}
