/**
 * Figma focus rings — two solid spreads (no blur): `surface-background` then semantic ring color.
 * Values are CSS `box-shadow` strings for web / documentation; RN inputs typically use borders.
 */
import { darkSemanticColors, lightSemanticColors } from './colors';

export function focusRingBoxShadow(surfaceBg: string, ringColor: string): string {
  return `0 0 0 2px ${surfaceBg}, 0 0 0 4px ${ringColor}`;
}

export const focusRingByScheme = {
  light: {
    main: focusRingBoxShadow(lightSemanticColors.surfaceBackground, lightSemanticColors.focusRingMain),
    error: focusRingBoxShadow(lightSemanticColors.surfaceBackground, lightSemanticColors.focusRingError),
  },
  dark: {
    main: focusRingBoxShadow(darkSemanticColors.surfaceBackground, darkSemanticColors.focusRingMain),
    error: focusRingBoxShadow(darkSemanticColors.surfaceBackground, darkSemanticColors.focusRingError),
  },
} as const;

export type FocusRingScheme = (typeof focusRingByScheme)[keyof typeof focusRingByScheme];
