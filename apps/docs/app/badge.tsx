import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Badge, useTokens, type BadgeAppearance, type BadgeSize, type BadgeTone } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

const TONES: BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'error'];
const APPEARANCES: BadgeAppearance[] = ['soft', 'solid', 'outline'];
const SIZES: BadgeSize[] = ['sm', 'md'];

type BadgeMode = 'label' | 'dot' | 'icon';
const MODES: BadgeMode[] = ['label', 'dot', 'icon'];

function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5L9.8 5.7L14.2 6.1L10.9 9.1L11.8 13.5L8 11.3L4.2 13.5L5.1 9.1L1.8 6.1L6.2 5.7L8 1.5Z"
        fill={color}
      />
    </Svg>
  );
}

function useIconColor(
  t: ReturnType<typeof useTokens>,
  tone: BadgeTone,
  appearance: BadgeAppearance,
) {
  const toneColors: Record<BadgeTone, { soft: string; solid: string; outline: string }> = {
    neutral: { soft: t.colors.textSecondary, solid: t.colors.textInteractivePrimary, outline: t.colors.textSecondary },
    info: { soft: t.colors.feedbackInfo, solid: t.colors.textInteractivePrimary, outline: t.colors.feedbackInfo },
    success: { soft: t.colors.feedbackSuccess, solid: t.colors.textInteractivePrimary, outline: t.colors.feedbackSuccess },
    warning: { soft: t.colors.feedbackWarning, solid: t.colors.textInteractivePrimary, outline: t.colors.feedbackWarning },
    error: { soft: t.colors.feedbackError, solid: t.colors.textInteractivePrimary, outline: t.colors.feedbackError },
  };
  return toneColors[tone][appearance];
}

export default function BadgeCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tone, setTone] = useState<BadgeTone>('neutral');
  const [appearance, setAppearance] = useState<BadgeAppearance>('soft');
  const [size, setSize] = useState<BadgeSize>('md');
  const [mode, setMode] = useState<BadgeMode>('label');
  const iconColor = useIconColor(t, tone, appearance);
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
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Badge
                tone={tone}
                appearance={appearance}
                size={size}
                dot={mode === 'dot'}
                leadingIcon={
                  mode === 'icon' ? (
                    <StarIcon size={size === 'sm' ? 12 : 14} color={iconColor} />
                  ) : undefined
                }
              >
                Badge 1
              </Badge>
              <Badge
                tone={tone}
                appearance={appearance}
                size={size}
                dot={mode === 'dot'}
                leadingIcon={
                  mode === 'icon' ? (
                    <StarIcon size={size === 'sm' ? 12 : 14} color={iconColor} />
                  ) : undefined
                }
              >
                Badge 2
              </Badge>
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
                componentName="Badge"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Toggle"
            next="Chip"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/toggle')}
            onNext={() => router.replace('/chip')}
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
              <VariantControlRow label="Mode">
                {MODES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={mode === value}
                    onPress={() => setMode(value)}
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
