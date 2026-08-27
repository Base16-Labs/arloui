import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chart,
  useTokens,
  type ChartDensity,
  type ChartTone,
  type MeterShape,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type State = 'default' | 'loading';

const SHAPES: MeterShape[] = ['bar', 'ring', 'arc'];
const TONES: ChartTone[] = ['brand', 'positive', 'negative', 'neutral'];
const DENSITIES: ChartDensity[] = ['default', 'compact'];
const STATES: State[] = ['default', 'loading'];

const WARN_AT = 0.75;
const DANGER_AT = 0.85;

/**
 * One meter on the canvas, and a control to move it — the arrangement every
 * other playground here uses.
 *
 * Ring and arc used to render three at once so the geometry that is easiest to
 * get wrong stayed reachable: a full sweep, where the arc's start and end
 * coincide, and a near-full one, where the fill's rounded cap laps its own tail.
 * Three of them never fit a phone row, which is why they had been shrunk to
 * 100pt to squeeze in. A level control keeps every one of those states reachable
 * at full size — a playground exists to let you exercise states, not to display
 * them all simultaneously.
 *
 * The set covers both things worth checking. `12` and `100` are the geometry
 * ends; `53`, `79`, and `90` land in the brand, warning, and danger bands, so
 * turning thresholds on walks all three colours.
 */
const LEVELS = [12, 53, 79, 90, 100] as const;

export default function MeterCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shape, setShape] = useState<MeterShape>('bar');
  const [level, setLevel] = useState<number>(53);
  const [tone, setTone] = useState<ChartTone>('brand');
  const [thresholds, setThresholds] = useState(true);
  const [concentric, setConcentric] = useState(false);
  const [density, setDensity] = useState<ChartDensity>('default');
  const [state, setState] = useState<State>('default');
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

  const threshold = thresholds ? { warnAt: WARN_AT, dangerAt: DANGER_AT } : {};
  /** Both round shapes take the same levels, the concentric rings, and the sizing. */
  const round = shape === 'ring' || shape === 'arc';
  /**
   * Two inner rings against the primary — the Apple-Watch arrangement, and the
   * one thing three separate meters cannot produce.
   */
  const extraRings = concentric ? [{ value: 64, max: 100 }, { value: 38, max: 100 }] : undefined;

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
            <View style={round ? { alignItems: 'center' } : undefined}>
              <Chart.Meter
                shape={shape}
                tone={tone}
                value={level}
                max={100}
                label="Storage"
                density={density}
                loading={state === 'loading'}
                rings={extraRings}
                {...threshold}
              />
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
              <VariantControlRow label="Level">
                {LEVELS.map((value) => (
                  <VariantChip
                    key={value}
                    label={`${value}%`}
                    active={level === value}
                    onPress={() => setLevel(value)}
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
              {/* Concentric rings are a round-shape arrangement; a bar has no inside. */}
              <VariantControlRow label="Rings">
                {(['single', 'concentric'] as const).map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={concentric === (value === 'concentric')}
                    disabled={!round}
                    onPress={() => setConcentric(value === 'concentric')}
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
