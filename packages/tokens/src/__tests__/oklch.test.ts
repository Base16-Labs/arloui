import {
  contrastRatio,
  hexToOklch,
  isInSrgbGamut,
  maxChromaForLightnessHue,
  oklchToHex,
  oklchToRgba,
  shadeSteps,
  type OklchRampSpec,
  type Shade,
} from '../oklch';
import {
  arloOklchRampSpecs,
  arloOklchTheme,
  arloOklchThemeRecipe,
  generateArloOklchTheme,
} from '../oklchTheme';

describe('OKLCH conversion', () => {
  it('converts neutral endpoints to sRGB hex', () => {
    expect(oklchToHex({ l: 1, c: 0, h: 0 })).toBe('#FFFFFF');
    expect(oklchToHex({ l: 0, c: 0, h: 0 })).toBe('#000000');
  });

  it('reduces chroma for colors outside the sRGB runtime gamut', () => {
    const source = { l: 0.7, c: 0.4, h: 40 };
    expect(isInSrgbGamut(source)).toBe(false);
    expect(oklchToHex(source)).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('emits React Native safe rgba strings for alpha colors', () => {
    expect(oklchToRgba({ l: 0.5, c: 0, h: 0 }, 0.4)).toMatch(/^rgba\(\d+,\d+,\d+,0\.4\)$/);
  });

  it('composites rgba and transparent runtime colors for contrast', () => {
    expect(contrastRatio('rgba(255,255,255,0.5)', '#000000')).toBeGreaterThan(5);
    expect(contrastRatio('transparent', '#000000')).toBe(1);
    expect(contrastRatio('#00000080', '#FFFFFF')).toBeLessThan(4.5);
  });

  it('resolves relative chroma from each shade lightness and hue', () => {
    const maxC = maxChromaForLightnessHue(0.6, 260);
    const relative = generateArloOklchTheme({
      ...arloOklchRampSpecs,
      accent: {
        ...arloOklchRampSpecs.accent,
        lightness: { ...arloOklchRampSpecs.accent.lightness, 600: 0.6 },
        chroma: {
          mode: 'relative',
          values: Object.fromEntries(shadeSteps.map((shade) => [shade, 0.5])) as Record<Shade, number>,
        },
      },
    });

    expect(relative.ramps.accent[600].oklch.c).toBeCloseTo(maxC * 0.5, 3);
  });

  it('lets pale ramp stops use absolute chroma while mid stops stay relative', () => {
    const hybrid = generateArloOklchTheme({
      ...arloOklchRampSpecs,
      accent: {
        ...arloOklchRampSpecs.accent,
        lightness: { ...arloOklchRampSpecs.accent.lightness, 50: 0.98, 600: 0.6 },
        chroma: {
          mode: 'relative',
          values: Object.fromEntries(shadeSteps.map((shade) => [shade, 0.5])) as Record<Shade, number>,
          absolute: { 50: 0.014 },
        },
      },
    });

    expect(hybrid.ramps.accent[50].oklch.c).toBe(0.014);
    expect(hybrid.ramps.accent[600].oklch.c).toBeCloseTo(
      maxChromaForLightnessHue(0.6, 260) * 0.5,
      3,
    );
  });

  it('round-trips hex colors through OKLCH closely enough for authoring controls', () => {
    expect(oklchToHex(hexToOklch('#225BB9'))).toBe('#225BB9');
  });

  it('parses shorthand and alpha hex through the public hex parser', () => {
    expect(hexToOklch('#000').l).toBeCloseTo(0, 3);
    expect(hexToOklch('#00000080').alpha).toBeCloseTo(0.5, 2);
  });
});

describe('Arlo OKLCH theme generator', () => {
  it('generates a full ramp for every Arlo color family', () => {
    for (const ramp of Object.values(arloOklchTheme.ramps)) {
      expect(
        Object.keys(ramp)
          .map(Number)
          .sort((a, b) => a - b),
      ).toEqual([...shadeSteps]);
    }
  });

  it('keeps runtime semantic colors in React Native safe formats', () => {
    for (const scheme of ['light', 'dark'] as const) {
      for (const value of Object.values(arloOklchTheme.colors[scheme])) {
        expect(value).toMatch(/^(#[0-9A-F]{6}|rgba\(\d+,\d+,\d+,[0-9.]+\)|transparent)$/);
        expect(value).not.toContain('oklch(');
      }
    }
  });

  it('keeps OKLCH source metadata beside generated semantic colors', () => {
    expect(arloOklchTheme.semantic.light.interactivePrimary?.oklch).toMatch(/^oklch\(/);
    expect(arloOklchTheme.semantic.dark.feedbackInfoBg?.value).not.toBe(
      arloOklchTheme.semantic.dark.surfaceBackground?.value,
    );
    expect(arloOklchTheme.colors.dark.surfaceInputActive).not.toBe(
      arloOklchTheme.colors.dark.surfaceBackground,
    );
    expect(arloOklchTheme.colors.dark.surfaceInputActive).not.toBe(
      arloOklchTheme.colors.dark.surfaceInput,
    );
  });

  it('passes contrast, surface separation, and gamut audits for the default recipe', () => {
    expect(arloOklchTheme.audits.pass).toBe(true);
  });

  it('fails when a dark feedback background collapses into the page background', () => {
    const broken = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: arloOklchThemeRecipe.light,
        dark: {
          ...arloOklchThemeRecipe.dark,
          feedbackInfoBg: { ramp: 'neutral', shade: 950 },
        },
      },
    });

    expect(broken.audits.surfaces).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'dark background to info bg',
          pass: false,
        }),
      ]),
    );
    expect(broken.audits.pass).toBe(false);
  });

  it('fails when a light feedback background collapses into the page background', () => {
    const broken = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: {
          ...arloOklchThemeRecipe.light,
          feedbackInfoBg: { ramp: 'neutral', shade: 50 },
        },
        dark: arloOklchThemeRecipe.dark,
      },
    });

    expect(broken.audits.surfaces).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'light background to info bg',
          pass: false,
        }),
      ]),
    );
    expect(broken.audits.pass).toBe(false);
  });

  it('fails when dark surface depth is too asymmetric with light mode', () => {
    const broken = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: arloOklchThemeRecipe.light,
        dark: {
          ...arloOklchThemeRecipe.dark,
          surfaceCard: { ramp: 'neutral', shade: 800 },
        },
      },
    });

    expect(broken.audits.surfaces).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'background/card depth parity',
          pass: false,
        }),
      ]),
    );
    expect(broken.audits.pass).toBe(false);
  });

  it('fails when dark input active is either too subtle or too slabby', () => {
    const tooSubtle = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: arloOklchThemeRecipe.light,
        dark: {
          ...arloOklchThemeRecipe.dark,
          surfaceInputActive: { ramp: 'neutral', shade: 900 },
        },
      },
    });
    const tooSlabby = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: arloOklchThemeRecipe.light,
        dark: {
          ...arloOklchThemeRecipe.dark,
          surfaceInputActive: { ramp: 'neutral', shade: 600 },
        },
      },
    });

    expect(tooSubtle.audits.surfaces).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'dark input to active input', pass: false })]),
    );
    expect(tooSlabby.audits.surfaces).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'dark input to active input', pass: false })]),
    );
  });

  it('fails over-chroma ramps that need meaningful sRGB clipping', () => {
    const clipped = generateArloOklchTheme({
      ...arloOklchRampSpecs,
      accent: {
        ...arloOklchRampSpecs.accent,
        chroma: Object.fromEntries(shadeSteps.map((shade) => [shade, 0.4])) as Record<Shade, number>,
      },
    });

    expect(clipped.audits.gamut.some((item) => item.ramp === 'accent' && !item.pass)).toBe(true);
    expect(clipped.audits.pass).toBe(false);
  });

  it('fails a light primary fill with a static white label, while the conditional label fixes it', () => {
    const whiteLabel = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: {
          ...arloOklchThemeRecipe.light,
          interactivePrimary: { ramp: 'warning', shade: 300 },
          textInteractivePrimary: { value: '#FFFFFF' },
        },
        dark: arloOklchThemeRecipe.dark,
      },
    });
    const conditionalLabel = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: {
          ...arloOklchThemeRecipe.light,
          interactivePrimary: { ramp: 'warning', shade: 300 },
        },
        dark: arloOklchThemeRecipe.dark,
      },
    });

    expect(whiteLabel.audits.contrast).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'light primary button label', pass: false })]),
    );
    expect(
      contrastRatio(
        conditionalLabel.colors.light.textInteractivePrimary,
        conditionalLabel.colors.light.interactivePrimary,
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('fails chart series that collapse under deuteranopia simulation', () => {
    const collapsed = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: {
          ...arloOklchThemeRecipe.light,
          chartSeries1: { ramp: 'lime', shade: 600 },
          chartSeries3: { ramp: 'yellow', shade: 700 },
        },
        dark: {
          ...arloOklchThemeRecipe.dark,
          chartSeries1: { ramp: 'lime', shade: 600 },
          chartSeries3: { ramp: 'yellow', shade: 700 },
        },
      },
    });

    expect(collapsed.audits.charts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'light chartSeries1 vs chartSeries3',
          pass: false,
        }),
      ]),
    );
    expect(collapsed.audits.pass).toBe(false);
  });

  it('fails chart series below the non-text contrast floor', () => {
    const lowContrast = generateArloOklchTheme(arloOklchRampSpecs, {
      recipe: {
        light: {
          ...arloOklchThemeRecipe.light,
          chartSeries1: { ramp: 'accent', shade: 300 },
        },
        dark: arloOklchThemeRecipe.dark,
      },
    });

    expect(lowContrast.audits.charts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'light chartSeries1 on card',
          pass: false,
        }),
      ]),
    );
    expect(lowContrast.audits.pass).toBe(false);
  });

  it('lets consumers generate a different accent without mutating the default recipe', () => {
    const customAccent: OklchRampSpec = {
      ...arloOklchRampSpecs.accent,
      hue: 320,
    };
    const next = generateArloOklchTheme({
      ...arloOklchRampSpecs,
      accent: customAccent,
    });

    expect(next.colors.light.interactivePrimary).not.toBe(
      arloOklchTheme.colors.light.interactivePrimary,
    );
    expect(contrastRatio(next.colors.dark.textPrimary, next.colors.dark.bg)).toBeGreaterThan(4.5);
  });
});
