export type OklchColor = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

export type RgbColor = {
  r: number;
  g: number;
  b: number;
  alpha?: number;
};

export type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type OklchRamp = Record<Shade, OklchColor>;

export type ChromaRampSpec =
  | Readonly<Record<Shade, number>>
  | {
      mode: 'absolute' | 'relative';
      values: Readonly<Record<Shade, number>>;
      absolute?: Readonly<Partial<Record<Shade, number>>>;
    };

export type OklchRampSpec = {
  name: string;
  hue: number | Readonly<Partial<Record<Shade, number>>>;
  lightness: Readonly<Record<Shade, number>>;
  chroma: ChromaRampSpec;
};

export type RuntimeColor = {
  oklch: OklchColor;
  runtimeOklch: OklchColor;
  hex: string;
  rgb: RgbColor;
  inGamut: boolean;
  clipped: boolean;
};

export type RuntimeRamp = Record<Shade, RuntimeColor>;

export const shadeSteps = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const satisfies readonly Shade[];

export function normalizeHue(hue: number): number {
  const normalized = hue % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function formatOklch(color: OklchColor): string {
  const l = trimNumber(color.l, 4);
  const c = trimNumber(color.c, 4);
  const h = trimNumber(normalizeHue(color.h), 2);
  if (color.alpha == null || color.alpha >= 1) return `oklch(${l} ${c} ${h})`;
  return `oklch(${l} ${c} ${h} / ${trimNumber(color.alpha, 3)})`;
}

export function createOklchRamp(spec: OklchRampSpec): OklchRamp {
  return Object.fromEntries(
    shadeSteps.map((shade) => {
      const l = bounded(spec.lightness[shade], 0, 1);
      const h = normalizeHue(
        typeof spec.hue === 'number' ? spec.hue : (spec.hue[shade] ?? spec.hue[500] ?? 0),
      );
      return [
        shade,
        {
          l,
          c: resolveChroma(spec.chroma, shade, l, h),
          h,
        },
      ];
    }),
  ) as OklchRamp;
}

export function createRuntimeRamp(spec: OklchRampSpec): RuntimeRamp {
  const ramp = createOklchRamp(spec);
  return Object.fromEntries(
    shadeSteps.map((shade) => {
      const oklch = ramp[shade];
      const inGamut = isInSrgbGamut(oklch);
      const runtimeOklch = inGamut ? oklch : fitOklchToSrgb(oklch);
      return [
        shade,
        {
          oklch,
          runtimeOklch,
          hex: oklchToHex(runtimeOklch),
          rgb: oklchToRgb(runtimeOklch),
          inGamut,
          clipped: !inGamut,
        },
      ];
    }),
  ) as RuntimeRamp;
}

export function oklchToHex(color: OklchColor): string {
  const rgb = oklchToRgb(color);
  return `#${componentToHex(rgb.r)}${componentToHex(rgb.g)}${componentToHex(rgb.b)}`;
}

export function oklchToRgba(color: OklchColor, alpha = color.alpha ?? 1): string {
  const rgb = oklchToRgb(color);
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${trimNumber(bounded(alpha, 0, 1), 3)})`;
}

export function oklchToRgb(color: OklchColor): RgbColor {
  const mapped = isInSrgbGamut(color) ? color : fitOklchToSrgb(color);
  const linear = oklchToLinearSrgb(mapped);
  return {
    r: linearToByte(linear.r),
    g: linearToByte(linear.g),
    b: linearToByte(linear.b),
    alpha: color.alpha,
  };
}

export function isInSrgbGamut(color: OklchColor): boolean {
  const rgb = oklchToLinearSrgb(color);
  return [rgb.r, rgb.g, rgb.b].every((channel) => channel >= -0.00001 && channel <= 1.00001);
}

export function fitOklchToSrgb(color: OklchColor): OklchColor {
  if (color.c <= 0 || isInSrgbGamut(color)) return color;

  let low = 0;
  let high = color.c;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    const candidate = { ...color, c: mid };
    if (isInSrgbGamut(candidate)) low = mid;
    else high = mid;
  }

  return { ...color, c: low };
}

export function maxChromaForLightnessHue(lightness: number, hue: number): number {
  const l = bounded(lightness, 0, 1);
  if (l <= 0 || l >= 1) return 0;

  let low = 0;
  let high = 0.5;
  for (let i = 0; i < 28; i++) {
    const mid = (low + high) / 2;
    if (isInSrgbGamut({ l, c: mid, h: hue })) low = mid;
    else high = mid;
  }

  return low;
}

export function contrastRatio(
  foreground: string,
  background: string,
  options: { backdrop?: string } = {},
): number {
  const backdrop = parseRuntimeColor(options.backdrop ?? '#FFFFFF');
  const bg = compositeRgb(parseRuntimeColor(background), backdrop);
  const fg = compositeRgb(parseRuntimeColor(foreground), bg);
  const fgLuminance = relativeLuminance(fg);
  const bgLuminance = relativeLuminance(bg);
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function parseRuntimeColor(value: string): RgbColor {
  const normalized = value.trim();
  if (normalized === 'transparent') return { r: 0, g: 0, b: 0, alpha: 0 };

  const hex = parseHexLike(normalized);
  if (hex) return hex;

  const rgb = parseRgbLike(normalized);
  if (rgb) return rgb;

  throw new Error(`Expected #RRGGBB, rgba(...), or transparent, got "${value}".`);
}

export function compositeRgb(foreground: RgbColor, background: RgbColor): RgbColor {
  const fgAlpha = bounded(foreground.alpha ?? 1, 0, 1);
  const bgAlpha = bounded(background.alpha ?? 1, 0, 1);
  const alpha = fgAlpha + bgAlpha * (1 - fgAlpha);

  if (alpha <= 0) return { r: 0, g: 0, b: 0, alpha: 0 };

  return {
    r: Math.round((foreground.r * fgAlpha + background.r * bgAlpha * (1 - fgAlpha)) / alpha),
    g: Math.round((foreground.g * fgAlpha + background.g * bgAlpha * (1 - fgAlpha)) / alpha),
    b: Math.round((foreground.b * fgAlpha + background.b * bgAlpha * (1 - fgAlpha)) / alpha),
    alpha,
  };
}

export function relativeLuminance(color: RgbColor): number {
  const r = srgbByteToLinear(color.r);
  const g = srgbByteToLinear(color.g);
  const b = srgbByteToLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function parseHex(hex: string): RgbColor {
  const normalized = hex.replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(normalized)) {
    const [r, g, b] = normalized;
    return {
      r: parseInt(`${r}${r}`, 16),
      g: parseInt(`${g}${g}`, 16),
      b: parseInt(`${b}${b}`, 16),
    };
  }
  if (/^[0-9a-fA-F]{8}$/.test(normalized)) {
    return {
      ...parseHex(`#${normalized.slice(0, 6)}`),
      alpha: parseInt(normalized.slice(6, 8), 16) / 255,
    };
  }
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error(`Expected #RGB, #RRGGBB, or #RRGGBBAA, got "${hex}".`);
  }
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function hexToOklch(hex: string): OklchColor {
  return rgbToOklch(parseHex(hex));
}

export function rgbToOklch(color: RgbColor): OklchColor {
  const r = srgbByteToLinear(color.r);
  const g = srgbByteToLinear(color.g);
  const b = srgbByteToLinear(color.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const lPrime = Math.cbrt(l);
  const mPrime = Math.cbrt(m);
  const sPrime = Math.cbrt(s);

  const okL = 0.2104542553 * lPrime + 0.793617785 * mPrime - 0.0040720468 * sPrime;
  const okA = 1.9779984951 * lPrime - 2.428592205 * mPrime + 0.4505937099 * sPrime;
  const okB = 0.0259040371 * lPrime + 0.7827717662 * mPrime - 0.808675766 * sPrime;
  const c = Math.sqrt(okA * okA + okB * okB);
  const h = c < 0.00001 ? 0 : normalizeHue((Math.atan2(okB, okA) * 180) / Math.PI);

  return { l: okL, c, h, alpha: color.alpha };
}

function oklchToLinearSrgb(color: OklchColor) {
  const h = (normalizeHue(color.h) * Math.PI) / 180;
  const a = color.c * Math.cos(h);
  const b = color.c * Math.sin(h);

  const lPrime = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = color.l - 0.0894841775 * a - 1.291485548 * b;

  const l = lPrime * lPrime * lPrime;
  const m = mPrime * mPrime * mPrime;
  const s = sPrime * sPrime * sPrime;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function srgbByteToLinear(channel: number): number {
  const value = bounded(channel, 0, 255) / 255;
  if (value <= 0.04045) return value / 12.92;
  return ((value + 0.055) / 1.055) ** 2.4;
}

function linearToByte(channel: number): number {
  const clamped = bounded(channel, 0, 1);
  const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(bounded(encoded, 0, 1) * 255);
}

function componentToHex(channel: number): string {
  return bounded(channel, 0, 255).toString(16).padStart(2, '0').toUpperCase();
}

function resolveChroma(
  chroma: ChromaRampSpec,
  shade: Shade,
  lightness: number,
  hue: number,
): number {
  if ('mode' in chroma) {
    const absolute = chroma.absolute?.[shade];
    if (absolute != null) return Math.max(0, absolute);

    const value = Math.max(0, chroma.values[shade]);
    if (chroma.mode === 'absolute') return value;
    return maxChromaForLightnessHue(lightness, hue) * bounded(value, 0, 1);
  }

  return Math.max(0, chroma[shade]);
}

function parseHexLike(value: string): RgbColor | null {
  const normalized = value.replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(normalized)) {
    const [r, g, b] = normalized;
    return {
      r: parseInt(`${r}${r}`, 16),
      g: parseInt(`${g}${g}`, 16),
      b: parseInt(`${b}${b}`, 16),
    };
  }
  if (/^[0-9a-fA-F]{6}$/.test(normalized)) return parseHex(value);
  if (/^[0-9a-fA-F]{8}$/.test(normalized)) {
    return {
      ...parseHex(`#${normalized.slice(0, 6)}`),
      alpha: parseInt(normalized.slice(6, 8), 16) / 255,
    };
  }
  return null;
}

function parseRgbLike(value: string): RgbColor | null {
  const match = value.match(/^rgba?\((.+)\)$/i);
  if (!match) return null;
  const body = match[1];
  if (!body) return null;
  const parts = body.replace(/\//g, ' ').split(/[,\s]+/).filter(Boolean);
  if (parts.length < 3) return null;

  const channels = parts.slice(0, 3).map(parseRgbChannel);
  const alpha = parts[3] == null ? 1 : parseAlpha(parts[3]);
  if (channels.some((channel) => channel == null) || alpha == null) return null;

  return {
    r: channels[0] as number,
    g: channels[1] as number,
    b: channels[2] as number,
    alpha,
  };
}

function parseRgbChannel(value: string): number | null {
  const parsed = value.endsWith('%') ? (parseFloat(value) / 100) * 255 : parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(bounded(parsed, 0, 255)) : null;
}

function parseAlpha(value: string): number | null {
  const parsed = value.endsWith('%') ? parseFloat(value) / 100 : parseFloat(value);
  return Number.isFinite(parsed) ? bounded(parsed, 0, 1) : null;
}

function bounded(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function trimNumber(value: number, digits: number): string {
  return Number(value.toFixed(digits)).toString();
}
