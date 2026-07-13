import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useTheme, useTokens } from '@arloui/registry';

/** Light / dark pill — same pattern as www docs `BottomPill`. */
export function ThemeToggle() {
  const { theme, setName } = useTheme();
  const t = useTokens();
  const isDark = theme.name === 'dark';
  const isLight = theme.name === 'light';

  const trackBg = isDark ? 'rgba(250,250,250,0.06)' : '#f4f4f5';
  const activeBg = isDark ? '#FAFAFA' : '#18181B';
  const activeIcon = isDark ? '#18181B' : '#FAFAFA';
  const activeShadow = isLight
    ? {
        shadowColor: '#18181b',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }
    : {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: 72,
        height: 28,
        borderRadius: t.radii.full,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: trackBg,
        padding: 2,
        gap: 4,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Use dark mode"
        accessibilityState={{ selected: isDark }}
        onPress={() => setName('dark')}
        style={[
          {
            flex: 1,
            height: '100%',
            borderRadius: t.radii.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? activeBg : 'transparent',
          },
          isDark ? activeShadow : undefined,
        ]}
      >
        <Ionicons
          name="moon"
          size={12}
          color={isDark ? activeIcon : t.colors.textTertiary}
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Use light mode"
        accessibilityState={{ selected: isLight }}
        onPress={() => setName('light')}
        style={[
          {
            flex: 1,
            height: '100%',
            borderRadius: t.radii.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isLight ? activeBg : 'transparent',
          },
          isLight ? activeShadow : undefined,
        ]}
      >
        <Ionicons
          name="sunny"
          size={12}
          color={isLight ? activeIcon : t.colors.textTertiary}
        />
      </Pressable>
    </View>
  );
}
