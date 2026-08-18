/**
 * Every chart form is reached through the `Chart` namespace — `Chart.Sparkline`,
 * `Chart.Bar`, `Chart.Donut`, `Chart.Meter` — so only the props types are named
 * separately here. The components themselves stay exported from their own files
 * for anyone who copied a single form into their project.
 *
 * `core` is exported too. Arlo ships five forms and no more — candlestick, radar,
 * population pyramid, scatter, 3-D, heatmap, and stacked or grouped bars are
 * consumer-owned — so the scale and the path builders the five are drawn with are
 * public. A sixth form written against them measures the same way these do.
 */
export {
  Chart,
  type ChartPlotProps,
  type ChartProps,
} from './chart';
export {
  annulusPath,
  areaPath,
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
export { type BarChartProps, type BarDatum } from './bar-chart';
export { type DonutChartProps, type DonutSlice } from './donut-chart';
export { type MeterProps, type MeterShape } from './meter';
