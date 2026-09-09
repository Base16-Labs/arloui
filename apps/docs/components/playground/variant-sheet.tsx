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

const DRAWER_EASING = Easing.bezier(0.32, 0.72, 0, 1);

export const variantSheetHeight = (windowHeight: number) => Math.max(420, Math.round(windowHeight * 0.57));

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
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = variantSheetHeight(windowHeight);
  const bottomBleed = Math.max(insets.bottom, 24) + 32;
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
      duration: 500,
      easing: DRAWER_EASING,
      useNativeDriver: true,
    }).start();
  };

  const settle = () => {
    Animated.spring(translateY, {
      toValue: 0,
      damping: 28,
      stiffness: 260,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const dismiss = () => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(translateY, {
      toValue: closedY,
      duration: 420,
      easing: DRAWER_EASING,
      useNativeDriver: true,
    }).start();
    dismissTimer.current = setTimeout(() => {
      setMounted(false);
      onClose();
      closing.current = false;
    }, 420);
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
      duration: 420,
      easing: DRAWER_EASING,
      useNativeDriver: true,
    }).start();
    const cleanup = setTimeout(() => setMounted(false), 430);
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
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
          backgroundColor: dark ? '#27272A' : '#FFFFFF',
          transform: [{ translateY }],
          shadowColor: '#000000',
          shadowOpacity: dark ? 0.4 : 0.16,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: -8 },
          elevation: 24,
        }}
      >
        <View
          style={{
            height: sheetHeight + bottomBleed,
            paddingTop: 10,
            paddingBottom: bottomBleed + Math.max(insets.bottom, 14),
            borderTopLeftRadius: 34,
            borderTopRightRadius: 34,
            borderTopWidth: 1,
            borderColor: dark ? '#3F3F46' : '#E4E4E7',
            backgroundColor: dark ? '#27272A' : '#FFFFFF',
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
              width: 54,
              height: 5,
              borderRadius: 999,
              backgroundColor: dark ? '#71717A' : '#D4D4D8',
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 3,
            marginHorizontal: 24,
            color: t.colors.textSecondary,
            fontFamily: 'Manrope SemiBold',
            fontSize: 11,
            letterSpacing: 1.6,
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
              paddingHorizontal: 24,
              paddingTop: 17,
              paddingBottom: 42,
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
              <Ionicons name="chevron-up" size={15} color={dark ? '#71717A' : '#A1A1AA'} />
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
              <Ionicons name="chevron-down" size={15} color={dark ? '#71717A' : '#A1A1AA'} />
            </View>
          ) : null}
        </View>

        <View
          style={{
            marginHorizontal: 24,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: dark ? '#3F3F46' : '#E4E4E7',
            flexDirection: 'row',
            gap: 10,
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
  const dark = t.name === 'dark';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 46,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: next ? 'flex-end' : 'flex-start',
        gap: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: pressed ? (dark ? '#71717A' : '#D4D4D8') : dark ? '#3F3F46' : '#E4E4E7',
        backgroundColor: pressed ? (dark ? '#3F3F46' : '#E4E4E7') : dark ? '#303033' : '#F4F4F5',
      })}
    >
      {!next ? <Ionicons name="chevron-back" size={16} color={t.colors.textSecondary} /> : null}
      <Text
        numberOfLines={1}
        style={{
          color: t.colors.textPrimary,
          fontFamily: 'Manrope Medium',
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      {next ? <Ionicons name="chevron-forward" size={16} color={t.colors.textSecondary} /> : null}
    </Pressable>
  );
}
