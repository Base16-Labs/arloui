import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

type Tokens = ReturnType<typeof useTokens>;

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioAppearance = 'outlined' | 'filled';

export type RadioProps = Omit<PressableProps, 'style' | 'children'> & {
  selected: boolean;
  onSelect?: () => void;
  appearance?: RadioAppearance;
  size?: RadioSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Dims = { outer: number; dot: number; hole: number; borderWidth: number };

function radioDims(): Record<RadioSize, Dims> {
  return {
    sm: { outer: 20, dot: 10, hole: 8, borderWidth: 1.5 },
    md: { outer: 24, dot: 12, hole: 10, borderWidth: 1.5 },
    lg: { outer: 32, dot: 16, hole: 14, borderWidth: 2 },
  };
}

export const Radio = forwardRef<View, RadioProps>(function Radio(
  {
    selected,
    onSelect,
    appearance = 'outlined',
    size = 'md',
    disabled = false,
    style,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const dims = useMemo(() => radioDims()[size], [size]);

  const [fillAnim] = useState(() => new Animated.Value(selected ? 1 : 0));

  const [x1, y1, x2, y2] = t.motion.easing.easeOut;
  const easing = useMemo(() => Easing.bezier(x1, y1, x2, y2), [x1, y1, x2, y2]);

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: selected ? 1 : 0,
      duration: t.motion.duration.instant,
      easing,
      useNativeDriver: false,
    }).start();
  }, [selected, fillAnim, t.motion.duration.instant, easing]);

  const handlePress = useCallback(() => {
    if (!disabled && !selected) onSelect?.();
  }, [disabled, selected, onSelect]);

  const isOutlined = appearance === 'outlined';

  return (
    <Pressable
      ref={ref}
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={Math.max(0, Math.ceil((t.sizing.touchTarget.minimum - dims.outer) / 2))}
      {...rest}
    >
      {isOutlined ? (
        <OutlinedRadio t={t} dims={dims} fillAnim={fillAnim} selected={selected} disabled={disabled} style={style} />
      ) : (
        <FilledRadio t={t} dims={dims} fillAnim={fillAnim} selected={selected} disabled={disabled} style={style} />
      )}
    </Pressable>
  );
});

type RadioVisualProps = {
  t: Tokens;
  dims: Dims;
  fillAnim: Animated.Value;
  selected: boolean;
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
};

function OutlinedRadio({ t, dims, fillAnim, selected, disabled, style }: RadioVisualProps) {
  const borderColor = disabled
    ? t.colors.borderSecondary
    : selected
      ? t.colors.interactivePrimary
      : t.colors.borderPrimary;

  const ringBg = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      'transparent',
      disabled ? t.colors.textTertiary : t.colors.interactivePrimary,
    ],
  });

  return (
    <Animated.View
      style={[
        {
          width: dims.outer,
          height: dims.outer,
          borderRadius: dims.outer / 2,
          borderWidth: selected ? 0 : dims.borderWidth,
          borderColor,
          backgroundColor: ringBg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <View
        style={{
          width: dims.hole,
          height: dims.hole,
          borderRadius: dims.hole / 2,
          backgroundColor: t.colors.surfaceBackground,
        }}
      />
    </Animated.View>
  );
}

function FilledRadio({ t, dims, fillAnim, selected, disabled, style }: RadioVisualProps) {
  const borderColor = disabled
    ? t.colors.borderSecondary
    : selected
      ? t.colors.interactivePrimary
      : t.colors.borderPrimary;

  const dotColor = disabled ? t.colors.textTertiary : t.colors.interactivePrimary;

  const dotScale = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View
      style={[
        {
          width: dims.outer,
          height: dims.outer,
          borderRadius: dims.outer / 2,
          borderWidth: dims.borderWidth,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: dims.dot,
          height: dims.dot,
          borderRadius: dims.dot / 2,
          backgroundColor: dotColor,
          transform: [{ scale: dotScale }],
        }}
      />
    </View>
  );
}
