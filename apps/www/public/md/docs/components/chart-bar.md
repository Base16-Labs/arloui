# Chart.Bar

`Chart.Bar`

Categories side by side — grouped, stacked, or ranked as horizontal rows.

Answers “How do these compare?”

## When to use

- A handful of named categories the reader will compare against each other.
- Ranking matters more than trend — spend by category, hours by day.
- Values can be negative: bars grow below the zero rule rather than vanishing.

## Install

```bash
npx arloui add chart-bar
```

A single form does not bring the `Chart` barrel, so import the component itself:

```tsx
import { BarChart } from '@/components/ui/chart/bar-chart';
```

## Code

The default composition: bars, their category names, and the zero rule.

```tsx
<Chart.Bar data={spend} format={money} />
```

Two series, each carrying its own name.

```tsx
<Chart.Bar variant="stacked">
  <Chart.Bar.Series data={sleep} label="Sleep" />
  <Chart.Bar.Series data={activity} label="Activity" />
  <Chart.Bar.Categories />
  <Chart.Bar.Legend />
</Chart.Bar>
```

The same categories as ranked rows, with a target line.

```tsx
<Chart.Bar data={spend} layout="horizontal" format={money}>
  <Chart.Bar.Categories />
  <Chart.Bar.Values />
  <Chart.Bar.Reference value={400} label="Budget" />
</Chart.Bar>
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `data` | `readonly BarDatum[] \| readonly number[]` | — | The first series. Bars want labels, so a bare `number[]` gets index labels. Optional because `<BarChart.Series>` can supply it instead — one or the other, and a `Series` child wins. |
| `variant` | `BarChartVariant` | `'grouped'` | How the series share each category. Grouped by default. |
| `layout` | `BarChartLayout` | — | Vertical bars, or the same categories as ranked horizontal rows. |
| `spacing` | `BarChartSpacing` | `'default'` | How much air is between the marks. Vertical: how much of its slot each bar fills — the tap target stays the whole slot, so loosening the bars never shrinks what you can hit. |
| `height` | `number` | `160` | How tall the bars box is. Ignored for `layout="horizontal"`, which grows with its rows. |
| `tone` | `ChartTone` | `'brand'` | Honours `brand` (default), `series`, `auto` (colour by sign), `positive`, `negative`, and `neutral` — for a single series. With `series`, every bar takes its own palette slot and this is ignored. |
| `density` | `ChartDensity` | `'default'` | How much mark there is: stroke, corner radius, and the gap between bars. |
| `activeIndex` | `number \| null` | — | Selected category. Controlled when passed; `defaultActiveIndex` seeds the internal one. |
| `defaultActiveIndex` | `number \| null` | `null` | Which category starts selected when selection is uncontrolled. |
| `onSelect` | `(index: number, datum: BarDatum) => void` | — | Called with the tapped category's index and datum. Passing it is what makes bars tappable. |
| `format` | `(value: number) => string` | — | Formats every number the chart shows — value labels, the reference chip, the selected readout. |
| `maxValue` | `number` | — | Force the top of the scale; otherwise it comes from the data. |
| `emptyLabel` | `string` | `'No data'` | Rendered in place of the bars when `data` is empty. |
| `empty` | `ChartEmptyProps` | — | The composed empty slot — headline, one line, one action — the same one `Chart.Empty` draws. Wins over `emptyLabel`, which stays for the case where a bare string genuinely is the right answer. |
| `loading` | `boolean` | `false` | Draws grey bars at a fixed profile instead of the data. |
| `accessibilityLabel` | `string` | — | Overrides the summary read to assistive tech, which otherwise describes the series. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |

## Parts

Name one and it is drawn; name none and you get the default composition.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Bar.Series />` | `data: readonly BarDatum[] \| readonly number[]` `label: string` | One series. The first declares the categories; the rest ride on them. |
| `<Chart.Bar.Values />` | — | Prints each bar's value above it. Without it, only the selected bar shows a figure. |
| `<Chart.Bar.Categories />` | — | The category names — under the bars, or beside the rows when `layout="horizontal"`. |
| `<Chart.Bar.Baseline />` | — | The zero rule. Drawn only when the data crosses zero — an all-positive chart has its zero at the axis already. |
| `<Chart.Bar.Reference />` | `value: number` `label: string` | A labelled dashed line at a value you name — a target, a budget, an average. Adds to the zero rule rather than replacing it. |
| `<Chart.Bar.Legend />` | — | The series legend. It names each series from its `<Chart.Bar.Series label>`, so it draws nothing if none are labelled. |

## What it will not do

Stacking signed data is a category error — a part of a whole cannot be negative — so `variant="stacked"` drops negatives and warns in development. Use `variant="grouped"` for signed series.

## Related

- [Chart overview](/docs/components/chart)