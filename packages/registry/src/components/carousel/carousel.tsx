import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, Children, isValidElement, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  I18nManager,
  PanResponder,
  Pressable,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

export type CarouselSnap = 'item' | 'page';
export type CarouselIndicator = 'dots' | 'none';
export type CarouselIndicatorPosition = 'below' | 'overlay';

export type CarouselProps = {
  children: ReactNode;
  snap?: CarouselSnap;
  peek?: boolean;
  indicator?: CarouselIndicator;
  indicatorPosition?: CarouselIndicatorPosition;
  arrows?: boolean;
  loop?: boolean;
  gap?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export type CarouselRef = {
  scrollTo: (index: number, animated?: boolean) => void;
  next: () => void;
  previous: () => void;
};

export const Carousel = forwardRef<CarouselRef, CarouselProps>(function Carousel(
  {
    children,
    snap = 'item',
    peek = false,
    indicator = 'dots',
    indicatorPosition = 'below',
    arrows = false,
    loop = false,
    gap,
    autoPlay = false,
    autoPlayInterval = 4000,
    initialIndex = 0,
    onIndexChange,
    style,
    contentContainerStyle,
    accessibilityLabel = 'Carousel',
  },
  ref,
) {
  const t = useTokens();
  const { width: windowWidth } = useWindowDimensions();
  const resolvedGap = gap ?? t.spacing[3];

  const items = Children.toArray(children).filter(isValidElement);
  const count = items.length;

  const [containerWidth, setContainerWidth] = useState(windowWidth);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const [translateX] = useState(() => new Animated.Value(0));
  const gestureActive = useRef(false);
  const indexRef = useRef(initialIndex);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const peekAmount = peek ? t.spacing[8] : 0;
  const itemWidth =
    snap === 'page'
      ? containerWidth
      : peek
        ? containerWidth - peekAmount * 2
        : containerWidth - t.spacing[4] * 2;
  const totalWidth = count * itemWidth + (count - 1) * resolvedGap;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => active && setReduceMotion(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  const inset =
    snap === 'page' ? 0 : peek ? peekAmount : t.spacing[4];

  const offsetForIndex = (index: number) => {
    const rtlSign = I18nManager.isRTL ? 1 : -1;
    return rtlSign * (index * (itemWidth + resolvedGap) - inset);
  };

  const animateTo = (index: number, animated = true) => {
    const clamped = loop ? ((index % count) + count) % count : Math.max(0, Math.min(index, count - 1));
    indexRef.current = clamped;
    setCurrentIndex(clamped);
    onIndexChange?.(clamped);

    if (!animated || reduceMotion) {
      translateX.setValue(offsetForIndex(clamped));
      return;
    }

    Animated.spring(translateX, {
      toValue: offsetForIndex(clamped),
      ...t.motion.spring.gentle,
      useNativeDriver: true,
    }).start();
  };

  useImperativeHandle(ref, () => ({
    scrollTo: (index: number, animated = true) => animateTo(index, animated),
    next: () => animateTo(indexRef.current + 1),
    previous: () => animateTo(indexRef.current - 1),
  }));

  useEffect(() => {
    animateTo(indexRef.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth, snap, peek, resolvedGap]);

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    autoPlayTimer.current = setInterval(() => {
      if (!gestureActive.current) {
        animateTo(indexRef.current + 1);
      }
    }, autoPlayInterval);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayInterval, count]);

  const panResponder = useMemo(
    () =>
      // Refs here are read inside gesture handlers, which run on touch rather than
      // during render. See eslint-config/index.js.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderGrant: () => {
          gestureActive.current = true;
          translateX.stopAnimation();
        },
        onPanResponderMove: (_, g) => {
          const base = offsetForIndex(indexRef.current);
          let dx = g.dx;

          if (!loop) {
            const atStart = indexRef.current === 0 && dx > 0;
            const atEnd = indexRef.current === count - 1 && dx < 0;
            if (atStart || atEnd) dx *= 0.25;
          }

          translateX.setValue(base + (I18nManager.isRTL ? -dx : dx));
        },
        onPanResponderRelease: (_, g) => {
          gestureActive.current = false;
          const threshold = itemWidth * 0.2;
          const velocityThreshold = 0.4;

          let nextIndex = indexRef.current;
          if (Math.abs(g.dx) > threshold || Math.abs(g.vx) > velocityThreshold) {
            const direction = I18nManager.isRTL ? (g.dx > 0 ? 1 : -1) : g.dx > 0 ? -1 : 1;
            nextIndex += direction;
          }

          animateTo(nextIndex);
        },
        onPanResponderTerminate: () => {
          gestureActive.current = false;
          animateTo(indexRef.current);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemWidth, resolvedGap, count, loop, inset],
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) setContainerWidth(w);
  };

  const showArrows = arrows && count > 1;
  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < count - 1;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        text: `Item ${currentIndex + 1} of ${count}`,
      }}
      onLayout={handleLayout}
      style={[{ overflow: 'hidden' }, style]}
    >
      <View style={indicatorPosition === 'overlay' ? { position: 'relative' } : undefined}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            {
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              width: totalWidth,
              gap: resolvedGap,
              transform: [{ translateX }],
            },
            contentContainerStyle,
          ]}
        >
          {items.map((child, i) => (
            <View key={i} style={{ width: itemWidth }}>
              {child}
            </View>
          ))}
        </Animated.View>

        {indicator === 'dots' && count > 1 && indicatorPosition === 'overlay' ? (
          <View style={{ position: 'absolute', bottom: t.spacing[3], left: 0, right: 0 }}>
            <CarouselDots count={count} current={currentIndex} onPress={animateTo} overlay />
          </View>
        ) : null}
      </View>

      {indicator === 'dots' && count > 1 && indicatorPosition === 'below' && !showArrows ? (
        <CarouselDots count={count} current={currentIndex} onPress={animateTo} />
      ) : null}

      {showArrows ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: indicator === 'dots' && indicatorPosition === 'below' ? 'space-between' : 'flex-end',
            paddingTop: t.spacing[3],
            paddingBottom: t.spacing[1],
            paddingHorizontal: inset,
          }}
        >
          {indicator === 'dots' && count > 1 && indicatorPosition === 'below' ? (
            <CarouselDots count={count} current={currentIndex} onPress={animateTo} />
          ) : <View />}
          <View style={{ flexDirection: 'row', gap: t.spacing[2] }}>
            <CarouselArrow direction="left" onPress={() => animateTo(indexRef.current - 1)} disabled={!canGoPrev} />
            <CarouselArrow direction="right" onPress={() => animateTo(indexRef.current + 1)} disabled={!canGoNext} />
          </View>
        </View>
      ) : null}
    </View>
  );
});

function CarouselDots({
  count,
  current,
  onPress,
  overlay = false,
}: {
  count: number;
  current: number;
  onPress: (index: number) => void;
  overlay?: boolean;
}) {
  const t = useTokens();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingTop: overlay ? 0 : t.spacing[3],
        paddingBottom: overlay ? 0 : t.spacing[1],
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Pressable
          key={i}
          accessibilityRole="button"
          accessibilityLabel={`Go to item ${i + 1}`}
          hitSlop={8}
          onPress={() => onPress(i)}
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            borderRadius: t.radii.full,
            backgroundColor:
              overlay
                ? i === current
                  ? t.colors.accent
                  : 'rgba(128,128,128,0.5)'
                : i === current
                  ? t.colors.accent
                  : t.colors.borderStrong,
          }}
        />
      ))}
    </View>
  );
}

function CarouselArrow({
  direction,
  onPress,
  disabled = false,
}: {
  direction: 'left' | 'right';
  onPress: () => void;
  disabled?: boolean;
}) {
  const t = useTokens();
  const isLeft = direction === 'left';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isLeft ? 'Previous' : 'Next'}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        borderRadius: t.radii.full,
        backgroundColor: pressed
          ? t.colors.touchFeedbackMain
          : t.colors.surfaceRaised,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.35 : 1,
      })}
    >
      <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <Path
          d={
            isLeft
              ? 'M10 3L5 8L10 13'
              : 'M6 3L11 8L6 13'
          }
          stroke={t.colors.textPrimary}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}
