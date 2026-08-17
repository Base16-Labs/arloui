/**
 * Arlo UI — ActionCard
 *
 * A card that asks for something: finish setup, enable notifications, upgrade.
 * An icon or illustration, a short pitch, and the buttons that resolve it.
 *
 *   <ActionCard
 *     icon={<ShieldIcon />}
 *     title="Turn on two-factor auth"
 *     body="Add a second step when signing in from a new device."
 *     primaryAction={{ label: 'Enable', onPress: enable }}
 *     secondaryAction={{ label: 'Not now', onPress: dismiss }}
 *     onDismiss={dismiss}
 *   />
 *
 * `tone` moves it onto the status palette for the cases where the card reports a
 * state rather than an opportunity. Status colours always ship with the title
 * text beside them, never as the only signal.
 */
import { type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Button } from '../button/button';
import { useTokens } from '../../foundation/theme-provider';
import { Card, type CardProps } from './card';

export type ActionCardTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export type ActionCardAction = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export type ActionCardProps = {
  title: string;
  body?: string;
  /** Leading glyph or illustration. */
  icon?: ReactNode;
  tone?: ActionCardTone;
  primaryAction?: ActionCardAction;
  secondaryAction?: ActionCardAction;
  /** Adds a close affordance in the top-right. */
  onDismiss?: () => void;
  dismissAccessibilityLabel?: string;
  surface?: CardProps['surface'];
  /** Inner padding, forwarded to `Card`. */
  padding?: CardProps['padding'];
  /** Outer spacing, forwarded to `Card`. */
  margin?: CardProps['margin'];
  /** Corner rounding, forwarded to `Card`. */
  radius?: CardProps['radius'];

  blurComponent?: CardProps['blurComponent'];
  /** Stack the buttons full-width instead of sitting them in a row. */
  stackActions?: boolean;
  style?: StyleProp<ViewStyle>;
};

function CloseIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6l12 12M18 6L6 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ActionCard({
  title,
  body,
  icon,
  tone = 'default',
  primaryAction,
  secondaryAction,
  onDismiss,
  dismissAccessibilityLabel = 'Dismiss',
  surface,
  padding = 'md',
  margin,
  radius,
  blurComponent,
  stackActions = false,
  style,
}: ActionCardProps) {
  const t = useTokens();

  const accent =
    tone === 'success'
      ? { fg: t.colors.feedbackSuccess, bg: t.colors.feedbackSuccessBg }
      : tone === 'warning'
        ? { fg: t.colors.feedbackWarning, bg: t.colors.feedbackWarningBg }
        : tone === 'error'
          ? { fg: t.colors.feedbackError, bg: t.colors.feedbackErrorBg }
          : tone === 'info'
            ? { fg: t.colors.feedbackInfo, bg: t.colors.feedbackInfoBg }
            : { fg: t.colors.interactivePrimary, bg: t.colors.surfaceInput };

  // A danger card's primary action should read as danger too, so the button tone
  // follows the card rather than defaulting to brand.
  const primaryTone = tone === 'error' ? 'danger' : 'primary';

  return (
    <Card
      surface={surface}
      blurComponent={blurComponent}
      padding={padding}
      margin={margin}
      radius={radius}
      style={style}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: t.spacing[3] }}>
        {icon ? (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: t.radii.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: accent.bg,
              flexShrink: 0,
            }}
          >
            {icon}
          </View>
        ) : null}

        <View style={{ flex: 1, minWidth: 0, gap: t.spacing[1] }}>
          <Text
            style={{
              color: t.colors.textPrimary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.title3.fontSize,
              lineHeight: t.typography.title3.lineHeight,
              fontWeight: '700',
            }}
          >
            {title}
          </Text>
          {body ? (
            <Text
              style={{
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {body}
            </Text>
          ) : null}
        </View>

        {onDismiss ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={dismissAccessibilityLabel}
            onPress={onDismiss}
            hitSlop={10}
            style={({ pressed }) => ({
              flexShrink: 0,
              opacity: pressed ? t.motion.pressed.opacity : 1,
            })}
          >
            <CloseIcon color={t.colors.textTertiary} size={t.sizing.icon.sm} />
          </Pressable>
        ) : null}
      </View>

      {primaryAction || secondaryAction ? (
        <View
          style={{
            flexDirection: stackActions ? 'column' : 'row',
            alignItems: stackActions ? 'stretch' : 'center',
            justifyContent: 'flex-end',
            gap: t.spacing[2],
          }}
        >
          {secondaryAction ? (
            <Button
              tone="neutral"
              appearance="ghost"
              size="sm"
              fullWidth={stackActions}
              loading={secondaryAction.loading}
              disabled={secondaryAction.disabled}
              onPress={secondaryAction.onPress}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button
              tone={primaryTone}
              appearance="solid"
              size="sm"
              fullWidth={stackActions}
              loading={primaryAction.loading}
              disabled={primaryAction.disabled}
              onPress={primaryAction.onPress}
            >
              {primaryAction.label}
            </Button>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
