/**
 * This file is a registry SOURCE template. It is copied verbatim into the
 * consumer's project at `<alias>/tokens.ts` when they run `arloui init`. From
 * that point on, the consumer owns it and can customize freely — exactly like
 * shadcn/ui's `globals.css`.
 *
 * Keep this file dependency-free so it works in any RN project (Expo or bare).
 */

export const lightSemanticColors = {
  surfaceBackground: '#F9FAFB',
  surfaceInput: '#F3F4F6',
  surfaceElevated: '#FFFFFF',
  surfaceOverlay: 'rgba(16,24,40,0.4)',
  surfaceInverse: '#101828',
  textPrimary: '#101828',
  textSecondary: '#4A5565',
  textTertiary: '#99A1AF',
  textDisabled: 'rgba(16,24,40,0.05)',
  textInverse: '#FFFFFF',
  textPlaceholder: '#D1D5DC',
  textInteractivePrimary: '#FFFFFF',
  textInteractiveSecondary: '#364153',
  textInteractiveTertiary: '#155DFC',
  textInteractiveError: '#E7000B',
  interactivePrimary: '#155DFC',
  interactivePrimaryPressed: '#1447E6',
  interactiveSecondary: '#F3F4F6',
  interactiveSecondaryPressed: '#E5E7EB',
  interactiveTertiary: 'transparent',
  interactiveTertiaryPressed: 'rgba(243,244,246,0.4)',
  interactiveDisabled: '#F3F4F6',
  interactiveError: '#FB2C36',
  focusRingMain: '#51A2FF',
  focusRingError: '#FFA2A2',
  touchFeedbackMain: 'rgba(16,24,40,0.1)',
  touchFeedbackLight: 'rgba(243,244,246,0.4)',
  borderPrimary: '#D1D5DC',
  borderSecondary: '#E5E7EB',
  borderFocus: '#2B7FFF',
  borderError: '#FB2C36',
  feedbackSuccess: '#00C950',
  feedbackSuccessBg: '#F0FDF4',
  feedbackWarning: '#E17100',
  feedbackWarningBg: '#FFFBEB',
  feedbackError: '#FB2C36',
  feedbackErrorBg: '#FEF2F2',
  feedbackInfo: '#2B7FFF',
  feedbackInfoBg: '#EFF6FF',
  navBackground: '#FFFFFF',
  navBorder: '#E5E7EB',
  navActive: '#2B7FFF',
  navInactive: '#99A1AF',
  navIndicator: '#2B7FFF',
  pullIndicator: '#D1D5DC',
} as const;

export const darkSemanticColors = {
  surfaceBackground: '#09090B',
  surfaceInput: '#1E2939',
  surfaceElevated: '#101828',
  surfaceOverlay: 'rgba(16,24,40,0.7)',
  surfaceInverse: '#F9FAFB',
  textPrimary: '#F9FAFB',
  textSecondary: '#99A1AF',
  textTertiary: '#6A7282',
  textDisabled: 'rgba(249,250,251,0.12)',
  textInverse: '#101828',
  textPlaceholder: '#4A5565',
  textInteractivePrimary: '#FFFFFF',
  textInteractiveSecondary: '#E5E7EB',
  textInteractiveTertiary: '#51A2FF',
  textInteractiveError: '#FF6467',
  interactivePrimary: '#2B7FFF',
  interactivePrimaryPressed: '#155DFC',
  interactiveSecondary: '#1E2939',
  interactiveSecondaryPressed: '#364153',
  interactiveTertiary: 'transparent',
  interactiveTertiaryPressed: 'rgba(30,41,57,0.55)',
  interactiveDisabled: '#1E2939',
  interactiveError: '#FB2C36',
  focusRingMain: '#51A2FF',
  focusRingError: '#FF6467',
  touchFeedbackMain: 'rgba(249,250,251,0.08)',
  touchFeedbackLight: 'rgba(30,41,57,0.5)',
  borderPrimary: '#364153',
  borderSecondary: '#1E2939',
  borderFocus: '#51A2FF',
  borderError: '#FB2C36',
  feedbackSuccess: '#05DF72',
  feedbackSuccessBg: '#032E15',
  feedbackWarning: '#FFB900',
  feedbackWarningBg: '#461901',
  feedbackError: '#FB2C36',
  feedbackErrorBg: '#460809',
  feedbackInfo: '#51A2FF',
  feedbackInfoBg: '#09090B',
  navBackground: '#101828',
  navBorder: '#1E2939',
  navActive: '#51A2FF',
  navInactive: '#6A7282',
  navIndicator: '#51A2FF',
  pullIndicator: '#4A5565',
} as const;

export const lightColors = {
  ...lightSemanticColors,
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceRaised: '#F3F4F6',
  surfaceStrong: '#E5E7EB',
  border: '#E5E7EB',
  borderStrong: '#D1D5DC',
  accent: '#155DFC',
  accentAlt: '#2B7FFF',
  success: '#00C950',
  warning: '#E17100',
  danger: '#FB2C36',
} as const;

export const darkColors = {
  ...darkSemanticColors,
  bg: '#09090B',
  surface: '#101828',
  surfaceRaised: '#1E2939',
  surfaceStrong: '#1E2939',
  border: '#1E2939',
  borderStrong: '#364153',
  accent: '#2B7FFF',
  accentAlt: '#51A2FF',
  success: '#05DF72',
  warning: '#FFB900',
  danger: '#FB2C36',
} as const;

export const fontFamilies = {
  sans: 'Space Grotesk',
  mono: 'Space Mono',
  display: 'Doto',
} as const;

export const typography = {
  displayXl: { fontSize: 40, lineHeight: 44, fontWeight: '600' as const },
  displayLg: { fontSize: 32, lineHeight: 36, fontWeight: '600' as const },
  title1: { fontSize: 24, lineHeight: 30, fontWeight: '600' as const },
  title2: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  title3: { fontSize: 17, lineHeight: 22, fontWeight: '500' as const },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' as const },
  bodySm: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const, letterSpacing: 0.66 },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radii = { none: 0, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, full: 9999 } as const;

export const sizing = {
  icon: { xs: 16, sm: 20, md: 24, lg: 32 },
  avatar: { xs: 16, sm: 24, md: 32, lg: 40 },
  buttonHeight: { sm: 36, md: 40, lg: 48, xl: 52 },
} as const;

export const motion = {
  duration: { press: 140, state: 200, sheet: 280 },
  easing: { easeOut: [0.16, 1, 0.3, 1] as const },
  pressed: { scale: 0.98, opacity: 0.92 },
} as const;

/** Grey-900 tint shadows — mirrors `@arloui/tokens` shadow scale (RN shadow props). */
export const shadows = {
  none: {
    shadowColor: '#101828',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  sm: {
    shadowColor: '#101828',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  md: {
    shadowColor: '#101828',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#101828',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  xl: {
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
} as const;

/** CSS box-shadow strings for `:focus-visible` on web — RN consumers use borders if needed. */
export const focusRing = {
  light: {
    main: `0 0 0 2px ${lightSemanticColors.surfaceBackground}, 0 0 0 4px ${lightSemanticColors.focusRingMain}`,
    error: `0 0 0 2px ${lightSemanticColors.surfaceBackground}, 0 0 0 4px ${lightSemanticColors.focusRingError}`,
  },
  dark: {
    main: `0 0 0 2px ${darkSemanticColors.surfaceBackground}, 0 0 0 4px ${darkSemanticColors.focusRingMain}`,
    error: `0 0 0 2px ${darkSemanticColors.surfaceBackground}, 0 0 0 4px ${darkSemanticColors.focusRingError}`,
  },
} as const;

export const themes = {
  dark: {
    name: 'dark' as const,
    colors: darkColors,
    fontFamilies,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    focusRing: focusRing.dark,
  },
  light: {
    name: 'light' as const,
    colors: lightColors,
    fontFamilies,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    focusRing: focusRing.light,
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];
