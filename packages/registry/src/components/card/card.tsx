/**
 * Arlo UI — Card
 *
 * The surface primitive:  <Card>, <Card.Media>, <Card.Header>, <Card.Title>,
 * <Card.Subtitle>, <Card.Body>, <Card.Footer>.
 *
 * Five variant axes, each off a token scale so a card never invents a value:
 *   - `surface`   — what it's made of: `default` (surface-card), `elevated`
 *                   (surface-elevated), `bleed` (translucent, lets a coloured
 *                   background or image show through — the Luma look), or `inverse`
 *                   (flips to the opposite end of the scale; text flips with it).
 *   - `elevation` — the shadow, `none` … `lg`. Per the design skill, depth comes
 *                   from layering first, so the default is `none`.
 *   - `border`    — border width in px (`1` default; there are no border-width tokens).
 *   - `padding`   — inner padding off the spacing scale. `none` for edge-to-edge media.
 *   - `radius`    — corner rounding off the radius scale.
 *
 * Card is the surface, not a family of pre-baked layouts. A metric tile, an image
 * card, a prompt card, a settings group (a `List`), or a `Carousel` is `Card` plus
 * its slots and the shipped primitives (`List.Row`, `Button`, `Badge`) — those are
 * recipes documented alongside the component, not props on it.
 *
 * Pass `onPress` to make the whole card a single tap target; it picks up the same
 * press feedback as the rest of the system, fires a `haptic` on press-down
 * (`'light'` by default — set `'none'` in dense grids), and reports itself as a button.
 */
import { createContext, useContext, type ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { haptic as triggerHaptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';

/** What the card is made of. */
export type CardSurface = 'default' | 'elevated' | 'bleed' | 'inverse';

/** Shadow depth, off the shadow scale. */
export type CardElevation = 'none' | 'sm' | 'md' | 'lg';

/** Haptic fired on press-down when the card is interactive. */
export type CardHaptic = 'none' | 'light' | 'medium' | 'heavy';

/** Inner padding, off the spacing scale. */
export type CardSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Corner rounding, off the radius scale. */
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

type CardProps = {
  children: ReactNode;
  /** What the card is made of. Defaults to `'default'` (surface-card). */
  surface?: CardSurface;
  /** Shadow depth. Defaults to `'none'` — depth from layering before shadows. */
  elevation?: CardElevation;
  /** Border width in px. Defaults to `1`. No border-width tokens exist, so this is a literal. */
  border?: number;
  /** Inner padding. Use `'none'` when the card is edge-to-edge media. */
  padding?: CardSpacing;
  /** Corner rounding. Defaults to `'xl'`, the standard card radius. */
  radius?: CardRadius;
  /** Makes the whole card a tap target with press feedback and `accessibilityRole="button"`. */
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  /** Haptic on press-down for an interactive card. Defaults to `'light'`; set `'none'` in dense grids. */
  haptic?: CardHaptic;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Lets the text slots follow the surface: on an `inverse` card the title and
 * subtitle flip to the inverse foreground without the caller restyling them.
 */
const CardTextContext = createContext<{ title: string; subtitle: string; inverse: boolean } | null>(
  null,
);

function CardRoot({
  children,
  surface = 'default',
  elevation = 'none',
  border = 1,
  padding = 'md',
  radius = 'xl',
  onPress,
  onLongPress,
  haptic = 'light',
  disabled = false,
  accessibilityLabel,
  style,
}: CardProps) {
  const t = useTokens();
  const interactive = onPress != null || onLongPress != null;

  const spacingScale: Record<CardSpacing, number> = {
    none: 0,
    xs: t.spacing[2],
    sm: t.spacing[3],
    md: t.spacing[5],
    lg: t.spacing[6],
    xl: t.spacing[8],
  };

  const bg =
    surface === 'elevated'
      ? t.colors.surfaceElevated
      : surface === 'bleed'
        ? t.colors.surfaceBleed
        : surface === 'inverse'
          ? t.colors.surfaceInverse
          : t.colors.surfaceCard;

  const inverse = surface === 'inverse';
  const textColors = {
    title: inverse ? t.colors.textInverse : t.colors.textPrimary,
    subtitle: inverse ? t.colors.textInverse : t.colors.textSecondary,
    inverse,
  };

  const shadow = elevation === 'none' ? null : (t.shadows[elevation] as ViewStyle);

  // The shadow lives on the OUTER layer: a shadow can't escape a view with
  // `overflow: 'hidden'`, and the inner layer needs that clip to round media and
  // the border to the corners. So the outer casts, the inner clips.
  const outerStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius: t.radii[radius],
    opacity: disabled ? 0.45 : 1,
  };

  const innerStyle: ViewStyle = {
    borderColor: surface === 'bleed' ? t.colors.borderSecondary : t.colors.border,
    borderWidth: border,
    borderRadius: t.radii[radius],
    padding: spacingScale[padding],
    gap: padding === 'none' ? 0 : t.spacing[3],
    overflow: 'hidden',
  };

  const content = (
    <View style={innerStyle}>
      <CardTextContext.Provider value={textColors}>{children}</CardTextContext.Provider>
    </View>
  );

  if (!interactive) {
    return <View style={[outerStyle, shadow, style]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={haptic === 'none' ? undefined : () => void triggerHaptic(haptic)}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        outerStyle,
        shadow,
        pressed && !disabled
          ? { opacity: t.motion.pressed.opacity, transform: [{ scale: t.motion.pressed.scale }] }
          : null,
        style,
      ]}
    >
      {content}
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
  return <View style={[{ height, width: '100%', overflow: 'hidden' }, style]}>{children}</View>;
}

function CardHeader({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return <View style={[{ gap: t.spacing[1] }, style]}>{children}</View>;
}

function CardTitle({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTokens();
  const ctx = useContext(CardTextContext);
  return (
    <Text
      style={[
        {
          color: ctx?.title ?? t.colors.textPrimary,
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
  const ctx = useContext(CardTextContext);
  return (
    <Text
      style={[
        {
          color: ctx?.subtitle ?? t.colors.textSecondary,
          // On an inverse surface there is no second text token, so soften the same ink.
          opacity: ctx?.inverse ? 0.7 : 1,
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

function CardBody({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={style}>{children}</View>;
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
