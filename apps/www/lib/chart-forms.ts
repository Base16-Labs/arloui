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
  motion: string;
  /** The question this form answers for a reader. */
  answers: string;
  whenToUse: string[];
  /** What it deliberately will not do, and what to use instead. */
  notThis: string;
  examples: { caption: string; code: string }[];
};

export const chartForms: ChartFormDoc[] = [
  {
    slug: 'chart-line',
    motion: 'The plot reveals from left to right over 400 ms, with the area fill following the stroke. Baselines, labels, and reference lines stay still. Changing periods morphs the main series over 280 ms. Scrubbing follows your finger immediately.',
    label: 'Line chart',
    title: 'Line chart',
    referenceKey: 'LineChart',
    entry: 'chart-line',
    file: 'chart/chart',
    exportName: 'LineChart',
    route: 'chart',
    lede:
      'Display changes over time. Users can drag across the chart to inspect individual values and select a period to view a different date range.',
    answers: '“How has this moved?”',
    whenToUse: [
      'Show how a balance, price, weight, or other measurement changes over time.',
      'Let users drag across the chart to read the value at a specific point.',
      'Use when there is space for a value readout and period selector. Use Sparkline for a compact trend beside a metric.',
    ],
    notThis:
      'This chart does not include axis labels or gridlines. Values are shown in the readout when users interact with the chart. Provide a data table when users need to compare many exact values at once.',
    examples: [
      {
        caption: 'Display the current value, change from the baseline, chart, and period selector.',
        code: `import { useState } from 'react';
import { LineChart } from '@/components/ui/chart/chart';
import { formatMoney } from '@/components/ui/chart/format';

const periods = ['1D', '1W', '1M', '1Y'];
const series = [
  [912, 946, 934, 995, 1031],
  [860, 912, 946, 1031, 1094],
  [720, 860, 912, 1094, 1156],
  [520, 720, 860, 1031, 1156],
];
const money = formatMoney('USD');

export default function ChartExample() {
  const [period, setPeriod] = useState('1D');
  const points = series[periods.indexOf(period)] ?? series[0];

  return (
    <LineChart
      data={points}
      format={money}
      periods={periods}
      period={period}
      onPeriodChange={setPeriod}
    />
  );
}`,
      },
      {
        caption: 'Add child components to customize the layout. This example includes a title, value, change, and target line.',
        code: `import { LineChart } from '@/components/ui/chart/chart';
import { formatMoney } from '@/components/ui/chart/format';

const points = [912, 946, 934, 995, 1031];
const money = formatMoney('USD');

export default function ChartExample() {
  return (
    <LineChart data={points} format={money}>
      <LineChart.Title>Portfolio</LineChart.Title>
      <LineChart.Value />
      <LineChart.Delta />
      <LineChart.Plot height={200} fill>
        <LineChart.Crosshair />
        <LineChart.Reference value={1000} label="Target" />
      </LineChart.Plot>
    </LineChart>
  );
}`,
      },
      {
        caption: 'Overlay volume bars and a forecast line on the same time range.',
        code: `import { LineChart } from '@/components/ui/chart/chart';
import { formatMoney } from '@/components/ui/chart/format';

const price = [912, 946, 934, 995, 1031];
const volume = [120, 180, 90, 210, 160];
const forecast = [920, 940, 960, 1000, 1050];
const money = formatMoney('USD');

export default function ChartExample() {
  return (
    <LineChart data={price} format={money}>
      <LineChart.Value />
      <LineChart.Plot>
        <LineChart.Bars data={volume} />
        <LineChart.Line data={forecast} label="Forecast" dashed />
        <LineChart.Crosshair />
      </LineChart.Plot>
    </LineChart>
  );
}`,
      },
    ],
  },
  {
    slug: 'chart-bar',
    motion: 'Bars fade into place over 200 ms when data first appears. Vertical bars also fade on dataset changes. Their lengths do not grow from zero, so the animation does not imply changing values.',
    label: 'Bar',
    title: 'Bar',
    referenceKey: 'Chart.Bar',
    entry: 'chart-bar',
    file: 'chart/bar-chart',
    exportName: 'BarChart',
    route: 'chart/bar',
    lede: 'Compare values across categories using vertical or horizontal bars. Group series side by side or stack them to show a combined total.',
    answers: '“How do these compare?”',
    whenToUse: [
      'Compare values across named categories, such as spending by category.',
      'Use horizontal bars when category names are long. Sort the data before passing it in to display a ranking.',
      'Show positive and negative values on opposite sides of the zero baseline.',
    ],
    notThis:
      'Stacked bars support non-negative values only. Negative values are excluded and produce a development warning. Use grouped bars for data containing negative values.',
    examples: [
      {
        caption: 'Display a single series with category labels and a zero baseline when values cross zero.',
        code: `import { BarChart } from '@/components/ui/chart/bar-chart';
import { formatMoney } from '@/components/ui/chart/format';

const spend = [
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
  { label: 'Utilities', value: 180 },
];
const money = formatMoney('USD');

export default function ChartExample() {
  return (
    <BarChart data={spend} format={money} />
  );
}`,
      },
      {
        caption: 'Stack two named series and display their category labels and legend.',
        code: `import { BarChart } from '@/components/ui/chart/bar-chart';

const sleep = [{ label: 'Mon', value: 7 }, { label: 'Tue', value: 8 }];
const activity = [3, 5];

export default function ChartExample() {
  return (
    <BarChart variant="stacked">
      <BarChart.Series data={sleep} label="Sleep" />
      <BarChart.Series data={activity} label="Activity" />
      <BarChart.Categories />
      <BarChart.Legend />
    </BarChart>
  );
}`,
      },
      {
        caption: 'Display horizontal bars with value labels and a budget reference line.',
        code: `import { BarChart } from '@/components/ui/chart/bar-chart';
import { formatMoney } from '@/components/ui/chart/format';

const spend = [
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
  { label: 'Utilities', value: 180 },
];
const money = formatMoney('USD');

export default function ChartExample() {
  return (
    <BarChart data={spend} layout="horizontal" format={money}>
      <BarChart.Categories />
      <BarChart.Values />
      <BarChart.Reference value={400} label="Budget" />
    </BarChart>
  );
}`,
      },
    ],
  },
  {
    slug: 'chart-sparkline',
    motion: 'The trend reveals from left to right over 400 ms, with the optional area fill following the stroke. Subsequent data changes are immediate. For dense lists of small trends, disable motion to keep scanning quiet.',
    label: 'Sparkline',
    title: 'Sparkline',
    referenceKey: 'Chart.Sparkline',
    entry: 'chart-sparkline',
    file: 'chart/sparkline',
    exportName: 'Sparkline',
    route: 'chart/sparkline',
    lede: 'Show a compact trend beside a metric in a list row, table, or summary card. Sparklines do not include axes or touch-based value inspection.',
    answers: '“Which way is this going?”',
    whenToUse: [
      'Add a trend beside an existing metric label and value.',
      'Compare trends across multiple list rows without adding a full chart to each row.',
      'Use when users need to see the overall trend rather than inspect individual points.',
    ],
    notThis:
      'Sparkline does not support dragging to inspect values or a selected-value readout. Use Line chart when users need those interactions.',
    examples: [
      {
        caption: 'Render a compact trend with an explicit width and height.',
        code: `import { Sparkline } from '@/components/ui/chart/sparkline';

const prices = [912, 946, 934, 995, 1031];

export default function ChartExample() {
  return (
    <Sparkline data={prices} width={80} height={28} />
  );
}`,
      },
      {
        caption: 'Add an area fill, an endpoint marker, and high and low value labels.',
        code: `import { Sparkline } from '@/components/ui/chart/sparkline';
import { formatMoney } from '@/components/ui/chart/format';

const prices = [912, 946, 934, 995, 1031];
const money = formatMoney('USD');

export default function ChartExample() {
  return (
    <Sparkline data={prices} width={120} height={56} format={money}>
      <Sparkline.Fill />
      <Sparkline.EndDot />
      <Sparkline.Extremes />
    </Sparkline>
  );
}`,
      },
    ],
  },
  {
    slug: 'chart-donut',
    motion: 'The ring draws clockwise from the top over 400 ms when data first appears. Each slice keeps its final proportion and colour. The centre value and legend remain readable throughout. Selecting a slice does not replay the entrance.',
    label: 'Donut',
    title: 'Donut',
    referenceKey: 'Chart.Donut',
    entry: 'chart-donut',
    file: 'chart/donut-chart',
    exportName: 'DonutChart',
    route: 'chart/donut',
    lede: 'Show how categories contribute to a total. Display up to four named categories, with additional categories combined into Other.',
    answers: '“What is this made of?”',
    whenToUse: [
      'Show proportions of a total, such as a spending breakdown or portfolio allocation.',
      'Use for a small set of categories. Additional categories are combined into Other.',
      'Display the total in the center and category values in the legend.',
    ],
    notThis:
      'The chart supports at most five slices, including Other. Setting maxSlices above five does not increase this limit. Use Bar when each category needs to remain individually visible.',
    examples: [
      {
        caption: 'Display category proportions with a center total and legend.',
        code: `import { DonutChart } from '@/components/ui/chart/donut-chart';
import { formatMoney } from '@/components/ui/chart/format';

const breakdown = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
];
const money = formatMoney('USD');

export default function ChartExample() {
  return (
    <DonutChart data={breakdown} format={money} />
  );
}`,
      },
      {
        caption: 'Customize the ring width and center label. This example omits the legend.',
        code: `import { DonutChart } from '@/components/ui/chart/donut-chart';
import { formatMoney } from '@/components/ui/chart/format';

const breakdown = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
];
const money = formatMoney('USD');

export default function ChartExample() {
  return (
    <DonutChart data={breakdown} format={money} thickness={32}>
      <DonutChart.Value />
      <DonutChart.Label>Monthly spend</DonutChart.Label>
    </DonutChart>
  );
}`,
      },
    ],
  },
  {
    slug: 'chart-meter',
    motion: 'The fill animates from zero to the supplied value on mount, then moves to each new value using the slow duration token. The percentage readout follows the fill. Additional rings animate to their own values.',
    label: 'Meter',
    title: 'Meter',
    referenceKey: 'Chart.Meter',
    entry: 'chart-meter',
    file: 'chart/meter',
    exportName: 'Meter',
    route: 'chart/meter',
    lede: 'Display a value within a defined range using a bar, ring, or arc. Optional thresholds change the color at warning and danger levels.',
    answers: '“How close am I?”',
    whenToUse: [
      'Show a measurement relative to a limit, such as storage used or a budget spent.',
      'Use warnAt and dangerAt to change the color when the value crosses a threshold.',
      'Add Ring children to compare related measurements as concentric rings.',
    ],
    notThis:
      'Meter displays a known value within a range. It does not represent an operation with an unknown duration; use a loading indicator for that state.',
    examples: [
      {
        caption: 'Display a value with warning and danger thresholds, expressed as fractions of the range.',
        code: `import { Meter } from '@/components/ui/chart/meter';

export default function ChartExample() {
  return (
    <Meter value={88} max={100} warnAt={0.75} dangerAt={0.9} />
  );
}`,
      },
      {
        caption: 'Display a credit score within a custom range using an arc and label.',
        code: `import { Meter } from '@/components/ui/chart/meter';

export default function ChartExample() {
  return (
    <Meter shape="arc" value={712} min={300} max={850}>
      <Meter.Value />
      <Meter.Label>Credit score</Meter.Label>
    </Meter>
  );
}`,
      },
      {
        caption: 'Display related measurements as concentric rings.',
        code: `import { Meter } from '@/components/ui/chart/meter';

export default function ChartExample() {
  return (
    <Meter shape="ring" value={70} max={100}>
      <Meter.Label>Storage</Meter.Label>
      <Meter.Ring value={70} label="Used" />
      <Meter.Ring value={40} label="Backups" />
    </Meter>
  );
}`,
      },
    ],
  },
  {
    slug: 'chart-heatmap',
    motion: 'The calendar fades in as one layer over 200 ms when data first appears. Cells do not animate individually: their colours represent activity, not progress. Selection and data changes are immediate.',
    label: 'Heatmap',
    title: 'Heatmap',
    referenceKey: 'Chart.Heatmap',
    entry: 'chart-heatmap',
    file: 'chart/heatmap',
    exportName: 'Heatmap',
    route: 'chart/heatmap',
    lede: 'Display daily activity in a calendar grid. Color intensity represents the value for each day.',
    answers: '“Did I show up?”',
    whenToUse: [
      'Show activity patterns for habits, contributions, or daily usage.',
      'Use for daily data spanning several weeks or months.',
      'Use zero for days with no activity. Missing dates within the displayed range also appear as inactive days.',
    ],
    notThis:
      'This component supports calendar dates, not arbitrary row and column categories. The empty state appears only when both the data and an explicit date range are absent.',
    examples: [
      {
        caption: 'Display daily activity with weekday labels and an intensity legend.',
        code: `import { Heatmap } from '@/components/ui/chart/heatmap';

const days = [
  { date: '2026-03-02', value: 2 },
  { date: '2026-03-03', value: 5 },
  { date: '2026-03-04', value: 3 },
];

export default function ChartExample() {
  return (
    <Heatmap data={days} />
  );
}`,
      },
      {
        caption: 'Display a fixed month with weekday labels and no intensity legend.',
        code: `import { Heatmap } from '@/components/ui/chart/heatmap';

const days = [
  { date: '2026-03-02', value: 2 },
  { date: '2026-03-03', value: 5 },
  { date: '2026-03-04', value: 3 },
];

export default function ChartExample() {
  return (
    <Heatmap data={days} from="2026-03-01" to="2026-03-31" levels={5}>
      <Heatmap.DayLabels />
    </Heatmap>
  );
}`,
      },
    ],
  },
];

export const chartFormBySlug = new Map(chartForms.map((form) => [form.slug, form]));

/** The overview and its Markdown share the same installation example. */
export const chartQuickStart = {
  intro: 'Install only the chart you need. The CLI copies editable source files into your project; it does not install npm dependencies automatically.',
  command: 'npx arloui init\nnpx arloui add chart-line',
  dependencies: 'For Expo projects, use Expo to select compatible native dependencies. Reanimated and Worklets are required even when chart motion is disabled. Check the compatibility guide before using an older React Native project.',
  expoCommand: 'npx expo install react-native-svg react-native-reanimated react-native-worklets expo-haptics',
  exampleIntro: 'After setting up the theme provider, render a line chart with a value formatter. These import paths match the default arlo.json aliases.',
  example: `import { LineChart } from '@/components/ui/chart/chart';
import { formatMoney } from '@/components/ui/chart/format';

const points = [912, 946, 934, 995, 1031, 1094, 1156];
const money = formatMoney('USD');

export default function BalanceChart() {
  return <LineChart data={points} format={money} />;
}`,
  family: 'Use npx arloui add chart to install all six types and the Chart namespace. Individual chart pages list their standalone installation commands, data requirements, and APIs.',
};

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
    rule: 'Use a numeric readout for a single value.',
    body: 'Use Meter when the value has a target or limit. Use a text readout when there is no series or range to display.',
  },
  {
    rule: 'Use Line chart for trends and Bar for category comparisons.',
    body: 'Line chart shows changes across an ordered sequence. Bar compares values across distinct categories.',
  },
  {
    rule: 'Use Sparkline for compact trends.',
    body: "Use Sparkline beside a metric in a list or table. Use Line chart when users need to inspect individual values.",
  },
  {
    rule: 'Use Bar when all categories need individual labels.',
    body: 'Donut combines categories beyond its slice limit into Other. Bar keeps each category visible.',
  },
  {
    rule: 'Use Heatmap for daily activity.',
    body: 'The calendar heatmap does not support an arbitrary matrix of categories.',
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
