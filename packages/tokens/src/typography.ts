/**
 * Arlo UI typography scale (mobile-first).
 *
 * Use Space Mono for prices, timestamps, percentages, status labels, and tabular data.
 * Reserve the optional display face for one hero element per screen.
 */

export const fontFamilies = {
  sans: 'Space Grotesk',
  mono: 'Space Mono',
  display: 'Doto',
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

export const typography = {
  displayXl: { fontSize: 40, lineHeight: 44, fontWeight: fontWeights.semibold },
  displayLg: { fontSize: 32, lineHeight: 36, fontWeight: fontWeights.semibold },
  title1: { fontSize: 24, lineHeight: 30, fontWeight: fontWeights.semibold },
  title2: { fontSize: 20, lineHeight: 26, fontWeight: fontWeights.semibold },
  title3: { fontSize: 17, lineHeight: 22, fontWeight: fontWeights.medium },
  body: { fontSize: 15, lineHeight: 21, fontWeight: fontWeights.regular },
  bodySm: { fontSize: 13, lineHeight: 18, fontWeight: fontWeights.regular },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.66, // 0.06em at 11pt
  },
} as const;

export type TypographyTokens = typeof typography;
export type TypographyVariant = keyof TypographyTokens;
