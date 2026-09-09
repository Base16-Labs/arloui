# Sparkline

`Chart.Sparkline`

Show a compact trend beside a metric in a list row, table, or summary card. Sparklines do not include axes or touch-based value inspection.

## When to use

- Add a trend beside an existing metric label and value.
- Compare trends across multiple list rows without adding a full chart to each row.
- Use when users need to see the overall trend rather than inspect individual points.

## Install

```bash
npx arloui add chart-sparkline
```

Import the component directly when installing this chart on its own:

```tsx
import { Sparkline } from '@/components/ui/chart/sparkline';
```

## Examples

These examples use Sparkline, the direct import shown above. Set up the theme provider before rendering them.

Render a compact trend with an explicit width and height.

```tsx
import { Sparkline } from '@/components/ui/chart/sparkline';

const prices = [912, 946, 934, 995, 1031];

export default function ChartExample() {
  return (
    <Sparkline data={prices} width={80} height={28} />
  );
}
```

Add an area fill, an endpoint marker, and high and low value labels.

```tsx
import { Sparkline } from '@/components/ui/chart/sparkline';
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
}
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
| `data` **·** required | `ChartData` | — | The series. Bare numbers are fine — a sparkline has no axis to label. |
| `tone` | `ChartTone` | `'auto'` | Honours `auto` (default; tones by whether the series ended above where it started), `positive`, `negative`, `brand`, and `neutral`. One series has no categories, so `series` is treated as `brand`. |
| `density` | `ChartDensity` | `'compact'` | Inline marks default to `compact`: a thinner stroke and a smaller dot. |
| `width` | `number` | — | Fixed width in points. Omit it and the mark measures its parent instead. |
| `height` | `number` | `28` | Fixed height in points. Small by default: this is an inline mark. |
| `format` | `(value: number) => string` | — | Formats the extreme labels. Raw values when omitted. |
| `emptyLabel` | `string` | — | Short text in place of the mark when there is no data — the same minimum every other chart form has. |
| `empty` | `ChartEmptyProps` | — | The composed empty slot — headline, one line, one action — the same one `Chart.Empty`, `Chart.Bar`, and `Chart.Donut` draw. |
| `curve` | `ChartCurve` | `'steep'` | How points are joined — `steep` for straight segments, `smooth` for a spline. |
| `strokeWidth` | `number` | — | Overrides the density's stroke width. |
| `loading` | `boolean` | `false` | Draws a neutral pulsing placeholder instead of the series. Holds the same box, so the row it sits in does not reflow when the data lands. |
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
| `accessibilityLabel` | `string` | — | Sparklines are decorative next to a value that is already announced, so they are hidden from assistive tech unless you pass a label. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the mark's container. |

## Parts

Without children, the chart uses its default layout. Add child components to choose which optional elements to include. The table lists each component and its available props.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Sparkline.EndDot />` | — | A dot on the final point, so the eye lands on where the series ended. |
| `<Sparkline.Extremes />` | — | Dots on the highest and lowest points, with their values. |
| `<Sparkline.Fill />` | — | A gradient wash under the line, fading to nothing at the bottom of the box. |

## Motion

The trend reveals from left to right over 400 ms, with the optional area fill following the stroke. Subsequent data changes are immediate. For dense lists of small trends, disable motion to keep scanning quiet.

Motion is enabled by default. Set `animated={false}` to disable entrances, transitions, and loading pulse. Device Reduce Motion takes precedence. Loading shows a neutral pulsing placeholder that fades out before entry. For background fetches, pass `refreshing` and keep supplying the last successful data; the chart stays visible and exposes its busy state. Entry runs once when real data becomes available, including after loading or an empty state. It does not loop.

Use the playground Motion controls to switch animation on or off. Tap On again to replay the entrance.

```tsx
<Sparkline data={data} animated={false} />
```

## Limitations

Sparkline does not support dragging to inspect values or a selected-value readout. Use Line chart when users need those interactions.

## Related

- [Chart overview](/docs/components/chart)