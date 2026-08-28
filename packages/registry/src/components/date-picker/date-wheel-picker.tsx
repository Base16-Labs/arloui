import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type DateWheelPickerMode = 'date' | 'time' | 'date-time' | 'month-year';
export type DateWheelPickerHourCycle = 12 | 24;
export type DateWheelPickerMinuteInterval = 1 | 5 | 10 | 15 | 30;

export type DateWheelPickerProps = Omit<ViewProps, 'style'> & {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  mode?: DateWheelPickerMode;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  hourCycle?: DateWheelPickerHourCycle;
  minuteInterval?: DateWheelPickerMinuteInterval;
  dateRangeDays?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type WheelValue = string | number;
type WheelItem = {
  value: WheelValue;
  label: string;
  accessibilityLabel?: string;
};

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const WHEEL_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function clampDate(date: Date, minDate?: Date, maxDate?: Date) {
  const time = Math.min(
    maxDate?.getTime() ?? Number.POSITIVE_INFINITY,
    Math.max(minDate?.getTime() ?? Number.NEGATIVE_INFINITY, date.getTime()),
  );
  return new Date(time);
}

function withDateParts(date: Date, parts: { year?: number; month?: number; day?: number }) {
  const year = parts.year ?? date.getFullYear();
  const month = parts.month ?? date.getMonth();
  const day = Math.min(parts.day ?? date.getDate(), daysInMonth(year, month));
  return new Date(year, month, day, date.getHours(), date.getMinutes(), date.getSeconds());
}

function formatDateItem(date: Date, locale?: string) {
  const today = startOfDay(new Date());
  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, addDays(today, -1))) return 'Yesterday';
  if (sameDay(date, addDays(today, 1))) return 'Tomorrow';

  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toDateString().slice(0, 10);
  }
}

function formatFullDate(date: Date, locale?: string) {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date);
  } catch {
    return date.toDateString();
  }
}

function monthItems(locale?: string): WheelItem[] {
  return Array.from({ length: 12 }, (_, month) => {
    let label: string;
    try {
      label = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, month, 1));
    } catch {
      label = new Date(2024, month, 1).toLocaleString('en', { month: 'long' });
    }
    return { value: month, label };
  });
}

export function DateWheelPicker({
  value,
  defaultValue,
  onValueChange,
  mode = 'date-time',
  minDate,
  maxDate,
  locale,
  hourCycle = 12,
  minuteInterval = 5,
  dateRangeDays = 365,
  disabled = false,
  style,
  ...rest
}: DateWheelPickerProps) {
  const t = useTokens();
  const [fallbackValue] = useState(() => defaultValue ?? new Date());
  const [initialYear] = useState(() =>
    clampDate(value ?? fallbackValue, minDate, maxDate).getFullYear(),
  );
  const [anchorTime] = useState(() =>
    startOfDay(clampDate(value ?? fallbackValue, minDate, maxDate)).getTime(),
  );
  const [internalValue, setInternalValue] = useState(() =>
    clampDate(fallbackValue, minDate, maxDate),
  );
  const selected = clampDate(value ?? internalValue, minDate, maxDate);
  const selectedYear = selected.getFullYear();
  const selectedMonth = selected.getMonth();
  const minTime = minDate?.getTime();
  const maxTime = maxDate?.getTime();

  function changeValue(next: Date) {
    if (disabled) return;
    const clamped = clampDate(next, minDate, maxDate);
    if (value === undefined) setInternalValue(clamped);
    onValueChange?.(clamped);
  }

  const months = useMemo(() => monthItems(locale), [locale]);
  // Keep the range stable while the wheel settles. Re-centering it around every
  // selected year changes the value represented by each visible row mid-scroll.
  const yearFloor = minDate?.getFullYear() ?? initialYear - 100;
  const yearCeiling = maxDate?.getFullYear() ?? initialYear + 100;
  const years = useMemo(
    () =>
      Array.from({ length: Math.max(1, yearCeiling - yearFloor + 1) }, (_, index) => ({
        value: yearFloor + index,
        label: String(yearFloor + index),
      })),
    [yearCeiling, yearFloor],
  );
  const days = useMemo(
    () =>
      Array.from({ length: daysInMonth(selectedYear, selectedMonth) }, (_, index) => ({
        value: index + 1,
        label: String(index + 1).padStart(2, '0'),
      })),
    [selectedMonth, selectedYear],
  );

  // Anchor the rolling range on a stable initial date (like the year range).
  // Re-centering it on `selectedTime` shifts the value under each visible row
  // mid-scroll, so a picked date lands on a different one after the list rebuilds.
  const rollingDates = useMemo(() => {
    const range = Math.max(1, Math.floor(dateRangeDays));
    const anchorDate = new Date(anchorTime);
    const first = startOfDay(minTime == null ? addDays(anchorDate, -range) : new Date(minTime));
    const last = startOfDay(maxTime == null ? addDays(anchorDate, range) : new Date(maxTime));
    const length = Math.max(1, Math.floor((last.getTime() - first.getTime()) / 86_400_000) + 1);
    return Array.from({ length }, (_, index) => {
      const date = addDays(first, index);
      return {
        value: date.getTime(),
        label: formatDateItem(date, locale),
        accessibilityLabel: formatFullDate(date, locale),
      };
    });
  }, [anchorTime, dateRangeDays, locale, maxTime, minTime]);

  const hourItems = useMemo(
    () =>
      Array.from({ length: hourCycle === 12 ? 12 : 24 }, (_, index) => {
        const hour = hourCycle === 12 ? index + 1 : index;
        return { value: hour, label: String(hour).padStart(2, '0') };
      }),
    [hourCycle],
  );
  const minuteItems = useMemo(
    () =>
      Array.from({ length: Math.ceil(60 / minuteInterval) }, (_, index) => {
        const minute = index * minuteInterval;
        return { value: minute, label: String(minute).padStart(2, '0') };
      }),
    [minuteInterval],
  );
  const periodItems: WheelItem[] = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  const selectedHour =
    hourCycle === 12 ? ((selected.getHours() + 11) % 12) + 1 : selected.getHours();
  const selectedMinute = Math.floor(selected.getMinutes() / minuteInterval) * minuteInterval;
  const selectedPeriod = selected.getHours() >= 12 ? 'PM' : 'AM';

  function setHour(hour: number) {
    let nextHour = hour;
    if (hourCycle === 12) {
      nextHour = hour % 12;
      if (selectedPeriod === 'PM') nextHour += 12;
    }
    const next = new Date(selected);
    next.setHours(nextHour);
    changeValue(next);
  }

  function setPeriod(period: WheelValue) {
    const next = new Date(selected);
    const hour = selected.getHours();
    next.setHours(period === 'PM' ? (hour % 12) + 12 : hour % 12);
    changeValue(next);
  }

  function setMinute(minute: number) {
    const next = new Date(selected);
    next.setMinutes(minute);
    changeValue(next);
  }

  const showDateColumns = mode === 'date' || mode === 'month-year';
  const showRollingDate = mode === 'date-time';
  const showTime = mode === 'time' || mode === 'date-time';

  return (
    <View
      accessibilityLabel="Date wheel picker"
      style={[
        {
          width: '100%',
          maxWidth: 350,
          height: WHEEL_HEIGHT,
          borderRadius: t.radii.xl,
          borderWidth: 1,
          borderColor: t.colors.borderSecondary,
          backgroundColor: t.colors.surfaceElevated,
          overflow: 'hidden',
          opacity: disabled ? 0.48 : 1,
        },
        style,
      ]}
      {...rest}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: WHEEL_PADDING,
          left: t.spacing[2],
          right: t.spacing[2],
          height: ITEM_HEIGHT,
          borderRadius: t.radii.lg,
          backgroundColor: t.colors.surfaceInput,
        }}
      />

      <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: t.spacing[2] }}>
        {showRollingDate ? (
          <WheelColumn
            accessibilityLabel="Date"
            items={rollingDates}
            selectedValue={startOfDay(selected).getTime()}
            onValueChange={(next) => {
              const date = new Date(Number(next));
              date.setHours(selected.getHours(), selected.getMinutes(), selected.getSeconds());
              changeValue(date);
            }}
            disabled={disabled}
            flex={2.25}
          />
        ) : null}

        {showDateColumns ? (
          <>
            <WheelColumn
              accessibilityLabel="Month"
              items={months}
              selectedValue={selected.getMonth()}
              onValueChange={(month) =>
                changeValue(withDateParts(selected, { month: Number(month) }))
              }
              disabled={disabled}
              flex={1.7}
            />
            {mode === 'date' ? (
              <WheelColumn
                accessibilityLabel="Day"
                items={days}
                selectedValue={selected.getDate()}
                onValueChange={(day) => changeValue(withDateParts(selected, { day: Number(day) }))}
                disabled={disabled}
              />
            ) : null}
            <WheelColumn
              accessibilityLabel="Year"
              items={years}
              selectedValue={selected.getFullYear()}
              onValueChange={(year) => changeValue(withDateParts(selected, { year: Number(year) }))}
              disabled={disabled}
              flex={1.25}
            />
          </>
        ) : null}

        {showTime ? (
          <>
            <WheelColumn
              accessibilityLabel="Hour"
              items={hourItems}
              selectedValue={selectedHour}
              onValueChange={(hour) => setHour(Number(hour))}
              disabled={disabled}
            />
            <WheelColumn
              accessibilityLabel="Minute"
              items={minuteItems}
              selectedValue={selectedMinute}
              onValueChange={(minute) => setMinute(Number(minute))}
              disabled={disabled}
            />
            {hourCycle === 12 ? (
              <WheelColumn
                accessibilityLabel="Period"
                items={periodItems}
                selectedValue={selectedPeriod}
                onValueChange={setPeriod}
                disabled={disabled}
              />
            ) : null}
          </>
        ) : null}
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          backgroundColor: t.colors.surfaceElevated,
          opacity: 0.72,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          backgroundColor: t.colors.surfaceElevated,
          opacity: 0.72,
        }}
      />
    </View>
  );
}

function WheelColumn({
  accessibilityLabel,
  items,
  selectedValue,
  onValueChange,
  disabled,
  flex = 1,
}: {
  accessibilityLabel: string;
  items: WheelItem[];
  selectedValue: WheelValue;
  onValueChange: (value: WheelValue) => void;
  disabled: boolean;
  flex?: number;
}) {
  const t = useTokens();
  const listRef = useRef<FlatList<WheelItem>>(null);
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === selectedValue),
  );

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: selectedIndex * ITEM_HEIGHT, animated: false });
  }, [items.length, selectedIndex]);

  function selectIndex(index: number) {
    const nextIndex = Math.max(0, Math.min(items.length - 1, index));
    const item = items[nextIndex];
    if (item && item.value !== selectedValue) onValueChange(item.value);
  }

  function settle(event: NativeSyntheticEvent<NativeScrollEvent>) {
    selectIndex(Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT));
  }

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        text: items[selectedIndex]?.accessibilityLabel ?? items[selectedIndex]?.label,
      }}
      accessibilityActions={[
        { name: 'increment', label: `Next ${accessibilityLabel.toLowerCase()}` },
        { name: 'decrement', label: `Previous ${accessibilityLabel.toLowerCase()}` },
      ]}
      onAccessibilityAction={(event) => {
        const amount = event.nativeEvent.actionName === 'increment' ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(items.length - 1, selectedIndex + amount));
        listRef.current?.scrollToOffset({ offset: nextIndex * ITEM_HEIGHT, animated: true });
        selectIndex(nextIndex);
      }}
      style={{ flex }}
    >
      <FlatList
        ref={listRef}
        testID={`${accessibilityLabel.toLowerCase()}-wheel`}
        data={items}
        keyExtractor={(item) => String(item.value)}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={selectedIndex}
        contentContainerStyle={{ paddingVertical: WHEEL_PADDING }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!disabled}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={settle}
        onScrollEndDrag={(event) => {
          if (Math.abs(event.nativeEvent.velocity?.y ?? 0) < 0.1) settle(event);
        }}
        renderItem={({ item, index }) => {
          const distance = Math.abs(index - selectedIndex);
          return (
            <Pressable
              disabled={disabled}
              onPress={() => {
                listRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
                selectIndex(index);
              }}
              style={{
                height: ITEM_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: t.spacing[1],
              }}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                style={{
                  color: distance === 0 ? t.colors.textPrimary : t.colors.textTertiary,
                  fontFamily: t.fontFamilies.sans,
                  ...(distance === 0
                    ? t.typography.headingMediumEmphasized
                    : t.typography.bodyMedium),
                  fontWeight: distance === 0 ? t.fontWeights.semibold : t.fontWeights.medium,
                  opacity: distance === 0 ? 1 : distance === 1 ? 0.62 : 0.3,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
