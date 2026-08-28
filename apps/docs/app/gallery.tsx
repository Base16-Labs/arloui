import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Gallery,
  useTokens,
  type GalleryColumns,
  type GalleryRadius,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

const COLUMN_OPTIONS: GalleryColumns[] = [1, 2, 3, 4];
const RADIUS_OPTIONS: GalleryRadius[] = ['none', 'sm', 'md', 'lg', 'xl'];

const MASONRY_HEIGHTS = [
  180, 120, 200, 140, 160, 110, 190, 130, 170, 150, 125, 195,
  145, 115, 175, 135, 185, 155,
];

export default function GalleryCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [columns, setColumns] = useState<GalleryColumns>(2);
  const [radius, setRadius] = useState<GalleryRadius>('lg');
  const [masonry, setMasonry] = useState(false);
  const [gap, setGap] = useState<0 | 1 | 2 | 3 | 4>(2);
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] }}>
              <LiveBadge />
            </View>
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              paddingTop: t.spacing[20],
              paddingHorizontal: t.spacing[4],
              transform: [{ translateY: previewOffset }],
            }}
          >
            <Gallery
              columns={columns}
              radius={radius}
              masonry={masonry}
              gap={t.spacing[gap]}
              contentContainerStyle={{ paddingBottom: t.spacing[24] + t.spacing[1] }}
            >
              {MASONRY_HEIGHTS.map((h, i) => (
                <View
                  key={i}
                  style={{
                    height: masonry ? h : 140,
                    backgroundColor: t.colors.surfaceRaised,
                  }}
                />
              ))}
            </Gallery>
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
                componentName="Gallery"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Carousel"
            next="Button"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/carousel')}
            onNext={() => router.replace('/button')}
          >
            <View style={{ gap: t.spacing[4] }}>
              <VariantControlRow label="Columns">
                {COLUMN_OPTIONS.map((value) => (
                  <VariantChip
                    key={value}
                    label={String(value)}
                    active={columns === value}
                    onPress={() => setColumns(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Radius">
                {RADIUS_OPTIONS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={radius === value}
                    onPress={() => setRadius(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Masonry">
                {['on', 'off'].map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={masonry === (value === 'on')}
                    onPress={() => setMasonry(value === 'on')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Gap">
                {([0, 1, 2, 3, 4] as const).map((value) => (
                  <VariantChip
                    key={value}
                    label={String(value)}
                    active={gap === value}
                    onPress={() => setGap(value)}
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
