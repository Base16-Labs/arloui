import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chart, useTokens, type ChartCurve, type ChartTone } from '@arloui/registry';
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

type Height = 'inline' | 'standalone';
type State = 'default' | 'loading' | 'empty';

const HEIGHTS: Height[] = ['inline', 'standalone'];
// Size presets set both the canvas height and the appropriate stroke density.
const CURVES: ChartCurve[] = ['steep', 'smooth'];
const STATES: State[] = ['default', 'loading', 'empty'];
/**
 * Tone is a control, not four rows.
 *
 * The canvas used to render Rising / Falling / Brand / Neutral all at once, with
 * the tone baked into each row — so `tone` had no chip of its own and the two
 * things it actually varies, the hue and the direction it infers, could not be
 * changed independently. One mark and two controls says the same thing and lets
 * you drive it.
 */
const TONES: ChartTone[] = ['auto', 'positive', 'negative', 'brand', 'neutral'];
const DIRECTIONS = ['rising', 'falling'] as const;
const money = (value: number) => `$${value.toFixed(2)}`;

/** Deterministic series so the canvas looks the same on every render. */
/**
 * Deterministic sample series so the canvas looks the same on every render.
 *
 * The jitter is a hash, not a pair of sines — the same fix the Plot's canvas
 * needed. Two low-frequency sines summed to about ±11 against a trend of ~13.5
 * per step, so the noise never overcame the trend and both series came out
 * **perfectly monotonic**: zero direction changes across thirty segments. A
 * monotonic polyline is a gentle arc with no corners in it, so `curve="steep"`
 * and `curve="smooth"` drew the same picture and the Curve control looked broken
 * while working exactly as specified.
 *
 * A series has to have corners before a control about corners can be judged.
 */
function series(direction: 'up' | 'down'): number[] {
  const seed = direction === 'up' ? 1 : 2;
  const jitter = (index: number) => {
    const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
    return (x - Math.floor(x) - 0.5) * 55;
  };
  const points: number[] = [];
  for (let i = 0; i < 32; i += 1) {
    const t = i / 31;
    const base = direction === 'up' ? 900 + t * 420 : 1320 - t * 430;
    points.push(Number((base + jitter(i)).toFixed(2)));
  }
  return points;
}

export default function SparklineCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const motion = useChartMotionControls();
  const [size, setSize] = useState<Height>('inline');
  const [curve, setCurve] = useState<ChartCurve>('steep');
  const [state, setState] = useState<State>('default');
  const [fill, setFill] = useState(false);
  const [showEndDot, setShowEndDot] = useState(false);
  const [tone, setTone] = useState<ChartTone>('auto');
  const [direction, setDirection] = useState<(typeof DIRECTIONS)[number]>('rising');
  const [showExtremes, setShowExtremes] = useState(false);

  const rising = useMemo(() => series('up'), []);
  const falling = useMemo(() => series('down'), []);
  const height = size === 'inline' ? 28 : 88;
  const density = size === 'inline' ? 'compact' : 'default';
  const trend = direction === 'rising' ? rising : falling;

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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Text
                  style={{
                    color: t.colors.textSecondary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.bodySm.fontSize,
                  }}
                >
                  Portfolio
                </Text>
                <Text
                  style={{
                    color: t.colors.textPrimary,
                    fontFamily: t.fontFamilies.sans,
                    fontSize: t.typography.headingLarge.fontSize,
                  }}
                >
                  {state === 'default'
                    ? money(trend[trend.length - 1]!)
                    : state === 'loading'
                      ? 'Loading'
                      : 'No activity'}
                </Text>
              </View>
              <View style={{ width: '42%', maxWidth: 180 }}>
                <Chart.Sparkline
                  animated={motion.animated}
                  key={motion.replay}
                  data={state === 'empty' ? [] : trend}
                  tone={tone}
                  density={density}
                  curve={curve}
                  height={height}
                  format={money}
                  emptyLabel="No data"
                  loading={state === 'loading'}
                  accessibilityLabel={
                    state === 'default'
                      ? `${direction} portfolio trend`
                      : `${state} portfolio trend`
                  }
                >
                  {fill ? <Chart.Sparkline.Fill /> : null}
                  {showEndDot ? <Chart.Sparkline.EndDot /> : null}
                  {showExtremes && size !== 'inline' ? <Chart.Sparkline.Extremes /> : null}
                </Chart.Sparkline>
              </View>
            </View>
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
                componentName="Sparkline"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Meter"
            next="Heatmap"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/chart/meter')}
            onNext={() => router.replace('/chart/heatmap')}
          >
            <View style={{ gap: 14 }}>
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
              {state === 'default' ? (
                <>
                  <VariantControlRow label="Size">
                    {HEIGHTS.map((value) => (
                      <VariantChip
                        key={value}
                        label={value === 'inline' ? 'compact' : 'expanded'}
                        active={size === value}
                        onPress={() => setSize(value)}
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
                  {/* `auto` infers its hue from direction, so the two need to move separately. */}
                  <VariantControlRow label="Direction">
                    {DIRECTIONS.map((value) => (
                      <VariantChip
                        key={value}
                        label={value}
                        active={direction === value}
                        onPress={() => setDirection(value)}
                      />
                    ))}
                  </VariantControlRow>
                  {size !== 'inline' ? (
                    <VariantControlRow label="Min/max">
                      {(['off', 'on'] as const).map((option) => (
                        <VariantChip
                          key={option}
                          label={option}
                          active={showExtremes === (option === 'on')}
                          onPress={() => setShowExtremes(option === 'on')}
                        />
                      ))}
                    </VariantControlRow>
                  ) : null}
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
                  <VariantControlRow label="Fill">
                    {(['on', 'off'] as const).map((option) => (
                      <VariantChip
                        key={option}
                        label={option}
                        active={fill === (option === 'on')}
                        onPress={() => setFill(option === 'on')}
                      />
                    ))}
                  </VariantControlRow>
                  <VariantControlRow label="End dot">
                    {(['on', 'off'] as const).map((option) => (
                      <VariantChip
                        key={option}
                        label={option}
                        active={showEndDot === (option === 'on')}
                        onPress={() => setShowEndDot(option === 'on')}
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
