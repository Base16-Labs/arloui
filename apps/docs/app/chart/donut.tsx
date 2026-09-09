import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chart, useTokens } from '@arloui/registry';
import { ChartCanvas } from '@/components/playground/chart-canvas';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';
import {
  ChartMotionControls,
  useChartMotionControls,
} from '@/components/playground/chart-motion-controls';

type State = 'default' | 'loading' | 'empty';

/**
 * One pool, taken from the front. The Categories control slices it, so the fold
 * into "Other" is something you walk into by adding categories rather than a
 * second control arguing with the first: the palette names four, so five is
 * where the tail starts collapsing.
 */
const CATEGORIES = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
  { label: 'Utilities', value: 180 },
  { label: 'Subscriptions', value: 90 },
  { label: 'Gifts', value: 60 },
  { label: 'Repairs', value: 45 },
];

const COUNTS = [1, 3, 4, 5] as const;
const STATES: State[] = ['default', 'loading', 'empty'];
/**
 * Ring weights, not arbitrary numbers: `thin` is the inline-beside-a-legend look,
 * `default` the standalone one, and `thick` is where the centre readout starts to
 * crowd — worth being able to see before someone ships it.
 */
const THICKNESSES = [
  { label: 'thin', value: 16 },
  { label: 'default', value: 26 },
  { label: 'thick', value: 38 },
] as const;

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

export default function DonutChartCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const motion = useChartMotionControls();
  const [count, setCount] = useState<number>(4);
  const [showLegend, setShowLegend] = useState(true);
  const [thickness, setThickness] = useState<number>(26);
  const [showValue, setShowValue] = useState(true);
  const [state, setState] = useState<State>('default');
  const [selected, setSelected] = useState<number | null>(null);

  const data = state === 'empty' ? [] : CATEGORIES.slice(0, count);

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

          <ChartCanvas sheetOpen={sheetOpen}>
            <Chart.Donut
              animated={motion.animated}
              key={motion.replay}
              data={data}
              format={money}
              thickness={thickness}
              loading={state === 'loading'}
              empty={{
                title: 'No spending yet',
                description: 'Your categories will appear here once you log a transaction.',
                action: { label: 'Log a transaction', onPress: () => setState('default') },
              }}
              activeIndex={selected}
              onSelect={(index) => setSelected(index === selected ? null : index)}
            >
              {showValue ? <Chart.Donut.Value /> : null}
              {showValue ? <Chart.Donut.Label>Monthly spend</Chart.Donut.Label> : null}
              {showLegend ? <Chart.Donut.Legend /> : null}
            </Chart.Donut>
          </ChartCanvas>

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
              <VariantControlRow label="State">
                {STATES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={state === value}
                    onPress={() => {
                      setState(value);
                      setSelected(null);
                    }}
                  />
                ))}
              </VariantControlRow>
              {state === 'default' ? (
                <>
                  <VariantControlRow label="Data">
                    {COUNTS.map((value) => (
                      <VariantChip
                        key={value}
                        label={`${value} ${value === 1 ? 'category' : 'categories'}`}
                        active={count === value}
                        onPress={() => {
                          setCount(value);
                          setSelected(null);
                        }}
                      />
                    ))}
                  </VariantControlRow>
                  <VariantControlRow label="Stroke">
                    {THICKNESSES.map((option) => (
                      <VariantChip
                        key={option.label}
                        label={option.label}
                        active={thickness === option.value}
                        onPress={() => setThickness(option.value)}
                      />
                    ))}
                  </VariantControlRow>
                  <VariantControlRow label="Center">
                    {(['value', 'hidden'] as const).map((option) => (
                      <VariantChip
                        key={option}
                        label={option}
                        active={showValue === (option === 'value')}
                        onPress={() => setShowValue(option === 'value')}
                      />
                    ))}
                  </VariantControlRow>
                  <VariantControlRow label="Legend">
                    {(['show', 'hide'] as const).map((option) => (
                      <VariantChip
                        key={option}
                        label={option}
                        active={showLegend === (option === 'show')}
                        onPress={() => {
                          setShowLegend(option === 'show');
                          setSelected(null);
                        }}
                      />
                    ))}
                  </VariantControlRow>
                </>
              ) : null}
              {state !== 'empty' ? (
                <ChartMotionControls {...motion} disabled={state !== 'default'} />
              ) : null}
            </View>
          </VariantSheet>
        </View>
      </SafeAreaView>
    </>
  );
}
