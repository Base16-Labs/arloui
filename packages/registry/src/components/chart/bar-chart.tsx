/**
 * Arlo UI — BarChart
 *
 * Categorical magnitude: spend per day, sessions per channel. Bars are the right
 * form when the categories are discrete and the comparison is "which is bigger" —
 * use `Chart` instead when the x-axis is continuous time.
 *
 *   <Chart.Bar data={[{ label: 'M', value: 32 }, { label: 'T', value: 18 }]} />
 *
 * One chart, three prop families rather than three components:
 *
 *   <Chart.Bar data={sleep} series={[activity]} variant="grouped" legend={['Sleep', 'Activity']} />
 *   <Chart.Bar data={private_} series={[state]} variant="stacked" legend={['Private', 'State']} />
 *   <Chart.Bar data={spend} layout="horizontal" format={money} />
 *
 * Deliberate choices:
 *
 * - **Data-ends are rounded, the baseline end is not.** A bar is anchored to its
 *   axis; rounding the anchored end would lift it off and misreport where zero is.
 *   A stacked pile rounds only at its top — the interior joins are part of the
 *   same bar, not bars of their own.
 * - **Negatives drop below the baseline** rather than being drawn as magnitudes,
 *   and the baseline moves to wherever zero falls. A stacked bar is part-to-total,
 *   so negatives clamp to zero there — a negative share of a whole is not a thing.
 * - **One hue per series.** A single-series bar chart is magnitude, not identity,
 *   so it does not spend the categorical palette; `tone` steers it. The moment a
 *   second series arrives identity is the story, so every series takes its
 *   validated palette slot and `tone` is ignored.
 * - **Selection instead of hover.** Tapping a category reports it and shows its
 *   value; there is no hover on a touch screen. The categories not selected fade
 *   to a light tint of their own colours rather than dropping out, so the shape
 *   of the whole series survives while one category is being read.
 * - **Bars never scale.** A bar's height *is* its datum, so a bar that grows from
 *   zero is animating the number. On a data change they cross-fade in place
 *   (`motion.chart.barSwap`) — the documented exception to the rule that things
 *   entering scale up.
 * - **Layout is a prop, not a form.** `layout="horizontal"` draws the same
 *   categories as ranked rows — label, track, value — for any ranked breakdown.
 *   It renders the first series; ranking two series at once is a table's job.
 *
 * Each category is its own `Pressable`, sized by the same slot arithmetic that
 * places the mark, so the tap target and the rectangle are the same box by
 * construction rather than by agreement with a library's private layout.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import {
  barPath,
  densityMetrics,
  seriesColorAt,
  toneColor,
  type ChartChrome,
  type ChartDensity,
  type ChartPoint,
  type ChartReference,
  type ChartTone,
} from './core';
import { EmptyContent, type ChartEmptyProps } from './empty';
import { useControllableIndex, useReduceMotion, useSkeletonPulse } from './hooks';
import { ChartLegend } from './legend';

/** A bar needs a name, so `label` is required here even though `ChartPoint`'s is not. */
export type BarDatum = ChartPoint & {
  label: string;
  /** Overrides the resolved colour for this bar alone. Single-series only. */
  color?: string;
};

/** How two or more series share a category. */
export type BarChartVariant = 'grouped' | 'stacked';

export type BarChartLayout = 'vertical' | 'horizontal';

/**
 * How much of its slot a category's mark takes up.
 *
 * A **fraction**, not a fixed gap. The gap used to be 1–2pt whatever the chart
 * was, which is a different picture at seven bars than at thirty: seven bars in
 * 350pt read as one solid block with hairlines scored into it. A fraction of the
 * slot looks the same at any count, which is what makes it a token rather than a
 * number someone tuned for one screenshot.
 *
 * `default` is 0.78 — the ratio the design file uses (a 34pt bar in a 44pt slot).
 */
export type BarChartSpacing = 'tight' | 'default' | 'loose';

const SPACING_FILL: Record<BarChartSpacing, number> = {
  tight: 0.94,
  default: 0.78,
  loose: 0.58,
};

/**
 * The same idea on the axis rows run along.
 *
 * Categories in a vertical chart march across the width, so spacing is how much
 * of its slot a bar fills. In a row chart they march *down*, so spacing is the
 * gap between rows. It is one question — how much air is between the marks —
 * asked of whichever axis the categories happen to use, which is why the control
 * should not go dead when the layout flips.
 *
 * A multiplier on the density-provided gap rather than a second set of absolute
 * values: density decides how tight the rows are to begin with, and spacing
 * moves them from there.
 */
const SPACING_ROW_GAP: Record<BarChartSpacing, number> = {
  tight: 0.5,
  default: 1,
  loose: 1.9,
};

export type BarSeries = readonly (BarDatum | number)[];

export type BarChartProps = {
  /** The first series. Bars want labels, so a bare `number[]` gets index labels. */
  data: readonly BarDatum[] | readonly number[];
  /**
   * Additional series, category-for-category with `data`. Two or more series
   * total is where the categorical palette starts and `tone` stops applying.
   */
  series?: readonly BarSeries[];
  /** How the series share each category. Grouped by default. */
  variant?: BarChartVariant;
  /** Series names. Their presence draws the legend; they also name bars to screen readers. */
  legend?: readonly string[];
  /** Vertical bars, or the same categories as ranked horizontal rows. */
  layout?: BarChartLayout;
  /**
   * How much air is between the marks.
   *
   * Vertical: how much of its slot each bar fills — the tap target stays the
   * whole slot, so loosening the bars never shrinks what you can hit.
   * Horizontal: the gap between rows. Same question, whichever axis the
   * categories run along.
   */
  spacing?: BarChartSpacing;
  height?: number;
  /**
   * Honours `brand` (default), `series`, `auto` (colour by sign), `positive`,
   * `negative`, and `neutral` — for a single series. With `series`, every bar
   * takes its own palette slot and this is ignored.
   */
  tone?: ChartTone;
  density?: ChartDensity;
  /**
   * What furniture the plot draws around the data.
   *
   * - `none` — the mark alone: no zero rule, and no rail behind a horizontal row
   * - `baseline` — the zero rule, drawn only when the data crosses zero. Nothing
   *   to draw for an all-positive chart, whose zero is the axis already
   * - `reference` — the above plus one labelled dashed line at a value you name
   *
   * `reference` **adds to** `baseline` rather than replacing it: in a bar chart
   * the zero line is structural, and signed data is unreadable without it.
   *
   * There is no `axis` member.
   */
  chrome?: ChartChrome;
  /** The labelled line drawn when `chrome="reference"`. */
  reference?: ChartReference;
  /** Selected category. Controlled when passed; `defaultActiveIndex` seeds the internal one. */
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onSelect?: (index: number, datum: BarDatum) => void;
  /**
   * Show every category's value. Off by default — a number on every mark is
   * noise. The selected category shows its value regardless, so selection is how
   * you read an exact figure. Multi-series charts show the category total.
   */
  showValues?: boolean;
  /** Show the category label under each bar. Forced off at `density="compact"`. */
  showLabels?: boolean;
  format?: (value: number) => string;
  /** Force the top of the scale; otherwise it comes from the data. */
  maxValue?: number;
  /** Rendered in place of the bars when `data` is empty. */
  emptyLabel?: string;
  /**
   * The composed empty slot — headline, one line, one action — the same one
   * `Chart.Empty` draws. Wins over `emptyLabel`, which stays for the case where
   * a bare string genuinely is the right answer.
   *
   * A bar chart with nothing in it is exactly as empty as a plot with nothing in
   * it, so the two must not say so differently.
   */
  empty?: ChartEmptyProps;
  /**
   * Draws grey bars at a fixed profile instead of the data. Same footprint as the
   * loaded chart — the row does not reflow when the values land, and the labels
   * stay off because a skeleton with real category names is half-loaded, not
   * loading.
   */
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * How much of an unselected category's colour survives. Low enough that the
 * selected one is unmistakably the subject, high enough that the others still
 * read as bars — for the default brand blue this lands on a light blue.
 */
const DIMMED_ALPHA = 0.22;
const LABEL_HEIGHT = 18;
const VALUE_HEIGHT = 16;


function normalizeBars(
  data: readonly (BarDatum | number)[],
  fallbackLabels?: readonly string[],
): BarDatum[] {
  return (data as ReadonlyArray<number | BarDatum>).map((entry, index) =>
    typeof entry === 'number'
      ? { value: entry, label: fallbackLabels?.[index] ?? String(index + 1) }
      : { ...entry, label: entry.label ?? fallbackLabels?.[index] ?? String(index + 1) },
  );
}

/**
 * The silhouette drawn while `loading`.
 *
 * Bars, not a spinner: the skeleton has to hold the same footprint the data will,
 * so the row does not reflow when it lands. The heights are a fixed, unremarkable
 * profile rather than random — a skeleton that reshapes on every render reads as
 * data arriving, and a reader will try to interpret it.
 */
const SKELETON_HEIGHTS = [0.45, 0.7, 0.35, 0.85, 0.55, 0.4, 0.65];

function BarSkeleton({
  width,
  height,
  count,
  spacing,
  radius,
}: {
  width: number;
  height: number;
  count: number;
  spacing: BarChartSpacing;
  radius: number;
}) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
  if (width === 0) return null;

  // The same slot arithmetic the loaded chart uses, so the silhouette holds the
  // exact footprint and nothing shifts sideways when the data lands.
  const slot = count > 0 ? width / count : 0;
  const barWidth = Math.max(0, slot * SPACING_FILL[spacing]);
  const markInset = Math.max(0, (slot - barWidth) / 2);
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity: pulse }]}
    >
      <Svg width={width} height={height}>
        {Array.from({ length: count }, (_, index) => {
          const fraction = SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length] ?? 0.5;
          const barHeight = height * fraction;
          return (
            <Path
              key={index}
              d={barPath({
                x: index * slot + markInset,
                y: height - barHeight,
                width: barWidth,
                height: barHeight,
                radius,
                roundedEnd: 'top',
              })}
              // `surfaceStrong`, the skeleton material the plot and the readouts
              // use. This was `surfaceInput`, a token lighter in light mode and
              // near-invisible against the surface in dark.
              fill={t.colors.surfaceStrong}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
}

/**
 * The labelled dashed line — a budget, an average — with its chip at the right
 * edge. The chip is opaque on purpose: it sits over the line it names, so the
 * line can run the full width and the two never have to agree on arithmetic.
 */
function ReferenceLine({ y, width, label }: { y: number; width: number; label: string }) {
  const t = useTokens();
  return (
    <>
      <Svg
        width={width}
        height={1}
        style={{ position: 'absolute', left: 0, top: y }}
        pointerEvents="none"
      >
        <Path
          d={`M0,0.5 L${width.toFixed(2)},0.5`}
          stroke={t.colors.focusRingMain}
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="none"
        />
      </Svg>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: 0,
          top: y - 9,
          backgroundColor: t.colors.feedbackInfoBg,
          borderRadius: 6,
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        <Text
          style={{
            color: t.colors.textInteractiveTertiary,
            fontFamily: t.fontFamilies.sans,
            fontSize: 10,
            lineHeight: 14,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      </View>
    </>
  );
}

export function BarChart(props: BarChartProps) {
  const { layout = 'vertical' } = props;
  return layout === 'horizontal' ? <HorizontalBars {...props} /> : <VerticalBars {...props} />;
}

function VerticalBars({
  data,
  series,
  variant = 'grouped',
  legend,
  spacing = 'default',
  height = 160,
  tone = 'brand',
  density = 'default',
  chrome = 'baseline',
  reference,
  activeIndex: activeIndexProp,
  defaultActiveIndex = null,
  onSelect,
  showValues = false,
  showLabels = true,
  format,
  maxValue,
  emptyLabel = 'No data',
  empty,
  loading = false,
  accessibilityLabel,
  style,
}: BarChartProps) {
  const t = useTokens();
  const [width, setWidth] = useState(0);
  const metrics = densityMetrics(density);
  const reduceMotion = useReduceMotion();
  const [selection, setSelection] = useControllableIndex(activeIndexProp, defaultActiveIndex);

  const allSeries = useMemo(() => {
    const first = normalizeBars(data);
    const labels = first.map((bar) => bar.label);
    return [first, ...(series ?? []).map((extra) => normalizeBars(extra, labels))];
  }, [data, series]);
  const bars = allSeries[0] as BarDatum[];
  const seriesCount = allSeries.length;
  const stacked = seriesCount > 1 && variant === 'stacked';
  const grouped = seriesCount > 1 && !stacked;

  const withLabels = showLabels && metrics.showLabels;

  const { top, bottom } = useMemo(() => {
    if (bars.length === 0) return { top: 0, bottom: 0 };
    let hi = 0;
    let lo = 0;
    if (stacked) {
      // Part-to-total: the ceiling is the tallest pile, negatives don't count.
      for (let index = 0; index < bars.length; index += 1) {
        let total = 0;
        for (const list of allSeries) total += Math.max(0, list[index]?.value ?? 0);
        if (total > hi) hi = total;
      }
    } else {
      for (const list of allSeries) {
        for (const bar of list) {
          if (bar.value > hi) hi = bar.value;
          if (bar.value < lo) lo = bar.value;
        }
      }
    }
    return { top: maxValue ?? hi, bottom: lo };
  }, [bars, allSeries, maxValue, stacked]);

  // The plot always includes zero, so bar lengths stay proportional to value.
  const span = top - bottom;
  const plotHeight = Math.max(0, height - (withLabels ? LABEL_HEIGHT : 0));

  /*
   * Value labels are drawn above the bar top and would clip at the top of the
   * plot, so the scale gives up a label's height of ceiling. Bars stay
   * proportional to each other — only the ceiling moves.
   *
   * The room is reserved for any chart that could ever show a value, not just one
   * showing them now: a selection can put a label over the tallest bar, and
   * reserving on selection instead would resize every bar on each tap.
   *
   * `reserved` is a top offset, not just a shorter drawing height. Shortening the
   * height alone leaves the tallest bar's top at y=0 with the spare room stranded
   * under the baseline, and its label — clamped to the top of the box — lands
   * inside the bar.
   */
  const canShowValues = showValues || onSelect != null || activeIndexProp !== undefined;
  const reserved = canShowValues && plotHeight > VALUE_HEIGHT ? VALUE_HEIGHT : 0;
  const drawHeight = plotHeight - reserved;

  /**
   * Value -> y within the plot box, with zero wherever the data puts it. Bars are
   * anchored to the floor (`plotHeight`) and grow up into `drawHeight`, so the
   * reserved band is the strip above the tallest bar.
   */
  const yFor = useCallback(
    (value: number) => {
      if (span === 0) return plotHeight;
      return plotHeight - ((value - bottom) / span) * drawHeight;
    },
    [span, bottom, drawHeight, plotHeight],
  );

  const zeroY = yFor(0);

  const seriesColor = useCallback(
    (seriesIndex: number, datum: BarDatum, categoryIndex: number) => {
      if (seriesCount > 1) return seriesColorAt(t, seriesIndex);
      if (datum.color) return datum.color;
      // A single measure asked to spend the palette colours per category —
      // each bar really is a different thing.
      if (tone === 'series') return seriesColorAt(t, categoryIndex);
      return toneColor(t, tone, { rising: datum.value >= 0 });
    },
    [seriesCount, tone, t],
  );

  const seriesName = useCallback(
    (index: number) => legend?.[index] ?? `Series ${index + 1}`,
    [legend],
  );

  /** The number the value label shows for a category: the pile's top when stacked. */
  const categoryTotal = useCallback(
    (index: number) => {
      if (!stacked) return allSeries.reduce((sum, list) => sum + (list[index]?.value ?? 0), 0);
      return allSeries.reduce((sum, list) => sum + Math.max(0, list[index]?.value ?? 0), 0);
    },
    [allSeries, stacked],
  );

  const formatValue = useCallback(
    (value: number) => (format ? format(value) : String(value)),
    [format],
  );

  /*
   * Bars cross-fade on a data change rather than sweeping up from zero. Fading
   * the whole mark layer is the honest version of "the numbers changed"; growing
   * each bar would animate the datum itself.
   */
  const [swap] = useState(() => new Animated.Value(1));
  const signature = allSeries
    .map((list) => list.map((bar) => `${bar.label}:${bar.value}`).join('|'))
    .join('||');
  useEffect(() => {
    if (reduceMotion) {
      swap.setValue(1);
      return;
    }
    swap.setValue(0.35);
    const animation = Animated.timing(swap, {
      toValue: 1,
      duration: t.motion.chart.barSwap.duration,
      easing: Easing.bezier(...t.motion.chart.barSwap.easing),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [signature, swap, reduceMotion, t.motion.chart.barSwap.duration, t.motion.chart.barSwap.easing]);

  const summary =
    accessibilityLabel ??
    (bars.length === 0
      ? emptyLabel
      : `Bar chart, ${bars.length} categories, ${bars
          .map((bar, index) =>
            allSeries
              .map((list, s) => (s === 0 ? `${bar.label} ${list[index]?.value ?? 0}` : list[index]?.value ?? 0))
              .join(', '),
          )
          .join(', ')}`);

  // A container element and focusable children are mutually exclusive, so the
  // chart picks whichever is actually useful: when bars are tappable each one is
  // its own button, and when they aren't the whole chart is a single element
  // announcing the summary.
  const interactive = onSelect != null || activeIndexProp !== undefined;

  // One slot per category, gaps included. The same numbers place the mark and
  // size the tap target, so the two cannot drift.
  /*
   * The slot is the category's full share of the width — tap target, label
   * column, and mark all measure from it, so they cannot drift apart. The mark
   * then fills a *fraction* of that slot and sits centred in it, which is what
   * puts air between bars without moving anything else.
   */
  const slot = bars.length > 0 ? width / bars.length : 0;
  const groupWidth = Math.max(0, slot * SPACING_FILL[spacing]);
  const gap = metrics.gap;
  // Grouped bars split the mark; stacked segments share its full width.
  const barWidth = grouped
    ? Math.max(0, (groupWidth - gap * (seriesCount - 1)) / seriesCount)
    : groupWidth;
  /** Left edge of the mark within its slot. */
  const markInset = Math.max(0, (slot - groupWidth) / 2);

  type Mark = { key: string; d: string; fill: string; opacity: number };

  const marks = useMemo(() => {
    if (width === 0 || bars.length === 0 || loading) return [];
    const out: Mark[] = [];
    const tint = (color: string, dimmed: boolean) =>
      dimmed && color.startsWith('#') ? rgbaFromHex(color, DIMMED_ALPHA) : color;
    const fade = (color: string, dimmed: boolean) =>
      dimmed && !color.startsWith('#') ? DIMMED_ALPHA : 1;

    for (let index = 0; index < bars.length; index += 1) {
      const categoryDimmed = selection != null && selection !== index;
      const categoryX = index * slot + markInset;

      if (stacked) {
        // Segments stack bottom-up in series order; only the pile's data end —
        // its top — is rounded. Interior joins stay square: they are seams in
        // one bar, not bars of their own.
        const segments: { s: number; bottom: number; top: number; datum: BarDatum }[] = [];
        let acc = 0;
        for (let s = 0; s < seriesCount; s += 1) {
          const datum = allSeries[s]?.[index];
          if (!datum) continue;
          const value = Math.max(0, datum.value);
          if (value <= 0) continue;
          segments.push({ s, bottom: acc, top: acc + value, datum });
          acc += value;
        }
        segments.forEach((segment, position) => {
          const yTop = yFor(segment.top);
          const yBottom = yFor(segment.bottom);
          const color = seriesColor(segment.s, segment.datum, index);
          out.push({
            key: `${index}-${segment.s}`,
            d: barPath({
              x: categoryX,
              y: yTop,
              // `barWidth`, not `slot`. A stack is one bar made of segments, so
              // it is exactly as wide as a single bar — and `categoryX` already
              // carries `markInset`, so drawing a full-slot segment at an inset
              // origin pushed the pile over its neighbour.
              width: barWidth,
              height: Math.max(0, yBottom - yTop),
              radius: position === segments.length - 1 ? metrics.barRadius : 0,
              roundedEnd: 'top',
            }),
            fill: tint(color, categoryDimmed),
            opacity: fade(color, categoryDimmed),
          });
        });
      } else {
        for (let s = 0; s < seriesCount; s += 1) {
          const datum = allSeries[s]?.[index];
          if (!datum) continue;
          const negative = datum.value < 0;
          const valueY = yFor(datum.value);
          out.push({
            key: `${index}-${s}`,
            d: barPath({
              x: categoryX + s * (barWidth + gap),
              y: negative ? zeroY : valueY,
              width: barWidth,
              height: Math.abs(valueY - zeroY),
              radius: metrics.barRadius,
              roundedEnd: negative ? 'bottom' : 'top',
            }),
            fill: tint(seriesColor(s, datum, index), categoryDimmed),
            opacity: fade(seriesColor(s, datum, index), categoryDimmed),
          });
        }
      }
    }
    return out;
  }, [
    bars,
    width,
    loading,
    barWidth,
    gap,
    slot,
    markInset,
    seriesCount,
    stacked,
    selection,
    yFor,
    zeroY,
    allSeries,
    metrics.barRadius,
    seriesColor,
  ]);

  /** Where the value label for a category sits: over the tallest mark in it. */
  const labelTopFor = useCallback(
    (index: number) => {
      if (stacked) return yFor(categoryTotal(index));
      let highest = zeroY;
      for (const list of allSeries) {
        const value = list[index]?.value ?? 0;
        highest = Math.min(highest, yFor(Math.max(0, value)));
      }
      return highest;
    },
    [stacked, yFor, categoryTotal, allSeries, zeroY],
  );

  const referenceY = chrome === 'reference' && reference != null ? yFor(reference.value) : null;
  const referenceLabel =
    reference != null ? (reference.label ?? formatValue(reference.value)) : '';

  const legendItems =
    legend != null && seriesCount > 1
      ? allSeries.map((_, s) => ({ label: seriesName(s), color: seriesColorAt(t, s) }))
      : null;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View style={[{ gap: t.spacing[2] }, style]}>
      <View
        onLayout={handleLayout}
        accessible={!interactive}
        accessibilityRole={interactive ? undefined : 'image'}
        accessibilityLabel={interactive ? undefined : summary}
        style={[{ height, width: '100%' }]}
      >
        {marks.length > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={{ position: 'absolute', top: 0, left: 0, opacity: reduceMotion ? 1 : swap }}
          >
            <Svg width={width} height={plotHeight}>
              {/*
                Two conditions, and the chrome one was missing.
                
                The rule only earns its place when the data actually crosses zero
                — an all-positive chart has its zero at the axis already. But it
                also has to answer to `chrome`, which it did not: it drew
                whatever was selected, so `none` was never "the mark alone" and
                `baseline` never turned anything on. `baseline` was a setting
                that did nothing, which is why it read as a duplicate of
                `reference` minus the label.
                
                `reference` keeps the rule too. In a bar chart the zero line is
                structural — with signed data you cannot read where the axis is
                without it — so it is not something a labelled line replaces.
              */}
              {chrome !== 'none' && bottom < 0 ? (
                <Path
                  d={`M0,${zeroY.toFixed(2)} L${width.toFixed(2)},${zeroY.toFixed(2)}`}
                  stroke={t.colors.borderSecondary}
                  strokeWidth={1}
                  fill="none"
                />
              ) : null}
              {marks.map((mark) => (
                <Path key={mark.key} d={mark.d} fill={mark.fill} opacity={mark.opacity} />
              ))}
            </Svg>
          </Animated.View>
        ) : null}

        {referenceY != null && !loading && width > 0 ? (
          <ReferenceLine y={referenceY} width={width} label={referenceLabel} />
        ) : null}

        {/* Value labels sit outside the SVG so they use the same type ramp as the
            rest of the interface rather than SVG's own text metrics. Single-series
            charts label the one bar; multi-series charts label the category total. */}
        {/*
          Never while loading. These used to render regardless, so a chart with
          `showValues` painted real figures over the grey silhouette — and
          positioned them by `yFor(bar.value)`, the *loaded* geometry, while the
          bars underneath used the fixed skeleton profile. Numbers floating at
          heights nothing on screen agreed with. Same rule as `Chart.Value`: a
          chart does not show a figure before it has one.
        */}
        {loading ? null : seriesCount === 1
          ? bars.map((bar, index) => {
              if (!(showValues || selection === index)) return null;
              const valueY = yFor(bar.value);
              return (
                <View
                  key={`value-${bar.label}-${index}`}
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: index * slot,
                    width: barWidth,
                    top: Math.max(0, Math.min(valueY, zeroY) - VALUE_HEIGHT),
                    alignItems: 'center',
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      color: selection === index ? t.colors.textPrimary : t.colors.textSecondary,
                      fontFamily: t.fontFamilies.sans,
                      fontSize: metrics.labelSize - 1,
                      fontWeight: '600',
                    }}
                  >
                    {formatValue(bar.value)}
                  </Text>
                </View>
              );
            })
          : bars.map((bar, index) => {
              if (!(showValues || selection === index)) return null;
              return (
                <View
                  key={`value-${bar.label}-${index}`}
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: index * slot,
                    width: slot,
                    top: Math.max(0, labelTopFor(index) - VALUE_HEIGHT),
                    alignItems: 'center',
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      color: selection === index ? t.colors.textPrimary : t.colors.textSecondary,
                      fontFamily: t.fontFamilies.sans,
                      fontSize: metrics.labelSize - 1,
                      fontWeight: '600',
                    }}
                  >
                    {formatValue(categoryTotal(index))}
                  </Text>
                </View>
              );
            })}

        {/* Tap targets and category labels. Full-height columns on the same slot
            arithmetic as the marks above — matching the bars' widths is what makes a
            tap land on the right category, and staying full height keeps the target
            comfortable for a short bar.

            Empty while loading: a skeleton you can select is a lie, and these carry
            the real category names and values in their accessibility labels, so
            leaving them mounted would read the not-yet-loaded data out loud. */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch', gap }}>
          {(loading ? [] : bars).map((bar, index) => {
            const selected = selection === index;
            return (
              <Pressable
                key={`${bar.label}-${index}`}
                accessible={interactive}
                accessibilityRole={interactive ? 'button' : undefined}
                accessibilityLabel={
                  interactive
                    ? seriesCount === 1
                      ? `${bar.label}, ${formatValue(bar.value)}`
                      : `${bar.label}, ${allSeries
                          .map((list, s) => `${seriesName(s)} ${formatValue(list[index]?.value ?? 0)}`)
                          .join(', ')}`
                    : undefined
                }
                accessibilityState={interactive ? { selected } : undefined}
                disabled={!interactive}
                onPress={() => {
                  // `selection`, not `impact` — picking one bar out of a row is the
                  // same gesture as moving through a picker.
                  void haptic('selection');
                  setSelection(selected ? null : index);
                  onSelect?.(index, bar);
                }}
                style={{ flex: 1, justifyContent: 'flex-end' }}
              >
                {withLabels ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      height: LABEL_HEIGHT,
                      textAlign: 'center',
                      color: selected ? t.colors.textPrimary : t.colors.textTertiary,
                      fontFamily: t.fontFamilies.sans,
                      fontSize: metrics.labelSize,
                      fontWeight: selected ? '700' : '500',
                    }}
                  >
                    {bar.label}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {loading ? (
          <BarSkeleton
            width={width}
            height={plotHeight}
            count={bars.length > 0 ? bars.length : SKELETON_HEIGHTS.length}
            spacing={spacing}
            radius={metrics.barRadius}
          />
        ) : null}

        {bars.length === 0 && !loading ? (
          <View
            /*
             * `box-none`, not `none`: the composed slot can carry an action, and
             * `none` would make that button — the only control on a chart with
             * no data — unpressable.
             */
            pointerEvents="box-none"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}
          >
            {empty ? (
              <EmptyContent {...empty} />
            ) : (
              <Text
                style={{
                  color: t.colors.textTertiary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  lineHeight: t.typography.bodySm.lineHeight,
                }}
              >
                {emptyLabel}
              </Text>
            )}
          </View>
        ) : null}
      </View>

      {legendItems ? <ChartLegend items={legendItems} /> : null}
    </View>
  );
}

/* ------------------------------------------------------------- horizontal --- */

/**
 * The row's corner radius, used by both the rail and the outer end of the fill
 * it holds. One constant because the two have to agree: the rail clips the fill,
 * so a fill rounded to a different radius reads as a rendering fault at
 * whichever end the clip is doing the work.
 */
const ROW_RADIUS = 5;

/**
 * What `density` means for rows.
 *
 * It used to mean almost nothing here: `densityMetrics` moved the label size by
 * a single point and set `showLabels: false`, so the only visible effect of
 * `compact` was hiding the labels — which is what the `showLabels` prop is for.
 * Two controls, one outcome, and the axis that is supposed to say "this chart is
 * going in a small space" said nothing about the rows.
 *
 * It now sizes the rows: the rail, the gaps between them, and the two columns
 * either side. And it no longer forces labels off. A vertical bar's label is a
 * caption underneath it; a **row's** label is the row's identity, so dropping it
 * leaves a list of anonymous bars. Density makes rows tighter; `showLabels`
 * decides whether they are named. Different questions, separate answers.
 */
const ROW_METRICS = {
  default: { height: 16, gap: 8, label: 72, value: 44, font: 11 },
  compact: { height: 10, gap: 5, label: 56, value: 38, font: 10 },
} as const;

/** Gap between the label column, the track, and the value column. */
const COLUMN_GAP = 10;

/**
 * The same categories as ranked rows: label, track, value. A ranked breakdown
 * reads better as rows than as rotated bars, so the horizontal layout is its own
 * render path over the same selection contract — not a second chart.
 *
 * **It answers the same props as the vertical path.** It used to take only
 * `data`, so `tone`, `series`, `variant`, `legend`, `chrome`, `reference`,
 * `showValues`, and `showLabels` were silently dropped the moment
 * `layout="horizontal"` was set — every one of those controls looked live and did
 * nothing, and a grouped or stacked chart quietly collapsed to its first series.
 * A prop that a component accepts and ignores is worse than one it does not
 * accept: there is no error to notice, just a control that does not work.
 */
function HorizontalBars({
  data,
  series,
  variant = 'grouped',
  legend,
  activeIndex: activeIndexProp,
  defaultActiveIndex = null,
  onSelect,
  format,
  maxValue,
  tone = 'brand',
  density = 'default',
  spacing = 'default',
  chrome = 'baseline',
  reference,
  showValues = false,
  showLabels = true,
  emptyLabel = 'No data',
  empty,
  loading = false,
  accessibilityLabel,
  style,
}: BarChartProps) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
  const [selection, setSelection] = useControllableIndex(activeIndexProp, defaultActiveIndex);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const width = size.width;

  const allSeries = useMemo(() => {
    const first = normalizeBars(data);
    const labels = first.map((bar) => bar.label);
    return [first, ...(series ?? []).map((extra) => normalizeBars(extra, labels))];
  }, [data, series]);
  const bars = allSeries[0] as BarDatum[];
  const seriesCount = allSeries.length;
  const stacked = seriesCount > 1 && variant === 'stacked';
  const grouped = seriesCount > 1 && !stacked;

  const interactive = onSelect != null || activeIndexProp !== undefined;
  // `showLabels` alone: `metrics.showLabels` is the vertical caption rule, and a
  // row's label is its identity rather than a caption.
  const withLabels = showLabels;
  const row = ROW_METRICS[density === 'compact' ? 'compact' : 'default'];
  const rowGap = Math.round(row.gap * SPACING_ROW_GAP[spacing]);
  /*
   * The rail — the grey track a row's fill sits in — is furniture, so `chrome`
   * governs it like every other piece.
   *
   * It is worth being able to turn off. A rail shows what the fill is a fraction
   * *of*, which is meaningful when the ceiling is a real one — a budget, a goal,
   * anything passed as `maxValue`. With no `maxValue` the ceiling is just the
   * largest row, so the rail is drawn at wherever the biggest item happened to
   * land: it looks like a target and is not one. A ranked breakdown is read by
   * comparing the rows to each other, and seven grey rectangles behind seven
   * coloured ones is noise in that reading.
   */
  const withRail = chrome !== 'none';
  /** Grouped rows split the rail into one thin track per series. */
  const groupRowGap = density === 'compact' ? 2 : 3;
  const groupRowHeight = density === 'compact' ? 8 : 12;

  /*
   * The track spans [floor, ceiling] and always contains zero, so a row's length
   * stays proportional to its value and a negative row reads as one — it grows
   * left from the zero anchor instead of clamping to nothing.
   *
   * The old scale was `value / max` clamped to [0, 1], which meant every negative
   * category rendered as an empty track. An all-negative series drew nothing at
   * all and looked like a loading failure.
   */
  const { floor, ceiling } = useMemo(() => {
    let hi = 0;
    let lo = 0;
    if (stacked) {
      // Part-to-total: the ceiling is the widest pile, negatives don't count.
      for (let index = 0; index < bars.length; index += 1) {
        let total = 0;
        for (const list of allSeries) total += Math.max(0, list[index]?.value ?? 0);
        if (total > hi) hi = total;
      }
    } else {
      for (const list of allSeries) {
        for (const bar of list) {
          if (bar.value > hi) hi = bar.value;
          if (bar.value < lo) lo = bar.value;
        }
      }
    }
    // A zero span would divide by zero; one full-width row is the honest floor.
    return { floor: lo, ceiling: Math.max(maxValue ?? hi, lo + 1) };
  }, [bars, allSeries, maxValue, stacked]);

  const span = ceiling - floor;

  const trackWidth = Math.max(
    0,
    width -
      (withLabels ? row.label + COLUMN_GAP : 0) -
      (row.value + COLUMN_GAP),
  );

  const colorFor = useCallback(
    (seriesIndex: number, datum: BarDatum, categoryIndex: number) => {
      if (seriesCount > 1) return seriesColorAt(t, seriesIndex);
      if (datum.color) return datum.color;
      if (tone === 'series') return seriesColorAt(t, categoryIndex);
      return toneColor(t, tone, { rising: datum.value >= 0 });
    },
    [seriesCount, tone, t],
  );

  const seriesName = useCallback(
    (index: number) => legend?.[index] ?? `Series ${index + 1}`,
    [legend],
  );

  const formatValue = useCallback(
    (value: number) => (format ? format(value) : String(value)),
    [format],
  );

  /** Multi-series rows report the category total, matching the vertical path. */
  const totalAt = useCallback(
    (index: number) =>
      allSeries.reduce((sum, list) => sum + (list[index]?.value ?? 0), 0),
    [allSeries],
  );

  const legendItems =
    legend != null && seriesCount > 1
      ? allSeries.map((_, index) => ({ label: seriesName(index), color: seriesColorAt(t, index) }))
      : null;

  /**
   * Where zero sits across the rail, 0–1. Zero for an all-positive chart, whose
   * fills already start at the rail's left edge.
   */
  const zeroAt = span === 0 ? 0 : (0 - floor) / span;
  /*
   * The zero rule, on the same terms as the vertical path: only when the data
   * actually crosses zero, and only when `chrome` asks for furniture. Rows were
   * missing it entirely — a signed row chart grows its fills left and right of a
   * zero anchor that nothing marked, so there was no way to see where the axis
   * was.
   */
  const showZeroRule = chrome !== 'none' && floor < 0;
  const referenceAt =
    chrome === 'reference' && reference != null && span > 0
      ? (reference.value - floor) / span
      : null;
  /** Left edge of the rail within the row, so the rules line up with the fills. */
  const railLeft = withLabels ? row.label + COLUMN_GAP : 0;
  /** A full-height vertical rule at a 0–1 position across the rail. */
  const ruleAt = (fraction: number) => {
    const x = railLeft + Math.min(Math.max(fraction, 0), 1) * trackWidth;
    return `M${x.toFixed(2)},0 L${x.toFixed(2)},${size.height.toFixed(2)}`;
  };

  const summary =
    accessibilityLabel ??
    (bars.length === 0
      ? emptyLabel
      : `Bar chart, ${bars.length} categories, ${bars
          .map((bar, index) => `${bar.label} ${seriesCount > 1 ? totalAt(index) : bar.value}`)
          .join(', ')}`);

  const skeletonCount = bars.length > 0 ? bars.length : 3;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width: w, height: h } = event.nativeEvent.layout;
    setSize((current) => (current.width === w && current.height === h ? current : { width: w, height: h }));
  }, []);

  if (!loading && bars.length === 0) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={summary}
        style={[{ minHeight: row.height, alignItems: 'center', justifyContent: 'center' }, style]}
      >
        {empty ? (
          <EmptyContent {...empty} />
        ) : (
          <Text
            style={{
              color: t.colors.textTertiary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.bodySm.fontSize,
              lineHeight: t.typography.bodySm.lineHeight,
            }}
          >
            {emptyLabel}
          </Text>
        )}
      </View>
    );
  }

  /** One filled span inside a track, positioned from the zero anchor. */
  const segment = (
    value: number,
    color: string,
    dimmed: boolean,
    height: number,
    offset = 0,
  ) => {
    const from = Math.min(value, 0);
    const to = Math.max(value, 0);
    const left = span === 0 ? 0 : (from - floor) / span;
    const size = span === 0 ? 0 : (to - from) / span;
    return (
      <View
        style={{
          position: 'absolute',
          left: `${left * 100}%`,
          width: `${size * 100}%`,
          top: offset,
          height,
          borderRadius: ROW_RADIUS,
          backgroundColor: dimmed && color.startsWith('#') ? rgbaFromHex(color, DIMMED_ALPHA) : color,
          opacity: dimmed && !color.startsWith('#') ? DIMMED_ALPHA : 1,
        }}
      />
    );
  };

  return (
    <View style={[{ gap: t.spacing[2] }, style]}>
      <View
        onLayout={handleLayout}
        accessible={!interactive}
        accessibilityRole={interactive ? undefined : 'image'}
        accessibilityLabel={interactive ? undefined : summary}
        style={{ gap: rowGap }}
      >
        {(loading ? Array.from({ length: skeletonCount }, () => null) : bars).map(
          (bar, index) => {
            if (loading) {
              const fraction = SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length] ?? 0.5;
              return (
                <View key={`skeleton-${index}`} style={{ flexDirection: 'row', alignItems: 'center', gap: COLUMN_GAP }}>
                  {withLabels ? (
                    <View style={{ width: row.label, height: row.font, borderRadius: 3, backgroundColor: t.colors.surfaceInput }} />
                  ) : null}
                  <View
                    style={{
                      flex: 1,
                      height: row.height,
                      borderRadius: ROW_RADIUS,
                      // Matches the loaded chart: a skeleton that shows rails the
                      // real rows will not have is a different layout, not a
                      // preview of one.
                      backgroundColor: withRail ? t.colors.surfaceInput : 'transparent',
                    }}
                  >
                    {/* `Animated.View`, not `View`: the pulse is an Animated.Value, and a
                        plain view hands the native side an object, not a number. */}
                    <Animated.View
                      style={{
                        width: `${Math.round(fraction * 100)}%`,
                        height: '100%',
                        borderRadius: ROW_RADIUS,
                        backgroundColor: t.colors.surfaceStrong,
                        opacity: pulse,
                      }}
                    />
                  </View>
                  <View style={{ width: row.value }} />
                </View>
              );
            }

            const datum = bar as BarDatum;
            const selected = selection === index;
            const dimmed = selection != null && !selected;
            const rowValue = seriesCount > 1 ? totalAt(index) : datum.value;
            const trackHeight = grouped
              ? seriesCount * groupRowHeight + (seriesCount - 1) * groupRowGap
              : row.height;

            // The value is the row's readout, but it stays on the same terms as
            // the vertical path: off unless asked for, and always on for the row
            // being read. The column keeps its width either way so toggling
            // values never reflows the track.
            const valueShown = showValues || selected;

            let stackedFrom = 0;

            return (
              <Pressable
                key={`${datum.label}-${index}`}
                accessible={interactive}
                accessibilityRole={interactive ? 'button' : undefined}
                accessibilityLabel={
                  interactive ? `${datum.label}, ${formatValue(rowValue)}` : undefined
                }
                accessibilityState={interactive ? { selected } : undefined}
                disabled={!interactive}
                onPress={() => {
                  void haptic('selection');
                  setSelection(selected ? null : index);
                  onSelect?.(index, datum);
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: COLUMN_GAP,
                  opacity: pressed ? t.motion.pressed.opacity : 1,
                  cursor: Platform.OS === 'web' ? 'pointer' : undefined,
                })}
              >
                {withLabels ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      width: row.label,
                      color: t.colors.textSecondary,
                      fontFamily: t.fontFamilies.sans,
                      fontSize: row.font,
                      lineHeight: row.font + 3,
                      fontWeight: '500',
                    }}
                  >
                    {datum.label}
                  </Text>
                ) : null}
                <View
                  style={{
                    flex: 1,
                    height: trackHeight,
                    borderRadius: ROW_RADIUS,
                    backgroundColor: withRail ? t.colors.surfaceInput : 'transparent',
                    overflow: 'hidden',
                  }}
                >
                  {grouped
                    ? allSeries.map((list, s) => {
                        const entry = list[index];
                        if (entry == null) return null;
                        return (
                          <View key={`s${s}`}>
                            {segment(
                              entry.value,
                              colorFor(s, entry, index),
                              dimmed,
                              groupRowHeight,
                              s * (groupRowHeight + groupRowGap),
                            )}
                          </View>
                        );
                      })
                    : stacked
                      ? (() => {
                          /*
                           * Only the outermost segment is rounded, exactly as the
                           * vertical path rounds the top of a stack and squares
                           * every segment under it. Rounding each segment would
                           * put a notch at every join.
                           *
                           * It has to be explicit rather than left to the rail's
                           * clip: the clip only rounds a fill that actually
                           * reaches the rail's edge, so the one category whose
                           * total set the ceiling came out rounded and every
                           * other row ended square — which reads as a bug in
                           * every row but the biggest.
                           */
                          const filled = allSeries
                            .map((list, s) => ({ s, value: Math.max(0, list[index]?.value ?? 0) }))
                            .filter((entry) => entry.value > 0);
                          const outermost = filled.length - 1;
                          return filled.map((entry, position) => {
                            const from = stackedFrom;
                            stackedFrom += entry.value;
                            const left = span === 0 ? 0 : (from - floor) / span;
                            const size = span === 0 ? 0 : entry.value / span;
                            const color = seriesColorAt(t, entry.s);
                            const end = position === outermost ? ROW_RADIUS : 0;
                            return (
                              <View
                                key={`s${entry.s}`}
                                style={{
                                  position: 'absolute',
                                  left: `${left * 100}%`,
                                  width: `${size * 100}%`,
                                  top: 0,
                                  height: row.height,
                                  borderTopRightRadius: end,
                                  borderBottomRightRadius: end,
                                  backgroundColor:
                                    dimmed && color.startsWith('#')
                                      ? rgbaFromHex(color, DIMMED_ALPHA)
                                      : color,
                                  opacity: dimmed && !color.startsWith('#') ? DIMMED_ALPHA : 1,
                                }}
                              />
                            );
                          });
                        })()
                      : segment(
                          datum.value,
                          colorFor(0, datum, index),
                          dimmed,
                          row.height,
                        )}
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    width: row.value,
                    textAlign: 'right',
                    color: t.colors.textPrimary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: row.font,
                    lineHeight: row.font + 3,
                    fontWeight: '700',
                    opacity: valueShown ? 1 : 0,
                  }}
                >
                  {formatValue(rowValue)}
                </Text>
              </Pressable>
            );
          },
        )}

        {/*
          The rule runs down the whole rows block rather than once per row — a
          ranked list is read down the column, so the line has to be continuous to
          be comparable against every row at once. Same dash and same hue as the
          vertical path's `ReferenceLine`; only the axis differs.
        */}
        {/*
          Both rules as one SVG overlay, drawn with `strokeDasharray`.
          
          They were `View`s with `borderStyle: 'dashed'` on a single side, at
          `width: 1` — where the border is the entire view. React Native's
          one-sided dashed borders do not render reliably, so the line was
          invisible and the only sign that `reference` had done anything was the
          chip. A stroked path dashes the same way on every platform, and it is
          what the vertical `ReferenceLine` already uses.
        */}
        {!loading && size.height > 0 && trackWidth > 0 ? (
          <Svg
            width={size.width}
            height={size.height}
            pointerEvents="none"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {showZeroRule ? (
              <Path
                d={ruleAt(zeroAt)}
                stroke={t.colors.borderSecondary}
                strokeWidth={1}
                fill="none"
              />
            ) : null}
            {referenceAt != null ? (
              <Path
                d={ruleAt(referenceAt)}
                stroke={t.colors.focusRingMain}
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="none"
              />
            ) : null}
          </Svg>
        ) : null}

        {/*
          The chip sits on the line it names, not under the chart. Below the rows
          it read as a caption for the whole thing rather than a marker for one
          position — which is the entire job of a reference.
        */}
        {referenceAt != null && !loading && trackWidth > 0 ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: railLeft + Math.min(Math.max(referenceAt, 0), 1) * trackWidth,
              transform: [{ translateX: '-50%' }],
              backgroundColor: t.colors.feedbackInfoBg,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                color: t.colors.textInteractiveTertiary,
                fontFamily: t.fontFamilies.sans,
                fontSize: 10,
                lineHeight: 14,
                fontWeight: '700',
              }}
            >
              {reference?.label ?? formatValue(reference?.value ?? 0)}
            </Text>
          </View>
        ) : null}
      </View>

      {legendItems ? <ChartLegend items={legendItems} /> : null}
    </View>
  );
}
