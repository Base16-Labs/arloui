import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BarChart,
  Chart,
  DonutChart,
  Meter,
  Sparkline,
  useTokens,
  type ChartTone,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type Shape = 'rising' | 'falling' | 'volatile' | 'flat';
type FillMode = 'area' | 'line';
type Form = 'line' | 'bar' | 'donut' | 'meter' | 'sparkline';

const FORMS: Form[] = ['line', 'bar', 'donut', 'meter', 'sparkline'];

const WEEK = [
  { label: 'M', value: 42 },
  { label: 'T', value: 28 },
  { label: 'W', value: 61 },
  { label: 'T', value: 35 },
  { label: 'F', value: 74 },
  { label: 'S', value: 18 },
  { label: 'S', value: 12 },
];

const BREAKDOWN = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
  { label: 'Utilities', value: 180 },
  { label: 'Other bits', value: 90 },
];

const TONES: ChartTone[] = ['auto', 'positive', 'negative', 'neutral'];
const SHAPES: Shape[] = ['rising', 'falling', 'volatile', 'flat'];
const FILLS: FillMode[] = ['area', 'line'];
const PERIODS = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

/** Deterministic sample series so the canvas looks the same on every render. */
function series(shape: Shape, period: string): number[] {
  const count = period === '1D' ? 24 : period === '1W' ? 28 : period === 'ALL' ? 60 : 40;
  const seed = PERIODS.indexOf(period) + 1;
  const points: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    // A couple of out-of-phase sines stand in for market noise.
    const noise = Math.sin(i * 0.9 + seed) * 4 + Math.sin(i * 0.31 + seed * 2) * 7;
    const base =
      shape === 'rising'
        ? 900 + t * 420
        : shape === 'falling'
          ? 1320 - t * 430
          : shape === 'flat'
            ? 1100
            : 1100 + Math.sin(t * Math.PI * 2.2 + seed) * 160;
    points.push(Number((base + (shape === 'flat' ? 0 : noise)).toFixed(2)));
  }
  return points;
}

const money = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ChartCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tone, setTone] = useState<ChartTone>('auto');
  const [shape, setShape] = useState<Shape>('rising');
  const [fillMode, setFillMode] = useState<FillMode>('area');
  const [form, setForm] = useState<Form>('line');
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [period, setPeriod] = useState('1D');
  const [previewOffset] = useState(() => new Animated.Value(0));

  const data = useMemo(() => series(shape, period), [shape, period]);

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
              <LiveBadge />
            </View>
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
            {form === 'line' ? (
              <>
                <Chart
                  data={data}
                  tone={tone}
                  periods={PERIODS}
                  period={period}
                  onPeriodChange={setPeriod}
                >
                  <Chart.Value format={money} />
                  <Chart.Delta format={money} />
                  <Chart.Plot height={200} fill={fillMode === 'area'} />
                  <Chart.Periods />
                </Chart>
                <Text
                  style={{
                    color: t.colors.textTertiary,
                    fontFamily: 'Manrope',
                    fontSize: 12,
                    marginTop: 12,
                    textAlign: 'center',
                  }}
                >
                  Drag across the chart to scrub
                </Text>
              </>
            ) : null}

            {form === 'bar' ? (
              <BarChart
                data={WEEK}
                height={180}
                showValues
                selectedIndex={selectedBar}
                onSelect={(index) => setSelectedBar(index === selectedBar ? null : index)}
              />
            ) : null}

            {form === 'donut' ? (
              <DonutChart data={BREAKDOWN} centerLabel="Monthly spend" format={money} />
            ) : null}

            {form === 'meter' ? (
              <View style={{ gap: 24, alignItems: 'center' }}>
                <Meter shape="ring" value={1840} max={2000} label="Steps" tone="positive" />
                <View style={{ alignSelf: 'stretch', gap: 16 }}>
                  <Meter value={72} max={100} label="Storage" />
                  <Meter value={88} max={100} label="Budget used" warnAt={0.75} dangerAt={0.9} />
                  <Meter value={42} max={100} label="Goal" tone="neutral" />
                </View>
              </View>
            ) : null}

            {form === 'sparkline' ? (
              <View style={{ gap: 20 }}>
                <Sparkline data={data} height={44} fill showEndDot accessibilityLabel="Rising trend" />
                <Sparkline
                  data={[...data].reverse()}
                  height={44}
                  fill
                  showEndDot
                  accessibilityLabel="Falling trend"
                />
                <Sparkline data={data} height={28} tone="neutral" accessibilityLabel="Neutral trend" />
              </View>
            ) : null}
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
                componentName="Chart"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Carousel"
            next="Gallery"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/carousel')}
            onNext={() => router.replace('/gallery')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Form">
                {FORMS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={form === value}
                    onPress={() => setForm(value)}
                  />
                ))}
              </VariantControlRow>
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
              <VariantControlRow label="Fill">
                {FILLS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={fillMode === value}
                    onPress={() => setFillMode(value)}
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
