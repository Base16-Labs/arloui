/**
 * Arlo UI — MediaCard
 *
 * An image-led card in the two layouts that actually differ:
 *
 *   - `layout="below"`  — cover image, then text on the card surface. The default,
 *     and the safe one: text on a solid surface always meets contrast.
 *   - `layout="overlay"` — text sits on the image. Only legible with a scrim, so
 *     one is always drawn; there is no way to turn it off, because an unscrimmed
 *     overlay is unreadable over a light photo.
 *
 *   <MediaCard media={<Image source={cover} style={StyleSheet.absoluteFill} />}
 *              title="Kyoto" subtitle="12 photos" onPress={open} />
 *
 * The media slot takes any node — an `Image`, a video poster, a gradient — and is
 * clipped to the card's corners.
 */
import { type ReactNode } from 'react';
import { Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import { Card, type CardProps } from './card';

export type MediaCardLayout = 'below' | 'overlay';

export type MediaCardProps = {
  /** Fills the media area. Give it `StyleSheet.absoluteFill` or a 100% size. */
  media: ReactNode;
  title: string;
  subtitle?: string;
  layout?: MediaCardLayout;
  /** Media height for `below`; total card height for `overlay`. */
  mediaHeight?: number;
  /** Pinned to the top-left of the media — a badge, a duration, a category chip. */
  badge?: ReactNode;
  /** Rendered under the text. Actions, metadata, a button row. */
  footer?: ReactNode;
  tone?: CardProps['tone'];
  /** Inner padding, forwarded to `Card`. Defaults to `'none'` so media stays edge-to-edge. */
  padding?: CardProps['padding'];
  /** Outer spacing, forwarded to `Card`. */
  margin?: CardProps['margin'];
  /** Corner rounding, forwarded to `Card`. */
  radius?: CardProps['radius'];

  onPress?: PressableProps['onPress'];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function MediaCard({
  media,
  title,
  subtitle,
  layout = 'below',
  mediaHeight = layout === 'overlay' ? 200 : 160,
  badge,
  footer,
  tone,
  padding = 'none',
  margin,
  radius,
  onPress,
  accessibilityLabel,
  style,
}: MediaCardProps) {
  const t = useTokens();
  const overlay = layout === 'overlay';

  return (
    <Card
      tone={tone}
      padding={padding}
      margin={margin}
      radius={radius}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? title}
      style={style}
    >
      <View style={{ height: mediaHeight, width: '100%', overflow: 'hidden' }}>
        {media}

        {overlay ? (
          <>
            {/*
              Scrim: a plain dark wash rather than a gradient, because RN has no
              CSS gradients and pulling in a gradient dependency for one card is a
              poor trade. It is opaque enough to hold white text over a light photo.
            */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: '35%',
                backgroundColor: 'rgba(16,24,40,0.55)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: t.spacing[4],
                gap: 2,
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  // Fixed white, not a token: this sits on the scrim, not on a themed
                  // surface, so it must not flip with the colour scheme.
                  color: '#FFFFFF',
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.title3.fontSize,
                  lineHeight: t.typography.title3.lineHeight,
                  fontWeight: '700',
                }}
              >
                {title}
              </Text>
              {subtitle ? (
                <Text
                  numberOfLines={1}
                  style={{
                    color: 'rgba(255,255,255,0.86)',
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                    lineHeight: t.typography.bodySm.lineHeight,
                  }}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </>
        ) : null}

        {badge ? (
          <View style={{ position: 'absolute', top: t.spacing[3], left: t.spacing[3] }}>{badge}</View>
        ) : null}
      </View>

      {!overlay ? (
        <View style={{ padding: t.spacing[4], gap: 2 }}>
          <Text
            numberOfLines={2}
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
          {subtitle ? (
            <Text
              numberOfLines={2}
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
          {footer ? <View style={{ marginTop: t.spacing[2] }}>{footer}</View> : null}
        </View>
      ) : footer ? (
        <View style={{ padding: t.spacing[4] }}>{footer}</View>
      ) : null}
    </Card>
  );
}
