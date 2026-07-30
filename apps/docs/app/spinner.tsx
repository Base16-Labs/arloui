import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Spinner,
  useTokens,
  type SpinnerAppearance,
  type SpinnerSize,
  type SpinnerTone,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

const APPEARANCES: SpinnerAppearance[] = ['spokes', 'arc', 'dots', 'bars', 'pulse'];
const SIZES: SpinnerSize[] = ['sm', 'md', 'lg'];
const TONES: SpinnerTone[] = ['neutral', 'accent'];

export default function SpinnerCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appearance, setAppearance] = useState<SpinnerAppearance>('spokes');
  const [size, setSize] = useState<SpinnerSize>('lg');
  const [tone, setTone] = useState<SpinnerTone>('neutral');
  const [previewOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: menuOpen ? -112 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [menuOpen, previewOffset]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 22,
              right: 20,
              left: 20,
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
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 64,
              paddingHorizontal: 20,
              paddingBottom: 88,
              transform: [{ translateY: previewOffset }],
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 350,
                height: 470,
                overflow: 'hidden',
                borderRadius: 34,
                borderWidth: 1,
                borderColor: t.colors.border,
                backgroundColor: t.colors.surface,
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner appearance={appearance} size={size} tone={tone} />
            </View>
          </Animated.View>

          {!menuOpen ? (
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="Spinner"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setMenuOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={menuOpen}
            previous="Skeleton"
            next="Tab Bar"
            onClose={() => setMenuOpen(false)}
            onPrevious={() => router.replace('/skeleton')}
            onNext={() => router.replace('/tab-bar')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Appearance">
                {APPEARANCES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={appearance === option}
                    onPress={() => setAppearance(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Size">
                {SIZES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={size === option}
                    onPress={() => setSize(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Tone">
                {TONES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={tone === option}
                    onPress={() => setTone(option)}
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

