import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chart,
  seriesColorAt,
  useTokens,
  type ChartChrome,
  type ChartCurve,
  type ChartDensity,
  type ChartTone,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type Shape = 'rising' | 'falling' | 'volatile' | 'flat';
type FillMode = 'area' | 'line';
type State = 'default' | 'loading' | 'empty';
/** The props-on-Plot extras: the scrub readout, a second series with a band, min/max references. */
type Extra = 'off' | 'tooltip' | 'compare' | 'minmax' | 'stacked';

const TONES: ChartTone[] = ['auto', 'positive', 'negative', 'brand', 'neutral'];
const SHAPES: Shape[] = ['rising', 'falling', 'volatile', 'flat'];
const FILLS: FillMode[] = ['area', 'line'];
const CURVES: ChartCurve[] = ['steep', 'smooth'];
const DENSITIES: ChartDensity[] = ['default', 'compact'];
const CHROMES: ChartChrome[] = ['baseline', 'reference', 'none'];
const STATES: State[] = ['default', 'loading', 'empty'];
const EXTRAS: Extra[] = ['off', 'tooltip', 'compare', 'minmax', 'stacked'];
const PERIODS = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

/**
 * Deterministic sample series so the canvas looks the same on every render.
 *
 * The jitter is a hash, not a pair of sines. Two low-frequency sines summed to
 * ±11 against a trend of ~18 per step, which meant the noise never overcame the
 * trend and `rising`, `falling`, and `flat` came out **perfectly monotonic** —
 * zero direction changes across the whole series. A monotonic polyline is a
 * gentle arc with no corners in it, so `curve="steep"` and `curve="smooth"` drew
 * the same picture and the Curve control looked broken when it was working
 * exactly as specified.
 *
 * A series has to have corners before a control about corners can be judged.
 */
function series(shape: Shape, period: string): number[] {
  const count = period === '1D' ? 24 : period === '1W' ? 28 : period === 'ALL' ? 60 : 40;
  const seed = PERIODS.indexOf(period) + 1;
  // Deterministic hash noise: reverses direction often enough to read as a real
  // series, and identical on every render.
  const jitter = (index: number) => {
    const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
    return (x - Math.floor(x) - 0.5) * 70;
  };
  const points: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const base =
      shape === 'rising'
        ? 900 + t * 420
        : shape === 'falling'
          ? 1320 - t * 430
          : shape === 'flat'
            ? 1100
            : 1100 + Math.sin(t * Math.PI * 2.2 + seed) * 160;
    points.push(Number((base + jitter(i)).toFixed(2)));
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
  const [curve, setCurve] = useState<ChartCurve>('steep');
  const [period, setPeriod] = useState('1D');
  const [density, setDensity] = useState<ChartDensity>('default');
  const [chrome, setChrome] = useState<ChartChrome>('baseline');
  const [state, setState] = useState<State>('default');
  const [extra, setExtra] = useState<Extra>('off');
  const [scrubbed, setScrubbed] = useState<number | null>(null);
  const [previewOffset] = useState(() => new Animated.Value(0));

  const full = useMemo(() => series(shape, period), [shape, period]);
  const data = useMemo(() => (state === 'empty' ? [] : full), [full, state]);

  /**
   * The reference line has to sit inside the series to be worth looking at, so it
   * tracks the data rather than being a constant that drifts off-plot when the
   * shape changes.
   */
  const reference = useMemo(() => {
    if (full.length === 0) return undefined;
    const mean = full.reduce((sum, value) => sum + value, 0) / full.length;
    return { value: Number(mean.toFixed(2)), label: 'Average' };
  }, [full]);

  /** The min/max pair the `minmax` extra draws — computed off whatever series is up. */
  const minMax = useMemo(() => {
    if (full.length === 0) return undefined;
    const hi = Math.max(...full);
    const lo = Math.min(...full);
    return [
      { value: hi, label: money(hi) },
      { value: lo, label: money(lo) },
    ];
  }, [full]);

  /** A dashed baseline under the primary, and the likely range around it. */
  const compareData = useMemo(
    () => full.map((value) => Number((value * 0.9 + 60).toFixed(2))),
    [full],
  );
  const range = useMemo(
    () => ({
      lower: full.map((value) => Number((value * 0.88 + 20).toFixed(2))),
      upper: full.map((value) => Number((value * 1.1 + 90).toFixed(2))),
    }),
    [full],
  );

  /** Two layers stacked on the primary — part-to-total over a continuous x. */
  const stack = useMemo(
    () => [
      full.map((value) => Number((value * 0.35).toFixed(2))),
      full.map((value) => Number((value * 0.2).toFixed(2))),
    ],
    [full],
  );

  // `minmax` owns the chrome: the pair needs `reference`, whatever the chrome row says.
  const effectiveChrome: ChartChrome = extra === 'minmax' ? 'reference' : chrome;
  const effectiveReference = extra === 'minmax' ? minMax : reference;

  const seriesColor =
    tone === 'positive'
      ? t.colors.chartPositive
      : tone === 'negative'
        ? t.colors.chartNegative
        : tone === 'neutral'
          ? t.colors.textSecondary
          : tone === 'brand'
            ? t.colors.interactivePrimary
            : t.colors.chartPositive;

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
            <Chart
              data={data}
              tone={tone}
              density={density}
              chrome={effectiveChrome}
              reference={effectiveReference}
              loading={state === 'loading'}
              periods={PERIODS}
              period={period}
              onPeriodChange={setPeriod}
              onScrub={(index) => setScrubbed(index)}
            >
              <Chart.Empty
                title="No activity yet"
                description="Your spending will show up here as a chart once you make your first transaction."
                action={{ label: 'Log a transaction', onPress: () => setState('default') }}
              />
              <Chart.Value format={money} />
              <Chart.Delta format={money} />
              <Chart.Plot
                height={200}
                fill={fillMode === 'area'}
                curve={curve}
                tooltip={extra === 'tooltip'}
                compare={extra === 'compare' ? compareData : undefined}
                range={extra === 'compare' ? range : undefined}
                stack={extra === 'stacked' ? stack : undefined}
              />
              {extra === 'stacked' ? (
                /*
                 * Colours come from `seriesColorAt`, the same function the plot
                 * draws with — never hand-picked tokens. Spelling them out here
                 * is how the legend drifted: it claimed the first layer was
                 * `chartSeries2` while the primary sat on the tone palette, and
                 * both resolved to a green.
                 */
                <Chart.Legend
                  items={['Base', 'Bonus', 'Interest'].map((label, index) => ({
                    label,
                    color: seriesColorAt(t, index),
                  }))}
                />
              ) : null}
              {extra === 'compare' ? (
                <Chart.Legend
                  items={[
                    { label: 'Projected', color: seriesColor },
                    { label: 'Baseline', color: t.colors.chartOther },
                    { label: 'Likely range', color: t.colors.interactivePrimary, faded: true },
                  ]}
                />
              ) : null}
              <Chart.Periods />
            </Chart>
            {/*
              The scrub index, echoed back. Without it you can see the readout move
              but cannot tell whether `onScrub` fired, which is the half of the
              contract a consumer wires up.
            */}
            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: 'Manrope',
                fontSize: 12,
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              {scrubbed == null
                ? 'Drag across the chart to scrub'
                : `onScrub → index ${scrubbed} of ${data.length - 1}`}
            </Text>
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
            previous="Cards"
            next="Bar"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/cards')}
            onNext={() => router.replace('/chart/bar')}
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
              <VariantControlRow label="Curve">
                {CURVES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={curve === value}
                    onPress={() => setCurve(value)}
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
              <VariantControlRow label="Chrome">
                {CHROMES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={chrome === value}
                    onPress={() => setChrome(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Extras">
                {EXTRAS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={extra === value}
                    onPress={() => setExtra(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="State">
                {STATES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={state === value}
                    onPress={() => setState(value)}
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
