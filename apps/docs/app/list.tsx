import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { List, useTokens, type ListDensity, type ListDivider } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type Leading = 'icon' | 'media' | 'none';
type Trailing = 'value' | 'icon' | 'both' | 'none';

const DIVIDERS: ListDivider[] = ['inset', 'balanced', 'edge', 'none'];
const DENSITIES: ListDensity[] = ['comfortable', 'compact'];
const LEADINGS: Leading[] = ['icon', 'media', 'none'];
const TRAILINGS: Trailing[] = ['value', 'icon', 'both', 'none'];

export default function ListCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [separated, setSeparated] = useState(false);
  const [divider, setDivider] = useState<ListDivider>('inset');
  const [density, setDensity] = useState<ListDensity>('comfortable');
  const [leading, setLeading] = useState<Leading>('icon');
  const [trailing, setTrailing] = useState<Trailing>('both');
  const [previewOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -120 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [previewOffset, sheetOpen]);

  const leadingNode = (icon: keyof typeof Ionicons.glyphMap) => {
    if (leading === 'none') return undefined;
    if (leading === 'media') {
      return (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: t.radii.md,
            backgroundColor: t.colors.surfaceStrong,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={20} color={t.colors.textSecondary} />
        </View>
      );
    }
    return <Ionicons name={icon} size={22} color={t.colors.textSecondary} />;
  };

  const chevron =
    trailing === 'icon' || trailing === 'both' ? (
      <Ionicons name="chevron-forward" size={18} color={t.colors.textTertiary} />
    ) : undefined;
  const showValue = trailing === 'value' || trailing === 'both';

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
              zIndex: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LiveBadge />
            </View>
            <ThemeToggle />
          </View>

          <Animated.View style={{ flex: 1, transform: [{ translateY: previewOffset }] }}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 76,
                paddingBottom: 120,
                justifyContent: 'center',
                flexGrow: 1,
              }}
            >
              <List separated={separated} divider={divider} density={density}>
                <List.Row
                  leading={leadingNode('musical-notes')}
                  title="Spotify"
                  subtitle="Yesterday"
                  value={showValue ? '−$9.99' : undefined}
                  valueTone="negative"
                  trailing={chevron}
                  onPress={() => {}}
                />
                <List.Row
                  leading={leadingNode('trending-up')}
                  title="Transfer from Ada"
                  subtitle="Mar 3"
                  value={showValue ? '+$1,200.00' : undefined}
                  valueTone="positive"
                  valueCaption={showValue ? 'Completed' : undefined}
                  trailing={chevron}
                  onPress={() => {}}
                />
                <List.Row
                  leading={leadingNode('card')}
                  title="Apple Card"
                  subtitle="Feb 28"
                  value={showValue ? '−$42.10' : undefined}
                  trailing={chevron}
                  onPress={() => {}}
                />
              </List>
            </ScrollView>
          </Animated.View>

          {!sheetOpen ? (
            <View
              style={{
                position: 'absolute',
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="List"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Card"
            next="Carousel"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/cards')}
            onNext={() => router.replace('/carousel')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Separated">
                {(['off', 'on'] as const).map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={separated === (value === 'on')}
                    onPress={() => setSeparated(value === 'on')}
                  />
                ))}
              </VariantControlRow>
              {!separated ? (
                <VariantControlRow label="Divider">
                  {DIVIDERS.map((value) => (
                    <VariantChip
                      key={value}
                      label={value}
                      active={divider === value}
                      onPress={() => setDivider(value)}
                    />
                  ))}
                </VariantControlRow>
              ) : null}
              <VariantControlRow label="Density">
                {DENSITIES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={density === value}
                    onPress={() => setDensity(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Leading">
                {LEADINGS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={leading === value}
                    onPress={() => setLeading(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Trailing">
                {TRAILINGS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={trailing === value}
                    onPress={() => setTrailing(value)}
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
