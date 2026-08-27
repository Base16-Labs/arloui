import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTokens } from '@arloui/registry';
import { ThemeToggle } from '@/components/playground/theme-toggle';

type IndexItem = {
  title: string;
  category: string;
  href?:
    | '/badge'
    | '/button'
    | '/cards'
    | '/list'
    | '/chip'
    | '/input'
    | '/textarea'
    | '/sheet'
    | '/skeleton'
    | '/spinner'
    | '/tabs'
    | '/date-picker'
    | '/tab-bar'
    | '/icons'
    | '/toggle'
    | '/checkbox'
    | '/radio'
    | '/carousel'
    | '/gallery'
    | '/toast';
};

const COMPONENTS: IndexItem[] = [
  { title: 'Badge', category: 'Feedback', href: '/badge' },
  { title: 'Button', category: 'Controls', href: '/button' },
  { title: 'Card', category: 'Layout', href: '/cards' },
  { title: 'Carousel', category: 'Layout', href: '/carousel' },
  { title: 'Checkbox', category: 'Controls', href: '/checkbox' },
  { title: 'Chip', category: 'Controls', href: '/chip' },
  { title: 'Date Picker', category: 'Controls', href: '/date-picker' },
  { title: 'Empty', category: 'Feedback' },
  { title: 'Field', category: 'Controls', href: '/input' },
  { title: 'Gallery', category: 'Layout', href: '/gallery' },
  { title: 'Group', category: 'Layout' },
  { title: 'Header', category: 'Nav' },
  { title: 'Icons', category: 'Foundations', href: '/icons' },
  { title: 'Input', category: 'Controls', href: '/input' },
  { title: 'List', category: 'Lists', href: '/list' },
  { title: 'Nav', category: 'Nav' },
  { title: 'Note', category: 'Type' },
  { title: 'Pill', category: 'Controls' },
  { title: 'Radio', category: 'Controls', href: '/radio' },
  { title: 'Sheet', category: 'Layout', href: '/sheet' },
  { title: 'Skeleton', category: 'Feedback', href: '/skeleton' },
  { title: 'Spinner', category: 'Feedback', href: '/spinner' },
  { title: 'Tab Bar', category: 'Nav', href: '/tab-bar' },
  { title: 'Tabs', category: 'Nav', href: '/tabs' },
  { title: 'TextArea', category: 'Controls', href: '/textarea' },
  { title: 'Toast', category: 'Feedback', href: '/toast' },
  { title: 'Toggle', category: 'Controls', href: '/toggle' },
];

export default function ComponentIndex() {
  const t = useTokens();
  const [query, setQuery] = useState('');
  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return COMPONENTS;
    return COMPONENTS.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View
          style={{
            flex: 1,
            paddingTop: t.spacing[6],
          }}
        >
          <View
            style={{
              alignItems: 'flex-end',
              paddingHorizontal: t.spacing[5],
            }}
          >
            <ThemeToggle />
          </View>

          <View
            style={{
              marginTop: t.spacing[12],
              marginHorizontal: t.spacing[5],
              height: 52,
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.spacing[3],
              paddingHorizontal: t.spacing[4],
              borderRadius: t.radii.lg,
              borderWidth: 1,
              borderColor: t.colors.border,
              backgroundColor: t.colors.surfaceRaised,
            }}
          >
            <Ionicons name="search-outline" size={21} color={t.colors.textTertiary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search components"
              placeholderTextColor={t.colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                flex: 1,
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                ...t.typography.bodyMedium,
                paddingVertical: t.spacing[0],
              }}
            />
            {query ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={8}
                onPress={() => setQuery('')}
              >
                <Ionicons name="close-circle" size={18} color={t.colors.textTertiary} />
              </Pressable>
            ) : null}
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.title}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            style={{ flex: 1, marginTop: t.spacing[5] }}
            contentContainerStyle={{
              borderTopWidth: 1,
              borderTopColor: t.colors.border,
              paddingBottom: t.spacing[10],
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: t.colors.border }} />
            )}
            renderItem={({ item }) => <IndexRow item={item} />}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: t.spacing[12] }}>
                <Text
                  style={{
                    color: t.colors.textSecondary,
                    fontFamily: t.fontFamilies.sans,
                    ...t.typography.bodyMedium,
                  }}
                >
                  No matching components
                </Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </>
  );
}

function IndexRow({ item }: { item: IndexItem }) {
  const t = useTokens();
  const router = useRouter();

  return (
    <Pressable
      disabled={!item.href}
      onPress={() => {
        if (item.href) router.push(item.href as Parameters<typeof router.push>[0]);
      }}
      style={({ pressed }) => ({
        minHeight: t.spacing[16],
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: t.spacing[5],
        backgroundColor: pressed ? t.colors.surfaceRaised : t.colors.bg,
      })}
    >
      <Text
        style={{
          flex: 1,
          color: t.colors.textPrimary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.headingMedium,
          fontWeight: t.fontWeights.medium,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          flexShrink: 0,
          marginLeft: t.spacing[4],
          color: t.colors.textTertiary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.overline,
          textAlign: 'right',
          textTransform: 'uppercase',
        }}
      >
        {item.category}
      </Text>
    </Pressable>
  );
}
