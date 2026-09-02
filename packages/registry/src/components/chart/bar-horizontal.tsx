/**
 * Arlo UI — Bar chart, horizontal
 *
 * The same categories as ranked rows. A different enough shape — rails, row
 * gaps, labels in a column beside the marks — to be its own renderer rather
 * than a branch inside the vertical one.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import { densityMetrics, seriesColorAt, toneColor } from './core';
import { EmptyContent } from './empty';
import { useControllableIndex, useReduceMotion, useSkeletonPulse } from './hooks';
import { ChartLegend } from './legend';
import Svg, { Path } from 'react-native-svg';
import { SkeletonSheen } from './skeleton';
import {
  DIMMED_ALPHA,
  SKELETON_HEIGHTS,
  SPACING_ROW_GAP,
  normalizeBars,
  type BarChartResolved,
  type BarDatum,
} from './bar-shared';

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
export function HorizontalBars({
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
}: BarChartResolved) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
  const [selection, setSelection] = useControllableIndex(activeIndexProp, defaultActiveIndex);
  const [size, setSize] = useState({ width: 0, height: 0 });
  // Skeleton rows are a percentage of the rail, so the sweep needs a measurement.
  const [skeletonRowWidth, setSkeletonRowWidth] = useState(0);
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
                      onLayout={(event) => setSkeletonRowWidth(event.nativeEvent.layout.width)}
                      style={{
                        width: `${Math.round(fraction * 100)}%`,
                        height: '100%',
                        borderRadius: ROW_RADIUS,
                        backgroundColor: t.colors.surfaceStrong,
                        opacity: pulse,
                        overflow: 'hidden',
                      }}
                    >
                      <SkeletonSheen width={skeletonRowWidth} radius={ROW_RADIUS} />
                    </Animated.View>
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
