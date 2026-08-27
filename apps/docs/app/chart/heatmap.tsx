import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chart, useTokens, type HeatmapDatum } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

/** The design's Heatmap family: the calendar streak grid. */
type State = 'default' | 'loading' | 'empty';

const DAY_MS = 86_400_000;
const WEEKS = 8;
/** The headline streak the grid should land on. */
const STREAK = 34;
const LEVELS = [2, 3, 4];
const STATES: State[] = ['default', 'loading', 'empty'];


/**
 * Deterministic activity: an active run of `STREAK` days ending today, sparse
 * days before it, and a couple of misses so the grid reads as real history.
 */
function sampleDays(): HeatmapDatum[] {
  const out: HeatmapDatum[] = [];
  const end = new Date();
  end.setHours(12, 0, 0, 0);
  const total = WEEKS * 7;
  for (let index = total - 1; index >= 0; index -= 1) {
    const day = new Date(end.getTime() - index * DAY_MS);
    const noise = (index * 37) % 11;
    const active = index >= total - STREAK ? noise > 0 : noise > 7;
    out.push({ date: day.toISOString(), value: active ? (noise % 4) + 1 : 0 });
  }
  return out;
}

export default function HeatmapCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [levels, setLevels] = useState(3);
  const [state, setState] = useState<State>('default');
  const [picked, setPicked] = useState<string | null>(null);
  const [previewOffset] = useState(() => new Animated.Value(0));

  const data = useMemo(
    () => (state === 'empty' ? [] : sampleDays()),
    [state],
  );

  const streak = useMemo(() => {
    let count = 0;
    for (let index = data.length - 1; index >= 0; index -= 1) {
      if ((data[index]?.value ?? 0) > 0) count += 1;
      else break;
    }
    return count;
  }, [data]);

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
              gap: 14,
              transform: [{ translateY: previewOffset }],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text
                style={{
                  color: t.colors.textPrimary,
                  fontFamily: 'Manrope',
                  fontSize: 30,
                  letterSpacing: -0.01,
                  fontWeight: '800',
                }}
              >
                {streak}
              </Text>
              <Text
                style={{
                  color: t.colors.textPrimary,
                  fontFamily: 'Manrope',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                day streak
              </Text>
              <Text style={{ color: t.colors.textTertiary, fontFamily: 'Manrope', fontSize: 12 }}>
                · longest {STREAK + 27} · this month
              </Text>
            </View>

            <Chart.Heatmap
              data={data}
              levels={levels}
              loading={state === 'loading'}
              onSelect={(datum, date) =>
                setPicked(
                  datum
                    ? `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → value ${datum.value}`
                    : null,
                )
              }
            />

            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: 'Manrope',
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              {picked ?? 'Tap an active day to select it'}
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
                componentName="Heatmap"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Sparkline"
            next="Gallery"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/chart/sparkline')}
            onNext={() => router.replace('/gallery')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Levels">
                {LEVELS.map((value) => (
                  <VariantChip
                    key={value}
                    label={String(value)}
                    active={levels === value}
                    onPress={() => setLevels(value)}
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
