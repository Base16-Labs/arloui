/**
 * Component-specific sizes (Figma Component Specific frame).
 * Use alongside spacing/radii; these are fixed px presets for icons, avatars, and button heights.
 */

export const sizing = {
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
  },
  avatar: {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 40,
  },
  buttonHeight: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 52,
  },
  touchTarget: {
    minimum: 44,
    comfortable: 48,
  },
} as const;

export type SizingTokens = typeof sizing;
