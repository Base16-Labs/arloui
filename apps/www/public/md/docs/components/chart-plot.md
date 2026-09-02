# Line chart

`Chart`

One series over time, scrubbable, with a big readout above it. The money screen. The component is `Chart` itself — the root the plot family composes inside.

Answers “How has this moved?”

## When to use

- A single series where the shape over time is the story — a balance, a price, a weight.
- The reader will want an exact figure at a point, which is what the scrub is for.
- There is room for a headline number. If there is not, you want a Sparkline.

## Install

```bash
npx arloui add chart-plot
```

A single form does not bring the `Chart` barrel, so import the component itself:

```tsx
import { Chart } from '@/components/ui/chart/chart';
```

## Code

The default composition — value, delta, plot, periods — in one line.

```tsx
<Chart
  data={points}
  format={formatMoney('USD')}
  periods={['1D', '1W', '1M', '1Y']}
  period={period}
  onPeriodChange={setPeriod}
/>
```

Name the parts to reorder or drop one, and to put furniture in the plot.

```tsx
<Chart data={points} format={formatMoney('USD')}>
  <Chart.Title>Portfolio</Chart.Title>
  <Chart.Value />
  <Chart.Delta />
  <Chart.Plot height={200} fill>
    <Chart.Crosshair />
    <Chart.Reference value={1000} label="Target" />
  </Chart.Plot>
  <Chart.Periods />
</Chart>
```

A second quantity that shares the x-axis — volume behind price.

```tsx
<Chart data={price} format={money}>
  <Chart.Value />
  <Chart.Plot>
    <Chart.Bars data={volume} />
    <Chart.Line data={forecast} label="Forecast" dashed />
    <Chart.Crosshair />
  </Chart.Plot>
</Chart>
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
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
| `loading` | `boolean` | `false` | Renders the plot's silhouette as a shimmer instead of the series. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |

## Parts

Name one and it is drawn; name none and you get the default composition.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Bars />` | `data: ChartData` `color: string` `opacity: number` | A bar mark inside a plot. The combo chart: volume behind price, rainfall behind temperature — a second quantity that shares the x-axis and wants a different shape. |
| `<Chart.Line />` | `data: ChartData` `color: string` `dashed: boolean` `label: string` | An *additional* line — a second, third, nth series on the same scale. |
| `<Chart.Baseline />` | — | The zero rule, drawn across the plot at the baseline value. |
| `<Chart.Reference />` | `value: number` `label: string` | A labelled dashed line at a value you name. Repeat it for several — a min and a max, say. |
| `<Chart.Crosshair />` | — | The scrub crosshair — the vertical rule and the dot that follow a finger. |
| `<Chart.Title />` | — | The chart's name, above the readout. |
| `<Chart.Value />` | — | The headline number — the scrubbed point's value, or the last one when nothing is being scrubbed. Rolls between values rather than snapping. |
| `<Chart.Delta />` | — | Change from the baseline to the shown point. Always renders an explicit sign — that sign is what keeps direction readable when the two tones are hard to tell apart, so don't strip it. |
| `<Chart.Plot />` | `height: number` `fill: boolean` `curve: ChartCurve` `compare: ChartData` `range: ChartRange` `children: ReactNode` `stack: readonly ChartData[]` `tooltip: boolean` `emptyLabel: string` `notEnoughLabel: string` `accessibilityLabel: string` `style: StyleProp<ViewStyle>` | The mark itself — the line, and whatever else is named inside it. |
| `<Chart.Periods />` | — | The range selector — `1D`, `1W`, `1M` and so on. |
| `<Chart.Empty />` | — | What the plot draws when the series is empty. |
| `<Chart.Legend />` | `items: readonly ChartLegendItem[]` `style: StyleProp<ViewStyle>` | A row of named swatches. Shared by every form that can show more than one series, so a legend reads the same under a plot as it does under a donut. |

## What it will not do

It draws no axes and no gridlines, and it will not. A plot with a labelled y-axis is a report, not a screen — if the reader needs to read values off an axis, give them a table.

## Related

- [Chart overview](/docs/components/chart)