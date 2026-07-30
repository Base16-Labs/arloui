import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  PanResponder,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

export type ToastPosition = 'top' | 'bottom';
export type ToastColorStyle = 'contrast' | 'same';

export type ToastProps = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  position?: ToastPosition;
  colorStyle?: ToastColorStyle;
  icon?: ReactNode;
  showDismiss?: boolean;
  /** Auto-dismiss in ms. 0 = persist until dismissed. Default 3500. */
  duration?: number;
  /** Safe-area top inset from the host app. */
  topInset?: number;
  /** Safe-area bottom inset from the host app. */
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export type ToastRef = {
  dismiss: () => void;
};

const ENTRANCE_OFFSET = 60;

/** How far each toast behind the front one peeks out, and how much it shrinks. */
export const STACK_PEEK = 14;
export const STACK_SCALE_STEP = 0.05;

/** Props `Toaster` passes to position a toast within the deck. */
type StackProps = {
  /** 0 = front. Deeper toasts sit behind, offset and scaled down. */
  depth?: number;
  /** Hidden toasts stay mounted but invisible until they reach the visible window. */
  hidden?: boolean;
  /** Only the front toast takes swipe gestures. */
  interactive?: boolean;
  /** Flips to true when something outside the toast closes it. */
  dismissing?: boolean;
};

type ToastItemProps = Omit<ToastProps, 'visible' | 'onDismiss' | 'topInset' | 'bottomInset'> &
  StackProps & {
    /** Runs once the exit animation finishes. `selfInitiated` is false when
     * `dismissing` drove the exit rather than a timer, swipe, or close button. */
    onClosed: (selfInitiated: boolean) => void;
  };

export type ToastItemRef = ToastRef;

/**
 * A single toast: entrance, auto-dismiss, swipe, and deck placement.
 *
 * Shared by the controlled `Toast` and by `Toaster` so the two can never drift
 * apart visually.
 */
export const ToastItem = forwardRef<ToastItemRef, ToastItemProps>(function ToastItem(
  {
    message,
    onClosed,
    position = 'bottom',
    colorStyle = 'contrast',
    icon,
    showDismiss = false,
    duration = 3500,
    style,
    accessibilityLabel,
    depth = 0,
    hidden = false,
    interactive = true,
    dismissing = false,
  },
  ref,
) {
  const t = useTokens();
  const dark = t.name === 'dark';

  const [reduceMotion, setReduceMotion] = useState(false);

  const [translateY] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(0));
  // Deck placement lives on its own values so the gesture and entrance
  // animations above can keep owning `translateY` / `opacity` untouched.
  const [stackY] = useState(() => new Animated.Value(0));
  const [stackScale] = useState(() => new Animated.Value(1));
  const [stackOpacity] = useState(() => new Animated.Value(1));
  const closing = useRef(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => active && setReduceMotion(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  const startY = position === 'top' ? -ENTRANCE_OFFSET : ENTRANCE_OFFSET;
  const [ex1, ey1, ex2, ey2] = t.motion.easing.easeOut;
  const exitEasing = useMemo(() => Easing.bezier(ex1, ey1, ex2, ey2), [ex1, ey1, ex2, ey2]);

  const animateIn = useCallback(() => {
    closing.current = false;
    translateY.setValue(startY);
    opacity.setValue(0);

    if (reduceMotion) {
      translateY.setValue(0);
      opacity.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        ...t.motion.spring.snappy,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: t.motion.duration.instant,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity, startY, reduceMotion, t.motion]);

  const animateOut = useCallback(
    (selfInitiated = true) => {
      if (closing.current) return;
      closing.current = true;

      if (autoTimer.current) {
        clearTimeout(autoTimer.current);
        autoTimer.current = null;
      }

      if (reduceMotion) {
        translateY.setValue(startY);
        opacity.setValue(0);
        closing.current = false;
        onClosed(selfInitiated);
        return;
      }

      const dur = t.motion.duration.fast;
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: startY,
          duration: dur,
          easing: exitEasing,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: dur,
          easing: exitEasing,
          useNativeDriver: true,
        }),
      ]).start();

      dismissTimer.current = setTimeout(() => {
        closing.current = false;
        onClosed(selfInitiated);
      }, dur);
    },
    [translateY, opacity, startY, reduceMotion, exitEasing, t.motion.duration.fast, onClosed],
  );

  useImperativeHandle(ref, () => ({ dismiss: () => animateOut() }), [animateOut]);

  useEffect(() => {
    animateIn();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Something outside the toast closed it (`visible` went false, or dismiss(id)).
  useEffect(() => {
    if (dismissing) animateOut(false);
  }, [dismissing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Slide into the deck. Toasts buried past the visible window fade out but stay
  // mounted, so they animate forward as the ones in front of them clear.
  useEffect(() => {
    const targetY = (position === 'top' ? 1 : -1) * STACK_PEEK * depth;
    const targetScale = Math.max(0, 1 - STACK_SCALE_STEP * depth);
    const targetOpacity = hidden ? 0 : 1;

    if (reduceMotion) {
      stackY.setValue(targetY);
      stackScale.setValue(targetScale);
      stackOpacity.setValue(targetOpacity);
      return;
    }

    Animated.parallel([
      Animated.spring(stackY, { toValue: targetY, ...t.motion.spring.gentle, useNativeDriver: true }),
      Animated.spring(stackScale, {
        toValue: targetScale,
        ...t.motion.spring.gentle,
        useNativeDriver: true,
      }),
      Animated.timing(stackOpacity, {
        toValue: targetOpacity,
        duration: t.motion.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  }, [depth, hidden, position, reduceMotion, stackY, stackScale, stackOpacity, t.motion]);

  // Buried toasts hold their timer until they surface, so a burst of six is not
  // half expired by the time it is read.
  useEffect(() => {
    if (hidden || duration <= 0) return;
    autoTimer.current = setTimeout(() => animateOut(), duration);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [hidden, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    },
    [],
  );

  const panResponder = useMemo(
    () =>
      // Refs here are read inside gesture handlers, which run on touch rather than
      // during render. See eslint-config/index.js.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => {
          if (!interactive) return false;
          if (position === 'top') return g.dy < -6 && Math.abs(g.dy) > Math.abs(g.dx);
          return g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx);
        },
        onPanResponderMove: (_, g) => {
          const clamped = position === 'top' ? Math.min(0, g.dy) : Math.max(0, g.dy);
          translateY.setValue(clamped);
          const progress = Math.abs(clamped) / ENTRANCE_OFFSET;
          opacity.setValue(Math.max(0, 1 - progress));
        },
        onPanResponderRelease: (_, g) => {
          const threshold = 30;
          const shouldDismiss =
            position === 'top'
              ? g.dy < -threshold || g.vy < -0.5
              : g.dy > threshold || g.vy > 0.5;
          if (shouldDismiss) {
            animateOut();
          } else {
            Animated.parallel([
              Animated.spring(translateY, {
                toValue: 0,
                ...t.motion.spring.snappy,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 1,
                duration: t.motion.duration.instant,
                useNativeDriver: true,
              }),
            ]).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateY, {
            toValue: 0,
            ...t.motion.spring.snappy,
            useNativeDriver: true,
          }).start();
        },
      }),
    [position, translateY, opacity, t.motion, animateOut, interactive],
  );

  const isContrast = colorStyle === 'contrast';
  const bg = isContrast ? t.colors.textPrimary : t.colors.surfaceElevated;
  const fg = isContrast ? t.colors.surfaceBackground : t.colors.textPrimary;
  const shadow = dark ? t.shadows.md : t.shadows.lg;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      pointerEvents={interactive ? 'auto' : 'none'}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      accessibilityLabel={accessibilityLabel ?? message}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: bg,
          borderRadius: t.radii.xl,
          paddingHorizontal: t.spacing[4],
          paddingVertical: t.spacing[3],
          gap: t.spacing[3],
          maxWidth: 480,
          width: '100%',
          ...shadow,
          opacity: Animated.multiply(opacity, stackOpacity),
          transform: [{ translateY }, { translateY: stackY }, { scale: stackScale }],
        },
        style,
      ]}
    >
      {icon ? <View style={{ flexShrink: 0 }}>{icon}</View> : null}

      <Text
        numberOfLines={2}
        style={{
          flex: 1,
          color: fg,
          fontFamily: t.fontFamilies.sans,
          fontSize: t.typography.body.fontSize,
          lineHeight: t.typography.body.lineHeight,
          fontWeight: '500',
        }}
      >
        {message}
      </Text>

      {showDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={8}
          onPress={() => animateOut()}
          style={({ pressed }) => ({
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: t.radii.full,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke={fg}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      ) : null}
    </Animated.View>
  );
});

/** Distance from the screen edge to the toast, clearing the safe area. */
export function toastEdgeOffset(
  position: ToastPosition,
  topInset: number,
  bottomInset: number,
  edgeUnit: number,
) {
  return Math.max(position === 'top' ? topInset : bottomInset, edgeUnit) + edgeUnit;
}

/** Absolute host that pins toasts to the top or bottom edge, clear of the safe area. */
export function ToastContainer({
  position,
  topInset = 0,
  bottomInset = 0,
  spacingUnit,
  children,
  style,
}: {
  position: ToastPosition;
  topInset?: number;
  bottomInset?: number;
  spacingUnit: { edge: number; horizontal: number };
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const safeOffset = toastEdgeOffset(position, topInset, bottomInset, spacingUnit.edge);

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          ...(position === 'top' ? { top: 0 } : { bottom: 0 }),
          alignItems: 'center',
          paddingHorizontal: spacingUnit.horizontal,
          ...(position === 'top' ? { paddingTop: safeOffset } : { paddingBottom: safeOffset }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Controlled single toast. Drive it with `visible`; for several at once that
 * stack into a deck, mount a `Toaster` and call `useToast().toast(...)`.
 */
export const Toast = forwardRef<ToastRef, ToastProps>(function Toast(
  {
    visible,
    message,
    onDismiss,
    position = 'bottom',
    colorStyle = 'contrast',
    icon,
    showDismiss = false,
    duration = 3500,
    topInset = 0,
    bottomInset = 0,
    style,
    accessibilityLabel,
  },
  ref,
) {
  const t = useTokens();
  const [mounted, setMounted] = useState(visible);
  const itemRef = useRef<ToastItemRef | null>(null);

  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  useImperativeHandle(ref, () => ({ dismiss: () => itemRef.current?.dismiss() }), []);

  const handleClosed = useCallback(
    (selfInitiated: boolean) => {
      setMounted(false);
      if (selfInitiated) onDismiss();
    },
    [onDismiss],
  );

  if (!mounted) return null;

  return (
    <ToastContainer
      position={position}
      topInset={topInset}
      bottomInset={bottomInset}
      spacingUnit={{ edge: t.spacing[2], horizontal: t.spacing[4] }}
    >
      <ToastItem
        ref={itemRef}
        message={message}
        position={position}
        colorStyle={colorStyle}
        icon={icon}
        showDismiss={showDismiss}
        duration={duration}
        style={style}
        accessibilityLabel={accessibilityLabel}
        dismissing={!visible}
        onClosed={handleClosed}
      />
    </ToastContainer>
  );
});
