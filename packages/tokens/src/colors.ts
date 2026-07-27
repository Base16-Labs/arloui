/**
 * Semantic color tokens from Figma **Utility / semantic** table + legacy flat aliases
 * for existing registry components (`bg`, `surface`, `accent`, …).
 *
 * Light mode maps follow the “Color (light)” column (Grey-n / Primary-n / …).
 * Dark mode inverts surfaces and text using the same Main palette scales.
 */
import { rgbaFromHex } from './colorUtils';
import { base, error, grey, paletteMain, primary, success, warning } from './paletteMain';
import { alphaRamp, paletteSecondary } from './paletteSecondary';

const G = grey;
/**
 * Dark mode runs on Zinc, not Grey. Grey's dark shades are blue-tinted
 * (900 `#101828`, 800 `#1E2939`), which reads as navy once it covers whole
 * surfaces. Zinc is hue-neutral and shares Grey's 950 (`#09090B`), so the
 * canvas is unchanged — only the raised surfaces, borders, and muted text
 * lose the blue cast.
 */
const Z = paletteSecondary.zinc;
const P = primary;
const S = success;
const W = warning;
const E = error;

/** Light — Figma utility tokens (camelCase). */
export const lightSemanticColors = {
  surfaceBackground: G[50],
  surfaceInput: G[100],
  surfaceInputActive: G[200],
  surfaceElevated: base.white,
  surfaceOverlay: alphaRamp.black[40],
  surfaceInverse: G[900],

  textPrimary: G[900],
  textSecondary: G[600],
  textTertiary: G[400],
  textDisabled: rgbaFromHex(G[900], 0.05),
  textInverse: base.white,
  textPlaceholder: G[300],
  textInteractivePrimary: base.white,
  textInteractiveSecondary: G[700],
  textInteractiveTertiary: P[600],
  textInteractiveError: E[600],

  interactivePrimary: P[600],
  interactivePrimaryPressed: P[700],
  interactiveSecondary: rgbaFromHex(G[200], 0.7),
  interactiveSecondaryPressed: G[200],
  interactiveTertiary: 'transparent',
  interactiveTertiaryPressed: alphaRamp.white[40],
  interactiveDisabled: G[100],
  interactiveError: E[500],

  focusRingMain: P[400],
  focusRingError: E[300],

  touchFeedbackMain: alphaRamp.black[10],
  touchFeedbackLight: alphaRamp.white[40],

  borderPrimary: G[300],
  borderSecondary: G[200],
  borderFocus: P[500],
  borderError: E[500],

  feedbackSuccess: S[500],
  feedbackSuccessBg: S[50],
  feedbackWarning: W[600],
  feedbackWarningBg: W[50],
  feedbackError: E[500],
  feedbackErrorBg: E[50],
  feedbackInfo: P[500],
  feedbackInfoBg: P[50],

  navBackground: base.white,
  navBorder: G[200],
  navActive: P[500],
  navInactive: G[400],
  navIndicator: P[500],

  pullIndicator: G[300],
} as const;

/** Dark — same token names; neutrals run on Zinc (see `Z` above), accents on the Main palette. */
export const darkSemanticColors = {
  surfaceBackground: Z[950],
  surfaceInput: Z[900],
  surfaceInputActive: Z[800],
  surfaceElevated: Z[800],
  surfaceOverlay: alphaRamp.black[70],
  surfaceInverse: Z[50],

  textPrimary: Z[50],
  textSecondary: Z[400],
  textTertiary: Z[500],
  textDisabled: rgbaFromHex(Z[50], 0.38),
  textInverse: Z[900],
  textPlaceholder: Z[600],
  textInteractivePrimary: base.white,
  textInteractiveSecondary: Z[200],
  textInteractiveTertiary: P[400],
  textInteractiveError: E[400],

  interactivePrimary: P[500],
  interactivePrimaryPressed: P[600],
  interactiveSecondary: Z[800],
  interactiveSecondaryPressed: Z[700],
  interactiveTertiary: 'transparent',
  interactiveTertiaryPressed: rgbaFromHex(Z[800], 0.55),
  interactiveDisabled: Z[800],
  interactiveError: E[500],

  focusRingMain: P[400],
  focusRingError: E[400],

  touchFeedbackMain: rgbaFromHex(Z[50], 0.08),
  touchFeedbackLight: rgbaFromHex(Z[800], 0.5),

  borderPrimary: Z[700],
  borderSecondary: Z[800],
  borderFocus: P[400],
  borderError: E[500],

  feedbackSuccess: S[400],
  feedbackSuccessBg: S[950],
  feedbackWarning: W[400],
  feedbackWarningBg: W[950],
  feedbackError: E[500],
  feedbackErrorBg: E[950],
  feedbackInfo: P[400],
  feedbackInfoBg: P[950],

  navBackground: Z[900],
  navBorder: Z[800],
  navActive: P[400],
  navInactive: Z[500],
  navIndicator: P[400],

  pullIndicator: Z[600],
} as const;

/** Prefer semantic names (`surfaceBackground`, `interactivePrimary`, …). Legacy keys kept for registry. */
export const lightColors = {
  ...lightSemanticColors,
  bg: lightSemanticColors.surfaceBackground,
  surface: lightSemanticColors.surfaceElevated,
  surfaceRaised: lightSemanticColors.surfaceInput,
  surfaceStrong: G[200],
  border: lightSemanticColors.borderSecondary,
  borderStrong: lightSemanticColors.borderPrimary,
  accent: lightSemanticColors.interactivePrimary,
  accentAlt: P[500],
  success: lightSemanticColors.feedbackSuccess,
  warning: lightSemanticColors.feedbackWarning,
  danger: lightSemanticColors.feedbackError,
} as const;

export const darkColors = {
  ...darkSemanticColors,
  bg: darkSemanticColors.surfaceBackground,
  surface: darkSemanticColors.surfaceElevated,
  surfaceRaised: darkSemanticColors.surfaceInput,
  surfaceStrong: Z[800],
  border: darkSemanticColors.borderSecondary,
  borderStrong: darkSemanticColors.borderPrimary,
  accent: darkSemanticColors.interactivePrimary,
  accentAlt: P[400],
  success: darkSemanticColors.feedbackSuccess,
  warning: darkSemanticColors.feedbackWarning,
  danger: darkSemanticColors.feedbackError,
} as const;

export const palette = paletteMain;

export type SemanticColorTokens = typeof lightSemanticColors;
export type ColorTokens = typeof lightColors;
export type ColorTokenName = keyof ColorTokens;

export { alphaRamp, paletteSecondary } from './paletteSecondary';
export { paletteMain } from './paletteMain';
export { rgbaFromHex } from './colorUtils';
