import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

type Tokens = ReturnType<typeof useTokens>;

export type CheckboxSize = 'sm' | 'md' | 'lg';

export type CheckboxProps = Omit<PressableProps, 'style' | 'children'> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: CheckboxSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Dims = { box: number; iconSize: number; borderRadius: number; strokeWidth: number };

function checkboxDims(t: Tokens): Record<CheckboxSize, Dims> {
  return {
    sm: { box: 20, iconSize: 12, borderRadius: t.radii.sm, strokeWidth: 1.5 },
    md: { box: 24, iconSize: 14, borderRadius: t.radii.md - 2, strokeWidth: 2 },
    lg: { box: 32, iconSize: 18, borderRadius: t.radii.md, strokeWidth: 2.5 },
  };
}

function CheckIcon({ size, color, strokeWidth }: { size: number; color: string; strokeWidth: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M3 7.5L5.5 10L11 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const Checkbox = forwardRef<View, CheckboxProps>(function Checkbox(
  {
    checked,
    onCheckedChange,
    size = 'md',
    disabled = false,
    style,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const dims = useMemo(() => checkboxDims(t)[size], [t, size]);

  const fillAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  const [x1, y1, x2, y2] = t.motion.easing.easeOut;
  const easing = useMemo(() => Easing.bezier(x1, y1, x2, y2), [x1, y1, x2, y2]);

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: checked ? 1 : 0,
      duration: t.motion.duration.instant,
      easing,
      useNativeDriver: false,
    }).start();
  }, [checked, fillAnim, t.motion.duration.instant, easing]);

  const handlePress = useCallback(() => {
    if (!disabled) onCheckedChange?.(!checked);
  }, [disabled, onCheckedChange, checked]);

  const bgColor = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      'transparent',
      disabled ? t.colors.interactiveDisabled : t.colors.interactivePrimary,
    ],
  });

  const borderColor = disabled
    ? t.colors.borderSecondary
    : checked
      ? t.colors.interactivePrimary
      : t.colors.borderPrimary;

  const checkColor = disabled ? t.colors.textTertiary : t.colors.textInteractivePrimary;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={Math.max(0, Math.ceil((t.sizing.touchTarget.minimum - dims.box) / 2))}
      {...rest}
    >
      <Animated.View
        style={[
          {
            width: dims.box,
            height: dims.box,
            borderRadius: dims.borderRadius,
            borderWidth: checked ? 0 : 1.5,
            borderColor,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        {checked ? (
          <CheckIcon size={dims.iconSize} color={checkColor} strokeWidth={dims.strokeWidth} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
});
