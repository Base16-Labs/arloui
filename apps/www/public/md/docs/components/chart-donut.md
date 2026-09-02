# Chart.Donut

`Chart.Donut`

Parts of one whole. Four named slices, then everything else folds into a neutral Other.

Answers “What is this made of?”

## When to use

- The parts genuinely sum to a meaningful whole — a budget, a portfolio, a day.
- There are few enough categories to name. Past four, the tail is Other.
- The total belongs in the middle, where the hole already is.

## Install

```bash
npx arloui add chart-donut
```

A single form does not bring the `Chart` barrel, so import the component itself:

```tsx
import { DonutChart } from '@/components/ui/chart/donut-chart';
```

## Code

The default composition: the ring, the total, and a legend.

```tsx
<Chart.Donut data={breakdown} format={money} />
```

Name the parts to caption the middle, or to drop the legend.

```tsx
<Chart.Donut data={breakdown} format={money} thickness={32}>
  <Chart.Donut.Value />
  <Chart.Donut.Label>Monthly spend</Chart.Donut.Label>
</Chart.Donut>
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
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
| `accessibilityLabel` | `string` | — | Overrides the summary read to assistive tech, which otherwise names every slice and its share. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |

## Parts

Name one and it is drawn; name none and you get the default composition.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Donut.Value />` | `value: string` | The total in the middle of the ring, formatted with the chart's `format`. |
| `<Chart.Donut.Label />` | `children: ReactNode` | The line under the centre readout. Takes its text as children. |
| `<Chart.Donut.Legend />` | — | The slice legend, beneath the ring — each slice's name, colour, and value. |

## What it will not do

It will not draw more than five arcs, whatever `maxSlices` says: the categorical palette has four validated slots and the fifth arc is Other. More than that and a bar chart reads better anyway.

## Related

- [Chart overview](/docs/components/chart)