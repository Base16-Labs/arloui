/**
 * Arlo UI — the skeleton block every chart readout stands behind.
 *
 * Shared rather than per-form so that "loading" is one material across the
 * system: the plot's value and delta, the period pills, and the donut's centre
 * all pulse the same grey. It lives in its own file because `chart.tsx` already
 * imports the other forms — a form importing back would close a cycle.
 */
import { Animated } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import { useSkeletonPulse } from './hooks';

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
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: t.colors.surfaceStrong,
        opacity: pulse,
      }}
    />
  );
}
