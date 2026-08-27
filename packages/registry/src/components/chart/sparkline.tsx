/**
 * Arlo UI — Sparkline
 *
 * A line with everything else removed: no axes, no labels, no scrub, no legend.
 * It belongs inline — beside a number in a stat card, inside a table row — where
 * the surrounding text already says what the number is and the shape is the only
 * thing the mark has to carry.
 *
 * If you want a value readout, a baseline, or scrubbing, you want `Chart`.
 *
 * This was the first form to draw its own path, and the geometry it used is now
 * shared: it measures through the same `makeScale` and `linePath` as `Chart.Plot`,
 * so a sparkline and a plot of the same series have the same shape.
 */
import { useId, useMemo, useState } from 'react';
import {
  Text,
  Animated,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import {
  areaPath,
  densityMetrics,
  linePath,
  makeScale,
  seriesStats,
  toPoints,
  toneColor,
  type ChartCurve,
  type ChartData,
  type ChartDensity,
  type ChartTone,
} from './core';
import { EmptyContent, type ChartEmptyProps } from './empty';
import { useSkeletonPulse } from './hooks';

export type SparklineProps = {
  data: ChartData;
  /**
   * Honours `auto` (default; tones by whether the series ended above where it
   * started), `positive`, `negative`, `brand`, and `neutral`. One series has no
   * categories, so `series` is treated as `brand`.
   */
  tone?: ChartTone;
  /** Inline marks default to `compact`: a thinner stroke and a smaller dot. */
  density?: ChartDensity;
  width?: number;
  height?: number;
  /** Fade a gradient under the line. Off by default — inline marks stay light. */
  fill?: boolean;
  /** Dot on the final point, for "where it ended up". */
  showEndDot?: boolean;
  /**
   * Label the series' own high and low in the margins above and below the mark.
   *
   * These are the *data's* extremes, not an axis: two numbers the series
   * actually reached, which is the same thing `chrome="reference"` draws as a
   * min/max pair on `Chart.Plot`. There is still no scale, no ticks, and no
   * gridlines — the rule the chart core sets out holds.
   *
   * Reserves a row top and bottom, so the mark shrinks rather than running under
   * the text.
   */
  showExtremes?: boolean;
  /** Formats the extreme labels. Raw values when omitted. */
  format?: (value: number) => string;
  /**
   * Short text in place of the mark when there is no data — the same minimum
   * every other chart form has.
   *
   * No default, because the inline case genuinely has none: a 28pt row in a list
   * has no room for words, and the hairline dash is the honest answer there.
   * Give a label wherever the sparkline is big enough to read one.
   */
  emptyLabel?: string;
  /**
   * The composed empty slot — headline, one line, one action — the same one
   * `Chart.Empty`, `Chart.Bar`, and `Chart.Donut` draw. Replaces the mark, so it
   * needs a sparkline given real height; an inline one cannot hold it.
   *
   * Wins over `emptyLabel`.
   */
  empty?: ChartEmptyProps;
  curve?: ChartCurve;
  /** Overrides the density's stroke width. */
  strokeWidth?: number;
  /**
   * Draws the silhouette as a pulsing line instead of the series. Holds the same
   * box, so the row it sits in does not reflow when the data lands.
   */
  loading?: boolean;
  /**
   * Sparklines are decorative next to a value that is already announced, so they
   * are hidden from assistive tech unless you pass a label.
   */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Sparkline({
  data,
  tone = 'auto',
  density = 'compact',
  width: widthProp,
  height = 28,
  fill = false,
  showEndDot = false,
  showExtremes = false,
  format,
  emptyLabel,
  empty,
  curve = 'steep',
  strokeWidth,
  loading = false,
  accessibilityLabel,
  style,
}: SparklineProps) {
  const t = useTokens();
  const [measured, setMeasured] = useState(0);
  const width = widthProp ?? measured;
  const metrics = densityMetrics(density);
  const stroke = strokeWidth ?? metrics.stroke;
  // Half a stroke plus the end dot, so neither clips against the edge of the box.
  const inset = showEndDot ? Math.max(metrics.inset, stroke + 1.5) : Math.ceil(stroke / 2) + 1;
  /*
   * Room for the extreme labels, taken out of the mark rather than added around
   * it — a sparkline sits in a fixed slot (a list row, a card header), so it has
   * to keep the height it was given and shrink the line instead.
   */
  const extremeRow = showExtremes ? EXTREME_ROW : 0;
  const plotHeight = Math.max(1, height - extremeRow * 2);

  const points = useMemo(() => toPoints(data), [data]);
  const stats = useMemo(() => seriesStats(points), [points]);
  const color = toneColor(t, tone, { rising: stats.last >= stats.first });

  const plotted = useMemo(() => {
    if (width === 0 || points.length === 0) return [];
    const scale = makeScale({
      count: points.length,
      min: stats.min,
      span: stats.span,
      width,
      height: plotHeight,
      inset,
    });
    return points.map((point, index) => ({
      x: scale.x(index),
      y: scale.y(point.value) + extremeRow,
    }));
  }, [points, width, plotHeight, extremeRow, inset, stats.min, stats.span]);

  const line = linePath(plotted, curve);
  const area = fill ? areaPath(plotted, height - inset - extremeRow, curve) : '';
  const end = plotted[plotted.length - 1];

  // Per instance, not per tone: two `tone="auto"` sparklines on one screen resolve
  // to different colours but would share one document-global gradient id, so the
  // first definition would win and paint both fills the same.
  const gradientId = `arloSparkFill-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  /*
   * The composed slot replaces the mark outright, exactly as it does on the
   * donut — it cannot live inside the sparkline's box.
   *
   * A sparkline is 28pt tall inline and 56pt standalone; the slot's icon tile
   * alone is 52pt. Rendering it into an `absoluteFill` inside that fixed height
   * crushed it, which is why it did not look like the empty state on any other
   * form. Returning early lets the content set its own height, the way every
   * other chart's slot does.
   *
   * Keyed off the data rather than the plotted points: `plotted` is also empty
   * before the first measurement, and a chart that flashes its empty state on
   * mount is worse than one that waits a frame.
   */
  if (empty && !loading && points.length === 0) {
    return (
      <View style={[{ width: widthProp, justifyContent: 'center' }, style]}>
        <EmptyContent {...empty} />
      </View>
    );
  }

  return (
    <View
      onLayout={
        widthProp == null
          ? (event: LayoutChangeEvent) => setMeasured(event.nativeEvent.layout.width)
          : undefined
      }
      accessible={accessibilityLabel != null}
      accessibilityRole={accessibilityLabel != null ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={accessibilityLabel == null}
      importantForAccessibility={accessibilityLabel == null ? 'no-hide-descendants' : 'auto'}
      style={[{ width: widthProp, height }, style]}
    >
      {/*
        Outside the SVG, so they take the app's type ramp rather than SVG's own
        text metrics — the same reason the bar chart draws its value labels this
        way. Mono, because two stacked figures have to align digit for digit.
      */}
      {showExtremes && !loading && plotted.length > 0 ? (
        <>
          <ExtremeLabel top text={`H ${format ? format(stats.max) : stats.max}`} />
          <ExtremeLabel top={false} text={`L ${format ? format(stats.min) : stats.min}`} />
        </>
      ) : null}

      {loading ? (
        <SparklineSkeleton width={width} height={height} inset={inset} />
      ) : null}

      {/*
        Empty is a flat rule at the baseline, never a "No data" caption: a
        sparkline is inline beside a number that already carries the label, and a
        28px box has no room for text. The rule holds the height so the row keeps
        its rhythm.
      */}
      {/*
        Words when there is room for them, the dash when there is not.
        
        The mark alone said nothing about *why* it was blank, which is the one
        thing the other forms all manage — they each fall back to a short label.
        A sparkline cannot always afford one, so this is opt-in rather than a
        default, and the dash stays the answer for a 28pt list row.
      */}
      {!loading && plotted.length === 0 && emptyLabel ? (
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text
            numberOfLines={1}
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

      {!loading && width > 0 && plotted.length === 0 && !emptyLabel ? (
        <Svg width={width} height={height}>
          {/*
            Dashed and hairline, not a solid rule at the data's own weight.
            
            A solid line across the middle is exactly what a real series with no
            change looks like, so an empty sparkline was indistinguishable from a
            flat one — the chart said "zero" when it meant "nothing". A dash at a
            lighter weight reads as an absence.
          */}
          <Path
            d={`M ${inset} ${height / 2} L ${width - inset} ${height / 2}`}
            stroke={t.colors.borderSecondary}
            strokeWidth={1}
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
        </Svg>
      ) : null}

      {!loading && width > 0 && plotted.length > 0 ? (
        <Svg width={width} height={height}>
          {area ? (
            <>
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={color} stopOpacity={0.24} />
                  <Stop offset="1" stopColor={color} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path d={area} fill={`url(#${gradientId})`} />
            </>
          ) : null}
          <Path
            d={line}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {showEndDot && end ? (
            <Circle
              cx={end.x}
              cy={end.y}
              // `stroke + 1.5` — 3.5pt at the default 2pt stroke, which is what
              // the design draws and, more tellingly, exactly what the `inset`
              // above already reserves room for. The dot was drawn at
              // `stroke + 0.5` while the box was measured for a bigger one, so
              // the two halves of the same decision disagreed.
              r={stroke + 1.5}
              fill={color}
            />
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
}

/**
 * The pulsing silhouette drawn while `loading`.
 *
 * A fixed rise-and-settle profile, not the real shape and not a random one: a
 * skeleton that reshapes on every render reads as data arriving and a reader will
 * try to interpret it.
 */
/**
 * Height reserved above and below the mark for the high/low labels — the 10pt
 * mono line plus a little air.
 */
const EXTREME_ROW = 13;

const SKELETON_SHAPE = [0.35, 0.5, 0.42, 0.68, 0.58, 0.8, 0.72, 0.9];

/*
 * `surfaceStrong`, the skeleton material the rest of the chart family uses. It
 * was `borderSecondary` — the same value in both themes, so this changes
 * nothing on screen, but a skeleton naming itself after a border is the kind of
 * drift that becomes a real mismatch the moment either token moves.
 */
function SparklineSkeleton({
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
    count: SKELETON_SHAPE.length,
    min: 0,
    span: 1,
    width,
    height,
    inset,
  });
  const shape = SKELETON_SHAPE.map((value, index) => ({ x: scale.x(index), y: scale.y(value) }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: pulse }]}>
      <Svg width={width} height={height}>
        {/*
          Filled, not stroked. This was the only skeleton in the chart family
          drawn as a line — the plot, the bars, and the donut all fill their
          silhouettes — and at a 1.5pt stroke in a 28pt box it read as a faint
          scratch rather than as something arriving. A filled shape carries the
          weight of the mark it stands in for.
        */}
        <Path d={areaPath(shape, height - inset, 'smooth')} fill={t.colors.surfaceStrong} />
      </Svg>
    </Animated.View>
  );
}

/**
 * One extreme, pinned to the margin its value lives in: the high above the mark,
 * the low below it. Left-aligned rather than tracking the point's own x — a
 * label chasing the peak collides with the line the moment the peak is near an
 * edge, and the number is what matters, not where along the series it happened.
 */
function ExtremeLabel({ top, text }: { top: boolean; text: string }) {
  const t = useTokens();
  return (
    <Text
      numberOfLines={1}
      style={{
        position: 'absolute',
        left: 0,
        ...(top ? { top: 0 } : { bottom: 0 }),
        color: t.colors.textTertiary,
        fontFamily: t.fontFamilies.mono,
        fontSize: 10,
        lineHeight: EXTREME_ROW,
      }}
    >
      {text}
    </Text>
  );
}
