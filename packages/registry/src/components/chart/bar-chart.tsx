/**
 * Arlo UI — BarChart
 *
 * Categorical magnitude: spend per day, sessions per channel. Bars are the right
 * form when the categories are discrete and the comparison is "which is bigger" —
 * use `Chart` instead when the x-axis is continuous time.
 *
 *   <BarChart data={[{ label: 'M', value: 32 }, { label: 'T', value: 18 }]} />
 *
 * Deliberate choices:
 *
 * - **Data-ends are rounded, the baseline end is not.** A bar is anchored to its
 *   axis; rounding the anchored end would lift it off and misreport where zero is.
 * - **Negatives drop below the baseline** rather than being drawn as magnitudes,
 *   and the baseline moves to wherever zero falls.
 * - **One hue by default.** A bar chart of one measure is magnitude, not identity,
 *   so it does not spend the categorical palette; pass `tone="series"` for the
 *   case where each bar really is a different thing.
 * - **Selection instead of hover.** Tapping a bar reports it and shows its value;
 *   there is no hover on a touch screen. The bars not selected fade to a light
 *   tint of their own colour rather than dropping out, so the shape of the whole
 *   series survives while one bar is being read.
 *
 * The bars themselves are drawn by `react-native-gifted-charts`. It renders no
 * accessibility semantics of its own, so the tap targets, labels, and value text
 * are a layer of this component's own on top — that layer is what screen readers
 * and tests see, and it is why the bars are `pointerEvents="none"`.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BarChart as GiftedBarChart } from 'react-native-gifted-charts';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';

export type BarDatum = {
  label: string;
  value: number;
  /** Overrides the resolved colour for this bar alone. */
  color?: string;
};

export type BarChartTone = 'brand' | 'series' | 'direction';

export type BarChartProps = {
  data: BarDatum[];
  height?: number;
  tone?: BarChartTone;
  /** Index of the selected bar. Leave undefined for an unselected chart. */
  selectedIndex?: number | null;
  onSelect?: (index: number, datum: BarDatum) => void;
  /**
   * Show every bar's value above it. Off by default — a number on every mark is
   * noise. The selected bar shows its value regardless, so selection is how you
   * read an exact figure.
   */
  showValues?: boolean;
  /** Show the category label under each bar. */
  showLabels?: boolean;
  format?: (value: number) => string;
  /** Force the top of the scale; otherwise it comes from the data. */
  maxValue?: number;
  style?: StyleProp<ViewStyle>;
};

const BAR_RADIUS = 4;
const GAP = 2;
/**
 * How much of an unselected bar's colour survives. Low enough that the selected
 * bar is unmistakably the subject, high enough that the others still read as
 * bars — for the default brand blue this lands on a light blue.
 */
const DIMMED_ALPHA = 0.22;
const LABEL_HEIGHT = 18;
const VALUE_HEIGHT = 16;

export function BarChart({
  data,
  height = 160,
  tone = 'brand',
  selectedIndex,
  onSelect,
  showValues = false,
  showLabels = true,
  format,
  maxValue,
  style,
}: BarChartProps) {
  const t = useTokens();
  const [width, setWidth] = useState(0);

  const series = useMemo(
    () => [t.colors.chartSeries1, t.colors.chartSeries2, t.colors.chartSeries3, t.colors.chartSeries4],
    [t.colors],
  );

  const { top, bottom } = useMemo(() => {
    if (data.length === 0) return { top: 0, bottom: 0 };
    let hi = 0;
    let lo = 0;
    for (const d of data) {
      if (d.value > hi) hi = d.value;
      if (d.value < lo) lo = d.value;
    }
    return { top: maxValue ?? hi, bottom: lo };
  }, [data, maxValue]);

  // The plot always includes zero, so bar lengths stay proportional to value.
  const span = top - bottom;
  const plotHeight = Math.max(0, height - (showLabels ? LABEL_HEIGHT : 0));

  // Value labels are drawn above the bar top and clipped at the top of the plot,
  // so the scale is stretched to keep the tallest bar a label's height short of
  // it. Bars stay proportional to each other — only the headroom changes.
  //
  // The room is reserved for any chart that could ever show a value, not just one
  // showing them now: a selection can put a label over the tallest bar, and
  // reserving on selection instead would resize every bar on each tap.
  const canShowValues = showValues || onSelect != null || selectedIndex !== undefined;
  const headroom =
    canShowValues && plotHeight > VALUE_HEIGHT ? plotHeight / (plotHeight - VALUE_HEIGHT) : 1;

  const barColor = useCallback(
    (index: number, datum: BarDatum) => {
      if (datum.color) return datum.color;
      if (tone === 'direction') {
        return datum.value < 0 ? t.colors.chartNegative : t.colors.chartPositive;
      }
      if (tone === 'series') {
        // Past the validated four, everything folds into one neutral rather than
        // cycling hues that would repeat identities.
        return index < series.length ? (series[index] as string) : t.colors.chartOther;
      }
      return t.colors.interactivePrimary;
    },
    [tone, series, t.colors],
  );

  const summary = `Bar chart, ${data.length} categories, ${data
    .map((d) => `${d.label} ${d.value}`)
    .join(', ')}`;

  // A container element and focusable children are mutually exclusive, so the
  // chart picks whichever is actually useful: when bars are tappable each one is
  // its own button, and when they aren't the whole chart is a single element
  // announcing the summary.
  const interactive = onSelect != null;

  // One slot per category, gaps included, so the drawn bars line up with the tap
  // targets stacked over them.
  const slot = data.length > 0 ? (width - GAP * (data.length - 1)) / data.length : 0;
  const barWidth = Math.max(0, slot);

  const giftedData = useMemo(
    () =>
      data.map((datum, index) => {
        const negative = datum.value < 0;
        const selected = selectedIndex === index;
        const dimmed = selectedIndex != null && !selected;
        const color = barColor(index, datum);
        return {
          value: datum.value,
          // A tint of the bar's own colour, not one flat grey — under `tone="series"`
          // each bar still has to read as its own category while dimmed.
          frontColor:
            dimmed && color.startsWith('#') ? rgbaFromHex(color, DIMMED_ALPHA) : color,
          opacity: dimmed && !color.startsWith('#') ? DIMMED_ALPHA : 1,
          // Only the data end is rounded — the baseline end stays square so the
          // bar reads as anchored to zero.
          barBorderTopLeftRadius: negative ? 0 : BAR_RADIUS,
          barBorderTopRightRadius: negative ? 0 : BAR_RADIUS,
          barBorderBottomLeftRadius: negative ? BAR_RADIUS : 0,
          barBorderBottomRightRadius: negative ? BAR_RADIUS : 0,
          label: showLabels ? datum.label : '',
          labelTextStyle: {
            color: selected ? t.colors.textPrimary : t.colors.textTertiary,
            fontFamily: t.fontFamilies.sans,
            fontSize: 11,
            fontWeight: selected ? ('700' as const) : ('500' as const),
            textAlign: 'center' as const,
          },
          topLabelComponent:
            showValues || selected
              ? () => (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: selected ? t.colors.textPrimary : t.colors.textSecondary,
                      fontFamily: t.fontFamilies.sans,
                      fontSize: 10,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    {format ? format(datum.value) : datum.value}
                  </Text>
                )
              : undefined,
        };
      }),
    [data, selectedIndex, barColor, showLabels, showValues, format, t.colors, t.fontFamilies.sans],
  );

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      accessible={!interactive}
      accessibilityRole={interactive ? undefined : 'image'}
      accessibilityLabel={interactive ? undefined : summary}
      style={[{ height, width: '100%' }, style]}
    >
      {width > 0 && data.length > 0 ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
          <GiftedBarChart
            data={giftedData}
            width={width}
            height={plotHeight}
            barWidth={barWidth}
            spacing={GAP}
            initialSpacing={0}
            endSpacing={0}
            // The plot always includes zero, so bar lengths stay proportional.
            maxValue={(span === 0 ? 1 : top) * headroom}
            mostNegativeValue={bottom}
            hideRules
            hideYAxisText
            yAxisThickness={0}
            yAxisLabelWidth={0}
            // A zero rule only earns its place when the data actually crosses it.
            xAxisThickness={bottom < 0 ? 1 : 0}
            xAxisColor={t.colors.border}
            xAxisLabelsHeight={showLabels ? LABEL_HEIGHT : 0}
            disableScroll
            isAnimated={false}
          />
        </View>
      ) : null}

      {/*
        Tap targets only. gifted-charts renders no accessibility semantics, so the
        bars are covered with one button per category. They are full-height columns
        on purpose: matching the bars' *widths* is enough for the target to land on
        the right category, and not matching their heights keeps this layer free of
        gifted-charts' internal vertical offsets, which are not public API.
      */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch', gap: GAP }}>
        {data.map((datum, index) => {
          const selected = selectedIndex === index;

          return (
            <Pressable
              key={`${datum.label}-${index}`}
              accessible={interactive}
              accessibilityRole={interactive ? 'button' : undefined}
              accessibilityLabel={
                interactive ? `${datum.label}, ${format ? format(datum.value) : datum.value}` : undefined
              }
              accessibilityState={interactive ? { selected } : undefined}
              disabled={!interactive}
              onPress={() => {
                // `selection`, not `impact` — picking one bar out of a row is the
                // same gesture as moving through a picker.
                void haptic('selection');
                onSelect?.(index, datum);
              }}
              style={{ flex: 1 }}
            />
          );
        })}
      </View>
    </View>
  );
}
