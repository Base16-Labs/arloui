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
 * Geometry is three more, all reading off the token scales so a card never invents
 * a value: `padding` and `margin` share one spacing scale ('none' … 'xl'), and
 * `radius` maps straight onto the radius scale ('none' … 'full'). The presets and
 * `ListCard.Group` forward `margin` and `radius` too, so a row of cards can be
 * reshaped without dropping to `style`.
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

/**
 * One scale for both `padding` and `margin`, so "sm" means the same distance
 * whichever side of the border it lands on.
 */
export type CardSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/** @deprecated Prefer `CardSpacing` — the same scale now covers margin too. */
export type CardPadding = CardSpacing;

/** Corner rounding, straight off the radius scale. */
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

type CardProps = {
  children: ReactNode;
  tone?: Tone;
  /** `'glass'` swaps the opaque fill for the translucent Liquid Glass material. */
  surface?: CardSurface;
  /** Optional blur layer (e.g. `expo-blur`'s BlurView) rendered behind a glass surface. */
  blurComponent?: ReactNode;
  /** Inner padding. Use `'none'` when the card is edge-to-edge media. */
  padding?: CardSpacing;
  /**
   * Outer spacing. Layout is usually the parent's job — reach for a `gap` on the
   * list before reaching for this — but a card dropped into a screen you don't
   * control needs a way to hold itself off the edges.
   */
  margin?: CardSpacing;
  /** Corner rounding. Defaults to `'xl'`, the standard card radius. */
  radius?: CardRadius;
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
  margin = 'none',
  radius = 'xl',
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

  // `sm`/`md`/`lg` keep the values they already had, so existing cards don't shift.
  const spacingScale: Record<CardSpacing, number> = {
    none: 0,
    xs: t.spacing[2],
    sm: t.spacing[3],
    md: t.spacing[5],
    lg: t.spacing[6],
    xl: t.spacing[8],
  };
  const paddingValue = spacingScale[padding];
  const marginValue = spacingScale[margin];

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
    borderRadius: t.radii[radius],
    padding: paddingValue,
    margin: marginValue,
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
