import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chart, useTokens } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type Dataset = 'spend' | 'many';

const SPEND = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
  { label: 'Utilities', value: 180 },
];

/** Past the palette's capacity, so the chart folds the tail into one neutral slice. */
const MANY = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
  { label: 'Utilities', value: 180 },
  { label: 'Subscriptions', value: 90 },
  { label: 'Gifts', value: 60 },
  { label: 'Repairs', value: 45 },
];

const DATASETS: Dataset[] = ['spend', 'many'];

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

export default function DonutChartCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dataset, setDataset] = useState<Dataset>('spend');
  const [showLegend, setShowLegend] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [previewOffset] = useState(() => new Animated.Value(0));

  const data = dataset === 'spend' ? SPEND : MANY;

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
            <Chart.Donut
              data={data}
              centerLabel="Monthly spend"
              format={money}
              showLegend={showLegend}
              activeIndex={selected}
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
                componentName="Donut"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Bar"
            next="Meter"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/chart/bar')}
            onNext={() => router.replace('/chart/meter')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Data">
                {DATASETS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value === 'spend' ? 'four categories' : 'folds into Other'}
                    active={dataset === value}
                    onPress={() => {
                      setDataset(value);
                      setSelected(null);
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Legend">
                {(['show', 'hide'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={showLegend === (option === 'show')}
                    onPress={() => setShowLegend(option === 'show')}
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
