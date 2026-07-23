// @ts-nocheck -- Registry source is copied into projects that install the listed peer dependencies.
import { useEffect, useState } from 'react';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../../foundation/tokens';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedGroup = Animated.createAnimatedComponent(G);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Stroke = readonly [x1: number, y1: number, x2: number, y2: number, opacity?: number];

type IconState = {
  lines: readonly Stroke[];
  rotation?: number;
};

type TransitionDefinition = {
  fromLabel: string;
  toLabel: string;
  from: IconState;
  to: IconState;
};

type LineAnimatedIconName =
  | 'menu-close'
  | 'plus-minus'
  | 'play-pause'
  | 'arrow-right-down'
  | 'chevron-right-down'
  | 'download-check'
  | 'grid-list'
  | 'sort-ascending-descending'
  | 'expand-collapse'
  | 'copy-check'
  | 'upload-check';

type SpecialAnimatedIconName =
  | 'heart-fill'
  | 'star-fill'
  | 'bookmark-fill'
  | 'bell-fill'
  | 'thumb-up-fill'
  | 'pin-fill'
  | 'spinner-x'
  | 'circle-progress-check'
  | 'bell-shake'
  | 'dot-pulse';

export type AnimatedIconName = LineAnimatedIconName | SpecialAnimatedIconName;

export type AnimatedIconProps = {
  name: AnimatedIconName;
  active: boolean;
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  accessibilityLabel?: string;
  /** Visual reset delay for momentary actions. Defaults to 1500ms for `copy-check`. */
  autoResetAfter?: number;
  onAutoReset?: () => void;
  /** Error color used by `spinner-x` after it resolves. */
  errorColor?: string;
};

const point: Stroke = [12, 12, 12, 12, 0];

const definitions: Record<LineAnimatedIconName, TransitionDefinition> = {
  'menu-close': {
    fromLabel: 'Menu',
    toLabel: 'Close',
    from: {
      lines: [
        [4, 6, 20, 6],
        [4, 12, 20, 12],
        [4, 18, 20, 18],
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
        [4, 12, 20, 12],
        [14, 6, 20, 12],
        [20, 12, 14, 18],
      ],
      rotation: 0,
    },
    to: {
      lines: [
        [4, 12, 20, 12],
        [14, 6, 20, 12],
        [20, 12, 14, 18],
      ],
      rotation: 90,
    },
  },
  'chevron-right-down': {
    fromLabel: 'Chevron right',
    toLabel: 'Chevron down',
    from: {
      lines: [[9, 5, 16, 12], [16, 12, 9, 19], point],
      rotation: 0,
    },
    to: {
      lines: [[9, 5, 16, 12], [16, 12, 9, 19], point],
      rotation: 90,
    },
  },
  'download-check': {
    fromLabel: 'Download',
    toLabel: 'Complete',
    from: {
      lines: [
        [12, 3, 12, 15],
        [7, 10, 12, 15],
        [12, 15, 17, 10],
        [5, 19, 19, 19],
      ],
    },
    to: {
      lines: [[5, 12, 10, 17], [10, 17, 19, 7], point, point],
    },
  },
  'grid-list': {
    fromLabel: 'Grid',
    toLabel: 'List',
    from: {
      lines: [[5, 5, 9, 5], [15, 5, 19, 5], [5, 12, 9, 12], [15, 12, 19, 12], [5, 19, 9, 19], [15, 19, 19, 19]],
    },
    to: {
      lines: [[5, 6, 19, 6], point, [5, 12, 19, 12], point, [5, 18, 19, 18], point],
    },
  },
  'sort-ascending-descending': {
    fromLabel: 'Sort ascending',
    toLabel: 'Sort descending',
    from: { lines: [[5, 7, 10, 7], [5, 12, 14, 12], [5, 17, 19, 17]] },
    to: { lines: [[5, 7, 19, 7], [5, 12, 14, 12], [5, 17, 10, 17]] },
  },
  'expand-collapse': {
    fromLabel: 'Expand',
    toLabel: 'Collapse',
    from: { lines: [[4, 9, 4, 4], [4, 4, 9, 4], [15, 4, 20, 4], [20, 4, 20, 9], [20, 15, 20, 20], [20, 20, 15, 20], [9, 20, 4, 20], [4, 20, 4, 15]] },
    to: { lines: [[5, 10, 10, 10], [10, 10, 10, 5], [14, 5, 14, 10], [14, 10, 19, 10], [19, 14, 14, 14], [14, 14, 14, 19], [10, 19, 10, 14], [10, 14, 5, 14]] },
  },
  'copy-check': {
    fromLabel: 'Copy',
    toLabel: 'Copied',
    from: { lines: [[8, 8, 18, 8], [18, 8, 18, 18], [18, 18, 8, 18], [8, 18, 8, 8], [5, 15, 5, 5], [5, 5, 15, 5], [15, 5, 15, 8]] },
    to: { lines: [[5, 12, 10, 17], [10, 17, 19, 7], point, point, point, point, point] },
  },
  'upload-check': {
    fromLabel: 'Upload',
    toLabel: 'Complete',
    from: { lines: [[12, 21, 12, 8], [7, 13, 12, 8], [12, 8, 17, 13], [5, 21, 19, 21]] },
    to: { lines: [[5, 12, 10, 17], [10, 17, 19, 7], point, point] },
  },
};

const specialLabels: Record<SpecialAnimatedIconName, readonly [string, string]> = {
  'heart-fill': ['Heart outline', 'Heart filled'],
  'star-fill': ['Star outline', 'Star filled'],
  'bookmark-fill': ['Bookmark outline', 'Bookmark filled'],
  'bell-fill': ['Bell outline', 'Bell filled'],
  'thumb-up-fill': ['Thumb up outline', 'Thumb up filled'],
  'pin-fill': ['Pin outline', 'Pin filled'],
  'spinner-x': ['Loading', 'Error'],
  'circle-progress-check': ['In progress', 'Complete'],
  'bell-shake': ['Notification', 'New notification'],
  'dot-pulse': ['Unread', 'Unread alert'],
};

function isSpecialName(name: AnimatedIconName): name is SpecialAnimatedIconName {
  return name in specialLabels;
}

function SpecialGlyph({
  name,
  active,
  strokeWidth,
}: {
  name: SpecialAnimatedIconName;
  active: boolean;
  strokeWidth: number;
}) {
  const common = {
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'heart-fill':
      return <Path d="M12 20.5s-8-4.7-8-11A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5c0 6.3-8 11-8 11Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'star-fill':
      return <Path d="m12 3.5 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.5Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'bookmark-fill':
      return <Path d="M6.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16L12 17l-5.5 3.5v-16Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'bell-fill':
    case 'bell-shake':
      return (
        <>
          <Path d="M6 10a6 6 0 0 1 12 0c0 6 2.5 7 2.5 7h-17S6 16 6 10Z" fill={active && name === 'bell-fill' ? 'currentColor' : 'none'} {...common} />
          <Path d="M10 20a2.2 2.2 0 0 0 4 0" fill="none" {...common} />
        </>
      );
    case 'thumb-up-fill':
      return <Path d="M7.5 10.5v9.5H4a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1h3.5Zm0 0 4.5-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 1.9 2.5l-1.5 5.8A3 3 0 0 1 16.5 20h-9v-9.5Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'pin-fill':
      return <Path d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'spinner-x':
    case 'circle-progress-check':
      return active ? (
        <>
          <Circle cx="12" cy="12" r="9" fill="none" {...common} />
          {name === 'spinner-x' ? (
            <><Line x1="8" y1="8" x2="16" y2="16" {...common} /><Line x1="16" y1="8" x2="8" y2="16" {...common} /></>
          ) : (
            <Path d="m7.5 12.5 3 3 6.5-7" fill="none" {...common} />
          )}
        </>
      ) : (
        <Circle cx="12" cy="12" r="9" fill="none" strokeDasharray="42 15" {...common} />
      );
    case 'dot-pulse':
      return <Circle cx="12" cy="12" r="4" fill="currentColor" />;
  }
}

function AnimatedProgressRing({
  progress,
  strokeWidth,
}: {
  progress: Animated.SharedValue<number>;
  strokeWidth: number;
}) {
  const circumference = 2 * Math.PI * 9;
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 1], [circumference, 0]),
  }));

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={`${circumference} ${circumference}`}
      transform="rotate(-90 12 12)"
    />
  );
}

function SpecialAnimatedIcon({
  name,
  active,
  size,
  color,
  strokeWidth,
  duration,
  errorColor,
  accessibilityLabel,
}: Required<Pick<AnimatedIconProps, 'size' | 'color' | 'strokeWidth' | 'duration'>> & {
  name: SpecialAnimatedIconName;
  active: boolean;
  errorColor: string;
  accessibilityLabel?: string;
}) {
  const progress = useSharedValue(active ? 1 : 0);
  const loop = useSharedValue(0);
  const impulse = useSharedValue(0);
  const swing = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const labels = specialLabels[name];
  const [resolved, setResolved] = useState(active);

  useEffect(() => {
    let resolveTimer: ReturnType<typeof setTimeout> | undefined;
    const staged = name === 'spinner-x' || name === 'circle-progress-check';
    if (!active) {
      setResolved(false);
    } else if (staged && !reduceMotion) {
      setResolved(false);
      resolveTimer = setTimeout(
        () => setResolved(true),
        name === 'circle-progress-check' ? 650 : 220,
      );
    } else {
      setResolved(active);
    }

    cancelAnimation(loop);
    cancelAnimation(impulse);
    cancelAnimation(swing);
    loop.value = 0;
    impulse.value = 0;
    swing.value = 0;

    progress.value = withTiming(active ? 1 : 0, {
      duration:
        reduceMotion ? 0 :
        name === 'circle-progress-check' && active ? 650 :
        name === 'bell-shake' ? 420 : duration,
      easing: Easing.bezier(...motion.easing.easeOut),
    });

    if (!reduceMotion && name === 'spinner-x' && !active) {
      loop.value = withRepeat(withTiming(1, { duration: 760, easing: Easing.linear }), -1, false);
    }
    if (!reduceMotion && name === 'bell-shake' && active) {
      swing.value = withSequence(
        withTiming(12, { duration: 70 }),
        withTiming(-10, { duration: 80 }),
        withTiming(6, { duration: 75 }),
        withTiming(-3, { duration: 70 }),
        withTiming(0, { duration: 85 }),
      );
    }
    if (!reduceMotion && name === 'bell-fill' && active) {
      swing.value = withSequence(
        withDelay(120, withTiming(8, { duration: 60 })),
        withTiming(-7, { duration: 70 }),
        withTiming(4, { duration: 65 }),
        withTiming(0, { duration: 80 }),
      );
    }
    if (!reduceMotion && name === 'dot-pulse' && active) {
      impulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 260, easing: Easing.inOut(Easing.quad) }),
        ),
        2,
        false,
      );
    }
    if (!reduceMotion && name.endsWith('-fill') && active) {
      impulse.value = withSequence(
        withTiming(1, { duration: 140, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) }),
      );
    }

    return () => {
      if (resolveTimer) clearTimeout(resolveTimer);
      cancelAnimation(loop);
      cancelAnimation(impulse);
      cancelAnimation(swing);
    };
  }, [active, duration, impulse, loop, name, progress, reduceMotion, swing]);

  const animatedStyle = useAnimatedStyle(() => {
    const value = progress.value;
    const rotation =
      name === 'spinner-x'
        ? loop.value * 360
        : name === 'bell-shake' || name === 'bell-fill' ? swing.value : 0;
    const scale =
      name === 'dot-pulse' ? 1 + impulse.value * 0.4 :
      name.endsWith('-fill') ? 1 + impulse.value * 0.2 : 1;
    const translateY =
      name === 'thumb-up-fill' ? -2 * impulse.value :
      name === 'pin-fill' ? 2 * impulse.value : 0;
    const opacity = name === 'dot-pulse' ? 1 - impulse.value * 0.4 : 1;
    return { opacity, transform: [{ rotate: `${rotation}deg` }, { scale }, { translateY }] };
  });

  const svgAnimatedProps = useAnimatedProps(() => ({
    color:
      name === 'spinner-x'
        ? interpolateColor(progress.value, [0, 1], [color, errorColor])
        : color,
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <AnimatedSvg
        animatedProps={svgAnimatedProps}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel ?? `${resolved ? labels[1] : labels[0]} icon`}
      >
        {name === 'circle-progress-check' && active && !resolved ? (
          <AnimatedProgressRing progress={progress} strokeWidth={strokeWidth} />
        ) : (
          <SpecialGlyph name={name} active={resolved} strokeWidth={strokeWidth} />
        )}
      </AnimatedSvg>
    </Animated.View>
  );
}

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

function MorphingAnimatedIcon({
  name,
  active,
  size = 24,
  color = '#18181B',
  strokeWidth = 1.5,
  duration = motion.duration.fast,
  accessibilityLabel,
}: AnimatedIconProps & { name: LineAnimatedIconName }) {
  const definition = definitions[name];
  const progress = useSharedValue(active ? 1 : 0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: reduceMotion ? 0 : duration,
      easing: Easing.bezier(...motion.easing.easeOut),
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
        {definition.from.lines.map((from, index) => (
          <MorphingLine
            key={index}
            progress={progress}
            from={from}
            to={definition.to.lines[index]}
            strokeWidth={strokeWidth}
          />
        ))}
      </AnimatedGroup>
    </Svg>
  );
}

export function AnimatedIcon(props: AnimatedIconProps) {
  const {
    name,
    active,
    size = 24,
    color = '#18181B',
    strokeWidth = 1.5,
    duration = motion.duration.fast,
    accessibilityLabel,
    autoResetAfter,
    onAutoReset,
    errorColor = '#DC2626',
  } = props;
  const [visualActive, setVisualActive] = useState(active);

  useEffect(() => {
    setVisualActive(active);
    const resetDelay = autoResetAfter ?? (name === 'copy-check' ? 1500 : undefined);
    if (!active || resetDelay == null) return;
    const timer = setTimeout(() => {
      setVisualActive(false);
      onAutoReset?.();
    }, resetDelay);
    return () => clearTimeout(timer);
  }, [active, autoResetAfter, name, onAutoReset]);

  if (isSpecialName(name)) {
    return (
      <SpecialAnimatedIcon
        name={name}
        active={visualActive}
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        duration={duration}
        errorColor={errorColor}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return <MorphingAnimatedIcon {...props} name={name} active={visualActive} />;
}
