// @ts-nocheck -- Registry source is copied into projects that install the listed peer dependencies.
import { useEffect } from 'react';
import Svg, { G, Line } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedGroup = Animated.createAnimatedComponent(G);

type Stroke = readonly [x1: number, y1: number, x2: number, y2: number, opacity?: number];

type IconState = {
  lines: readonly [Stroke, Stroke, Stroke];
  rotation?: number;
};

type TransitionDefinition = {
  fromLabel: string;
  toLabel: string;
  from: IconState;
  to: IconState;
};

export type AnimatedIconName =
  | 'menu-close'
  | 'plus-minus'
  | 'play-pause'
  | 'arrow-right-down'
  | 'chevron-right-down'
  | 'download-check';

export type AnimatedIconProps = {
  name: AnimatedIconName;
  active: boolean;
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  accessibilityLabel?: string;
};

const point: Stroke = [12, 12, 12, 12, 0];

const definitions: Record<AnimatedIconName, TransitionDefinition> = {
  'menu-close': {
    fromLabel: 'Menu',
    toLabel: 'Close',
    from: {
      lines: [
        [5, 7, 19, 7],
        [5, 12, 19, 12],
        [5, 17, 19, 17],
      ],
    },
    to: {
      lines: [[6.5, 6.5, 17.5, 17.5], point, [17.5, 6.5, 6.5, 17.5]],
    },
  },
  'plus-minus': {
    fromLabel: 'Plus',
    toLabel: 'Minus',
    from: {
      lines: [[5, 12, 19, 12], [12, 5, 12, 19], point],
    },
    to: {
      lines: [[5, 12, 19, 12], point, point],
    },
  },
  'play-pause': {
    fromLabel: 'Play',
    toLabel: 'Pause',
    from: {
      lines: [
        [7, 5, 18, 12],
        [18, 12, 7, 19],
        [7, 19, 7, 5],
      ],
    },
    to: {
      lines: [[9, 6, 9, 18], [15, 6, 15, 18], point],
    },
  },
  'arrow-right-down': {
    fromLabel: 'Arrow right',
    toLabel: 'Arrow down',
    from: {
      lines: [
        [4, 12, 19, 12],
        [14, 7, 19, 12],
        [19, 12, 14, 17],
      ],
      rotation: 0,
    },
    to: {
      lines: [
        [4, 12, 19, 12],
        [14, 7, 19, 12],
        [19, 12, 14, 17],
      ],
      rotation: 90,
    },
  },
  'chevron-right-down': {
    fromLabel: 'Chevron right',
    toLabel: 'Chevron down',
    from: {
      lines: [[8, 6, 14, 12], [14, 12, 8, 18], point],
      rotation: 0,
    },
    to: {
      lines: [[8, 6, 14, 12], [14, 12, 8, 18], point],
      rotation: 90,
    },
  },
  'download-check': {
    fromLabel: 'Download',
    toLabel: 'Complete',
    from: {
      lines: [
        [12, 4, 12, 16],
        [7, 11, 12, 16],
        [12, 16, 17, 11],
      ],
    },
    to: {
      lines: [[5, 12, 10, 17], [10, 17, 19, 7], point],
    },
  },
};

function MorphingLine({
  progress,
  from,
  to,
  strokeWidth,
}: {
  progress: Animated.SharedValue<number>;
  from: Stroke;
  to: Stroke;
  strokeWidth: number;
}) {
  const animatedProps = useAnimatedProps(() => ({
    x1: interpolate(progress.value, [0, 1], [from[0], to[0]]),
    y1: interpolate(progress.value, [0, 1], [from[1], to[1]]),
    x2: interpolate(progress.value, [0, 1], [from[2], to[2]]),
    y2: interpolate(progress.value, [0, 1], [from[3], to[3]]),
    opacity: interpolate(progress.value, [0, 1], [from[4] ?? 1, to[4] ?? 1]),
  }));

  return (
    <AnimatedLine
      animatedProps={animatedProps}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function AnimatedIcon({
  name,
  active,
  size = 24,
  color = '#18181B',
  strokeWidth = 1.75,
  duration = 200,
  accessibilityLabel,
}: AnimatedIconProps) {
  const definition = definitions[name];
  const progress = useSharedValue(active ? 1 : 0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: reduceMotion ? 0 : duration,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [active, duration, progress, reduceMotion]);

  const rotation = useAnimatedProps(() => ({
    rotation: interpolate(
      progress.value,
      [0, 1],
      [definition.from.rotation ?? 0, definition.to.rotation ?? 0],
    ),
    originX: 12,
    originY: 12,
  }));

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={color}
      accessibilityRole="image"
      accessibilityLabel={
        accessibilityLabel ?? `${active ? definition.toLabel : definition.fromLabel} icon`
      }
    >
      <AnimatedGroup animatedProps={rotation}>
        {[0, 1, 2].map((index) => (
          <MorphingLine
            key={index}
            progress={progress}
            from={definition.from.lines[index]}
            to={definition.to.lines[index]}
            strokeWidth={strokeWidth}
          />
        ))}
      </AnimatedGroup>
    </Svg>
  );
}
