import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Stepper,
  useTokens,
  type StepperAppearance,
  type StepperControls,
  type StepperSize,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type PreviewState = 'default' | 'disabled' | 'error';
type ValueKind = 'count' | 'currency';

const APPEARANCES: StepperAppearance[] = ['filled', 'plain'];
const SIZES: StepperSize[] = ['sm', 'md'];
const CONTROLS: StepperControls[] = ['split', 'start', 'end', 'none'];
const STATES: PreviewState[] = ['default', 'disabled', 'error'];
const VALUE_KINDS: ValueKind[] = ['count', 'currency'];

export default function StepperCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [appearance, setAppearance] = useState<StepperAppearance>('filled');
  const [size, setSize] = useState<StepperSize>('md');
  const [controls, setControls] = useState<StepperControls>('split');
  const [allowTyping, setAllowTyping] = useState(false);
  const [state, setState] = useState<PreviewState>('default');
  const [kind, setKind] = useState<ValueKind>('count');
  const [count, setCount] = useState(2);
  const [amount, setAmount] = useState(950);
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

  // Nothing to hold when the buttons are gone.
  const stepHint = controls === 'none' ? (allowTyping ? 'Type a value' : 'Read only') : 'Hold to move faster';
  const isCurrency = kind === 'currency';

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
              paddingHorizontal: 28,
              gap: 12,
              transform: [{ translateY: previewOffset }],
            }}
          >
            {isCurrency ? (
              <Stepper
                value={amount}
                onValueChange={setAmount}
                appearance={appearance}
                size={size}
                controls={controls}
                allowTyping={allowTyping}
                min={0}
                max={100000}
                step={50}
                disabled={state === 'disabled'}
                error={state === 'error'}
                label="Amount"
                helper={state === 'error' ? 'Above your daily limit' : stepHint}
                format={(value) => `$${value.toLocaleString('en-US')}`}
                accessibilityLabel="Amount"
              />
            ) : (
              <Stepper
                value={count}
                onValueChange={setCount}
                appearance={appearance}
                size={size}
                controls={controls}
                allowTyping={allowTyping}
                min={0}
                max={99}
                disabled={state === 'disabled'}
                error={state === 'error'}
                label="Guests"
                helper={state === 'error' ? 'Max 99 per booking' : stepHint}
                accessibilityLabel="Guests"
              />
            )}

            <Text
              style={{
                color: t.colors.textSecondary,
                fontFamily: 'Manrope',
                fontSize: 13,
                marginTop: 8,
              }}
            >
              {isCurrency ? `$${amount.toLocaleString('en-US')}` : `${count} guests`}
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
                componentName="Stepper"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Input"
            next="Toggle"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/input')}
            onNext={() => router.replace('/toggle')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Appearance">
                {APPEARANCES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={appearance === value}
                    onPress={() => setAppearance(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Value">
                {VALUE_KINDS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={kind === value}
                    onPress={() => setKind(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Controls">
                {CONTROLS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={controls === option}
                    onPress={() => setControls(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Allow typing">
                {(['off', 'on'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={allowTyping === (option === 'on')}
                    onPress={() => setAllowTyping(option === 'on')}
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
