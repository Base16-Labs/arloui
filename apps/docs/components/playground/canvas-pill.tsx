import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTokens } from '@arloui/registry';

export function CanvasPill({
  componentName,
  onComponentPress,
  onMenuPress,
  open,
}: {
  componentName: string;
  onComponentPress: () => void;
  onMenuPress: () => void;
  open: boolean;
}) {
  const t = useTokens();
  const dark = t.name === 'dark';

  return (
    <View
      style={{
        width: 160,
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 3,
        borderRadius: 999,
        borderWidth: 0.5,
        borderColor: dark ? '#3F3F46' : '#E4E4E7',
        backgroundColor: dark ? '#27272A' : '#FAFAFA',
        shadowColor: '#000000',
        shadowOpacity: dark ? 0.22 : 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Return to components"
        onPress={onComponentPress}
        style={({ pressed }) => ({
          height: 26,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          paddingHorizontal: 7,
          borderRadius: 999,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: t.colors.accent,
          }}
        />
        <Text
          style={{
            color: t.colors.textPrimary,
            fontFamily: 'Manrope Medium',
            fontSize: 12,
          }}
        >
          {componentName}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? 'Close variant menu' : 'Open variant menu'}
        onPress={onMenuPress}
        style={({ pressed }) => ({
          height: 26,
          minWidth: 58,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          paddingHorizontal: 8,
          borderRadius: 999,
          backgroundColor: open || pressed ? (dark ? '#3F3F46' : '#F4F4F5') : 'transparent',
        })}
      >
        <Text
          style={{
            color: t.colors.textPrimary,
            fontFamily: 'Manrope Medium',
            fontSize: 12,
          }}
        >
          Menu
        </Text>
        <View style={{ gap: 0 }}>
          <Ionicons
            name="chevron-up"
            size={8}
            color={t.colors.textSecondary}
            style={{ marginBottom: -2 }}
          />
          <Ionicons name="chevron-down" size={8} color={t.colors.textSecondary} />
        </View>
      </Pressable>
    </View>
  );
}
