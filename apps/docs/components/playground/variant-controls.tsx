import type { ReactNode } from 'react';
import { useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useTokens } from '@arloui/registry';

export function VariantControlRow({ label, children }: { label: string; children: ReactNode }) {
  const t = useTokens();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] }}>
      <Text
        style={{
          width: t.spacing[16],
          color: t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.overline,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: t.spacing[2], paddingRight: t.spacing[5] }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function VariantChip({
  label,
  active,
  onPress,
  /**
   * For a choice the current configuration cannot honour — `tone` under a
   * multi-series bar chart, where every bar takes a palette slot instead. The
   * chip stays visible because the option is real; it just cannot apply here,
   * and a control that silently does nothing is the thing worth avoiding.
   */
  disabled = false,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const [scale] = useState(() => new Animated.Value(1));
  const t = useTokens();
  const activeBg = t.colors.textPrimary;
  const activeFg = t.colors.textInverse;
  const inactiveBg = t.colors.surfaceStrong;
  const inactiveFg = t.colors.textSecondary;
  const inactiveBorder = t.colors.borderStrong;

  function feedback(toValue: number) {
    Animated.timing(scale, {
      toValue,
      duration: t.motion.duration.instant,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => feedback(0.96)}
      onPressOut={() => feedback(1)}
    >
      <Animated.View
        style={{
          minHeight: t.sizing.buttonHeight.sm,
          justifyContent: 'center',
          paddingHorizontal: t.spacing[4],
          borderRadius: t.radii.full,
          borderWidth: 1,
          borderColor: active ? activeBg : inactiveBorder,
          backgroundColor: active ? activeBg : inactiveBg,
          opacity: disabled ? 0.38 : 1,
          transform: [{ scale }],
        }}
      >
        <Text
          style={{
            color: active ? activeFg : inactiveFg,
            fontFamily: t.fontFamilies.sans,
            ...t.typography.bodyMedium,
            fontWeight: active ? t.fontWeights.semibold : t.fontWeights.medium,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
