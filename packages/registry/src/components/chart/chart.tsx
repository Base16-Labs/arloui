/**
 * Arlo UI — Chart
 *
 * A single-series line/area chart you scrub with your finger, for the "how is this
 * number doing" screen: a portfolio, a balance, a metric over time.
 *
 *   <Chart data={points} periods={['1D','1W','1M','1Y','ALL']} period={p} onPeriodChange={setP}>
 *     <Chart.Value format={money} />
 *     <Chart.Delta format={money} />
 *     <Chart.Plot height={180} />
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
 * - **No axis furniture.** No ticks, no gridlines, no axis labels. The value readout
 *   is the label, and it updates as you scrub. A chart at this size answers "shape
 *   and direction", not "what exactly was Tuesday".
 * - **Direction, not identity.** One series, so no legend and no categorical palette —
 *   the tone is `chartPositive` / `chartNegative`, chosen by whether the series ended
 *   above or below where it started (or the `baseline`).
 * - **Direction is never colour-alone.** `Chart.Delta` always renders a sign, because
 *   the two tones sit near the deuteranopia separation floor. Don't render a bare
 *   coloured number instead.
 * - **Straight segments.** The path is not smoothed: a spline through sparse points
 *   invents peaks and troughs that were never in the data.
 *
 * The value and delta read from context, so they show the scrubbed point while a
 * drag is active and fall back to the latest point when it isn't.
 */
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  PanResponder,
  Platform,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { AnimatedCounter } from '../animated-counter/animated-counter';
import { useTokens } from '../../foundation/theme-provider';
import { BarChart } from './bar-chart';
import { DonutChart } from './donut-chart';
import { Meter } from './meter';
import { Sparkline } from './sparkline';

export type ChartTone = 'auto' | 'positive' | 'negative' | 'neutral';

type ChartContextValue = {
  data: number[];
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
  /** The series, oldest first. Needs at least two points to draw a line. */
  data: number[];
  children: ReactNode;
  /**
   * `'auto'` tones by whether the series ended above or below `baseline`
   * (defaults to the first point). Force it when the series' own direction isn't
   * the story — e.g. spending, where "up" is bad.
   */
  tone?: ChartTone;
  /** Reference value for tone and for the dashed baseline. Defaults to the first point. */
  baseline?: number;
  periods?: string[];
  period?: string;
  onPeriodChange?: (period: string) => void;
  style?: StyleProp<ViewStyle>;
};

function ChartRoot({
  data,
  children,
  tone = 'auto',
  baseline: baselineProp,
  periods = [],
  period,
  onPeriodChange,
  style,
}: ChartProps) {
  const t = useTokens();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const stats = useMemo(() => {
    const head = data[0];
    if (head == null) return { first: 0, last: 0, min: 0, max: 0 };
    let min = head;
    let max = head;
    for (const value of data) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
    return { first: head, last: data[data.length - 1] ?? head, min, max };
  }, [data]);

  const baseline = baselineProp ?? stats.first;

  const color =
    tone === 'neutral'
      ? t.colors.textPrimary
      : tone === 'positive'
        ? t.colors.chartPositive
        : tone === 'negative'
          ? t.colors.chartNegative
          : stats.last >= baseline
            ? t.colors.chartPositive
            : t.colors.chartNegative;

  const displayIndex = activeIndex ?? Math.max(0, data.length - 1);

  const ctx = useMemo<ChartContextValue>(
    () => ({
      data,
      activeIndex,
      setActiveIndex,
      displayIndex,
      color,
      baseline,
      periods,
      period,
      onPeriodChange,
      ...stats,
    }),
    [data, activeIndex, displayIndex, color, baseline, periods, period, onPeriodChange, stats],
  );

  return (
    <ChartContext.Provider value={ctx}>
      <View style={[{ gap: t.spacing[2] }, style]}>{children}</View>
    </ChartContext.Provider>
  );
}

/** The headline number. Rolls between values as you scrub. */
function ChartValue({
  format,
  style,
}: {
  format?: (value: number) => string;
  /** Wraps the counter, so this is a view style — the type ramp comes from tokens. */
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const { data, displayIndex } = useChart();
  const value = data[displayIndex] ?? 0;
  const text = format ? format(value) : String(value);

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
    </View>
  );
}

/**
 * Change from the baseline to the shown point. Always renders an explicit sign —
 * that sign is what keeps direction readable when the two tones are hard to tell
 * apart, so don't strip it.
 */
function ChartDelta({
  format,
  showPercent = true,
  style,
}: {
  format?: (value: number) => string;
  showPercent?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const t = useTokens();
  const { data, displayIndex, baseline, color } = useChart();
  const value = data[displayIndex] ?? 0;
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
  /** Dashed line at the baseline value. */
  showBaseline?: boolean;
  /** Turn off scrubbing for a static, decorative plot. */
  scrubbable?: boolean;
  /** Announced by screen readers in place of the visual plot. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const STROKE = 2;
/** Room for the stroke and the scrub dot so neither clips at the edges. */
const INSET = 6;

function ChartPlot({
  height = 180,
  fill = true,
  showBaseline = true,
  scrubbable = true,
  accessibilityLabel,
  style,
}: ChartPlotProps) {
  const t = useTokens();
  const { data, activeIndex, setActiveIndex, color, baseline, min, max, first, last } = useChart();
  const [width, setWidth] = useState(0);

  const count = data.length;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  // Depends on live layout rather than a render-written ref. The responder is
  // rebuilt when either changes; an in-flight gesture keeps the handlers it was
  // granted with, which is fine since width settles on first layout.
  const indexAt = useCallback(
    (x: number) => {
      if (count < 2 || width <= INSET * 2) return 0;
      const usable = width - INSET * 2;
      const ratio = (x - INSET) / usable;
      const index = Math.round(ratio * (count - 1));
      return Math.min(count - 1, Math.max(0, index));
    },
    [count, width],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => scrubbable,
        onMoveShouldSetPanResponder: () => scrubbable,
        // Claim the gesture so a parent ScrollView doesn't steal a horizontal drag.
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => setActiveIndex(indexAt(event.nativeEvent.locationX)),
        onPanResponderMove: (event) => setActiveIndex(indexAt(event.nativeEvent.locationX)),
        onPanResponderRelease: () => setActiveIndex(null),
        onPanResponderTerminate: () => setActiveIndex(null),
      }),
    [indexAt, setActiveIndex, scrubbable],
  );

  const plotHeight = height;
  const usableWidth = Math.max(0, width - INSET * 2);
  const usableHeight = Math.max(0, plotHeight - INSET * 2);
  // A flat series has no range to normalise against; draw it down the middle
  // instead of dividing by zero.
  const span = max - min;

  const pointAt = useCallback(
    (index: number) => {
      const count = data.length;
      const x = count < 2 ? INSET + usableWidth / 2 : INSET + (index / (count - 1)) * usableWidth;
      const ratio = span === 0 ? 0.5 : ((data[index] ?? min) - min) / span;
      const y = INSET + (1 - ratio) * usableHeight;
      return { x, y };
    },
    [data, min, span, usableWidth, usableHeight],
  );

  const linePath = useMemo(() => {
    if (data.length === 0 || width === 0) return '';
    return data
      .map((_, index) => {
        const { x, y } = pointAt(index);
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [data, pointAt, width]);

  const areaPath = useMemo(() => {
    if (!fill || !linePath || data.length < 2) return '';
    const start = pointAt(0);
    const end = pointAt(data.length - 1);
    const floor = plotHeight - INSET;
    return `${linePath} L${end.x.toFixed(2)},${floor} L${start.x.toFixed(2)},${floor} Z`;
  }, [fill, linePath, data.length, pointAt, plotHeight]);

  const baselineY = useMemo(() => {
    const ratio = span === 0 ? 0.5 : (baseline - min) / span;
    return INSET + (1 - ratio) * usableHeight;
  }, [baseline, min, span, usableHeight]);

  const showBaselineLine =
    showBaseline && data.length > 1 && baseline >= min && baseline <= max && span > 0;

  const active = activeIndex != null ? pointAt(activeIndex) : null;

  // Document-global, so a constant id would collide between two charts on one screen.
  const gradientId = `arloChartFill-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const summary =
    accessibilityLabel ??
    `Line chart, ${data.length} points, from ${first} to ${last}, low ${min}, high ${max}`;

  return (
    <View
      onLayout={handleLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={summary}
      style={[{ height: plotHeight, width: '100%' }, style]}
      {...(scrubbable ? panResponder.panHandlers : {})}
    >
      {width > 0 && data.length > 0 ? (
        <Svg width={width} height={plotHeight}>
          {fill ? (
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.22} />
                <Stop offset="1" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
          ) : null}

          {showBaselineLine ? (
            <Path
              d={`M${INSET},${baselineY.toFixed(2)} L${(width - INSET).toFixed(2)},${baselineY.toFixed(2)}`}
              stroke={t.colors.border}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          ) : null}

          {areaPath ? <Path d={areaPath} fill={`url(#${gradientId})`} /> : null}

          <Path
            d={linePath}
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {active ? (
            <>
              <Path
                d={`M${active.x.toFixed(2)},${INSET} L${active.x.toFixed(2)},${(plotHeight - INSET).toFixed(2)}`}
                stroke={t.colors.border}
                strokeWidth={1}
              />
              {/* Surface ring keeps the dot readable where it overlaps the line. */}
              <Circle cx={active.x} cy={active.y} r={6} fill={color} stroke={t.colors.surface} strokeWidth={2} />
            </>
          ) : null}
        </Svg>
      ) : null}
    </View>
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
            onPress={() => onPeriodChange?.(option)}
            hitSlop={8}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 32,
              paddingHorizontal: t.spacing[2],
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: t.radii.md,
              backgroundColor: selected ? t.colors.surfaceInput : 'transparent',
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
 * `Value`/`Delta`/`Plot`/`Periods` compose the scrubbable chart above; `Sparkline`,
 * `Bar`, `Donut`, and `Meter` are whole charts in their own right, namespaced here
 * so picking a form is one decision at one import rather than four names to
 * remember. They stay in their own files — import those directly if you only
 * copied one form into your project.
 */
export const Chart = Object.assign(ChartRoot, {
  Value: ChartValue,
  Delta: ChartDelta,
  Plot: ChartPlot,
  Periods: ChartPeriods,
  Sparkline,
  Bar: BarChart,
  Donut: DonutChart,
  Meter,
});
