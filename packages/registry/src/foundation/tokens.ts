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
  // Card fill — a step greyer than the background and the (white) elevated surface,
  // so a resting card reads as its own plane without a shadow. Grey-100.
  surfaceCard: '#F3F4F6',
  surfaceInput: '#F3F4F6',
  surfaceInputActive: '#E5E7EB',
  surfaceElevated: '#FFFFFF',
  // Translucent fill that lets a coloured background or image bleed through — a
  // subtle frost (the app background at 50%), not the heavy blur of a tab bar.
  surfaceBleed: 'rgba(249,250,251,0.5)',
  surfaceOverlay: 'rgba(16,24,40,0.4)',
  surfaceInverse: '#101828',
  textPrimary: '#101828',
  textSecondary: '#4A5565',
  textTertiary: '#99A1AF',
  textDisabled: 'rgba(16,24,40,0.35)',
  textInverse: '#FFFFFF',
  textPlaceholder: '#D1D5DC',
  textInteractivePrimary: '#FFFFFF',
  textInteractiveSecondary: '#364153',
  textInteractiveTertiary: '#155DFC',
  textInteractiveError: '#E7000B',
  interactivePrimary: '#155DFC',
  interactivePrimaryPressed: '#1447E6',
  interactiveSecondary: 'rgba(229,231,235,0.7)',
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
  /**
   * Direction tones for charts — Success-700 / Error-600, not the feedback pair.
   * Success-500 vs Error-500 measures ΔE 7.6 under deuteranopia and puts the green
   * at 2.16:1 on a light surface; these clear ΔE 9.2 and 3:1. Always pair with a
   * signed value (+/−) so direction is never color-alone.
   */
  chartPositive: '#008236',
  chartNegative: '#E7000B',
  /**
   * Categorical series colours for part-to-whole and multi-category charts.
   *
   * Four slots, not more: this is the largest set that clears the data-viz checks
   * on EVERY pair (not just neighbours) in BOTH modes, which is the honest bar for
   * a donut where all slices are on screen at once. Light is worst-pair ΔE 8.7 and
   * dark ΔE 9.0 under deuteranopia, all above 3:1 on their own surface. A fifth
   * hue only clears in light, so there isn't one.
   *
   * Assign in this fixed order and never cycle. Anything past the fourth category
   * folds into `chartOther`, and charts using these always carry a legend or direct
   * labels so identity is never colour alone.
   */
  chartSeries1: '#155DFC',
  chartSeries2: '#65A30D',
  chartSeries3: '#BE185D',
  chartSeries4: '#A16207',
  chartOther: '#6A7282',
  navBackground: '#FFFFFF',
  navBorder: '#E5E7EB',
  navActive: '#2B7FFF',
  navInactive: '#99A1AF',
  navIndicator: '#2B7FFF',
  pullIndicator: '#D1D5DC',
} as const;

export const darkSemanticColors = {
  surfaceBackground: '#09090B',
  // Card fill — sits between the background and the elevated surface.
  surfaceCard: '#18181B',
  surfaceInput: '#18181B',
  surfaceInputActive: '#27272A',
  surfaceElevated: '#27272A',
  // Translucent fill — the app background at 50%, a subtle frost over colour.
  surfaceBleed: 'rgba(9,9,11,0.5)',
  surfaceOverlay: 'rgba(16,24,40,0.7)',
  surfaceInverse: '#FAFAFA',
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textDisabled: 'rgba(250,250,250,0.38)',
  textInverse: '#18181B',
  textPlaceholder: '#52525B',
  textInteractivePrimary: '#FFFFFF',
  textInteractiveSecondary: '#E4E4E7',
  textInteractiveTertiary: '#51A2FF',
  textInteractiveError: '#FF6467',
  interactivePrimary: '#2B7FFF',
  interactivePrimaryPressed: '#155DFC',
  interactiveSecondary: '#27272A',
  interactiveSecondaryPressed: '#3F3F46',
  interactiveTertiary: 'transparent',
  interactiveTertiaryPressed: 'rgba(39,39,42,0.55)',
  interactiveDisabled: '#27272A',
  interactiveError: '#FB2C36',
  focusRingMain: '#51A2FF',
  focusRingError: '#FF6467',
  touchFeedbackMain: 'rgba(250,250,250,0.08)',
  touchFeedbackLight: 'rgba(39,39,42,0.5)',
  borderPrimary: '#3F3F46',
  borderSecondary: '#27272A',
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
  /**
   * Dark keeps the brighter Success-400: against Error-500 on a dark surface it
   * separates by ΔE 14.0 under deuteranopia — the widest of any pair tested — and
   * both poles clear 3:1.
   */
  chartPositive: '#05DF72',
  chartNegative: '#FB2C36',
  /** Dark keeps slots 1, 2 and 4; only the pink lightens for the darker surface. */
  chartSeries1: '#155DFC',
  chartSeries2: '#65A30D',
  chartSeries3: '#EC4899',
  chartSeries4: '#A16207',
  chartOther: '#A1A1AA',
  navBackground: '#18181B',
  navBorder: '#27272A',
  navActive: '#51A2FF',
  navInactive: '#71717A',
  navIndicator: '#51A2FF',
  pullIndicator: '#52525B',
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
  surface: '#18181B',
  surfaceRaised: '#27272A',
  surfaceStrong: '#27272A',
  border: '#27272A',
  borderStrong: '#3F3F46',
  accent: '#2B7FFF',
  accentAlt: '#51A2FF',
  success: '#05DF72',
  warning: '#FFB900',
  danger: '#FB2C36',
} as const;

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
    fontWeight: '400' as const,
    letterSpacing: -0.68,
  },
  displayLargeEmphasized: {
    fontSize: 34,
    lineHeight: 42.5,
    fontWeight: '600' as const,
    letterSpacing: -0.68,
  },
  displayMedium: { fontSize: 28, lineHeight: 35, fontWeight: '400' as const, letterSpacing: -0.56 },
  displayMediumEmphasized: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '600' as const,
    letterSpacing: -0.56,
  },
  displaySmall: { fontSize: 24, lineHeight: 30, fontWeight: '400' as const, letterSpacing: -0.48 },
  displaySmallEmphasized: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600' as const,
    letterSpacing: -0.48,
  },
  headingLarge: { fontSize: 20, lineHeight: 26, fontWeight: '400' as const, letterSpacing: -0.2 },
  headingLargeEmphasized: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  headingMedium: {
    fontSize: 17,
    lineHeight: 22.1,
    fontWeight: '400' as const,
    letterSpacing: -0.17,
  },
  headingMediumEmphasized: {
    fontSize: 17,
    lineHeight: 22.1,
    fontWeight: '600' as const,
    letterSpacing: -0.17,
  },
  headingSmall: {
    fontSize: 14,
    lineHeight: 18.2,
    fontWeight: '400' as const,
    letterSpacing: -0.14,
  },
  headingSmallEmphasized: {
    fontSize: 14,
    lineHeight: 18.2,
    fontWeight: '600' as const,
    letterSpacing: -0.14,
  },
  bodyLarge: { fontSize: 17, lineHeight: 23.8, fontWeight: '400' as const, letterSpacing: 0 },
  bodyMedium: { fontSize: 14, lineHeight: 19.6, fontWeight: '400' as const, letterSpacing: 0 },
  bodySmall: { fontSize: 12, lineHeight: 16.8, fontWeight: '400' as const, letterSpacing: 0 },
  labelLarge: { fontSize: 14, lineHeight: 16.8, fontWeight: '400' as const, letterSpacing: 0 },
  labelMedium: { fontSize: 12, lineHeight: 14.4, fontWeight: '400' as const, letterSpacing: 0 },
  labelSmall: { fontSize: 11, lineHeight: 13.2, fontWeight: '400' as const, letterSpacing: 0 },
  overline: {
    fontSize: 11,
    lineHeight: 13.2,
    fontWeight: '600' as const,
    letterSpacing: 1.1,
  },
  buttonLarge: { fontSize: 20, lineHeight: 22, fontWeight: '600' as const, letterSpacing: 0 },
  buttonMedium: { fontSize: 17, lineHeight: 18.7, fontWeight: '600' as const, letterSpacing: 0 },
  buttonSmall: { fontSize: 14, lineHeight: 15.4, fontWeight: '600' as const, letterSpacing: 0 },
  buttonLabel: { fontSize: 12, lineHeight: 13.2, fontWeight: '600' as const, letterSpacing: 0 },
  displayXl: { fontSize: 34, lineHeight: 42.5, fontWeight: '600' as const, letterSpacing: -0.68 },
  displayLg: { fontSize: 28, lineHeight: 35, fontWeight: '600' as const, letterSpacing: -0.56 },
  title1: { fontSize: 24, lineHeight: 30, fontWeight: '600' as const, letterSpacing: -0.48 },
  title2: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const, letterSpacing: -0.2 },
  title3: { fontSize: 17, lineHeight: 22.1, fontWeight: '500' as const, letterSpacing: -0.17 },
  body: { fontSize: 14, lineHeight: 19.6, fontWeight: '400' as const, letterSpacing: 0 },
  bodySm: { fontSize: 12, lineHeight: 16.8, fontWeight: '400' as const, letterSpacing: 0 },
  label: { fontSize: 11, lineHeight: 13.2, fontWeight: '500' as const, letterSpacing: 0 },
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
  buttonHeight: { sm: 32, md: 40, lg: 48, xl: 52 },
  touchTarget: { minimum: 44, comfortable: 48 },
} as const;

/**
 * Motion is spatial information, not decoration. Curves and durations are the tokens.
 * Default ease is `easeOut`; never use `ease-in` for UI. Springs are for gesture-driven
 * or playful elements. Never animate from `scale(0)`.
 */
export const motion = {
  easing: {
    easeOut: [0.23, 1, 0.32, 1] as const, // entrances, exits, pressable return
    easeInOut: [0.77, 0, 0.175, 1] as const, // moving or morphing in place
    easeSheet: [0.32, 0.72, 0, 1] as const, // sheet and drawer gestures
  },
  duration: {
    instant: 130, // 100–160 — press feedback, micro-interactions
    fast: 200, // 180–220 — tooltips, small popovers, toggles
    base: 280, // 220–320 — sheets, drawers, modals, content swaps
    slow: 400, // 320–480 — shared-element transitions, complex morphs
  },
  spring: {
    snappy: { stiffness: 400, damping: 30, mass: 1 }, // pressable snap-back, toggle bounce
    gentle: { stiffness: 150, damping: 20, mass: 1 }, // sheet settle, card reposition
    heavy: { stiffness: 300, damping: 40, mass: 1.2 }, // drag-to-dismiss commit, large surface
  },
  pressed: { scale: 0.97, opacity: 0.85 },
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

export const darkShadows = {
  none: {
    shadowColor: '#51A2FF',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  sm: {
    shadowColor: '#51A2FF',
    shadowOpacity: 0.18,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  md: {
    shadowColor: '#51A2FF',
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#51A2FF',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  xl: {
    shadowColor: '#51A2FF',
    shadowOpacity: 0.34,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
} as const;

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

/**
 * Translucent surface fallbacks for glass-like navigation and controls.
 * A platform-native Liquid Glass treatment can replace the surface on supported
 * iOS versions without changing the surrounding component contract.
 *
 * Dark overlays run on Zinc-900 `#18181B`, matching the dark surface swap. They
 * were left on Grey-900 `#101828`, whose blue tint reads as navy the moment the
 * material sits over anything that isn't already dark — a glass nav bar drifting
 * across coloured content picked up a visible cast. Zinc is hue-neutral, so the
 * material now only darkens what passes underneath.
 *
 * ## `tintOpacity` · `tintOpacityPressed`
 *
 * How much of a component's own colour survives the material. Untinted glass is
 * colourless by construction, so a glass primary button would read as "some
 * translucent thing with blue text" rather than as the primary button — the tone
 * has to come through the surface, not just the label. These two alphas are what
 * carries it, and they are deliberately one pair per material rather than per
 * component so a tinted button, tab bar, and card agree about how strongly a
 * tint reads.
 *
 * The alpha falls as the material gets heavier because a heavier material is
 * already doing more of the hiding: `glassSmall` is thin enough that the tint has
 * to carry the identity on its own, while `glassLarge` is most of the way to
 * opaque before the tint is applied at all.
 *
 * `tintOpacityPressed` is the whole press response for a tinted glass surface —
 * the colour deepens instead of a grey wash landing on top, which is the one
 * press treatment that does not stop the surface reading as glass.
 */
export const materials = {
  glassSmall: {
    blur: blurs.sm,
    lightOverlay: 'rgba(255,255,255,0.64)',
    darkOverlay: 'rgba(24,24,27,0.64)',
    lightBorder: 'rgba(255,255,255,0.56)',
    darkBorder: 'rgba(255,255,255,0.12)',
    tintOpacity: 0.55,
    tintOpacityPressed: 0.72,
  },
  glassMedium: {
    blur: blurs.lg,
    lightOverlay: 'rgba(255,255,255,0.72)',
    darkOverlay: 'rgba(24,24,27,0.72)',
    lightBorder: 'rgba(255,255,255,0.64)',
    darkBorder: 'rgba(255,255,255,0.14)',
    tintOpacity: 0.45,
    tintOpacityPressed: 0.6,
  },
  glassLarge: {
    blur: blurs.xl,
    lightOverlay: 'rgba(255,255,255,0.82)',
    darkOverlay: 'rgba(24,24,27,0.82)',
    lightBorder: 'rgba(255,255,255,0.72)',
    darkBorder: 'rgba(255,255,255,0.16)',
    tintOpacity: 0.38,
    tintOpacityPressed: 0.5,
  },
  /** @deprecated Prefer `glassSmall`. */
  glassThin: {
    blur: blurs.sm,
    lightOverlay: 'rgba(255,255,255,0.64)',
    darkOverlay: 'rgba(24,24,27,0.64)',
    lightBorder: 'rgba(255,255,255,0.56)',
    darkBorder: 'rgba(255,255,255,0.12)',
    tintOpacity: 0.55,
    tintOpacityPressed: 0.72,
  },
  /** @deprecated Prefer `glassMedium`. */
  glassRegular: {
    blur: blurs.lg,
    lightOverlay: 'rgba(255,255,255,0.72)',
    darkOverlay: 'rgba(24,24,27,0.72)',
    lightBorder: 'rgba(255,255,255,0.64)',
    darkBorder: 'rgba(255,255,255,0.14)',
    tintOpacity: 0.45,
    tintOpacityPressed: 0.6,
  },
  /** @deprecated Prefer `glassLarge`. */
  glassThick: {
    blur: blurs.xl,
    lightOverlay: 'rgba(255,255,255,0.82)',
    darkOverlay: 'rgba(24,24,27,0.82)',
    lightBorder: 'rgba(255,255,255,0.72)',
    darkBorder: 'rgba(255,255,255,0.16)',
    tintOpacity: 0.38,
    tintOpacityPressed: 0.5,
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
    fontWeights,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows: darkShadows,
    blur,
    blurs,
    materials,
    focusRing: focusRing.dark,
  },
  light: {
    name: 'light' as const,
    colors: lightColors,
    fontFamilies,
    fontWeights,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    blur,
    blurs,
    materials,
    focusRing: focusRing.light,
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];
