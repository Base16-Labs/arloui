import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chart, useTokens, type BarChartTone } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type Dataset = 'week' | 'signed';

const WEEK = [
  { label: 'M', value: 42 },
  { label: 'T', value: 28 },
  { label: 'W', value: 61 },
  { label: 'T', value: 35 },
  { label: 'F', value: 74 },
  { label: 'S', value: 18 },
  { label: 'S', value: 12 },
];

/** Negatives hang below the baseline, so they need their own sample. */
const SIGNED = [
  { label: 'Jan', value: 38 },
  { label: 'Feb', value: -12 },
  { label: 'Mar', value: 24 },
  { label: 'Apr', value: -31 },
  { label: 'May', value: 56 },
  { label: 'Jun', value: 9 },
];

const DATASETS: Dataset[] = ['week', 'signed'];
const TONES: BarChartTone[] = ['brand', 'series', 'direction'];

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

export default function BarChartCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dataset, setDataset] = useState<Dataset>('week');
  const [tone, setTone] = useState<BarChartTone>('brand');
  // Off by default: tapping a bar is how you read one exact figure.
  const [showValues, setShowValues] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [previewOffset] = useState(() => new Animated.Value(0));

  const data = dataset === 'week' ? WEEK : SIGNED;

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
            <Chart.Bar
              data={data}
              height={200}
              tone={tone}
              showValues={showValues}
              showLabels={showLabels}
              format={money}
              selectedIndex={selected}
              onSelect={(index) => setSelected(index === selected ? null : index)}
            />
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
                componentName="Bar"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Chart"
            next="Donut"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/chart')}
            onNext={() => router.replace('/chart/donut')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Data">
                {DATASETS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value === 'week' ? 'positive' : 'with negatives'}
                    active={dataset === value}
                    onPress={() => {
                      setDataset(value);
                      setSelected(null);
                    }}
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
              <VariantControlRow label="Values">
                {(['show', 'hide'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={showValues === (option === 'show')}
                    onPress={() => setShowValues(option === 'show')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Labels">
                {(['show', 'hide'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={showLabels === (option === 'show')}
                    onPress={() => setShowLabels(option === 'show')}
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
