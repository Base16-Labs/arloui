/**
 * Every chart form is reached through the `Chart` namespace — `Chart.Sparkline`,
 * `Chart.Bar`, `Chart.Donut`, `Chart.Meter`, `Chart.Heatmap` — so only the props
 * types are named separately here. The components themselves stay exported from
 * their own files for anyone who copied a single form into their project.
 *
 * `core` is exported too. Arlo ships six forms and no more — candlestick, radar,
 * population pyramid, scatter, and 3-D are consumer-owned — so the scale and the
 * path builders the six are drawn with are public. A seventh form written against
 * them measures the same way these do.
 */
// The plot half is already assembled in `chart.tsx`, so a standalone
// `chart-plot` install gets the same `Chart` the examples use. This adds the
// other five forms to that same object.
import { Chart as ChartBase } from './chart';
import { BarChart } from './bar-chart';
import { DonutChart } from './donut-chart';
import { Heatmap } from './heatmap';
import { Meter } from './meter';
import { Sparkline } from './sparkline';

export {
  LineChart,
  type ChartEmptyProps,
  type ChartPlotProps,
  type ChartProps,
  type ChartRange,
} from './chart';

/**
 * The namespace, assembled here rather than in `chart.tsx`.
 *
 * This file is the one place that legitimately depends on every form — it is the
 * barrel. Building the namespace inside `chart.tsx` made the *plot* depend on
 * them too, which is why the registry could only ever ship charts as one
 * thirteen-file lump. Installing `chart-bar` on its own now pulls the bar chart
 * and the shared core, and nothing else.
 */
export const Chart = Object.assign(ChartBase, {
  Sparkline,
  Bar: BarChart,
  Donut: DonutChart,
  Meter,
  Heatmap,
});
export {
  annulusPath,
  arcLength,
  arcPath,
  areaPath,
  bandPath,
  barPath,
  densityMetrics,
  interpolateSeries,
  linePath,
  makeScale,
  resample,
  seriesColorAt,
  seriesPalette,
  seriesStats,
  toPoints,
  toneColor,
  valuesOf,
  type ChartChrome,
  type ChartCurve,
  type ChartData,
  type ChartDensity,
  type ChartPoint,
  type ChartReference,
  type ChartTone,
  type DensityMetrics,
  type Scale,
  type SeriesStats,
} from './core';
export { useControllableIndex, useReduceMotion } from './hooks';
export { formatMoney, formatNumber, formatPercent } from './format';
export { type SparklineProps } from './sparkline';
export {
  type BarChartLayout,
  type BarChartProps,
  type BarChartSpacing,
  type BarChartVariant,
  type BarDatum,
  type BarSeries,
} from './bar-chart';
export { type DonutChartProps, type DonutSlice } from './donut-chart';
export { EmptyContent } from './empty';
export { type MeterProps, type MeterRing, type MeterShape } from './meter';
export { type HeatmapDatum, type HeatmapProps } from './heatmap';
export { type ChartLegendItem, type ChartLegendProps } from './legend';
