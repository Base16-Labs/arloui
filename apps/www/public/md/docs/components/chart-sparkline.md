# Chart.Sparkline

`Chart.Sparkline`

A chrome-free inline line for list rows and stat cards. No axes, no scrub, tinted by direction.

Answers “Which way is this going?”

## When to use

- The mark sits beside text that already says what the number is.
- There are many of them on one screen — a table of twenty rows, each with its own trend.
- Direction is the whole message; an exact value at a point is not needed.

## Install

```bash
npx arloui add chart-sparkline
```

A single form does not bring the `Chart` barrel, so import the component itself:

```tsx
import { Sparkline } from '@/components/ui/chart/sparkline';
```

## Code

The bare mark, sized to its slot.

```tsx
<Chart.Sparkline data={prices} width={80} height={28} />
```

With a wash, an end dot, and the high and low called out.

```tsx
<Chart.Sparkline data={prices} width={120} format={money}>
  <Chart.Sparkline.Fill />
  <Chart.Sparkline.EndDot />
  <Chart.Sparkline.Extremes />
</Chart.Sparkline>
```

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
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
| `loading` | `boolean` | `false` | Draws the silhouette as a pulsing line instead of the series. Holds the same box, so the row it sits in does not reflow when the data lands. |
| `accessibilityLabel` | `string` | — | Sparklines are decorative next to a value that is already announced, so they are hidden from assistive tech unless you pass a label. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the mark's container. |

## Parts

Name one and it is drawn; name none and you get the default composition.

| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Sparkline.EndDot />` | — | A dot on the final point, so the eye lands on where the series ended. |
| `<Chart.Sparkline.Extremes />` | — | Dots on the highest and lowest points, with their values. |
| `<Chart.Sparkline.Fill />` | — | A gradient wash under the line, fading to nothing at the bottom of the box. |

## What it will not do

It has no scrub and no readout by design. Twenty scrubbable charts in a list is twenty gesture handlers competing with the list’s own scroll — if a row needs a readout, it needs a Chart.

## Related

- [Chart overview](/docs/components/chart)