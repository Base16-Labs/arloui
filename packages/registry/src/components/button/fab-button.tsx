/**
 * Arlo UI — FAB (Floating Action Button)
 *
 * Circular, 48×48px, single icon. Primary or neutral tone.
 * Shadow on rest, no shadow on press. Reduced opacity (~28%) when disabled.
 * Export `FAB` is the canonical name; `FabButton` kept for backward compatibility.
 */
import { forwardRef, useMemo, useRef, useState, type ReactNode } from 'react';
import { haptic as triggerHaptic } from '@arloui/utils';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type FabTone = 'primary' | 'neutral';

export type FABProps = Omit<PressableProps, 'style' | 'children'> & {
  icon: ReactNode;
  /** @deprecated Use `icon` prop instead. */
  children?: ReactNode;
  tone?: FabTone;
  disabled?: boolean;
  haptic?: 'light' | 'medium' | 'none';
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

/** @deprecated Use `FABProps`. */
export type FabButtonProps = FABProps;

const FAB_SIZE = 48;
const FAB_ICON_SIZE = 24;

export const FAB = forwardRef<View, FABProps>(function FAB(
  {
    icon,
    children,
    tone = 'primary',
    disabled = false,
    haptic = 'medium',
    accessibilityLabel,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
    style,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const press = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const content = icon ?? children;

  const palette = useMemo(() => {
    if (tone === 'primary') {
      return { rest: t.colors.interactivePrimary, pressed: t.colors.interactivePrimaryPressed };
    }
    return { rest: t.colors.surfaceElevated, pressed: t.colors.interactiveSecondaryPressed };
  }, [t.colors, tone]);

  const shadow = useMemo(() => {
    if (disabled || pressed) return t.shadows.none as unknown as ViewStyle;
    return t.shadows.sm as unknown as ViewStyle;
  }, [disabled, pressed, t.shadows]);

  const focusOutline = useMemo((): ViewStyle | undefined => {
    if (Platform.OS !== 'web' || !focused || disabled) return undefined;
    return {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: t.colors.focusRingMain,
      outlineOffset: 4,
    } as ViewStyle;
  }, [disabled, focused, t.colors.focusRingMain]);

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

  const bg = pressed ? palette.pressed : palette.rest;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={handleIn}
      onPressOut={handleOut}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      {...rest}
    >
      <Animated.View
        style={[
          {
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: t.radii.full,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.28 : 1,
          },
          shadow,
          focusOutline,
          animated,
          style,
        ]}
      >
        <View style={{ width: FAB_ICON_SIZE, height: FAB_ICON_SIZE, alignItems: 'center', justifyContent: 'center' }}>
          {content}
        </View>
      </Animated.View>
    </Pressable>
  );
});

/** @deprecated Use `FAB`. */
export const FabButton = FAB;
