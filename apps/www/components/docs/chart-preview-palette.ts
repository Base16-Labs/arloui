/**
 * The doc previews are static SVG rather than the real components, so they can't
 * read the theme at runtime the way `useTokens` does. Pulling the values from
 * `@arloui/tokens` instead of hardcoding hexes keeps the previews honest — the
 * palette shown on the page is the palette the component ships.
 *
 * Light-mode values: the preview frames sit on `bg-canvas`, which is the light
 * surface in both themes.
 *
 * Imported through `lib/color-tokens`, not the `@arloui/tokens` barrel — the
 * barrel pulls in `shadows.ts`, which imports `Platform` from `react-native`,
 * and Next cannot parse React Native's Flow-typed entry point. `@arloui/tokens/semantic`
 * exists precisely to hand the web the colours without that dependency.
 */
import { lightSemanticColors } from '@/lib/color-tokens';

export const chartPositive = lightSemanticColors.chartPositive;
export const chartNegative = lightSemanticColors.chartNegative;
export const chartOther = lightSemanticColors.chartOther;

/** The categorical ramp, in the order the donut and bar charts assign it. */
export const CHART_SERIES = [
  lightSemanticColors.chartSeries1,
  lightSemanticColors.chartSeries2,
  lightSemanticColors.chartSeries3,
  lightSemanticColors.chartSeries4,
] as const;
