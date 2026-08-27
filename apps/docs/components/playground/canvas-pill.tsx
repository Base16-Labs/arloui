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
  return (
    <View
      style={{
        width: t.spacing[20] * 2,
        height: t.sizing.buttonHeight.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 3,
        borderRadius: t.radii.full,
        borderWidth: 0.5,
        borderColor: t.colors.borderStrong,
        backgroundColor: t.colors.surfaceRaised,
        ...t.shadows.md,
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
          borderRadius: t.radii.full,
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
            fontFamily: t.fontFamilies.sans,
            ...t.typography.bodySmall,
            fontWeight: t.fontWeights.medium,
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
          borderRadius: t.radii.full,
          backgroundColor: open || pressed ? t.colors.surfaceStrong : 'transparent',
        })}
      >
        <Text
          style={{
            color: t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            ...t.typography.bodySmall,
            fontWeight: t.fontWeights.medium,
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
