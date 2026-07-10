import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DatePicker,
  useTokens,
  type DatePickerWeekStartsOn,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type PreviewState = 'default' | 'disabled' | 'weekends disabled';

const WEEK_STARTS: { label: string; value: DatePickerWeekStartsOn }[] = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
];
const STATES: PreviewState[] = ['default', 'disabled', 'weekends disabled'];

export default function DatePickerCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 5, 15));
  const [weekStartsOn, setWeekStartsOn] = useState<DatePickerWeekStartsOn>(0);
  const [showOutsideDays, setShowOutsideDays] = useState(true);
  const [state, setState] = useState<PreviewState>('default');
  const previewOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -145 : 0,
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
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              transform: [{ translateY: previewOffset }],
            }}
          >
            <DatePicker
              value={selected}
              onValueChange={setSelected}
              defaultDisplayedMonth={new Date(2026, 5, 1)}
              weekStartsOn={weekStartsOn}
              showOutsideDays={showOutsideDays}
              disabled={state === 'disabled'}
              isDateDisabled={
                state === 'weekends disabled'
                  ? (date) => date.getDay() === 0 || date.getDay() === 6
                  : undefined
              }
            />
            <Text
              style={{
                marginTop: 12,
                color: t.colors.textSecondary,
                fontFamily: 'Manrope',
                fontSize: 13,
              }}
            >
              {selected
                ? selected.toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Choose a date'}
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
                componentName="Date Picker"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="TextArea"
            next="Sheet"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/textarea')}
            onNext={() => router.replace('/sheet')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Week starts">
                {WEEK_STARTS.map((option) => (
                  <VariantChip
                    key={option.label}
                    label={option.label}
                    active={weekStartsOn === option.value}
                    onPress={() => setWeekStartsOn(option.value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Outside days">
                {['show', 'hide'].map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={showOutsideDays === (option === 'show')}
                    onPress={() => setShowOutsideDays(option === 'show')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="State">
                {STATES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={state === option}
                    onPress={() => setState(option)}
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
