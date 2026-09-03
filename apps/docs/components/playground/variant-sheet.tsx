import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTokens } from '@arloui/registry';

export function VariantSheet({
  visible,
  children,
  previous,
  next,
  onClose,
  onPrevious,
  onNext,
}: {
  visible: boolean;
  children: ReactNode;
  previous: string;
  next: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const t = useTokens();
  const dark = t.name === 'dark';
  const drawerEasing = Easing.bezier(...t.motion.easing.easeSheet);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.max(420, Math.round(windowHeight * 0.57));
  const bottomBleed = Math.max(insets.bottom, t.spacing[6]) + t.spacing[8];
  const closedY = sheetHeight + bottomBleed;
  const [translateY] = useState(() => new Animated.Value(closedY));
  const dragStart = useRef(0);
  const closing = useRef(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(visible);
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollViewportHeight, setScrollViewportHeight] = useState(0);

  const open = () => {
    closing.current = false;
    translateY.setValue(closedY);
    Animated.timing(translateY, {
      toValue: 0,
      duration: t.motion.duration.slow,
      easing: drawerEasing,
      useNativeDriver: true,
    }).start();
  };

  const settle = () => {
    Animated.spring(translateY, {
      toValue: 0,
      ...t.motion.spring.gentle,
      useNativeDriver: true,
    }).start();
  };

  const dismiss = () => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(translateY, {
      toValue: closedY,
      duration: t.motion.duration.slow,
      easing: drawerEasing,
      useNativeDriver: true,
    }).start();
    dismissTimer.current = setTimeout(() => {
      setMounted(false);
      onClose();
      closing.current = false;
    }, t.motion.duration.slow);
  };

  useEffect(() => {
    if (visible) {
      setMounted(true);
      open();
      return;
    }

    if (!mounted) return;
    if (closing.current) return;
    Animated.timing(translateY, {
      toValue: closedY,
      duration: t.motion.duration.slow,
      easing: drawerEasing,
      useNativeDriver: true,
    }).start();
    const cleanup = setTimeout(() => setMounted(false), t.motion.duration.slow + 10);
    return () => clearTimeout(cleanup);
    // Animation helpers intentionally track the current measured drawer height.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closedY, visible]);

  useEffect(
    () => () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    },
    [],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderGrant: () => {
          translateY.stopAnimation((value) => {
            dragStart.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          const next = dragStart.current + gesture.dy;
          translateY.setValue(next < 0 ? next * 0.18 : next);
        },
        onPanResponderRelease: (_, gesture) => {
          const shouldDismiss = gesture.dy > sheetHeight * 0.2 || gesture.vy > 0.75;
          if (shouldDismiss) dismiss();
          else settle();
        },
        onPanResponderTerminate: settle,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closedY, sheetHeight, translateY],
  );

  if (!mounted) return null;

  const canScroll = scrollHeight > scrollViewportHeight + 8;
  const canScrollDown = canScroll && scrollY < scrollHeight - scrollViewportHeight - 12;
  const canScrollUp = canScroll && scrollY > 8;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setScrollY(event.nativeEvent.contentOffset.y);
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 20,
        justifyContent: 'flex-end',
      }}
    >
      <Animated.View
        style={{
          marginBottom: -bottomBleed,
          borderTopLeftRadius: t.radii['2xl'],
          borderTopRightRadius: t.radii['2xl'],
          backgroundColor: t.colors.surfaceElevated,
          transform: [{ translateY }],
          ...t.shadows.xl,
        }}
      >
        <View
          style={{
            height: sheetHeight + bottomBleed,
            paddingTop: t.spacing[2],
            paddingBottom: bottomBleed + Math.max(insets.bottom, t.spacing[4]),
            borderTopLeftRadius: t.radii['2xl'],
            borderTopRightRadius: t.radii['2xl'],
            /*
             * Uniform, not `borderTopWidth` alone.
             *
             * A one-sided border under a corner radius makes React Native mitre
             * the 1px top into the 0px sides along the arc, and the taper reads
             * as a squared-off corner — the sheet stops looking rounded. A
             * border on every side lets the radius stroke evenly. The bottom
             * edge sits below the screen (the surface is `bottomBleed` taller
             * than the sheet and the parent pulls it down by the same amount),
             * and the sides land on the screen edges.
             */
            borderWidth: 1,
            /*
             * Neither border token works in both themes on an elevated surface.
             * `borderStrong` is a mid grey against white — it reads as a line
             * drawn across the sheet rather than an edge. But `border` in dark
             * is the *same colour* as `surfaceElevated`, so it draws nothing at
             * all. Picking per theme gives about the same contrast either way.
             */
            borderColor: dark ? t.colors.borderStrong : t.colors.border,
            backgroundColor: t.colors.surfaceElevated,
            overflow: 'hidden',
          }}
        >
        <View
          {...panResponder.panHandlers}
          style={{
            height: 35,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 2,
          }}
        >
          <View
            style={{
              width: t.spacing[14],
              height: t.spacing[1],
              borderRadius: t.radii.full,
              backgroundColor: t.colors.pullIndicator,
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 3,
            marginHorizontal: t.spacing[6],
            color: t.colors.textSecondary,
            fontFamily: t.fontFamilies.sans,
            ...t.typography.overline,
          }}
        >
          VARIANTS
        </Text>

        <View style={{ flex: 1, position: 'relative' }}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator
            persistentScrollbar
            indicatorStyle={dark ? 'white' : 'black'}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onLayout={(event) => setScrollViewportHeight(event.nativeEvent.layout.height)}
            onContentSizeChange={(_, height) => setScrollHeight(height)}
            contentContainerStyle={{
              paddingHorizontal: t.spacing[6],
              paddingTop: t.spacing[4],
              paddingBottom: t.spacing[10],
            }}
          >
            {children}
          </ScrollView>

          {canScrollUp ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="chevron-up" size={t.sizing.icon.xs} color={t.colors.textTertiary} />
            </View>
          ) : null}

          {canScrollDown ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                right: 0,
                left: 0,
                bottom: 0,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="chevron-down" size={t.sizing.icon.xs} color={t.colors.textTertiary} />
            </View>
          ) : null}
        </View>

        <View
          style={{
            marginHorizontal: t.spacing[6],
            paddingTop: t.spacing[4],
            borderTopWidth: 1,
            borderTopColor: t.colors.borderStrong,
            flexDirection: 'row',
            gap: t.spacing[3],
          }}
        >
          <NeighborButton direction="previous" label={previous} onPress={onPrevious} />
          <NeighborButton direction="next" label={next} onPress={onNext} />
        </View>
        </View>
      </Animated.View>
    </View>
  );
}

function NeighborButton({
  direction,
  label,
  onPress,
}: {
  direction: 'previous' | 'next';
  label: string;
  onPress: () => void;
}) {
  const next = direction === 'next';
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: t.sizing.touchTarget.minimum,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: next ? 'flex-end' : 'flex-start',
        gap: t.spacing[2],
        paddingHorizontal: t.spacing[4],
        borderRadius: t.radii.lg,
        borderWidth: 1,
        borderColor: pressed ? t.colors.borderStrong : t.colors.border,
        backgroundColor: pressed ? t.colors.surfaceStrong : t.colors.surface,
      })}
    >
      {!next ? <Ionicons name="chevron-back" size={16} color={t.colors.textSecondary} /> : null}
      <Text
        numberOfLines={1}
        style={{
          color: t.colors.textPrimary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.bodyMedium,
          fontWeight: t.fontWeights.medium,
        }}
      >
        {label}
      </Text>
      {next ? <Ionicons name="chevron-forward" size={16} color={t.colors.textSecondary} /> : null}
    </Pressable>
  );
}
