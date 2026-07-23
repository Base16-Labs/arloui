import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type SpinnerAppearance = 'spokes' | 'arc' | 'dots';
export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'neutral' | 'accent' | 'inverse';

export type SpinnerProps = {
  appearance?: SpinnerAppearance;
  /** One of the named sizes, or an exact diameter in px. */
  size?: SpinnerSize | number;
  tone?: SpinnerTone;
  /** Overrides `tone`. */
  color?: string;
  /** Rendered under the spinner and used as the accessibility label. */
  label?: string;
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

export function Spinner({
  appearance = 'spokes',
  size = 'md',
  tone = 'neutral',
  color,
  label,
  accessibilityLabel,
  style,
  testID,
}: SpinnerProps) {
  const t = useTokens();
  const [reduceMotion, setReduceMotion] = useState(false);
  const px = typeof size === 'number' ? size : SIZES[size];
  const resolvedColor =
    color ??
    (tone === 'accent'
      ? t.colors.accent
      : tone === 'inverse'
        ? t.colors.textInverse
        : t.colors.textSecondary);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => active && setReduceMotion(enabled));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const glyph =
    appearance === 'arc' ? (
      <ArcSpinner px={px} color={resolvedColor} track={t.colors.surfaceStrong} still={reduceMotion} />
    ) : appearance === 'dots' ? (
      <DotsSpinner px={px} color={resolvedColor} still={reduceMotion} />
    ) : (
      <SpokesSpinner px={px} color={resolvedColor} still={reduceMotion} />
    );

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Loading'}
      accessibilityState={{ busy: true }}
      style={[{ alignItems: 'center', gap: label ? 10 : 0 }, style]}
    >
      {glyph}
      {label ? (
        <Text
          style={{
            color: t.colors.textSecondary,
            fontFamily: 'Manrope Medium',
            fontSize: 13,
            lineHeight: 18,
          }}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * The system activity indicator: spokes hold a fixed opacity ramp and the whole
 * ring steps round one spoke at a time, rather than sweeping continuously.
 */
function SpokesSpinner({ px, color, still }: { px: number; color: string; still: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;
  const spokeLength = Math.max(3, px * 0.28);
  const spokeWidth = Math.max(1.5, px * 0.085);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (still) return;
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: SPOKE_REVOLUTION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, still]);

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
    <Animated.View
      style={{ width: px, height: px, transform: still ? undefined : [{ rotate }] }}
    >
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
function ArcSpinner({
  px,
  color,
  track,
  still,
}: {
  px: number;
  color: string;
  track: string;
  still: boolean;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const width = Math.max(2, px * 0.11);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (still) return;
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: ARC_REVOLUTION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, still]);

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

/** Three dots lifting and fading in sequence. */
function DotsSpinner({ px, color, still }: { px: number; color: string; still: boolean }) {
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const diameter = Math.max(3, px * 0.3);
  const gap = Math.max(2, px * 0.18);

  useEffect(() => {
    for (const dot of dots) {
      dot.stopAnimation();
      dot.setValue(0);
    }
    if (still) return;
    const loops = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * DOT_STAGGER),
          Animated.timing(dot, {
            toValue: 1,
            duration: DOT_CYCLE / 2,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: DOT_CYCLE / 2,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay((dots.length - index - 1) * DOT_STAGGER),
        ]),
      ),
    );
    for (const loop of loops) loop.start();
    return () => {
      for (const loop of loops) loop.stop();
    };
  }, [dots, still]);

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
            opacity: still
              ? 0.6
              : dot.interpolate({ inputRange: [0, 1], outputRange: [0.32, 1] }),
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
