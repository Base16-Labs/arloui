/**
 * Figma shadow scale — grey-900 `#101828` at named opacities.
 * Shared by runtime RN shadows (`shadows.ts`) and JSON skill export (`raw.ts`).
 */

export const shadowBaseColor = '#101828';

const R = 16;
const G = 24;
const B = 40;

function rgba(opacity: number): string {
  return `rgba(${R}, ${G}, ${B}, ${opacity})`;
}

export const shadowLevels = {
  sm: { offsetY: 0, blur: 2, opacity: 0.06 },
  md: { offsetY: 1, blur: 6, opacity: 0.08 },
  lg: { offsetY: 2, blur: 12, opacity: 0.1 },
  xl: { offsetY: 4, blur: 28, opacity: 0.12 },
} as const;

export const shadowsMeta = {
  none: {
    offsetY: 0,
    blur: 0,
    opacity: 0,
    color: shadowBaseColor,
    css: 'none',
  },
  sm: {
    ...shadowLevels.sm,
    color: shadowBaseColor,
    css: `0 ${shadowLevels.sm.offsetY}px ${shadowLevels.sm.blur}px ${rgba(shadowLevels.sm.opacity)}`,
  },
  md: {
    ...shadowLevels.md,
    color: shadowBaseColor,
    css: `0 ${shadowLevels.md.offsetY}px ${shadowLevels.md.blur}px ${rgba(shadowLevels.md.opacity)}`,
  },
  lg: {
    ...shadowLevels.lg,
    color: shadowBaseColor,
    css: `0 ${shadowLevels.lg.offsetY}px ${shadowLevels.lg.blur}px ${rgba(shadowLevels.lg.opacity)}`,
  },
  xl: {
    ...shadowLevels.xl,
    color: shadowBaseColor,
    css: `0 ${shadowLevels.xl.offsetY}px ${shadowLevels.xl.blur}px ${rgba(shadowLevels.xl.opacity)}`,
  },
} as const;

export type ShadowsMeta = typeof shadowsMeta;
