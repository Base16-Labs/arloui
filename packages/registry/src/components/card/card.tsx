/**
 * Arlo UI — Card
 *
 * Compound component:  <Card>, <Card.Header>, <Card.Title>, <Card.Body>, <Card.Footer>
 *
 * Surfaces use `surface` by default and step up to `surfaceRaised` for the `raised`
 * tone. Borders carry hierarchy on neutral surfaces — shadows are reserved for
 * `floating` (modal/menu separation only). Per the design skill, depth comes from
 * layering and spacing first, not shadows.
 */
import { type ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

type Tone = 'default' | 'raised' | 'floating';

type CardProps = {
  children: ReactNode;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
};

function CardRoot({ children, tone = 'default', style }: CardProps) {
  const t = useTokens();
  const bg =
    tone === 'raised' ? t.colors.surfaceRaised : tone === 'floating' ? t.colors.surfaceStrong : t.colors.surface;
  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderColor: t.colors.border,
          borderWidth: 1,
          borderRadius: t.radii.xl,
          padding: t.spacing[5],
          gap: t.spacing[3],
        },
        style,
      ]}
    >
      {children}
    </View>
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
          fontWeight: t.fontWeights.semibold,
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
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Body: CardBody,
  Footer: CardFooter,
});

export type { CardProps };
