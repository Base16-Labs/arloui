# Meter

`Chart.Meter`

Display a value within a defined range using a bar, ring, or arc. Optional thresholds change the color at warning and danger levels.

## When to use

- Show a measurement relative to a limit, such as storage used or a budget spent.
- Use warnAt and dangerAt to change the color when the value crosses a threshold.
- Add Ring children to compare related measurements as concentric rings.

## Install

```bash
npx arloui add chart-meter
```

Import the component directly when installing this chart on its own:

```tsx
import { Meter } from '@/components/ui/chart/meter';
```

## Examples

These examples use Meter, the direct import shown above. Set up the theme provider before rendering them.

Display a value with warning and danger thresholds, expressed as fractions of the range.

```tsx
import { Meter } from '@/components/ui/chart/meter';

export default function ChartExample() {
  return (
    <Meter value={88} max={100} warnAt={0.75} dangerAt={0.9} />
  );
}
```

Display a credit score within a custom range using an arc and label.

```tsx
import { Meter } from '@/components/ui/chart/meter';

export default function ChartExample() {
  return (
    <Meter shape="arc" value={712} min={300} max={850}>
      <Meter.Value />
      <Meter.Label>Credit score</Meter.Label>
    </Meter>
  );
}
```

Display related measurements as concentric rings.

```tsx
import { Meter } from '@/components/ui/chart/meter';

export default function ChartExample() {
  return (
    <Meter shape="ring" value={70} max={100}>
      <Meter.Label>Storage</Meter.Label>
      <Meter.Ring value={70} label="Used" />
      <Meter.Ring value={40} label="Backups" />
    </Meter>
  );
}
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
| `value` **·** required | `number` | — | What to show, in the same units as `min` and `max`. |
| `max` | `number` | `100` | Top of the range. The fill is `value` as a share of `min`..`max`. |
| `min` | `number` | `0` | Bottom of the range, for meters that do not start at zero. |
| `shape` | `MeterShape` | `'bar'` | A `bar`, a full `ring`, or an `arc` gauge open at the bottom. |
| `tone` | `ChartTone` | `'brand'` | Honours `brand` (default), `positive`, `negative`, and `neutral`. |
| `density` | `ChartDensity` | `'default'` | How thick the track is, unless `thickness` overrides it. |
| `warnAt` | `number` | — | Fraction (0-1) past which the meter turns warning. |
| `dangerAt` | `number` | — | Fraction (0-1) past which the meter turns danger. |
| `thickness` | `number` | — | Bar thickness, or ring stroke width. |
| `size` | `number` | — | Ring or arc diameter. Ignored by the bar shape. |
| `loading` | `boolean` | `false` | Additional concentric rings, drawn inside the primary one. `value` is always the outermost; these stack inwards in order, exactly as `series` extends `data` on a bar chart. |
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
| `accessibilityLabel` | `string` | — | Overrides the label read to assistive tech, which otherwise uses the meter's name. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the meter's outer container. |

## Parts

Without children, the chart uses its default layout. Add child components to choose which optional elements to include. The table lists each component and its available props.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Meter.Value />` | `value: string` | The value, as a figure. On a ring or arc it sits in the hole; on a bar it sits above the track. |
| `<Meter.Label />` | `children: ReactNode` | The name under the readout. Takes its text as children. |
| `<Meter.Ring />` | `value: number` `max: number` `min: number` `color: string` `label: string` | One concentric ring. Replaces an entry in the `rings` array. |

## Motion

The fill animates from zero to the supplied value on mount, then moves to each new value using the slow duration token. The percentage readout follows the fill. Additional rings animate to their own values.

Motion is enabled by default. Set `animated={false}` to disable entrances, transitions, and loading pulse. Device Reduce Motion takes precedence. Loading shows a neutral pulsing placeholder that fades out before entry. For background fetches, pass `refreshing` and keep supplying the last successful data; the chart stays visible and exposes its busy state. Entry runs once when real data becomes available, including after loading or an empty state. It does not loop.

Use the playground Motion controls to switch animation on or off. Tap On again to replay the entrance.

```tsx
<Meter value={53} max={100} animated={false} />
```

## Limitations

Meter displays a known value within a range. It does not represent an operation with an unknown duration; use a loading indicator for that state.

## Related

- [Chart overview](/docs/components/chart)