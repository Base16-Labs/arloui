import { useCallback, useRef } from 'react';
import { Animated, type GestureResponderEvent } from 'react-native';

type Options = {
  scale?: number;
  opacity?: number;
  duration?: number;
};

/**
 * Lightweight press feedback driven by `Animated.View` — no native driver gotchas,
 * no extra deps. Returns the animated style and onPressIn/onPressOut handlers
 * to spread onto a `Pressable`.
 *
 *   const press = usePressableScale();
 *   <Pressable onPressIn={press.onPressIn} onPressOut={press.onPressOut}>
 *     <Animated.View style={[styles.btn, press.style]}>...</Animated.View>
 *   </Pressable>
 */
export function usePressableScale({
  scale = 0.98,
  opacity = 0.92,
  duration = 140,
}: Options = {}) {
  const value = useRef(new Animated.Value(0)).current;

  const onPressIn = useCallback(
    (_e?: GestureResponderEvent) => {
      Animated.timing(value, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [value, duration],
  );

  const onPressOut = useCallback(
    (_e?: GestureResponderEvent) => {
      Animated.timing(value, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [value, duration],
  );

  const style = {
    transform: [
      {
        scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, scale] }),
      },
    ],
    opacity: value.interpolate({ inputRange: [0, 1], outputRange: [1, opacity] }),
  };

  return { style, onPressIn, onPressOut };
}
