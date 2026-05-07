import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';
export const isNative = isIOS || isAndroid;

/**
 * Pick a value per platform without verbose ternaries.
 *
 *   const padding = pick({ ios: 12, android: 14, default: 12 });
 */
export function pick<T>(values: { ios?: T; android?: T; web?: T; default: T }): T {
  if (isIOS && values.ios !== undefined) return values.ios;
  if (isAndroid && values.android !== undefined) return values.android;
  if (isWeb && values.web !== undefined) return values.web;
  return values.default;
}
