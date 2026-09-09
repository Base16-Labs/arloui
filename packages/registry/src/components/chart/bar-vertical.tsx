/**
 * Arlo UI — Bar chart, vertical
 *
 * Categories along the x-axis. The layout that owns the zero rule, the value
 * labels above each mark, and the grouped/stacked arithmetic.
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
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import { barPath, densityMetrics, seriesColorAt, toneColor } from './core';
import { EmptyContent } from './empty';
import { useControllableIndex, useReduceMotion, useSkeletonPulse } from './hooks';
import { useChartFade } from './hooks';
import { ChartLegend } from './legend';
import {
  BarSkeleton,
  DIMMED_ALPHA,
  LABEL_HEIGHT,
  ReferenceLine,
  SKELETON_HEIGHTS,
  SPACING_FILL,
  VALUE_HEIGHT,
  normalizeBars,
  type BarChartResolved,
  type BarDatum,
} from './bar-shared';

export function VerticalBars({
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
  refreshing = false,
  accessibilityLabel,
  style,
}: BarChartResolved) {
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
  const entrance = useChartFade(!loading && bars.length > 0);
  const seriesCount = allSeries.length;
  const stacked = seriesCount > 1 && variant === 'stacked';
  const grouped = seriesCount > 1 && !stacked;

  const withLabels = showLabels && metrics.showLabels;

  const { top, bottom } = useMemo(() => {
    if (bars.length === 0) return { top: 0, bottom: 0 };
    let hi = 0;
    let lo = 0;
    if (stacked) {
      /*
       * Part-to-total: the ceiling is the tallest pile, and a negative has no
       * meaning in a share of a whole — a slice cannot be less than none of it.
       *
       * They are dropped rather than drawn, which is right, but it used to be
       * silent: four segments in, two segments out, and no way to tell that
       * from a data problem. The warning below is the only signal, so it stays
       * even though the arithmetic here is deliberate.
       */
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

  /**
   * Stacking signed data is a category error, not a rendering one — so say so
   * rather than quietly drawing a chart that omits some of its input. Dev only,
   * and once per mount: a warning that fires every frame is a warning nobody
   * reads.
   */
  useEffect(() => {
    // Guarded rather than bare: `__DEV__` is a Metro global, and this file gets
    // copied into projects that may render it through react-native-web or an
    // SSR pass where the global does not exist. A warning is not worth a
    // ReferenceError.
    const dev = typeof __DEV__ !== 'undefined' && __DEV__;
    if (!dev || !stacked) return;
    const dropped = allSeries.reduce(
      (count, list) => count + list.filter((bar) => bar.value < 0).length,
      0,
    );
    if (dropped > 0) {
      console.warn(
        `[Chart.Bar] variant="stacked" dropped ${dropped} negative value(s): a stack shows ` +
          'parts of one whole, and a part cannot be negative. Use variant="grouped" for signed data.',
      );
    }
  }, [stacked, allSeries]);

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

  /*
   * An empty chart is the slot and nothing else.
   *
   * The slot used to be an overlay inside the plot box, which left the legend
   * standing under it naming series that have no bars — and the box itself
   * holding a height for marks that are not coming. `emptyLabel` keeps the old
   * behaviour, because a bare word inside the plot's own footprint is the right
   * answer for a chart with no room for an arrangement.
   */
  if (!loading && bars.length === 0 && empty) {
    return (
      <View style={[{ minHeight: height, justifyContent: 'center' }, style]}>
        <EmptyContent {...empty} />
      </View>
    );
  }

  return (
    <Animated.View style={[{ gap: t.spacing[2], opacity: entrance }, style]}>
      <View
        onLayout={handleLayout}
        accessible={!interactive}
        accessibilityRole={interactive ? undefined : 'image'}
        accessibilityState={{ busy: loading || refreshing }}
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
                    // `slot`, not `barWidth`. The mark is centred *inside* its
                    // slot by `markInset`, so a label box the width of the bar
                    // starting at the slot's left edge sits that inset to the
                    // left of it. Centring over the whole slot lands on the bar
                    // whatever `spacing` does — which is what the multi-series
                    // label below has always done.
                    width: slot,
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
    </Animated.View>
  );
}

/* ------------------------------------------------------------- horizontal --- */

/**
 * The row's corner radius, used by both the rail and the outer end of the fill
 * it holds. One constant because the two have to agree: the rail clips the fill,
 * so a fill rounded to a different radius reads as a rendering fault at
 * whichever end the clip is doing the work.
 */
