/**
 * Figma shadow scale — grey-900 `#101828` at named opacities in light, black in
 * dark. Shared by runtime RN shadows (`shadows.ts`) and JSON skill export
 * (`raw.ts`).
 *
 * Dark is black rather than grey-900 because a shadow has to be darker than the
 * surface it falls on, and grey-900 (`rgb(16, 24, 40)`) is *lighter* than the
 * dark background (`#09090B`) — it would lift the edge instead of seating it.
 * The dark opacities are correspondingly higher, since black on near-black has
 * less room to read.
 */

export const shadowBaseColor = '#101828';
export const darkShadowBaseColor = '#000000';

/**
 * A CSS colour from one of the base colours above.
 *
 * Derived rather than written out: the dark strings used to be hardcoded while
 * the light ones were generated, so the dark base colour and the CSS it was
 * supposed to produce could disagree — and they did, for every level.
 */
function rgba(hex: string, opacity: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const shadowLevels = {
  sm: { offsetY: 0, blur: 2, opacity: 0.06 },
  md: { offsetY: 1, blur: 6, opacity: 0.08 },
  lg: { offsetY: 2, blur: 12, opacity: 0.1 },
  xl: { offsetY: 4, blur: 28, opacity: 0.12 },
} as const;

export const darkShadowLevels = {
  sm: { offsetY: 0, blur: 2, opacity: 0.18 },
  md: { offsetY: 1, blur: 6, opacity: 0.22 },
  lg: { offsetY: 2, blur: 12, opacity: 0.28 },
  xl: { offsetY: 4, blur: 28, opacity: 0.34 },
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
    css: `0 ${shadowLevels.sm.offsetY}px ${shadowLevels.sm.blur}px ${rgba(shadowBaseColor, shadowLevels.sm.opacity)}`,
  },
  md: {
    ...shadowLevels.md,
    color: shadowBaseColor,
    css: `0 ${shadowLevels.md.offsetY}px ${shadowLevels.md.blur}px ${rgba(shadowBaseColor, shadowLevels.md.opacity)}`,
  },
  lg: {
    ...shadowLevels.lg,
    color: shadowBaseColor,
    css: `0 ${shadowLevels.lg.offsetY}px ${shadowLevels.lg.blur}px ${rgba(shadowBaseColor, shadowLevels.lg.opacity)}`,
  },
  xl: {
    ...shadowLevels.xl,
    color: shadowBaseColor,
    css: `0 ${shadowLevels.xl.offsetY}px ${shadowLevels.xl.blur}px ${rgba(shadowBaseColor, shadowLevels.xl.opacity)}`,
  },
} as const;

export const darkShadowsMeta = {
  none: {
    offsetY: 0,
    blur: 0,
    opacity: 0,
    color: darkShadowBaseColor,
    css: 'none',
  },
  sm: {
    ...darkShadowLevels.sm,
    color: darkShadowBaseColor,
    css: `0 ${darkShadowLevels.sm.offsetY}px ${darkShadowLevels.sm.blur}px ${rgba(darkShadowBaseColor, darkShadowLevels.sm.opacity)}`,
  },
  md: {
    ...darkShadowLevels.md,
    color: darkShadowBaseColor,
    css: `0 ${darkShadowLevels.md.offsetY}px ${darkShadowLevels.md.blur}px ${rgba(darkShadowBaseColor, darkShadowLevels.md.opacity)}`,
  },
  lg: {
    ...darkShadowLevels.lg,
    color: darkShadowBaseColor,
    css: `0 ${darkShadowLevels.lg.offsetY}px ${darkShadowLevels.lg.blur}px ${rgba(darkShadowBaseColor, darkShadowLevels.lg.opacity)}`,
  },
  xl: {
    ...darkShadowLevels.xl,
    color: darkShadowBaseColor,
    css: `0 ${darkShadowLevels.xl.offsetY}px ${darkShadowLevels.xl.blur}px ${rgba(darkShadowBaseColor, darkShadowLevels.xl.opacity)}`,
  },
} as const;

export type ShadowsMeta = typeof shadowsMeta;
