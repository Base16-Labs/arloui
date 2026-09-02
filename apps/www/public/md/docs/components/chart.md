# Chart

> Six chart forms sharing one validated palette, all reached through the Chart namespace: a scrubbable single-series line, an inline sparkline, categorical bars (grouped, stacked, or horizontal), a part-to-whole donut, a meter against a target, and a calendar heatmap.

**Type:** Component  
**Category:** Data  
**Source:** https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chart

## On this page

- Forms
- When to use
- Reading the three axes
- Install
- Two ways to call every form
- Code
- Props
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
| Line chart (`Chart`) | "How has this moved?" | One series over time, scrubbable, with a big readout above it. The money screen. |
| `Chart.Sparkline` | "Which way is this going?" | An inline mark in a list row or a stat card. No axes, no scrub, often no labels. |
| `Chart.Bar` | "How do these compare?" | Categories side by side — grouped, stacked, or as ranked horizontal rows. |
| `Chart.Donut` | "What is this made of?" | Parts of one whole. Four named slices, then everything else folds into `Other`. |
| `Chart.Meter` | "How close am I?" | One value against a target, as a bar, a ring, or an arc gauge. |
| `Chart.Heatmap` | "Did I show up?" | A month of days as filled and empty squares. Streaks and consistency. |

`Chart.Plot`, `Chart.Value`, `Chart.Delta`, `Chart.Periods`, `Chart.Legend`, and
`Chart.Empty` compose inside a `Chart` root, which owns the data and the scrub
state. The other five are standalone and take their own `data`.

## When to use

Start from the question the reader is asking, then check the exceptions below —
they are the five calls people get wrong.

| The reader asks | Reach for |
| --- | --- |
| How has this moved? | Line chart |
| How do these compare? | Bar |
| Which way is this going? | Sparkline |
| What is this made of? | Donut |
| How close am I? | Meter |
| Did I show up? | Heatmap |

- **A number, not a chart, when there is one number.** A meter or a bare `Chart.Value` says more than a line chart with two points in it.
- **Line chart for a sequence, bar for a set.** If the order of the points is the story, it is a line; if they could be shuffled without losing anything, they are categories and want bars.
- **Sparkline over line chart in a row.** If the mark is smaller than the text beside it, it is a sparkline — there is no room for a scrub or a readout, and twenty scrubbable charts in a list fight the list's own scroll.
- **Bar over donut past four categories.** A ring holds four slices and an `Other`; a fifth is a bar chart wearing the wrong shape.
- **Heatmap only for dates.** Its x-axis is always a calendar. A matrix of two categorical axes is a different chart and is not in the kit.

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
empty slot, and the loading skeleton. Seven files for a sparkline, ten for a bar
chart, against nineteen for the kit — and no `expo-haptics` unless the form you
took responds to touch.

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
| `chart-plot` | `chart/chart` | `Chart` | `Chart`, `Chart.Plot`, `Chart.Value`, `Chart.Delta`, `Chart.Periods` |
| `chart-bar` | `chart/bar-chart` | `BarChart` | `Chart.Bar` |
| `chart-sparkline` | `chart/sparkline` | `Sparkline` | `Chart.Sparkline` |
| `chart-donut` | `chart/donut-chart` | `DonutChart` | `Chart.Donut` |
| `chart-meter` | `chart/meter` | `Meter` | `Chart.Meter` |
| `chart-heatmap` | `chart/heatmap` | `Heatmap` | `Chart.Heatmap` |

Paths follow your `aliases.components` — `components/ui` by default. The props
are identical either way, so every example below reads the same once the import
is swapped.

Every entry reads the same whether you took it alone or through `chart`. The
plot's namespace is assembled in `chart/chart` itself, not in the barrel, so a
standalone `chart-plot` gives you the same `<Chart>` the examples use — the
barrel only adds the other five forms to that same object.

## Two ways to call every form

**Pass no children and you get the form's default composition** — the sensible
chart, in one line:

```tsx
<Chart data={points} format={money} periods={['1D', '1W', '1M']} period={p} onPeriodChange={setP} />
```

**Name any child and you get exactly what you named** — nothing else is drawn:

```tsx
<Chart data={points} format={money}>
  <Chart.Value />
  <Chart.Periods />
  <Chart.Plot height={200} fill>
    <Chart.Reference value={1000} label="Target" />
  </Chart.Plot>
</Chart>
```

That inversion is the whole rule. There is no third way and no mixing: presence
lives in the tree, so no form takes a `showValues`, a `showLegend`, or a
`chrome` prop to decide what exists. For the bare mark — no zero rule, no
labels — pass `{null}`, which says "I named nothing" rather than "give me the
defaults".

**Where a part goes** follows the same split: the root's children are
information — `Title`, `Value`, `Delta`, `Periods`, `Legend`, `Empty` —
and the plot's children are what is drawn inside the box — `Line`, `Bars`,
`Baseline`, `Reference`, `Crosshair`.

`Crosshair` is the scrub: name it and the plot answers a touch and draws the
rule and dot that follow it; leave it out and the plot is a picture. There is no
`scrubbable` prop, because a plot that tracks a finger and draws nothing is not
a thing anyone wants.

On naming: `Value` is the one big readout, `Values` is a number on every mark,
and the category names are `Categories` rather than `Labels` — `Label` and
`Labels` meaning different things one letter apart was a trap.

The rule is presence against behaviour. A prop answering *does this element
exist?* belongs in the tree; one answering *how does the whole chart behave?* —
`variant`, `layout`, `density`, `tone`, `spacing` — stays a prop.

| Form | Parts |
| --- | --- |
| `Chart.Bar` | `Series` `Values` `Categories` `Baseline` `Reference` `Legend` |
| `Chart.Donut` | `Value` `Label` `Legend` |
| `Chart.Meter` | `Value` `Label` `Ring` |
| `Chart.Sparkline` | `Fill` `EndDot` `Extremes` |
| `Chart.Heatmap` | `DayLabels` `Scale` |

One thing this replaced outright: series and their names used to be two
index-coupled arrays, `series` beside `legend`, where `legend[1]` named
`series[0]` because `data` was series zero. A `Series` carries its own label.
The meter's `rings` array went the same way.

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
<Chart.Sparkline data={prices} width={80} />
```

Categories, ranked as rows rather than bars:

```tsx
<Chart.Bar data={spend} layout="horizontal" format={money}>
  <Chart.Bar.Categories />
</Chart.Bar>
```

Two series stacked, with a legend:

```tsx
<Chart.Bar variant="stacked">
  <Chart.Bar.Series data={sleep} label="Sleep" />
  <Chart.Bar.Series data={activity} label="Activity" />
  <Chart.Bar.Categories />
  <Chart.Bar.Legend />
</Chart.Bar>
```

One value against a target, as a gauge:

```tsx
<Chart.Meter shape="arc" value={712} max={850} warnAt={0.75} dangerAt={0.85}>
  <Chart.Meter.Value />
  <Chart.Meter.Label>Credit score</Chart.Meter.Label>
</Chart.Meter>
```

Every form that can be empty takes the same slot, and it replaces the chart
rather than sitting inside it. A meter is exempt — an empty meter is a zero —
and a heatmap only counts as empty with no data *and* no date range, because a
grid of empty squares is usually the data rather than the absence of it:

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

A second quantity that shares the x-axis but wants a different shape — volume
behind price, rainfall behind temperature:

```tsx
<Chart data={price} format={money}>
  <Chart.Value />
  <Chart.Plot>
    <Chart.Bars data={volume} />
  </Chart.Plot>
</Chart>
```

`Chart.Line` is the same idea for a second, third, nth line — each with its own
colour and name, all on the one scale:

```tsx
<Chart data={actual} format={money}>
  <Chart.Plot>
    <Chart.Line data={forecast} label="Forecast" dashed />
    <Chart.Line data={budget} label="Budget" />
  </Chart.Plot>
</Chart>
```

The marks are measured into the plot's own domain, so they agree about
what a height means — bars on a scale of their own would sit at plausible but
wrong heights, and nothing about the picture would say so. Scrubbing stays with
the root: one gesture for the plot, however many marks are in it.

### Linking two charts

`activeIndex` is an index into one chart's own series, so two charts sharing it
line up only if their points do. `activeAt` is resolved against each chart's own
`at` values instead, so linked charts agree about *when*:

```tsx
const [at, setAt] = useState<ChartPoint['at']>(undefined);

<Chart data={price}  activeAt={at} onScrub={(_, p) => setAt(p?.at)}>…</Chart>
<Chart data={volume} activeAt={at} onScrub={(_, p) => setAt(p?.at)}>…</Chart>
```

Each chart still owns its own gesture, so this is a synchronised crosshair —
scrub either, both follow — rather than one drag travelling between them.

## Props

Every prop each form accepts, read out of the source at build time — so this
cannot drift from the types. Presence is not here: what the chart *draws* is
named in the tree (see above), and these are the props that say how it behaves.

### Line chart (`Chart`)
| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `data` **·** required | `ChartData` | — | The series, oldest first. Bare numbers, or points carrying a time and a label. |
| `tone` | `ChartTone` | `'auto'` | `'auto'` tones by whether the series ended above or below `baseline`. Force it when the series' own direction isn't the story — e.g. spending, where "up" is bad. |
| `baseline` | `number` | — | Reference value for tone and for the dashed baseline. Defaults to the first point. |
| `density` | `ChartDensity` | `'default'` | Stroke, dot, and label weight. `'compact'` drops labels for inline use. |
| `format` | `(value: number) => string` | — | Formats every value in the subtree — readout, delta, reference label. |
| `formatAt` | `(at: ChartPoint['at'], point: ChartPoint) => string` | — | Formats a point's `at` for `Chart.Value`, so the readout can say *when*. |
| `periods` | `string[]` | `[]` | The period selector's options, e.g. `["1D", "1W", "1M"]`. Passing them is what makes `Chart.Periods` render anything. |
| `period` | `string` | — | The selected period. Controlled — pair it with `onPeriodChange`. |
| `onPeriodChange` | `(period: string) => void` | — | Called with the period a tap selected. The chart does not refetch; you swap `data`. |
| `activeIndex` | `number \| null` | — | Controlled scrub position. Leave undefined to let the chart hold it. |
| `activeAt` | `number \| string \| Date \| null` | — | Scrub position as an x-*value* rather than an index. `activeIndex` is an index into this chart's own series, so two charts sharing one only line up if their points line up — same length, same order… |
| `defaultActiveIndex` | `number \| null` | `null` | Where the scrub starts when it is uncontrolled. `null` means "show the last point". |
| `onScrub` | `(index: number \| null, point: ChartPoint \| null) => void` | — | Fires on every scrub change, controlled or not. `null` on release. |
| `loading` | `boolean` | `false` | Renders the plot's silhouette as a shimmer instead of the series. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Bars />` | `data` `color` `opacity` | A bar mark inside a plot. The combo chart: volume behind price, rainfall behind temperature — a second quantity that shares the x-axis and wants a different shape. |
| `<Chart.Line />` | `data` `color` `dashed` `label` | An *additional* line — a second, third, nth series on the same scale. |
| `<Chart.Baseline />` | — | The zero rule, drawn across the plot at the baseline value. |
| `<Chart.Reference />` | `value` `label` | A labelled dashed line at a value you name. Repeat it for several — a min and a max, say. |
| `<Chart.Crosshair />` | — | The scrub crosshair — the vertical rule and the dot that follow a finger. |
| `<Chart.Title />` | — | The chart's name, above the readout. |
| `<Chart.Value />` | — | The headline number — the scrubbed point's value, or the last one when nothing is being scrubbed. Rolls between values rather than snapping. |
| `<Chart.Delta />` | — | Change from the baseline to the shown point. Always renders an explicit sign — that sign is what keeps direction readable when the two tones are hard to tell apart, so don't strip it. |
| `<Chart.Plot />` | `height` `fill` `curve` `compare` `range` `children` `stack` `tooltip` `emptyLabel` `notEnoughLabel` `accessibilityLabel` `style` | The mark itself — the line, and whatever else is named inside it. |
| `<Chart.Periods />` | — | The range selector — `1D`, `1W`, `1M` and so on. |
| `<Chart.Empty />` | — | What the plot draws when the series is empty. |
| `<Chart.Legend />` | `items` `style` | A row of named swatches. Shared by every form that can show more than one series, so a legend reads the same under a plot as it does under a donut. |

### Chart.Plot
| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `height` | `number` | `180` | How tall the plot box is, in points. The width comes from the parent. |
| `fill` | `boolean` | `true` | Fade a gradient under the line. |
| `curve` | `ChartCurve` | `'steep'` | Straight segments (default) or a fitted spline. See `ChartCurve`. |
| `compare` | `ChartData` | — | One reference line, or several — the min/max pair a dense series reads against. A second series, drawn dashed in the neutral hue — the baseline a projection is measured against. |
| `range` | `ChartRange` | — | A shaded band between two bounds — the "likely range" behind a projection. A prop on `Chart.Plot` rather than a new form: the readout, the scrub, and the tone all still belong to the primary series. |
| `stack` | `readonly ChartData[]` | — | Series stacked on top of the primary — part-to-total over time, the shape a bar chart draws with `variant="stacked"` when the x-axis is continuous rather than categorical. |
| `tooltip` | `boolean` | `false` | Floating readout pill above the crosshair while scrubbing, showing the formatted value of the point under the finger. |
| `emptyLabel` | `string` | `'No data'` | Shown when the series is empty. `Chart.Empty` wins over this. |
| `notEnoughLabel` | `string` | `'Not enough data'` | Shown for a one-point series, which has no shape to draw. |
| `accessibilityLabel` | `string` | — | Announced by screen readers in place of the visual plot. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the plot box. |

### Chart.Bar
| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
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
| `accessibilityLabel` | `string` | — | Overrides the summary read to assistive tech, which otherwise describes the series. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Bar.Series />` | `data` `label` | One series. The first declares the categories; the rest ride on them. |
| `<Chart.Bar.Values />` | — | Prints each bar's value above it. Without it, only the selected bar shows a figure. |
| `<Chart.Bar.Categories />` | — | The category names — under the bars, or beside the rows when `layout="horizontal"`. |
| `<Chart.Bar.Baseline />` | — | The zero rule. Drawn only when the data crosses zero — an all-positive chart has its zero at the axis already. |
| `<Chart.Bar.Reference />` | `value` `label` | A labelled dashed line at a value you name — a target, a budget, an average. Adds to the zero rule rather than replacing it. |
| `<Chart.Bar.Legend />` | — | The series legend. It names each series from its `<Chart.Bar.Series label>`, so it draws nothing if none are labelled. |

### Chart.Sparkline
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Sparkline.EndDot />` | — | A dot on the final point, so the eye lands on where the series ended. |
| `<Chart.Sparkline.Extremes />` | — | Dots on the highest and lowest points, with their values. |
| `<Chart.Sparkline.Fill />` | — | A gradient wash under the line, fading to nothing at the bottom of the box. |

### Chart.Donut
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Donut.Value />` | `value` | The total in the middle of the ring, formatted with the chart's `format`. |
| `<Chart.Donut.Label />` | `children` | The line under the centre readout. Takes its text as children. |
| `<Chart.Donut.Legend />` | — | The slice legend, beneath the ring — each slice's name, colour, and value. |

### Chart.Meter
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Meter.Value />` | `value` | The value, as a figure. On a ring or arc it sits in the hole; on a bar it sits above the track. |
| `<Chart.Meter.Label />` | `children` | The name under the readout. Takes its text as children. |
| `<Chart.Meter.Ring />` | `value` `max` `min` `color` `label` | One concentric ring. Replaces an entry in the `rings` array. |

### Chart.Heatmap
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Heatmap.DayLabels />` | — | The weekday initials down the left edge of the grid. |
| `<Chart.Heatmap.Scale />` | — | The Less-to-More key under the grid, showing what each level of fill means. |

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
