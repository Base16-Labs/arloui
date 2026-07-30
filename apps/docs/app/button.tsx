import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  useTokens,
  type ButtonAppearance,
  type ButtonHaptic,
  type ButtonSize,
  type ButtonTone,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type IconLayout = 'none' | 'leading' | 'trailing' | 'both' | 'icon-only';
type PreviewState = 'default' | 'pressed' | 'loading' | 'disabled';

const TONES: ButtonTone[] = ['primary', 'neutral', 'danger'];
const APPEARANCES: ButtonAppearance[] = ['solid', 'soft', 'ghost', 'outline'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg', 'xl'];
const ICONS: IconLayout[] = ['none', 'leading', 'trailing', 'both', 'icon-only'];
const STATES: PreviewState[] = ['default', 'pressed', 'loading', 'disabled'];
const HAPTICS: ButtonHaptic[] = ['light', 'medium', 'none'];

export default function ButtonCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tone, setTone] = useState<ButtonTone>('primary');
  const [appearance, setAppearance] = useState<ButtonAppearance>('solid');
  const [size, setSize] = useState<ButtonSize>('md');
  const [icons, setIcons] = useState<IconLayout>('both');
  const [state, setState] = useState<PreviewState>('default');
  const [haptic, setHaptic] = useState<ButtonHaptic>('light');
  const [previewOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -170 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [previewOffset, sheetOpen]);

  const iconColor = useMemo(() => {
    if (state === 'disabled') return t.colors.textDisabled;
    if (tone === 'danger') {
      return appearance === 'solid'
        ? t.colors.textInteractivePrimary
        : t.colors.textInteractiveError;
    }
    if (tone === 'neutral') {
      return appearance === 'solid' ? t.colors.textInverse : t.colors.textPrimary;
    }
    return appearance === 'solid'
      ? t.colors.textInteractivePrimary
      : appearance === 'soft'
        ? t.colors.interactivePrimary
        : t.colors.textInteractiveTertiary;
  }, [appearance, state, t, tone]);

  const iconSize =
    size === 'sm' ? t.sizing.icon.xs :
    size === 'md' ? t.sizing.icon.sm :
    size === 'lg' ? t.sizing.icon.sm :
    t.sizing.icon.md; // xl

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
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ translateY: previewOffset }],
            }}
          >
            <Button
              tone={tone}
              appearance={appearance}
              size={size}
              loading={state === 'loading'}
              disabled={state === 'disabled'}
              haptic={haptic}
              iconOnly={icons === 'icon-only'}
              accessibilityLabel={icons === 'icon-only' ? 'Proceed' : undefined}
              leadingIcon={
                icons === 'leading' || icons === 'both' || icons === 'icon-only' ? (
                  <Ionicons name="bag-outline" size={iconSize} color={iconColor} />
                ) : undefined
              }
              trailingIcon={
                icons === 'trailing' || icons === 'both' ? (
                  <Ionicons
                    name="arrow-forward"
                    size={Math.max(iconSize - 2, 12)}
                    color={iconColor}
                  />
                ) : undefined
              }
              labelStyle={{ fontFamily: 'Manrope SemiBold' }}
              style={
                state === 'pressed'
                  ? {
                      transform: [{ scale: 0.97 }],
                      opacity: 0.86,
                    }
                  : undefined
              }
            >
              Proceed
            </Button>
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
                componentName="Button"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Icons"
            next="Input"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/icons')}
            onNext={() => router.replace('/input')}
          >
            <View style={{ gap: 14 }}>
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
              <VariantControlRow label="Icons">
                {ICONS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={icons === value}
                    onPress={() => setIcons(value)}
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
              <VariantControlRow label="Haptic">
                {HAPTICS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={haptic === value}
                    onPress={() => setHaptic(value)}
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
