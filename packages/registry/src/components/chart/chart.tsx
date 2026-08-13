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
 * The other four forms hang off the same namespace, each a complete chart rather
 * than a part of the one above:
 *
 *   <Chart.Sparkline data={points} />        inline line, no chrome
 *   <Chart.Bar data={bars} />                categorical bars
 *   <Chart.Donut data={slices} />            part-to-whole, legend required
 *   <Chart.Meter value={n} max={m} />        one value against a target
 *
 * Deliberate choices:
 *
 * - **No axis furniture.** No ticks, no gridlines, no axis labels — `chrome` has
 *   no `axis` member and will not get one. The value readout is the label, and it
 *   updates as you scrub. A chart at this size answers "shape and direction", not
 *   "what exactly was Tuesday".
 * - **Direction, not identity.** One series, so no legend and no categorical
 *   palette — the tone is `chartPositive` / `chartNegative`, chosen by whether the
 *   series ended above or below the `baseline`.
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
import { AnimatedCounter } from '../animated-counter/animated-counter';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import {
  areaPath,
  densityMetrics,
  interpolateSeries,
  linePath,
  makeScale,
  resample,
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
import { useControllableIndex, useReduceMotion } from './hooks';
import { BarChart } from './bar-chart';
import { DonutChart } from './donut-chart';
import { Meter } from './meter';
import { Sparkline } from './sparkline';

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
  reference?: ChartReference;
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
  /** The one labelled line drawn when `chrome="reference"`. */
  reference?: ChartReference;
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
        slot = (child as ReactElement<{ children?: ReactNode }>).props.children;
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
 *   <Chart data={[]}>
 *     <Chart.Empty>No trades yet</Chart.Empty>
 *     <Chart.Plot />
 *   </Chart>
 */
function ChartEmpty(_: { children?: ReactNode }): ReactNode {
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
  const { points, displayIndex, format: contextFormat, formatAt } = useChart();
  const format = formatProp ?? contextFormat;
  const point = points[displayIndex];
  const value = point?.value ?? 0;
  const text = format ? format(value) : String(value);

  // The "when" line: whatever `formatAt` makes of the point's timestamp, else the
  // point's own label. Only rendered if one of them actually says something.
  const caption =
    showAt && point ? (formatAt ? formatAt(point.at, point) : point.label) : undefined;

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
  const { points, displayIndex, baseline, color, format: contextFormat } = useChart();
  const format = formatProp ?? contextFormat;
  const value = points[displayIndex]?.value ?? 0;
  const change = value - baseline;
  const sign = change > 0 ? '+' : change < 0 ? '−' : '';
  const magnitude = Math.abs(change);
  const percent = baseline === 0 ? 0 : (change / Math.abs(baseline)) * 100;
  const formatted = format ? format(magnitude) : String(magnitude);

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
  reference?: ChartReference;
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
  const metrics = densityMetrics(density);
  const inset = metrics.inset;

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
  const drawnRange = useMemo(() => {
    if (morphValues == null) return { min, span };
    let lo = morphValues[0] ?? 0;
    let hi = lo;
    for (const value of morphValues) {
      if (value < lo) lo = value;
      if (value > hi) hi = value;
    }
    return { min: lo, span: hi - lo };
  }, [morphValues, min, span]);

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
    chrome === 'baseline' && count > 1 && baseline >= min && baseline <= max && span > 0;
  const showReference = chrome === 'reference' && reference != null && count > 1;
  const referenceY = showReference ? scale.y(reference.value) : 0;

  const active = activeIndex != null && count > 1 && morphValues == null
    ? { x: scrubScale.x(activeIndex), y: scrubScale.y(values[activeIndex] ?? min) }
    : null;

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
        <PlotShimmer width={width} height={height} inset={inset} stroke={metrics.stroke} />
      ) : null}

      {drawable ? (
        <Svg width={width} height={height} style={{ position: 'absolute' }} pointerEvents="none">
          {area ? (
            <>
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={color} stopOpacity={0.22} />
                  <Stop offset="1" stopColor={color} stopOpacity={0} />
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

          {showReference ? (
            <Path
              d={`M${inset},${referenceY.toFixed(2)} L${(width - inset).toFixed(2)},${referenceY.toFixed(2)}`}
              stroke={t.colors.borderSecondary}
              strokeWidth={1}
              strokeDasharray="2 3"
              fill="none"
            />
          ) : null}

          <Path
            d={line}
            stroke={color}
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
                fill={color}
                stroke={t.colors.surfaceElevated}
                strokeWidth={2}
              />
            </>
          ) : null}
        </Svg>
      ) : null}

      {/* The reference line's label rides outside the SVG so it uses the same type
          ramp as everything else, rather than SVG's own text metrics. */}
      {drawable && showReference && metrics.showLabels ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', right: inset, top: referenceY - metrics.labelSize - 4 }}
        >
          <Text
            style={{
              color: t.colors.textTertiary,
              fontFamily: t.fontFamilies.sans,
              fontSize: metrics.labelSize,
              fontWeight: '600',
            }}
          >
            {reference?.label ?? (format ? format(reference?.value ?? 0) : String(reference?.value))}
          </Text>
        </View>
      ) : null}

      {!loading && message != null ? (
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center',
          }}
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
  stroke,
}: {
  width: number;
  height: number;
  inset: number;
  stroke: number;
}) {
  const t = useTokens();
  const reduceMotion = useReduceMotion();
  const [pulse] = useState(() => new Animated.Value(0.35));

  useEffect(() => {
    if (reduceMotion || width === 0) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.75,
          duration: t.motion.duration.slow,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: t.motion.duration.slow,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion, width, t.motion.duration.slow]);

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

  return (
    <Animated.View
      style={{ ...StyleSheet.absoluteFillObject, opacity: reduceMotion ? 0.4 : pulse }}
    >
      <Svg width={width} height={height} pointerEvents="none">
        <Path
          d={linePath(shape, 'smooth')}
          stroke={t.colors.borderSecondary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}

/** Time-range selector. Renders nothing when the chart was given no `periods`. */
function ChartPeriods({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const { periods, period, onPeriodChange, color } = useChart();
  if (periods.length === 0) return null;

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
 * `Value`/`Delta`/`Plot`/`Periods`/`Empty` compose the scrubbable chart above;
 * `Sparkline`, `Bar`, `Donut`, and `Meter` are whole charts in their own right,
 * namespaced here so picking a form is one decision at one import rather than
 * four names to remember. They stay in their own files — import those directly if
 * you only copied one form into your project.
 *
 * The forms Arlo does **not** ship, and will not: candlestick, radar, population
 * pyramid, scatter, 3-D anything, heatmaps, and stacked or grouped bars. They are
 * consumer-owned. `core.ts` exports the scale and the path builders, so writing
 * one against the same geometry is a supported thing to do — it is just not in
 * the kit.
 */
export const Chart = Object.assign(ChartRoot, {
  Value: ChartValue,
  Delta: ChartDelta,
  Plot: ChartPlot,
  Periods: ChartPeriods,
  Empty: ChartEmpty,
  Sparkline,
  Bar: BarChart,
  Donut: DonutChart,
  Meter,
});
