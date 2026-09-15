import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chart,
  useTokens,
  type ChartChrome,
  type BarChartLayout,
  type BarChartSpacing,
  type BarChartVariant,
  type ChartDensity,
  type ChartTone,
} from '@arloui/registry';
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

type Dataset = 'week' | 'signed';
type State = 'default' | 'loading' | 'empty';

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

/** The two-series sample the grouped and stacked modes share. */
const SLEEP: { label: string; value: number }[] = [
  { label: 'M', value: 7.5 },
  { label: 'T', value: 6.8 },
  { label: 'W', value: 8.1 },
  { label: 'T', value: 7.2 },
  { label: 'F', value: 6.4 },
  { label: 'S', value: 8.8 },
  { label: 'S', value: 8.3 },
];
const ACTIVITY: { label: string; value: number }[] = [
  { label: 'M', value: 5.2 },
  { label: 'T', value: 6.1 },
  { label: 'W', value: 4.4 },
  { label: 'T', value: 5.8 },
  { label: 'F', value: 7.0 },
  { label: 'S', value: 3.9 },
  { label: 'S', value: 4.6 },
];

/**
 * The signed counterpart to `ACTIVITY`, so the Data control stays live in
 * grouped and stacked.
 *
 * It used to be dead the moment Series left `single`: `data` was hardcoded to
 * `SLEEP` whenever the chart was multi-series, so pressing "signed" changed
 * nothing. A control that only works in one of three modes reads as broken in
 * the other two.
 *
 * Grouped draws the negatives; stacked clamps them to zero, which is the
 * documented rule — a negative share of a total is not a thing the shape can
 * express.
 */
const SIGNED_B: { label: string; value: number }[] = [
  { label: 'Jan', value: 21 },
  { label: 'Feb', value: 14 },
  { label: 'Mar', value: -18 },
  { label: 'Apr', value: 12 },
  { label: 'May', value: -9 },
  { label: 'Jun', value: 27 },
];

const DATASETS: Dataset[] = ['week', 'signed'];
const SPACINGS: BarChartSpacing[] = ['tight', 'default', 'loose'];
const CHROMES: ChartChrome[] = ['none', 'baseline', 'reference'];
/**
 * Every tone `Chart.Bar` honours, in the order its props document them. An earlier
 * set stopped at three, which left `positive`, `negative`, and `neutral` shipping
 * untested by eye.
 */
const TONES: ChartTone[] = ['brand', 'series', 'auto', 'positive', 'negative', 'neutral'];
const DENSITIES: ChartDensity[] = ['default', 'compact'];
const STATES: State[] = ['default', 'loading', 'empty'];
const LAYOUTS: BarChartLayout[] = ['vertical', 'horizontal'];
const MODES: ('single' | BarChartVariant)[] = ['single', 'grouped', 'stacked'];

const money = (value: number) => `$${value.toLocaleString('en-US')}`;
const hours = (value: number) => `${value}h`;

export default function BarChartCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const motion = useChartMotionControls();
  const [dataset, setDataset] = useState<Dataset>('week');
  const [tone, setTone] = useState<ChartTone>('brand');
  // Off by default: tapping a bar is how you read one exact figure.
  const [showValues, setShowValues] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [density, setDensity] = useState<ChartDensity>('default');
  const [state, setState] = useState<State>('default');
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<'single' | BarChartVariant>('single');
  const [layout, setLayout] = useState<BarChartLayout>('vertical');
  const [spacing, setSpacing] = useState<BarChartSpacing>('default');
  const [chrome, setChrome] = useState<ChartChrome>('baseline');

  const multi = mode !== 'single';
  const singleData = useMemo(
    () => (state === 'empty' ? [] : dataset === 'week' ? WEEK : SIGNED),
    [state, dataset],
  );
  const multiPrimary = dataset === 'signed' ? SIGNED : SLEEP;
  const multiSecond = dataset === 'signed' ? SIGNED_B : ACTIVITY;
  const data = multi ? (state === 'empty' ? [] : multiPrimary) : singleData;
  const format = multi && dataset !== 'signed' ? hours : money;

  /** The AVG line tracks whichever series is on screen. */
  const average = useMemo(() => {
    const list = multi ? multiPrimary : singleData;
    if (list.length === 0) return 0;
    return list.reduce((sum, bar) => sum + bar.value, 0) / list.length;
  }, [multi, multiPrimary, singleData]);

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
            <Chart.Bar
              animated={motion.animated}
              key={motion.replay}
              variant={mode === 'stacked' ? 'stacked' : 'grouped'}
              layout={layout}
              spacing={spacing}
              height={layout === 'horizontal' ? undefined : 200}
              tone={tone}
              density={density}
              loading={state === 'loading'}
              format={format}
              empty={{
                title: 'No spending yet',
                description: 'Categories will appear here once you log your first transaction.',
                action: { label: 'Log a transaction', onPress: () => setState('default') },
              }}
              activeIndex={selected}
              onSelect={(index) => setSelected(index === selected ? null : index)}
            >
              {/*
                The controls now toggle parts in and out of the tree rather than
                flipping booleans. A part that is not named is not drawn — which
                is the whole of the rule, visible in one place.
              */}
              <Chart.Bar.Series
                data={data}
                label={multi ? (dataset === 'signed' ? 'Flows' : 'Sleep') : undefined}
              />
              {multi ? (
                <Chart.Bar.Series
                  data={state === 'empty' ? [] : multiSecond}
                  label={dataset === 'signed' ? 'Fees' : 'Activity'}
                />
              ) : null}
              {showValues ? <Chart.Bar.Values /> : null}
              {showLabels ? <Chart.Bar.Categories /> : null}
              {chrome !== 'none' ? <Chart.Bar.Baseline /> : null}
              {chrome === 'reference' ? (
                <Chart.Bar.Reference value={Number(average.toFixed(2))} label="AVG" />
              ) : null}
              {multi ? <Chart.Bar.Legend /> : null}
            </Chart.Bar>
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
                componentName="Bar"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Line chart"
            next="Donut"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/chart')}
            onNext={() => router.replace('/chart/donut')}
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
                  <VariantControlRow label="Series">
                    {MODES.map((value) => (
                      <VariantChip
                        key={value}
                        label={value}
                        active={mode === value}
                        onPress={() => {
                          setMode(value);
                          if (value === 'stacked') setDataset('week');
                          setSelected(null);
                        }}
                      />
                    ))}
                  </VariantControlRow>
                  <VariantControlRow label="Spacing">
                    {SPACINGS.map((value) => (
                      <VariantChip
                        key={value}
                        label={value}
                        active={spacing === value}
                        onPress={() => setSpacing(value)}
                      />
                    ))}
                  </VariantControlRow>
                  <VariantControlRow label="Layout">
                    {LAYOUTS.map((value) => (
                      <VariantChip
                        key={value}
                        label={value}
                        active={layout === value}
                        onPress={() => setLayout(value)}
                      />
                    ))}
                  </VariantControlRow>
                  {/*
                A real three-way chrome control, not a Reference on/off toggle.
                `none` was unreachable, which meant the rail behind horizontal
                rows could not be turned off from here at all.
              */}
                  <VariantControlRow label="Guides">
                    {CHROMES.map((value) => (
                      <VariantChip
                        key={value}
                        label={value === 'reference' ? 'average' : value}
                        active={chrome === value}
                        onPress={() => setChrome(value)}
                      />
                    ))}
                  </VariantControlRow>
                  <VariantControlRow label="Data">
                    {DATASETS.map((value) => (
                      <VariantChip
                        key={value}
                        label={value === 'week' ? 'positive' : 'with negatives'}
                        active={dataset === value}
                        onPress={() => {
                          setDataset(value);
                          if (value === 'signed' && mode === 'stacked') setMode('grouped');
                          setSelected(null);
                        }}
                      />
                    ))}
                  </VariantControlRow>
                  {/*
                Tone is a single-series decision. With `series`, every bar takes
                its own palette slot and `tone` is documented as ignored — so
                under grouped or stacked the row is hidden rather than left
                looking live and doing nothing.
              */}
                  {!multi ? (
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
                  ) : null}
                  <VariantControlRow label="Values">
                    {(['show', 'hide'] as const).map((option) => (
                      <VariantChip
                        key={option}
                        label={option === 'show' ? 'always' : 'on tap'}
                        active={showValues === (option === 'show')}
                        onPress={() => setShowValues(option === 'show')}
                      />
                    ))}
                  </VariantControlRow>
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
                  {!(layout === 'vertical' && density === 'compact') ? (
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
                  ) : null}
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
