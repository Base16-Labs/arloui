/**
 * One page per chart form, the way the playground is laid out.
 *
 * The single Chart page had to introduce six forms at once, so each got a
 * paragraph and a code block and no room for its own props, parts, or reasons.
 * These pages carry the hand-written half — what a form is for, when to reach
 * for it, what it will not do — and pull the props and parts tables from
 * `generated/chart-props`, so the reference half cannot drift from the source.
 */

export type ChartFormDoc = {
  /** Doc slug, e.g. `chart-bar`. */
  slug: string;
  /** Sidebar label. */
  label: string;
  /**
   * What the page is called.
   *
   * Not always the export: the line chart *is* the `Chart` root, and naming the
   * page `Chart` left four surfaces disagreeing — sidebar "Plot", heading
   * "Chart", entry `chart-plot`, playground "Chart" — with "Plot" colliding
   * with `Chart.Plot`, which is a part of it rather than the whole.
   */
  title: string;
  /** Key into the generated props and parts tables, which are keyed by export. */
  referenceKey: string;
  /** Registry entry, for the install line. */
  entry: string;
  /** File the entry installs, for the standalone import. */
  file: string;
  /** The export you get when you take the form on its own. */
  exportName: string;
  /** Expo playground route. */
  route: string;
  lede: string;
  /** The question this form answers for a reader. */
  answers: string;
  whenToUse: string[];
  /** What it deliberately will not do, and what to use instead. */
  notThis: string;
  examples: { caption: string; code: string }[];
};

export const chartForms: ChartFormDoc[] = [
  {
    slug: 'chart-plot',
    label: 'Line chart',
    title: 'Line chart',
    referenceKey: 'Chart',
    entry: 'chart-plot',
    file: 'chart/chart',
    exportName: 'Chart',
    route: 'chart',
    lede:
      'One series over time, scrubbable, with a big readout above it. The money screen. The component is `Chart` itself — the root the plot family composes inside.',
    answers: '“How has this moved?”',
    whenToUse: [
      'A single series where the shape over time is the story — a balance, a price, a weight.',
      'The reader will want an exact figure at a point, which is what the scrub is for.',
      'There is room for a headline number. If there is not, you want a Sparkline.',
    ],
    notThis:
      'It draws no axes and no gridlines, and it will not. A plot with a labelled y-axis is a report, not a screen — if the reader needs to read values off an axis, give them a table.',
    examples: [
      {
        caption: 'The default composition — value, delta, plot, periods — in one line.',
        code: `<Chart
  data={points}
  format={formatMoney('USD')}
  periods={['1D', '1W', '1M', '1Y']}
  period={period}
  onPeriodChange={setPeriod}
/>`,
      },
      {
        caption: 'Name the parts to reorder or drop one, and to put furniture in the plot.',
        code: `<Chart data={points} format={formatMoney('USD')}>
  <Chart.Title>Portfolio</Chart.Title>
  <Chart.Value />
  <Chart.Delta />
  <Chart.Plot height={200} fill>
    <Chart.Crosshair />
    <Chart.Reference value={1000} label="Target" />
  </Chart.Plot>
  <Chart.Periods />
</Chart>`,
      },
      {
        caption: 'A second quantity that shares the x-axis — volume behind price.',
        code: `<Chart data={price} format={money}>
  <Chart.Value />
  <Chart.Plot>
    <Chart.Bars data={volume} />
    <Chart.Line data={forecast} label="Forecast" dashed />
    <Chart.Crosshair />
  </Chart.Plot>
</Chart>`,
      },
    ],
  },
  {
    slug: 'chart-bar',
    label: 'Bar',
    title: 'Chart.Bar',
    referenceKey: 'Chart.Bar',
    entry: 'chart-bar',
    file: 'chart/bar-chart',
    exportName: 'BarChart',
    route: 'chart/bar',
    lede: 'Categories side by side — grouped, stacked, or ranked as horizontal rows.',
    answers: '“How do these compare?”',
    whenToUse: [
      'A handful of named categories the reader will compare against each other.',
      'Ranking matters more than trend — spend by category, hours by day.',
      'Values can be negative: bars grow below the zero rule rather than vanishing.',
    ],
    notThis:
      'Stacking signed data is a category error — a part of a whole cannot be negative — so `variant="stacked"` drops negatives and warns in development. Use `variant="grouped"` for signed series.',
    examples: [
      {
        caption: 'The default composition: bars, their category names, and the zero rule.',
        code: `<Chart.Bar data={spend} format={money} />`,
      },
      {
        caption: 'Two series, each carrying its own name.',
        code: `<Chart.Bar variant="stacked">
  <Chart.Bar.Series data={sleep} label="Sleep" />
  <Chart.Bar.Series data={activity} label="Activity" />
  <Chart.Bar.Categories />
  <Chart.Bar.Legend />
</Chart.Bar>`,
      },
      {
        caption: 'The same categories as ranked rows, with a target line.',
        code: `<Chart.Bar data={spend} layout="horizontal" format={money}>
  <Chart.Bar.Categories />
  <Chart.Bar.Values />
  <Chart.Bar.Reference value={400} label="Budget" />
</Chart.Bar>`,
      },
    ],
  },
  {
    slug: 'chart-sparkline',
    label: 'Sparkline',
    title: 'Chart.Sparkline',
    referenceKey: 'Chart.Sparkline',
    entry: 'chart-sparkline',
    file: 'chart/sparkline',
    exportName: 'Sparkline',
    route: 'chart/sparkline',
    lede: 'A chrome-free inline line for list rows and stat cards. No axes, no scrub, tinted by direction.',
    answers: '“Which way is this going?”',
    whenToUse: [
      'The mark sits beside text that already says what the number is.',
      'There are many of them on one screen — a table of twenty rows, each with its own trend.',
      'Direction is the whole message; an exact value at a point is not needed.',
    ],
    notThis:
      'It has no scrub and no readout by design. Twenty scrubbable charts in a list is twenty gesture handlers competing with the list’s own scroll — if a row needs a readout, it needs a Chart.',
    examples: [
      {
        caption: 'The bare mark, sized to its slot.',
        code: `<Chart.Sparkline data={prices} width={80} height={28} />`,
      },
      {
        caption: 'With a wash, an end dot, and the high and low called out.',
        code: `<Chart.Sparkline data={prices} width={120} format={money}>
  <Chart.Sparkline.Fill />
  <Chart.Sparkline.EndDot />
  <Chart.Sparkline.Extremes />
</Chart.Sparkline>`,
      },
    ],
  },
  {
    slug: 'chart-donut',
    label: 'Donut',
    title: 'Chart.Donut',
    referenceKey: 'Chart.Donut',
    entry: 'chart-donut',
    file: 'chart/donut-chart',
    exportName: 'DonutChart',
    route: 'chart/donut',
    lede: 'Parts of one whole. Four named slices, then everything else folds into a neutral Other.',
    answers: '“What is this made of?”',
    whenToUse: [
      'The parts genuinely sum to a meaningful whole — a budget, a portfolio, a day.',
      'There are few enough categories to name. Past four, the tail is Other.',
      'The total belongs in the middle, where the hole already is.',
    ],
    notThis:
      'It will not draw more than five arcs, whatever `maxSlices` says: the categorical palette has four validated slots and the fifth arc is Other. More than that and a bar chart reads better anyway.',
    examples: [
      {
        caption: 'The default composition: the ring, the total, and a legend.',
        code: `<Chart.Donut data={breakdown} format={money} />`,
      },
      {
        caption: 'Name the parts to caption the middle, or to drop the legend.',
        code: `<Chart.Donut data={breakdown} format={money} thickness={32}>
  <Chart.Donut.Value />
  <Chart.Donut.Label>Monthly spend</Chart.Donut.Label>
</Chart.Donut>`,
      },
    ],
  },
  {
    slug: 'chart-meter',
    label: 'Meter',
    title: 'Chart.Meter',
    referenceKey: 'Chart.Meter',
    entry: 'chart-meter',
    file: 'chart/meter',
    exportName: 'Meter',
    route: 'chart/meter',
    lede: 'One value against a target, as a bar, a ring, or an arc gauge.',
    answers: '“How close am I?”',
    whenToUse: [
      'There is a single number and a ceiling it is measured against — storage, budget, a goal.',
      'Crossing a threshold should change how it reads, which is what `warnAt` and `dangerAt` are for.',
      'Several related quantities share one ceiling: give each a Ring.',
    ],
    notThis:
      'It is not a progress bar for an operation in flight — that is a Progress component’s job. A meter is a standing quantity you could read at any moment, not something that finishes.',
    examples: [
      {
        caption: 'The default composition: the track and its readout.',
        code: `<Chart.Meter value={88} max={100} warnAt={0.75} dangerAt={0.9} />`,
      },
      {
        caption: 'An arc gauge, captioned.',
        code: `<Chart.Meter shape="arc" value={712} min={300} max={850}>
  <Chart.Meter.Value />
  <Chart.Meter.Label>Credit score</Chart.Meter.Label>
</Chart.Meter>`,
      },
      {
        caption: 'Concentric rings — one ceiling, several quantities.',
        code: `<Chart.Meter shape="ring" value={70} max={100}>
  <Chart.Meter.Label>Storage</Chart.Meter.Label>
  <Chart.Meter.Ring value={70} label="Used" />
  <Chart.Meter.Ring value={40} label="Backups" />
</Chart.Meter>`,
      },
    ],
  },
  {
    slug: 'chart-heatmap',
    label: 'Heatmap',
    title: 'Chart.Heatmap',
    referenceKey: 'Chart.Heatmap',
    entry: 'chart-heatmap',
    file: 'chart/heatmap',
    exportName: 'Heatmap',
    route: 'chart/heatmap',
    lede: 'A calendar streak grid: days as filled and empty squares, read week across and weekday down.',
    answers: '“Did I show up?”',
    whenToUse: [
      'Consistency over time is the story — streaks, habits, contributions.',
      'The unit is a day and the span is weeks or months.',
      'An empty square is data: it means nothing happened, not that nothing is known.',
    ],
    notThis:
      'It is a calendar grid, not a matrix heatmap — there is no arbitrary x against y. And because empty days are the data, it only shows an empty state when it has no data *and* no date range to draw.',
    examples: [
      {
        caption: 'The default composition: the grid, its weekday gutter, and the key.',
        code: `<Chart.Heatmap data={days} onSelect={setDay} />`,
      },
      {
        caption: 'A fixed month, with the key dropped.',
        code: `<Chart.Heatmap data={days} from="2026-03-01" to="2026-03-31" levels={5}>
  <Chart.Heatmap.DayLabels />
</Chart.Heatmap>`,
      },
    ],
  },
];

export const chartFormBySlug = new Map(chartForms.map((form) => [form.slug, form]));

/**
 * The calls people get wrong when choosing a form.
 *
 * Shared by the rendered page and the markdown. They had drifted into saying
 * different things about the same decision — the page still called the line
 * chart "Chart" long after the rest of the docs stopped — which is what one
 * hand-written section per output always ends in.
 */
export const chartPitfalls: { rule: string; body: string }[] = [
  {
    rule: 'A number, not a chart, when there is one number.',
    body: 'A meter or a bare `Chart.Value` says more than a line chart with two points in it.',
  },
  {
    rule: 'Line chart for a sequence, bar for a set.',
    body: 'If the order of the points is the story, it is a line; if they could be shuffled without losing anything, they are categories and want bars.',
  },
  {
    rule: 'Sparkline over line chart in a row.',
    body: "If the mark is smaller than the text beside it, it is a sparkline — there is no room for a scrub or a readout, and twenty scrubbable charts in a list fight the list's own scroll.",
  },
  {
    rule: 'Bar over donut past four categories.',
    body: 'A ring holds four slices and an `Other`; a fifth is a bar chart wearing the wrong shape.',
  },
  {
    rule: 'Heatmap only for dates.',
    body: 'Its x-axis is always a calendar. A matrix of two categorical axes is a different chart and is not in the kit.',
  },
];

/** The question each form answers, for the choosing table. Derived, not restated. */
export const chartChoices = chartForms.map((form) => ({
  question: form.answers.replace(/[“”]/g, ''),
  // The sidebar label, not the namespace path: this table is for picking a
  // form, and `Chart.Sparkline` is the answer to "how do I write it", not to
  // "which one do I want".
  form: form.label,
  slug: form.slug,
}));
