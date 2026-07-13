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
export { darkShadows, shadows, type ShadowTokens, type ShadowScale } from './shadows';
export {
  blur,
  blurs,
  materials,
  type BlurTokens,
  type MaterialTokens,
} from './effects';
export {
  darkShadowBaseColor,
  darkShadowLevels,
  darkShadowsMeta,
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
import { fontFamilies, fontWeights, typography } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { sizing } from './sizing';
import { motion } from './motion';
import { darkShadows, shadows } from './shadows';
import { blur, blurs, materials } from './effects';

export const themes = {
  dark: {
    name: 'dark' as const,
    colors: darkColors,
    fontFamilies,
    fontWeights,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows: darkShadows,
    blur,
    blurs,
    materials,
    focusRing: focusRingByScheme.dark,
  },
  light: {
    name: 'light' as const,
    colors: lightColors,
    fontFamilies,
    fontWeights,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    blur,
    blurs,
    materials,
    focusRing: focusRingByScheme.light,
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];
