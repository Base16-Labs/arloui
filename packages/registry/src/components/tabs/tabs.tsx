import { useEffect, useState, Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassBackdrop, useGlassSurface, useReduceTransparency, withAlpha } from '../../foundation/glass';
import { useTokens } from '../../foundation/theme-provider';
import { useReduceMotion } from '../../foundation/reduce-motion';

/*
 * The glass thumb's travel. A gentler cut of the TabBar's `jelly`: the lens
 * stretches toward the segment it is heading for and settles back, the way the
 * iOS 26 segmented control does. A segment is narrower than a tab-bar slot, so
 * the stretch is smaller or it reads as a blob.
 */
const THUMB_MAX_STRETCH = 0.22; // peak scaleX over 1
const THUMB_MAX_LAG = 1.2; // index distance at which the stretch peaks
const THUMB_SQUASH_RATIO = 0.35; // vertical squash relative to the stretch
const THUMB_REACH = 0.1; // how far the lens leads toward its target, in segments
const THUMB_SPRING = { stiffness: 190, damping: 22, mass: 1 } as const;
/*
 * The light-mode platter on a glass track. The track and the platter are both
 * near white there, so the platter is told apart by its shadow alone — the
 * theme's `sm` (6%, 2pt) is tuned for the grey filled well and vanishes on
 * white. This is the iOS 26 light-mode control's lift: soft and a little low.
 */
const PLATTER_SHADOW = {
  shadowOpacity: 0.14,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
} as const;

export type TabsAppearance = 'plain' | 'underline' | 'filled' | 'segmented';
export type TabsTone = 'neutral' | 'accent';
export type TabsLayout = 'content' | 'equal';
/**
 * Only the segmented track has a surface. `'filled'` is the opaque well;
 * `'glass'` is Liquid Glass — the real system material on iOS 26 and a
 * translucent overlay over a host blur everywhere else. A no-op on the other
 * appearances, which have no track to paint.
 */
export type TabsSurface = 'filled' | 'glass';

export type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  appearance?: TabsAppearance;
  tone?: TabsTone;
  layout?: TabsLayout;
  surface?: TabsSurface;
  /**
   * Optional blur layer (e.g. `expo-blur`'s BlurView) behind a glass segmented
   * track. Ignored on the native glass path, where the system material blurs
   * for itself, and on every appearance that is not segmented.
   */
  blurComponent?: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export type TabsItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
  accessibilityLabel?: string;
};

type InternalTabsItemProps = TabsItemProps & {
  active?: boolean;
  appearance?: TabsAppearance;
  tone?: TabsTone;
  equal?: boolean;
  reduceMotion?: boolean;
  /** Sitting on a glass track, where the backdrop's brightness is unknown. */
  onGlass?: boolean;
  onPress?: () => void;
};

/*
 * Labels on a glass track. The track takes on whatever passes behind it, so a
 * dark-mode label can end up over pale glass and a light-mode one over dark —
 * and React Native cannot read that brightness back, nor give custom text the
 * system's vibrancy. Contrast is bought the way captions over unknown footage
 * buy it: a stronger ink plus a soft halo in the opposite tone, which separates
 * the glyphs from a backdrop of either brightness.
 */
const GLASS_LABEL_INK = 0.78; // unselected label: primary ink at this alpha
// Tight and strong rather than wide and soft: the halo has to give each glyph a
// firm edge, and a wide one only fogs the glass around it.
const GLASS_HALO_RADIUS = 3;
const GLASS_HALO_DARK = 0.9; // halo behind light (dark-mode) text
const GLASS_HALO_LIGHT = 0.95; // halo behind dark (light-mode) text

function TabsRoot({
  value,
  onValueChange,
  children,
  appearance = 'plain',
  tone = 'neutral',
  layout = 'content',
  surface = 'filled',
  blurComponent,
  scrollable = false,
  style,
  accessibilityLabel = 'Content tabs',
}: TabsProps) {
  const t = useTokens();
  const reduceMotion = useReduceMotion();
  const glass = useGlassSurface('small');
  // One step heavier than the track: on iOS 26 the track is `clear` and the
  // thumb `regular`, so the selection reads as a raised lens, not a hole.
  const thumbGlass = useGlassSurface('medium');
  const reduceTransparency = useReduceTransparency();
  const [trackWidth, setTrackWidth] = useState(0);
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<TabsItemProps>[];
  const segmented = appearance === 'segmented';
  const isGlass = segmented && surface === 'glass';
  // A segmented control is a fixed, equal-width track — it ignores scrollable/content layout.
  const equal = segmented || (layout === 'equal' && !scrollable);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.props.value === value),
  );
  const [selection] = useState(() => new Animated.Value(activeIndex));
  // Where the thumb is heading. The gap between it and `selection` drives the
  // glass thumb's stretch; the filled thumb ignores it.
  const [target] = useState(() => new Animated.Value(activeIndex));


  useEffect(() => {
    if (!segmented) return;
    target.setValue(activeIndex);
    if (reduceMotion) {
      selection.setValue(activeIndex);
      return;
    }
    Animated.spring(selection, {
      toValue: activeIndex,
      // The glass lens travels a touch slower so its stretch has time to read.
      ...(isGlass ? THUMB_SPRING : t.motion.spring.snappy),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, isGlass, reduceMotion, segmented, selection, target, t.motion.spring.snappy]);

  if (segmented) {
    const segPadding = t.spacing[1];
    const thumbWidth = items.length > 0 ? Math.max(0, (trackWidth - segPadding * 2) / items.length) : 0;
    // Labels follow the track: on glass they carry their own contrast.
    // Reduce Transparency asks for no glass at all, so everything goes back to
    // the solid treatment (the track's own material falls back too).
    const labelsOnGlass = isGlass && !reduceTransparency;
    // The lens is glass in dark mode only. In light mode a translucent lens over
    // a white backdrop can't be separated from the track: on iOS 26 the light
    // material ignores a darkening tint, and a shadow is either clipped by the
    // glass track or shows through the lens as a grey slab — all three tried on
    // device. Light mode keeps the white platter with a soft shadow, which is
    // what the iOS 26 control shows in light mode anyway.
    const glassThumb = labelsOnGlass && t.name === 'dark';
    // How far the lens still has to travel, signed — peaks as a jump starts and
    // decays as it lands, which is what makes the stretch reach and settle.
    const lag = Animated.subtract(target, selection);
    const stretch = lag.interpolate({
      inputRange: [-THUMB_MAX_LAG, 0, THUMB_MAX_LAG],
      outputRange: [THUMB_MAX_STRETCH, 0, THUMB_MAX_STRETCH],
      extrapolate: 'clamp',
    });
    const thumbScaleX = reduceMotion ? 1 : Animated.add(stretch, 1);
    const thumbScaleY = reduceMotion
      ? 1
      : Animated.add(Animated.multiply(stretch, -THUMB_SQUASH_RATIO), 1);
    const thumbTranslate = Animated.add(
      Animated.multiply(selection, thumbWidth),
      reduceMotion ? 0 : Animated.multiply(lag, thumbWidth * THUMB_REACH),
    );
    const thumbFallbackFill =
      t.name === 'dark'
        ? withAlpha(t.colors.textPrimary, 0.14)
        : withAlpha(t.colors.surfaceElevated, 0.72);
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'stretch',
            padding: segPadding,
            borderRadius: t.radii.full,
            // GlassBackdrop paints the well. A fill here would stack under it.
            backgroundColor: isGlass ? 'transparent' : t.colors.surfaceStrong,
            borderWidth: isGlass ? glass.borderWidth : 0,
            borderColor: isGlass ? glass.borderColor : undefined,
          },
          style,
        ]}
      >
        {isGlass ? (
          // The glass is clipped to the pill here rather than by the track, so
          // the track itself doesn't clip — a clipping track cut off the thumb's
          // shadow, which is what left the selection invisible over white.
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              borderRadius: t.radii.full,
              overflow: 'hidden',
            }}
          >
          <GlassBackdrop
            material="small"
            borderRadius={t.radii.full}
            // A neutral tint, never a tone. Dark: the theme's own ground, which keeps
            // the native track in the scheme's range so light content passing
            // behind can't wash it pale under light labels. Light: white, which
            // keeps a light-mode track from sinking dark over dark content.
            tintColor={t.name === 'dark' ? t.colors.surfaceBackground : t.colors.surfaceElevated}
          >
            {blurComponent}
          </GlassBackdrop>
          </View>
        ) : null}
        {trackWidth > 0 && thumbWidth > 0 ? (
          glassThumb ? (
            // Outer: position and motion. Inner: the glass itself, clipped to the pill.
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: segPadding,
                bottom: segPadding,
                left: segPadding,
                width: thumbWidth,
                borderRadius: t.radii.full,
                transform: [
                  { translateX: thumbTranslate },
                  { scaleX: thumbScaleX },
                  { scaleY: thumbScaleY },
                ],
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  borderRadius: t.radii.full,
                  overflow: 'hidden',
                  // Native: the system material is the fill and the edge. Fallback:
                  // a brighter wash than the track, rimmed with the material's lit
                  // hairline, so it still reads as glass rather than a slab.
                  backgroundColor: thumbGlass.native ? 'transparent' : thumbFallbackFill,
                  borderWidth: thumbGlass.native ? 0 : thumbGlass.borderWidth,
                  borderColor: thumbGlass.native ? 'transparent' : thumbGlass.borderColor,
                }}
              >
                {thumbGlass.native ? (
                  <GlassBackdrop material="medium" borderRadius={t.radii.full} />
                ) : null}
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  top: segPadding,
                  bottom: segPadding,
                  left: segPadding,
                  width: thumbWidth,
                  borderRadius: t.radii.full,
                  backgroundColor: t.name === 'dark' ? t.colors.borderStrong : t.colors.surface,
                  transform: [{ translateX: Animated.multiply(selection, thumbWidth) }],
                },
                isGlass
                  ? ({ shadowColor: t.shadows.sm.shadowColor, ...PLATTER_SHADOW } as ViewStyle)
                  : (t.shadows.sm as ViewStyle),
              ]}
            />
          )
        ) : null}
        {items.map((item) =>
          cloneElement(item as ReactElement<InternalTabsItemProps>, {
            key: item.props.value,
            active: item.props.value === value,
            appearance,
            tone,
            equal: true,
            reduceMotion,
            onGlass: labelsOnGlass,
            onPress: () => onValueChange(item.props.value),
          }),
        )}
      </View>
    );
  }

  const content = (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: appearance === 'filled' ? t.spacing[2] : t.spacing[1],
        },
        appearance === 'underline'
          ? { borderBottomWidth: 1, borderBottomColor: t.colors.border }
          : null,
        !scrollable ? style : null,
      ]}
    >
      {items.map((item) =>
        cloneElement(item as ReactElement<InternalTabsItemProps>, {
          key: item.props.value,
          active: item.props.value === value,
          appearance,
          tone,
          equal,
          reduceMotion,
          onPress: () => onValueChange(item.props.value),
        }),
      )}
    </View>
  );

  if (!scrollable) return content;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 1, // token-ignore: preserves the scroll focus/indicator edge.
      }}
      style={style}
    >
      {content}
    </ScrollView>
  );
}

function TabsItem(props: TabsItemProps) {
  return <TabsItemView {...(props as InternalTabsItemProps)} />;
}

function TabsItemView({
  label,
  disabled = false,
  accessibilityLabel,
  active = false,
  appearance = 'plain',
  tone = 'neutral',
  equal = false,
  reduceMotion = false,
  onGlass = false,
  onPress,
}: InternalTabsItemProps) {
  const t = useTokens();
  const dark = t.name === 'dark';
  const glassLabel = onGlass
    ? {
        textShadowColor: dark
          ? withAlpha(t.colors.surfaceBackground, GLASS_HALO_DARK)
          : withAlpha(t.colors.surfaceElevated, GLASS_HALO_LIGHT),
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: GLASS_HALO_RADIUS,
      }
    : null;
  const [selection] = useState(() => new Animated.Value(active ? 1 : 0));
  // On glass the selected label is primary ink whatever the tone: the accent sat
  // too close in brightness to the lens it rides on, and the lens plus the
  // heavier weight already mark the selection — as on the iOS 26 control.
  const selectedColor = tone === 'accent' && !onGlass ? t.colors.accent : t.colors.textPrimary;

  useEffect(() => {
    if (reduceMotion) {
      selection.setValue(active ? 1 : 0);
      return;
    }
    Animated.timing(selection, {
      toValue: active ? 1 : 0,
      duration: t.motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [active, reduceMotion, selection, t.motion.duration.fast]);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: equal ? 1 : undefined,
        minWidth: equal ? 0 : 52,
        minHeight: t.sizing.touchTarget.minimum,
        paddingHorizontal: appearance === 'filled' ? t.spacing[4] : t.spacing[3],
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: appearance === 'filled' ? t.radii.full : 0,
        opacity: disabled ? 0.36 : pressed ? t.motion.pressed.opacity : 1,
        transform: [{ scale: pressed ? t.motion.pressed.scale : 1 }],
        overflow: 'hidden',
      })}
    >
      {appearance === 'filled' ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: t.radii.full,
            backgroundColor: tone === 'accent' ? t.colors.accent : t.colors.surfaceStrong,
            opacity: selection,
            transform: [
              {
                scale: selection.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }),
              },
            ],
          }}
        />
      ) : null}

      <Text
        numberOfLines={1}
        style={{
          color:
            active && appearance === 'filled' && tone === 'accent'
              ? t.colors.textInverse
              : active
                ? selectedColor
                : onGlass
                  ? withAlpha(t.colors.textPrimary, GLASS_LABEL_INK)
                  : // Plain has no underline/pill, so mute inactive tabs harder to keep the selected one legible.
                    appearance === 'plain'
                    ? t.colors.textTertiary
                    : t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.bodyMedium,
          fontWeight: active ? t.fontWeights.semibold : t.fontWeights.medium,
          ...glassLabel,
        }}
      >
        {label}
      </Text>

      {appearance === 'underline' ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 10,
            bottom: -1,
            left: 10,
            height: 2.5,
            borderRadius: 2,
            backgroundColor: selectedColor,
            opacity: selection,
            transform: [
              { scaleX: selection.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] }) },
            ],
          }}
        />
      ) : null}
    </Pressable>
  );
}

export const Tabs = Object.assign(TabsRoot, { Item: TabsItem });
