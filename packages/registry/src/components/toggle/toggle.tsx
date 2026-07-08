import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

type Tokens = ReturnType<typeof useTokens>;

export type ToggleSize = 'sm' | 'md';

export type ToggleProps = Omit<PressableProps, 'style' | 'children'> & {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  size?: ToggleSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Dims = {
  trackWidth: number;
  trackHeight: number;
  thumbSize: number;
  thumbInset: number;
};

function toggleDims(t: Tokens): Record<ToggleSize, Dims> {
  return {
    sm: { trackWidth: 40, trackHeight: 24, thumbSize: 18, thumbInset: 3 },
    md: { trackWidth: 52, trackHeight: 32, thumbSize: 26, thumbInset: 3 },
  };
}

function toggleColors(t: Tokens, disabled: boolean) {
  return {
    trackOn: disabled ? t.colors.interactiveDisabled : t.colors.interactivePrimary,
    trackOff: disabled ? t.colors.interactiveDisabled : t.colors.surfaceInput,
    thumb: disabled ? t.colors.textTertiary : '#FFFFFF',
    border: disabled ? t.colors.borderSecondary : t.colors.borderPrimary,
  };
}

export const Toggle = forwardRef<View, ToggleProps>(function Toggle(
  {
    value,
    onValueChange,
    size = 'md',
    disabled = false,
    style,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const dims = useMemo(() => toggleDims(t)[size], [t, size]);
  const colors = useMemo(() => toggleColors(t, disabled), [t, disabled]);

  const position = useRef(new Animated.Value(value ? 1 : 0)).current;

  const [x1, y1, x2, y2] = t.motion.easing.easeOut;
  const easing = useMemo(() => Easing.bezier(x1, y1, x2, y2), [x1, y1, x2, y2]);

  useEffect(() => {
    Animated.timing(position, {
      toValue: value ? 1 : 0,
      duration: t.motion.duration.fast,
      easing,
      useNativeDriver: false,
    }).start();
  }, [value, position, t.motion.duration.fast, easing]);

  const handlePress = useCallback(() => {
    if (!disabled) onValueChange?.(!value);
  }, [disabled, onValueChange, value]);

  const travelDistance = dims.trackWidth - dims.thumbSize - dims.thumbInset * 2;

  const thumbTranslateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travelDistance],
  });

  const trackColor = position.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.trackOff, colors.trackOn],
  });

  const trackBorderColor = position.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.trackOn],
  });

  return (
    <Pressable
      ref={ref}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={Math.max(0, Math.ceil((t.sizing.touchTarget.minimum - dims.trackHeight) / 2))}
      {...rest}
    >
      <Animated.View
        style={[
          {
            width: dims.trackWidth,
            height: dims.trackHeight,
            borderRadius: dims.trackHeight / 2,
            backgroundColor: trackColor,
            borderWidth: value ? 0 : 1,
            borderColor: trackBorderColor,
            justifyContent: 'center',
            paddingHorizontal: dims.thumbInset,
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            {
              width: dims.thumbSize,
              height: dims.thumbSize,
              borderRadius: dims.thumbSize / 2,
              backgroundColor: colors.thumb,
            },
            Platform.OS === 'ios' || Platform.OS === 'web'
              ? {
                  shadowColor: '#101828',
                  shadowOpacity: 0.12,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                }
              : { elevation: 3 },
            { transform: [{ translateX: thumbTranslateX }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
});
