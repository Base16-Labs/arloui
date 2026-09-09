# Line chart

`LineChart`

Display changes over time. Users can drag across the chart to inspect individual values and select a period to view a different date range.

## When to use

- Show how a balance, price, weight, or other measurement changes over time.
- Let users drag across the chart to read the value at a specific point.
- Use when there is space for a value readout and period selector. Use Sparkline for a compact trend beside a metric.

## Install

```bash
npx arloui add chart-line
```

Import the component directly when installing this chart on its own:

```tsx
import { LineChart } from '@/components/ui/chart/chart';
```

## Examples

These examples use LineChart. The old `chart-plot` command and `Chart` export remain supported. Use `npx arloui add chart` to install the entire chart family.

Display the current value, change from the baseline, chart, and period selector.

```tsx
import { useState } from 'react';
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
}
```

Add child components to customize the layout. This example includes a title, value, change, and target line.

```tsx
import { LineChart } from '@/components/ui/chart/chart';
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
}
```

Overlay volume bars and a forecast line on the same time range.

```tsx
import { LineChart } from '@/components/ui/chart/chart';
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
}
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
| `data` **·** required | `ChartData` | — | The series, oldest first. Bare numbers, or points carrying a time and a label. |
| `tone` | `ChartTone` | `'auto'` | `'auto'` tones by whether the series ended above or below `baseline`. Force it when the series' own direction isn't the story — e.g. spending, where "up" is bad. |
| `baseline` | `number` | — | Reference value for tone and for the dashed baseline. Defaults to the first point. |
| `density` | `ChartDensity` | `'default'` | Stroke, dot, and label weight. `'compact'` drops labels for inline use. |
| `format` | `(value: number) => string` | — | Formats every value in the subtree — readout, delta, reference label. |
| `formatAt` | `(at: ChartPoint['at'], point: ChartPoint) => string` | — | Formats a point's `at` for `Chart.Value`, so the readout can say *when*. |
| `periods` | `string[]` | `[]` | The period selector's options, e.g. `["1D", "1W", "1M"]`. Passing them is what makes `Chart.Periods` render anything. |
| `period` | `string` | — | The selected period. Controlled — pair it with `onPeriodChange`. |
| `onPeriodChange` | `(period: string) => void` | — | Called with the period a tap selected. The chart does not refetch; you swap `data`. |
| `activeIndex` | `number \| null` | — | Controlled scrub position. Leave undefined to let the chart hold it. |
| `activeAt` | `number \| string \| Date \| null` | — | Scrub position as an x-*value* rather than an index. `activeIndex` is an index into this chart's own series, so two charts sharing one only line up if their points line up — same length, same order… |
| `defaultActiveIndex` | `number \| null` | `null` | Where the scrub starts when it is uncontrolled. `null` means "show the last point". |
| `onScrub` | `(index: number \| null, point: ChartPoint \| null) => void` | — | Fires on every scrub change, controlled or not. `null` on release. |
| `loading` | `boolean` | `false` | Reserves the plot with a neutral pulsing placeholder until data is ready. |
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |

## Parts

Without children, the chart uses its default layout. Add child components to choose which optional elements to include. The table lists each component and its available props.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<LineChart.Bars />` | `data: ChartData` `color: string` `opacity: number` | A bar mark inside a plot. The combo chart: volume behind price, rainfall behind temperature — a second quantity that shares the x-axis and wants a different shape. |
| `<LineChart.Line />` | `data: ChartData` `color: string` `dashed: boolean` `label: string` | An *additional* line — a second, third, nth series on the same scale. |
| `<LineChart.Baseline />` | — | The zero rule, drawn across the plot at the baseline value. |
| `<LineChart.Reference />` | `value: number` `label: string` | A labelled dashed line at a value you name. Repeat it for several — a min and a max, say. |
| `<LineChart.Crosshair />` | — | The scrub crosshair — the vertical rule and the dot that follow a finger. |
| `<LineChart.Title />` | — | The chart's name, above the readout. |
| `<LineChart.Value />` | — | The headline number — the scrubbed point's value, or the last one when nothing is being scrubbed. Rolls between values rather than snapping. |
| `<LineChart.Delta />` | — | Change from the baseline to the shown point. Always renders an explicit sign — that sign is what keeps direction readable when the two tones are hard to tell apart, so don't strip it. |
| `<LineChart.Plot />` | `height: number` `fill: boolean` `curve: ChartCurve` `compare: ChartData` `range: ChartRange` `children: ReactNode` `stack: readonly ChartData[]` `stackColors: readonly string[]` `tooltip: boolean` `emptyLabel: string` `notEnoughLabel: string` `accessibilityLabel: string` `style: StyleProp<ViewStyle>` | The mark itself — the line, and whatever else is named inside it. |
| `<LineChart.Periods />` | — | The range selector — `1D`, `1W`, `1M` and so on. |
| `<LineChart.Empty />` | — | What the plot draws when the series is empty. |
| `<LineChart.Legend />` | `items: readonly ChartLegendItem[]` `style: StyleProp<ViewStyle>` | A row of named swatches. Shared by every form that can show more than one series, so a legend reads the same under a plot as it does under a donut. |

## Motion

The plot reveals from left to right over 400 ms, with the area fill following the stroke. Baselines, labels, and reference lines stay still. Changing periods morphs the main series over 280 ms. Scrubbing follows your finger immediately.

Motion is enabled by default. Set `animated={false}` to disable entrances, transitions, and loading pulse. Device Reduce Motion takes precedence. Loading shows a neutral pulsing placeholder that fades out before entry. For background fetches, pass `refreshing` and keep supplying the last successful data; the chart stays visible and exposes its busy state. Entry runs once when real data becomes available, including after loading or an empty state. It does not loop.

Use the playground Motion controls to switch animation on or off. Tap On again to replay the entrance.

```tsx
<LineChart data={data} animated={false} />
```

## Limitations

This chart does not include axis labels or gridlines. Values are shown in the readout when users interact with the chart. Provide a data table when users need to compare many exact values at once.

## Related

- [Chart overview](/docs/components/chart)