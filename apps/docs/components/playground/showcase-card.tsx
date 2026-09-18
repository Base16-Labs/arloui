import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTokens } from '@arloui/registry';
import { hexAlpha } from '@/lib/color';
import type { PlaygroundItem } from '@/lib/catalog';

const MIN_ROW_HEIGHT = 76;
const MIN_FEATURED_HEIGHT = 132;

function accentColor(t: ReturnType<typeof useTokens>, accent: PlaygroundItem['accent']) {
  switch (accent) {
    case 'primary':
      return t.colors.accent;
    case 'violet':
      return t.name === 'dark' ? '#A684FF' : '#7F22FE';
    case 'teal':
      return t.name === 'dark' ? '#00D3F2' : '#0092B8';
  }
}

type ShowcaseCardProps = {
  item: PlaygroundItem;
  featured?: boolean;
};

export function ShowcaseCard({ item, featured = item.featured }: ShowcaseCardProps) {
  const t = useTokens();
  const accent = accentColor(t, item.accent);
  const minHeight = featured ? MIN_FEATURED_HEIGHT : MIN_ROW_HEIGHT;

  return (
    <Link href={item.href} asChild>
      <Pressable
        style={({ pressed }) => ({
          minHeight,
          borderRadius: t.radii['2xl'],
          borderWidth: 1,
          borderColor: pressed ? accent : t.colors.border,
          backgroundColor: pressed ? hexAlpha(accent, 0.06) : t.colors.surface,
          overflow: 'hidden',
          ...(featured
            ? t.shadows.md
            : {
                shadowColor: '#101828',
                shadowOpacity: t.name === 'dark' ? 0.25 : 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }),
        })}
      >
        <View
          style={{
            height: featured ? 4 : 3,
            backgroundColor: accent,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: t.spacing[4],
            paddingHorizontal: t.spacing[4],
            paddingVertical: featured ? t.spacing[5] : t.spacing[4],
          }}
        >
          <View
            style={{
              width: featured ? 52 : 48,
              height: featured ? 52 : 48,
              borderRadius: featured ? t.radii.xl : t.radii.lg,
              backgroundColor: hexAlpha(accent, t.name === 'dark' ? 0.22 : 0.12),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={item.icon} size={featured ? 26 : 22} color={accent} />
          </View>

          <View style={{ flex: 1, gap: t.spacing[1], minWidth: 0 }}>
            <Text
              style={{
                fontFamily: t.fontFamilies.display,
                fontSize: featured ? t.typography.title2.fontSize : t.typography.title3.fontSize,
                lineHeight: featured ? t.typography.title2.lineHeight : t.typography.title3.lineHeight,
                fontWeight: t.fontWeights.semibold,
                color: t.colors.textPrimary,
              }}
            >
              {item.title}
            </Text>
            <Text
              numberOfLines={featured ? 3 : 2}
              style={{
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
                color: t.colors.textSecondary,
              }}
            >
              {item.description}
            </Text>
            {featured ? (
              <Text
                style={{
                  marginTop: t.spacing[1],
                  fontFamily: t.fontFamilies.display,
                  fontSize: t.typography.label.fontSize,
                  fontWeight: t.fontWeights.medium,
                  color: accent,
                }}
              >
                Open showcase →
              </Text>
            ) : null}
          </View>

          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: t.radii.full,
              backgroundColor: hexAlpha(accent, 0.1),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-forward" size={22} color={accent} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
