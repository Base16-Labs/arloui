import { Animated } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import { useSkeletonPulse } from './hooks';

/** Neutral placeholders reserve space without inventing values or trends. */
export function SkeletonBlock({
  width,
  height,
  radius,
}: {
  width: number | `${number}%`;
  height: number;
  radius: number;
}) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
  return (
    <Animated.View
      pointerEvents="none"
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

/** A blank plotting region, not a fabricated line or area series. */
export function PlotPlaceholder({
  width,
  height,
  inset,
}: {
  width: number;
  height: number;
  inset: number;
}) {
  const t = useTokens();
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', top: inset, left: inset }}>
      <SkeletonBlock
        width={Math.max(0, width - inset * 2)}
        height={Math.max(0, height - inset * 2)}
        radius={t.radii.sm}
      />
    </Animated.View>
  );
}
