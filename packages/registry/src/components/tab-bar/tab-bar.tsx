import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
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
import { GlassBackdrop } from '../../foundation/glass';
import { useTokens } from '../../foundation/theme-provider';

export type TabBarWidth = 'full' | 'floating';
/**
 * `'filled'` opaque nav fill · `'transparent'` no fill (host paints behind it) ·
 * `'glass'` translucent Liquid Glass material.
 */
export type TabBarSurface = 'transparent' | 'filled' | 'glass';
/**
 * What the bar does with the `hidden` scroll signal — chosen here rather than
 * derived from `width`. `hide` slides it off, `shrink` shrinks it in place so it
 * stays reachable, `fixed` ignores scrolling entirely.
 */
export type TabBarScrollBehavior = 'hide' | 'shrink' | 'fixed';
/**
 * Selection indicator motion. `snap` reproduces the current, instant-feeling
 * behaviour (Rule 07 — a tab toggle is habitual, so it shouldn't read as latency).
 * `jelly` is the opt-in expressive move: the pill stretches toward its target and
 * settles with a soft wobble.
 */
export type TabBarSelectionMotion = 'snap' | 'jelly';

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
  /**
   * How the bar reacts to the `hidden` scroll signal, independent of `width`.
   * Defaults to `shrink` for floating and `hide` for full — today's behaviour.
   */
  scrollBehavior?: TabBarScrollBehavior;
  /**
   * Selection indicator motion for the floating pill. `snap` (default) tracks the
   * tab instantly; `jelly` stretches toward it and settles with a wobble. Only the
   * floating variant has a pill, so this is a no-op on full-width bars.
   */
  selection?: TabBarSelectionMotion;
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

// Jelly selection tuning. Local constants while the feel is still being dialled in
// — promote to `motion.spring` tokens once locked (§5.2). The stretch is driven by
// the pill's *lag* (target minus current position): it deforms while the pill is
// behind its target and relaxes as it arrives, so the stretch lasts exactly as
// long as the travel — a pulse decays too fast to see. Tuned loud on purpose.
const JELLY_MAX_STRETCH = 0.7; // peak horizontal stretch → scaleX up to 1.7
const JELLY_MAX_LAG = 1.4; // index-distance of lag at which the stretch peaks
const JELLY_SQUASH_RATIO = 0.42; // vertical squash relative to horizontal stretch
const JELLY_REACH = 0.16; // how far the pill leads toward its target, in slot-fractions
// Jelly slows the travel so the stretch reads; snap keeps the instant snappy spring.
const JELLY_POSITION_SPRING = { stiffness: 150, damping: 20, mass: 1 } as const;

// The scrim behind the floating bar is a *translucent* wash — content still ghosts
// through it — that settles behind and below the bar (the gap to the screen edge)
// and fades to nothing just above it, so it blends rather than draws a line.
const SCRIM_RISE = 24; // short fade above the bar, so it doesn't reach up into content
const SCRIM_DROP = 96; // wash zone below the bar, run past the screen edge
const SCRIM_OPACITY = 0.9; // translucent, not a solid cover

function TabBarRoot({
  value,
  onValueChange,
  children,
  width = 'full',
  surface = 'filled',
  scrollBehavior,
  selection = 'snap',
  showLabels = false,
  hidden = false,
  bottomInset = 0,
  blurComponent,
  style,
}: TabBarProps) {
  const t = useTokens();
  const isGlass = surface === 'glass';
  // Per-instance gradient id so two floating bars on one screen don't share (and
  // overwrite) a single document-global scrim definition.
  const scrimId = `arloTabScrim-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  /**
   * Width of the row the tabs actually lay out in, measured on the row itself.
   * Measuring the outer view instead would include its border — a floating bar
   * carries one on every side — and the pill would then divide a track 2px wider
   * than the real one, drifting a little further right on each successive tab.
   */
  const [trackWidth, setTrackWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const items = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement<InternalTabBarItemProps>[];
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.props.value === value),
  );
  // The pill's position along the track, in tab-index units. Named apart from the
  // `selection` prop, which picks the *motion*, not the position. `target` is where
  // it's heading — the gap between the two is what the jelly stretch reads.
  const [position] = useState(() => new Animated.Value(activeIndex));
  const [target] = useState(() => new Animated.Value(activeIndex));
  const [visibility] = useState(() => new Animated.Value(hidden ? 1 : 0));
  const floating = width === 'floating';
  const jelly = selection === 'jelly';
  const resolvedScroll: TabBarScrollBehavior = scrollBehavior ?? (floating ? 'shrink' : 'hide');
  const reactsToScroll = resolvedScroll !== 'fixed';
  const barHeight = showLabels ? 64 : 56;
  const innerPadding = floating ? 4 : 0;
  const itemWidth =
    items.length > 0 ? Math.max(0, trackWidth - innerPadding * 2) / items.length : 0;

  // Only the floating variant carries a selection pill. A full-width bar reads its
  // active tab from icon colour alone, so `selection` (snap/jelly) is a floating
  // concern and a no-op on full-width.
  const showPill = floating;
  const pillWidth = itemWidth;
  const pillHeight = barHeight - 8;

  // A full-width bar set to `shrink` doesn't scale in place — a stretched rectangle
  // reads badly. It morphs into the floating pill instead: pulling in from the
  // edges, rounding to a full radius, and lifting on a shadow as it recedes.
  const morphsToFloating = !floating && resolvedScroll === 'shrink';
  const morphWidth = visibility.interpolate({ inputRange: [0, 1], outputRange: ['100%', '92%'] });
  const morphRadius = visibility.interpolate({
    inputRange: [0, 1],
    outputRange: [0, t.radii.full],
  });
  // As the full-width bar morphs into a floating pill its shadow rolls over from
  // the subtle upward cast to the floating md shadow (downward).
  const morphShadowOpacity = visibility.interpolate({
    inputRange: [0, 1],
    outputRange: [0.06, 0.08],
  });
  const morphShadowOffsetY = visibility.interpolate({ inputRange: [0, 1], outputRange: [-3, 1] });

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
    // `target` snaps immediately; `position` chases it. Their gap is the stretch.
    target.setValue(activeIndex);
    if (reduceMotion) {
      position.setValue(activeIndex);
      return;
    }
    // Snap tracks the tab instantly; jelly slows the travel so the stretch reads.
    // Neither overshoots — the bounce is the pill's shape, not its position.
    Animated.spring(position, {
      toValue: activeIndex,
      ...(jelly ? JELLY_POSITION_SPRING : t.motion.spring.snappy),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, jelly, reduceMotion, position, target, t.motion.spring.snappy]);

  useEffect(() => {
    Animated.timing(visibility, {
      toValue: hidden && reactsToScroll ? 1 : 0,
      duration: reduceMotion ? 0 : t.motion.duration.fast,
      // Non-native: the full-width→floating morph animates width and border radius,
      // which the native driver can't touch. The pill's own motion stays native.
      useNativeDriver: false,
    }).start();
  }, [hidden, reactsToScroll, reduceMotion, t.motion.duration.fast, visibility]);

  function handleTrackLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  // How far the pill still has to travel, signed. Peaks at the start of a jump and
  // decays to zero as it lands — the natural driver for a stretch that reaches.
  const lag = Animated.subtract(target, position);
  const lagStretch = lag.interpolate({
    inputRange: [-JELLY_MAX_LAG, 0, JELLY_MAX_LAG],
    outputRange: [JELLY_MAX_STRETCH, 0, JELLY_MAX_STRETCH],
    extrapolate: 'clamp',
  });
  // Snap leaves the pill undeformed (scale 1); jelly deforms it by the travel lag.
  const pillScaleX = jelly ? Animated.add(lagStretch, 1) : 1;
  const pillScaleY = jelly
    ? Animated.add(Animated.multiply(lagStretch, -JELLY_SQUASH_RATIO), 1)
    : 1;
  // Lead the pill toward its target by a fraction of the lag, so the stretch
  // reaches in the direction of travel instead of ballooning symmetrically.
  const reach = jelly ? Animated.multiply(lag, itemWidth * JELLY_REACH) : 0;
  const indicatorTranslate = Animated.add(Animated.multiply(position, itemWidth), reach);
  // A glass bar paints nothing here — its fill rides above the blur layer inside
  // GlassBackdrop, so the blur only samples the content passing underneath.
  const backgroundColor = surface === 'filled' ? t.colors.navBackground : 'transparent';
  // A full-width bar sits at the screen edge, so it casts a subtle shadow *upward*
  // (−y) to lift off the content scrolling above it, rather than the downward
  // shadow a floating bar uses.
  const topShadow = {
    shadowColor: t.shadows.md.shadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 6,
  } as ViewStyle;

  // The morph lifts off the bottom edge as it pulls in, so it reads as a floating
  // pill rather than a shape stuck to the screen bottom.
  const morphMargin = visibility.interpolate({ inputRange: [0, 1], outputRange: [0, 24] });

  // Motion is chosen by `scrollBehavior`, not by width: `shrink` keeps the bar in
  // place and reachable, `hide` slides it clear off, `fixed` never moves. A
  // full-width `shrink` morphs into the floating pill (see `morphsToFloating`), so
  // it only eases its scale here — the pull-in and lift are layout, above.
  const hideTransform = morphsToFloating
    ? [{ scale: visibility.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] }) }]
    : resolvedScroll === 'shrink'
      ? [
          { translateY: visibility.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) },
          { scale: visibility.interpolate({ inputRange: [0, 1], outputRange: [1, 0.84] }) },
        ]
      : resolvedScroll === 'hide'
        ? [
            {
              translateY: visibility.interpolate({
                inputRange: [0, 1],
                outputRange: [0, barHeight + bottomInset + 24],
              }),
            },
          ]
        : [];

  // The scrim tracks the bar's scroll reaction: on `hide` it fades away with the
  // bar; on `shrink` its height drops (and follows the bar down) so the wash
  // recedes with it; `fixed` leaves it be.
  const scrimReaction =
    resolvedScroll === 'hide'
      ? { opacity: visibility.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
      : resolvedScroll === 'shrink'
        ? {
            transform: [
              { translateY: visibility.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) },
              { scaleY: visibility.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) },
            ],
          }
        : null;

  return (
    <View pointerEvents="box-none" style={{ width: '100%', alignItems: 'center' }}>
      {/* A soft scrim behind, beside, and below the floating bar: content dissolves
          into the background as it nears the nav instead of ending on a hard line. */}
      {floating ? (
        <Animated.View
          pointerEvents="none"
          style={[
            { position: 'absolute', left: 0, right: 0, top: -SCRIM_RISE, bottom: -SCRIM_DROP },
            scrimReaction,
          ]}
        >
          <Svg width="100%" height="100%">
            <Defs>
              {/* One continuous ramp — transparent at the top, translucent at the
                  bottom. No flat plateau, so there's no edge to read as a line. */}
              <LinearGradient id={scrimId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={t.colors.bg} stopOpacity={0} />
                <Stop offset="1" stopColor={t.colors.bg} stopOpacity={SCRIM_OPACITY} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${scrimId})`} />
          </Svg>
        </Animated.View>
      ) : null}
      <Animated.View
        pointerEvents={hidden && resolvedScroll === 'hide' ? 'none' : 'auto'}
        style={[
          {
            alignSelf: floating || morphsToFloating ? 'center' : 'stretch',
            width: floating ? '92%' : morphsToFloating ? morphWidth : '100%',
            maxWidth: floating ? 420 : undefined,
            minHeight: barHeight + bottomInset,
            paddingBottom: bottomInset,
            marginBottom: morphsToFloating ? morphMargin : undefined,
            borderRadius: floating ? t.radii.full : morphsToFloating ? morphRadius : 0,
            backgroundColor,
            overflow: 'hidden',
            transform: hideTransform,
          },
          // Every floating bar casts the md shadow; a resting full-width bar casts the
          // subtle upward shadow; a morphing bar rolls from one to the other.
          floating ? (t.shadows.md as ViewStyle) : null,
          !floating && !morphsToFloating ? topShadow : null,
          morphsToFloating
            ? ({
                shadowColor: t.shadows.md.shadowColor,
                shadowRadius: 8,
                shadowOpacity: morphShadowOpacity,
                shadowOffset: { width: 0, height: morphShadowOffsetY },
              } as unknown as ViewStyle)
            : null,
          style,
        ]}
      >
        {surface !== 'filled' ? (
          <GlassBackdrop material={isGlass ? 'medium' : undefined}>{blurComponent}</GlassBackdrop>
        ) : null}

        {showPill && trackWidth > 0 && items.length > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 4,
              left: innerPadding,
              width: pillWidth,
              height: pillHeight,
              borderRadius: t.radii.full,
              backgroundColor: t.colors.interactiveSecondary,
              transform: [
                { translateX: indicatorTranslate },
                { scaleX: pillScaleX },
                { scaleY: pillScaleY },
              ],
            }}
          />
        ) : null}

        <View
          onLayout={handleTrackLayout}
          style={{ minHeight: barHeight, flexDirection: 'row', paddingHorizontal: innerPadding }}
        >
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
    </View>
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
        minWidth: t.sizing.touchTarget.minimum,
        minHeight: t.sizing.touchTarget.minimum,
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? 2 : 0,
        opacity: disabled ? 0.38 : pressed ? t.motion.pressed.opacity : 1,
        transform: [{ scale: pressed ? t.motion.pressed.scale : 1 }],
      })}
    >
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        {icon?.({ active, color, size: t.sizing.icon.md })}
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
                // White in both themes — badge text sits on the saturated error fill.
                color: t.colors.textInteractivePrimary,
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
