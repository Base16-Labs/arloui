/**
 * Arlo UI — BarChart
 *
 * Categorical magnitude: spend per day, sessions per channel. Bars are the right
 * form when the categories are discrete and the comparison is "which is bigger" —
 * use `Chart` instead when the x-axis is continuous time.
 *
 *   <Chart.Bar data={[{ label: 'M', value: 32 }, { label: 'T', value: 18 }]} />
 *
 * One chart, three prop families rather than three components:
 *
 *   <Chart.Bar data={sleep} series={[activity]} variant="grouped" legend={['Sleep', 'Activity']} />
 *   <Chart.Bar data={private_} series={[state]} variant="stacked" legend={['Private', 'State']} />
 *   <Chart.Bar data={spend} layout="horizontal" format={money} />
 *
 * Deliberate choices:
 *
 * - **Data-ends are rounded, the baseline end is not.** A bar is anchored to its
 *   axis; rounding the anchored end would lift it off and misreport where zero is.
 *   A stacked pile rounds only at its top — the interior joins are part of the
 *   same bar, not bars of their own.
 * - **Negatives drop below the baseline** rather than being drawn as magnitudes,
 *   and the baseline moves to wherever zero falls. A stacked bar is part-to-total,
 *   so negatives clamp to zero there — a negative share of a whole is not a thing.
 * - **One hue per series.** A single-series bar chart is magnitude, not identity,
 *   so it does not spend the categorical palette; `tone` steers it. The moment a
 *   second series arrives identity is the story, so every series takes its
 *   validated palette slot and `tone` is ignored.
 * - **Selection instead of hover.** Tapping a category reports it and shows its
 *   value; there is no hover on a touch screen. The categories not selected fade
 *   to a light tint of their own colours rather than dropping out, so the shape
 *   of the whole series survives while one category is being read.
 * - **Bars never scale.** A bar's height *is* its datum, so a bar that grows from
 *   zero is animating the number. On a data change they cross-fade in place
 *   (`motion.chart.barSwap`) — the documented exception to the rule that things
 *   entering scale up.
 * - **Layout is a prop, not a form.** `layout="horizontal"` draws the same
 *   categories as ranked rows — label, track, value — for any ranked breakdown.
 *   It renders the first series; ranking two series at once is a table's job.
 *
 * Each category is its own `Pressable`, sized by the same slot arithmetic that
 * places the mark, so the tap target and the rectangle are the same box by
 * construction rather than by agreement with a library's private layout.
 */
import type { ReactNode } from 'react';
import { type ChartReference } from './core';
import { allParts, collectParts, hasPart, partProps } from './hooks';
import { HorizontalBars } from './bar-horizontal';
import { VerticalBars } from './bar-vertical';
import type { BarChartProps, BarChartResolved, BarDatum, BarSeries } from './bar-shared';

export type {
  BarChartProps,
  BarChartLayout,
  BarChartSpacing,
  BarChartVariant,
  BarDatum,
  BarSeries,
} from './bar-shared';

/** One series. The first declares the categories; the rest ride on them. */
export type BarSeriesProps = {
  data: readonly BarDatum[] | readonly number[];
  /** Names the series in the legend and to screen readers. */
  label?: string;
};
function BarSeriesPart(_: BarSeriesProps): ReactNode {
  return null;
}

/** A labelled dashed line at a value you name — a target, a budget, an average. Adds to the zero rule rather than replacing it. */
export type BarReferenceProps = ChartReference;
function BarReferencePart(_: BarReferenceProps): ReactNode {
  return null;
}

/** Prints each bar's value above it. Without it, only the selected bar shows a figure. */
function BarValuesPart(): ReactNode {
  return null;
}

/** The category names — under the bars, or beside the rows when `layout="horizontal"`. */
function BarCategoriesPart(): ReactNode {
  return null;
}

/** The zero rule. Drawn only when the data crosses zero — an all-positive chart has its zero at the axis already. */
function BarBaselinePart(): ReactNode {
  return null;
}

/** The series legend. It names each series from its `<Chart.Bar.Series label>`, so it draws nothing if none are labelled. */
function BarLegendPart(): ReactNode {
  return null;
}

/**
 * Fold the declared parts down into the props the renderers already take.
 *
 * With no children this returns the props untouched, so every existing call
 * site keeps its behaviour to the pixel. With children the defaults invert:
 * nothing is drawn unless it was named. That asymmetry is the whole point —
 * in the prop form `showLabels` defaults on and `chrome` defaults to
 * `baseline`, which is convenient but means the call site never states what it
 * is getting. In the composed form the tree is the statement.
 */
function resolveComposition(props: BarChartProps): BarChartResolved {
  const { children, ...rest } = props;
  // The one-liner still works: no children is the documented default
  // composition — category labels and the zero rule — rather than a read of
  // props that no longer exist.
  /*
   * `undefined`, not `== null`: an absent `children` is "give me the defaults",
   * while an explicit `{null}` is "I named nothing, draw nothing". Without the
   * distinction there is no way to ask for a bare mark — no zero rule, no
   * labels — short of an empty fragment, which reads like a mistake.
   */
  if (children === undefined) return { ...rest, data: rest.data ?? [], showLabels: true, chrome: 'baseline' };

  const parts = collectParts(children);
  const declared = allParts<BarSeriesProps>(parts, BarSeriesPart);
  const reference = partProps<ChartReference>(parts, BarReferencePart);
  const showValues = hasPart(parts, BarValuesPart);
  const showLabels = hasPart(parts, BarCategoriesPart);
  const baseline = hasPart(parts, BarBaselinePart);
  const legendOn = hasPart(parts, BarLegendPart);

  // Series children replace `series`/`legend` outright. Two index-coupled
  // arrays were the thing that most wanted composing: `legend[1]` naming
  // `series[0]` because `data` was series zero is a mistake the tree cannot
  // express.
  const data = declared[0]?.data ?? rest.data ?? [];
  const series = declared.slice(1).map((d) => d.data as BarSeries);
  const names = declared.map((d) => d.label).filter((l): l is string => l != null);

  return {
    ...rest,
    data,
    series,
    legend: legendOn && names.length > 0 ? names : undefined,
    showValues,
    showLabels,
    // `reference` adds to the zero rule rather than replacing it, exactly as the
    // enum did — naming a reference line does not silently drop the baseline.
    chrome: reference != null ? 'reference' : baseline ? 'baseline' : 'none',
    reference,
  };
}

function BarChartRoot(props: BarChartProps) {
  // Resolved once, here, so both renderers stay unaware that a composed form
  // exists — they keep taking the same props they always took.
  const resolved = resolveComposition(props);
  const { layout = 'vertical' } = resolved;
  return layout === 'horizontal' ? <HorizontalBars {...resolved} /> : <VerticalBars {...resolved} />;
}

/** The parts, for `Chart.Bar.Values` and friends. */
export const BarChartParts = {
  Series: BarSeriesPart,
  Values: BarValuesPart,
  Categories: BarCategoriesPart,
  Baseline: BarBaselinePart,
  Reference: BarReferencePart,
  Legend: BarLegendPart,
};

export const BarChart = Object.assign(BarChartRoot, BarChartParts);
