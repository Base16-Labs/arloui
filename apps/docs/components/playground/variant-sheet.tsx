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

const DRAWER_EASING = Easing.bezier(0.32, 0.72, 0, 1);

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
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.max(420, Math.round(windowHeight * 0.57));
  const bottomBleed = Math.max(insets.bottom, 24) + 32;
  const closedY = sheetHeight + bottomBleed;
  const translateY = useRef(new Animated.Value(closedY)).current;
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
          height: sheetHeight + bottomBleed,
          marginBottom: -bottomBleed,
          paddingTop: 10,
          paddingBottom: bottomBleed + Math.max(insets.bottom, 14),
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
          borderTopWidth: 1,
          borderColor: '#3F3F46',
          backgroundColor: '#27272A',
          transform: [{ translateY }],
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
              backgroundColor: '#71717A',
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 3,
            marginHorizontal: 24,
            color: '#A1A1AA',
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
            indicatorStyle="white"
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
                height: 20,
                borderTopWidth: 1,
                borderTopColor: 'rgba(250,250,250,0.08)',
                backgroundColor: 'rgba(39,39,42,0.92)',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 16,
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: '#3F3F46',
                  backgroundColor: '#303033',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="chevron-up" size={14} color="#D4D4D8" />
              </View>
            </View>
          ) : null}

          {canScrollDown ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                right: 16,
                bottom: 8,
                width: 26,
                height: 26,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                borderWidth: 1,
                borderColor: '#3F3F46',
                backgroundColor: '#303033',
              }}
            >
              <Ionicons name="chevron-down" size={14} color="#D4D4D8" />
            </View>
          ) : null}
        </View>

        <View
          style={{
            marginHorizontal: 24,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#3F3F46',
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <NeighborButton direction="previous" label={previous} onPress={onPrevious} />
          <NeighborButton direction="next" label={next} onPress={onNext} />
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

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 66,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: next ? 'flex-end' : 'flex-start',
        gap: 10,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: pressed ? '#71717A' : '#3F3F46',
        backgroundColor: pressed ? '#3F3F46' : '#303033',
      })}
    >
      {!next ? <Ionicons name="chevron-back" size={15} color="#A1A1AA" /> : null}
      <View style={{ alignItems: next ? 'flex-end' : 'flex-start' }}>
        <Text
          style={{
            color: '#A1A1AA',
            fontFamily: 'Manrope SemiBold',
            fontSize: 9,
            letterSpacing: 1.2,
          }}
        >
          {direction.toUpperCase()}
        </Text>
        <Text
          style={{
            marginTop: 2,
            color: '#FAFAFA',
            fontFamily: 'Manrope Medium',
            fontSize: 15,
          }}
        >
          {label}
        </Text>
      </View>
      {next ? <Ionicons name="chevron-forward" size={15} color="#A1A1AA" /> : null}
    </Pressable>
  );
}
