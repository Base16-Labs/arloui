import type { ReactNode } from 'react';
import { Circle, G, Rect } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';

const Reveal = Animated.createAnimatedComponent(Rect);
const Sweep = Animated.createAnimatedComponent(Circle);
const Fill = Animated.createAnimatedComponent(G);

/** Offset between categories on first paint — inside the 30–80ms stagger band. */
export const BAR_ENTER_STAGGER = 40;

/** Worklet-safe cubic-bezier. `Easing.bezier(...)(t)` is not a function on web. */
function bezierY(t: number, x1: number, y1: number, x2: number, y2: number) {
  'worklet';
  let u = t;
  for (let i = 0; i < 6; i++) {
    const one = 1 - u;
    const x = 3 * one * one * u * x1 + 3 * one * u * u * x2 + u * u * u;
    const dx = 3 * one * one * x1 + 6 * one * u * (x2 - x1) + 3 * u * u * (1 - x2);
    if (Math.abs(dx) < 1e-5) break;
    u = Math.min(1, Math.max(0, u - (x - t) / dx));
  }
  const one = 1 - u;
  return 3 * one * one * u * y1 + 3 * one * u * u * y2 + u * u * u;
}

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

/**
 * Grows a category from the baseline (scaleY, origin at zero). The shared
 * progress clock is linear; each bar eases over `duration` after its stagger.
 */
export function ChartBarGrow({
  progress,
  index,
  count,
  originX,
  originY,
  duration,
  easing,
  children,
}: {
  progress: SharedValue<number>;
  index: number;
  count: number;
  originX: number;
  originY: number;
  duration: number;
  easing: readonly [number, number, number, number];
  children: ReactNode;
}) {
  const [x1, y1, x2, y2] = easing;
  const animatedProps = useAnimatedProps(() => {
    const total = duration + BAR_ENTER_STAGGER * Math.max(0, count - 1);
    const raw = total <= 0 ? 1 : (progress.value * total - index * BAR_ENTER_STAGGER) / duration;
    const t = Math.min(1, Math.max(0, raw));
    const sy = Math.max(0.001, bezierY(t, x1, y1, x2, y2));
    return {
      transform: `translate(${originX}, ${originY}) scale(1, ${sy}) translate(${-originX}, ${-originY})`,
    };
  });
  return <Fill animatedProps={animatedProps}>{children}</Fill>;
}
