/**
 * Arlo UI typography scale (mobile-first).
 *
 * Manrope scale from the Arlo UI Figma type foundation.
 * Compatibility aliases keep existing copied components working while they
 * migrate to the explicit display / heading / body / label / button names.
 */

export const fontFamilies = {
  sans: 'Manrope',
  mono: 'Space Mono',
  display: 'Manrope',
} as const;

export const fontWeights = {
  normal: '400',
  emphasized: '600',
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

export const typography = {
  displayLarge: {
    fontSize: 34,
    lineHeight: 42.5,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.68,
  },
  displayLargeEmphasized: {
    fontSize: 34,
    lineHeight: 42.5,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.68,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.56,
  },
  displayMediumEmphasized: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.56,
  },
  displaySmall: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.48,
  },
  displaySmallEmphasized: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.48,
  },
  headingLarge: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.2,
  },
  headingLargeEmphasized: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
  headingMedium: {
    fontSize: 17,
    lineHeight: 22.1,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.17,
  },
  headingMediumEmphasized: {
    fontSize: 17,
    lineHeight: 22.1,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.17,
  },
  headingSmall: {
    fontSize: 14,
    lineHeight: 18.2,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.14,
  },
  headingSmallEmphasized: {
    fontSize: 14,
    lineHeight: 18.2,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.14,
  },
  bodyLarge: { fontSize: 17, lineHeight: 23.8, fontWeight: fontWeights.regular, letterSpacing: 0 },
  bodyMedium: { fontSize: 14, lineHeight: 19.6, fontWeight: fontWeights.regular, letterSpacing: 0 },
  bodySmall: { fontSize: 12, lineHeight: 16.8, fontWeight: fontWeights.regular, letterSpacing: 0 },
  labelLarge: { fontSize: 14, lineHeight: 16.8, fontWeight: fontWeights.regular, letterSpacing: 0 },
  labelMedium: {
    fontSize: 12,
    lineHeight: 14.4,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  },
  labelSmall: { fontSize: 11, lineHeight: 13.2, fontWeight: fontWeights.regular, letterSpacing: 0 },
  buttonLarge: { fontSize: 20, lineHeight: 22, fontWeight: fontWeights.semibold, letterSpacing: 0 },
  buttonMedium: {
    fontSize: 17,
    lineHeight: 18.7,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
  },
  buttonSmall: {
    fontSize: 14,
    lineHeight: 15.4,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
  },
  buttonLabel: {
    fontSize: 12,
    lineHeight: 13.2,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
  },

  // Compatibility aliases for existing registry components.
  displayXl: {
    fontSize: 34,
    lineHeight: 42.5,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.68,
  },
  displayLg: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.56,
  },
  title1: { fontSize: 24, lineHeight: 30, fontWeight: fontWeights.semibold, letterSpacing: -0.48 },
  title2: { fontSize: 20, lineHeight: 26, fontWeight: fontWeights.semibold, letterSpacing: -0.2 },
  title3: { fontSize: 17, lineHeight: 22.1, fontWeight: fontWeights.medium, letterSpacing: -0.17 },
  body: { fontSize: 14, lineHeight: 19.6, fontWeight: fontWeights.regular, letterSpacing: 0 },
  bodySm: { fontSize: 12, lineHeight: 16.8, fontWeight: fontWeights.regular, letterSpacing: 0 },
  label: {
    fontSize: 11,
    lineHeight: 13.2,
    fontWeight: fontWeights.medium,
    letterSpacing: 0,
  },
} as const;

export type TypographyTokens = typeof typography;
export type TypographyVariant = keyof TypographyTokens;
