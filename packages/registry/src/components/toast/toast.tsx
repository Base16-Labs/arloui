import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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
  const dark = t.name === 'dark';

  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
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
    (notify = true) => {
      if (closing.current) return;
      closing.current = true;

      if (autoTimer.current) {
        clearTimeout(autoTimer.current);
        autoTimer.current = null;
      }

      if (reduceMotion) {
        translateY.setValue(startY);
        opacity.setValue(0);
        setMounted(false);
        closing.current = false;
        if (notify) onDismiss();
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
        setMounted(false);
        closing.current = false;
        if (notify) onDismiss();
      }, dur);
    },
    [translateY, opacity, startY, reduceMotion, exitEasing, t.motion.duration.fast, onDismiss],
  );

  useImperativeHandle(ref, () => ({ dismiss: () => animateOut() }), [animateOut]);

  useEffect(() => {
    if (visible) {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      setMounted(true);
      return;
    }
    if (mounted && !closing.current) animateOut(false);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mounted && visible) animateIn();
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted || !visible || duration <= 0) return;
    autoTimer.current = setTimeout(() => animateOut(), duration);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [mounted, visible, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    },
    [],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => {
          if (position === 'top') return g.dy < -6 && Math.abs(g.dy) > Math.abs(g.dx);
          return g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx);
        },
        onPanResponderMove: (_, g) => {
          const clamped =
            position === 'top' ? Math.min(0, g.dy) : Math.max(0, g.dy);
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
    [position, translateY, opacity, t.motion, animateOut],
  );

  if (!mounted) return null;

  const isContrast = colorStyle === 'contrast';
  const bg = isContrast
    ? dark
      ? t.colors.textPrimary
      : t.colors.textPrimary
    : t.colors.surfaceElevated;
  const fg = isContrast
    ? dark
      ? t.colors.surfaceBackground
      : t.colors.surfaceBackground
    : t.colors.textPrimary;

  const shadow = dark ? t.shadows.md : t.shadows.lg;
  const edgeInset = position === 'top' ? topInset : bottomInset;
  const safeOffset = Math.max(edgeInset, t.spacing[2]) + t.spacing[2];

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        ...(position === 'top' ? { top: 0 } : { bottom: 0 }),
        alignItems: 'center',
        paddingHorizontal: t.spacing[4],
        ...(position === 'top'
          ? { paddingTop: safeOffset }
          : { paddingBottom: safeOffset }),
      }}
    >
      <Animated.View
        {...panResponder.panHandlers}
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
            opacity,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        {icon ? (
          <View style={{ flexShrink: 0 }}>{icon}</View>
        ) : null}

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
    </View>
  );
});
