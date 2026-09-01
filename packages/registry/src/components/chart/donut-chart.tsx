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
import { EmptyContent, type ChartEmptyProps } from './empty';
import { SkeletonSheenSvg } from './skeleton';

export type DonutSlice = ChartPoint & {
  label: string;
  color?: string;
};

export type DonutChartProps = {
  /**
   * Slices of a whole. Non-positive values are dropped, not clamped: a negative
   * share of a total is not a thing a ring can express, and a zero slice has no
   * arc to draw. Anything past `maxSlices` folds into one neutral "Other".
   */
  data: readonly DonutSlice[];
  size?: number;
  /** Ring thickness. Defaults from `density` — 26 at default, 18 at compact. */
  thickness?: number;
  density?: ChartDensity;
  /** Big text in the middle. Defaults to the summed total. */
  /**
   * Hide the figure in the hole, for a ring that is read from its legend or
   * captioned elsewhere. Named to match `Meter`'s `showValue`.
   *
   * Independent of `centerLabel`, which only ever renders when you pass one — so
   * a caption with no number is `showValue={false}` plus a `centerLabel`.
   */
  showValue?: boolean;
  centerValue?: string;
  centerLabel?: string;
  /** Emphasised slice. Controlled when passed; `defaultActiveIndex` seeds the internal one. */
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onSelect?: (index: number, slice: DonutSlice) => void;
  format?: (value: number) => string;
  showLegend?: boolean;
  /**
   * How many arcs the ring draws, **"Other" included**. Categories past that
   * fold into one neutral "Other" slice.
   *
   * Five is the ceiling and the default: the categorical palette has four
   * validated slots, and the fifth arc is "Other". More than four categories
   * always folds, whatever you pass.
   */
  maxSlices?: number;
  /**
   * Short text for the ring's centre when there is no data. Not the whole empty
   * state — see `empty` for the composed one.
   */
  emptyLabel?: string;
  /**
   * The composed empty slot — headline, one line, one action — the same one
   * `Chart.Empty` and `Chart.Bar` draw. Replaces the ring rather than sitting
   * inside it: the arrangement does not fit in a 128pt hole, and a donut with
   * nothing in it has no shape worth preserving.
   *
   * Wins over `emptyLabel`.
   */
  empty?: ChartEmptyProps;
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
/**
 * The categorical palette's validated slots, and the most arcs a ring may draw:
 * those four plus one "Other".
 */
const NAMED_SLOTS = 4;
const MAX_ARCS = NAMED_SLOTS + 1;

const DIMMED_ALPHA = 0.35;

export function DonutChart({
  data,
  size = 180,
  /*
   * Density picks the default thickness; an explicit `thickness` still wins.
   *
   * It used to move only `metrics.gap`, which is the hairline between slices —
   * 1pt against 2pt, about half a degree at this radius. That is not a control,
   * it is a rounding difference. "How much mark there is" has to change the mark.
   */
  thickness,
  density = 'default',
  showValue = true,
  centerValue,
  centerLabel,
  activeIndex,
  defaultActiveIndex = null,
  onSelect,
  format,
  showLegend = true,
  maxSlices = MAX_ARCS,
  emptyLabel = 'No data',
  empty,
  loading = false,
  accessibilityLabel,
  style,
}: DonutChartProps) {
  const t = useTokens();
  const metrics = densityMetrics(density);
  const ringThickness = thickness ?? (density === 'compact' ? 18 : 26);
  const [selection, setSelection] = useControllableIndex(activeIndex, defaultActiveIndex);

  // Fold everything past the palette's validated capacity into one neutral slice
  // rather than inventing hues that would read as new identities.
  /**
   * `maxSlices` counts the arcs you end up with, "Other" included.
   *
   * It used to cap the *named* categories and then add "Other" on top, so
   * `maxSlices={2}` over four categories drew three arcs. "Other" is a slice —
   * a prop called `maxSlices` that returns more slices than you asked for is
   * simply wrong, whatever the intent behind it was.
   *
   * The palette is what sets the ceiling: four validated slots plus "Other", so
   * five arcs is the most a ring can show and more than four categories always
   * folds, however high `maxSlices` goes.
   */
  const slices = useMemo(() => {
    const positive = data.filter((slice) => slice.value > 0);
    const limit = Math.max(1, Math.min(maxSlices, MAX_ARCS));
    // Fits as-is only if it is inside both the requested limit and the palette.
    if (positive.length <= limit && positive.length <= NAMED_SLOTS) return [...positive];

    // One arc is given up to "Other", and never more than the palette can name.
    const named = Math.min(limit - 1, NAMED_SLOTS);
    const kept = positive.slice(0, named);
    const rest = positive.slice(named).reduce((sum, slice) => sum + slice.value, 0);
    return rest > 0
      ? [...kept, { label: 'Other', value: rest, color: t.colors.chartOther } as DonutSlice]
      : kept;
  }, [data, maxSlices, t.colors.chartOther]);

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  const outerRadius = size / 2;
  const innerRadius = Math.max(0, outerRadius - ringThickness);

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

  /*
   * A composed empty slot replaces the ring outright.
   *
   * The arrangement — tile, headline, a line, an action — does not fit in the
   * hole, and an empty donut has no shape worth preserving around it. This is
   * the same call the bar chart makes: when there is nothing to draw, the slot
   * *is* the chart.
   */
  if (empty && !loading && segments.length === 0) {
    return (
      <View
        style={[{ minHeight: size, alignSelf: 'center', justifyContent: 'center' }, style]}
      >
        <EmptyContent {...empty} />
      </View>
    );
  }

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

        <View style={{ alignItems: 'center', paddingHorizontal: ringThickness }}>
          {/*
            The hole stays empty while loading. A skeleton block here reads as a
            line struck through the ring rather than as a number on its way: the
            centre is enclosed by the track, so a second pulsing shape inside a
            pulsing ring is one shape too many. The ring's own pulse already says
            the chart is loading, and the Svg is absolutely positioned, so an
            empty centre cannot shift it.
          */}
          {!showValue || loading ? null : (
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
          )}
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
                    fontWeight: selected ? '700' : '600',
                  }}
                >
                  {segment.slice.label}
                </Text>
                <Text
                  style={{
                    color: t.colors.textPrimary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                    lineHeight: t.typography.bodySm.lineHeight,
                    fontWeight: '700',
                  }}
                >
                  {format ? format(segment.slice.value) : segment.slice.value}
                </Text>
                {/* The share gets its own fixed column so the values line up down
                    the legend — a ranked list you can compare at a glance. */}
                <Text
                  style={{
                    width: 40,
                    textAlign: 'right',
                    color: t.colors.textTertiary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                    lineHeight: t.typography.bodySm.lineHeight,
                  }}
                >
                  {`${Math.round(segment.percent)}%`}
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
  const ring = annulusPath({
    cx: outerRadius,
    cy: outerRadius,
    outerRadius,
    innerRadius,
    startAngle: 0,
    endAngle: Math.PI * 2,
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', width: size, height: size, opacity: pulse }}
    >
      <Svg width={size} height={size}>
        <Path
          d={ring}
          // `surfaceStrong`, the skeleton material the plot, the readouts, and
          // the bars use. `surfaceInput` is a token lighter in light mode and
          // near-invisible against the surface in dark.
          fill={t.colors.surfaceStrong}
        />
      </Svg>
      {/* Clipped to the ring, or the sweep crosses the hole in the middle and
          reads as a highlight passing behind the chart. */}
      <SkeletonSheenSvg d={ring} width={size} height={size} />
    </Animated.View>
  );
}
