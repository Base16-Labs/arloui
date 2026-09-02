# Chart.Meter

`Chart.Meter`

One value against a target, as a bar, a ring, or an arc gauge.

Answers “How close am I?”

## When to use

- There is a single number and a ceiling it is measured against — storage, budget, a goal.
- Crossing a threshold should change how it reads, which is what `warnAt` and `dangerAt` are for.
- Several related quantities share one ceiling: give each a Ring.

## Install

```bash
npx arloui add chart-meter
```

A single form does not bring the `Chart` barrel, so import the component itself:

```tsx
import { Meter } from '@/components/ui/chart/meter';
```

## Code

The default composition: the track and its readout.

```tsx
<Chart.Meter value={88} max={100} warnAt={0.75} dangerAt={0.9} />
```

An arc gauge, captioned.

```tsx
<Chart.Meter shape="arc" value={712} min={300} max={850}>
  <Chart.Meter.Value />
  <Chart.Meter.Label>Credit score</Chart.Meter.Label>
</Chart.Meter>
```

Concentric rings — one ceiling, several quantities.

```tsx
<Chart.Meter shape="ring" value={70} max={100}>
  <Chart.Meter.Label>Storage</Chart.Meter.Label>
  <Chart.Meter.Ring value={70} label="Used" />
  <Chart.Meter.Ring value={40} label="Backups" />
</Chart.Meter>
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
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
| `accessibilityLabel` | `string` | — | Overrides the label read to assistive tech, which otherwise uses the meter's name. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the meter's outer container. |

## Parts

Name one and it is drawn; name none and you get the default composition.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Meter.Value />` | `value: string` | The value, as a figure. On a ring or arc it sits in the hole; on a bar it sits above the track. |
| `<Chart.Meter.Label />` | `children: ReactNode` | The name under the readout. Takes its text as children. |
| `<Chart.Meter.Ring />` | `value: number` `max: number` `min: number` `color: string` `label: string` | One concentric ring. Replaces an entry in the `rings` array. |

## What it will not do

It is not a progress bar for an operation in flight — that is a Progress component’s job. A meter is a standing quantity you could read at any moment, not something that finishes.

## Related

- [Chart overview](/docs/components/chart)