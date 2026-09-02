/**
 * Arlo UI — Chart readouts
 *
 * The text that sits above and below the plot: the rolling value, the signed
 * delta against the baseline, and the period selector. They read the scrub
 * position out of context rather than taking it as props, so any of them can be
 * dropped or reordered without the others noticing.
 */
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Platform, Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { AnimatedCounter } from '../animated-counter';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import { toneColor } from './core';
import { useChart } from './chart-context';
import { SkeletonBlock } from './skeleton';

/**
 * The headline number — the scrubbed point's value, or the last one when
 * nothing is being scrubbed. Rolls between values rather than snapping.
 */
export function ChartValue({
  format: formatProp,
  /** Show the active point's `at` under the number. Needs `formatAt` on the root. */
  showAt = true,
  style,
}: {
  format?: (value: number) => string;
  showAt?: boolean;
  /** Wraps the counter, so this is a view style — the type ramp comes from tokens. */
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const { points, displayIndex, format: contextFormat, formatAt, loading } = useChart();
  const format = formatProp ?? contextFormat;
  const point = points[displayIndex];
  const value = point?.value ?? 0;
  const text = format ? format(value) : String(value);

  // The "when" line: whatever `formatAt` makes of the point's timestamp, else the
  // point's own label. Only rendered if one of them actually says something.
  const caption =
    showAt && point ? (formatAt ? formatAt(point.at, point) : point.label) : undefined;

  if (loading) {
    return (
      <View style={[{ alignItems: 'flex-start', gap: 6 }, style]}>
        <SkeletonBlock width={150} height={26} radius={7} />
      </View>
    );
  }

  return (
    <View style={[{ alignItems: 'flex-start' }, style]}>
      <AnimatedCounter
        text={text}
        fontSize={t.typography.displayMedium.fontSize}
        lineHeight={t.typography.displayMedium.lineHeight}
        // Ink, not the series colour — the line already carries direction.
        color={t.colors.textPrimary}
        fontFamily={t.fontFamilies.sans}
        fontWeight="700"
      />
      {caption ? (
        <Text
          style={{
            color: t.colors.textSecondary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight,
          }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Change from the baseline to the shown point. Always renders an explicit sign —
 * that sign is what keeps direction readable when the two tones are hard to tell
 * apart, so don't strip it.
 */
export function ChartDelta({
  format: formatProp,
  showPercent = true,
  style,
}: {
  format?: (value: number) => string;
  showPercent?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const t = useTokens();
  const { points, displayIndex, baseline, color, format: contextFormat, loading } = useChart();
  const format = formatProp ?? contextFormat;
  const value = points[displayIndex]?.value ?? 0;
  const change = value - baseline;
  const sign = change > 0 ? '+' : change < 0 ? '−' : '';
  const magnitude = Math.abs(change);
  const percent = baseline === 0 ? 0 : (change / Math.abs(baseline)) * 100;
  const formatted = format ? format(magnitude) : String(magnitude);

  // A signed delta is a claim about direction. There is nothing to claim yet.
  if (loading) return <SkeletonBlock width={96} height={13} radius={5} />;

  return (
    <Text
      style={[
        {
          color,
          fontFamily: t.fontFamilies.sans,
          fontSize: t.typography.body.fontSize,
          lineHeight: t.typography.body.lineHeight,
          fontWeight: '600',
        },
        style,
      ]}
    >
      {sign}
      {formatted}
      {showPercent ? ` (${sign}${Math.abs(percent).toFixed(2)}%)` : ''}
    </Text>
  );
}

/**
 * The range selector — `1D`, `1W`, `1M` and so on.
 *
 * It renders nothing unless the root was given `periods`. Selecting one calls
 * `onPeriodChange`; swapping the data is yours to do, and the plot tweens
 * between the old series and the new.
 */
export function ChartPeriods({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const { periods, period, onPeriodChange, color, loading } = useChart();
  if (periods.length === 0) return null;

  /*
   * Skeleton pills while loading, not a live selector.
   *
   * A pressable period row over a chart that has no series lets the reader ask
   * for 1Y and get the same shimmer back, so the control reads as broken. It
   * keeps the row's exact footprint so nothing reflows when the data lands.
   */
  if (loading) {
    return (
      <View
        // Not a tablist while there is nothing to select between.
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
        style={[{ flexDirection: 'row', alignItems: 'center', gap: 6 }, style]}
      >
        {periods.map((option) => (
          <View key={option} style={{ flex: 1 }}>
            <SkeletonBlock width="100%" height={26} radius={t.radii.md} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View
      accessibilityRole="tablist"
      style={[{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[1] }, style]}
    >
      {periods.map((option) => {
        const selected = option === period;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityLabel={option}
            accessibilityState={{ selected }}
            onPress={() => {
              void haptic('selection');
              onPeriodChange?.(option);
            }}
            hitSlop={8}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 32,
              paddingHorizontal: t.spacing[2],
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: t.radii.md,
              backgroundColor: selected ? t.colors.surfaceInput : 'transparent',
              // The control answers instantly; the series it selects is what takes
              // `motion.chart.data` to morph.
              opacity: pressed ? t.motion.pressed.opacity : 1,
              cursor: Platform.OS === 'web' ? 'pointer' : undefined,
            })}
          >
            <Text
              style={{
                color: selected ? color : t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
                fontWeight: selected ? '700' : '500',
              }}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * The plot and the pieces that compose inside it.
 *
 * The `Chart` namespace — this root plus the five standalone forms — is
 * assembled in `index.ts` rather than here. It used to be built in this file,
 * which meant `chart.tsx` imported the bar chart, the donut, the meter, the
 * sparkline and the heatmap purely to hang them off an object. Nothing here
 * *used* them, but the import graph did not know that: taking `Chart.Plot`
 * pulled in every form in the kit, and the registry had no way to offer one
 * chart without shipping all thirteen files.
 */

/**
 * The chart's name, above the readout.
 *
 * Information rather than furniture, so it belongs to the root rather than the
 * plot. It takes its text as children the way `Chart.Empty` does — a title is a
 * string often enough that making it a prop of something else would be worse.
 */
export function ChartTitle({ children, style }: { children?: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTokens();
  if (children == null) return null;
  return (
    <Text
      style={[
        {
          color: t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          fontSize: t.typography.bodySm.fontSize,
          lineHeight: t.typography.bodySm.lineHeight,
          fontWeight: '600',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
