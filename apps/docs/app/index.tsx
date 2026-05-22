import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTokens } from '@arloui/registry';
import { Eyebrow } from '@/components/playground/eyebrow';
import { PlaygroundHero } from '@/components/playground/playground-hero';
import { ShowcaseCard } from '@/components/playground/showcase-card';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import {
  featuredPlaygroundItem,
  playgroundCatalog,
  playgroundCategories,
} from '@/lib/catalog';

export default function Index() {
  const t = useTokens();
  const listItems = playgroundCatalog.filter((item) => !item.featured);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: t.spacing[5],
            paddingTop: t.spacing[5],
            paddingBottom: t.spacing[10],
            gap: t.spacing[7],
          }}
        >
          <PlaygroundHero
            eyebrow="Native · On device"
            title="Arlo"
            titleAccent="Playground"
            lede="Touch real components built for AI-native mobile — not mockups in a browser."
            trailing={<ThemeToggle />}
          />

          {featuredPlaygroundItem ? (
            <View style={{ gap: t.spacing[3] }}>
              <Eyebrow>Start here</Eyebrow>
              <ShowcaseCard item={featuredPlaygroundItem} featured />
            </View>
          ) : null}

          {playgroundCategories.map((category) => {
            const items = listItems.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <View key={category} style={{ gap: t.spacing[3] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: t.colors.accent,
                    }}
                  />
                  <Eyebrow>{category}</Eyebrow>
                </View>
                <View style={{ gap: t.spacing[3] }}>
                  {items.map((item) => (
                    <ShowcaseCard key={item.slug} item={item} />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
