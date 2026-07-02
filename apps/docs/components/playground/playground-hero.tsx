import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTokens } from '@arloui/registry';
import { hexAlpha } from '@/lib/color';
import { Eyebrow } from './eyebrow';

export function PlaygroundHero({
  eyebrow,
  title,
  titleAccent,
  lede,
  trailing,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  lede: string;
  trailing?: ReactNode;
}) {
  const t = useTokens();

  return (
    <View style={{ gap: t.spacing[5] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View
          style={{
            paddingHorizontal: t.spacing[3],
            paddingVertical: t.spacing[1],
            borderRadius: t.radii.full,
            backgroundColor: hexAlpha(t.colors.accent, t.name === 'dark' ? 0.2 : 0.1),
            borderWidth: 1,
            borderColor: hexAlpha(t.colors.accent, 0.25),
          }}
        >
          <Text
            style={{
              fontFamily: 'Space Grotesk Medium',
              fontSize: 11,
              letterSpacing: 0.8,
              color: t.colors.accent,
            }}
          >
            {eyebrow}
          </Text>
        </View>
        {trailing}
      </View>

      <View style={{ gap: t.spacing[2] }}>
        <Text
          style={{
            fontFamily: t.fontFamilies.display,
            fontSize: 44,
            lineHeight: 46,
            letterSpacing: -0.5,
            color: t.colors.textPrimary,
          }}
        >
          {title}
          {titleAccent ? (
            <Text style={{ color: t.colors.accent }}> {titleAccent}</Text>
          ) : null}
        </Text>
        <Text
          style={{
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.body.fontSize,
            lineHeight: t.typography.body.lineHeight,
            color: t.colors.textSecondary,
          }}
        >
          {lede}
        </Text>
      </View>
    </View>
  );
}
