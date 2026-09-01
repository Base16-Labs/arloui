# Chart

> Six chart forms sharing one validated palette, all reached through the Chart namespace: a scrubbable single-series line, an inline sparkline, categorical bars (grouped, stacked, or horizontal), a part-to-whole donut, a meter against a target, and a calendar heatmap.

**Type:** Component  
**Category:** Data  
**Source:** https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chart

## On this page

- States
- Tokens used
- Forms
- When to use
- Reading the three axes
- Install
- Code
- Accessibility
- Not in the kit

## States

`scrub` · `rising` · `falling` · `neutral` · `stacked` · `gauge` · `concentric rings` · `loading` · `empty` · `not enough data` · `reduced motion`

## Tokens used

- `colors.chartPositive`
- `colors.chartNegative`
- `colors.chartSeries1`
- `colors.chartSeries2`
- `colors.chartSeries3`
- `colors.chartSeries4`
- `colors.chartOther`
- `colors.interactivePrimary`
- `colors.textPrimary`
- `colors.textSecondary`
- `colors.textTertiary`
- `colors.surfaceElevated`
- `colors.surfaceInput`
- `colors.borderSecondary`
- `colors.feedbackWarning`
- `colors.feedbackError`
- `radii.md`
- `radii.full`
- `motion.chart.data`
- `motion.chart.barSwap`
- `motion.duration.slow`

## Forms

Six, all reached through the `Chart` namespace. Pick by the question the reader
is asking, not by the shape you want.

| Form | Answers | Reach for it when |
| --- | --- | --- |
| `Chart` + `Chart.Plot` | "How has this moved?" | One series over time, scrubbable, with a big readout above it. The money screen. |
| `Chart.Sparkline` | "Which way is this going?" | An inline mark in a list row or a stat card. No axes, no scrub, often no labels. |
| `Chart.Bar` | "How do these compare?" | Categories side by side — grouped, stacked, or as ranked horizontal rows. |
| `Chart.Donut` | "What is this made of?" | Parts of one whole. Four named slices, then everything else folds into `Other`. |
| `Chart.Meter` | "How close am I?" | One value against a target, as a bar, a ring, or an arc gauge. |
| `Chart.Heatmap` | "Did I show up?" | A month of days as filled and empty squares. Streaks and consistency. |

`Chart.Plot`, `Chart.Value`, `Chart.Delta`, `Chart.Periods`, `Chart.Legend`, and
`Chart.Empty` compose inside a `Chart` root, which owns the data and the scrub
state. The other five are standalone and take their own `data`.

## When to use

- **A number, not a chart, when there is one number.** A meter or a big
  `Chart.Value` says more than a plot with two points in it.
- **Sparkline over Plot in a row.** If the mark is smaller than the text beside
  it, it is a sparkline — it has no room for an axis, a scrub, or a readout.
- **Bar over Donut past four categories.** A ring can hold four slices and an
  `Other`; a fifth is a bar chart wearing the wrong shape.
- **Heatmap only for dates.** Its x-axis is always time. A matrix of two
  categorical axes is a different chart and is not in the kit.

## Reading the three axes

Every form answers the same three props, so learning them once is enough.

**`tone` — what the number means.** Not what colour to use. Up is not always
good: savings rising is welcome, spending rising is not, and only you know
which. `auto` infers direction, `positive`/`negative` assert it, `brand` is
magnitude with no direction to report, `series` spends the categorical palette,
`neutral` is context for something else.

**`density` — how much mark there is.** `compact` thins strokes, shrinks dots and
rings, tightens rows. It is for fitting a chart into a table row or a card
without hand-tuning six numbers at each call site.

**`chrome` — the furniture around the data.** `none` is the mark alone.
`baseline` adds the zero rule, drawn only when the data actually crosses zero.
`reference` adds one labelled dashed line at a value you name — a budget, an
average. There is no `axis` member and there will not be one.

## Install

Take the namespace, or take one form:

```bash
# every form, reached through the Chart namespace
npx arloui add chart

# or one, which brings the shared core and nothing else
npx arloui add chart-bar
npx arloui add chart-sparkline
```

A single form gives you the component itself (`BarChart`, `Sparkline`, and so
on) plus `chart-core` — the scale, the tones and densities, the legend, the
empty slot, and the loading skeleton. Seven files rather than thirteen, and no
`expo-haptics` unless the form you took responds to touch.

### Which import

`Chart.Bar` and `BarChart` are the same component. The namespace is assembled
in `chart/index.ts`, and a single form doesn't bring that barrel — so reach for
the form's own export instead:

```tsx
// npx arloui add chart
import { Chart } from '@/components/ui/chart';
<Chart.Bar data={spend} />

// npx arloui add chart-bar — same component, no barrel to reach it through
import { BarChart } from '@/components/ui/chart/bar-chart';
<BarChart data={spend} />
```

| Entry | File | Export | Through the namespace |
| --- | --- | --- | --- |
| `chart-plot` | `chart/chart` | `ChartRoot`, `ChartPlotParts` | `Chart`, `Chart.Plot`, `Chart.Value`, `Chart.Delta`, `Chart.Periods` |
| `chart-bar` | `chart/bar-chart` | `BarChart` | `Chart.Bar` |
| `chart-sparkline` | `chart/sparkline` | `Sparkline` | `Chart.Sparkline` |
| `chart-donut` | `chart/donut-chart` | `DonutChart` | `Chart.Donut` |
| `chart-meter` | `chart/meter` | `Meter` | `Chart.Meter` |
| `chart-heatmap` | `chart/heatmap` | `Heatmap` | `Chart.Heatmap` |

Paths follow your `aliases.components` — `components/ui` by default. The props
are identical either way, so every example below reads the same once the import
is swapped.

`chart-plot` is the one form that reads differently on its own: it exports
`ChartRoot` and a `ChartPlotParts` object rather than a namespace, so it is
`<ChartRoot>` with `ChartPlotParts.Value` unless you also take `chart`.

## Code

A scrubbable series with a readout and a period selector:

```tsx
<Chart data={points} format={money} periods={['1D', '1W', '1M']} period={period} onPeriodChange={setPeriod}>
  <Chart.Value />
  <Chart.Delta />
  <Chart.Plot fill curve="smooth" />
  <Chart.Periods />
</Chart>
```

An inline mark in a list row — compact by default, tinted by direction:

```tsx
<Chart.Sparkline data={prices} width={80} showEndDot={false} />
```

Categories, ranked as rows rather than bars:

```tsx
<Chart.Bar data={spend} layout="horizontal" format={money} chrome="none" />
```

Two series stacked, with a legend:

```tsx
<Chart.Bar data={sleep} series={[activity]} variant="stacked" legend={['Sleep', 'Activity']} />
```

One value against a target, as a gauge:

```tsx
<Chart.Meter shape="arc" value={712} max={850} label="Credit score" warnAt={0.75} dangerAt={0.85} />
```

Every form takes the same empty slot, and it replaces the chart rather than
sitting inside it:

```tsx
<Chart.Bar
  data={[]}
  empty={{
    title: 'No spending yet',
    description: 'Categories will appear here once you log a transaction.',
    action: { label: 'Log a transaction', onPress: open },
  }}
/>
```

## Accessibility

- A chart with no `onSelect` or `onScrub` is **one image** to a screen reader,
  labelled with a summary of the series. It does not become forty-two tappable
  squares unless you asked for selection.
- Readouts never show a figure the chart does not have. While `loading`, the
  value, the delta and the period pills are skeletons — a `$0.00` placeholder is
  indistinguishable from a real zero balance.
- Reduce Motion pins sweeps, morphs and counters to their final values, and
  stops the loading sheen. Scrubbing is unaffected: it is direct manipulation,
  tracked one to one, and has no duration to remove.
- Status colour never travels alone. A meter past `warnAt` or `dangerAt` always
  ships its value alongside the colour change.

## Not in the kit

Candlestick, radar, population pyramid, scatter, matrix heatmaps, and 3-D
anything. They are consumer-owned on purpose.

`core.ts` is exported for exactly this: `makeScale`, `linePath`, `areaPath`,
`bandPath`, `barPath`, `annulusPath`, `arcPath`, and the tone and density
helpers. A seventh form written against them measures the same way these do, so
a crosshair lands on the line rather than near it.

## Links

- [Source](https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chart)

---
Source: https://arloui.com
