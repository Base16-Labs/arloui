import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Tabs,
  useTokens,
  type TabsAppearance,
  type TabsLayout,
  type TabsTone,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type TabValue = 'for-you' | 'following' | 'saved';

const APPEARANCES: TabsAppearance[] = ['plain', 'underline', 'filled', 'segmented'];
const TONES: TabsTone[] = ['neutral', 'accent'];
const LAYOUTS: TabsLayout[] = ['content', 'equal'];

export default function TabsCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [value, setValue] = useState<TabValue>('for-you');
  const [appearance, setAppearance] = useState<TabsAppearance>('underline');
  const [tone, setTone] = useState<TabsTone>('accent');
  const [layout, setLayout] = useState<TabsLayout>('equal');
  const [previewOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: menuOpen ? -112 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [menuOpen, previewOffset]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 22,
              right: 20,
              left: 20,
              zIndex: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <LiveBadge />
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 64,
              paddingHorizontal: 20,
              paddingBottom: 88,
              transform: [{ translateY: previewOffset }],
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 350,
                height: 470,
                overflow: 'hidden',
                borderRadius: 34,
                borderWidth: 1,
                borderColor: t.colors.border,
                backgroundColor: t.colors.surface,
              }}
            >
              <View
                style={{
                  height: 68,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: t.colors.textPrimary,
                    fontFamily: 'Manrope SemiBold',
                    fontSize: 20,
                  }}
                >
                  Discover
                </Text>
                <Ionicons name="options-outline" size={22} color={t.colors.textPrimary} />
              </View>

              <View style={{ paddingHorizontal: 14 }}>
                <Tabs
                  value={value}
                  onValueChange={(next) => setValue(next as TabValue)}
                  appearance={appearance}
                  tone={tone}
                  layout={layout}
                  style={layout === 'content' ? { alignSelf: 'center' } : undefined}
                >
                  <Tabs.Item value="for-you" label="For you" />
                  <Tabs.Item value="following" label="Following" />
                  <Tabs.Item value="saved" label="Saved" />
                </Tabs>
              </View>

              <TabContent value={value} />
            </View>
          </Animated.View>

          {!menuOpen ? (
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="Tabs"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setMenuOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={menuOpen}
            previous="Skeleton"
            next="Tab Bar"
            onClose={() => setMenuOpen(false)}
            onPrevious={() => router.replace('/skeleton')}
            onNext={() => router.replace('/tab-bar')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Appearance">
                {APPEARANCES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={appearance === option}
                    onPress={() => setAppearance(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Tone">
                {TONES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={tone === option}
                    onPress={() => setTone(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Layout">
                {LAYOUTS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={layout === option}
                    onPress={() => setLayout(option)}
                  />
                ))}
              </VariantControlRow>
            </View>
          </VariantSheet>
        </View>
      </SafeAreaView>
    </>
  );
}

function TabContent({ value }: { value: TabValue }) {
  const t = useTokens();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    opacity.setValue(0.72);
    Animated.timing(opacity, {
      toValue: 1,
      duration: t.motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [opacity, t.motion.duration.fast, value]);

  const colors =
    value === 'for-you'
      ? ['#BFDBFE', '#DDD6FE', '#FED7AA']
      : value === 'following'
        ? ['#BBF7D0', '#BAE6FD', '#FBCFE8']
        : ['#FDE68A', '#E9D5FF', '#BFDBFE'];

  return (
    <Animated.View style={{ flex: 1, padding: 16, gap: 14, opacity }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors[0] }} />
        <View style={{ gap: 5 }}>
          <View
            style={{ width: 82, height: 9, borderRadius: 5, backgroundColor: t.colors.textPrimary }}
          />
          <View
            style={{
              width: 54,
              height: 7,
              borderRadius: 4,
              backgroundColor: t.colors.borderStrong,
            }}
          />
        </View>
      </View>
      <View style={{ height: 184, borderRadius: 18, backgroundColor: colors[1] }} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {colors.map((color, index) => (
          <View key={color} style={{ flex: 1, gap: 8 }}>
            <View style={{ height: 74, borderRadius: 13, backgroundColor: color }} />
            <View
              style={{
                width: index === 1 ? '72%' : '88%',
                height: 8,
                borderRadius: 4,
                backgroundColor: t.colors.borderStrong,
              }}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
