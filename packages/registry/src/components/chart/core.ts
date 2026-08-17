/**
 * Arlo UI — Chart core
 *
 * The shared vocabulary and the geometry, in one place and with no rendering in
 * it. Every form in the folder measures its data through these functions, which
 * is what makes the crosshair land on the line: there is one scale, not one per
 * component agreeing with a library's by coincidence.
 *
 * Nothing here imports React Native or a charting library. It is arithmetic and
 * path strings, so it is testable on its own and portable to whatever draws.
 */
import type { useTokens } from '../../foundation/theme-provider';

type Tokens = ReturnType<typeof useTokens>;

/* ------------------------------------------------------------------ data --- */

/**
 * A point in a series. `value` is all that is required; the rest is what lets a
 * readout say *when* as well as *what*.
 *
 * `at` is deliberately loose — a timestamp, an ISO string, or a `Date`. Charts
 * never parse it; they hand it back to your `formatAt` so the chart does not
 * acquire an opinion about time zones.
 */
export type ChartPoint = {
  value: number;
  at?: number | string | Date;
  label?: string;
  /** Anything you need back in a selection callback. Never read by the chart. */
  meta?: unknown;
};

/** A bare `number[]` is sugar for points with no label and no time. */
export type ChartData = readonly number[] | readonly ChartPoint[];

export function toPoints(data: ChartData): ChartPoint[] {
  return (data as ReadonlyArray<number | ChartPoint>).map((entry) =>
    typeof entry === 'number' ? { value: entry } : entry,
  );
}

export function valuesOf(points: readonly ChartPoint[]): number[] {
  return points.map((point) => point.value);
}

export type SeriesStats = {
  count: number;
  first: number;
  last: number;
  min: number;
  max: number;
  /** `max - min`. Zero for a flat series, which every scale has to survive. */
  span: number;
};

export function seriesStats(points: readonly ChartPoint[]): SeriesStats {
  const head = points[0];
  if (head == null) return { count: 0, first: 0, last: 0, min: 0, max: 0, span: 0 };
  let min = head.value;
  let max = head.value;
  for (const point of points) {
    if (point.value < min) min = point.value;
    if (point.value > max) max = point.value;
  }
  return {
    count: points.length,
    first: head.value,
    last: points[points.length - 1]?.value ?? head.value,
    min,
    max,
    span: max - min,
  };
}

/* ------------------------------------------------------------------ tone --- */

/**
 * One tone vocabulary for every form. Each component documents which members it
 * honours and what it does with the rest — a donut has no direction to infer, a
 * line has no series to enumerate, and neither should invent one.
 *
 * - `auto`     — infer from direction (ended above or below the baseline)
 * - `positive` / `negative` — force direction
 * - `brand`    — the interactive hue; magnitude with no direction to report
 * - `series`   — the validated four-slot categorical palette, then `chartOther`
 * - `neutral`  — ink; the mark is context for something else on screen
 */
export type ChartTone = 'auto' | 'positive' | 'negative' | 'brand' | 'series' | 'neutral';

/**
 * Resolves a single hue. `series` has no single answer, so it falls back to
 * brand here — components that genuinely enumerate categories call
 * `seriesPalette` instead and never route through this.
 */
export function toneColor(
  t: Tokens,
  tone: ChartTone,
  { rising = true }: { rising?: boolean } = {},
): string {
  switch (tone) {
    case 'positive':
      return t.colors.chartPositive;
    case 'negative':
      return t.colors.chartNegative;
    case 'neutral':
      return t.colors.textSecondary;
    case 'brand':
    case 'series':
      return t.colors.interactivePrimary;
    case 'auto':
    default:
      return rising ? t.colors.chartPositive : t.colors.chartNegative;
  }
}

/**
 * The four validated categorical slots. There is no fifth: anything past the end
 * folds into `chartOther` rather than inventing a hue that reads as a new
 * identity but was never checked for separation.
 */
export function seriesPalette(t: Tokens): string[] {
  return [
    t.colors.chartSeries1,
    t.colors.chartSeries2,
    t.colors.chartSeries3,
    t.colors.chartSeries4,
  ];
}

export function seriesColorAt(t: Tokens, index: number): string {
  const palette = seriesPalette(t);
  return index < palette.length ? (palette[index] as string) : t.colors.chartOther;
}

/* --------------------------------------------------- density and chrome --- */

/**
 * How much mark there is. Two members, closed, Card-style — the axis exists so
 * a chart can shrink into a row or a cell without every call site hand-tuning a
 * stroke width.
 */
export type ChartDensity = 'compact' | 'default';

/**
 * What furniture the plot draws around the data. There is no `axis` member and
 * there will not be one: ticks and gridlines are how a chart this size stops
 * being readable.
 *
 * - `none`      — the mark alone
 * - `baseline`  — a dashed rule at the baseline value
 * - `reference` — one labelled line at a value you name. Not a band system.
 */
export type ChartChrome = 'none' | 'baseline' | 'reference';

/** Closed payload. Anything richer than one line with one label is a later RFC. */
export type ChartReference = { value: number; label?: string };

export type DensityMetrics = {
  stroke: number;
  /** Radius of the scrub dot / end dot. */
  dot: number;
  barRadius: number;
  /** Gap between bars and between donut slices. */
  gap: number;
  /** Category and value labels are the first thing to go when space is tight. */
  showLabels: boolean;
  labelSize: number;
  /** Padding that keeps a stroke or a dot from clipping at the edge of the box. */
  inset: number;
};

export function densityMetrics(density: ChartDensity): DensityMetrics {
  return density === 'compact'
    ? { stroke: 1.5, dot: 4, barRadius: 2, gap: 1, showLabels: false, labelSize: 10, inset: 4 }
    : { stroke: 2, dot: 6, barRadius: 4, gap: 2, showLabels: true, labelSize: 11, inset: 6 };
}

/* -------------------------------------------------------------- geometry --- */

export type Pt = { x: number; y: number };

export type Scale = {
  /** Index -> x, across the usable track. */
  x: (index: number) => number;
  /** Value -> y, with the SVG y-axis pointing down. */
  y: (value: number) => number;
  /** x -> nearest index, clamped. The inverse the scrub needs. */
  indexAt: (x: number) => number;
};

/**
 * One scale, built once per layout and shared by everything that draws or reads.
 * A flat series has no range to normalise against, so it runs down the middle
 * rather than dividing by zero.
 */
export function makeScale({
  count,
  min,
  span,
  width,
  height,
  inset,
}: {
  count: number;
  min: number;
  span: number;
  width: number;
  height: number;
  inset: number;
}): Scale {
  const usableW = Math.max(0, width - inset * 2);
  const usableH = Math.max(0, height - inset * 2);
  const x = (index: number) =>
    count < 2 ? inset + usableW / 2 : inset + (index / (count - 1)) * usableW;
  const y = (value: number) => {
    const ratio = span === 0 ? 0.5 : (value - min) / span;
    return inset + (1 - ratio) * usableH;
  };
  const indexAt = (position: number) => {
    if (count < 2 || usableW <= 0) return 0;
    const index = Math.round(((position - inset) / usableW) * (count - 1));
    return Math.min(count - 1, Math.max(0, index));
  };
  return { x, y, indexAt };
}

/**
 * How the path joins its points. `'steep'` is the default and the honest one —
 * straight segments say only what the data says. `'smooth'` fits a spline, which
 * reads calmer but invents peaks and troughs between points that were never
 * measured.
 */
export type ChartCurve = 'steep' | 'smooth';

const f = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : '0');

/**
 * Catmull-Rom through the points, converted to cubic Béziers. The spline passes
 * through every sample — a plain Bézier control-point fit would not, and a chart
 * whose line misses its own data is worse than a jagged one.
 */
function smoothPath(points: readonly Pt[]): string {
  const first = points[0];
  if (!first) return '';
  if (points.length < 3) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${f(p.x)},${f(p.y)}`).join(' ');
  }
  let d = `M${f(first.x)},${f(first.y)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    if (!p0 || !p1 || !p2 || !p3) continue;
    // Standard Catmull-Rom -> cubic conversion at tension 0.5.
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`;
  }
  return d;
}

export function linePath(points: readonly Pt[], curve: ChartCurve = 'steep'): string {
  if (points.length === 0) return '';
  if (curve === 'smooth') return smoothPath(points);
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${f(p.x)},${f(p.y)}`).join(' ');
}

/** The line, closed down to `floorY` and back, for the gradient fill under it. */
export function areaPath(
  points: readonly Pt[],
  floorY: number,
  curve: ChartCurve = 'steep',
): string {
  const line = linePath(points, curve);
  const start = points[0];
  const end = points[points.length - 1];
  if (!line || !start || !end) return '';
  return `${line} L${f(end.x)},${f(floorY)} L${f(start.x)},${f(floorY)} Z`;
}

/**
 * A bar with only its data end rounded. A bar is anchored to its baseline;
 * rounding the anchored end lifts it off and misreports where zero is — so the
 * corner radius is a property of which end carries the datum, not of the shape.
 */
export function barPath({
  x,
  y,
  width,
  height,
  radius,
  roundedEnd,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  /** `'top'` for a positive bar, `'bottom'` for one hanging below the baseline. */
  roundedEnd: 'top' | 'bottom';
}): string {
  const h = Math.max(0, height);
  const w = Math.max(0, width);
  const r = Math.max(0, Math.min(radius, w / 2, h));
  if (w === 0 || h === 0) return '';
  if (r === 0) {
    return `M${f(x)},${f(y)} L${f(x + w)},${f(y)} L${f(x + w)},${f(y + h)} L${f(x)},${f(y + h)} Z`;
  }
  if (roundedEnd === 'top') {
    return [
      `M${f(x)},${f(y + r)}`,
      `A${f(r)},${f(r)} 0 0 1 ${f(x + r)},${f(y)}`,
      `L${f(x + w - r)},${f(y)}`,
      `A${f(r)},${f(r)} 0 0 1 ${f(x + w)},${f(y + r)}`,
      `L${f(x + w)},${f(y + h)}`,
      `L${f(x)},${f(y + h)}`,
      'Z',
    ].join(' ');
  }
  return [
    `M${f(x)},${f(y)}`,
    `L${f(x + w)},${f(y)}`,
    `L${f(x + w)},${f(y + h - r)}`,
    `A${f(r)},${f(r)} 0 0 1 ${f(x + w - r)},${f(y + h)}`,
    `L${f(x + r)},${f(y + h)}`,
    `A${f(r)},${f(r)} 0 0 1 ${f(x)},${f(y + h - r)}`,
    'Z',
  ].join(' ');
}

/**
 * One slice of a ring, as a real annulus — outer arc out, inner arc back, closed.
 *
 * This is the whole reason the donut no longer takes a `centerColor`. Painting a
 * disc over the middle of a pie only reads as a ring when the disc matches what
 * is behind the chart, which is a promise no component can keep on a gradient, a
 * photo, or glass. A cut hole is a hole on all of them.
 *
 * Angles are radians clockwise from 12 o'clock, which is where a part-to-whole
 * ring is read from.
 */
export function annulusPath({
  cx,
  cy,
  outerRadius,
  innerRadius,
  startAngle,
  endAngle,
}: {
  cx: number;
  cy: number;
  outerRadius: number;
  innerRadius: number;
  startAngle: number;
  endAngle: number;
}): string {
  const sweep = endAngle - startAngle;
  if (sweep <= 0 || outerRadius <= 0) return '';
  const TAU = Math.PI * 2;
  const at = (radius: number, angle: number) => ({
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  });

  // A single arc command cannot express a full turn — start and end coincide, so
  // the renderer draws nothing. A lone slice covering the whole ring goes round
  // in two halves instead.
  if (sweep >= TAU - 1e-6) {
    const mid = startAngle + Math.PI;
    const o1 = at(outerRadius, startAngle);
    const o2 = at(outerRadius, mid);
    const i1 = at(innerRadius, startAngle);
    const i2 = at(innerRadius, mid);
    const outer = `M${f(o1.x)},${f(o1.y)} A${f(outerRadius)},${f(outerRadius)} 0 0 1 ${f(o2.x)},${f(o2.y)} A${f(outerRadius)},${f(outerRadius)} 0 0 1 ${f(o1.x)},${f(o1.y)} Z`;
    if (innerRadius <= 0) return outer;
    // Reversed sweep so the even-odd/nonzero fill leaves the middle empty.
    const inner = `M${f(i1.x)},${f(i1.y)} A${f(innerRadius)},${f(innerRadius)} 0 0 0 ${f(i2.x)},${f(i2.y)} A${f(innerRadius)},${f(innerRadius)} 0 0 0 ${f(i1.x)},${f(i1.y)} Z`;
    return `${outer} ${inner}`;
  }

  const largeArc = sweep > Math.PI ? 1 : 0;
  const oStart = at(outerRadius, startAngle);
  const oEnd = at(outerRadius, endAngle);
  if (innerRadius <= 0) {
    return [
      `M${f(cx)},${f(cy)}`,
      `L${f(oStart.x)},${f(oStart.y)}`,
      `A${f(outerRadius)},${f(outerRadius)} 0 ${largeArc} 1 ${f(oEnd.x)},${f(oEnd.y)}`,
      'Z',
    ].join(' ');
  }
  const iEnd = at(innerRadius, endAngle);
  const iStart = at(innerRadius, startAngle);
  return [
    `M${f(oStart.x)},${f(oStart.y)}`,
    `A${f(outerRadius)},${f(outerRadius)} 0 ${largeArc} 1 ${f(oEnd.x)},${f(oEnd.y)}`,
    `L${f(iEnd.x)},${f(iEnd.y)}`,
    `A${f(innerRadius)},${f(innerRadius)} 0 ${largeArc} 0 ${f(iStart.x)},${f(iStart.y)}`,
    'Z',
  ].join(' ');
}

/* ----------------------------------------------------------------- morph --- */

/**
 * Resamples a series to `count` points by linear interpolation over position.
 *
 * This is the whole trick behind the period morph. "1W" and "1Y" are different
 * *lengths*, and you cannot interpolate between arrays of different lengths — so
 * both ends are resampled onto a common length first, and then it is just a
 * number-to-number tween per point.
 *
 * Resampling for the tween only. The rendered series is always the real one; a
 * resampled series is what the chart looks like mid-flight, never what it lands
 * on.
 */
export function resample(values: readonly number[], count: number): number[] {
  if (count <= 0) return [];
  if (values.length === 0) return new Array<number>(count).fill(0);
  if (values.length === 1) return new Array<number>(count).fill(values[0] as number);
  if (values.length === count) return [...values];

  const out: number[] = [];
  const lastIndex = values.length - 1;
  for (let i = 0; i < count; i += 1) {
    const position = count === 1 ? 0 : (i / (count - 1)) * lastIndex;
    const lower = Math.floor(position);
    const upper = Math.min(lastIndex, lower + 1);
    const t = position - lower;
    const a = values[lower] as number;
    const b = values[upper] as number;
    out.push(a + (b - a) * t);
  }
  return out;
}

/** Per-point tween between two equal-length series. */
export function interpolateSeries(
  from: readonly number[],
  to: readonly number[],
  t: number,
): number[] {
  return to.map((value, index) => {
    const start = from[index] ?? value;
    return start + (value - start) * t;
  });
}
