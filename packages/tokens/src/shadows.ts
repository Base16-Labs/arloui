/**
 * Arlo UI shadow tokens (React Native iOS/Android). Use sparingly — depth comes from spacing first.
 *
 * Spec uses grey-900 `#101828`; iOS applies `shadowOpacity` × that color. Android approximates depth
 * with `elevation` only (tint matches Material defaults, not the Figma hex).
 */
import { Platform } from 'react-native';
import { shadowBaseColor, shadowLevels } from './shadowSpec';

type Shadow = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
};

function make(level: { offsetY: number; blur: number; opacity: number }, elevation: number): Shadow {
  return {
    shadowColor: shadowBaseColor,
    shadowOpacity: Platform.OS === 'ios' ? level.opacity : 0,
    shadowRadius: level.blur,
    shadowOffset: { width: 0, height: level.offsetY },
    elevation,
  };
}

export const shadows = {
  none: make({ offsetY: 0, blur: 0, opacity: 0 }, 0),
  sm: make(shadowLevels.sm, 2),
  md: make(shadowLevels.md, 4),
  lg: make(shadowLevels.lg, 8),
  xl: make(shadowLevels.xl, 12),
} as const;

export type ShadowTokens = typeof shadows;
export type ShadowScale = keyof ShadowTokens;
