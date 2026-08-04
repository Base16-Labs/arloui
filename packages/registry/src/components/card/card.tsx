/**
 * Arlo UI — Card
 *
 * Compound component:
 *   <Card>, <Card.Media>, <Card.Header>, <Card.Title>, <Card.Subtitle>, <Card.Body>, <Card.Footer>
 *
 * Two independent axes:
 *   - `tone`:    how much the card lifts off the page — 'default' · 'raised' · 'floating'.
 *   - `surface`: what it's made of — 'default' opaque fill, or 'glass' for the
 *                translucent Liquid Glass material (pair with `blurComponent`).
 *
 * Surfaces use `surface` by default and step up to `surfaceRaised` for the `raised`
 * tone. Borders carry hierarchy on neutral surfaces — shadows are reserved for
 * `floating` (modal/menu separation only). Per the design skill, depth comes from
 * layering and spacing first, not shadows.
 *
 * Pass `onPress` to make the whole card a single tap target; it picks up the same
 * press feedback as the rest of the system and reports itself as a button.
 */
import { type ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { GlassBackdrop, useGlassSurface } from '../../foundation/glass';
import { useTokens } from '../../foundation/theme-provider';

type Tone = 'default' | 'raised' | 'floating';
export type CardSurface = 'default' | 'glass';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

type CardProps = {
  children: ReactNode;
  tone?: Tone;
  /** `'glass'` swaps the opaque fill for the translucent Liquid Glass material. */
  surface?: CardSurface;
  /** Optional blur layer (e.g. `expo-blur`'s BlurView) rendered behind a glass surface. */
  blurComponent?: ReactNode;
  /** Inner padding. Use `'none'` when the card is edge-to-edge media. */
  padding?: CardPadding;
  /** Makes the whole card a tap target with press feedback and `accessibilityRole="button"`. */
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function CardRoot({
  children,
  tone = 'default',
  surface = 'default',
  blurComponent,
  padding = 'md',
  onPress,
  onLongPress,
  disabled = false,
  accessibilityLabel,
  style,
}: CardProps) {
  const t = useTokens();
  // Cards are large surfaces, so they take the heaviest material — content behind a
  // card should read as background texture, not as competing detail.
  const glass = useGlassSurface('large');
  const isGlass = surface === 'glass';
  const interactive = onPress != null || onLongPress != null;

  const paddingValue =
    padding === 'none' ? 0 : padding === 'sm' ? t.spacing[3] : padding === 'lg' ? t.spacing[6] : t.spacing[5];

  const bg = isGlass
    ? glass.backgroundColor
    : tone === 'raised'
      ? t.colors.surfaceRaised
      : tone === 'floating'
        ? t.colors.surfaceStrong
        : t.colors.surface;

  const containerStyle: ViewStyle = {
    backgroundColor: bg,
    borderColor: isGlass ? glass.borderColor : t.colors.border,
    borderWidth: 1,
    borderRadius: t.radii.xl,
    padding: paddingValue,
    gap: padding === 'none' ? 0 : t.spacing[3],
    // Clip media and the blur layer to the card's corners.
    overflow: 'hidden',
    opacity: disabled ? 0.45 : 1,
  };

  const shadow = tone === 'floating' ? (t.shadows.md as ViewStyle) : null;

  if (!interactive) {
    return (
      <View style={[containerStyle, shadow, style]}>
        {isGlass ? <GlassBackdrop>{blurComponent}</GlassBackdrop> : null}
        {children}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        containerStyle,
        shadow,
        pressed && !disabled
          ? { opacity: t.motion.pressed.opacity, transform: [{ scale: t.motion.pressed.scale }] }
          : null,
        style,
      ]}
    >
      {isGlass ? <GlassBackdrop>{blurComponent}</GlassBackdrop> : null}
      {children}
    </Pressable>
  );
}

/**
 * Edge-to-edge media slot. Pair with `padding="none"` on the card and put the text
 * content in a padded `Card.Body` so the image bleeds to the card's corners.
 */
function CardMedia({
  children,
  height,
  style,
}: {
  children: ReactNode;
  /** Fixed media height. Omit to let the child size itself (e.g. an aspect-ratio image). */
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ height, width: '100%', overflow: 'hidden' }, style]}>{children}</View>
  );
}

function CardHeader({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return <View style={[{ gap: t.spacing[1] }, style]}>{children}</View>;
}

function CardTitle({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTokens();
  return (
    <Text
      style={[
        {
          color: t.colors.textPrimary,
          fontFamily: t.fontFamilies.sans,
          fontSize: t.typography.title2.fontSize,
          lineHeight: t.typography.title2.lineHeight,
          fontWeight: '600',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function CardSubtitle({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTokens();
  return (
    <Text
      style={[
        {
          color: t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          fontSize: t.typography.bodySm.fontSize,
          lineHeight: t.typography.bodySm.lineHeight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function CardBody({
  children,
  padded = false,
  style,
}: {
  children: ReactNode;
  /** Restores the card's inner padding for this section when the card is `padding="none"`. */
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  return (
    <View style={[padded ? { padding: t.spacing[5], gap: t.spacing[3] } : null, style]}>
      {children}
    </View>
  );
}

function CardFooter({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: t.spacing[2] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export const Card = Object.assign(CardRoot, {
  Media: CardMedia,
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Body: CardBody,
  Footer: CardFooter,
});

export type { CardProps };
