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
      height,
      inset,
    });
    return points.map((point, index) => ({ x: scale.x(index), y: scale.y(point.value) }));
  }, [points, width, height, inset, stats.min, stats.span]);

  const line = linePath(plotted, curve);
  const area = fill ? areaPath(plotted, height - inset, curve) : '';
  const end = plotted[plotted.length - 1];

  // Per instance, not per tone: two `tone="auto"` sparklines on one screen resolve
  // to different colours but would share one document-global gradient id, so the
  // first definition would win and paint both fills the same.
  const gradientId = `arloSparkFill-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

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
      {loading ? (
        <SparklineSkeleton width={width} height={height} inset={inset} stroke={stroke} />
      ) : null}

      {/*
        Empty is a flat rule at the baseline, never a "No data" caption: a
        sparkline is inline beside a number that already carries the label, and a
        28px box has no room for text. The rule holds the height so the row keeps
        its rhythm.
      */}
      {!loading && width > 0 && plotted.length === 0 ? (
        <Svg width={width} height={height}>
          <Path
            d={`M ${inset} ${height / 2} L ${width - inset} ${height / 2}`}
            stroke={t.colors.borderSecondary}
            strokeWidth={stroke}
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
            <Circle cx={end.x} cy={end.y} r={stroke + 0.5} fill={color} />
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
const SKELETON_SHAPE = [0.35, 0.5, 0.42, 0.68, 0.58, 0.8, 0.72, 0.9];

function SparklineSkeleton({
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
