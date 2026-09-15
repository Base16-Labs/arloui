import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import { useReduceMotion } from '../../foundation/reduce-motion';

export type SpinnerAppearance = 'spokes' | 'arc' | 'dots' | 'bars' | 'pulse';
export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'neutral' | 'accent';

export type SpinnerProps = {
  appearance?: SpinnerAppearance;
  /** One of the named sizes, or an exact diameter in px. */
  size?: SpinnerSize | number;
  tone?: SpinnerTone;
  /** Overrides `tone` — pass the colour of whatever surface it sits on. */
  color?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SIZES: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 32 };

/** Spoke count of `UIActivityIndicatorView`, and the number of rotation steps. */
const SPOKES = 12;
const SPOKE_REVOLUTION = 900;
const ARC_REVOLUTION = 750;
const DOT_CYCLE = 480;
const DOT_STAGGER = 140;
const BARS = 4;
const BAR_CYCLE = 420;
const BAR_STAGGER = 110;
const PULSE_RINGS = 2;
const PULSE_CYCLE = 1200;

export function Spinner({
  appearance = 'spokes',
  size = 'md',
  tone = 'neutral',
  color,
  accessibilityLabel,
  style,
  testID,
}: SpinnerProps) {
  const t = useTokens();
  const reduceMotion = useReduceMotion();
  const px = typeof size === 'number' ? size : SIZES[size];
  const resolvedColor = color ?? (tone === 'accent' ? t.colors.accent : t.colors.textSecondary);


  const shared = { px, color: resolvedColor, still: reduceMotion };

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? 'Loading'}
      accessibilityState={{ busy: true }}
      style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
    >
      {appearance === 'arc' ? (
        <ArcSpinner {...shared} track={t.colors.surfaceStrong} />
      ) : appearance === 'dots' ? (
        <DotsSpinner {...shared} />
      ) : appearance === 'bars' ? (
        <BarsSpinner {...shared} />
      ) : appearance === 'pulse' ? (
        <PulseSpinner {...shared} />
      ) : (
        <SpokesSpinner {...shared} />
      )}
    </View>
  );
}

type GlyphProps = { px: number; color: string; still: boolean };

/** Drives a looping 0→1 value, unless motion is being held still. */
function useLoop(duration: number, still: boolean, easing = Easing.linear) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (still) return;
    const loop = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration, easing, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [duration, easing, progress, still]);

  return progress;
}

/**
 * The system activity indicator: spokes hold a fixed opacity ramp and the whole
 * ring steps round one spoke at a time, rather than sweeping continuously.
 */
function SpokesSpinner({ px, color, still }: GlyphProps) {
  const progress = useLoop(SPOKE_REVOLUTION, still);
  const spokeLength = Math.max(3, px * 0.28);
  const spokeWidth = Math.max(1.5, px * 0.085);

  // A staircase interpolation: hold each angle for a full step, then jump.
  const rotate = useMemo(() => {
    const inputRange: number[] = [];
    const outputRange: string[] = [];
    for (let step = 0; step < SPOKES; step++) {
      const angle = `${(step * 360) / SPOKES}deg`;
      inputRange.push(step / SPOKES, (step + 1) / SPOKES - 0.0001);
      outputRange.push(angle, angle);
    }
    inputRange.push(1);
    outputRange.push('360deg');
    return progress.interpolate({ inputRange, outputRange });
  }, [progress]);

  return (
    <Animated.View style={{ width: px, height: px, transform: still ? undefined : [{ rotate }] }}>
      {Array.from({ length: SPOKES }, (_, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: (px - spokeWidth) / 2,
            top: (px - spokeLength) / 2,
            width: spokeWidth,
            height: spokeLength,
            borderRadius: spokeWidth / 2,
            backgroundColor: color,
            opacity: 1 - (index / SPOKES) * 0.85,
            transform: [
              { rotate: `${(index * 360) / SPOKES}deg` },
              { translateY: -(px / 2 - spokeLength / 2) },
            ],
          }}
        />
      ))}
    </Animated.View>
  );
}

/** A faint closed track with one bright segment sweeping round it. */
function ArcSpinner({ px, color, track, still }: GlyphProps & { track: string }) {
  const progress = useLoop(ARC_REVOLUTION, still);
  const width = Math.max(2, px * 0.11);
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const ring: ViewStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: width,
    borderRadius: px / 2,
  };

  return (
    <View style={{ width: px, height: px }}>
      <View style={[ring, { borderColor: track }]} />
      <Animated.View
        style={[
          ring,
          {
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: color,
            transform: still ? undefined : [{ rotate }],
          },
        ]}
      />
    </View>
  );
}

/**
 * Runs one looping value per element, each offset by `stagger` ms.
 *
 * The offset is a one-shot timer rather than a leading `Animated.delay`, so it
 * shifts the phase without also padding every iteration — and it keeps the
 * looped sequence purely native-driven, since `Animated.delay` is not.
 */
function useStaggered(count: number, cycle: number, stagger: number, still: boolean) {
  const [values] = useState(() => Array.from({ length: count }, () => new Animated.Value(0)));

  useEffect(() => {
    for (const value of values) {
      value.stopAnimation();
      value.setValue(0);
    }
    if (still) return;
    const loops = values.map((value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: cycle / 2,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: cycle / 2,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    const timers = loops.map((loop, index) =>
      setTimeout(() => loop.start(), index * stagger),
    );
    return () => {
      for (const timer of timers) clearTimeout(timer);
      for (const loop of loops) loop.stop();
    };
  }, [count, cycle, stagger, still, values]);

  return values;
}

/** Three dots lifting and fading in sequence. */
function DotsSpinner({ px, color, still }: GlyphProps) {
  const dots = useStaggered(3, DOT_CYCLE, DOT_STAGGER, still);
  const diameter = Math.max(3, px * 0.3);
  const gap = Math.max(2, px * 0.18);

  return (
    <View style={{ height: px, flexDirection: 'row', alignItems: 'center', gap }}>
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={{
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            backgroundColor: color,
            opacity: still ? 0.6 : dot.interpolate({ inputRange: [0, 1], outputRange: [0.32, 1] }),
            transform: still
              ? undefined
              : [
                  {
                    translateY: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -diameter * 0.45],
                    }),
                  },
                ],
          }}
        />
      ))}
    </View>
  );
}

/** An equaliser of bars breathing in sequence. */
function BarsSpinner({ px, color, still }: GlyphProps) {
  const bars = useStaggered(BARS, BAR_CYCLE, BAR_STAGGER, still);
  const width = Math.max(2, px * 0.15);
  const gap = Math.max(1.5, px * 0.1);

  return (
    <View style={{ height: px, flexDirection: 'row', alignItems: 'center', gap }}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={{
            width,
            height: px,
            borderRadius: width / 2,
            backgroundColor: color,
            opacity: still ? 0.6 : 1,
            transform: still
              ? [{ scaleY: 0.6 }]
              : [{ scaleY: bar.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }) }],
          }}
        />
      ))}
    </View>
  );
}

/** Rings pushing outward from the centre and fading, radar-style. */
function PulseSpinner({ px, color, still }: GlyphProps) {
  const [rings] = useState(() => Array.from({ length: PULSE_RINGS }, () => new Animated.Value(0)));

  useEffect(() => {
    for (const ring of rings) {
      ring.stopAnimation();
      ring.setValue(0);
    }
    if (still) return;
    // Each ring loops one uninterrupted sweep; the half-cycle offset is a
    // one-shot timer. Putting it inside the loop as an `Animated.delay` instead
    // would re-run the wait every iteration, stalling the ring between sweeps.
    const loops = rings.map((ring) =>
      Animated.loop(
        Animated.timing(ring, {
          toValue: 1,
          duration: PULSE_CYCLE,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    );
    const timers = loops.map((loop, index) =>
      setTimeout(() => loop.start(), (index * PULSE_CYCLE) / PULSE_RINGS),
    );
    return () => {
      for (const timer of timers) clearTimeout(timer);
      for (const loop of loops) loop.stop();
    };
  }, [rings, still]);

  if (still) {
    return (
      <View
        style={{
          width: px,
          height: px,
          borderRadius: px / 2,
          backgroundColor: color,
          opacity: 0.45,
          transform: [{ scale: 0.7 }],
        }}
      />
    );
  }

  return (
    <View style={{ width: px, height: px }}>
      {rings.map((ring, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: px / 2,
            backgroundColor: color,
            opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
            transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
          }}
        />
      ))}
    </View>
  );
}
