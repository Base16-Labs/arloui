import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chart,
  useTokens,
  type ChartCurve,
  type ChartDensity,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type Height = 'inline' | 'standalone';
type State = 'default' | 'loading' | 'empty';

const HEIGHTS: Height[] = ['inline', 'standalone'];
/**
 * Its own row, not folded into height. `density` is what actually thins the stroke
 * and shrinks the end dot; height only changes the box. The two were conflated
 * under a single "Size" chip, so `default` density never rendered on a sparkline
 * at all — the form defaults to `compact`.
 */
const DENSITIES: ChartDensity[] = ['compact', 'default'];
const CURVES: ChartCurve[] = ['steep', 'smooth'];
const STATES: State[] = ['default', 'loading', 'empty'];

/** Deterministic series so the canvas looks the same on every render. */
function series(direction: 'up' | 'down'): number[] {
  const points: number[] = [];
  for (let i = 0; i < 32; i += 1) {
    const t = i / 31;
    const noise = Math.sin(i * 0.9) * 4 + Math.sin(i * 0.31) * 7;
    const base = direction === 'up' ? 900 + t * 420 : 1320 - t * 430;
    points.push(Number((base + noise).toFixed(2)));
  }
  return points;
}

export default function SparklineCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [size, setSize] = useState<Height>('standalone');
  const [density, setDensity] = useState<ChartDensity>('compact');
  const [curve, setCurve] = useState<ChartCurve>('steep');
  const [state, setState] = useState<State>('default');
  const [fill, setFill] = useState(true);
  const [showEndDot, setShowEndDot] = useState(true);
  const [previewOffset] = useState(() => new Animated.Value(0));

  const rising = useMemo(() => series('up'), []);
  const falling = useMemo(() => series('down'), []);
  const height = size === 'inline' ? 28 : 56;

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
            <View style={{ gap: 26 }}>
              {(
                [
                  ['Rising', rising, 'auto'],
                  ['Falling', falling, 'auto'],
                  ['Brand', rising, 'brand'],
                  ['Neutral', rising, 'neutral'],
                ] as const
              ).map(([label, data, tone]) => (
                <View key={label} style={{ gap: 7 }}>
                  <Text
                    style={{
                      color: t.colors.textTertiary,
                      fontFamily: 'Manrope SemiBold',
                      fontSize: 10,
                      letterSpacing: 1.1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </Text>
                  <Chart.Sparkline
                    data={state === 'empty' ? [] : data}
                    tone={tone}
                    density={density}
                    curve={curve}
                    height={height}
                    fill={fill}
                    showEndDot={showEndDot}
                    loading={state === 'loading'}
                    accessibilityLabel={`${label} trend`}
                  />
                </View>
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
            next="Gallery"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/chart/meter')}
            onNext={() => router.replace('/gallery')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Height">
                {HEIGHTS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={size === value}
                    onPress={() => setSize(value)}
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
            </View>
          </VariantSheet>
        </View>
      </SafeAreaView>
    </>
  );
}
