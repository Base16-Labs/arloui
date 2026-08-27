/**
 * Arlo UI — shared button-family interaction primitives.
 *
 * The whole button family (Button, GhostButton, FAB, SocialAuthButton) shares the
 * same press feel: a spring-eased scale-down on press (opacity fade when "reduce
 * motion" is on) plus an optional haptic tap. Keeping it here means the timing,
 * easing, and accessibility behaviour live in exactly one place.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  type GestureResponderEvent,
} from 'react-native';
import { haptic as triggerHaptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';

export type ButtonHaptic = 'light' | 'medium' | 'none';

/**
 * Tracks the OS "reduce motion" accessibility setting.
 *
 * @deprecated Prefer `useReduceMotion` from `foundation/reduce-motion`. Kept as
 * an alias because the button family and `animated-icon` import it under this
 * name, and anyone who copied those files imports it from here.
 */
export { useReduceMotion as useReducedMotion } from '../../foundation/reduce-motion';

// Imported as well as re-exported: `usePressFeedback` reads it directly.
import { useReduceMotion } from '../../foundation/reduce-motion';

type PressFeedbackOptions = {
  haptic?: ButtonHaptic;
  onPressIn?: ((e: GestureResponderEvent) => void) | null;
  onPressOut?: ((e: GestureResponderEvent) => void) | null;
};

/**
 * Press-driven animation + haptic for the button family.
 *
 * Returns `pressed` (for press overlays), the `animatedStyle` to spread onto the
 * animated container, `reduceMotion`, and the `onPressIn`/`onPressOut` handlers to
 * pass straight to the `Pressable`.
 */
export function usePressFeedback({ haptic = 'light', onPressIn, onPressOut }: PressFeedbackOptions) {
  const { motion } = useTokens();
  const [press] = useState(() => new Animated.Value(0));
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReduceMotion();

  // Curve and duration come straight from the motion tokens (easeOut · instant).
  const easing = useMemo(() => {
    const [x1, y1, x2, y2] = motion.easing.easeOut;
    return Easing.bezier(x1, y1, x2, y2);
  }, [motion.easing.easeOut]);
  const duration = motion.duration.instant;

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      setPressed(true);
      if (haptic !== 'none') void triggerHaptic(haptic);
      Animated.timing(press, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver: true,
      }).start();
      onPressIn?.(e);
    },
    // `setPressed` is a stable setter and needs no listing — except that esbuild
    // renames the `useState` import when bundling for Snack, which defeats the
    // exhaustive-deps stability check and warns in their editor. Listing it is a
    // runtime no-op.
    [haptic, onPressIn, press, duration, easing, setPressed],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      setPressed(false);
      Animated.timing(press, {
        toValue: 0,
        duration,
        easing,
        useNativeDriver: true,
      }).start();
      onPressOut?.(e);
    },
    [onPressOut, press, duration, easing, setPressed],
  );

  const animatedStyle = reduceMotion
    ? { opacity: press.interpolate({ inputRange: [0, 1], outputRange: [1, motion.pressed.opacity] }) }
    : { transform: [{ scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, motion.pressed.scale] }) }] };

  return {
    pressed,
    reduceMotion,
    animatedStyle,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  };
}
