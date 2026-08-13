/**
 * Arlo UI — BarChart
 *
 * Categorical magnitude: spend per day, sessions per channel. Bars are the right
 * form when the categories are discrete and the comparison is "which is bigger" —
 * use `Chart` instead when the x-axis is continuous time.
 *
 *   <Chart.Bar data={[{ label: 'M', value: 32 }, { label: 'T', value: 18 }]} />
 *
 * Deliberate choices:
 *
 * - **Data-ends are rounded, the baseline end is not.** A bar is anchored to its
 *   axis; rounding the anchored end would lift it off and misreport where zero is.
 * - **Negatives drop below the baseline** rather than being drawn as magnitudes,
 *   and the baseline moves to wherever zero falls.
 * - **One hue by default.** A bar chart of one measure is magnitude, not identity,
 *   so it does not spend the categorical palette; pass `tone="series"` for the
 *   case where each bar really is a different thing, or `tone="auto"` to colour by
 *   sign.
 * - **Selection instead of hover.** Tapping a bar reports it and shows its value;
 *   there is no hover on a touch screen. The bars not selected fade to a light
 *   tint of their own colour rather than dropping out, so the shape of the whole
 *   series survives while one bar is being read.
 * - **Bars never scale.** A bar's height *is* its datum, so a bar that grows from
 *   zero is animating the number. On a data change they cross-fade in place
 *   (`motion.chart.barSwap`) — the documented exception to the rule that things
 *   entering scale up.
 *
 * Each bar is its own `Pressable`, sized by the same slot arithmetic that places
 * the mark, so the tap target and the rectangle are the same box by construction
 * rather than by agreement with a library's private layout.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
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
  type ChartDensity,
  type ChartPoint,
  type ChartTone,
} from './core';
import { useControllableIndex, useReduceMotion } from './hooks';

/** A bar needs a name, so `label` is required here even though `ChartPoint`'s is not. */
export type BarDatum = ChartPoint & {
  label: string;
  /** Overrides the resolved colour for this bar alone. */
  color?: string;
};

export type BarChartProps = {
  /** Bars want labels, so this is `BarDatum[]`; a bare `number[]` gets index labels. */
  data: readonly BarDatum[] | readonly number[];
  height?: number;
  /**
   * Honours `brand` (default), `series`, `auto` (colour by sign), `positive`,
   * `negative`, and `neutral`.
   */
  tone?: ChartTone;
  density?: ChartDensity;
  /** Selected bar. Controlled when passed; `defaultActiveIndex` seeds the internal one. */
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onSelect?: (index: number, datum: BarDatum) => void;
  /**
   * Show every bar's value above it. Off by default — a number on every mark is
   * noise. The selected bar shows its value regardless, so selection is how you
   * read an exact figure.
   */
  showValues?: boolean;
  /** Show the category label under each bar. Forced off at `density="compact"`. */
  showLabels?: boolean;
  format?: (value: number) => string;
  /** Force the top of the scale; otherwise it comes from the data. */
  maxValue?: number;
  /** Rendered in place of the bars when `data` is empty. */
  emptyLabel?: string;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * How much of an unselected bar's colour survives. Low enough that the selected
 * bar is unmistakably the subject, high enough that the others still read as
 * bars — for the default brand blue this lands on a light blue.
 */
const DIMMED_ALPHA = 0.22;
const LABEL_HEIGHT = 18;
const VALUE_HEIGHT = 16;

function normalizeBars(data: BarChartProps['data']): BarDatum[] {
  return (data as ReadonlyArray<number | BarDatum>).map((entry, index) =>
    typeof entry === 'number'
      ? { value: entry, label: String(index + 1) }
      : { ...entry, label: entry.label ?? String(index + 1) },
  );
}

export function BarChart({
  data,
  height = 160,
  tone = 'brand',
  density = 'default',
  activeIndex: activeIndexProp,
  defaultActiveIndex = null,
  onSelect,
  showValues = false,
  showLabels = true,
  format,
  maxValue,
  emptyLabel = 'No data',
  loading = false,
  accessibilityLabel,
  style,
}: BarChartProps) {
  const t = useTokens();
  const [width, setWidth] = useState(0);
  const metrics = densityMetrics(density);
  const reduceMotion = useReduceMotion();
  const [selection, setSelection] = useControllableIndex(activeIndexProp, defaultActiveIndex);

  const bars = useMemo(() => normalizeBars(data), [data]);
  const withLabels = showLabels && metrics.showLabels;

  const { top, bottom } = useMemo(() => {
    if (bars.length === 0) return { top: 0, bottom: 0 };
    let hi = 0;
    let lo = 0;
    for (const bar of bars) {
      if (bar.value > hi) hi = bar.value;
      if (bar.value < lo) lo = bar.value;
    }
    return { top: maxValue ?? hi, bottom: lo };
  }, [bars, maxValue]);

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

  const barColor = useCallback(
    (index: number, datum: BarDatum) => {
      if (datum.color) return datum.color;
      if (tone === 'series') return seriesColorAt(t, index);
      return toneColor(t, tone, { rising: datum.value >= 0 });
    },
    [tone, t],
  );

  /*
   * Bars cross-fade on a data change rather than sweeping up from zero. Fading
   * the whole mark layer is the honest version of "the numbers changed"; growing
   * each bar would animate the datum itself.
   */
  const [swap] = useState(() => new Animated.Value(1));
  const signature = bars.map((bar) => `${bar.label}:${bar.value}`).join('|');
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
          .map((bar) => `${bar.label} ${bar.value}`)
          .join(', ')}`);

  // A container element and focusable children are mutually exclusive, so the
  // chart picks whichever is actually useful: when bars are tappable each one is
  // its own button, and when they aren't the whole chart is a single element
  // announcing the summary.
  const interactive = onSelect != null || activeIndexProp !== undefined;

  // One slot per category, gaps included. The same numbers place the mark and
  // size the tap target, so the two cannot drift.
  const gap = metrics.gap;
  const slot = bars.length > 0 ? (width - gap * (bars.length - 1)) / bars.length : 0;
  const barWidth = Math.max(0, slot);

  const marks = useMemo(() => {
    if (width === 0 || bars.length === 0 || loading) return [];
    return bars.map((bar, index) => {
      const negative = bar.value < 0;
      const valueY = yFor(bar.value);
      const x = index * (barWidth + gap);
      const y = negative ? zeroY : valueY;
      const barHeight = Math.abs(valueY - zeroY);
      const selected = selection === index;
      const dimmed = selection != null && !selected;
      const color = barColor(index, bar);
      return {
        index,
        bar,
        x,
        selected,
        d: barPath({
          x,
          y,
          width: barWidth,
          height: barHeight,
          radius: metrics.barRadius,
          roundedEnd: negative ? 'bottom' : 'top',
        }),
        // A tint of the bar's own colour, not one flat grey — under `tone="series"`
        // each bar still has to read as its own category while dimmed.
        fill: dimmed && color.startsWith('#') ? rgbaFromHex(color, DIMMED_ALPHA) : color,
        opacity: dimmed && !color.startsWith('#') ? DIMMED_ALPHA : 1,
        labelY: Math.min(valueY, zeroY),
      };
    });
  }, [
    bars,
    width,
    loading,
    barWidth,
    gap,
    yFor,
    zeroY,
    selection,
    barColor,
    metrics.barRadius,
  ]);

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      accessible={!interactive}
      accessibilityRole={interactive ? undefined : 'image'}
      accessibilityLabel={interactive ? undefined : summary}
      style={[{ height, width: '100%' }, style]}
    >
      {marks.length > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, opacity: reduceMotion ? 1 : swap }}
        >
          <Svg width={width} height={plotHeight}>
            {/* A zero rule only earns its place when the data actually crosses it. */}
            {bottom < 0 ? (
              <Path
                d={`M0,${zeroY.toFixed(2)} L${width.toFixed(2)},${zeroY.toFixed(2)}`}
                stroke={t.colors.borderSecondary}
                strokeWidth={1}
                fill="none"
              />
            ) : null}
            {marks.map((mark) => (
              <Path
                key={`${mark.bar.label}-${mark.index}`}
                d={mark.d}
                fill={mark.fill}
                opacity={mark.opacity}
              />
            ))}
          </Svg>
        </Animated.View>
      ) : null}

      {/* Value labels sit outside the SVG so they use the same type ramp as the
          rest of the interface rather than SVG's own text metrics. */}
      {marks.map((mark) =>
        showValues || mark.selected ? (
          <View
            key={`value-${mark.bar.label}-${mark.index}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: mark.x,
              width: barWidth,
              top: Math.max(0, mark.labelY - VALUE_HEIGHT),
              alignItems: 'center',
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: mark.selected ? t.colors.textPrimary : t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: metrics.labelSize - 1,
                fontWeight: '600',
              }}
            >
              {format ? format(mark.bar.value) : mark.bar.value}
            </Text>
          </View>
        ) : null,
      )}

      {/* Tap targets and category labels. Full-height columns on the same slot
          arithmetic as the marks above — matching the bars' widths is what makes a
          tap land on the right category, and staying full height keeps the target
          comfortable for a short bar. */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch', gap }}>
        {bars.map((bar, index) => {
          const selected = selection === index;
          return (
            <Pressable
              key={`${bar.label}-${index}`}
              accessible={interactive}
              accessibilityRole={interactive ? 'button' : undefined}
              accessibilityLabel={
                interactive ? `${bar.label}, ${format ? format(bar.value) : bar.value}` : undefined
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

      {bars.length === 0 && !loading ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}
        >
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
        </View>
      ) : null}
    </View>
  );
}
