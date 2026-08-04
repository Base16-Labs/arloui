/**
 * Arlo UI — Liquid Glass
 *
 * One place that turns a glass material token into the fill, border, and blur
 * strength a component should paint. Every glass-capable component (Button,
 * Card, Sheet, TabBar) resolves through `useGlassSurface` so the material reads
 * identically across the system and only has to be retuned once.
 *
 * React Native has no backdrop-filter, so the translucent overlay is only half
 * the effect — the actual blur comes from a host-supplied layer (usually
 * `expo-blur`'s `BlurView`) passed as `blurComponent` and mounted behind the
 * content by `GlassBackdrop`. Without it the surface still renders correctly,
 * just as a flat translucent fill.
 *
 *   const glass = useGlassSurface('medium');
 *   <View style={{ backgroundColor: glass.backgroundColor, borderColor: glass.borderColor }}>
 *     <GlassBackdrop>{blurComponent}</GlassBackdrop>
 *     …
 *   </View>
 */
import { type ReactNode } from 'react';
import { View } from 'react-native';
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
};

const MATERIAL_TOKEN = {
  small: 'glassSmall',
  medium: 'glassMedium',
  large: 'glassLarge',
} as const;

/**
 * Resolve a glass material against the active theme.
 *
 * Components should treat the returned values as the complete surface treatment —
 * don't layer an opaque `backgroundColor` underneath, or the material stops
 * reading as translucent.
 */
export function useGlassSurface(material: GlassMaterial = 'medium'): GlassSurface {
  const t = useTokens();
  const dark = t.name === 'dark';
  const tokens = t.materials[MATERIAL_TOKEN[material]];
  return {
    backgroundColor: dark ? tokens.darkOverlay : tokens.lightOverlay,
    borderColor: dark ? tokens.darkBorder : tokens.lightBorder,
    borderWidth: 1,
    blur: tokens.blur,
  };
}

/**
 * Mounts a host blur layer behind glass content. Renders nothing when no blur
 * layer was supplied, so `surface="glass"` degrades to a flat translucent fill
 * rather than breaking.
 *
 * The parent must set `overflow: 'hidden'` and its own `borderRadius` — the
 * backdrop fills the parent's bounds and is clipped by it.
 */
export function GlassBackdrop({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {children}
    </View>
  );
}
