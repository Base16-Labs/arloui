import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chart, useTokens, type MeterShape, type MeterTone } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

const SHAPES: MeterShape[] = ['bar', 'ring'];
const TONES: MeterTone[] = ['brand', 'positive', 'negative', 'neutral'];
/** Three levels so the threshold colours are visible side by side. */
const LEVELS = [
  { value: 42, label: 'Goal' },
  { value: 72, label: 'Storage' },
  { value: 88, label: 'Budget used' },
] as const;

export default function MeterCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shape, setShape] = useState<MeterShape>('bar');
  const [tone, setTone] = useState<MeterTone>('brand');
  const [thresholds, setThresholds] = useState(true);
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

  const threshold = thresholds ? { warnAt: 0.75, dangerAt: 0.85 } : {};

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
            <LiveBadge />
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 20,
              transform: [{ translateY: previewOffset }],
            }}
          >
            <View
              style={
                shape === 'ring'
                  ? { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }
                  : { gap: 20 }
              }
            >
              {LEVELS.map(({ value, label }) => (
                <Chart.Meter
                  key={label}
                  shape={shape}
                  tone={tone}
                  value={value}
                  max={100}
                  label={label}
                  {...threshold}
                />
              ))}
            </View>
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
                componentName="Meter"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Donut"
            next="Sparkline"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/chart/donut')}
            onNext={() => router.replace('/chart/sparkline')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Shape">
                {SHAPES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={shape === value}
                    onPress={() => setShape(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Tone">
                {TONES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={tone === value}
                    onPress={() => setTone(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Thresholds">
                {(['on', 'off'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={thresholds === (option === 'on')}
                    onPress={() => setThresholds(option === 'on')}
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
