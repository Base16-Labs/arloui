/**
 * Arlo UI — FAB / circular icon button
 *
 * Circular control with default shadow (rest), darker fill while pressed, reduced opacity when disabled,
 * and on web a focus ring with offset (outline) matching Figma FAB states.
 */
import { forwardRef, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
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

type Size = 'sm' | 'md' | 'lg' | 'xl';

export type FabButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  /** Icon centered in the circle — tint externally or pass colored glyph. */
  children: ReactNode;
  tone?: FabTone;
  size?: Size;
  disabled?: boolean;
  /** Accessibility — required for icon-only control. */
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

export const FabButton = forwardRef<View, FabButtonProps>(function FabButton(
  {
    children,
    tone = 'primary',
    size = 'md',
    disabled = false,
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

  const d = useMemo(() => {
    switch (size) {
      case 'sm':
        return t.sizing.buttonHeight.sm;
      case 'md':
        return t.sizing.buttonHeight.md;
      case 'lg':
        return t.sizing.buttonHeight.lg;
      case 'xl':
        return t.sizing.buttonHeight.xl;
    }
  }, [size, t.sizing.buttonHeight]);

  const palette = useMemo(() => {
    if (tone === 'primary') {
      return {
        rest: t.colors.interactivePrimary,
        pressed: t.colors.interactivePrimaryPressed,
      };
    }
    return {
      rest: t.colors.interactiveSecondary,
      pressed: t.colors.interactiveSecondaryPressed,
    };
  }, [t.colors.interactivePrimary, t.colors.interactivePrimaryPressed, t.colors.interactiveSecondary, t.colors.interactiveSecondaryPressed, tone]);

  const baseShadow = useMemo(() => {
    if (disabled || pressed) return t.shadows.none as unknown as ViewStyle;
    return t.shadows.sm as unknown as ViewStyle;
  }, [disabled, pressed, t.shadows]);

  const focusOutline: ViewStyle | undefined = useMemo(() => {
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
    Animated.timing(press, {
      toValue: 1,
      duration: t.motion.duration.press,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };
  const handleOut = (e: GestureResponderEvent) => {
    setPressed(false);
    Animated.timing(press, {
      toValue: 0,
      duration: t.motion.duration.press,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  const animated = {
    transform: [
      { scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, t.motion.pressed.scale] }) },
    ],
    opacity: press.interpolate({ inputRange: [0, 1], outputRange: [1, t.motion.pressed.opacity] }),
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
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      hitSlop={size === 'sm' ? { top: 6, bottom: 6, left: 6, right: 6 } : undefined}
      {...rest}
    >
      <Animated.View
        style={[
          {
            width: d,
            height: d,
            borderRadius: d / 2,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.28 : 1,
          },
          baseShadow,
          focusOutline,
          animated,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
});
