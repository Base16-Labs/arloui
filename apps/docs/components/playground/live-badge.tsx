import { Text, View } from 'react-native';
import { useTokens } from '@arloui/registry';

export function LiveBadge() {
  const t = useTokens();

  return (
    <View
      style={{
        height: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingHorizontal: 11,
        borderRadius: t.radii.full,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surfaceRaised,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: t.colors.feedbackSuccess,
        }}
      />
      <Text
        style={{
          color: t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.overline,
        }}
      >
        LIVE
      </Text>
    </View>
  );
}
