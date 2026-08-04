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
 *   there is no hover on a touch screen.
 */
import { useMemo, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
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
  /** Show each bar's value above it. Off by default — a number on every mark is noise. */
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
  const plotHeight = Math.max(
    0,
    height - (showLabels ? LABEL_HEIGHT : 0) - (showValues ? VALUE_HEIGHT : 0),
  );
  const zeroY = span === 0 ? plotHeight : (top / span) * plotHeight;

  function barColor(index: number, datum: BarDatum) {
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
  }

  const summary = `Bar chart, ${data.length} categories, ${data
    .map((d) => `${d.label} ${d.value}`)
    .join(', ')}`;

  // A container element and focusable children are mutually exclusive, so the
  // chart picks whichever is actually useful: when bars are tappable each one is
  // its own button, and when they aren't the whole chart is a single element
  // announcing the summary.
  const interactive = onSelect != null;

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      accessible={!interactive}
      accessibilityRole={interactive ? undefined : 'image'}
      accessibilityLabel={interactive ? undefined : summary}
      style={[{ height, width: '100%' }, style]}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch', gap: GAP }}>
        {data.map((datum, index) => {
          const selected = selectedIndex === index;
          const negative = datum.value < 0;
          const magnitude = span === 0 ? 0 : (Math.abs(datum.value) / span) * plotHeight;
          const color = barColor(index, datum);

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
              onPress={() => onSelect?.(index, datum)}
              style={{ flex: 1, justifyContent: 'flex-end' }}
            >
              {showValues ? (
                <Text
                  numberOfLines={1}
                  style={{
                    height: VALUE_HEIGHT,
                    textAlign: 'center',
                    color: t.colors.textSecondary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: 10,
                    lineHeight: VALUE_HEIGHT,
                    fontWeight: '600',
                  }}
                >
                  {format ? format(datum.value) : datum.value}
                </Text>
              ) : null}

              <View style={{ height: plotHeight, justifyContent: 'flex-start' }}>
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    // Negatives hang below zero; positives rise to it.
                    top: negative ? zeroY : zeroY - magnitude,
                    height: Math.max(2, magnitude),
                    backgroundColor: color,
                    // Only the data end is rounded — the baseline end stays square
                    // so the bar reads as anchored to zero.
                    borderTopLeftRadius: negative ? 0 : BAR_RADIUS,
                    borderTopRightRadius: negative ? 0 : BAR_RADIUS,
                    borderBottomLeftRadius: negative ? BAR_RADIUS : 0,
                    borderBottomRightRadius: negative ? BAR_RADIUS : 0,
                    opacity: selectedIndex == null || selected ? 1 : 0.4,
                  }}
                />
              </View>

              {showLabels ? (
                <Text
                  numberOfLines={1}
                  style={{
                    height: LABEL_HEIGHT,
                    textAlign: 'center',
                    color: selected ? t.colors.textPrimary : t.colors.textTertiary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: 11,
                    lineHeight: LABEL_HEIGHT,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {datum.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* A zero rule only earns its place when the data actually crosses it. */}
      {bottom < 0 && width > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: (showValues ? VALUE_HEIGHT : 0) + zeroY,
            height: 1,
            backgroundColor: t.colors.border,
          }}
        />
      ) : null}
    </View>
  );
}
