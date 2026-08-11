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
import { useTokens } from '../../foundation/theme-provider';

export type TabBarWidth = 'full' | 'floating';
export type TabBarSurface = 'transparent' | 'filled';

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
  /** Optional blur layer (e.g. `expo-blur`'s BlurView) rendered behind a transparent surface for legibility. */
  blurComponent?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type UseTabBarScrollOptions = {
  threshold?: number;
  topOffset?: number;
};

export function useTabBarScroll(options: UseTabBarScrollOptions = {}) {
  const t = useTokens();
  const threshold = options.threshold ?? t.spacing[5];
  const topOffset = options.topOffset ?? t.spacing[6];
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
  const innerPadding = floating ? t.spacing[1] : t.spacing[0];
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
  const barHeight = showLabels ? t.spacing[16] : t.spacing[14];
  const backgroundColor = surface === 'filled' ? t.colors.navBackground : 'transparent';

  // Floating bars shrink in place on scroll (like Instagram's pill) so they stay
  // reachable; full-width bars slide off-screen since a stretched bar scales poorly.
  const hideTransform = floating
    ? [
        {
          translateY: visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [0, t.spacing[3]],
          }),
        },
        { scale: visibility.interpolate({ inputRange: [0, 1], outputRange: [1, 0.84] }) },
      ]
    : [
        {
          translateY: visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [0, barHeight + bottomInset + t.spacing[6]],
          }),
        },
      ];
  // A filled surface stays fully opaque while hiding so it keeps reading as
  // "filled" even mid-scroll; only transparent/floating bars fade for de-emphasis.
  const hideOpacity = visibility.interpolate({
    inputRange: [0, 1],
    outputRange: [1, surface === 'filled' ? 1 : floating ? 0.55 : 0.2],
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
          borderTopWidth: floating ? 1 : surface === 'filled' ? 1 : 0,
          borderRightWidth: floating ? 1 : 0,
          borderBottomWidth: floating ? 1 : 0,
          borderLeftWidth: floating ? 1 : 0,
          borderColor: t.colors.navBorder,
          backgroundColor,
          overflow: 'hidden',
          transform: hideTransform,
          opacity: hideOpacity,
        },
        floating && surface === 'filled' ? (t.shadows.md as ViewStyle) : null,
        style,
      ]}
    >
      {surface === 'transparent' && blurComponent ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        >
          {blurComponent}
        </View>
      ) : null}

      {floating && barWidth > 0 && items.length > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: t.spacing[1],
            left: innerPadding,
            width: indicatorWidth,
            height: barHeight - t.spacing[2],
            borderRadius: t.radii.full,
            backgroundColor: surface === 'filled' ? t.colors.surfaceStrong : t.colors.surfaceElevated,
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
  color,
  onPress,
}: InternalTabBarItemProps) {
  const t = useTokens();
  const resolvedColor = color ?? t.colors.navInactive;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minWidth: t.sizing.touchTarget.minimum,
        minHeight: t.sizing.touchTarget.minimum,
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? t.spacing[1] : t.spacing[0],
        opacity: disabled ? 0.38 : pressed ? t.motion.pressed.opacity : 1,
        transform: [{ scale: pressed ? t.motion.pressed.scale : 1 }],
      })}
    >
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        {icon?.({ active, color: resolvedColor, size: t.sizing.icon.md })}
        {badge != null ? (
          <View
            style={{
              position: 'absolute',
              top: -t.spacing[2],
              right: -t.spacing[3],
              minWidth: t.sizing.icon.xs,
              height: t.sizing.icon.xs,
              paddingHorizontal: t.spacing[1],
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: t.radii.full,
              backgroundColor: t.colors.interactiveError,
            }}
          >
            <Text
              style={{
                color: t.colors.textInteractivePrimary,
                fontFamily: t.fontFamilies.sans,
                ...t.typography.labelSmall,
                fontWeight: t.fontWeights.semibold,
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
            color: resolvedColor,
            fontFamily: t.fontFamilies.sans,
            ...t.typography.labelSmall,
            fontWeight: active ? t.fontWeights.semibold : t.fontWeights.medium,
          }}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

export const TabBar = Object.assign(TabBarRoot, { Item: TabBarItem });
