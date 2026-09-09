import type { ReactNode } from 'react';
import { Circle, G, Rect } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';

const Reveal = Animated.createAnimatedComponent(Rect);
const Sweep = Animated.createAnimatedComponent(Circle);
const Fill = Animated.createAnimatedComponent(G);

/** SVG geometry is static; only the mask updates on the UI thread. */
export function ChartReveal({ progress, width, height, immediate = false }: {
  progress: SharedValue<number>; width: number; height: number; immediate?: boolean;
}) {
  const animatedProps = useAnimatedProps(() => ({ width: immediate ? width : progress.value * width }));
  return <Reveal x={0} y={0} height={height} animatedProps={animatedProps} />;
}

export function ChartSweep({ progress, center, radius, thickness }: {
  progress: SharedValue<number>; center: number; radius: number; thickness: number;
}) {
  const length = 2 * Math.PI * radius;
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: (1 - progress.value) * length }));
  return <Sweep cx={center} cy={center} r={radius} fill="none" stroke="white"
    strokeWidth={thickness} strokeDasharray={[length, length]} animatedProps={animatedProps}
    transform={`rotate(-90 ${center} ${center})`} />;
}

/** Let the stroke establish direction before its supporting area gains weight. */
export function ChartFill({ progress, immediate = false, children }: {
  progress: SharedValue<number>; immediate?: boolean; children: ReactNode;
}) {
  const animatedProps = useAnimatedProps(() => ({
    opacity: immediate ? 1 : Math.min(1, Math.max(0, (progress.value - 0.3) / 0.7)),
  }));
  return <Fill animatedProps={animatedProps}>{children}</Fill>;
}
