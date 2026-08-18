/**
 * Arlo UI — DonutChart
 *
 * Part-to-whole: what a total is made of. Use it when the parts sum to something
 * meaningful and there are only a few of them — past a handful, a bar chart ranks
 * better than a ring compares.
 *
 *   <Chart.Donut data={[{ label: 'Rent', value: 1200 }, { label: 'Food', value: 480 }]} />
 *
 * Deliberate choices:
 *
 * - **Four categories, then "Other".** The categorical palette has exactly four
 *   validated slots (see the `chartSeries*` tokens); every slice is on screen at
 *   once here, so they were checked on all pairs, not just neighbours. Anything
 *   past the fourth is summed into a neutral "Other" rather than given an
 *   invented fifth hue.
 * - **The legend is not optional.** Two or more series means identity can never be
 *   colour alone, so each slice is listed with its label and value.
 * - **The hole is cut, not painted.** Each slice is a real annulus — outer arc
 *   out, inner arc back, closed — so the middle is transparent. The old
 *   implementation covered a full pie with an opaque disc, which only reads as a
 *   ring when the disc happens to match what is behind the chart; that is why
 *   this component used to need a `centerColor`, and why it broke on a gradient,
 *   a photo, or glass. There is nothing to match now, so the prop is gone.
 * - **A real gap between slices**, cut out of the arc rather than stroked over it,
 *   so touching arcs stay separable on any background for the same reason.
 * - **Center label, not slice labels.** Text inside thin arcs is unreadable; the
 *   middle holds the total.
 * - **The legend carries selection.** Arcs are poor tap targets, and the legend
 *   has to be on screen anyway.
 */
import { useMemo } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import {
  annulusPath,
  densityMetrics,
  seriesColorAt,
  type ChartDensity,
  type ChartPoint,
} from './core';
import { useControllableIndex, useSkeletonPulse } from './hooks';

export type DonutSlice = ChartPoint & {
  label: string;
  color?: string;
};

export type DonutChartProps = {
  data: readonly DonutSlice[];
  size?: number;
  /** Ring thickness. */
  thickness?: number;
  density?: ChartDensity;
  /** Big text in the middle. Defaults to the summed total. */
  centerValue?: string;
  centerLabel?: string;
  /** Emphasised slice. Controlled when passed; `defaultActiveIndex` seeds the internal one. */
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onSelect?: (index: number, slice: DonutSlice) => void;
  format?: (value: number) => string;
  showLegend?: boolean;
  /** Categories past the palette's capacity are folded into one neutral slice. */
  maxSlices?: number;
  emptyLabel?: string;
  /**
   * Draws the ring as a pulsing track and holds back the centre readout and the
   * legend. Same footprint as the loaded chart, so nothing reflows when the data
   * lands.
   */
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Unselected slices fade to this, so the selected one reads as the subject. */
const DIMMED_ALPHA = 0.35;

export function DonutChart({
  data,
  size = 180,
  thickness = 26,
  density = 'default',
  centerValue,
  centerLabel,
  activeIndex,
  defaultActiveIndex = null,
  onSelect,
  format,
  showLegend = true,
  maxSlices = 4,
  emptyLabel = 'No data',
  loading = false,
  accessibilityLabel,
  style,
}: DonutChartProps) {
  const t = useTokens();
  const metrics = densityMetrics(density);
  const [selection, setSelection] = useControllableIndex(activeIndex, defaultActiveIndex);

  // Fold everything past the palette's validated capacity into one neutral slice
  // rather than inventing hues that would read as new identities.
  const slices = useMemo(() => {
    const positive = data.filter((slice) => slice.value > 0);
    const cap = Math.min(maxSlices, 4);
    if (positive.length <= cap) return [...positive];
    const kept = positive.slice(0, cap);
    const rest = positive.slice(cap).reduce((sum, slice) => sum + slice.value, 0);
    return rest > 0
      ? [...kept, { label: 'Other', value: rest, color: t.colors.chartOther } as DonutSlice]
      : kept;
  }, [data, maxSlices, t.colors.chartOther]);

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  const outerRadius = size / 2;
  const innerRadius = Math.max(0, outerRadius - thickness);

  const segments = useMemo(() => {
    if (total <= 0) return [];
    const TAU = Math.PI * 2;
    // The gap is taken out of each slice's own sweep, so the ring stays a ring and
    // the space between arcs is genuinely empty rather than painted over.
    const gapAngle = slices.length > 1 ? metrics.gap / outerRadius : 0;
    let cursor = 0;
    return slices.map((slice, index) => {
      const sweep = (slice.value / total) * TAU;
      const start = cursor + gapAngle / 2;
      const end = cursor + sweep - gapAngle / 2;
      cursor += sweep;
      return {
        slice,
        index,
        color: slice.color ?? seriesColorAt(t, index),
        percent: (slice.value / total) * 100,
        startAngle: start,
        endAngle: Math.max(start, end),
      };
    });
  }, [slices, total, metrics.gap, outerRadius, t]);

  const summary =
    accessibilityLabel ??
    (loading
      ? 'Chart loading'
      : segments.length === 0
      ? emptyLabel
      : `Donut chart. ${slices
          .map(
            (slice) =>
              `${slice.label} ${total > 0 ? Math.round((slice.value / total) * 100) : 0} percent`,
          )
          .join(', ')}`);

  const resolvedCenterValue = centerValue ?? (format ? format(total) : String(total));

  return (
    <View style={[{ gap: t.spacing[4] }, style]}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={summary}
        style={{
          width: size,
          height: size,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <DonutSkeleton size={size} outerRadius={outerRadius} innerRadius={innerRadius} />
        ) : null}

        <Svg
          width={size}
          height={size}
          style={{ position: 'absolute' }}
          pointerEvents="none"
        >
          {segments.length > 0 && !loading ? (
            segments.map((segment) => {
              const dimmed = selection != null && selection !== segment.index;
              return (
                <Path
                  key={`${segment.slice.label}-${segment.index}`}
                  d={annulusPath({
                    cx: outerRadius,
                    cy: outerRadius,
                    outerRadius,
                    innerRadius,
                    startAngle: segment.startAngle,
                    endAngle: segment.endAngle,
                  })}
                  // Dimming goes in the colour so it never fades the hole back in.
                  fill={
                    dimmed && segment.color.startsWith('#')
                      ? rgbaFromHex(segment.color, DIMMED_ALPHA)
                      : segment.color
                  }
                  opacity={dimmed && !segment.color.startsWith('#') ? DIMMED_ALPHA : 1}
                />
              );
            })
          ) : loading ? null : (
            // An empty ring is still a ring — the track shows where the data goes.
            <Path
              d={annulusPath({
                cx: outerRadius,
                cy: outerRadius,
                outerRadius,
                innerRadius,
                startAngle: 0,
                endAngle: Math.PI * 2,
              })}
              fill={t.colors.surfaceInput}
            />
          )}
        </Svg>

        <View style={{ alignItems: 'center', paddingHorizontal: thickness }}>
          {!loading ? (
            <Text
              numberOfLines={1}
              style={{
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.title2.fontSize,
                lineHeight: t.typography.title2.lineHeight,
                fontWeight: '700',
              }}
            >
              {segments.length === 0 ? emptyLabel : resolvedCenterValue}
            </Text>
          ) : null}
          {centerLabel && segments.length > 0 && !loading ? (
            <Text
              numberOfLines={1}
              style={{
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {centerLabel}
            </Text>
          ) : null}
        </View>
      </View>

      {showLegend && segments.length > 0 && !loading ? (
        <View style={{ gap: t.spacing[2] }}>
          {segments.map((segment) => {
            const selected = selection === segment.index;
            return (
              <Pressable
                key={`legend-${segment.slice.label}-${segment.index}`}
                accessibilityRole="button"
                accessibilityLabel={`${segment.slice.label}, ${
                  format ? format(segment.slice.value) : segment.slice.value
                }, ${segment.percent.toFixed(0)} percent`}
                accessibilityState={{ selected }}
                onPress={() => {
                  void haptic('selection');
                  setSelection(selected ? null : segment.index);
                  onSelect?.(segment.index, segment.slice);
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: segment.color,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    // Text stays in ink; the swatch beside it carries identity.
                    color: t.colors.textPrimary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                    lineHeight: t.typography.bodySm.lineHeight,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {segment.slice.label}
                </Text>
                <Text
                  style={{
                    color: t.colors.textSecondary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                    lineHeight: t.typography.bodySm.lineHeight,
                    fontWeight: '600',
                  }}
                >
                  {format ? format(segment.slice.value) : segment.slice.value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

/**
 * The pulsing track drawn while `loading`.
 *
 * The same annulus the data will fill, at the same radius — a donut that loads as
 * a spinner and then becomes a ring changes size twice on the way in. Nothing is
 * drawn in the centre: the total is the one number a reader would try hardest to
 * believe, so it stays absent rather than being faked with a grey bar.
 */
function DonutSkeleton({
  size,
  outerRadius,
  innerRadius,
}: {
  size: number;
  outerRadius: number;
  innerRadius: number;
}) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', width: size, height: size, opacity: pulse }}
    >
      <Svg width={size} height={size}>
        <Path
          d={annulusPath({
            cx: outerRadius,
            cy: outerRadius,
            outerRadius,
            innerRadius,
            startAngle: 0,
            endAngle: Math.PI * 2,
          })}
          fill={t.colors.surfaceInput}
        />
      </Svg>
    </Animated.View>
  );
}
