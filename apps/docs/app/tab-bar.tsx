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
  type TabBarSurface,
  type TabBarWidth,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type TabValue = 'home' | 'search' | 'activity' | 'profile';
type ScrollBehavior = 'fixed' | 'on scroll';

const WIDTHS: TabBarWidth[] = ['full', 'floating'];
const SURFACES: TabBarSurface[] = ['transparent', 'filled'];

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
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>('on scroll');

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
              paddingTop: t.spacing[16],
              paddingHorizontal: t.spacing[5],
              paddingBottom: t.spacing[20] + t.spacing[2],
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 350,
                height: 470,
                overflow: 'hidden',
                borderRadius: t.radii['2xl'],
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
                  paddingTop: t.spacing[6],
                  paddingHorizontal: t.spacing[4],
                  paddingBottom: t.spacing[24] + t.spacing[1],
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: t.spacing[3],
                    marginBottom: t.spacing[6],
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#155DFC',
                    }}
                  />
                  <View style={{ gap: t.spacing[2] }}>
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
                  <View key={index} style={{ marginBottom: t.spacing[6] }}>
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
                    <View style={{ marginTop: t.spacing[3], flexDirection: 'row', gap: t.spacing[4] }}>
                      <Ionicons name="heart-outline" size={23} color={t.colors.textPrimary} />
                      <Ionicons name="chatbubble-outline" size={21} color={t.colors.textPrimary} />
                      <Ionicons name="paper-plane-outline" size={22} color={t.colors.textPrimary} />
                    </View>
                    <Text
                      style={{
                        marginTop: 9,
                        color: t.colors.textSecondary,
                        fontFamily: t.fontFamilies.sans,
                        ...t.typography.bodyMedium,
                        fontWeight: t.fontWeights.medium,
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
                  showLabels={showLabels}
                  hidden={scrollBehavior === 'on scroll' ? scroll.hidden : false}
                  blurComponent={
                    surface === 'transparent' ? (
                      <BlurView
                        intensity={40}
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
            <View style={{ gap: t.spacing[4] }}>
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
              <VariantControlRow label="Behavior">
                {(['fixed', 'on scroll'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={scrollBehavior === option}
                    onPress={() => setScrollBehavior(option)}
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
