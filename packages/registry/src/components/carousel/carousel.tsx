import {
  Children,
  forwardRef,
  isValidElement,
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
  I18nManager,
  PanResponder,
  Pressable,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type CarouselSnap = 'item' | 'page';
export type CarouselIndicator = 'dots' | 'none';

export type CarouselProps = {
  children: ReactNode;
  snap?: CarouselSnap;
  peek?: boolean;
  indicator?: CarouselIndicator;
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

  const translateX = useRef(new Animated.Value(0)).current;
  const gestureActive = useRef(false);
  const indexRef = useRef(initialIndex);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const peekAmount = peek ? t.spacing[8] : 0;
  const itemWidth = snap === 'page' ? containerWidth : containerWidth - peekAmount * 2;
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

  const offsetForIndex = (index: number) => {
    const rtlSign = I18nManager.isRTL ? 1 : -1;
    return rtlSign * (index * (itemWidth + resolvedGap) - (peek ? peekAmount : 0));
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
    translateX.setValue(offsetForIndex(initialIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

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
    [itemWidth, resolvedGap, count, loop],
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) setContainerWidth(w);
  };

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

      {indicator === 'dots' && count > 1 ? (
        <CarouselDots count={count} current={currentIndex} onPress={animateTo} />
      ) : null}
    </View>
  );
});

function CarouselDots({
  count,
  current,
  onPress,
}: {
  count: number;
  current: number;
  onPress: (index: number) => void;
}) {
  const t = useTokens();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: t.spacing[2],
        paddingTop: t.spacing[3],
        paddingBottom: t.spacing[1],
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
            width: i === current ? 20 : 7,
            height: 7,
            borderRadius: t.radii.full,
            backgroundColor: i === current ? t.colors.accent : t.colors.borderStrong,
          }}
        />
      ))}
    </View>
  );
}
