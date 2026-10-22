import { useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { Circle, ClipPath, Defs, G, Rect } from 'react-native-svg';
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

/**
 * Reveals the plot by widening a clip rect. Returns the `<Defs>` to render
 * inside the `Svg` and the `clipPath` value for each group it should clip.
 *
 * iOS widens the rect on the UI thread. Android's react-native-svg resolves a
 * `ClipPath` once and never re-applies it when the rect inside changes —
 * animated prop or plain prop alike — so the clip stayed at 0 and the line,
 * area and scrub crosshair never appeared. On Android the width is React state
 * copied from the shared value each frame, the clip gets a new id whenever the
 * width moves (a new id is a new clip, which Android does resolve), and once
 * the reveal is complete the clip is dropped so nothing can stay hidden.
 */
export function useChartReveal({ id, progress, width, height, immediate = false }: {
  id: string; progress: SharedValue<number>; width: number; height: number; immediate?: boolean;
}): { defs: ReactNode; clipPath: string | undefined } {
  const android = Platform.OS === 'android';
  const [clipWidth, setClipWidth] = useState(() => (immediate ? width : 0));
  const animatedProps = useAnimatedProps(() => ({
    width: immediate ? width : progress.value * width,
  }));
  useEffect(() => {
    if (!android) return;
    let frame = 0;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      const next = immediate ? width : progress.value * width;
      setClipWidth((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
      if (immediate || progress.value >= 1) return;
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
    };
  }, [android, immediate, progress, width]);

  if (android) {
    if (clipWidth >= width - 0.5) return { defs: null, clipPath: undefined };
    const frameId = `${id}-${Math.round(clipWidth)}`;
    return {
      defs: (
        <Defs>
          <ClipPath id={frameId}>
            <Rect x={0} y={0} width={clipWidth} height={height} />
          </ClipPath>
        </Defs>
      ),
      clipPath: `url(#${frameId})`,
    };
  }
  return {
    defs: (
      <Defs>
        <ClipPath id={id}>
          <Reveal x={0} y={0} height={height} animatedProps={animatedProps} />
        </ClipPath>
      </Defs>
    ),
    clipPath: `url(#${id})`,
  };
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
