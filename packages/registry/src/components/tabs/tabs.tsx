import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type TabsAppearance = 'plain' | 'underline' | 'filled';
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
  const [reduceMotion, setReduceMotion] = useState(false);
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<TabsItemProps>[];
  const equal = layout === 'equal' && !scrollable;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => active && setReduceMotion(enabled));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

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
  const selection = useRef(new Animated.Value(active ? 1 : 0)).current;
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
                : t.colors.textSecondary,
          fontFamily: active ? 'Manrope SemiBold' : 'Manrope Medium',
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
