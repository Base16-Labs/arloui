import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Carousel,
  useTokens,
  type CarouselIndicator,
  type CarouselIndicatorPosition,
  type CarouselSnap,
} from '@arloui/registry';
import { BackButton } from '@/components/playground/back-button';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

const SNAPS: CarouselSnap[] = ['item', 'page'];
const INDICATORS: CarouselIndicator[] = ['dots', 'none'];

const CARD_LABELS = [
  'Card 1', 'Card 2', 'Card 3', 'Card 4',
  'Card 5', 'Card 6', 'Card 7', 'Card 8',
];

export default function CarouselCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [snap, setSnap] = useState<CarouselSnap>('item');
  const [peek, setPeek] = useState(true);
  const [indicator, setIndicator] = useState<CarouselIndicator>('dots');
  const [loop, setLoop] = useState(false);
  const [arrows, setArrows] = useState(false);
  const [indicatorPosition, setIndicatorPosition] = useState<CarouselIndicatorPosition>('below');
  const [gap, setGap] = useState<0 | 1 | 2 | 3 | 4>(3);
  const previewOffset = useRef(new Animated.Value(0)).current;

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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <BackButton />
              <LiveBadge />
            </View>
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              justifyContent: 'center',
              transform: [{ translateY: previewOffset }],
            }}
          >
            <Carousel
              snap={snap}
              peek={peek}
              indicator={indicator}
              indicatorPosition={indicatorPosition}
              arrows={arrows}
              loop={loop}
              gap={t.spacing[gap]}
            >
              {CARD_LABELS.map((label) => (
                <View
                  key={label}
                  style={{
                    height: 280,
                    borderRadius: t.radii.xl,
                    backgroundColor: t.colors.surfaceRaised,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ))}
            </Carousel>
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
                componentName="Carousel"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Date Picker"
            next="Gallery"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/date-picker')}
            onNext={() => router.replace('/gallery')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Snap">
                {SNAPS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={snap === value}
                    onPress={() => setSnap(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Peek">
                {['on', 'off'].map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={peek === (value === 'on')}
                    onPress={() => setPeek(value === 'on')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Indicator">
                {INDICATORS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={indicator === value}
                    onPress={() => setIndicator(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Loop">
                {['on', 'off'].map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={loop === (value === 'on')}
                    onPress={() => setLoop(value === 'on')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Arrows">
                {['on', 'off'].map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={arrows === (value === 'on')}
                    onPress={() => setArrows(value === 'on')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Dots">
                {(['below', 'overlay'] as const).map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={indicatorPosition === value}
                    onPress={() => setIndicatorPosition(value)}
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
