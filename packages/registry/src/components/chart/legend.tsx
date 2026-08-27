/**
 * Arlo UI — Chart.Legend
 *
 * The identity row every multi-series form shares: `Chart.Bar` with two series,
 * `Chart.Plot` with a `compare` line or a `range` band. Swatch and label, laid
 * out in the order the series are drawn, because a legend that reads in a
 * different order than the marks is worse than none.
 *
 * It exists as a standalone export because the compare plot composes its own
 * chrome — the legend can't live inside the plot there — while `Chart.Bar`
 * mounts the same component when given `legend` labels. One legend, so both
 * forms read the same.
 *
 * Identity is never colour alone: the label is the identity, the swatch is the
 * pointer. That is also why there is no icon-only or swatch-only mode.
 */
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type ChartLegendItem = {
  label: string;
  color: string;
  /** Lowers the swatch to match a band drawn at reduced opacity. */
  faded?: boolean;
};

export type ChartLegendProps = {
  items: readonly ChartLegendItem[];
  style?: StyleProp<ViewStyle>;
};

export function ChartLegend({ items, style }: ChartLegendProps) {
  const t = useTokens();
  if (items.length === 0) return null;

  return (
    <View
      accessibilityRole="text"
      style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: t.spacing[4] }, style]}
    >
      {items.map((item) => (
        <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              backgroundColor: item.color,
              opacity: item.faded ? 0.18 : 1,
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              color: t.colors.textSecondary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.bodySm.fontSize,
              lineHeight: t.typography.bodySm.lineHeight,
              fontWeight: '600',
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
