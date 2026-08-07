/**
 * Arlo UI — ListCard
 *
 * The workhorse row: something on the left, a title and a supporting line in the
 * middle, a value or affordance on the right. Transactions, settings, contacts,
 * search results.
 *
 *   <ListCard.Group>
 *     <ListCard leading={<Avatar />} title="Spotify" subtitle="Yesterday"
 *               value="−$9.99" chevron onPress={open} />
 *     <ListCard title="Transfer" subtitle="Mar 3" value="+$1,200" chevron />
 *   </ListCard.Group>
 *
 * `Group` is what makes rows read as one list: it draws the surface and the
 * hairlines *between* rows only, so the outer corners stay clean and there is no
 * stray rule above the first row or below the last. Rows used on their own get
 * their own surface instead.
 */
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import type { CardRadius, CardSpacing } from './card';

export type ListCardProps = {
  title: string;
  subtitle?: string;
  /** Leading slot — avatar, icon, thumbnail. */
  leading?: ReactNode;
  /** Trailing text, e.g. an amount. Rendered before the chevron. */
  value?: string;
  /** Secondary line under `value`. */
  valueCaption?: string;
  /** Tone for `value` — amounts usually want direction. */
  valueTone?: 'default' | 'positive' | 'negative';
  /** Arbitrary trailing slot. Replaces `value` when both are given. */
  trailing?: ReactNode;
  /** Show a disclosure chevron. Implies the row goes somewhere. */
  chevron?: boolean;
  disabled?: boolean;
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  /** Set by `ListCard.Group`; rows inside a group don't paint their own surface. */
  inGroup?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function ChevronIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6l6 6-6 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ListCardRow({
  title,
  subtitle,
  leading,
  value,
  valueCaption,
  valueTone = 'default',
  trailing,
  chevron = false,
  disabled = false,
  onPress,
  onLongPress,
  inGroup = false,
  accessibilityLabel,
  style,
}: ListCardProps) {
  const t = useTokens();
  const interactive = onPress != null || onLongPress != null;

  const valueColor =
    valueTone === 'positive'
      ? t.colors.chartPositive
      : valueTone === 'negative'
        ? t.colors.chartNegative
        : t.colors.textPrimary;

  const content = (
    <>
      {leading ? (
        <View style={{ flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>{leading}</View>
      ) : null}

      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text
          numberOfLines={1}
          style={{
            color: t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.body.fontSize,
            lineHeight: t.typography.body.lineHeight,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={{
              color: t.colors.textSecondary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.bodySm.fontSize,
              lineHeight: t.typography.bodySm.lineHeight,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing ?? (
        value != null ? (
          <View style={{ flexShrink: 0, alignItems: 'flex-end', gap: 2 }}>
            <Text
              numberOfLines={1}
              style={{
                color: valueColor,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.body.fontSize,
                lineHeight: t.typography.body.lineHeight,
                fontWeight: '600',
              }}
            >
              {value}
            </Text>
            {valueCaption ? (
              <Text
                numberOfLines={1}
                style={{
                  color: t.colors.textTertiary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  lineHeight: t.typography.bodySm.lineHeight,
                }}
              >
                {valueCaption}
              </Text>
            ) : null}
          </View>
        ) : null
      )}

      {chevron ? (
        <View style={{ flexShrink: 0 }}>
          <ChevronIcon color={t.colors.textTertiary} size={t.sizing.icon.sm} />
        </View>
      ) : null}
    </>
  );

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    minHeight: t.sizing.touchTarget.minimum,
    paddingVertical: t.spacing[3],
    paddingHorizontal: t.spacing[4],
    // Standalone rows carry their own surface; grouped rows inherit the group's.
    backgroundColor: inGroup ? 'transparent' : t.colors.surface,
    borderRadius: inGroup ? 0 : t.radii.xl,
    borderWidth: inGroup ? 0 : 1,
    borderColor: t.colors.border,
    opacity: disabled ? 0.45 : 1,
  };

  if (!interactive) {
    return <View style={[rowStyle, style]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        rowStyle,
        pressed && !disabled ? { backgroundColor: t.colors.surfaceInput } : null,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

/**
 * Wraps rows into one surface with hairlines between them. Separators go between
 * rows only — a rule above the first or below the last would fight the card edge.
 */
function ListCardGroup({
  children,
  margin = 'none',
  radius = 'xl',
  style,
}: {
  children: ReactNode;
  /** Outer spacing, matching `Card`'s scale. */
  margin?: CardSpacing;
  /** Corner rounding, matching `Card`'s scale. */
  radius?: CardRadius;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const marginValue = {
    none: 0,
    xs: t.spacing[2],
    sm: t.spacing[3],
    md: t.spacing[5],
    lg: t.spacing[6],
    xl: t.spacing[8],
  }[margin];
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListCardProps>[];

  return (
    <View
      style={[
        {
          backgroundColor: t.colors.surface,
          borderRadius: t.radii[radius],
          borderWidth: 1,
          borderColor: t.colors.border,
          margin: marginValue,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {rows.map((row, index) => (
        <View key={index}>
          {index > 0 ? (
            <View
              style={{
                height: 1,
                // Inset so the rule starts past the leading slot, like a native list.
                marginLeft: t.spacing[4],
                backgroundColor: t.colors.borderSecondary,
              }}
            />
          ) : null}
          {/* Rows can't know they're grouped, so the group tells them. */}
          {cloneElement(row, { inGroup: true })}
        </View>
      ))}
    </View>
  );
}

export const ListCard = Object.assign(ListCardRow, { Group: ListCardGroup });
