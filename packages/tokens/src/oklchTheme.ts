import {
  compositeRgb,
  contrastRatio,
  createRuntimeRamp,
  formatOklch,
  oklchToRgba,
  parseRuntimeColor,
  rgbToOklch,
  shadeSteps,
  type ChromaRampSpec,
  type OklchColor,
  type OklchRampSpec,
  type RgbColor,
  type RuntimeRamp,
  type Shade,
} from './oklch';

export type RampName =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'lime'
  | 'pink'
  | 'yellow'
  | 'cyan';

export type ColorRef = {
  ramp: RampName;
  shade: Shade;
  alpha?: number;
};

export type StaticColorRef = {
  value: string;
};

export type ConditionalColorRef = {
  mode: 'contrast';
  background: string;
  candidates: readonly (ColorRef | StaticColorRef)[];
  target?: number;
};

export type SemanticRef = ColorRef | StaticColorRef | ConditionalColorRef;

export type SemanticRecipe = Readonly<Record<string, SemanticRef>>;

export type GeneratedSemanticColor = {
  value: string;
  source: SemanticRef;
  resolvedSource?: ColorRef | StaticColorRef;
  oklch?: string;
};

export type GeneratedSemanticColors = Record<string, GeneratedSemanticColor>;

export type ContrastAudit = {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  target: number;
  pass: boolean;
};

export type SurfaceAudit = {
  name: string;
  lightFirst?: string;
  lightSecond?: string;
  darkFirst?: string;
  darkSecond?: string;
  first?: string;
  second?: string;
  deltaL?: number;
  lightDeltaL?: number;
  darkDeltaL?: number;
  minDeltaL: number;
  maxDeltaL: number;
  ratio?: number;
  minRatio?: number;
  maxRatio?: number;
  pass: boolean;
};

export type GamutAudit = {
  ramp: RampName;
  shade: Shade;
  source: string;
  runtimeSource: string;
  runtime: string;
  chromaLoss: number;
  clipped: boolean;
  pass: boolean;
};

export type ChartAudit = {
  name: string;
  first: string;
  second: string;
  deltaE?: number;
  simulatedDeltaE?: number;
  contrast?: number;
  target: number;
  pass: boolean;
};

export type GeneratedOklchTheme = {
  ramps: Record<RampName, RuntimeRamp>;
  semantic: {
    light: GeneratedSemanticColors;
    dark: GeneratedSemanticColors;
  };
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  audits: {
    contrast: ContrastAudit[];
    surfaces: SurfaceAudit[];
    gamut: GamutAudit[];
    charts: ChartAudit[];
    pass: boolean;
  };
};

export type OklchThemeOptions = {
  recipe?: Record<'light' | 'dark', SemanticRecipe>;
};

const neutralLightness = {
  50: 0.985,
  100: 0.965,
  200: 0.925,
  300: 0.865,
  400: 0.72,
  500: 0.58,
  600: 0.49,
  700: 0.36,
  800: 0.27,
  900: 0.195,
  950: 0.14,
} as const satisfies Record<Shade, number>;

const blueLightness = {
  50: 0.98,
  100: 0.955,
  200: 0.91,
  300: 0.84,
  400: 0.72,
  500: 0.6,
  600: 0.5,
  700: 0.42,
  800: 0.34,
  900: 0.25,
  950: 0.15,
} as const satisfies Record<Shade, number>;

const greenLightness = {
  50: 0.98,
  100: 0.955,
  200: 0.91,
  300: 0.85,
  400: 0.74,
  500: 0.63,
  600: 0.52,
  700: 0.43,
  800: 0.34,
  900: 0.25,
  950: 0.15,
} as const satisfies Record<Shade, number>;

const yellowLightness = {
  50: 0.975,
  100: 0.96,
  200: 0.92,
  300: 0.86,
  400: 0.76,
  500: 0.66,
  600: 0.55,
  700: 0.45,
  800: 0.35,
  900: 0.26,
  950: 0.16,
} as const satisfies Record<Shade, number>;

const redLightness = {
  50: 0.98,
  100: 0.95,
  200: 0.9,
  300: 0.82,
  400: 0.7,
  500: 0.59,
  600: 0.5,
  700: 0.42,
  800: 0.34,
  900: 0.25,
  950: 0.15,
} as const satisfies Record<Shade, number>;

const cyanLightness = {
  50: 0.985,
  100: 0.96,
  200: 0.92,
  300: 0.86,
  400: 0.75,
  500: 0.64,
  600: 0.53,
  700: 0.44,
  800: 0.35,
  900: 0.26,
  950: 0.16,
} as const satisfies Record<Shade, number>;

const neutralChroma = {
  50: 0,
  100: 0,
  200: 0,
  300: 0,
  400: 0,
  500: 0,
  600: 0,
  700: 0,
  800: 0,
  900: 0,
  950: 0,
} as const satisfies Record<Shade, number>;

const blueChroma = relativeChroma({
  50: 0.1,
  100: 0.18,
  200: 0.32,
  300: 0.5,
  400: 0.66,
  500: 0.76,
  600: 0.78,
  700: 0.72,
  800: 0.56,
  900: 0.38,
  950: 0.22,
}, { 50: 0.014, 100: 0.032, 200: 0.059 });

const greenChroma = relativeChroma({
  50: 0.13,
  100: 0.24,
  200: 0.4,
  300: 0.6,
  400: 0.75,
  500: 0.8,
  600: 0.7,
  700: 0.56,
  800: 0.4,
  900: 0.28,
  950: 0.18,
}, { 50: 0.018, 100: 0.035, 200: 0.06 });

const yellowChroma = relativeChroma({
  50: 0.12,
  100: 0.24,
  200: 0.42,
  300: 0.62,
  400: 0.76,
  500: 0.72,
  600: 0.58,
  700: 0.44,
  800: 0.32,
  900: 0.22,
  950: 0.14,
}, { 50: 0.018, 100: 0.038, 200: 0.068 });

const redChroma = relativeChroma({
  50: 0.1,
  100: 0.2,
  200: 0.36,
  300: 0.54,
  400: 0.72,
  500: 0.84,
  600: 0.8,
  700: 0.68,
  800: 0.5,
  900: 0.32,
  950: 0.2,
}, { 50: 0.014, 100: 0.034, 200: 0.064 });

const pinkChroma = relativeChroma({
  50: 0.11,
  100: 0.22,
  200: 0.38,
  300: 0.56,
  400: 0.72,
  500: 0.84,
  600: 0.78,
  700: 0.66,
  800: 0.5,
  900: 0.34,
  950: 0.2,
}, { 50: 0.016, 100: 0.036, 200: 0.066 });

const cyanChroma = relativeChroma({
  50: 0.13,
  100: 0.24,
  200: 0.42,
  300: 0.62,
  400: 0.76,
  500: 0.78,
  600: 0.66,
  700: 0.52,
  800: 0.38,
  900: 0.26,
  950: 0.16,
}, { 50: 0.016, 100: 0.034, 200: 0.062 });

export const arloOklchRampSpecs = {
  neutral: {
    name: 'neutral',
    hue: 0,
    lightness: neutralLightness,
    chroma: neutralChroma,
  },
  accent: {
    name: 'accent',
    hue: 260,
    lightness: blueLightness,
    chroma: blueChroma,
  },
  success: {
    name: 'success',
    hue: 150,
    lightness: greenLightness,
    chroma: greenChroma,
  },
  warning: {
    name: 'warning',
    hue: 45,
    lightness: yellowLightness,
    chroma: yellowChroma,
  },
  error: {
    name: 'error',
    hue: 26,
    lightness: redLightness,
    chroma: redChroma,
  },
  lime: {
    name: 'lime',
    hue: 128,
    lightness: greenLightness,
    chroma: greenChroma,
  },
  pink: {
    name: 'pink',
    hue: 355,
    lightness: redLightness,
    chroma: pinkChroma,
  },
  yellow: {
    name: 'yellow',
    hue: 92,
    lightness: yellowLightness,
    chroma: yellowChroma,
  },
  cyan: {
    name: 'cyan',
    hue: 210,
    lightness: cyanLightness,
    chroma: cyanChroma,
  },
} as const satisfies Record<RampName, OklchRampSpec>;

export const arloOklchThemeRecipe = {
  light: {
    surfaceBackground: { ramp: 'neutral', shade: 50 },
    surfaceCard: { ramp: 'neutral', shade: 100 },
    surfaceInput: { ramp: 'neutral', shade: 100 },
    surfaceInputActive: { ramp: 'neutral', shade: 200 },
    surfaceElevated: { value: '#FFFFFF' },
    surfaceBleed: { ramp: 'neutral', shade: 50, alpha: 0.5 },
    surfaceOverlay: { ramp: 'neutral', shade: 900, alpha: 0.4 },
    surfaceInverse: { ramp: 'neutral', shade: 900 },
    textPrimary: { ramp: 'neutral', shade: 900 },
    textSecondary: { ramp: 'neutral', shade: 600 },
    textTertiary: { ramp: 'neutral', shade: 400 },
    textDisabled: { ramp: 'neutral', shade: 900, alpha: 0.35 },
    textInverse: {
      mode: 'contrast',
      background: 'surfaceInverse',
      candidates: [
        { ramp: 'neutral', shade: 50 },
        { ramp: 'neutral', shade: 950 },
      ],
    },
    textPlaceholder: { ramp: 'neutral', shade: 300 },
    textInteractivePrimary: {
      mode: 'contrast',
      background: 'interactivePrimary',
      candidates: [
        { ramp: 'neutral', shade: 50 },
        { ramp: 'neutral', shade: 950 },
      ],
    },
    textInteractiveSecondary: { ramp: 'neutral', shade: 700 },
    textInteractiveTertiary: { ramp: 'accent', shade: 600 },
    textInteractiveError: { ramp: 'error', shade: 600 },
    interactivePrimary: { ramp: 'accent', shade: 600 },
    interactivePrimaryPressed: { ramp: 'accent', shade: 700 },
    interactiveSecondary: { ramp: 'neutral', shade: 200, alpha: 0.7 },
    interactiveSecondaryPressed: { ramp: 'neutral', shade: 200 },
    interactiveTertiary: { value: 'transparent' },
    interactiveTertiaryPressed: { ramp: 'neutral', shade: 200, alpha: 0.4 },
    interactiveDisabled: { ramp: 'neutral', shade: 100 },
    interactiveError: { ramp: 'error', shade: 500 },
    focusRingMain: { ramp: 'accent', shade: 400 },
    focusRingError: { ramp: 'error', shade: 300 },
    touchFeedbackMain: { ramp: 'neutral', shade: 900, alpha: 0.1 },
    touchFeedbackLight: { ramp: 'neutral', shade: 200, alpha: 0.4 },
    borderPrimary: { ramp: 'neutral', shade: 300 },
    borderSecondary: { ramp: 'neutral', shade: 200 },
    borderFocus: { ramp: 'accent', shade: 500 },
    borderError: { ramp: 'error', shade: 500 },
    feedbackSuccess: { ramp: 'success', shade: 500 },
    feedbackSuccessBg: { ramp: 'success', shade: 50 },
    feedbackWarning: { ramp: 'warning', shade: 500 },
    feedbackWarningBg: { ramp: 'warning', shade: 50 },
    feedbackError: { ramp: 'error', shade: 500 },
    feedbackErrorBg: { ramp: 'error', shade: 50 },
    feedbackInfo: { ramp: 'accent', shade: 500 },
    feedbackInfoBg: { ramp: 'accent', shade: 50 },
    chartPositive: { ramp: 'success', shade: 700 },
    chartNegative: { ramp: 'error', shade: 600 },
    chartSeries1: { ramp: 'lime', shade: 500 },
    chartSeries2: { ramp: 'pink', shade: 700 },
    chartSeries3: { ramp: 'yellow', shade: 600 },
    chartSeries4: { ramp: 'cyan', shade: 600 },
    chartOther: { ramp: 'neutral', shade: 500 },
    navBackground: { value: '#FFFFFF' },
    navBorder: { ramp: 'neutral', shade: 200 },
    navActive: { ramp: 'accent', shade: 500 },
    navInactive: { ramp: 'neutral', shade: 400 },
    navIndicator: { ramp: 'accent', shade: 500 },
    pullIndicator: { ramp: 'neutral', shade: 300 },
  },
  dark: {
    surfaceBackground: { ramp: 'neutral', shade: 950 },
    surfaceCard: { ramp: 'neutral', shade: 900 },
    surfaceInput: { ramp: 'neutral', shade: 900 },
    surfaceInputActive: { ramp: 'neutral', shade: 800 },
    surfaceElevated: { ramp: 'neutral', shade: 800 },
    surfaceBleed: { ramp: 'neutral', shade: 950, alpha: 0.5 },
    surfaceOverlay: { ramp: 'neutral', shade: 950, alpha: 0.7 },
    surfaceInverse: { ramp: 'neutral', shade: 50 },
    textPrimary: { ramp: 'neutral', shade: 50 },
    textSecondary: { ramp: 'neutral', shade: 400 },
    textTertiary: { ramp: 'neutral', shade: 500 },
    textDisabled: { ramp: 'neutral', shade: 50, alpha: 0.38 },
    textInverse: {
      mode: 'contrast',
      background: 'surfaceInverse',
      candidates: [
        { ramp: 'neutral', shade: 50 },
        { ramp: 'neutral', shade: 950 },
      ],
    },
    textPlaceholder: { ramp: 'neutral', shade: 600 },
    textInteractivePrimary: {
      mode: 'contrast',
      background: 'interactivePrimary',
      candidates: [
        { ramp: 'neutral', shade: 50 },
        { ramp: 'neutral', shade: 950 },
      ],
    },
    textInteractiveSecondary: { ramp: 'neutral', shade: 200 },
    textInteractiveTertiary: { ramp: 'accent', shade: 400 },
    textInteractiveError: { ramp: 'error', shade: 400 },
    interactivePrimary: { ramp: 'accent', shade: 600 },
    interactivePrimaryPressed: { ramp: 'accent', shade: 700 },
    interactiveSecondary: { ramp: 'neutral', shade: 800, alpha: 0.7 },
    interactiveSecondaryPressed: { ramp: 'neutral', shade: 700 },
    interactiveTertiary: { value: 'transparent' },
    interactiveTertiaryPressed: { ramp: 'neutral', shade: 800, alpha: 0.55 },
    interactiveDisabled: { ramp: 'neutral', shade: 800 },
    interactiveError: { ramp: 'error', shade: 500 },
    focusRingMain: { ramp: 'accent', shade: 400 },
    focusRingError: { ramp: 'error', shade: 400 },
    touchFeedbackMain: { ramp: 'neutral', shade: 50, alpha: 0.08 },
    touchFeedbackLight: { ramp: 'neutral', shade: 800, alpha: 0.5 },
    borderPrimary: { ramp: 'neutral', shade: 700 },
    borderSecondary: { ramp: 'neutral', shade: 800 },
    borderFocus: { ramp: 'accent', shade: 400 },
    borderError: { ramp: 'error', shade: 500 },
    feedbackSuccess: { ramp: 'success', shade: 400 },
    feedbackSuccessBg: { ramp: 'success', shade: 900 },
    feedbackWarning: { ramp: 'warning', shade: 400 },
    feedbackWarningBg: { ramp: 'warning', shade: 900 },
    feedbackError: { ramp: 'error', shade: 500 },
    feedbackErrorBg: { ramp: 'error', shade: 900 },
    feedbackInfo: { ramp: 'accent', shade: 400 },
    feedbackInfoBg: { ramp: 'accent', shade: 900 },
    chartPositive: { ramp: 'success', shade: 400 },
    chartNegative: { ramp: 'error', shade: 500 },
    chartSeries1: { ramp: 'lime', shade: 500 },
    chartSeries2: { ramp: 'pink', shade: 500 },
    chartSeries3: { ramp: 'yellow', shade: 300 },
    chartSeries4: { ramp: 'cyan', shade: 400 },
    chartOther: { ramp: 'neutral', shade: 400 },
    navBackground: { ramp: 'neutral', shade: 900 },
    navBorder: { ramp: 'neutral', shade: 800 },
    navActive: { ramp: 'accent', shade: 400 },
    navInactive: { ramp: 'neutral', shade: 500 },
    navIndicator: { ramp: 'accent', shade: 400 },
    pullIndicator: { ramp: 'neutral', shade: 600 },
  },
} as const satisfies Record<'light' | 'dark', SemanticRecipe>;

export function generateArloOklchTheme(
  rampSpecs: Readonly<Record<RampName, OklchRampSpec>> = arloOklchRampSpecs,
  options: OklchThemeOptions = {},
): GeneratedOklchTheme {
  const ramps = Object.fromEntries(
    Object.entries(rampSpecs).map(([name, spec]) => [name, createRuntimeRamp(spec)]),
  ) as Record<RampName, RuntimeRamp>;
  const recipe = options.recipe ?? arloOklchThemeRecipe;

  const semantic = {
    light: resolveSemanticRecipe(recipe.light, ramps),
    dark: resolveSemanticRecipe(recipe.dark, ramps),
  };
  const colors = {
    light: withFlatAliases(semantic.light, 'light'),
    dark: withFlatAliases(semantic.dark, 'dark'),
  };
  const audits = auditGeneratedTheme(ramps, semantic, colors);

  return { ramps, semantic, colors, audits };
}

function resolveSemanticRecipe(
  recipe: SemanticRecipe,
  ramps: Record<RampName, RuntimeRamp>,
): GeneratedSemanticColors {
  const resolved: GeneratedSemanticColors = {};
  const resolving = new Set<string>();

  const resolveNamed = (name: string): GeneratedSemanticColor => {
    const existing = resolved[name];
    if (existing) return existing;

    const source = recipe[name];
    if (!source) throw new Error(`Missing semantic ref "${name}".`);
    if (resolving.has(name)) throw new Error(`Circular semantic ref "${name}".`);

    resolving.add(name);
    const color = resolveRef(source, name);
    resolving.delete(name);
    resolved[name] = color;
    return color;
  };

  const resolveRef = (
    source: SemanticRef | ColorRef | StaticColorRef,
    name?: string,
  ): GeneratedSemanticColor => {
    if ('value' in source) {
      return {
        value: source.value,
        source,
        oklch: maybeFormatRuntimeOklch(source.value),
      };
    }

    if ('mode' in source) {
      const background = resolveNamed(source.background);
      const backdrop = recipe.surfaceBackground ? resolveNamed('surfaceBackground').value : background.value;
      const target = source.target ?? 4.5;
      const candidates = source.candidates.map((candidate) => resolveRef(candidate));
      if (candidates.length === 0) {
        throw new Error(`Conditional semantic ref "${name ?? source.background}" needs candidates.`);
      }
      const choice =
        candidates.find(
          (candidate) => contrastRatio(candidate.value, background.value, { backdrop }) >= target,
        ) ??
        candidates
          .slice()
          .sort(
            (a, b) =>
              contrastRatio(b.value, background.value, { backdrop }) -
              contrastRatio(a.value, background.value, { backdrop }),
          )[0];
      if (!choice) {
        throw new Error(`Conditional semantic ref "${name ?? source.background}" did not resolve.`);
      }

      return {
        ...choice,
        source,
        resolvedSource: choice.source as ColorRef | StaticColorRef,
        oklch: choice.oklch,
      };
    }

    const color = ramps[source.ramp][source.shade];
    return {
      value: source.alpha == null ? color.hex : oklchToRgba(color.oklch, source.alpha),
      source,
      oklch: formatOklch(color.oklch),
    };
  };

  for (const name of Object.keys(recipe)) resolveNamed(name);
  return resolved;
}

function withFlatAliases(
  semantic: GeneratedSemanticColors,
  scheme: 'light' | 'dark',
): Record<string, string> {
  const values = Object.fromEntries(
    Object.entries(semantic).map(([name, color]) => [name, color.value]),
  );
  return {
    ...values,
    bg: semanticColor(semantic, 'surfaceBackground').value,
    surface:
      scheme === 'dark'
        ? semanticColor(semantic, 'surfaceInput').value
        : semanticColor(semantic, 'surfaceElevated').value,
    surfaceRaised:
      scheme === 'dark'
        ? semanticColor(semantic, 'surfaceElevated').value
        : semanticColor(semantic, 'surfaceInput').value,
    surfaceStrong: semanticColor(semantic, 'surfaceInputActive').value,
    border: semanticColor(semantic, 'borderSecondary').value,
    borderStrong: semanticColor(semantic, 'borderPrimary').value,
    accent: semanticColor(semantic, 'interactivePrimary').value,
    accentAlt:
      scheme === 'dark'
        ? semanticColor(semantic, 'textInteractiveTertiary').value
        : semanticColor(semantic, 'feedbackInfo').value,
    success: semanticColor(semantic, 'feedbackSuccess').value,
    warning: semanticColor(semantic, 'feedbackWarning').value,
    danger: semanticColor(semantic, 'feedbackError').value,
  };
}

function auditGeneratedTheme(
  ramps: Record<RampName, RuntimeRamp>,
  semantic: GeneratedOklchTheme['semantic'],
  colors: GeneratedOklchTheme['colors'],
) {
  const contrast = [
    auditContrast(
      'light text primary on background',
      runtimeColor(colors.light, 'textPrimary'),
      runtimeColor(colors.light, 'bg'),
      4.5,
      runtimeColor(colors.light, 'bg'),
    ),
    auditContrast(
      'light text secondary on background',
      runtimeColor(colors.light, 'textSecondary'),
      runtimeColor(colors.light, 'bg'),
      3,
      runtimeColor(colors.light, 'bg'),
    ),
    auditContrast(
      'light primary button label',
      runtimeColor(colors.light, 'textInteractivePrimary'),
      runtimeColor(colors.light, 'interactivePrimary'),
      4.5,
      runtimeColor(colors.light, 'bg'),
    ),
    auditContrast(
      'dark text primary on background',
      runtimeColor(colors.dark, 'textPrimary'),
      runtimeColor(colors.dark, 'bg'),
      4.5,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark text secondary on background',
      runtimeColor(colors.dark, 'textSecondary'),
      runtimeColor(colors.dark, 'bg'),
      3,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark primary button label',
      runtimeColor(colors.dark, 'textInteractivePrimary'),
      runtimeColor(colors.dark, 'interactivePrimary'),
      4.5,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark primary pressed button label',
      runtimeColor(colors.dark, 'textInteractivePrimary'),
      runtimeColor(colors.dark, 'interactivePrimaryPressed'),
      4.5,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark text primary on card',
      runtimeColor(colors.dark, 'textPrimary'),
      runtimeColor(colors.dark, 'surfaceCard'),
      4.5,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark text primary on input',
      runtimeColor(colors.dark, 'textPrimary'),
      runtimeColor(colors.dark, 'surfaceInput'),
      4.5,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark text secondary on card',
      runtimeColor(colors.dark, 'textSecondary'),
      runtimeColor(colors.dark, 'surfaceCard'),
      3,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'light info on info background',
      runtimeColor(colors.light, 'feedbackInfo'),
      runtimeColor(colors.light, 'feedbackInfoBg'),
      3,
      runtimeColor(colors.light, 'bg'),
    ),
    auditContrast(
      'light success on success background',
      runtimeColor(colors.light, 'feedbackSuccess'),
      runtimeColor(colors.light, 'feedbackSuccessBg'),
      3,
      runtimeColor(colors.light, 'bg'),
    ),
    auditContrast(
      'light warning on warning background',
      runtimeColor(colors.light, 'feedbackWarning'),
      runtimeColor(colors.light, 'feedbackWarningBg'),
      3,
      runtimeColor(colors.light, 'bg'),
    ),
    auditContrast(
      'light error on error background',
      runtimeColor(colors.light, 'feedbackError'),
      runtimeColor(colors.light, 'feedbackErrorBg'),
      3,
      runtimeColor(colors.light, 'bg'),
    ),
    auditContrast(
      'dark info on info background',
      runtimeColor(colors.dark, 'feedbackInfo'),
      runtimeColor(colors.dark, 'feedbackInfoBg'),
      3,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark success on success background',
      runtimeColor(colors.dark, 'feedbackSuccess'),
      runtimeColor(colors.dark, 'feedbackSuccessBg'),
      3,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark warning on warning background',
      runtimeColor(colors.dark, 'feedbackWarning'),
      runtimeColor(colors.dark, 'feedbackWarningBg'),
      3,
      runtimeColor(colors.dark, 'bg'),
    ),
    auditContrast(
      'dark error on error background',
      runtimeColor(colors.dark, 'feedbackError'),
      runtimeColor(colors.dark, 'feedbackErrorBg'),
      3,
      runtimeColor(colors.dark, 'bg'),
    ),
  ];

  const surfaces = [
    auditSurfacePair('light background to card', semantic.light, 'surfaceBackground', 'surfaceCard', {
      minDeltaL: 0.014,
      maxDeltaL: 0.08,
    }),
    auditSurfacePair('light input to active input', semantic.light, 'surfaceInput', 'surfaceInputActive', {
      minDeltaL: 0.03,
      maxDeltaL: 0.1,
    }),
    auditSurfacePair('light card to elevated', semantic.light, 'surfaceCard', 'surfaceElevated', {
      minDeltaL: 0.014,
      maxDeltaL: 0.08,
    }),
    auditSurfacePair('dark background to card', semantic.dark, 'surfaceBackground', 'surfaceCard', {
      minDeltaL: 0.05,
      maxDeltaL: 0.14,
    }),
    auditSurfacePair('dark input to active input', semantic.dark, 'surfaceInput', 'surfaceInputActive', {
      minDeltaL: 0.05,
      maxDeltaL: 0.12,
    }),
    auditSurfacePair('dark card to elevated', semantic.dark, 'surfaceCard', 'surfaceElevated', {
      minDeltaL: 0.05,
      maxDeltaL: 0.14,
    }),
    auditSurfacePair('light background to info bg', semantic.light, 'surfaceBackground', 'feedbackInfoBg', {
      minDeltaL: 0.002,
      maxDeltaL: 0.08,
    }),
    auditSurfacePair('light background to success bg', semantic.light, 'surfaceBackground', 'feedbackSuccessBg', {
      minDeltaL: 0.002,
      maxDeltaL: 0.08,
    }),
    auditSurfacePair('light background to warning bg', semantic.light, 'surfaceBackground', 'feedbackWarningBg', {
      minDeltaL: 0.002,
      maxDeltaL: 0.08,
    }),
    auditSurfacePair('light background to error bg', semantic.light, 'surfaceBackground', 'feedbackErrorBg', {
      minDeltaL: 0.002,
      maxDeltaL: 0.08,
    }),
    auditSurfacePair('dark background to info bg', semantic.dark, 'surfaceBackground', 'feedbackInfoBg', {
      minDeltaL: 0.05,
      maxDeltaL: 0.18,
    }),
    auditSurfacePair('dark background to success bg', semantic.dark, 'surfaceBackground', 'feedbackSuccessBg', {
      minDeltaL: 0.05,
      maxDeltaL: 0.18,
    }),
    auditSurfacePair('dark background to warning bg', semantic.dark, 'surfaceBackground', 'feedbackWarningBg', {
      minDeltaL: 0.05,
      maxDeltaL: 0.18,
    }),
    auditSurfacePair('dark background to error bg', semantic.dark, 'surfaceBackground', 'feedbackErrorBg', {
      minDeltaL: 0.05,
      maxDeltaL: 0.18,
    }),
    auditSurfaceCounterpart('background/card depth parity', semantic, 'surfaceBackground', 'surfaceCard', {
      minDeltaL: 0.014,
      maxDeltaL: 0.14,
      minRatio: 1.8,
      maxRatio: 3,
    }),
    auditSurfaceCounterpart('input active depth parity', semantic, 'surfaceInput', 'surfaceInputActive', {
      minDeltaL: 0.03,
      maxDeltaL: 0.12,
      minRatio: 0.75,
      maxRatio: 2.8,
    }),
    auditSurfaceCounterpart('card/elevated depth parity', semantic, 'surfaceCard', 'surfaceElevated', {
      minDeltaL: 0.014,
      maxDeltaL: 0.14,
      minRatio: 1.8,
      maxRatio: 3,
    }),
  ];

  const gamut = Object.entries(ramps).flatMap(([rampName, ramp]) =>
    Object.entries(ramp).map(([shade, color]) => {
      const chromaLoss = Math.max(0, color.oklch.c - color.runtimeOklch.c);
      return {
        ramp: rampName as RampName,
        shade: Number(shade) as Shade,
        source: formatOklch(color.oklch),
        runtimeSource: formatOklch(color.runtimeOklch),
        runtime: color.hex,
        chromaLoss: Number(chromaLoss.toFixed(4)),
        clipped: color.clipped,
        pass: chromaLoss <= 0.025,
      };
    }),
  );

  const charts = [
    ...auditChartPalette('light', colors.light),
    ...auditChartPalette('dark', colors.dark),
  ];

  return {
    contrast,
    surfaces,
    gamut,
    charts,
    pass:
      contrast.every((item) => item.pass) &&
      surfaces.every((item) => item.pass) &&
      gamut.every((item) => item.pass) &&
      charts.every((item) => item.pass),
  };
}

function semanticColor(semantic: GeneratedSemanticColors, name: string): GeneratedSemanticColor {
  const color = semantic[name];
  if (!color) throw new Error(`Missing generated semantic color "${name}".`);
  return color;
}

function runtimeColor(colors: Record<string, string>, name: string): string {
  const color = colors[name];
  if (!color) throw new Error(`Missing generated runtime color "${name}".`);
  return color;
}

function auditContrast(
  name: string,
  foreground: string,
  background: string,
  target = 4.5,
  backdrop?: string,
): ContrastAudit {
  const ratio = contrastRatio(foreground, background, { backdrop });
  return {
    name,
    foreground,
    background,
    ratio: Number(ratio.toFixed(2)),
    target,
    pass: ratio >= target,
  };
}

function auditSurfacePair(
  name: string,
  semantic: GeneratedSemanticColors,
  firstName: string,
  secondName: string,
  {
    minDeltaL,
    maxDeltaL,
  }: {
    minDeltaL: number;
    maxDeltaL: number;
  },
): SurfaceAudit {
  const first = semanticColor(semantic, firstName);
  const second = semanticColor(semantic, secondName);
  const backdrop = semanticColor(semantic, 'surfaceBackground').value;
  const deltaL = surfaceDeltaL(first.value, second.value, backdrop);

  return {
    name,
    first: first.value,
    second: second.value,
    deltaL: roundMetric(deltaL),
    minDeltaL,
    maxDeltaL,
    pass: first.value !== second.value && deltaL >= minDeltaL && deltaL <= maxDeltaL,
  };
}

function auditSurfaceCounterpart(
  name: string,
  semantic: GeneratedOklchTheme['semantic'],
  firstName: string,
  secondName: string,
  {
    minDeltaL,
    maxDeltaL,
    minRatio,
    maxRatio,
  }: {
    minDeltaL: number;
    maxDeltaL: number;
    minRatio: number;
    maxRatio: number;
  },
): SurfaceAudit {
  const lightFirst = semanticColor(semantic.light, firstName).value;
  const lightSecond = semanticColor(semantic.light, secondName).value;
  const darkFirst = semanticColor(semantic.dark, firstName).value;
  const darkSecond = semanticColor(semantic.dark, secondName).value;
  const lightBackdrop = semanticColor(semantic.light, 'surfaceBackground').value;
  const darkBackdrop = semanticColor(semantic.dark, 'surfaceBackground').value;
  const lightDeltaL = surfaceDeltaL(lightFirst, lightSecond, lightBackdrop);
  const darkDeltaL = surfaceDeltaL(darkFirst, darkSecond, darkBackdrop);
  const ratio = darkDeltaL / Math.max(lightDeltaL, 0.001);

  return {
    name,
    lightFirst,
    lightSecond,
    darkFirst,
    darkSecond,
    lightDeltaL: roundMetric(lightDeltaL),
    darkDeltaL: roundMetric(darkDeltaL),
    minDeltaL,
    maxDeltaL,
    ratio: roundMetric(ratio),
    minRatio,
    maxRatio,
    pass:
      lightFirst !== lightSecond &&
      darkFirst !== darkSecond &&
      lightDeltaL >= minDeltaL &&
      lightDeltaL <= maxDeltaL &&
      darkDeltaL >= minDeltaL &&
      darkDeltaL <= maxDeltaL &&
      ratio >= minRatio &&
      ratio <= maxRatio,
  };
}

function auditChartPalette(scheme: 'light' | 'dark', colors: Record<string, string>): ChartAudit[] {
  const chartNames = ['chartSeries1', 'chartSeries2', 'chartSeries3', 'chartSeries4'] as const;
  const surface = runtimeColor(colors, 'surfaceCard');
  const audits: ChartAudit[] = [];

  for (const [index, name] of chartNames.entries()) {
    const color = runtimeColor(colors, name);
    const ratio = contrastRatio(color, surface, { backdrop: runtimeColor(colors, 'bg') });
    audits.push({
      name: `${scheme} ${name} on card`,
      first: color,
      second: surface,
      contrast: Number(ratio.toFixed(2)),
      target: 3,
      pass: ratio >= 3,
    });

    for (let nextIndex = index + 1; nextIndex < chartNames.length; nextIndex += 1) {
      const nextName = chartNames[nextIndex];
      if (!nextName) continue;
      const nextColor = runtimeColor(colors, nextName);
      const deltaE = colorDeltaE(color, nextColor, surface);
      const simulatedDeltaE = colorDeltaE(
        color,
        nextColor,
        surface,
        simulateDeuteranopia,
      );

      audits.push({
        name: `${scheme} ${name} vs ${nextName}`,
        first: color,
        second: nextColor,
        deltaE: roundMetric(deltaE),
        simulatedDeltaE: roundMetric(simulatedDeltaE),
        target: 8,
        pass: deltaE >= 10 && simulatedDeltaE >= 8,
      });
    }
  }

  return audits;
}

function surfaceDeltaL(first: string, second: string, backdrop: string): number {
  return Math.abs(runtimeColorToOklch(first, backdrop).l - runtimeColorToOklch(second, backdrop).l);
}

function colorDeltaE(
  first: string,
  second: string,
  backdrop: string,
  transform?: (color: RgbColor) => RgbColor,
): number {
  const firstLab = oklchToOklab(runtimeColorToOklch(first, backdrop, transform));
  const secondLab = oklchToOklab(runtimeColorToOklch(second, backdrop, transform));
  return (
    Math.sqrt(
      (firstLab.l - secondLab.l) ** 2 +
        (firstLab.a - secondLab.a) ** 2 +
        (firstLab.b - secondLab.b) ** 2,
    ) * 100
  );
}

function runtimeColorToOklch(
  value: string,
  backdrop: string,
  transform?: (color: RgbColor) => RgbColor,
): OklchColor {
  const resolved = compositeRgb(parseRuntimeColor(value), parseRuntimeColor(backdrop));
  return rgbToOklch(transform ? transform(resolved) : resolved);
}

function oklchToOklab(color: OklchColor) {
  const hue = (color.h * Math.PI) / 180;
  return {
    l: color.l,
    a: color.c * Math.cos(hue),
    b: color.c * Math.sin(hue),
  };
}

function simulateDeuteranopia(color: RgbColor): RgbColor {
  return {
    r: clampByte(0.367 * color.r + 0.861 * color.g - 0.228 * color.b),
    g: clampByte(0.28 * color.r + 0.673 * color.g + 0.047 * color.b),
    b: clampByte(-0.012 * color.r + 0.043 * color.g + 0.969 * color.b),
  };
}

function maybeFormatRuntimeOklch(value: string): string | undefined {
  try {
    if (value === 'transparent') return undefined;
    return formatOklch(runtimeColorToOklch(value, '#FFFFFF'));
  } catch {
    return undefined;
  }
}

function relativeChroma(
  values: Readonly<Record<Shade, number>>,
  absolute?: Readonly<Partial<Record<Shade, number>>>,
): ChromaRampSpec {
  return absolute ? { mode: 'relative', values, absolute } : { mode: 'relative', values };
}

function roundMetric(value: number): number {
  return Number(value.toFixed(3));
}

function clampByte(value: number): number {
  return Math.round(Math.min(255, Math.max(0, value)));
}

export const arloOklchTheme = generateArloOklchTheme();
