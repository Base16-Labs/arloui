import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radio, useTokens, type RadioAppearance, type RadioSize } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type PreviewState = 'default' | 'disabled';

const APPEARANCES: RadioAppearance[] = ['outlined', 'filled'];
const SIZES: RadioSize[] = ['sm', 'md', 'lg'];
const STATES: PreviewState[] = ['default', 'disabled'];
const OPTIONS = ['Option A', 'Option B', 'Option C'];

export default function RadioCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [appearance, setAppearance] = useState<RadioAppearance>('outlined');
  const [size, setSize] = useState<RadioSize>('md');
  const [state, setState] = useState<PreviewState>('default');
  const [selected, setSelected] = useState(0);
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] }}>
              <LiveBadge />
            </View>
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: t.spacing[5],
              transform: [{ translateY: previewOffset }],
            }}
          >
            {OPTIONS.map((label, i) => (
              <View
                key={label}
                style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] }}
              >
                <Radio
                  selected={selected === i}
                  onSelect={() => setSelected(i)}
                  appearance={appearance}
                  size={size}
                  disabled={state === 'disabled'}
                  accessibilityLabel={label}
                />
                <Text
                  style={{
                    color: t.colors.textPrimary,
                    fontFamily: t.fontFamilies.sans,
                    ...t.typography.bodyMedium,
                  }}
                >
                  {label}
                </Text>
              </View>
            ))}
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
                componentName="Radio"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Checkbox"
            next="Toggle"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/checkbox')}
            onNext={() => router.replace('/toggle')}
          >
            <View style={{ gap: t.spacing[4] }}>
              <VariantControlRow label="Style">
                {APPEARANCES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={appearance === value}
                    onPress={() => setAppearance(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Size">
                {SIZES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={size === value}
                    onPress={() => setSize(value)}
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
