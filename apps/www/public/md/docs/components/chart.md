# Chart

> Charts for trends, category comparisons, proportions, progress toward a target, and daily activity. Install each chart separately or use the complete Chart namespace.

**Type:** Component  
**Category:** Data  
**Source:** https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chart

## On this page

- Overview
- When to use
- Get started
- Composition
- API reference
- Loading and empty states
- Accessibility
- Limitations

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

## Overview

ArloUI provides six chart types. Each chart can be installed separately or accessed through the Chart namespace.

- [Line chart](/docs/components/chart-line): Display changes over time. Users can drag across the chart to inspect individual values and select a period to view a different date range.
- [Bar](/docs/components/chart-bar): Compare values across categories using vertical or horizontal bars. Group series side by side or stack them to show a combined total.
- [Sparkline](/docs/components/chart-sparkline): Show a compact trend beside a metric in a list row, table, or summary card. Sparklines do not include axes or touch-based value inspection.
- [Donut](/docs/components/chart-donut): Show how categories contribute to a total. Display up to four named categories, with additional categories combined into Other.
- [Meter](/docs/components/chart-meter): Display a value within a defined range using a bar, ring, or arc. Optional thresholds change the color at warning and danger levels.
- [Heatmap](/docs/components/chart-heatmap): Display daily activity in a calendar grid. Color intensity represents the value for each day.

## When to use

Choose a chart based on the comparison or pattern users need to understand.

| The reader asks | Reach for |
| --- | --- |
| How has this moved? | Line chart |
| How do these compare? | Bar |
| Which way is this going? | Sparkline |
| What is this made of? | Donut |
| How close am I? | Meter |
| Did I show up? | Heatmap |

- **Use a numeric readout for a single value.** Use Meter when the value has a target or limit. Use a text readout when there is no series or range to display.
- **Use Line chart for trends and Bar for category comparisons.** Line chart shows changes across an ordered sequence. Bar compares values across distinct categories.
- **Use Sparkline for compact trends.** Use Sparkline beside a metric in a list or table. Use Line chart when users need to inspect individual values.
- **Use Bar when all categories need individual labels.** Donut combines categories beyond its slice limit into Other. Bar keeps each category visible.
- **Use Heatmap for daily activity.** The calendar heatmap does not support an arbitrary matrix of categories.

## Get started

Install only the chart you need. The CLI copies editable source files into your project; it does not install npm dependencies automatically.

```bash
npx arloui init
npx arloui add chart-line
```

For Expo projects, use Expo to select compatible native dependencies. Reanimated and Worklets are required even when chart motion is disabled. Check the compatibility guide before using an older React Native project.

```bash
npx expo install react-native-svg react-native-reanimated react-native-worklets expo-haptics
```

After setting up the theme provider, render a line chart with a value formatter. These import paths match the default arlo.json aliases.

```tsx
import { LineChart } from '@/components/ui/chart/chart';
import { formatMoney } from '@/components/ui/chart/format';

const points = [912, 946, 934, 995, 1031, 1094, 1156];
const money = formatMoney('USD');

export default function BalanceChart() {
  return <LineChart data={points} format={money} />;
}
```

Use npx arloui add chart to install all six types and the Chart namespace. Individual chart pages list their standalone installation commands, data requirements, and APIs.

Install all chart types:

```bash
npx arloui add chart
```

To install only one chart, use its registry entry:

- Line chart: `npx arloui add chart-line`
- Bar: `npx arloui add chart-bar`
- Sparkline: `npx arloui add chart-sparkline`
- Donut: `npx arloui add chart-donut`
- Meter: `npx arloui add chart-meter`
- Heatmap: `npx arloui add chart-heatmap`

Each chart page includes its direct import path and examples. The full chart installation exposes the Chart namespace; standalone installations expose the component directly.

## Composition

Without children, a chart uses its default layout. Add child components to customize optional elements such as the value readout, legend, category labels, and reference lines.

For Line chart, place Value, Delta, and Periods inside LineChart. Place reference lines and the crosshair inside LineChart.Plot. The Chart export remains available for existing code. Other chart types expose their own child components, listed in the API reference.

## API reference

### Line chart (`LineChart`)
| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
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
| `loading` | `boolean` | `false` | Reserves the plot with a neutral pulsing placeholder until data is ready. |
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the chart's outer container. |
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<LineChart.Bars />` | `data` `color` `opacity` | A bar mark inside a plot. The combo chart: volume behind price, rainfall behind temperature — a second quantity that shares the x-axis and wants a different shape. |
| `<LineChart.Line />` | `data` `color` `dashed` `label` | An *additional* line — a second, third, nth series on the same scale. |
| `<LineChart.Baseline />` | — | The zero rule, drawn across the plot at the baseline value. |
| `<LineChart.Reference />` | `value` `label` | A labelled dashed line at a value you name. Repeat it for several — a min and a max, say. |
| `<LineChart.Crosshair />` | — | The scrub crosshair — the vertical rule and the dot that follow a finger. |
| `<LineChart.Title />` | — | The chart's name, above the readout. |
| `<LineChart.Value />` | — | The headline number — the scrubbed point's value, or the last one when nothing is being scrubbed. Rolls between values rather than snapping. |
| `<LineChart.Delta />` | — | Change from the baseline to the shown point. Always renders an explicit sign — that sign is what keeps direction readable when the two tones are hard to tell apart, so don't strip it. |
| `<LineChart.Plot />` | `height` `fill` `curve` `compare` `range` `children` `stack` `stackColors` `tooltip` `emptyLabel` `notEnoughLabel` `accessibilityLabel` `style` | The mark itself — the line, and whatever else is named inside it. |
| `<LineChart.Periods />` | — | The range selector — `1D`, `1W`, `1M` and so on. |
| `<LineChart.Empty />` | — | What the plot draws when the series is empty. |
| `<LineChart.Legend />` | `items` `style` | A row of named swatches. Shared by every form that can show more than one series, so a legend reads the same under a plot as it does under a donut. |

### LineChart.Plot
| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `height` | `number` | `180` | How tall the plot box is, in points. The width comes from the parent. |
| `fill` | `boolean` | `true` | Fade a gradient under the line. |
| `curve` | `ChartCurve` | `'steep'` | Straight segments (default) or a fitted spline. See `ChartCurve`. |
| `compare` | `ChartData` | — | One reference line, or several — the min/max pair a dense series reads against. A second series, drawn dashed in the neutral hue — the baseline a projection is measured against. |
| `range` | `ChartRange` | — | A shaded band between two bounds — the "likely range" behind a projection. A prop on `Chart.Plot` rather than a new form: the readout, the scrub, and the tone all still belong to the primary series. |
| `stack` | `readonly ChartData[]` | — | Series stacked on top of the primary — part-to-total over time, the shape a bar chart draws with `variant="stacked"` when the x-axis is continuous rather than categorical. |
| `stackColors` | `readonly string[]` | — | Stacked-series colors, primary first. Missing slots use the theme palette. |
| `tooltip` | `boolean` | `false` | Floating readout pill above the crosshair while scrubbing, showing the formatted value of the point under the finger. |
| `emptyLabel` | `string` | `'No data'` | Shown when the series is empty. `Chart.Empty` wins over this. |
| `notEnoughLabel` | `string` | `'Not enough data'` | Shown for a one-point series, which has no shape to draw. |
| `accessibilityLabel` | `string` | — | Announced by screen readers in place of the visual plot. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the plot box. |

### Chart.Bar
| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `animated` | `boolean` | — | Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. |
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
| `refreshing` | `boolean` | `false` | Keep the last supplied data visible during a background fetch. Overrides loading. |
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
| `<Chart.Bar.Legend />` | — | The series legend. Unnamed series use their position, such as Series 1. |

### Chart.Sparkline
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Sparkline.EndDot />` | — | A dot on the final point, so the eye lands on where the series ended. |
| `<Chart.Sparkline.Extremes />` | — | Dots on the highest and lowest points, with their values. |
| `<Chart.Sparkline.Fill />` | — | A gradient wash under the line, fading to nothing at the bottom of the box. |

### Chart.Donut
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Donut.Value />` | `value` | The total in the middle of the ring, formatted with the chart's `format`. |
| `<Chart.Donut.Label />` | `children` | The line under the centre readout. Takes its text as children. |
| `<Chart.Donut.Legend />` | — | The slice legend, beneath the ring — each slice's name, colour, and value. |

### Chart.Meter
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Meter.Value />` | `value` | The value, as a figure. On a ring or arc it sits in the hole; on a bar it sits above the track. |
| `<Chart.Meter.Label />` | `children` | The name under the readout. Takes its text as children. |
| `<Chart.Meter.Ring />` | `value` `max` `min` `color` `label` | One concentric ring. Replaces an entry in the `rings` array. |

### Chart.Heatmap
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
**Parts** — name one and it is drawn; name none and you get the default composition.
| Part | Takes | What it draws |
| --- | --- | --- |
| `<Chart.Heatmap.DayLabels />` | — | The weekday initials down the left edge of the grid. |
| `<Chart.Heatmap.Scale />` | — | The Less-to-More key under the grid, showing what each level of fill means. |

## Loading and empty states

Use loading for the initial fetch, when no data is available. Neutral placeholders use a subtle pulse and fade out before the chart enters. During later fetches, pass refreshing and keep supplying the last successful data; the chart stays visible and is marked busy for assistive technology. Charts hide data-dependent readouts only during initial loading. An empty dataset displays an empty state rather than a value of zero. Meter represents a value within a range and does not have an empty-dataset state.

Sparkline supports a compact empty label. Heatmap can still display a calendar without data when an explicit date range is provided.

## Accessibility

Provide meaningful labels and value formatters. Keep important values available as text, and use a data table when users need access to every value.

Use labels or numeric values alongside status colors. Chart animations respect the reduced-motion setting.

## Limitations

The supplied chart types do not include candlestick, radar, scatter, or arbitrary matrix heatmaps. Shared geometry helpers are available for custom chart implementations.

## Links

- [Source](https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chart)

---
Source: https://arloui.com
