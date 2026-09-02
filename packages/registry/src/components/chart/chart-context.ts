/**
 * Arlo UI — Chart context
 *
 * What `Chart` hands its parts: the measured series, the scrub position, and
 * the formatting they all have to agree on.
 *
 * Its own file so the parts can read it without importing `chart.tsx`, which
 * imports them back to build its default composition.
 */
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ChartChrome, ChartDensity, ChartPoint, ChartReference } from './core';

export type ChartContextValue = {
  points: ChartPoint[];
  values: number[];
  /** Index under the finger, or `null` when nothing is being scrubbed. */
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  /** The point the readout should show: the scrubbed one, else the last. */
  displayIndex: number;
  color: string;
  baseline: number;
  first: number;
  last: number;
  min: number;
  max: number;
  span: number;
  density: ChartDensity;
  format?: (value: number) => string;
  formatAt?: (at: ChartPoint['at'], point: ChartPoint) => string;
  loading: boolean;
  empty?: ReactNode;
  periods: string[];
  period?: string;
  onPeriodChange?: (period: string) => void;
};

export const ChartContext = createContext<ChartContextValue | null>(null);

export function useChart(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('Chart.* must be rendered inside <Chart>');
  return ctx;
}

