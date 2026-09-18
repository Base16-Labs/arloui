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
import { GlassBackdrop, useGlassSurface } from '../../foundation/glass';
import { useTokens } from '../../foundation/theme-provider';
import { useReduceMotion } from '../../foundation/reduce-motion';

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
  onPress?: () => void;
};

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


  useEffect(() => {
    if (!segmented) return;
    if (reduceMotion) {
      selection.setValue(activeIndex);
      return;
    }
    Animated.spring(selection, {
      toValue: activeIndex,
      ...t.motion.spring.snappy,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, reduceMotion, segmented, selection, t.motion.spring.snappy]);

  if (segmented) {
    const segPadding = t.spacing[1];
    const thumbWidth = items.length > 0 ? Math.max(0, (trackWidth - segPadding * 2) / items.length) : 0;
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
            overflow: isGlass ? 'hidden' : undefined,
            // GlassBackdrop paints the well. A fill here would stack under it.
            backgroundColor: isGlass ? 'transparent' : t.colors.surfaceStrong,
            borderWidth: isGlass ? glass.borderWidth : 0,
            borderColor: isGlass ? glass.borderColor : undefined,
          },
          style,
        ]}
      >
        {isGlass ? (
          <GlassBackdrop material="small" borderRadius={t.radii.full}>
            {blurComponent}
          </GlassBackdrop>
        ) : null}
        {trackWidth > 0 && thumbWidth > 0 ? (
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
              t.shadows.sm as ViewStyle,
            ]}
          />
        ) : null}
        {items.map((item) =>
          cloneElement(item as ReactElement<InternalTabsItemProps>, {
            key: item.props.value,
            active: item.props.value === value,
            appearance,
            tone,
            equal: true,
            reduceMotion,
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
  onPress,
}: InternalTabsItemProps) {
  const t = useTokens();
  const [selection] = useState(() => new Animated.Value(active ? 1 : 0));
  const selectedColor = tone === 'accent' ? t.colors.accent : t.colors.textPrimary;

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
                : // Plain has no underline/pill, so mute inactive tabs harder to keep the selected one legible.
                  appearance === 'plain'
                  ? t.colors.textTertiary
                  : t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.bodyMedium,
          fontWeight: active ? t.fontWeights.semibold : t.fontWeights.medium,
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
