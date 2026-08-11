import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import { DateWheelPicker } from './date-wheel-picker';

export type DatePickerWeekStartsOn = 0 | 1;

export type DatePickerProps = Omit<ViewProps, 'style'> & {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  displayedMonth?: Date;
  defaultDisplayedMonth?: Date;
  onDisplayedMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: DatePickerWeekStartsOn;
  showOutsideDays?: boolean;
  locale?: string;
  disabled?: boolean;
  /**
   * iOS-style header: renders the month/year as a tappable dropdown that
   * expands an inline month-year wheel in place of the day grid.
   */
  monthYearDropdown?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SUNDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function sameDay(a: Date | null | undefined, b: Date | null | undefined) {
  return Boolean(
    a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate(),
  );
}

function monthLabel(date: Date, locale?: string) {
  try {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  } catch {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
  }
}

function accessibilityDateLabel(date: Date, locale?: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
}

function calendarDays(month: Date, weekStartsOn: DatePickerWeekStartsOn) {
  const first = startOfMonth(month);
  const leading = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -leading);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

export function DatePicker({
  value,
  defaultValue = null,
  onValueChange,
  displayedMonth,
  defaultDisplayedMonth,
  onDisplayedMonthChange,
  minDate,
  maxDate,
  isDateDisabled,
  weekStartsOn = 0,
  showOutsideDays = true,
  locale,
  disabled = false,
  monthYearDropdown = false,
  style,
  ...rest
}: DatePickerProps) {
  const t = useTokens();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [chevron] = useState(() => new Animated.Value(0));
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const selected = value === undefined ? internalValue : value;
  const initialMonth = defaultDisplayedMonth ?? selected ?? today;
  const [internalMonth, setInternalMonth] = useState(() => startOfMonth(initialMonth));
  const month = startOfMonth(displayedMonth ?? internalMonth);
  const days = useMemo(
    () => calendarDays(month, weekStartsOn),
    [month.getFullYear(), month.getMonth(), weekStartsOn],
  );
  const weekdayLabels = weekStartsOn === 1 ? MONDAY_LABELS : SUNDAY_LABELS;
  const minimum = minDate ? startOfDay(minDate) : null;
  const maximum = maxDate ? startOfDay(maxDate) : null;
  const wheelOpen = monthYearDropdown && pickerOpen;

  useEffect(() => {
    Animated.timing(chevron, {
      toValue: pickerOpen ? 1 : 0,
      duration: t.motion.duration.instant,
      useNativeDriver: true,
    }).start();
  }, [chevron, pickerOpen, t.motion.duration.instant]);

  function changeMonth(amount: number) {
    if (disabled) return;
    const next = addMonths(month, amount);
    if (displayedMonth === undefined) setInternalMonth(next);
    onDisplayedMonthChange?.(next);
  }

  function selectDate(date: Date) {
    if (disabled) return;
    if (value === undefined) setInternalValue(date);
    if (displayedMonth === undefined && date.getMonth() !== month.getMonth()) {
      setInternalMonth(startOfMonth(date));
    }
    onValueChange?.(date);
  }

  function setMonthFromWheel(next: Date) {
    if (disabled) return;
    const nextMonth = startOfMonth(next);
    if (displayedMonth === undefined) setInternalMonth(nextMonth);
    onDisplayedMonthChange?.(nextMonth);
  }

  return (
    <View
      accessibilityLabel="Date picker"
      style={[
        {
          width: '100%',
          maxWidth: 350,
          padding: t.spacing[3],
          borderRadius: t.radii.xl,
          borderWidth: 1,
          borderColor: t.colors.borderSecondary,
          backgroundColor: t.colors.surfaceElevated,
          opacity: disabled ? 0.48 : 1,
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={{
          minHeight: t.sizing.touchTarget.minimum,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: t.spacing[2],
        }}
      >
        {monthYearDropdown ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${monthLabel(month, locale)}, choose month and year`}
            accessibilityState={{ expanded: pickerOpen, disabled }}
            disabled={disabled}
            hitSlop={6}
            onPress={() => setPickerOpen((open) => !open)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[1] }}
          >
            <Text
              style={{
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                ...t.typography.headingMediumEmphasized,
              }}
            >
              {monthLabel(month, locale)}
            </Text>
            <Animated.View
              style={{
                marginTop: -2,
                transform: [
                  { rotate: chevron.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
                ],
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: t.colors.textPrimary,
                  transform: [{ rotate: '45deg' }],
                }}
              />
            </Animated.View>
          </Pressable>
        ) : (
          <Text
            accessibilityRole="header"
            style={{
              color: t.colors.textPrimary,
              fontFamily: t.fontFamilies.sans,
              ...t.typography.headingMediumEmphasized,
            }}
          >
            {monthLabel(month, locale)}
          </Text>
        )}
        {!wheelOpen ? (
          <View style={{ flexDirection: 'row', gap: t.spacing[1] }}>
            <MonthButton
              label="Previous month"
              glyph="‹"
              disabled={disabled || Boolean(minimum && addMonths(month, -1) < startOfMonth(minimum))}
              onPress={() => changeMonth(-1)}
            />
            <MonthButton
              label="Next month"
              glyph="›"
              disabled={disabled || Boolean(maximum && addMonths(month, 1) > startOfMonth(maximum))}
              onPress={() => changeMonth(1)}
            />
          </View>
        ) : null}
      </View>

      {wheelOpen ? (
        <DateWheelPicker
          mode="month-year"
          value={month}
          onValueChange={setMonthFromWheel}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
          disabled={disabled}
          style={{ borderWidth: 0, backgroundColor: 'transparent', width: '100%' }}
        />
      ) : (
        <>
      <View style={{ flexDirection: 'row' }}>
        {weekdayLabels.map((label, index) => (
          <View key={`${label}-${index}`} style={{ width: `${100 / 7}%`, alignItems: 'center' }}>
            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.sans,
                ...t.typography.labelSmall,
                fontWeight: t.fontWeights.semibold,
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: t.spacing[1] }}>
        {days.map((date) => {
          const outside = date.getMonth() !== month.getMonth();
          const chosen = sameDay(date, selected);
          const current = sameDay(date, today);
          const unavailable = Boolean(
            disabled ||
              (minimum && date < minimum) ||
              (maximum && date > maximum) ||
              isDateDisabled?.(date),
          );
          const hidden = outside && !showOutsideDays;

          return (
            <View
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              style={{
                width: `${100 / 7}%`,
                height: t.sizing.touchTarget.minimum,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!hidden ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={accessibilityDateLabel(date, locale)}
                  accessibilityHint={outside ? 'Selects this date and opens its month' : undefined}
                  accessibilityState={{ selected: chosen, disabled: unavailable }}
                  disabled={unavailable}
                  hitSlop={2}
                  onPress={() => selectDate(date)}
                  style={({ pressed }) => ({
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 18,
                    borderWidth: current && !chosen ? 1 : 0,
                    borderColor: t.colors.borderFocus,
                    backgroundColor: chosen
                      ? t.colors.interactivePrimary
                      : pressed
                        ? t.colors.interactiveSecondaryPressed
                        : 'transparent',
                  })}
                >
                  <Text
                    style={{
                      color: chosen
                        ? t.colors.textInteractivePrimary
                        : unavailable
                          ? t.colors.textTertiary
                          : outside
                            ? t.colors.textTertiary
                            : t.colors.textPrimary,
                      fontFamily: t.fontFamilies.sans,
                      ...t.typography.bodyMedium,
                      fontWeight: chosen ? t.fontWeights.semibold : t.fontWeights.medium,
                      opacity: unavailable ? 0.46 : 1,
                    }}
                  >
                    {date.getDate()}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
        </>
      )}
    </View>
  );
}

function MonthButton({
  label,
  glyph,
  disabled,
  onPress,
}: {
  label: string;
  glyph: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const t = useTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        width: t.sizing.buttonHeight.md,
        height: t.sizing.buttonHeight.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radii.full,
        backgroundColor: pressed ? t.colors.interactiveSecondaryPressed : 'transparent',
        opacity: disabled ? 0.32 : 1,
      })}
    >
      <Text
        style={{
          marginTop: -3,
          color: t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.displayMedium,
        }}
      >
        {glyph}
      </Text>
    </Pressable>
  );
}
