# Heatmap

`Chart.Heatmap`

Display daily activity in a calendar grid. Color intensity represents the value for each day.

## When to use

- Show activity patterns for habits, contributions, or daily usage.
- Use for daily data spanning several weeks or months.
- Use zero for days with no activity. Missing dates within the displayed range also appear as inactive days.

## Install

```bash
npx arloui add chart-heatmap
```

Import the component directly when installing this chart on its own:

```tsx
import { Heatmap } from '@/components/ui/chart/heatmap';
```

## Examples

These examples use Heatmap, the direct import shown above. Set up the theme provider before rendering them.

Display daily activity with weekday labels and an intensity legend.

```tsx
import { Heatmap } from '@/components/ui/chart/heatmap';

const days = [
  { date: '2026-03-02', value: 2 },
  { date: '2026-03-03', value: 5 },
  { date: '2026-03-04', value: 3 },
];

export default function ChartExample() {
  return (
    <Heatmap data={days} />
  );
}
```

Display a fixed month with weekday labels and no intensity legend.

```tsx
import { Heatmap } from '@/components/ui/chart/heatmap';

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
}
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
| `data` **·** required | `readonly HeatmapDatum[]` | — | Dated values. A day with no entry renders empty, not absent. |
| `levels` | `number` | `3` | Filled intensity steps above "none". Default 3. |
| `from` | `string \| number \| Date` | — | Grid start; defaults to the earliest datum, wound back to Monday. |
| `to` | `string \| number \| Date` | — | Grid end; defaults to the latest datum, run on to Sunday. |
| `onSelect` | `(datum: HeatmapDatum \| null, date: Date) => void` | — | Tapping a day. Without this the grid is one image, not forty-two buttons. |
| `format` | `(value: number) => string` | — | Formats a day's value in its accessibility label. |
| `empty` | `ChartEmptyProps` | — | The composed empty slot — headline, one line, one action — the same one every other form draws. |
| `emptyLabel` | `string` | `'No activity yet'` | Rendered in place of the grid when there is no range to draw. |
| `loading` | `boolean` | `false` | Pulses the empty grid instead of the data. |
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
| `accessibilityLabel` | `string` | — | Overrides the summary read to assistive tech, which otherwise gives the range and its busiest day. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the grid's outer container. |

## Parts

Without children, the chart uses its default layout. Add child components to choose which optional elements to include. The table lists each component and its available props.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Heatmap.DayLabels />` | — | The weekday initials down the left edge of the grid. |
| `<Heatmap.Scale />` | — | The Less-to-More key under the grid, showing what each level of fill means. |

## Motion

The calendar fades in as one layer over 200 ms when data first appears. Cells do not animate individually: their colours represent activity, not progress. Selection and data changes are immediate.

Motion is enabled by default. Set `animated={false}` to disable entrances, transitions, and loading pulse. Device Reduce Motion takes precedence. Loading shows a neutral pulsing placeholder that fades out before entry. For background fetches, pass `refreshing` and keep supplying the last successful data; the chart stays visible and exposes its busy state. Entry runs once when real data becomes available, including after loading or an empty state. It does not loop.

Use the playground Motion controls to switch animation on or off. Tap On again to replay the entrance.

```tsx
<Heatmap data={data} animated={false} />
```

## Limitations

This component supports calendar dates, not arbitrary row and column categories. The empty state appears only when both the data and an explicit date range are absent.

## Related

- [Chart overview](/docs/components/chart)