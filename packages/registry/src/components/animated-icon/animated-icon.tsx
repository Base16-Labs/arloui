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
  | 'eye-open-closed'
  | 'lock-unlock'
  | 'volume-mute'
  | 'mic-mute'
  | 'sun-moon'
  | 'grid-list'
  | 'sort-ascending-descending'
  | 'expand-collapse'
  | 'search-close'
  | 'send-loading'
  | 'copy-check'
  | 'upload-check'
  | 'envelope-open';

type SpecialAnimatedIconName =
  | 'heart-fill'
  | 'star-fill'
  | 'bookmark-fill'
  | 'bell-fill'
  | 'thumb-up-fill'
  | 'pin-fill'
  | 'spinner-check'
  | 'spinner-x'
  | 'circle-progress-check'
  | 'refresh-sync'
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
  'eye-open-closed': {
    fromLabel: 'Eye open',
    toLabel: 'Eye closed',
    from: {
      lines: [
        [3, 12, 7.5, 7.5],
        [7.5, 7.5, 12, 6.5],
        [12, 6.5, 16.5, 7.5],
        [16.5, 7.5, 21, 12],
        [10.5, 12, 13.5, 12],
      ],
    },
    to: {
      lines: [
        [3.5, 10, 8, 13],
        [8, 13, 12, 13.5],
        [12, 13.5, 16, 13],
        [16, 13, 20.5, 10],
        point,
      ],
    },
  },
  'lock-unlock': {
    fromLabel: 'Locked',
    toLabel: 'Unlocked',
    from: {
      lines: [
        [6, 10, 18, 10],
        [6, 10, 6, 19],
        [18, 10, 18, 19],
        [6, 19, 18, 19],
        [8, 10, 8, 7],
        [8, 7, 10, 5],
        [10, 5, 14, 5],
        [14, 5, 16, 7],
        [16, 7, 16, 10],
      ],
    },
    to: {
      lines: [
        [6, 10, 18, 10],
        [6, 10, 6, 19],
        [18, 10, 18, 19],
        [6, 19, 18, 19],
        [8, 10, 8, 7],
        [8, 7, 10, 5],
        [10, 5, 14, 5],
        [14, 5, 17, 7],
        [17, 7, 19, 6],
      ],
    },
  },
  'volume-mute': {
    fromLabel: 'Volume on',
    toLabel: 'Muted',
    from: {
      lines: [[4, 10, 8, 10], [8, 10, 13, 6], [13, 6, 13, 18], [13, 18, 8, 14], [8, 14, 4, 14], [16, 9, 19, 12], [19, 12, 16, 15]],
    },
    to: {
      lines: [[4, 10, 8, 10], [8, 10, 13, 6], [13, 6, 13, 18], [13, 18, 8, 14], [8, 14, 4, 14], [16, 8, 21, 16], [21, 8, 16, 16]],
    },
  },
  'mic-mute': {
    fromLabel: 'Microphone on',
    toLabel: 'Microphone muted',
    from: {
      lines: [[9, 5, 9, 12], [9, 5, 15, 5], [15, 5, 15, 12], [6, 11, 6, 13], [6, 13, 9, 16], [9, 16, 15, 16], [15, 16, 18, 13], [18, 13, 18, 11], [12, 16, 12, 20]],
    },
    to: {
      lines: [[9, 5, 9, 12], [9, 5, 15, 5], [15, 5, 15, 12], [6, 11, 6, 13], [6, 13, 9, 16], [9, 16, 15, 16], [15, 16, 18, 13], [5, 5, 19, 19], [12, 16, 12, 20]],
    },
  },
  'sun-moon': {
    fromLabel: 'Light mode',
    toLabel: 'Dark mode',
    from: {
      lines: [[12, 5, 12, 2.5], [12, 21.5, 12, 19], [5, 12, 2.5, 12], [21.5, 12, 19, 12], [7.25, 7.25, 5.5, 5.5], [18.5, 18.5, 16.75, 16.75], [16.75, 7.25, 18.5, 5.5], [5.5, 18.5, 7.25, 16.75], [8, 12, 16, 12]],
    },
    to: {
      lines: [[9, 4, 9, 4, 0], [9, 20, 9, 20, 0], [4, 12, 4, 12, 0], [20, 12, 20, 12, 0], [6, 6, 6, 6, 0], [18, 18, 18, 18, 0], [18, 6, 18, 6, 0], [6, 18, 6, 18, 0], [7, 5, 18, 18]],
    },
    rotation: 18,
  },
  'grid-list': {
    fromLabel: 'Grid',
    toLabel: 'List',
    from: {
      lines: [[5, 6, 9, 6], [15, 6, 19, 6], [5, 12, 9, 12], [15, 12, 19, 12], [5, 18, 9, 18], [15, 18, 19, 18]],
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
    to: { lines: [[4, 9, 9, 9], [9, 9, 9, 4], [15, 4, 15, 9], [15, 9, 20, 9], [20, 15, 15, 15], [15, 15, 15, 20], [9, 20, 9, 15], [9, 15, 4, 15]] },
  },
  'search-close': {
    fromLabel: 'Search',
    toLabel: 'Close',
    from: { lines: [[5, 10, 8, 6], [8, 6, 14, 6], [14, 6, 17, 10], [17, 10, 14, 14], [14, 14, 8, 14], [8, 14, 5, 10], [15.5, 14.5, 20, 19]] },
    to: { lines: [[6, 6, 18, 18], point, point, [18, 6, 6, 18], point, point, point] },
  },
  'send-loading': {
    fromLabel: 'Send',
    toLabel: 'Loading',
    from: { lines: [[4, 5, 20, 12], [20, 12, 4, 19], [4, 19, 8, 12], [8, 12, 4, 5]] },
    to: { lines: [[12, 4, 18, 7], [18, 7, 20, 12], [20, 12, 17, 17], [17, 17, 12, 20]] },
    rotation: 180,
  },
  'copy-check': {
    fromLabel: 'Copy',
    toLabel: 'Copied',
    from: { lines: [[8, 8, 18, 8], [18, 8, 18, 18], [18, 18, 8, 18], [8, 18, 8, 8], [5, 15, 5, 5], [5, 5, 15, 5]] },
    to: { lines: [[5, 12, 10, 17], [10, 17, 19, 7], point, point, point, point] },
  },
  'upload-check': {
    fromLabel: 'Upload',
    toLabel: 'Complete',
    from: { lines: [[12, 20, 12, 8], [7, 13, 12, 8], [12, 8, 17, 13]] },
    to: { lines: [[5, 12, 10, 17], [10, 17, 19, 7], point] },
  },
  'envelope-open': {
    fromLabel: 'Sealed mail',
    toLabel: 'Open mail',
    from: { lines: [[4, 7, 12, 13], [12, 13, 20, 7], [4, 7, 20, 7], [4, 7, 4, 18], [4, 18, 20, 18], [20, 18, 20, 7]] },
    to: { lines: [[4, 12, 12, 5], [12, 5, 20, 12], [4, 12, 12, 17], [4, 12, 4, 19], [4, 19, 20, 19], [20, 19, 20, 12]] },
  },
};

const specialLabels: Record<SpecialAnimatedIconName, readonly [string, string]> = {
  'heart-fill': ['Heart outline', 'Heart filled'],
  'star-fill': ['Star outline', 'Star filled'],
  'bookmark-fill': ['Bookmark outline', 'Bookmark filled'],
  'bell-fill': ['Bell outline', 'Bell filled'],
  'thumb-up-fill': ['Thumb up outline', 'Thumb up filled'],
  'pin-fill': ['Pin outline', 'Pin filled'],
  'spinner-check': ['Loading', 'Success'],
  'spinner-x': ['Loading', 'Error'],
  'circle-progress-check': ['In progress', 'Complete'],
  'refresh-sync': ['Refresh', 'Syncing'],
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
      return <Path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'star-fill':
      return <Path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9L6.4 20l1.1-6.2L3 9.4l6.2-.9L12 2.8Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'bookmark-fill':
      return <Path d="M6 3.5h12v17l-6-4-6 4v-17Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'bell-fill':
    case 'bell-shake':
      return (
        <>
          <Path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" fill={active && name === 'bell-fill' ? 'currentColor' : 'none'} {...common} />
          <Path d="M10 21h4" fill="none" {...common} />
        </>
      );
    case 'thumb-up-fill':
      return <Path d="M7 10v11H3V10h4Zm0 1 5-8c1.5 0 2 1 2 2.5L13 10h6c1.2 0 2 .9 1.7 2.1l-1.4 6.5A3 3 0 0 1 16.4 21H7V11Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'pin-fill':
      return <Path d="M12 22s7-6.2 7-13A7 7 0 1 0 5 9c0 6.8 7 13 7 13Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'spinner-check':
    case 'spinner-x':
    case 'circle-progress-check':
      return active ? (
        <>
          <Circle cx="12" cy="12" r="9" fill="none" {...common} />
          {name === 'spinner-x' ? (
            <><Line x1="8.5" y1="8.5" x2="15.5" y2="15.5" {...common} /><Line x1="15.5" y1="8.5" x2="8.5" y2="15.5" {...common} /></>
          ) : (
            <Path d="m7.5 12.5 3 3 6-7" fill="none" {...common} />
          )}
        </>
      ) : (
        <Circle cx="12" cy="12" r="9" fill="none" strokeDasharray="42 15" {...common} />
      );
    case 'refresh-sync':
      return (
        <>
          <Path d="M20 7v5h-5M4 17v-5h5" fill="none" {...common} />
          <Path d="M6.1 8.5A7 7 0 0 1 18.7 7M17.9 15.5A7 7 0 0 1 5.3 17" fill="none" {...common} />
        </>
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
    const staged = name === 'spinner-check' || name === 'spinner-x' || name === 'circle-progress-check';
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
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    if (!reduceMotion && ((name === 'spinner-check' || name === 'spinner-x') && !active)) {
      loop.value = withRepeat(withTiming(1, { duration: 760, easing: Easing.linear }), -1, false);
    }
    if (!reduceMotion && name === 'refresh-sync' && active) {
      loop.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.linear }), -1, false);
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
      name === 'refresh-sync' || name === 'spinner-check' || name === 'spinner-x'
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
  strokeWidth = 1.75,
  duration = 200,
  accessibilityLabel,
}: AnimatedIconProps & { name: LineAnimatedIconName }) {
  const definition = definitions[name];
  const progress = useSharedValue(active ? 1 : 0);
  const loop = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    cancelAnimation(loop);
    loop.value = 0;
    progress.value = withTiming(active ? 1 : 0, {
      duration: reduceMotion ? 0 : duration,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    if (!reduceMotion && name === 'send-loading' && active) {
      loop.value = withRepeat(withTiming(1, { duration: 760, easing: Easing.linear }), -1, false);
    }
    return () => cancelAnimation(loop);
  }, [active, duration, loop, name, progress, reduceMotion]);

  const rotation = useAnimatedProps(() => ({
    rotation: interpolate(
      progress.value,
      [0, 1],
      [definition.from.rotation ?? 0, definition.to.rotation ?? 0],
    ) + (name === 'send-loading' && active ? loop.value * 360 : 0),
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
    strokeWidth = 1.75,
    duration = 200,
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
