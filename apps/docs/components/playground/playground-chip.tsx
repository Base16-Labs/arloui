import { Pressable, Text } from 'react-native';
import { useTokens } from '@arloui/registry';

type PlaygroundChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function PlaygroundChip({ label, active, onPress }: PlaygroundChipProps) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: t.spacing[3],
        paddingVertical: t.spacing[2],
        borderRadius: t.radii.full,
        borderWidth: 1,
        borderColor: active ? t.colors.textPrimary : t.colors.border,
        backgroundColor: active ? t.colors.textPrimary : t.colors.surface,
      }}
    >
      <Text
        style={{
          color: active ? t.colors.bg : t.colors.textPrimary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.bodySmall,
          fontWeight: t.fontWeights.semibold,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
