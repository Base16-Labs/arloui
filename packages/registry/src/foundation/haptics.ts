import { Platform } from 'react-native';

type Strength = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

/**
 * Thin haptics wrapper that no-ops when `expo-haptics` is not installed and
 * matches platform expectations: iOS gets the rich impact APIs, Android gets a
 * single short impulse, web gets nothing.
 *
 * `expo-haptics` is an optional peer dependency — components stay usable
 * without it. Always call this helper rather than importing expo-haptics
 * directly so haptics remain optional.
 */
export async function haptic(strength: Strength = 'light'): Promise<void> {
  if (!isIOS && !isAndroid) return;
  try {
    const mod = await import('expo-haptics').catch(() => null);
    if (!mod) return;
    // `return await` (not a bare `return`) so a rejected haptics promise is
    // caught here and swallowed — haptics are non-critical and must never throw.
    switch (strength) {
      case 'light':
        return await mod.impactAsync(mod.ImpactFeedbackStyle.Light);
      case 'medium':
        return await mod.impactAsync(mod.ImpactFeedbackStyle.Medium);
      case 'heavy':
        return await mod.impactAsync(mod.ImpactFeedbackStyle.Heavy);
      case 'selection':
        return await mod.selectionAsync();
      case 'success':
        return await mod.notificationAsync(mod.NotificationFeedbackType.Success);
      case 'warning':
        return await mod.notificationAsync(mod.NotificationFeedbackType.Warning);
      case 'error':
        return await mod.notificationAsync(mod.NotificationFeedbackType.Error);
    }
  } catch {
    // swallowed — haptics are non-critical
  }
}
