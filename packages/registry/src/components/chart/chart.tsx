/**
 * Arlo UI — Chart
 *
 * A single-series line/area chart you scrub with your finger, for the "how is this
 * number doing" screen: a portfolio, a balance, a metric over time.
 *
 *   <Chart data={points} periods={['1D','1W','1M','1Y','ALL']} period={p} onPeriodChange={setP} />
 *
 * That is the whole call. With no children the chart renders its documented
 * composition — value, delta, plot, periods, in that order. Name the parts when
 * you need to reorder or drop one:
 *
 *   <Chart data={points} format={formatMoney('USD')}>
 *     <Chart.Plot height={180} />
 *     <Chart.Value />
 *     <Chart.Periods />
 *   </Chart>
 *
 * The other five forms hang off the same namespace, each a complete chart rather
 * than a part of the one above:
 *
 *   <Chart.Sparkline data={points} />        inline line, no chrome
 *   <Chart.Bar data={bars} />                categorical bars
 *   <Chart.Donut data={slices} />            part-to-whole, legend required
 *   <Chart.Meter value={n} max={m} />        one value against a target
 *   <Chart.Heatmap data={days} />            calendar grid, no library needed
 *
 * Deliberate choices:
 *
 * - **No axis furniture.** No ticks, no gridlines, no axis labels — `chrome` has
 *   no `axis` member and will not get one. The value readout is the label, and it
 *   updates as you scrub. A chart at this size answers "shape and direction", not
 *   "what exactly was Tuesday".
 * - **Direction, not identity.** One series, so no legend and no categorical
 *   palette — the tone is `chartPositive` / `chartNegative`, chosen by whether the
 *   series ended above or below the `baseline`. The exceptions are explicit: a
 *   `compare` line and a `range` band are drawn in the neutral and the brand hue
 *   respectively, and `Chart.Legend` names them.
 * - **Direction is never colour-alone.** `Chart.Delta` always renders a sign,
 *   because the two tones sit near the deuteranopia separation floor.
 * - **Straight segments by default.** A spline through sparse points invents peaks
 *   and troughs that were never in the data, so `Chart.Plot` joins points with
 *   straight lines unless you ask for `curve="smooth"`.
 *
 * Arlo draws all of this itself, on `react-native-svg`. The geometry lives in
 * `core.ts` and there is exactly one scale, which is what puts the crosshair on
 * the line rather than near it.
 */
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { rgbaFromHex } from '@arloui/tokens';
import { AnimatedCounter } from '../animated-counter/animated-counter';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import {
  areaPath,
  bandPath,
  densityMetrics,
  interpolateSeries,
  linePath,
  makeScale,
  resample,
  seriesColorAt,
  seriesStats,
  toPoints,
  toneColor,
  valuesOf,
  type ChartChrome,
  type ChartCurve,
  type ChartData,
  type ChartDensity,
  type ChartPoint,
  type ChartReference,
  type ChartTone,
} from './core';
import { EmptyContent, type ChartEmptyProps } from './empty';
import { SkeletonBlock } from './skeleton';

export type { ChartEmptyProps };
import { useControllableIndex, useReduceMotion, useSkeletonPulse } from './hooks';
import { BarChart } from './bar-chart';
import { DonutChart } from './donut-chart';
import { Meter } from './meter';
import { Sparkline } from './sparkline';
import { Heatmap } from './heatmap';
import { ChartLegend } from './legend';

export type { ChartCurve, ChartTone, ChartDensity, ChartChrome, ChartPoint, ChartData };

type ChartContextValue = {
  points: ChartPoint[];
  values: number[];
  /** Index under the finger, or `null` when nothing is being scrubbed. */
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  /** The point the readout should show: the scrubbed one, else the last. */
  displayIndex: number;
  color: string;
  baseline: number;
  first: number;
  last: number;
  min: number;
  max: number;
  span: number;
  density: ChartDensity;
  chrome: ChartChrome;
  reference?: ChartReference | readonly ChartReference[];
  format?: (value: number) => string;
  formatAt?: (at: ChartPoint['at'], point: ChartPoint) => string;
  loading: boolean;
  empty?: ReactNode;
  periods: string[];
  period?: string;
  onPeriodChange?: (period: string) => void;
};

const ChartContext = createContext<ChartContextValue | null>(null);

function useChart(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('Chart.* must be rendered inside <Chart>');
  return ctx;
}

export type ChartProps = {
  /** The series, oldest first. Bare numbers, or points carrying a time and a label. */
  data: ChartData;
  /**
   * Omit for the documented composition: value, delta, plot, periods. Name the
   * parts when you need a different order, or only some of them.
   */
  children?: ReactNode;
  /**
   * `'auto'` tones by whether the series ended above or below `baseline`. Force it
   * when the series' own direction isn't the story — e.g. spending, where "up" is
   * bad. A line has no categories, so `'series'` is treated as `'brand'`.
   */
  tone?: ChartTone;
  /** Reference value for tone and for the dashed baseline. Defaults to the first point. */
  baseline?: number;
  /** Stroke, dot, and label weight. `'compact'` drops labels for inline use. */
  density?: ChartDensity;
  /** Plot furniture. There is no `axis` member. */
  chrome?: ChartChrome;
  /**
   * The labelled line(s) drawn when `chrome="reference"` — one line, or several
   * for the min/max pair a dense series reads against. Not a band system.
   */
  reference?: ChartReference | readonly ChartReference[];
  /** Formats every value in the subtree — readout, delta, reference label. */
  format?: (value: number) => string;
  /** Formats a point's `at` for `Chart.Value`, so the readout can say *when*. */
  formatAt?: (at: ChartPoint['at'], point: ChartPoint) => string;
  periods?: string[];
  period?: string;
  onPeriodChange?: (period: string) => void;
  /** Controlled scrub position. Leave undefined to let the chart hold it. */
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  /** Fires on every scrub change, controlled or not. `null` on release. */
  onScrub?: (index: number | null, point: ChartPoint | null) => void;
  /** Renders the plot's silhouette as a shimmer instead of the series. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The documented default. Written out rather than generated so the order is
 * something you can read, and so `<Chart data periods />` and the spelled-out
 * form are provably the same chart.
 */
function defaultComposition() {
  return (
    <>
      <ChartValue />
      <ChartDelta />
      <ChartPlot />
      <ChartPeriods />
    </>
  );
}

function ChartRoot({
  data,
  children,
  tone = 'auto',
  baseline: baselineProp,
  density = 'default',
  chrome = 'baseline',
  reference,
  format,
  formatAt,
  periods = [],
  period,
  onPeriodChange,
  activeIndex: activeIndexProp,
  defaultActiveIndex = null,
  onScrub,
  loading = false,
  style,
}: ChartProps) {
  const t = useTokens();
  const [activeIndex, setInternalActive] = useControllableIndex(activeIndexProp, defaultActiveIndex);

  const points = useMemo(() => toPoints(data), [data]);
  const values = useMemo(() => valuesOf(points), [points]);
  const stats = useMemo(() => seriesStats(points), [points]);

  const baseline = baselineProp ?? stats.first;
  const color = toneColor(t, tone, { rising: stats.last >= baseline });
  const displayIndex = activeIndex ?? Math.max(0, points.length - 1);

  const setActiveIndex = useCallback(
    (index: number | null) => {
      setInternalActive(index);
      onScrub?.(index, index == null ? null : (points[index] ?? null));
    },
    [setInternalActive, onScrub, points],
  );

  /*
   * `Chart.Empty` is configuration, not output: it contributes what the plot
   * should draw when there is no series, and renders nothing itself. Pulling it
   * out of the children here keeps it declarative without needing an effect to
   * register it, and without the plot and the slot both painting a message.
   */
  const { empty, rest } = useMemo(() => {
    if (children == null) return { empty: undefined, rest: null };
    let slot: ReactNode;
    const kept: ReactNode[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === ChartEmpty) {
        const props = (child as ReactElement<ChartEmptyProps>).props;
        // `children` is the escape hatch and wins outright; otherwise the slot
        // is the standard headline / line / action arrangement.
        slot =
          props.children ??
          (props.title || props.description || props.action ? (
            <EmptyContent {...props} />
          ) : undefined);
        return;
      }
      kept.push(child);
    });
    return { empty: slot, rest: kept };
  }, [children]);

  const ctx = useMemo<ChartContextValue>(
    () => ({
      points,
      values,
      activeIndex,
      setActiveIndex,
      displayIndex,
      color,
      baseline,
      density,
      chrome,
      reference,
      format,
      formatAt,
      loading,
      empty,
      periods,
      period,
      onPeriodChange,
      ...stats,
    }),
    [
      points,
      values,
      activeIndex,
      setActiveIndex,
      displayIndex,
      color,
      baseline,
      density,
      chrome,
      reference,
      format,
      formatAt,
      loading,
      empty,
      periods,
      period,
      onPeriodChange,
      stats,
    ],
  );

  return (
    <ChartContext.Provider value={ctx}>
      <View style={[{ gap: t.spacing[2] }, style]}>{children == null ? defaultComposition() : rest}</View>
    </ChartContext.Provider>
  );
}

/**
 * What the plot draws when the series is empty. Renders nothing where you put it —
 * the plot picks the content up and draws it in its own box, so the chart keeps
 * its height and the layout doesn't jump when data arrives.
 *
 * Failing to a blank rectangle is how a data screen looks broken, so the default
 * arrangement is a headline, one line, and one action:
 *
 *   <Chart data={[]}>
 *     <Chart.Empty
 *       title="No activity yet"
 *       description="Your spending will show up here once you make your first transaction."
 *       action={{ label: 'Log a transaction', onPress: open }}
 *     />
 *     <Chart.Plot />
 *   </Chart>
 *
 * `children` still takes anything, and a bare string still works — the slot was
 * a string before it had this shape and consumers should not have to migrate for
 * a default they were already happy with.
 */
function ChartEmpty(_: ChartEmptyProps): ReactNode {
  return null;
}

/** The headline number. Rolls between values as you scrub. */
function ChartValue({
  format: formatProp,
  /** Show the active point's `at` under the number. Needs `formatAt` on the root. */
  showAt = true,
  style,
}: {
  format?: (value: number) => string;
  showAt?: boolean;
  /** Wraps the counter, so this is a view style — the type ramp comes from tokens. */
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const { points, displayIndex, format: contextFormat, formatAt, loading } = useChart();
  const format = formatProp ?? contextFormat;
  const point = points[displayIndex];
  const value = point?.value ?? 0;
  const text = format ? format(value) : String(value);

  // The "when" line: whatever `formatAt` makes of the point's timestamp, else the
  // point's own label. Only rendered if one of them actually says something.
  const caption =
    showAt && point ? (formatAt ? formatAt(point.at, point) : point.label) : undefined;

  if (loading) {
    return (
      <View style={[{ alignItems: 'flex-start', gap: 6 }, style]}>
        <SkeletonBlock width={150} height={26} radius={7} />
      </View>
    );
  }

  return (
    <View style={[{ alignItems: 'flex-start' }, style]}>
      <AnimatedCounter
        text={text}
        fontSize={t.typography.displayMedium.fontSize}
        lineHeight={t.typography.displayMedium.lineHeight}
        // Ink, not the series colour — the line already carries direction.
        color={t.colors.textPrimary}
        fontFamily={t.fontFamilies.sans}
        fontWeight="700"
      />
      {caption ? (
        <Text
          style={{
            color: t.colors.textSecondary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight,
          }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Change from the baseline to the shown point. Always renders an explicit sign —
 * that sign is what keeps direction readable when the two tones are hard to tell
 * apart, so don't strip it.
 */
function ChartDelta({
  format: formatProp,
  showPercent = true,
  style,
}: {
  format?: (value: number) => string;
  showPercent?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const t = useTokens();
  const { points, displayIndex, baseline, color, format: contextFormat, loading } = useChart();
  const format = formatProp ?? contextFormat;
  const value = points[displayIndex]?.value ?? 0;
  const change = value - baseline;
  const sign = change > 0 ? '+' : change < 0 ? '−' : '';
  const magnitude = Math.abs(change);
  const percent = baseline === 0 ? 0 : (change / Math.abs(baseline)) * 100;
  const formatted = format ? format(magnitude) : String(magnitude);

  // A signed delta is a claim about direction. There is nothing to claim yet.
  if (loading) return <SkeletonBlock width={96} height={13} radius={5} />;

  return (
    <Text
      style={[
        {
          color,
          fontFamily: t.fontFamilies.sans,
          fontSize: t.typography.body.fontSize,
          lineHeight: t.typography.body.lineHeight,
          fontWeight: '600',
        },
        style,
      ]}
    >
      {sign}
      {formatted}
      {showPercent ? ` (${sign}${Math.abs(percent).toFixed(2)}%)` : ''}
    </Text>
  );
}

/** The two bounds of the shaded band `Chart.Plot` draws for a `range`. */
export type ChartRange = { lower: ChartData; upper: ChartData };

export type ChartPlotProps = {
  height?: number;
  /** Fade a gradient under the line. */
  fill?: boolean;
  /** Turn off scrubbing for a static, decorative plot. */
  scrubbable?: boolean;
  /** Straight segments (default) or a fitted spline. See `ChartCurve`. */
  curve?: ChartCurve;
  /** Overrides the root's `chrome` for this plot. */
  chrome?: ChartChrome;
  /** One reference line, or several — the min/max pair a dense series reads against. */
  reference?: ChartReference | readonly ChartReference[];
  /**
   * A second series, drawn dashed in the neutral hue — the baseline a projection
   * is measured against. It never takes the scrub: one series answers to the
   * finger, the other is context.
   */
  compare?: ChartData;
  /**
   * A shaded band between two bounds — the "likely range" behind a projection.
   * A prop on Plot rather than a new form: the readout, the scrub, and the tone
   * all still belong to the primary series.
   */
  range?: ChartRange;
  /**
   * Series stacked on top of the primary — part-to-total over time, the shape a
   * bar chart draws with `variant="stacked"` when the x-axis is continuous
   * rather than categorical.
   *
   * Each entry is added to the running total, so the top edge of the last layer
   * is the sum of everything. They take the categorical palette and are drawn as
   * filled bands, not lines: a stack is read by the thickness of each layer, and
   * outlining every one turns it back into a set of overlapping lines.
   *
   * `stack` is distinct from `compare`, which is a *second* series measured
   * against the first rather than added to it — and from `range`, which is one
   * band around one series. Stacking implies the parts sum to something
   * meaningful; the other two do not.
   *
   * The primary still owns the scrub, the readout, and the tone. Negatives are
   * clamped to zero, matching the bar chart: a negative share of a total is not
   * a thing the shape can express.
   */
  stack?: readonly ChartData[];
  /**
   * Floating readout pill above the crosshair while scrubbing, showing the
   * formatted value of the point under the finger. The big `Chart.Value` stays
   * the primary readout — this is for dense series where the eye is on the plot,
   * not above it.
   */
  tooltip?: boolean;
  /** Shown when the series is empty. `Chart.Empty` wins over this. */
  emptyLabel?: string;
  /** Shown for a one-point series, which has no shape to draw. */
  notEnoughLabel?: string;
  /** Announced by screen readers in place of the visual plot. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** A generic rise-and-settle silhouette, drawn while `loading`. */
const SHIMMER_SHAPE = [0.35, 0.5, 0.42, 0.68, 0.55, 0.78, 0.7, 0.92];

function ChartPlot({
  height = 180,
  fill = true,
  scrubbable = true,
  curve = 'steep',
  chrome: chromeProp,
  reference: referenceProp,
  compare,
  stack,
  range,
  tooltip = false,
  emptyLabel = 'No data',
  notEnoughLabel = 'Not enough data',
  accessibilityLabel,
  style,
}: ChartPlotProps) {
  const t = useTokens();
  const {
    points,
    values,
    activeIndex,
    setActiveIndex,
    color,
    baseline,
    min,
    max,
    span,
    first,
    last,
    density,
    chrome: contextChrome,
    reference: contextReference,
    format,
    loading,
    empty,
  } = useChart();
  const chrome = chromeProp ?? contextChrome;
  const reference = referenceProp ?? contextReference;
  /*
   * `reference` accepts one line or the min/max pair. Normalising here keeps
   * every draw site a loop over a list rather than a branch per arity.
   */
  const references = useMemo(() => {
    if (reference == null) return [];
    return (Array.isArray(reference) ? reference : [reference]).filter(
      (entry) => typeof entry?.value === 'number',
    );
  }, [reference]);
  const metrics = densityMetrics(density);
  const inset = metrics.inset;

  const compareValues = useMemo(() => (compare ? valuesOf(toPoints(compare)) : []), [compare]);

  /**
   * The stack as cumulative top edges, outermost last.
   *
   * Each layer carries the running total rather than its own value, because that
   * is what gets drawn: a stacked area is a set of nested areas, and the band a
   * reader sees is the gap between one cumulative edge and the one below it.
   * Summing at draw time instead would recompute the same totals per frame.
   */
  const stackLayers = useMemo(() => {
    if (!stack || stack.length === 0) return [];
    const layers: number[][] = [];
    let running = values.slice();
    for (const entry of stack) {
      const next = valuesOf(toPoints(entry));
      running = running.map((total, index) => total + Math.max(0, next[index] ?? 0));
      layers.push(running);
    }
    return layers;
  }, [stack, values]);
  const upperValues = useMemo(() => (range ? valuesOf(toPoints(range.upper)) : []), [range]);
  const lowerValues = useMemo(() => (range ? valuesOf(toPoints(range.lower)) : []), [range]);

  const [width, setWidth] = useState(0);
  const reduceMotion = useReduceMotion();
  const count = points.length;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  /*
   * Period morph. Two periods are different *lengths*, so there is nothing to
   * tween between until both ends are resampled onto a common length — then it is
   * one number per point. What gets drawn mid-flight is the interpolated series;
   * what it lands on is always the real one, so no frame of this is data the
   * chart invented and kept.
   */
  const [morphValues, setMorphValues] = useState<number[] | null>(null);
  const previousValues = useRef<number[]>(values);
  // Lazy `useState`, not `useRef(new Animated.Value())`: the ref form allocates a
  // throwaway Value every render and reads `.current` during render, which is what
  // the refs lint rule exists to catch.
  const [progress] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const from = previousValues.current;
    const to = values;
    previousValues.current = to;

    const unchanged = from.length === to.length && from.every((v, i) => v === to[i]);
    // A first paint has nothing to morph from, and a scrub in flight must not be
    // interrupted by the line moving under the finger.
    if (unchanged || from.length === 0 || to.length === 0 || reduceMotion) {
      setMorphValues(null);
      return;
    }

    const frames = Math.max(from.length, to.length);
    const a = resample(from, frames);
    const b = resample(to, frames);

    progress.setValue(0);
    const id = progress.addListener(({ value: p }) => setMorphValues(interpolateSeries(a, b, p)));
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: t.motion.chart.data.duration,
      easing: Easing.bezier(...t.motion.chart.data.easing),
      // Path `d` is a string built in JS — there is no native equivalent to drive.
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      // Land on the real series, not on the last interpolated frame.
      if (finished) setMorphValues(null);
    });
    return () => {
      animation.stop();
      progress.removeListener(id);
      setMorphValues(null);
    };
  }, [values, progress, reduceMotion, t.motion.chart.data.duration, t.motion.chart.data.easing]);

  /*
   * Mid-morph the drawn series is the interpolated one, so the scale has to be
   * built from whatever is actually on screen — otherwise a series moving into a
   * new range would clip against the old one for the length of the tween.
   */
  const drawnValues = morphValues ?? values;

  /*
   * The scale has to fit everything that is drawn, not just the primary series —
   * a compare line or a band that pokes past the primary's extremes would clip.
   * The extras are static per layout, so the union is one scan.
   */
  const extrasRange = useMemo(() => {
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const list of [compareValues, upperValues, lowerValues, ...stackLayers]) {
      for (const value of list) {
        if (value < lo) lo = value;
        if (value > hi) hi = value;
      }
    }
    return lo === Number.POSITIVE_INFINITY ? null : { min: lo, max: hi };
  }, [compareValues, upperValues, lowerValues, stackLayers]);

  const drawnRange = useMemo(() => {
    let lo = morphValues ? (morphValues[0] ?? 0) : min;
    let hi = morphValues ? lo : max;
    if (morphValues) {
      for (const value of morphValues) {
        if (value < lo) lo = value;
        if (value > hi) hi = value;
      }
    }
    if (extrasRange) {
      lo = Math.min(lo, extrasRange.min);
      hi = Math.max(hi, extrasRange.max);
    }
    return { min: lo, span: hi - lo };
  }, [morphValues, min, max, extrasRange]);

  const scale = useMemo(
    () =>
      makeScale({
        count: drawnValues.length,
        min: drawnRange.min,
        span: drawnRange.span,
        width,
        height,
        inset,
      }),
    [drawnValues.length, drawnRange.min, drawnRange.span, width, height, inset],
  );

  /*
   * The extras share the primary's domain but not its point count, so each is
   * placed by a scale of its own — a forecast band may sample monthly against a
   * daily primary line, and both still have to land on the same x track.
   */
  const extraScale = useCallback(
    (seriesCount: number) =>
      makeScale({
        count: seriesCount,
        min: drawnRange.min,
        span: drawnRange.span,
        width,
        height,
        inset,
      }),
    [drawnRange.min, drawnRange.span, width, height, inset],
  );

  const band = useMemo(() => {
    if (width === 0 || upperValues.length === 0 || lowerValues.length === 0) return '';
    const upper = extraScale(upperValues.length);
    const lower = extraScale(lowerValues.length);
    return bandPath(
      upperValues.map((value, index) => ({ x: upper.x(index), y: upper.y(value) })),
      lowerValues.map((value, index) => ({ x: lower.x(index), y: lower.y(value) })),
      curve,
    );
  }, [upperValues, lowerValues, width, extraScale, curve]);

  /*
   * The compare line and the band take the plot's `curve`, not a hardcoded one.
   *
   * This was pinned to `'steep'`, so `curve="smooth"` drew a fitted spline for the
   * primary over a hard-cornered comparison and a hard-cornered band — three
   * marks over the same x-range disagreeing about how the data is interpolated.
   * `curve` is one decision for the whole plot.
   */
  /**
   * Each layer as a closed band between its own top edge and the edge below it.
   *
   * Drawn outermost-first so the nearer layers paint over the farther ones — the
   * fills are opaque, so a stack drawn the other way would bury every band but
   * the last under the total.
   */
  const stackBands = useMemo(() => {
    if (width === 0 || stackLayers.length === 0) return [];
    const toPts = (list: readonly number[]) => {
      const s = extraScale(list.length);
      return list.map((value, index) => ({ x: s.x(index), y: s.y(value) }));
    };
    return stackLayers
      .map((layer, index) => ({
        d: bandPath(toPts(layer), toPts(stackLayers[index - 1] ?? values), curve),
        // Slot 0 belongs to the primary, which takes a palette slot too once it
        // is stacked — see `lineColor`.
        color: seriesColorAt(t, index + 1),
      }))
      .reverse();
  }, [stackLayers, values, width, extraScale, curve, t]);

  /*
   * Once a plot is stacked, the primary takes a palette slot and `tone` stops
   * applying — the same rule the bar chart uses for `series`, and for the same
   * reason: a stack is a set of categories, not one measurement with a
   * direction, so there is nothing for `positive`/`negative` to mean.
   *
   * It also has to be this way to stay legible. The layers came off the
   * categorical palette while the primary stayed on the tone palette, and those
   * two sets are not checked against each other: the default `auto` tone
   * resolves to `chartPositive` (#008236, green) and the first layer landed on
   * `chartSeries2` (#65A30D, olive) — two greens side by side in the same stack,
   * with a legend claiming they were different things.
   */
  const stacked = stackLayers.length > 0;
  const lineColor = stacked ? seriesColorAt(t, 0) : color;

  const comparePath = useMemo(() => {
    if (width === 0 || compareValues.length < 2) return '';
    const compare = extraScale(compareValues.length);
    return linePath(
      compareValues.map((value, index) => ({ x: compare.x(index), y: compare.y(value) })),
      curve,
    );
  }, [compareValues, width, extraScale, curve]);

  // The scale the *gesture* reads. Pinned to the real series so the index under
  // the finger never depends on how far through a morph the chart happens to be.
  const scrubScale = useMemo(
    () => makeScale({ count, min, span, width, height, inset }),
    [count, min, span, width, height, inset],
  );

  // One tick per point the scrub actually lands on. Keying off the committed
  // index rather than the touch stream is what collapses a drag's many move
  // events down to the handful of points it crossed — React drops the re-render
  // when the index doesn't change, so this effect doesn't run either.
  useEffect(() => {
    if (activeIndex == null) return;
    void haptic('selection');
  }, [activeIndex]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => scrubbable,
        onMoveShouldSetPanResponder: () => scrubbable,
        // Claim the gesture so a parent ScrollView doesn't steal a horizontal drag.
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) =>
          setActiveIndex(scrubScale.indexAt(event.nativeEvent.locationX)),
        onPanResponderMove: (event) =>
          setActiveIndex(scrubScale.indexAt(event.nativeEvent.locationX)),
        onPanResponderRelease: () => setActiveIndex(null),
        onPanResponderTerminate: () => setActiveIndex(null),
      }),
    [scrubScale, setActiveIndex, scrubbable],
  );

  const plotPoints = useMemo(
    () => drawnValues.map((value, index) => ({ x: scale.x(index), y: scale.y(value) })),
    [drawnValues, scale],
  );

  const line = linePath(plotPoints, curve);
  const area = fill ? areaPath(plotPoints, height - inset, curve) : '';

  const baselineY = scale.y(baseline);
  const showBaseline =
    chrome === 'baseline' &&
    count > 1 &&
    baseline >= drawnRange.min &&
    baseline <= drawnRange.min + drawnRange.span &&
    drawnRange.span > 0;
  const showReferences = chrome === 'reference' && references.length > 0 && count > 1;

  const active = activeIndex != null && count > 1 && morphValues == null
    ? { x: scrubScale.x(activeIndex), y: scrubScale.y(values[activeIndex] ?? min) }
    : null;

  // Measured once so the pill can be kept inside the plot at the plot's edges.
  const [pillWidth, setPillWidth] = useState(0);
  const activeValue = activeIndex != null ? (values[activeIndex] ?? 0) : 0;
  const tooltipText = tooltip && active ? (format ? format(activeValue) : String(activeValue)) : null;
  const pillLeft =
    active && pillWidth > 0
      ? Math.min(
          Math.max(active.x, pillWidth / 2 + 2),
          Math.max(pillWidth / 2 + 2, width - pillWidth / 2 - 2),
        )
      : (active?.x ?? 0);

  // Per instance: two charts on one screen resolve to different colours but would
  // share one document-global gradient id, so the first definition would win.
  const gradientId = `arloChartFill-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const summary =
    accessibilityLabel ??
    (loading
      ? 'Chart loading'
      : count === 0
        ? emptyLabel
        : count === 1
          ? notEnoughLabel
          : `Line chart, ${count} points, from ${first} to ${last}, low ${min}, high ${max}`);

  const message =
    count === 0 ? (empty ?? emptyLabel) : count === 1 ? notEnoughLabel : null;
  const drawable = !loading && count > 1 && width > 0;

  return (
    <View
      onLayout={handleLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={summary}
      style={[{ height, width: '100%' }, style]}
      {...(scrubbable && drawable ? panResponder.panHandlers : {})}
    >
      {loading ? (
        <PlotShimmer width={width} height={height} inset={inset} />
      ) : null}

      {drawable ? (
        <Svg width={width} height={height} style={{ position: 'absolute' }} pointerEvents="none">
          {band ? (
            <Path
              d={band}
              fill={rgbaFromHex(t.colors.interactivePrimary, 0.12)}
              stroke="none"
            />
          ) : null}

          {/*
            Under the primary, which keeps the line that answers the scrub on top
            of everything it is stacked with.
          */}
          {stackBands.map((layer, index) => (
            <Path key={`stack-${index}`} d={layer.d} fill={layer.color} stroke="none" />
          ))}

          {area ? (
            <>
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={lineColor} stopOpacity={0.22} />
                  <Stop offset="1" stopColor={lineColor} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path d={area} fill={`url(#${gradientId})`} />
            </>
          ) : null}

          {showBaseline ? (
            <Path
              d={`M${inset},${baselineY.toFixed(2)} L${(width - inset).toFixed(2)},${baselineY.toFixed(2)}`}
              stroke={t.colors.borderSecondary}
              strokeWidth={1}
              strokeDasharray="3 4"
              fill="none"
            />
          ) : null}

          {showReferences
            ? references.map((entry, index) => (
                <Path
                  key={`reference-${index}-${entry.value}`}
                  d={`M${inset},${scale.y(entry.value).toFixed(2)} L${(width - inset).toFixed(2)},${scale.y(entry.value).toFixed(2)}`}
                  stroke={t.colors.borderSecondary}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                  fill="none"
                />
              ))
            : null}

          {comparePath ? (
            <Path
              d={comparePath}
              stroke={t.colors.chartOther}
              strokeWidth={metrics.stroke}
              strokeLinecap="round"
              strokeDasharray="4 4"
              fill="none"
            />
          ) : null}

          <Path
            d={line}
            stroke={lineColor}
            strokeWidth={metrics.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {active ? (
            <>
              <Path
                d={`M${active.x.toFixed(2)},${inset} L${active.x.toFixed(2)},${(height - inset).toFixed(2)}`}
                stroke={t.colors.borderSecondary}
                strokeWidth={1}
                fill="none"
              />
              {/* Surface ring keeps the dot readable where it overlaps the line. */}
              <Circle
                cx={active.x}
                cy={active.y}
                r={metrics.dot}
                fill={lineColor}
                stroke={t.colors.surfaceElevated}
                strokeWidth={2}
              />
            </>
          ) : null}
        </Svg>
      ) : null}

      {/* Reference labels ride outside the SVG so they use the same type ramp as
          everything else, rather than SVG's own text metrics. */}
      {drawable &&
        showReferences &&
        references.map((entry, index) => (
          <View
            key={`reference-label-${index}-${entry.value}`}
            pointerEvents="none"
            style={{ position: 'absolute', right: inset, top: scale.y(entry.value) - metrics.labelSize - 4 }}
          >
            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.mono,
                fontSize: metrics.labelSize - 1,
                fontWeight: '500',
              }}
            >
              {entry.label ?? (format ? format(entry.value) : String(entry.value))}
            </Text>
          </View>
        ))}

      {/* The scrub readout: a pill above the crosshair, kept inside the plot once
          its width is known. Same ramp rule as the labels above — RN text, not
          SVG text. */}
      {drawable && tooltipText != null && active ? (
        <View
          pointerEvents="none"
          onLayout={(event) => setPillWidth(event.nativeEvent.layout.width)}
          style={{
            position: 'absolute',
            left: pillLeft,
            top: Math.max(0, active.y - metrics.dot - 28),
            transform: [{ translateX: '-50%' }],
            backgroundColor: t.colors.surfaceInverse,
            borderRadius: 6,
            paddingHorizontal: 9,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              color: t.colors.textInverse,
              fontFamily: t.fontFamilies.sans,
              fontSize: 11,
              lineHeight: 14,
              fontWeight: '700',
            }}
          >
            {tooltipText}
          </Text>
        </View>
      ) : null}

      {!loading && message != null ? (
        <View
          /*
           * `box-none`, not `none`: an empty slot can carry an action, and
           * `none` made that button unpressable — the one control on a screen
           * with no data, dead. `box-none` keeps the overlay itself out of the
           * way of the plot while letting its children take a touch.
           */
          pointerEvents="box-none"
          // `absoluteFill`, not `absoluteFillObject`: RN 0.86 dropped the latter, and
          // it fails silently — the lookup is `undefined`, so the overlay defines no
          // geometry and collapses to zero size.
          style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}
        >
          {typeof message === 'string' ? (
            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {message}
            </Text>
          ) : (
            message
          )}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Loading is the plot's own silhouette, pulsing — not a grey rectangle. A block
 * where a chart goes tells you the layout; a line where the line goes tells you
 * what is arriving.
 */
function PlotShimmer({
  width,
  height,
  inset,
}: {
  width: number;
  height: number;
  inset: number;
}) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);

  if (width === 0) return null;

  const scale = makeScale({
    count: SHIMMER_SHAPE.length,
    min: 0,
    span: 1,
    width,
    height,
    inset,
  });
  const shape = SHIMMER_SHAPE.map((value, index) => ({ x: scale.x(index), y: scale.y(value) }));

  /*
   * A filled silhouette, not a stroked line.
   *
   * The skeleton has to hold the same visual weight the plot will, and a hairline
   * over an empty box reads as a drawn chart with no data rather than as one
   * still arriving. Filling the silhouette gives the loading state the mass of
   * the area it stands in for, so nothing re-weights when the series lands.
   */
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: pulse }]}>
      <Svg width={width} height={height} pointerEvents="none">
        <Path d={areaPath(shape, height - inset, 'smooth')} fill={t.colors.surfaceStrong} />
      </Svg>
    </Animated.View>
  );
}

/** Time-range selector. Renders nothing when the chart was given no `periods`. */
function ChartPeriods({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const { periods, period, onPeriodChange, color, loading } = useChart();
  if (periods.length === 0) return null;

  /*
   * Skeleton pills while loading, not a live selector.
   *
   * A pressable period row over a chart that has no series lets the reader ask
   * for 1Y and get the same shimmer back, so the control reads as broken. It
   * keeps the row's exact footprint so nothing reflows when the data lands.
   */
  if (loading) {
    return (
      <View
        // Not a tablist while there is nothing to select between.
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
        style={[{ flexDirection: 'row', alignItems: 'center', gap: 6 }, style]}
      >
        {periods.map((option) => (
          <View key={option} style={{ flex: 1 }}>
            <SkeletonBlock width="100%" height={26} radius={t.radii.md} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View
      accessibilityRole="tablist"
      style={[{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[1] }, style]}
    >
      {periods.map((option) => {
        const selected = option === period;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityLabel={option}
            accessibilityState={{ selected }}
            onPress={() => {
              void haptic('selection');
              onPeriodChange?.(option);
            }}
            hitSlop={8}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 32,
              paddingHorizontal: t.spacing[2],
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: t.radii.md,
              backgroundColor: selected ? t.colors.surfaceInput : 'transparent',
              // The control answers instantly; the series it selects is what takes
              // `motion.chart.data` to morph.
              opacity: pressed ? t.motion.pressed.opacity : 1,
              cursor: Platform.OS === 'web' ? 'pointer' : undefined,
            })}
          >
            <Text
              style={{
                color: selected ? color : t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
                fontWeight: selected ? '700' : '500',
              }}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * `Value`/`Delta`/`Plot`/`Periods`/`Empty`/`Legend` compose the scrubbable chart
 * above; `Sparkline`, `Bar`, `Donut`, `Meter`, and `Heatmap` are whole charts in
 * their own right, namespaced here so picking a form is one decision at one
 * import rather than five names to remember. They stay in their own files —
 * import those directly if you only copied one form into your project.
 *
 * The forms Arlo does **not** ship, and will not: candlestick, radar, population
 * pyramid, scatter, and 3-D anything. They are consumer-owned. `core.ts` exports
 * the scale and the path builders, so writing one against the same geometry is a
 * supported thing to do — it is just not in the kit.
 */
export const Chart = Object.assign(ChartRoot, {
  Value: ChartValue,
  Delta: ChartDelta,
  Plot: ChartPlot,
  Periods: ChartPeriods,
  Empty: ChartEmpty,
  Legend: ChartLegend,
  Sparkline,
  Bar: BarChart,
  Donut: DonutChart,
  Meter,
  Heatmap,
});
