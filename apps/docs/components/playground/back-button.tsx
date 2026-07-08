import { OutlineArrowLeft } from '@arloui/icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useTokens } from '@arloui/registry';

/** Round back affordance for playground screens — returns to the component list. */
export function BackButton() {
  const router = useRouter();
  const t = useTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to components"
      hitSlop={8}
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }}
      style={({ pressed }) => ({
        width: 28,
        height: 28,
        borderRadius: t.radii.full,
        borderWidth: 1,
        borderColor: t.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? t.colors.surfaceStrong : t.colors.surfaceRaised,
      })}
    >
      <OutlineArrowLeft width={16} height={16} color={t.colors.textPrimary} />
    </Pressable>
  );
}
