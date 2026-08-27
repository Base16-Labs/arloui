/**
 * Arlo UI — the empty slot every chart form shares.
 *
 * Failing to a blank rectangle is how a data screen looks broken, so "no data"
 * is a composed thing: a headline, one line, and one action. It lives here
 * rather than inside `Chart` because a bar chart with nothing in it is exactly
 * as empty as a plot with nothing in it, and the two should not say so
 * differently — a `Chart.Plot` offering "Log a transaction" beside a
 * `Chart.Bar` offering a grey "No data" is one screen speaking with two voices.
 */
import { type ReactNode } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

export type ChartEmptyProps = {
  /** The headline. One short statement of what is not here yet. */
  title?: string;
  /** One line on why, or on what will fill it. Kept to a single sentence. */
  description?: string;
  /** The one thing to do about it. Omit where there is nothing the reader can do. */
  action?: { label: string; onPress: () => void };
  /** Replaces the default glyph in the tile. */
  icon?: ReactNode;
  /** Drops the tile entirely, for a slot that is mostly words. */
  showIcon?: boolean;
  /** A fully custom slot. Wins over every prop above. */
  children?: ReactNode;
};

/** The default glyph: a series that has not happened yet. */
export function EmptyGlyph({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26">
      <Path
        d="M2,17 L8,11 L13,14 L21,5"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={21} cy={5} r={2} fill={color} />
    </Svg>
  );
}

/**
 * The rendered empty slot. Lives here rather than in `ChartEmpty` because the
 * plot draws it inside its own box — `ChartEmpty` only carries the configuration.
 */
export function EmptyContent({ title, description, action, icon, showIcon = true }: ChartEmptyProps) {
  const t = useTokens();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.spacing[4], gap: t.spacing[3] }}>
      {showIcon ? (
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: t.colors.surfaceRaised,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon ?? <EmptyGlyph color={t.colors.borderStrong} />}
        </View>
      ) : null}
      {title ? (
        <Text
          style={{
            color: t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.title3.fontSize,
            lineHeight: t.typography.title3.lineHeight,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text
          style={{
            color: t.colors.textSecondary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight * 1.15,
            textAlign: 'center',
            // A measure, not a width: centred text past ~40 characters a line
            // stops being scannable.
            maxWidth: 260,
          }}
        >
          {description}
        </Text>
      ) : null}
      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={action.onPress}
          hitSlop={8}
          style={({ pressed }) => ({
            marginTop: 2,
            opacity: pressed ? t.motion.pressed.opacity : 1,
            cursor: Platform.OS === 'web' ? 'pointer' : undefined,
          })}
        >
          <Text
            style={{
              color: t.colors.interactivePrimary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.bodySm.fontSize,
              lineHeight: t.typography.bodySm.lineHeight,
              fontWeight: '600',
            }}
          >
            {action.label} →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
