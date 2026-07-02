/**
 * Arlo UI effect tokens: blur strengths and translucent material fallbacks.
 *
 * Shadows and focus rings live in their platform-aware modules, while these
 * JSON-safe presets can be shared by native, web, registry, and agent tooling.
 */

export const blurs = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

/** @deprecated Prefer `blurs`. */
export const blur = blurs;

export const materials = {
  glassSmall: {
    blur: blurs.sm,
    lightOverlay: 'rgba(255,255,255,0.64)',
    darkOverlay: 'rgba(16,24,40,0.64)',
    lightBorder: 'rgba(255,255,255,0.56)',
    darkBorder: 'rgba(255,255,255,0.12)',
  },
  glassMedium: {
    blur: blurs.lg,
    lightOverlay: 'rgba(255,255,255,0.72)',
    darkOverlay: 'rgba(16,24,40,0.72)',
    lightBorder: 'rgba(255,255,255,0.64)',
    darkBorder: 'rgba(255,255,255,0.14)',
  },
  glassLarge: {
    blur: blurs.xl,
    lightOverlay: 'rgba(255,255,255,0.82)',
    darkOverlay: 'rgba(16,24,40,0.82)',
    lightBorder: 'rgba(255,255,255,0.72)',
    darkBorder: 'rgba(255,255,255,0.16)',
  },
  /** @deprecated Prefer `glassSmall`. */
  glassThin: {
    blur: blurs.sm,
    lightOverlay: 'rgba(255,255,255,0.64)',
    darkOverlay: 'rgba(16,24,40,0.64)',
    lightBorder: 'rgba(255,255,255,0.56)',
    darkBorder: 'rgba(255,255,255,0.12)',
  },
  /** @deprecated Prefer `glassMedium`. */
  glassRegular: {
    blur: blurs.lg,
    lightOverlay: 'rgba(255,255,255,0.72)',
    darkOverlay: 'rgba(16,24,40,0.72)',
    lightBorder: 'rgba(255,255,255,0.64)',
    darkBorder: 'rgba(255,255,255,0.14)',
  },
  /** @deprecated Prefer `glassLarge`. */
  glassThick: {
    blur: blurs.xl,
    lightOverlay: 'rgba(255,255,255,0.82)',
    darkOverlay: 'rgba(16,24,40,0.82)',
    lightBorder: 'rgba(255,255,255,0.72)',
    darkBorder: 'rgba(255,255,255,0.16)',
  },
} as const;

export type BlurTokens = typeof blurs;
export type MaterialTokens = typeof materials;
