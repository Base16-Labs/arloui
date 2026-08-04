import { useCallback, useEffect, useRef, useState, Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassBackdrop, useGlassSurface } from '../../foundation/glass';
import { useTokens } from '../../foundation/theme-provider';

export type TabBarWidth = 'full' | 'floating';
/**
 * `'filled'` opaque nav fill · `'transparent'` no fill (host paints behind it) ·
 * `'glass'` translucent Liquid Glass material.
 */
export type TabBarSurface = 'transparent' | 'filled' | 'glass';

export type TabBarIconProps = {
  active: boolean;
  color: string;
  size: number;
};

export type TabBarItemProps = {
  value: string;
  label: string;
  icon?: (props: TabBarIconProps) => ReactNode;
  badge?: string | number;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type TabBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  width?: TabBarWidth;
  surface?: TabBarSurface;
  showLabels?: boolean;
  hidden?: boolean;
  bottomInset?: number;
  /** Optional blur layer (e.g. `expo-blur`'s BlurView) rendered behind a transparent or glass surface. */
  blurComponent?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type UseTabBarScrollOptions = {
  threshold?: number;
  topOffset?: number;
};

export function useTabBarScroll({ threshold = 18, topOffset = 24 }: UseTabBarScrollOptions = {}) {
  const [hidden, setHidden] = useState(false);
  const lastOffset = useRef(0);
  const directionAnchor = useRef(0);
  const direction = useRef<'up' | 'down' | null>(null);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextOffset = Math.max(0, event.nativeEvent.contentOffset.y);
      const delta = nextOffset - lastOffset.current;
      const nextDirection = delta > 0 ? 'down' : delta < 0 ? 'up' : direction.current;

      if (nextOffset <= topOffset) {
        setHidden(false);
        direction.current = null;
        directionAnchor.current = nextOffset;
        lastOffset.current = nextOffset;
        return;
      }

      if (nextDirection && nextDirection !== direction.current) {
        direction.current = nextDirection;
        directionAnchor.current = nextOffset;
      }

      const travelled = Math.abs(nextOffset - directionAnchor.current);
      if (travelled >= threshold) {
        if (nextDirection === 'down') setHidden(true);
        if (nextDirection === 'up') setHidden(false);
        directionAnchor.current = nextOffset;
      }

      lastOffset.current = nextOffset;
    },
    [threshold, topOffset],
  );

  return { hidden, onScroll };
}

function TabBarRoot({
  value,
  onValueChange,
  children,
  width = 'full',
  surface = 'filled',
  showLabels = false,
  hidden = false,
  bottomInset = 0,
  blurComponent,
  style,
}: TabBarProps) {
  const t = useTokens();
  // A nav bar sits over scrolling content, so it takes the medium material — enough
  // separation to stay legible without fully hiding what passes underneath.
  const glass = useGlassSurface('medium');
  // The selection pill sits on top of the bar's own material, so it takes the
  // lighter one — an opaque pill on glass would punch a hole in the effect.
  const glassIndicator = useGlassSurface('small');
  const isGlass = surface === 'glass';
  const [barWidth, setBarWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const items = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement<InternalTabBarItemProps>[];
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.props.value === value),
  );
  const [selection] = useState(() => new Animated.Value(activeIndex));
  const [visibility] = useState(() => new Animated.Value(hidden ? 1 : 0));
  const floating = width === 'floating';
  const innerPadding = floating ? 4 : 0;
  const itemWidth = items.length > 0 ? Math.max(0, barWidth - innerPadding * 2) / items.length : 0;
  const indicatorWidth = floating ? itemWidth : Math.min(34, itemWidth * 0.46);
  const indicatorOffset = floating ? 0 : Math.max(0, (itemWidth - indicatorWidth) / 2);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => active && setReduceMotion(enabled));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      selection.setValue(activeIndex);
      return;
    }
    Animated.spring(selection, {
      toValue: activeIndex,
      ...t.motion.spring.snappy,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, reduceMotion, selection, t.motion.spring.snappy]);

  useEffect(() => {
    Animated.timing(visibility, {
      toValue: hidden ? 1 : 0,
      duration: reduceMotion ? 0 : t.motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [hidden, reduceMotion, t.motion.duration.fast, visibility]);

  function handleLayout(event: LayoutChangeEvent) {
    setBarWidth(event.nativeEvent.layout.width);
  }

  const indicatorTranslate = Animated.add(Animated.multiply(selection, itemWidth), indicatorOffset);
  const barHeight = showLabels ? 64 : 56;
  const backgroundColor = isGlass
    ? glass.backgroundColor
    : surface === 'filled'
      ? t.colors.navBackground
      : 'transparent';
  const borderColor = isGlass ? glass.borderColor : t.colors.navBorder;
  // Glass and filled both read as a real surface, so both keep an edge; only a
  // fully transparent bar goes borderless.
  const hasEdge = surface === 'filled' || isGlass;

  // Floating bars shrink in place on scroll (like Instagram's pill) so they stay
  // reachable; full-width bars slide off-screen since a stretched bar scales poorly.
  const hideTransform = floating
    ? [
        { translateY: visibility.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) },
        { scale: visibility.interpolate({ inputRange: [0, 1], outputRange: [1, 0.84] }) },
      ]
    : [
        {
          translateY: visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [0, barHeight + bottomInset + 24],
          }),
        },
      ];
  // Filled and glass surfaces hold their opacity while hiding so they keep reading as
  // a real surface even mid-scroll; only transparent bars fade for de-emphasis.
  const hideOpacity = visibility.interpolate({
    inputRange: [0, 1],
    outputRange: [1, hasEdge ? 1 : floating ? 0.55 : 0.2],
  });

  return (
    <Animated.View
      pointerEvents={hidden && !floating ? 'none' : 'auto'}
      onLayout={handleLayout}
      style={[
        {
          alignSelf: floating ? 'center' : 'stretch',
          width: floating ? '92%' : '100%',
          maxWidth: floating ? 420 : undefined,
          minHeight: barHeight + bottomInset,
          paddingBottom: bottomInset,
          borderRadius: floating ? t.radii.full : 0,
          borderTopWidth: floating ? 1 : hasEdge ? 1 : 0,
          borderRightWidth: floating ? 1 : 0,
          borderBottomWidth: floating ? 1 : 0,
          borderLeftWidth: floating ? 1 : 0,
          borderColor,
          backgroundColor,
          overflow: 'hidden',
          transform: hideTransform,
          opacity: hideOpacity,
        },
        floating && hasEdge ? (t.shadows.md as ViewStyle) : null,
        style,
      ]}
    >
      {surface !== 'filled' ? <GlassBackdrop>{blurComponent}</GlassBackdrop> : null}

      {floating && barWidth > 0 && items.length > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 4,
            left: innerPadding,
            width: indicatorWidth,
            height: barHeight - 8,
            borderRadius: t.radii.full,
            backgroundColor: isGlass
              ? glassIndicator.backgroundColor
              : surface === 'filled'
                ? t.colors.surfaceStrong
                : t.colors.surfaceElevated,
            borderWidth: isGlass ? glassIndicator.borderWidth : 0,
            borderColor: isGlass ? glassIndicator.borderColor : 'transparent',
            transform: [{ translateX: indicatorTranslate }],
          }}
        />
      ) : null}

      <View style={{ minHeight: barHeight, flexDirection: 'row', paddingHorizontal: innerPadding }}>
        {items.map((item) => {
          const active = item.props.value === value;
          return cloneElement(item, {
            key: item.props.value,
            active,
            showLabel: showLabels,
            color: active ? t.colors.navActive : t.colors.navInactive,
            onPress: () => onValueChange(item.props.value),
          });
        })}
      </View>
    </Animated.View>
  );
}

type InternalTabBarItemProps = TabBarItemProps & {
  active?: boolean;
  showLabel?: boolean;
  color?: string;
  onPress?: () => void;
};

function TabBarItem(props: TabBarItemProps) {
  return <TabBarItemView {...(props as InternalTabBarItemProps)} />;
}

function TabBarItemView({
  label,
  icon,
  badge,
  disabled = false,
  accessibilityLabel,
  active = false,
  showLabel = false,
  color = '#000000',
  onPress,
}: InternalTabBarItemProps) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minWidth: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? 2 : 0,
        opacity: disabled ? 0.38 : pressed ? t.motion.pressed.opacity : 1,
        transform: [{ scale: pressed ? t.motion.pressed.scale : 1 }],
      })}
    >
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        {icon?.({ active, color, size: 24 })}
        {badge != null ? (
          <View
            style={{
              position: 'absolute',
              top: -7,
              right: -12,
              minWidth: 16,
              height: 16,
              paddingHorizontal: 4,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: t.radii.full,
              backgroundColor: t.colors.interactiveError,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: t.fontFamilies.sans,
                fontWeight: t.fontWeights.semibold,
                fontSize: 9,
                lineHeight: 12,
              }}
            >
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
      {showLabel ? (
        <Text
          numberOfLines={1}
          style={{
            maxWidth: '100%',
            color,
            fontFamily: t.fontFamilies.sans,
            fontWeight: active ? t.fontWeights.semibold : t.fontWeights.medium,
            fontSize: 10,
            lineHeight: 13,
          }}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

export const TabBar = Object.assign(TabBarRoot, { Item: TabBarItem });
