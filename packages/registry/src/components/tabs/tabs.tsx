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
import { useTokens } from '../../foundation/theme-provider';
import { useReduceMotion } from '../../foundation/reduce-motion';

export type TabsAppearance = 'plain' | 'underline' | 'filled' | 'segmented';
export type TabsTone = 'neutral' | 'accent';
export type TabsLayout = 'content' | 'equal';

export type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  appearance?: TabsAppearance;
  tone?: TabsTone;
  layout?: TabsLayout;
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
  scrollable = false,
  style,
  accessibilityLabel = 'Content tabs',
}: TabsProps) {
  const t = useTokens();
  const reduceMotion = useReduceMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<TabsItemProps>[];
  const segmented = appearance === 'segmented';
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
    const segPadding = 4;
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
            backgroundColor: t.colors.surfaceStrong,
          },
          style,
        ]}
      >
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
          gap: appearance === 'filled' ? 8 : 2,
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
      contentContainerStyle={{ paddingHorizontal: 1 }}
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
        minHeight: 44,
        paddingHorizontal: appearance === 'filled' ? 16 : 12,
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
          fontWeight: active ? t.fontWeights.semibold : t.fontWeights.medium,
          fontSize: 14,
          lineHeight: 20,
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
