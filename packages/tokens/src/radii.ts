/**
 * Arlo UI corner radii (Figma `radius-*`). Values are px unless noted.
 * `full` is a pill cap (9999px).
 */

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export type RadiusTokens = typeof radii;
export type RadiusScale = keyof RadiusTokens;
