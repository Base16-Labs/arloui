/**
 * Semantic color tokens from Figma **Utility / semantic** table + legacy flat aliases
 * for existing registry components (`bg`, `surface`, `accent`, …).
 *
 * Light mode maps follow the “Color (light)” column (Grey-n / Primary-n / …).
 * Dark mode inverts surfaces and text using the same Main palette scales.
 */
import { rgbaFromHex } from './colorUtils';
import { base, error, grey, paletteMain, primary, success, warning } from './paletteMain';
import { alphaRamp } from './paletteSecondary';

const G = grey;
const P = primary;
const S = success;
const W = warning;
const E = error;

/** Light — Figma utility tokens (camelCase). */
export const lightSemanticColors = {
  surfaceBackground: G[50],
  surfaceInput: G[100],
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
  interactiveSecondary: G[100],
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

/** Dark — same token names; values derived from Main palette (no separate Figma table yet). */
export const darkSemanticColors = {
  surfaceBackground: G[950],
  surfaceInput: G[900],
  surfaceElevated: G[800],
  surfaceOverlay: alphaRamp.black[70],
  surfaceInverse: G[50],

  textPrimary: G[50],
  textSecondary: G[400],
  textTertiary: G[500],
  textDisabled: rgbaFromHex(G[50], 0.38),
  textInverse: G[900],
  textPlaceholder: G[600],
  textInteractivePrimary: base.white,
  textInteractiveSecondary: G[200],
  textInteractiveTertiary: P[400],
  textInteractiveError: E[400],

  interactivePrimary: P[500],
  interactivePrimaryPressed: P[600],
  interactiveSecondary: G[800],
  interactiveSecondaryPressed: G[700],
  interactiveTertiary: 'transparent',
  interactiveTertiaryPressed: rgbaFromHex(G[800], 0.55),
  interactiveDisabled: G[800],
  interactiveError: E[500],

  focusRingMain: P[400],
  focusRingError: E[400],

  touchFeedbackMain: rgbaFromHex(G[50], 0.08),
  touchFeedbackLight: rgbaFromHex(G[800], 0.5),

  borderPrimary: G[700],
  borderSecondary: G[800],
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

  navBackground: G[900],
  navBorder: G[800],
  navActive: P[400],
  navInactive: G[500],
  navIndicator: P[400],

  pullIndicator: G[600],
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
  surfaceStrong: G[800],
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
