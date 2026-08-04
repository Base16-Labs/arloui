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
      progress.setValue(fraction);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: fraction,
      duration: t.motion.duration.base,
      easing: Easing.out(Easing.cubic),
      // Width and stroke offset are layout properties, so this can't go native.
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [fraction, progress, reduceMotion, t.motion.duration.base]);

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

  const readout = valueLabel ?? `${Math.round(fraction * 100)}%`;
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
              {readout}
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
              {readout}
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
