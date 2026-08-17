/**
 * Arlo UI — StatCard
 *
 * A single metric with its context: what it is, what it is now, and which way it
 * moved. The number rolls on the shared counter, so a stat that updates live
 * animates instead of snapping.
 *
 *   <StatCard label="Balance" value={12480.32} format={money}
 *             delta={412.19} trend={points} />
 *
 * The delta always renders a sign. The tone tokens it uses sit near the
 * deuteranopia separation floor, so the sign — not the colour — is what makes
 * direction readable. Passing `delta` without letting it show a sign is not an
 * option, by design.
 */
import { type ReactNode } from 'react';
import { Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { AnimatedCounter } from '../animated-counter/animated-counter';
import { Sparkline } from '../chart/sparkline';
import { useTokens } from '../../foundation/theme-provider';
import { Card, type CardProps } from './card';

export type StatCardProps = {
  label: string;
  value: number;
  /** Formats both the value and the delta. */
  format?: (value: number) => string;
  /** Change against the previous period. Rendered signed, never bare. */
  delta?: number;
  /** Show the delta as a percentage beside the absolute change. */
  deltaPercent?: number;
  /** Optional inline sparkline. Toned from `delta` when given, else from its own shape. */
  trend?: number[];
  /** Small glyph in the top-right — a category icon, a menu affordance. */
  icon?: ReactNode;
  /** Extra context under the value, e.g. "vs last month". */
  caption?: string;
  tone?: CardProps['tone'];
  surface?: CardProps['surface'];
  /** Inner padding, forwarded to `Card`. */
  padding?: CardProps['padding'];
  /** Outer spacing, forwarded to `Card`. */
  margin?: CardProps['margin'];
  /** Corner rounding, forwarded to `Card`. */
  radius?: CardProps['radius'];

  blurComponent?: CardProps['blurComponent'];
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
};

export function StatCard({
  label,
  value,
  format,
  delta,
  deltaPercent,
  trend,
  icon,
  caption,
  tone,
  surface,
  padding = 'md',
  margin,
  radius,
  blurComponent,
  onPress,
  style,
}: StatCardProps) {
  const t = useTokens();
  const hasDelta = delta != null && delta !== 0;
  const rising = (delta ?? 0) > 0;
  const deltaColor = hasDelta
    ? rising
      ? t.colors.chartPositive
      : t.colors.chartNegative
    : t.colors.textSecondary;
  // U+2212, not a hyphen — a hyphen reads as a dash at this size.
  const sign = delta == null || delta === 0 ? '' : rising ? '+' : '−';
  const deltaText = delta == null ? null : format ? format(Math.abs(delta)) : String(Math.abs(delta));

  return (
    <Card
      tone={tone}
      surface={surface}
      padding={padding}
      margin={margin}
      radius={radius}
      blurComponent={blurComponent}
      onPress={onPress}
      accessibilityLabel={onPress ? label : undefined}
      style={style}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Text
          numberOfLines={1}
          style={{
            flexShrink: 1,
            color: t.colors.textSecondary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight,
            fontWeight: '600',
          }}
        >
          {label}
        </Text>
        {icon ? <View style={{ marginLeft: t.spacing[2] }}>{icon}</View> : null}
      </View>

      <View style={{ alignItems: 'flex-start' }}>
        <AnimatedCounter
          text={format ? format(value) : String(value)}
          fontSize={t.typography.title1.fontSize}
          lineHeight={t.typography.title1.lineHeight}
          color={t.colors.textPrimary}
          fontFamily={t.fontFamilies.sans}
          fontWeight="700"
        />
      </View>

      {deltaText != null || trend || caption ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] }}>
          {deltaText != null ? (
            <Text
              style={{
                color: deltaColor,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
                fontWeight: '600',
              }}
            >
              {sign}
              {deltaText}
              {deltaPercent != null ? ` (${sign}${Math.abs(deltaPercent).toFixed(2)}%)` : ''}
            </Text>
          ) : null}

          {caption ? (
            <Text
              numberOfLines={1}
              style={{
                flexShrink: 1,
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {caption}
            </Text>
          ) : null}

          {trend && trend.length > 1 ? (
            <View style={{ flex: 1, minWidth: 48, alignItems: 'flex-end' }}>
              <Sparkline
                data={trend}
                height={24}
                // The delta is the source of truth for direction when it is given,
                // so the sparkline can't disagree with the number above it.
                tone={delta == null ? 'auto' : rising ? 'positive' : 'negative'}
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
