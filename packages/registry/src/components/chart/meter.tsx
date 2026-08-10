/**
 * Arlo UI — Meter
 *
 * One value against a target: budget used, storage filled, goal progress. This is
 * a magnitude, not a category, so it is a single hue rather than a series colour —
 * and a `bar` or a `ring`, which are the same data with different shapes.
 *
 *   <Meter value={72} max={100} label="Storage" />
 *   <Meter shape="ring" value={1840} max={2000} label="Steps" tone="positive" />
 *
 * Passing `warnAt` / `dangerAt` moves it onto the status palette, which is
 * reserved for state and always ships with a visible value — never colour alone.
 *
 * The fill sweeps up from empty on mount and on every value change, and the
 * readout counts with it, so the number and the shape always agree mid-flight.
 * It runs on the `slow` duration rather than `base`: a meter is read as a
 * quantity, and a fill that lands before the eye reaches it may as well be
 * static. Reduce Motion pins both straight to the final value.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

/**
 * Created once at module scope. Building it inside render returns a new component
 * type every pass, which remounts the circle and drops the animation mid-flight.
 */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type MeterShape = 'bar' | 'ring';
export type MeterTone = 'brand' | 'positive' | 'negative' | 'neutral';

export type MeterProps = {
  value: number;
  max?: number;
  min?: number;
  shape?: MeterShape;
  tone?: MeterTone;
  label?: string;
  /** Text in the middle of a ring, or beside a bar. Defaults to a percentage. */
  valueLabel?: string;
  /** Hide the numeric readout. Only do this where the value is stated nearby. */
  showValue?: boolean;
  /** Fraction (0-1) past which the meter turns warning. */
  warnAt?: number;
  /** Fraction (0-1) past which the meter turns danger. */
  dangerAt?: number;
  /** Bar thickness, or ring stroke width. */
  thickness?: number;
  /** Ring diameter. Ignored by the bar shape. */
  size?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Meter({
  value,
  max = 100,
  min = 0,
  shape = 'bar',
  tone = 'brand',
  label,
  valueLabel,
  showValue = true,
  warnAt,
  dangerAt,
  thickness = shape === 'ring' ? 10 : 8,
  size = 120,
  accessibilityLabel,
  style,
}: MeterProps) {
  const t = useTokens();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress] = useState(() => new Animated.Value(0));

  const range = max - min;
  const fraction = range === 0 ? 0 : Math.min(1, Math.max(0, (value - min) / range));

  /**
   * What the readout currently says. Tracks `progress` while the fill sweeps, so
   * it starts at empty alongside it — seeding this with `fraction` would paint
   * the final number for one frame before the sweep yanked it back to zero.
   */
  const [shownFraction, setShownFraction] = useState(0);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => active && setReduceMotion(on));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      // No listener and no state write — the readout reads `fraction` directly
      // in this mode, so there is nothing to keep in sync.
      progress.setValue(fraction);
      return;
    }
    // The readout is driven off the same value as the fill, so the number and the
    // shape can never disagree part-way through the sweep.
    const id = progress.addListener(({ value }) => setShownFraction(value));
    // Every presentation begins empty, including when the consumer switches
    // between bar and ring. The listener above resets the painted readout too.
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: fraction,
      duration: t.motion.duration.slow,
      easing: Easing.out(Easing.cubic),
      // Width and stroke offset are layout properties, so this can't go native.
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      // Land exactly on the target: the last listener frame is close, not equal.
      if (finished) setShownFraction(fraction);
    });
    return () => {
      animation.stop();
      progress.removeListener(id);
    };
  }, [fraction, progress, reduceMotion, shape, t.motion.duration.slow]);

  // Thresholds move the meter onto the reserved status palette; without them it
  // stays on the requested tone.
  const color = useMemo(() => {
    if (dangerAt != null && fraction >= dangerAt) return t.colors.feedbackError;
    if (warnAt != null && fraction >= warnAt) return t.colors.feedbackWarning;
    return tone === 'positive'
      ? t.colors.chartPositive
      : tone === 'negative'
        ? t.colors.chartNegative
        : tone === 'neutral'
          ? t.colors.textSecondary
          : t.colors.interactivePrimary;
  }, [dangerAt, warnAt, fraction, tone, t.colors]);

  /**
   * The settled value. Assistive tech gets this one — a screen reader announcing
   * a number that is still counting reads as noise, and the meter's semantic
   * value is where it is going, not where the sweep currently is.
   */
  const readout = valueLabel ?? `${Math.round(fraction * 100)}%`;
  /** What is painted, which counts up with the fill — or lands flat under Reduce Motion. */
  const shownReadout =
    valueLabel ?? `${Math.round((reduceMotion ? fraction : shownFraction) * 100)}%`;
  const a11y = accessibilityLabel ?? label;

  const track = t.colors.surfaceInput;

  if (shape === 'ring') {
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={a11y}
        accessibilityValue={{ min, max, now: value, text: readout }}
        style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
      >
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={thickness} fill="none" />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress.interpolate({
              inputRange: [0, 1],
              outputRange: [circumference, 0],
            })}
            // Start the sweep at 12 o'clock instead of 3.
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {showValue ? (
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.title2.fontSize,
                lineHeight: t.typography.title2.lineHeight,
                fontWeight: '700',
              }}
            >
              {shownReadout}
            </Text>
            {label ? (
              <Text
                numberOfLines={1}
                style={{
                  color: t.colors.textSecondary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  lineHeight: t.typography.bodySm.lineHeight,
                }}
              >
                {label}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={a11y}
      accessibilityValue={{ min, max, now: value, text: readout }}
      style={[{ gap: t.spacing[1] }, style]}
    >
      {label || showValue ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {label ? (
            <Text
              numberOfLines={1}
              style={{
                flexShrink: 1,
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {label}
            </Text>
          ) : (
            <View />
          )}
          {showValue ? (
            <Text
              style={{
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
                fontWeight: '600',
              }}
            >
              {shownReadout}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View
        style={{
          height: thickness,
          borderRadius: t.radii.full,
          backgroundColor: track,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: t.radii.full,
            backgroundColor: color,
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  );
}
