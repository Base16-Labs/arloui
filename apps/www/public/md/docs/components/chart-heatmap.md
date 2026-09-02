# Chart.Heatmap

`Chart.Heatmap`

A calendar streak grid: days as filled and empty squares, read week across and weekday down.

Answers “Did I show up?”

## When to use

- Consistency over time is the story — streaks, habits, contributions.
- The unit is a day and the span is weeks or months.
- An empty square is data: it means nothing happened, not that nothing is known.

## Install

```bash
npx arloui add chart-heatmap
```

A single form does not bring the `Chart` barrel, so import the component itself:

```tsx
import { Heatmap } from '@/components/ui/chart/heatmap';
```

## Code

The default composition: the grid, its weekday gutter, and the key.

```tsx
<Chart.Heatmap data={days} onSelect={setDay} />
```

A fixed month, with the key dropped.

```tsx
<Chart.Heatmap data={days} from="2026-03-01" to="2026-03-31" levels={5}>
  <Chart.Heatmap.DayLabels />
</Chart.Heatmap>
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `data` **·** required | `readonly HeatmapDatum[]` | — | Dated values. A day with no entry renders empty, not absent. |
| `levels` | `number` | `3` | Filled intensity steps above "none". Default 3. |
| `from` | `string \| number \| Date` | — | Grid start; defaults to the earliest datum, wound back to Monday. |
| `to` | `string \| number \| Date` | — | Grid end; defaults to the latest datum, run on to Sunday. |
| `onSelect` | `(datum: HeatmapDatum \| null, date: Date) => void` | — | Tapping a day. Without this the grid is one image, not forty-two buttons. |
| `format` | `(value: number) => string` | — | Formats a day's value in its accessibility label. |
| `empty` | `ChartEmptyProps` | — | The composed empty slot — headline, one line, one action — the same one every other form draws. |
| `emptyLabel` | `string` | `'No activity yet'` | Rendered in place of the grid when there is no range to draw. |
| `loading` | `boolean` | `false` | Pulses the empty grid instead of the data. |
| `accessibilityLabel` | `string` | — | Overrides the summary read to assistive tech, which otherwise gives the range and its busiest day. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the grid's outer container. |

## Parts

Name one and it is drawn; name none and you get the default composition.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Heatmap.DayLabels />` | — | The weekday initials down the left edge of the grid. |
| `<Chart.Heatmap.Scale />` | — | The Less-to-More key under the grid, showing what each level of fill means. |

## What it will not do

It is a calendar grid, not a matrix heatmap — there is no arbitrary x against y. And because empty days are the data, it only shows an empty state when it has no data *and* no date range to draw.

## Related

- [Chart overview](/docs/components/chart)