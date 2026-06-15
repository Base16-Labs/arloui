/**
 * Raw token export — JSON-serializable snapshot for the skill, registry tooling, and CI.
 */
import { darkColors, darkSemanticColors, lightColors, lightSemanticColors } from './colors';
import { fontFamilies, fontWeights, typography } from './typography';
import { motion } from './motion';
import { blur, blurs, materials } from './effects';
import { paletteMain } from './paletteMain';
import { alphaRamp, paletteSecondary } from './paletteSecondary';
import { focusRingByScheme } from './focusRing';
import { radii } from './radii';
import { darkShadowsMeta, shadowsMeta } from './shadowSpec';
import { sizing } from './sizing';
import { spacing } from './spacing';

export const raw = {
  $schema: 'https://arloui.dev/schemas/tokens-v1.json',
  version: '0.3.1',
  color: {
    paletteMain,
    paletteSecondary,
    alphaRamp,
    semantic: { light: lightSemanticColors, dark: darkSemanticColors },
    light: lightColors,
    dark: darkColors,
  },
  typography: {
    fontFamilies,
    fontWeights,
    scale: typography,
  },
  spacing,
  radii,
  sizing,
  motion,
  shadows: shadowsMeta,
  shadowsByScheme: { light: shadowsMeta, dark: darkShadowsMeta },
  blur,
  blurs,
  materials,
  focusRing: focusRingByScheme,
} as const;

export type RawTokens = typeof raw;
