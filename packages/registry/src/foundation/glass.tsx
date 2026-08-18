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
 *   const glass = useGlassSurface('medium');
 *   <View style={{ borderColor: glass.borderColor, borderWidth: glass.borderWidth }}>
 *     <GlassBackdrop material="medium">{blurComponent}</GlassBackdrop>
 *     …
 *   </View>
 */
import { useEffect, useState, type ReactNode } from 'react';
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
 * Mirrors the user's Reduce Transparency setting.
 *
 * Glass is the one material this setting is aimed at, so it outranks the native
 * path: someone who has asked the OS to stop making surfaces see-through should
 * not be handed the most see-through surface we own because their phone happens
 * to be new enough to render it well. When it is on we fall back, and the
 * fallback's own overlay is what carries the surface.
 */
export function useReduceTransparency(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let active = true;
    AccessibilityInfo.isReduceTransparencyEnabled?.().then((on) => {
      if (active) setReduce(on);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setReduce,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduce;
}

/**
 * Resolve a glass material against the active theme and the platform.
 *
 * Components should treat the returned values as the complete surface treatment —
 * don't layer an opaque `backgroundColor` underneath, or the material stops
 * reading as translucent.
 */
export function useGlassSurface(material: GlassMaterial = 'medium'): GlassSurface {
  const t = useTokens();
  const reduceTransparency = useReduceTransparency();
  const dark = t.name === 'dark';
  const tokens = t.materials[MATERIAL_TOKEN[material]];
  const native = isNativeGlassAvailable() && !reduceTransparency;

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
 * backdrop fills the parent's bounds and is clipped by it.
 */
export function GlassBackdrop({
  material,
  interactive = false,
  tintColor,
  children,
}: {
  material?: GlassMaterial;
  /**
   * Lets the system material react to touch. Only meaningful on the native path
   * and only for controls — a card does not respond to being pressed, and a
   * button that does not is the thing that feels broken on iOS 26.
   */
  interactive?: boolean;
  /** Tints the material. Leave unset for untinted glass. */
  tintColor?: string;
  children?: ReactNode;
}) {
  const t = useTokens();
  const surface = useGlassSurface(material ?? 'medium');

  if (surface.native) {
    const mod = loadGlassEffect();
    // `native` is only true once the module resolved, so this is belt-and-braces
    // rather than a real branch — but it keeps the render honest if that ever
    // stops holding.
    if (mod) {
      const GlassView = mod.GlassView;
      return (
        <GlassView
          pointerEvents="none"
          glassEffectStyle={MATERIAL_GLASS_STYLE[material ?? 'medium']}
          colorScheme={t.name === 'dark' ? 'dark' : 'light'}
          isInteractive={interactive}
          tintColor={tintColor}
          style={StyleSheet.absoluteFill}
        />
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
}
