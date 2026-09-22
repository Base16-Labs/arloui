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
import { OutlineChartLine } from '@arloui/icons/OutlineChartLine';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTokens } from '../../foundation/theme-provider';
import { useChartEntrance } from './hooks';

export type ChartEmptyProps = {
  /** The headline. One short statement of what is not here yet. */
  title?: string;
  /** One line on why, or on what will fill it. Kept to a single sentence. */
  description?: string;
  /** The one thing to do about it. Omit where there is nothing the reader can do. */
  action?: { label: string; onPress: () => void };
  /** Replaces the default chart icon. */
  icon?: ReactNode;
  /** Drops the icon entirely, for a slot that is mostly words. */
  showIcon?: boolean;
  /** A fully custom slot. Wins over every prop above. */
  children?: ReactNode;
};

/**
 * The default empty glyph. It draws in once — 0 to 100 of the series, left to
 * right, the same reveal a plot uses — then sits. Empty is a first-run, not a
 * loader, so it does not loop.
 */
function EmptyChartIcon() {
  const t = useTokens();
  const size = t.sizing.icon.lg;
  const progress = useChartEntrance(true);
  const clip = useAnimatedStyle(() => {
    const p = Math.max(progress.value, 0.001);
    return { transform: [{ scaleX: p }] };
  });
  const unclip = useAnimatedStyle(() => {
    const p = Math.max(progress.value, 0.001);
    return { transform: [{ scaleX: 1 / p }] };
  });

  return (
    <View style={{ width: size, height: size, overflow: 'hidden' }}>
      <Animated.View style={[{ width: size, height: size, transformOrigin: 'left center' }, clip]}>
        <Animated.View style={[{ width: size, height: size, transformOrigin: 'left center' }, unclip]}>
          <OutlineChartLine width={size} height={size} color={t.colors.textTertiary} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/**
 * The action sits a hair below the body copy — not a spacing step.
 *
 * `spacing[1]` (4) opens a visible gap that reads as a separate block; zero lets
 * the link collide with the line above it. Two points is optical, which is why
 * it is named here rather than rounded to the nearest token.
 */
const ACTION_NUDGE = 2;

/**
 * The rendered empty slot. Lives here rather than in `ChartEmpty` because the
 * plot draws it inside its own box — `ChartEmpty` only carries the configuration.
 */
export function EmptyContent({ title, description, action, icon, showIcon = true }: ChartEmptyProps) {
  const t = useTokens();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.spacing[4], gap: t.spacing[3] }}>
      {showIcon ? (icon ?? <EmptyChartIcon />) : null}
      {title ? (
        <Text
          style={{
            color: t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.title3.fontSize,
            lineHeight: t.typography.title3.lineHeight,
            fontWeight: t.fontWeights.semibold,
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
            marginTop: ACTION_NUDGE,
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
              fontWeight: t.fontWeights.semibold,
            }}
          >
            {action.label} →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
