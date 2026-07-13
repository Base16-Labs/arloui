import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useTokens } from '@arloui/registry';

export function VariantControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text
        style={{
          width: 64,
          color: '#A1A1AA',
          fontFamily: 'Manrope SemiBold',
          fontSize: 10,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 7, paddingRight: 18 }}
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
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const t = useTokens();
  const dark = t.name === 'dark';
  const activeBg = dark ? '#FAFAFA' : '#18181B';
  const activeFg = dark ? '#18181B' : '#FAFAFA';
  const inactiveBg = dark ? '#303033' : '#F4F4F5';
  const inactiveFg = dark ? '#F4F4F5' : '#52525B';
  const inactiveBorder = dark ? '#52525B' : '#E4E4E7';

  function feedback(toValue: number) {
    Animated.timing(scale, {
      toValue,
      duration: 45,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      onPressIn={() => feedback(0.96)}
      onPressOut={() => feedback(1)}
    >
      <Animated.View
        style={{
          minHeight: 34,
          justifyContent: 'center',
          paddingHorizontal: 14,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? activeBg : inactiveBorder,
          backgroundColor: active ? activeBg : inactiveBg,
          transform: [{ scale }],
        }}
      >
        <Text
          style={{
            color: active ? activeFg : inactiveFg,
            fontFamily: active ? 'Manrope SemiBold' : 'Manrope Medium',
            fontSize: 13,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
