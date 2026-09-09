# Donut

`Chart.Donut`

Show how categories contribute to a total. Display up to four named categories, with additional categories combined into Other.

## When to use

- Show proportions of a total, such as a spending breakdown or portfolio allocation.
- Use for a small set of categories. Additional categories are combined into Other.
- Display the total in the center and category values in the legend.

## Install

```bash
npx arloui add chart-donut
```

Import the component directly when installing this chart on its own:

```tsx
import { DonutChart } from '@/components/ui/chart/donut-chart';
```

## Examples

These examples use DonutChart, the direct import shown above. Set up the theme provider before rendering them.

Display category proportions with a center total and legend.

```tsx
import { DonutChart } from '@/components/ui/chart/donut-chart';
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
}
```

Customize the ring width and center label. This example omits the legend.

```tsx
import { DonutChart } from '@/components/ui/chart/donut-chart';
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
}
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
| `data` **·** required | `readonly DonutSlice[]` | — | Slices of a whole. Non-positive values are dropped, not clamped: a negative share of a total is not a thing a ring can express, and a zero slice has no arc to draw. |
| `size` | `number` | `180` | The ring's outer diameter in points. |
| `thickness` | `number` | — | Ring thickness. Defaults from `density` — 26 at default, 18 at compact. |
| `density` | `ChartDensity` | `'default'` | How much mark there is: ring thickness and the hairline between slices. |
| `activeIndex` | `number \| null` | — | Emphasised slice. Controlled when passed; `defaultActiveIndex` seeds the internal one. |
| `defaultActiveIndex` | `number \| null` | `null` | Which slice starts selected when selection is uncontrolled. |
| `onSelect` | `(index: number, slice: DonutSlice) => void` | — | Called with the tapped slice's index and datum. Passing it is what makes slices tappable. |
| `format` | `(value: number) => string` | — | Formats the centre total and the legend's values. |
| `maxSlices` | `number` | `MAX_ARCS` | How many arcs the ring draws, **"Other" included**. Categories past that fold into one neutral "Other" slice. |
| `emptyLabel` | `string` | `'No data'` | Short text for the ring's centre when there is no data. Not the whole empty state — see `empty` for the composed one. |
| `empty` | `ChartEmptyProps` | — | The composed empty slot — headline, one line, one action — the same one `Chart.Empty` and `Chart.Bar` draw. |
| `loading` | `boolean` | `false` | Draws the ring as a pulsing track and holds back the centre readout and the legend. Same footprint as the loaded chart, so nothing reflows when the data lands. |
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
| `accessibilityLabel` | `string` | — | Overrides the summary read to assistive tech, which otherwise names every slice and its share. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |

## Parts

Without children, the chart uses its default layout. Add child components to choose which optional elements to include. The table lists each component and its available props.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<DonutChart.Value />` | `value: string` | The total in the middle of the ring, formatted with the chart's `format`. |
| `<DonutChart.Label />` | `children: ReactNode` | The line under the centre readout. Takes its text as children. |
| `<DonutChart.Legend />` | — | The slice legend, beneath the ring — each slice's name, colour, and value. |

## Motion

The ring draws clockwise from the top over 400 ms when data first appears. Each slice keeps its final proportion and colour. The centre value and legend remain readable throughout. Selecting a slice does not replay the entrance.

Motion is enabled by default. Set `animated={false}` to disable entrances, transitions, and loading pulse. Device Reduce Motion takes precedence. Loading shows a neutral pulsing placeholder that fades out before entry. For background fetches, pass `refreshing` and keep supplying the last successful data; the chart stays visible and exposes its busy state. Entry runs once when real data becomes available, including after loading or an empty state. It does not loop.

Use the playground Motion controls to switch animation on or off. Tap On again to replay the entrance.

```tsx
<DonutChart data={data} animated={false} />
```

## Limitations

The chart supports at most five slices, including Other. Setting maxSlices above five does not increase this limit. Use Bar when each category needs to remain individually visible.

## Related

- [Chart overview](/docs/components/chart)