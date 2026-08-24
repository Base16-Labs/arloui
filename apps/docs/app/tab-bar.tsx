import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TabBar,
  useTabBarScroll,
  useTokens,
  type TabBarScrollBehavior,
  type TabBarSelectionMotion,
  type TabBarSurface,
  type TabBarWidth,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type TabValue = 'home' | 'search' | 'activity' | 'profile';

const WIDTHS: TabBarWidth[] = ['full', 'floating'];
const SURFACES: TabBarSurface[] = ['filled', 'glass'];
const BEHAVIORS: TabBarScrollBehavior[] = ['hide', 'shrink', 'fixed'];
const SELECTIONS: TabBarSelectionMotion[] = ['snap', 'jelly'];

export default function TabBarCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scroll = useTabBarScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const [value, setValue] = useState<TabValue>('home');
  const [width, setWidth] = useState<TabBarWidth>('floating');
  const [surface, setSurface] = useState<TabBarSurface>('filled');
  const [showLabels, setShowLabels] = useState(false);
  const [scrollBehavior, setScrollBehavior] = useState<TabBarScrollBehavior>('shrink');
  const [selection, setSelection] = useState<TabBarSelectionMotion>('snap');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 22,
              left: 20,
              right: 20,
              zIndex: 6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <LiveBadge />
            <ThemeToggle />
          </View>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 64,
              paddingHorizontal: 20,
              paddingBottom: 88,
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
                backgroundColor: t.colors.bg,
              }}
            >
              <ScrollView
                onScroll={scroll.onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: 24,
                  paddingHorizontal: 16,
                  paddingBottom: 100,
                }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#155DFC',
                    }}
                  />
                  <View style={{ gap: 6 }}>
                    <View
                      style={{
                        width: 112,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: t.colors.textPrimary,
                      }}
                    />
                    <View
                      style={{
                        width: 76,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: t.colors.borderStrong,
                      }}
                    />
                  </View>
                </View>

                {Array.from({ length: 8 }, (_, index) => (
                  <View key={index} style={{ marginBottom: 28 }}>
                    <View
                      style={{
                        width: '100%',
                        aspectRatio: index % 3 === 0 ? 1.18 : 1.5,
                        borderRadius: 18,
                        backgroundColor:
                          index % 4 === 0
                            ? '#BFDBFE'
                            : index % 4 === 1
                              ? '#BBF7D0'
                              : index % 4 === 2
                                ? '#FED7AA'
                                : '#E9D5FF',
                      }}
                    />
                    <View style={{ marginTop: 12, flexDirection: 'row', gap: 14 }}>
                      <Ionicons name="heart-outline" size={23} color={t.colors.textPrimary} />
                      <Ionicons name="chatbubble-outline" size={21} color={t.colors.textPrimary} />
                      <Ionicons name="paper-plane-outline" size={22} color={t.colors.textPrimary} />
                    </View>
                    <Text
                      style={{
                        marginTop: 9,
                        color: t.colors.textSecondary,
                        fontFamily: 'Manrope Medium',
                        fontSize: 13,
                        lineHeight: 18,
                      }}
                    >
                      {index % 2 === 0 ? 'A quiet moment from today.' : 'Saved from the weekend.'}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <View
                pointerEvents="box-none"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: width === 'floating' ? 14 : 0,
                  left: 0,
                  zIndex: 8,
                }}
              >
                <TabBar
                  value={value}
                  onValueChange={(next) => setValue(next as TabValue)}
                  width={width}
                  surface={surface}
                  scrollBehavior={scrollBehavior}
                  selection={selection}
                  showLabels={showLabels}
                  hidden={scroll.hidden}
                  blurComponent={
                    surface === 'glass' ? (
                      <BlurView
                        intensity={60}
                        tint={t.name === 'dark' ? 'dark' : 'light'}
                        style={StyleSheet.absoluteFill}
                      />
                    ) : undefined
                  }
                >
                  <TabBar.Item
                    value="home"
                    label="Home"
                    icon={({ active, color, size }) => (
                      <Ionicons name={active ? 'home' : 'home-outline'} color={color} size={size} />
                    )}
                  />
                  <TabBar.Item
                    value="search"
                    label="Search"
                    icon={({ color, size }) => <Ionicons name="search" color={color} size={size} />}
                  />
                  <TabBar.Item
                    value="activity"
                    label="Activity"
                    badge={2}
                    icon={({ active, color, size }) => (
                      <Ionicons
                        name={active ? 'heart' : 'heart-outline'}
                        color={color}
                        size={size}
                      />
                    )}
                  />
                  <TabBar.Item
                    value="profile"
                    label="Profile"
                    icon={({ active, color, size }) => (
                      <Ionicons
                        name={active ? 'person' : 'person-outline'}
                        color={color}
                        size={size}
                      />
                    )}
                  />
                </TabBar>
              </View>
            </View>
          </View>

          {!menuOpen ? (
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                zIndex: 10,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="Tab Bar"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setMenuOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={menuOpen}
            previous="Date Picker"
            next="Sheet"
            onClose={() => setMenuOpen(false)}
            onPrevious={() => router.replace('/date-picker')}
            onNext={() => router.replace('/sheet')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Width">
                {WIDTHS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={width === option}
                    onPress={() => setWidth(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Surface">
                {SURFACES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={surface === option}
                    onPress={() => setSurface(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Labels">
                {(['icons only', 'show'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={showLabels === (option === 'show')}
                    onPress={() => setShowLabels(option === 'show')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="On scroll">
                {BEHAVIORS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={scrollBehavior === option}
                    onPress={() => setScrollBehavior(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Selection">
                {SELECTIONS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={selection === option}
                    onPress={() => setSelection(option)}
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
