export {
  alphaRamp,
  darkColors,
  darkSemanticColors,
  lightColors,
  lightSemanticColors,
  palette,
  paletteMain,
  paletteSecondary,
  rgbaFromHex,
  type ColorTokenName,
  type ColorTokens,
  type SemanticColorTokens,
} from './colors';
export {
  fontFamilies,
  fontWeights,
  typography,
  type TypographyTokens,
  type TypographyVariant,
} from './typography';
export { spacing, type SpacingTokens, type SpacingScale } from './spacing';
export { radii, type RadiusTokens, type RadiusScale } from './radii';
export { sizing, type SizingTokens } from './sizing';
export { motion, type MotionTokens } from './motion';
export { shadows, type ShadowTokens, type ShadowScale } from './shadows';
export {
  shadowBaseColor,
  shadowLevels,
  shadowsMeta,
  type ShadowsMeta,
} from './shadowSpec';
export {
  focusRingBoxShadow,
  focusRingByScheme,
  type FocusRingScheme,
} from './focusRing';

import { darkColors, lightColors } from './colors';
import { focusRingByScheme } from './focusRing';
import { fontFamilies, typography } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { sizing } from './sizing';
import { motion } from './motion';
import { shadows } from './shadows';

export const themes = {
  dark: {
    name: 'dark' as const,
    colors: darkColors,
    fontFamilies,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    focusRing: focusRingByScheme.dark,
  },
  light: {
    name: 'light' as const,
    colors: lightColors,
    fontFamilies,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    focusRing: focusRingByScheme.light,
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];
