/**
 * Arlo UI — GhostButton
 *
 * Chromeless action: no background container, no border, no horizontal padding.
 * Heights reflect text line-height only (sm/md: 24px, lg: 28px, xl: 40px).
 * Three types: primary (brand blue), neutral (grey text), destructive (red text).
 */
import { forwardRef, useMemo, useRef, useState } from 'react';
import { haptic as triggerHaptic } from '@arloui/utils';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type GhostButtonType = 'primary' | 'neutral' | 'destructive';
export type GhostButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type GhostButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children: string;
  type?: GhostButtonType;
  size?: GhostButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  haptic?: 'light' | 'medium' | 'none';
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

type GhostDims = { height: number; type: { fontSize: number; lineHeight: number }; gap: number; iconSize: number };

function resolveGhostDims(size: GhostButtonSize, t: ReturnType<typeof useTokens>): GhostDims {
  switch (size) {
    case 'sm':
      return { height: 24, type: t.typography.bodySm, gap: t.spacing[1], iconSize: t.sizing.icon.xs };
    case 'lg':
      return { height: 28, type: t.typography.title3, gap: t.spacing[2], iconSize: t.sizing.icon.sm };
    case 'xl':
      return { height: 40, type: t.typography.title2, gap: t.spacing[3], iconSize: t.sizing.icon.md };
    default:
      return { height: 24, type: t.typography.body, gap: t.spacing[2], iconSize: t.sizing.icon.sm };
  }
}

function resolveTextColor(t: ReturnType<typeof useTokens>, type: GhostButtonType, disabled: boolean): string {
  if (disabled) return t.colors.textTertiary;
  switch (type) {
    case 'primary': return t.colors.textInteractiveTertiary;
    case 'neutral': return t.colors.textPrimary;
    case 'destructive': return t.colors.feedbackError;
  }
}

export const GhostButton = forwardRef<View, GhostButtonProps>(function GhostButton(
  {
    children,
    type = 'neutral',
    size = 'md',
    loading = false,
    disabled = false,
    leadingIcon,
    trailingIcon,
    haptic = 'light',
    onPressIn,
    onPressOut,
    style,
    labelStyle,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const press = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);

  const isPressDisabled = disabled || loading;
  const dims = useMemo(() => resolveGhostDims(size, t), [size, t]);
  const textColor = useMemo(() => resolveTextColor(t, type, disabled), [t, type, disabled]);

  const iconWrap = useMemo(
    () => ({ width: dims.iconSize, height: dims.iconSize, alignItems: 'center', justifyContent: 'center' }) as const,
    [dims.iconSize],
  );

  const pressedBg = useMemo(() => {
    if (type === 'destructive') return t.colors.feedbackErrorBg;
    return t.colors.touchFeedbackMain;
  }, [type, t.colors]);

  const handleIn = (e: GestureResponderEvent) => {
    setPressed(true);
    if (haptic !== 'none') void triggerHaptic(haptic);
    Animated.timing(press, {
      toValue: 1,
      duration: 120,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };

  const handleOut = (e: GestureResponderEvent) => {
    setPressed(false);
    Animated.timing(press, {
      toValue: 0,
      duration: 200,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  const animated = {
    transform: [{ scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.97] }) }],
  };

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityState={{ disabled: isPressDisabled, busy: loading }}
      disabled={isPressDisabled}
      onPressIn={handleIn}
      onPressOut={handleOut}
      hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
      {...rest}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: dims.height,
            gap: dims.gap,
            borderRadius: t.radii.sm,
            backgroundColor: !disabled && pressed ? pressedBg : 'transparent',
          },
          animated,
          style,
        ]}
      >
        {loading ? (
          <View style={iconWrap}>
            <ActivityIndicator color={textColor} size="small" />
          </View>
        ) : leadingIcon ? (
          <View style={iconWrap}>{leadingIcon}</View>
        ) : null}
        {!loading ? (
          <Text
            numberOfLines={1}
            style={[
              {
                color: textColor,
                fontFamily: t.fontFamilies.sans,
                fontSize: dims.type.fontSize,
                lineHeight: dims.type.lineHeight,
                fontWeight: '600',
              },
              labelStyle,
            ]}
          >
            {children}
          </Text>
        ) : null}
        {!loading && trailingIcon ? <View style={iconWrap}>{trailingIcon}</View> : null}
      </Animated.View>
    </Pressable>
  );
});
