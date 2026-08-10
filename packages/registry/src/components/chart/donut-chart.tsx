/**
 * Arlo UI — DonutChart
 *
 * Part-to-whole: what a total is made of. Use it when the parts sum to something
 * meaningful and there are only a few of them — past a handful, a bar chart ranks
 * better than a ring compares.
 *
 *   <DonutChart data={[{ label: 'Rent', value: 1200 }, { label: 'Food', value: 480 }]} />
 *
 * Deliberate choices:
 *
 * - **Four categories, then "Other".** The categorical palette has exactly four
 *   validated slots (see the `chartSeries*` tokens); every slice is on screen at
 *   once here, so they were checked on all pairs, not just neighbours. Anything
 *   past the fourth is summed into a neutral "Other" rather than given an
 *   invented fifth hue.
 * - **The legend is not optional.** Two or more series means identity can never be
 *   colour alone, so each slice is listed with its label and value.
 * - **A surface-coloured gap between slices**, so touching arcs stay separable
 *   even when two colours are close.
 * - **Center label, not slice labels.** Text inside thin arcs is unreadable; the
 *   middle holds the total.
 * - **The hole is painted, not cut.** `react-native-gifted-charts` draws a full
 *   pie and covers the middle with an opaque disc, so the ring only reads as a
 *   ring when that disc matches what is behind the chart. It defaults to the
 *   screen background; pass `centerColor` when the donut sits on anything else,
 *   a card for instance.
 *
 * The ring is drawn by `react-native-gifted-charts`. It exposes no accessibility
 * semantics, so the summary and the legend below are this component's own — the
 * legend is also what carries selection, since arcs are poor tap targets.
 */
import { useMemo, useState } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';

export type DonutSlice = {
  label: string;
  value: number;
  color?: string;
};

export type DonutChartProps = {
  data: DonutSlice[];
  size?: number;
  /** Ring thickness. */
  thickness?: number;
  /** Big text in the middle. Defaults to the summed total. */
  centerValue?: string;
  centerLabel?: string;
  /** Index of the emphasised slice. */
  selectedIndex?: number | null;
  onSelect?: (index: number, slice: DonutSlice) => void;
  format?: (value: number) => string;
  showLegend?: boolean;
  /**
   * Fill for the middle of the ring. Must match whatever the chart sits on —
   * gifted-charts paints the hole rather than cutting it. Defaults to the screen
   * background.
   */
  centerColor?: string;
  /** Categories past the palette's capacity are folded into one neutral slice. */
  maxSlices?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Gap between slices, painted as a stroke in the surface colour. */
const GAP_WIDTH = 2;

/** Unselected slices fade to this, so the selected one reads as the subject. */
const DIMMED_ALPHA = 0.35;

export function DonutChart({
  data,
  size = 180,
  thickness = 26,
  centerValue,
  centerLabel,
  selectedIndex,
  onSelect,
  format,
  showLegend = true,
  centerColor,
  maxSlices = 4,
  accessibilityLabel,
  style,
}: DonutChartProps) {
  const t = useTokens();
  const [internalSelection, setInternalSelection] = useState<number | null>(null);
  const selection = selectedIndex !== undefined ? selectedIndex : internalSelection;

  const palette = useMemo(
    () => [t.colors.chartSeries1, t.colors.chartSeries2, t.colors.chartSeries3, t.colors.chartSeries4],
    [t.colors],
  );

  // Fold everything past the palette's validated capacity into one neutral slice
  // rather than inventing hues that would read as new identities.
  const slices = useMemo(() => {
    const positive = data.filter((d) => d.value > 0);
    const cap = Math.min(maxSlices, palette.length);
    if (positive.length <= cap) return positive;
    const kept = positive.slice(0, cap);
    const rest = positive.slice(cap).reduce((sum, d) => sum + d.value, 0);
    return rest > 0 ? [...kept, { label: 'Other', value: rest, color: t.colors.chartOther }] : kept;
  }, [data, maxSlices, palette.length, t.colors.chartOther]);

  const total = slices.reduce((sum, s) => sum + s.value, 0);

  const outer = size / 2;
  const inner = Math.max(0, outer - thickness);

  const segments = useMemo(() => {
    if (total <= 0) return [];
    return slices.map((slice, index) => ({
      slice,
      index,
      color:
        slice.color ?? (index < palette.length ? (palette[index] as string) : t.colors.chartOther),
      percent: (slice.value / total) * 100,
    }));
  }, [slices, total, palette, t.colors.chartOther]);

  const pieData = useMemo(
    () =>
      segments.map((segment) => ({
        value: segment.slice.value,
        // Dimming is expressed in the colour because pie slices take no opacity.
        color:
          selection == null || selection === segment.index
            ? segment.color
            : segment.color.startsWith('#')
              ? rgbaFromHex(segment.color, DIMMED_ALPHA)
              : segment.color,
        // Surface-coloured ring keeps adjacent arcs separable.
        strokeColor: t.colors.surface,
        strokeWidth: segments.length > 1 ? GAP_WIDTH : 0,
      })),
    [segments, selection, t.colors.surface],
  );

  const summary =
    accessibilityLabel ??
    `Donut chart. ${slices
      .map((s) => `${s.label} ${total > 0 ? Math.round((s.value / total) * 100) : 0} percent`)
      .join(', ')}`;

  const resolvedCenterValue = centerValue ?? (format ? format(total) : String(total));

  return (
    <View style={[{ gap: t.spacing[4] }, style]}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={summary}
        style={{ width: size, height: size, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
      >
        {segments.length > 0 ? (
          <View style={{ position: 'absolute' }} pointerEvents="none">
            <PieChart
              data={pieData}
              donut
              radius={outer}
              innerRadius={inner}
              // Painted, not cut — see the note at the top of the file.
              innerCircleColor={centerColor ?? t.colors.bg}
              isAnimated={false}
            />
          </View>
        ) : (
          <View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: thickness,
              borderColor: t.colors.surfaceInput,
            }}
          />
        )}

        <View style={{ alignItems: 'center', paddingHorizontal: thickness }}>
          <Text
            numberOfLines={1}
            style={{
              color: t.colors.textPrimary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.title2.fontSize,
              lineHeight: t.typography.title2.lineHeight,
              fontWeight: '700',
            }}
          >
            {resolvedCenterValue}
          </Text>
          {centerLabel ? (
            <Text
              numberOfLines={1}
              style={{
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {centerLabel}
            </Text>
          ) : null}
        </View>
      </View>

      {showLegend && segments.length > 0 ? (
        <View style={{ gap: t.spacing[2] }}>
          {segments.map((segment) => {
            const selected = selection === segment.index;
            return (
              <Pressable
                key={`legend-${segment.slice.label}-${segment.index}`}
                accessibilityRole="button"
                accessibilityLabel={`${segment.slice.label}, ${
                  format ? format(segment.slice.value) : segment.slice.value
                }, ${segment.percent.toFixed(0)} percent`}
                accessibilityState={{ selected }}
                disabled={!onSelect && selectedIndex !== undefined}
                onPress={() => {
                  void haptic('selection');
                  if (onSelect) onSelect(segment.index, segment.slice);
                  else setInternalSelection(selected ? null : segment.index);
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: segment.color,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    // Text stays in ink; the swatch beside it carries identity.
                    color: t.colors.textPrimary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                    lineHeight: t.typography.bodySm.lineHeight,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {segment.slice.label}
                </Text>
                <Text
                  style={{
                    color: t.colors.textSecondary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                    lineHeight: t.typography.bodySm.lineHeight,
                    fontWeight: '600',
                  }}
                >
                  {format ? format(segment.slice.value) : segment.slice.value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
