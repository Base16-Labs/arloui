/**
 * Sparkline is the inline chart form — a metric tile pairs it with a value. Other
 * forms (Plot, Bar, Donut, Meter) are not on this branch.
 */
export { Sparkline, type SparklineProps } from './sparkline';
export {
  densityMetrics,
  seriesStats,
  toPoints,
  toneColor,
  type ChartCurve,
  type ChartData,
  type ChartDensity,
  type ChartPoint,
  type ChartTone,
} from './core';
export { formatMoney, formatNumber, formatPercent } from './format';
