# Bar

`Chart.Bar`

Compare values across categories using vertical or horizontal bars. Group series side by side or stack them to show a combined total.

## When to use

- Compare values across named categories, such as spending by category.
- Use horizontal bars when category names are long. Sort the data before passing it in to display a ranking.
- Show positive and negative values on opposite sides of the zero baseline.

## Install

```bash
npx arloui add chart-bar
```

Import the component directly when installing this chart on its own:

```tsx
import { BarChart } from '@/components/ui/chart/bar-chart';
```

## Examples

These examples use BarChart, the direct import shown above. Set up the theme provider before rendering them.

Display a single series with category labels and a zero baseline when values cross zero.

```tsx
import { BarChart } from '@/components/ui/chart/bar-chart';
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
}
```

Stack two named series and display their category labels and legend.

```tsx
import { BarChart } from '@/components/ui/chart/bar-chart';

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
}
```

Display horizontal bars with value labels and a budget reference line.

```tsx
import { BarChart } from '@/components/ui/chart/bar-chart';
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
}
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
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
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
| `accessibilityLabel` | `string` | — | Overrides the summary read to assistive tech, which otherwise describes the series. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |

## Parts

Without children, the chart uses its default layout. Add child components to choose which optional elements to include. The table lists each component and its available props.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<BarChart.Series />` | `data: readonly BarDatum[] \| readonly number[]` `label: string` | One series. The first declares the categories; the rest ride on them. |
| `<BarChart.Values />` | — | Prints each bar's value above it. Without it, only the selected bar shows a figure. |
| `<BarChart.Categories />` | — | The category names — under the bars, or beside the rows when `layout="horizontal"`. |
| `<BarChart.Baseline />` | — | The zero rule. Drawn only when the data crosses zero — an all-positive chart has its zero at the axis already. |
| `<BarChart.Reference />` | `value: number` `label: string` | A labelled dashed line at a value you name — a target, a budget, an average. Adds to the zero rule rather than replacing it. |
| `<BarChart.Legend />` | — | The series legend. Unnamed series use their position, such as Series 1. |

## Motion

Bars fade into place over 200 ms when data first appears. Vertical bars also fade on dataset changes. Their lengths do not grow from zero, so the animation does not imply changing values.

Motion is enabled by default. Set `animated={false}` to disable entrances, transitions, and loading pulse. Device Reduce Motion takes precedence. Loading shows a neutral pulsing placeholder that fades out before entry. For background fetches, pass `refreshing` and keep supplying the last successful data; the chart stays visible and exposes its busy state. Entry runs once when real data becomes available, including after loading or an empty state. It does not loop.

Use the playground Motion controls to switch animation on or off. Tap On again to replay the entrance.

```tsx
<BarChart data={data} animated={false} />
```

## Limitations

Stacked bars support non-negative values only. Negative values are excluded and produce a development warning. Use grouped bars for data containing negative values.

## Related

- [Chart overview](/docs/components/chart)