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
 */
import { useMemo, useState } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
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
  /** Categories past the palette's capacity are folded into one neutral slice. */
  maxSlices?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Gap between slices, in degrees, painted as a stroke in the surface colour. */
const GAP_DEGREES = 1.5;

function polar(cx: number, cy: number, r: number, degrees: number) {
  const rad = ((degrees - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG path for one ring segment between two angles. */
function arcPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;
  // A full ring can't be drawn as one arc — the start and end points coincide, so
  // it collapses. Split it into two halves.
  if (sweep >= 360) {
    const half = startAngle + 180;
    return `${arcPath(cx, cy, outer, inner, startAngle, half)} ${arcPath(cx, cy, outer, inner, half, startAngle + 360)}`;
  }
  const largeArc = sweep > 180 ? 1 : 0;
  const o1 = polar(cx, cy, outer, startAngle);
  const o2 = polar(cx, cy, outer, endAngle);
  const i2 = polar(cx, cy, inner, endAngle);
  const i1 = polar(cx, cy, inner, startAngle);
  return [
    `M${o1.x.toFixed(2)},${o1.y.toFixed(2)}`,
    `A${outer},${outer} 0 ${largeArc} 1 ${o2.x.toFixed(2)},${o2.y.toFixed(2)}`,
    `L${i2.x.toFixed(2)},${i2.y.toFixed(2)}`,
    `A${inner},${inner} 0 ${largeArc} 0 ${i1.x.toFixed(2)},${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

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

  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2;
  const inner = Math.max(0, outer - thickness);

  const segments = useMemo(() => {
    if (total <= 0) return [];
    let cursor = 0;
    return slices.map((slice, index) => {
      const sweep = (slice.value / total) * 360;
      const start = cursor;
      cursor += sweep;
      // Only inset for a gap when the slice is wide enough to survive it.
      const gap = slices.length > 1 && sweep > GAP_DEGREES * 2 ? GAP_DEGREES / 2 : 0;
      return {
        slice,
        index,
        d: arcPath(cx, cy, outer, inner, start + gap, cursor - gap),
        color:
          slice.color ??
          (index < palette.length ? (palette[index] as string) : t.colors.chartOther),
        percent: (slice.value / total) * 100,
      };
    });
  }, [slices, total, cx, cy, outer, inner, palette, t.colors.chartOther]);

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
          <Svg width={size} height={size} style={{ position: 'absolute' }}>
            <G>
              {segments.map((segment) => (
                <Path
                  key={`${segment.slice.label}-${segment.index}`}
                  d={segment.d}
                  fill={segment.color}
                  opacity={selection == null || selection === segment.index ? 1 : 0.35}
                  // Surface-coloured ring keeps adjacent arcs separable.
                  stroke={t.colors.surface}
                  strokeWidth={1}
                />
              ))}
            </G>
          </Svg>
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
