/**
 * Arlo UI — the skeleton block every chart readout stands behind.
 *
 * Shared rather than per-form so that "loading" is one material across the
 * system: the plot's value and delta, the period pills, and the donut's centre
 * all pulse the same grey. It lives in its own file because `chart.tsx` already
 * imports the other forms — a form importing back would close a cycle.
 */
import { useId, useState } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, Path, Rect } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import { useSkeletonPulse, useSkeletonSheen } from './hooks';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

/** How wide the travelling highlight is, as a share of what it crosses. */
const SHEEN_WIDTH = 0.38;

/** The highlight's colour — the same one the `Skeleton` component uses. */
function useSheenColor(): string {
  const t = useTokens();
  return t.name === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.52)';
}

/**
 * The sweep, for a skeleton drawn as views.
 *
 * Clipped by the parent, which must set `overflow: 'hidden'` — the band is wider
 * than nothing and travels past both edges, so an unclipped parent leaks it
 * across whatever sits beside the chart.
 */
export function SkeletonSheen({
  width,
  radius = 0,
  style,
}: {
  width: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const sheenColor = useSheenColor();
  const sweep = useSkeletonSheen(t.motion.duration.slow);
  if (sweep == null || width <= 0) return null;

  const band = Math.max(28, width * SHEEN_WIDTH);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: band,
          borderRadius: radius,
          backgroundColor: sheenColor,
          transform: [
            { translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-band, width] }) },
          ],
        },
        style,
      ]}
    />
  );
}

/**
 * The sweep, for a skeleton drawn as an SVG shape.
 *
 * Clipped to the shape itself rather than to its bounding box. A donut's
 * skeleton is a ring: a band crossing the box would sweep straight through the
 * hole in the middle, which reads as a highlight passing *behind* the chart
 * rather than across it. `clipPath` keeps it on the ink.
 */
export function SkeletonSheenSvg({
  d,
  width,
  height,
}: {
  /** The same path the skeleton is drawn with. */
  d: string;
  width: number;
  height: number;
}) {
  const t = useTokens();
  const sheenColor = useSheenColor();
  const sweep = useSkeletonSheen(t.motion.duration.slow);
  // Per instance: two loading charts on one screen would otherwise share a
  // document-global clip id and the first definition would win.
  const clipId = `arloSheen-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (sweep == null || width <= 0 || !d) return null;

  const band = Math.max(28, width * SHEEN_WIDTH);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
      <Svg width={width} height={height}>
        <Defs>
          <ClipPath id={clipId}>
            <Path d={d} />
          </ClipPath>
        </Defs>
        <AnimatedRect
          y={0}
          width={band}
          height={height}
          fill={sheenColor}
          clipPath={`url(#${clipId})`}
          x={sweep.interpolate({ inputRange: [0, 1], outputRange: [-band, width] })}
        />
      </Svg>
    </View>
  );
}

/**
 * A skeleton block in the shape of the thing it stands in for.
 *
 * The readouts do not render a placeholder number while loading. A chart that
 * paints `$0.00` before it has a figure has told the reader something false, and
 * it is indistinguishable from a real zero balance — the one value a money
 * screen must never invent. A block says "not yet"; a zero says "nothing".
 */
export function SkeletonBlock({
  width,
  height,
  radius,
}: {
  /** A number, or a percentage for a block that fills its slot. */
  width: number | `${number}%`;
  height: number;
  radius: number;
}) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
  // Measured rather than taken from `width`, which may be a percentage.
  const [measured, setMeasured] = useState(0);
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: t.colors.surfaceStrong,
        opacity: pulse,
        // The sweep travels past both edges, so the block has to clip it.
        overflow: 'hidden',
      }}
      onLayout={(event) => setMeasured(event.nativeEvent.layout.width)}
    >
      <SkeletonSheen width={measured} radius={radius} />
    </Animated.View>
  );
}
