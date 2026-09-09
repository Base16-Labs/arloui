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
import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import {
  seriesStats,
  toneColor,
  toPoints,
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
import { allParts, collectParts, ChartLoading, ChartMotion } from './hooks';
import { ChartContext, type ChartContextValue } from './chart-context';
import { ChartValue, ChartDelta, ChartPeriods, ChartTitle } from './readouts';
import {
  ChartPlot,
  ChartBarsPart,
  ChartLinePart,
  ChartBaselinePart,
  ChartReferencePart,
  ChartCrosshairPart,
} from './plot';
import { ChartLegend } from './legend';
import { useControllableIndex } from './hooks';

export type { ChartEmptyProps };
export type { ChartCurve, ChartTone, ChartDensity, ChartChrome, ChartPoint, ChartData };
export type { ChartRange, ChartPlotProps, ChartBarsProps, ChartLineProps } from './plot';
export { useChart } from './chart-context';

export type ChartProps = {
  /** Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. */
  animated?: boolean;
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
  /**
   * The labelled line(s) drawn when `chrome="reference"` — one line, or several
   * for the min/max pair a dense series reads against. Not a band system.
   */
  /** Formats every value in the subtree — readout, delta, reference label. */
  format?: (value: number) => string;
  /** Formats a point's `at` for `Chart.Value`, so the readout can say *when*. */
  formatAt?: (at: ChartPoint['at'], point: ChartPoint) => string;
  /** The period selector's options, e.g. `["1D", "1W", "1M"]`. Passing them is what makes `Chart.Periods` render anything. */
  periods?: string[];
  /** The selected period. Controlled — pair it with `onPeriodChange`. */
  period?: string;
  /** Called with the period a tap selected. The chart does not refetch; you swap `data`. */
  onPeriodChange?: (period: string) => void;
  /** Controlled scrub position. Leave undefined to let the chart hold it. */
  activeIndex?: number | null;
  /**
   * Scrub position as an x-*value* rather than an index.
   *
   * `activeIndex` is an index into this chart's own series, so two charts
   * sharing one only line up if their points line up — same length, same order,
   * same dates. Daily prices beside weekly volume track confidently and wrongly,
   * and nothing on screen says so.
   *
   * `activeAt` is resolved against each chart's own `at` values, so linked
   * charts agree about *when* rather than about *which index*:
   *
   *   const [at, setAt] = useState<ChartPoint['at']>(undefined);
   *   <Chart data={price}  activeAt={at} onScrub={(_, p) => setAt(p?.at)} />
   *   <Chart data={volume} activeAt={at} onScrub={(_, p) => setAt(p?.at)} />
   *
   * Wins over `activeIndex` when both are passed. Points with no `at` cannot be
   * matched, so a series of bare numbers falls back to the index.
   */
  activeAt?: number | string | Date | null;
  /** Where the scrub starts when it is uncontrolled. `null` means "show the last point". */
  defaultActiveIndex?: number | null;
  /** Fires on every scrub change, controlled or not. `null` on release. */
  onScrub?: (index: number | null, point: ChartPoint | null) => void;
  /** Reserves the plot with a neutral pulsing placeholder until data is ready. */
  loading?: boolean;
  /** Keep the last supplied data visible during a background fetch. Overrides loading. */
  refreshing?: boolean;
  /** Style for the chart's outer container. */
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

function ChartRoot(props: ChartProps) {
  return <ChartMotion animated={props.animated}><ChartLoading loading={props.loading} refreshing={props.refreshing}>{(loading) => <ChartInner {...props} loading={loading} />}</ChartLoading></ChartMotion>;
}

function ChartInner({
  data,
  children,
  tone = 'auto',
  baseline: baselineProp,
  density = 'default',
  format,
  formatAt,
  periods = [],
  period,
  onPeriodChange,
  activeIndex: activeIndexProp,
  activeAt,
  defaultActiveIndex = null,
  onScrub,
  loading = false,
  refreshing = false,
  style,
}: ChartProps) {
  const t = useTokens();
  const [activeIndex, setInternalActive] = useControllableIndex(activeIndexProp, defaultActiveIndex);

  const points = useMemo(() => toPoints(data), [data]);
  const values = useMemo(() => valuesOf(points), [points]);
  const stats = useMemo(() => seriesStats(points), [points]);

  const baseline = baselineProp ?? stats.first;
  const color = toneColor(t, tone, { rising: stats.last >= baseline });
  /**
   * `activeAt` resolved against this chart's own points: the nearest `at`, by
   * numeric distance where the axis is numeric or dated, and by exact match
   * where it is a string. Returns null when nothing can be matched, which
   * leaves `activeIndex` in charge rather than guessing at index 0.
   */
  const indexAtValue = useMemo(() => {
    if (activeAt == null) return null;
    const target = activeAt instanceof Date ? activeAt.getTime() : activeAt;
    if (typeof target === 'string') {
      const found = points.findIndex((point) => point.at === target);
      return found === -1 ? null : found;
    }
    let best: number | null = null;
    let bestGap = Number.POSITIVE_INFINITY;
    points.forEach((point, index) => {
      if (point.at == null) return;
      const at = point.at instanceof Date ? point.at.getTime() : point.at;
      if (typeof at !== 'number') return;
      const gap = Math.abs(at - target);
      if (gap < bestGap) {
        bestGap = gap;
        best = index;
      }
    });
    return best;
  }, [activeAt, points]);

  const resolvedIndex = indexAtValue ?? activeIndex;
  const displayIndex = resolvedIndex ?? Math.max(0, points.length - 1);

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
    for (const props of allParts<ChartEmptyProps>(collectParts(children), ChartEmpty)) {
      // `children` is the escape hatch and wins outright; otherwise the slot
      // is the standard headline / line / action arrangement.
      slot =
        props.children ??
        (props.title || props.description || props.action ? (
          <EmptyContent {...props} />
        ) : undefined);
    }
    // Empty parts render null; preserve the original tree and its React keys.
    return { empty: slot, rest: children };
  }, [children]);

  /**
   * Only when there is a slot to show. Without one the chart keeps its shape and
   * the plot draws its own short message, which is the right answer for a small
   * chart with no room for an arrangement.
   */
  const showEmptySlot = !loading && stats.count === 0 && empty != null;

  const ctx = useMemo<ChartContextValue>(
    () => ({
      points,
      values,
      activeIndex: resolvedIndex,
      setActiveIndex,
      displayIndex,
      color,
      baseline,
      density,
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
      resolvedIndex,
      setActiveIndex,
      displayIndex,
      color,
      baseline,
      density,
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
      <View accessibilityState={{ busy: loading || refreshing }} style={[{ gap: t.spacing[2] }, style]}>
        {/*
          An empty chart is the slot and nothing else.
          
          The slot used to be drawn *inside* the plot's box, which left the
          readout, the delta, and the period selector standing around it — a
          `$0.00` and a `+0.00%` describing a series that is not there, over a
          row of periods that select between nothing and nothing. Every one of
          those is a claim about data the chart does not have.
          
          Composition is the reason this belongs at the root rather than in the
          plot: only the root knows what else was put beside it.
        */}
        {showEmptySlot ? (
          /*
           * A bare string still has to be wrapped. The plot used to do it on the
           * way past; with the slot rendered here instead, an unwrapped string
           * is a raw text node inside a `View` — invalid in React Native, and
           * invisible to anything looking for text.
           */
          typeof empty === 'string' ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: t.spacing[6] }}>
              <Text
                style={{
                  color: t.colors.textTertiary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  lineHeight: t.typography.bodySm.lineHeight,
                }}
              >
                {empty}
              </Text>
            </View>
          ) : (
            empty
          )
        ) : children == null ? (
          defaultComposition()
        ) : (
          rest
        )}
      </View>
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

export const ChartPlotParts = {
  Bars: ChartBarsPart,
  Line: ChartLinePart,
  Baseline: ChartBaselinePart,
  Reference: ChartReferencePart,
  Crosshair: ChartCrosshairPart,
  Title: ChartTitle,
  Value: ChartValue,
  Delta: ChartDelta,
  Plot: ChartPlot,
  Periods: ChartPeriods,
  Empty: ChartEmpty,
  Legend: ChartLegend,
};

export { ChartRoot };

/**
 * The namespace, assembled here rather than in the barrel.
 *
 * `chart-plot` is installable on its own, and on its own it used to hand you
 * `ChartRoot` plus a `ChartPlotParts` object — so the documented call,
 * `<Chart><Chart.Value /></Chart>`, did not work for the one entry whose whole
 * job is that call. Assembling here means a standalone plot install reads
 * exactly like the examples.
 *
 * `Object.assign` mutates `ChartRoot`, so the barrel extending this with the
 * other five forms is the same object — there is one `Chart`, not two.
 */
export const Chart = Object.assign(ChartRoot, ChartPlotParts);

/** Explicit name for the time-series chart; `Chart` remains compatible. */
export const LineChart = Chart;
