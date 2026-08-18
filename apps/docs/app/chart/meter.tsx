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

const SHAPES: MeterShape[] = ['bar', 'ring'];
const TONES: ChartTone[] = ['brand', 'positive', 'negative', 'neutral'];
const DENSITIES: ChartDensity[] = ['default', 'compact'];
const STATES: State[] = ['default', 'loading'];

const WARN_AT = 0.75;
const DANGER_AT = 0.85;

/**
 * One level per threshold band, so switching thresholds on shows all three
 * colours at once. These have to straddle WARN_AT and DANGER_AT: an earlier set
 * ran 42/72/88, which skipped the warning band entirely — 0.72 is below 0.75, so
 * the meter went straight from brand to danger and the middle colour was
 * unreachable from the playground.
 */
const LEVELS = [
  { value: 42, label: 'Goal' },
  { value: 79, label: 'Storage' },
  { value: 92, label: 'Budget used' },
] as const;
/** The warning level — the band that is easiest to get wrong, so it is the one on show. */
const RING_LEVEL = LEVELS[1];

export default function MeterCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shape, setShape] = useState<MeterShape>('bar');
  const [tone, setTone] = useState<ChartTone>('brand');
  const [thresholds, setThresholds] = useState(true);
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
            <View style={shape === 'ring' ? { alignItems: 'center' } : { gap: 20 }}>
              {(shape === 'ring' ? [RING_LEVEL] : LEVELS).map(({ value, label }) => (
                <Chart.Meter
                  key={`${shape}-${label}`}
                  shape={shape}
                  tone={tone}
                  value={value}
                  max={100}
                  label={label}
                  density={density}
                  loading={state === 'loading'}
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
