/**
 * Figma **Main palette** — Base, Grey, Primary, Success, Warning, Error (50–950).
 * Source: Main Palette frame. Primary 950 matches Grey 950 per Figma (#09090B).
 */
export const base = {
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const grey = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DC',
  400: '#99A1AF',
  500: '#6A7282',
  600: '#4A5565',
  700: '#364153',
  800: '#1E2939',
  900: '#101828',
  950: '#09090B',
} as const;

export const primary = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BEDBFF',
  300: '#8EC5FF',
  400: '#51A2FF',
  500: '#2B7FFF',
  600: '#155DFC',
  700: '#1447E6',
  800: '#193CB8',
  900: '#1C398E',
  950: '#09090B',
} as const;

export const success = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#B9F8CF',
  300: '#7BF1A8',
  400: '#05DF72',
  500: '#00C950',
  600: '#00A63E',
  700: '#008236',
  800: '#016630',
  900: '#0D542B',
  950: '#032E15',
} as const;

export const warning = {
  50: '#FFFBEB',
  100: '#FEF3C6',
  200: '#FEE685',
  300: '#FFD230',
  400: '#FFB900',
  500: '#FE9A00',
  600: '#E17100',
  700: '#BB4D00',
  800: '#973C00',
  900: '#7B3306',
  950: '#461901',
} as const;

export const error = {
  50: '#FEF2F2',
  100: '#FFE2E2',
  200: '#FFC9C9',
  300: '#FFA2A2',
  400: '#FF6467',
  500: '#FB2C36',
  600: '#E7000B',
  700: '#C10007',
  800: '#9F0712',
  900: '#82181A',
  950: '#460809',
} as const;

export const paletteMain = {
  base,
  grey,
  primary,
  success,
  warning,
  error,
} as const;

export type PaletteShade = keyof typeof grey;
