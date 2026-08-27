import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DatePicker,
  DateWheelPicker,
  useTokens,
  type DateWheelPickerHourCycle,
  type DateWheelPickerMinuteInterval,
  type DateWheelPickerMode,
  type DatePickerWeekStartsOn,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type PreviewState = 'default' | 'disabled' | 'weekends disabled';
type Presentation = 'calendar' | 'wheel';

const WEEK_STARTS: { label: string; value: DatePickerWeekStartsOn }[] = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
];
const STATES: PreviewState[] = ['default', 'disabled', 'weekends disabled'];
const WHEEL_MODES: { label: string; value: DateWheelPickerMode }[] = [
  { label: 'Date + time', value: 'date-time' },
  { label: 'Date', value: 'date' },
  { label: 'Time', value: 'time' },
  { label: 'Month + year', value: 'month-year' },
];

export default function DatePickerCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 5, 15, 13, 10));
  const [presentation, setPresentation] = useState<Presentation>('calendar');
  const [wheelMode, setWheelMode] = useState<DateWheelPickerMode>('date-time');
  const [hourCycle, setHourCycle] = useState<DateWheelPickerHourCycle>(12);
  const [minuteInterval, setMinuteInterval] = useState<DateWheelPickerMinuteInterval>(5);
  const [weekStartsOn, setWeekStartsOn] = useState<DatePickerWeekStartsOn>(0);
  const [showOutsideDays, setShowOutsideDays] = useState(true);
  const [monthYearDropdown, setMonthYearDropdown] = useState(false);
  const [state, setState] = useState<PreviewState>('default');
  const [previewOffset] = useState(() => new Animated.Value(0));

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
              paddingHorizontal: t.spacing[5],
              transform: [{ translateY: previewOffset }],
            }}
          >
            {presentation === 'calendar' ? (
              <DatePicker
                value={selected}
                onValueChange={setSelected}
                defaultDisplayedMonth={new Date(2026, 5, 1)}
                weekStartsOn={weekStartsOn}
                showOutsideDays={showOutsideDays}
                monthYearDropdown={monthYearDropdown}
                disabled={state === 'disabled'}
                isDateDisabled={
                  state === 'weekends disabled'
                    ? (date) => date.getDay() === 0 || date.getDay() === 6
                    : undefined
                }
              />
            ) : (
              <DateWheelPicker
                value={selected ?? undefined}
                onValueChange={setSelected}
                mode={wheelMode}
                hourCycle={hourCycle}
                minuteInterval={minuteInterval}
                disabled={state === 'disabled'}
              />
            )}
            <Text
              style={{
                marginTop: t.spacing[3],
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                ...t.typography.bodySmall,
              }}
            >
              {selected
                ? selected.toLocaleString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    ...(presentation === 'wheel' &&
                    (wheelMode === 'time' || wheelMode === 'date-time')
                      ? { hour: 'numeric', minute: '2-digit' }
                      : {}),
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
            next="Tab Bar"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/textarea')}
            onNext={() => router.replace('/tab-bar')}
          >
            <View style={{ gap: t.spacing[4] }}>
              <VariantControlRow label="Presentation">
                {(['calendar', 'wheel'] as const).map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={presentation === option}
                    onPress={() => {
                      setPresentation(option);
                      if (option === 'wheel' && state === 'weekends disabled') setState('default');
                    }}
                  />
                ))}
              </VariantControlRow>
              {presentation === 'calendar' ? (
                <>
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
                  <VariantControlRow label="Header">
                    {['arrows', 'dropdown'].map((option) => (
                      <VariantChip
                        key={option}
                        label={option}
                        active={monthYearDropdown === (option === 'dropdown')}
                        onPress={() => setMonthYearDropdown(option === 'dropdown')}
                      />
                    ))}
                  </VariantControlRow>
                </>
              ) : (
                <>
                  <VariantControlRow label="Mode">
                    {WHEEL_MODES.map((option) => (
                      <VariantChip
                        key={option.value}
                        label={option.label}
                        active={wheelMode === option.value}
                        onPress={() => setWheelMode(option.value)}
                      />
                    ))}
                  </VariantControlRow>
                  {wheelMode === 'time' || wheelMode === 'date-time' ? (
                    <>
                      <VariantControlRow label="Hour cycle">
                        {([12, 24] as const).map((option) => (
                          <VariantChip
                            key={option}
                            label={`${option}-hour`}
                            active={hourCycle === option}
                            onPress={() => setHourCycle(option)}
                          />
                        ))}
                      </VariantControlRow>
                      <VariantControlRow label="Minutes">
                        {([1, 5, 15, 30] as const).map((option) => (
                          <VariantChip
                            key={option}
                            label={`${option} min`}
                            active={minuteInterval === option}
                            onPress={() => setMinuteInterval(option)}
                          />
                        ))}
                      </VariantControlRow>
                    </>
                  ) : null}
                </>
              )}
              <VariantControlRow label="State">
                {STATES.filter(
                  (option) => presentation === 'calendar' || option !== 'weekends disabled',
                ).map((option) => (
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
