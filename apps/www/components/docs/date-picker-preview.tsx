'use client';

import { useMemo, useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { cn } from '@/lib/cn';

type WeekStart = 0 | 1;
type CalendarState = 'default' | 'disabled' | 'weekends disabled';
type Presentation = 'calendar' | 'wheel';
type WheelMode = 'date' | 'time' | 'date-time' | 'month-year';

const MONTHS = [
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

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function sameDay(a: Date | null, b: Date) {
  return Boolean(
    a &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate(),
  );
}

function gridDays(month: Date, weekStartsOn: WeekStart) {
  const first = startOfMonth(month);
  const leading = (first.getDay() - weekStartsOn + 7) % 7;
  return Array.from(
    { length: 42 },
    (_, index) => new Date(first.getFullYear(), first.getMonth(), 1 - leading + index),
  );
}

export function DatePickerDemo({
  weekStartsOn = 0,
  showOutsideDays = true,
  state = 'default',
  compact = false,
}: {
  weekStartsOn?: WeekStart;
  showOutsideDays?: boolean;
  state?: CalendarState;
  compact?: boolean;
}) {
  const [month, setMonth] = useState(() => new Date(2026, 5, 1));
  const [selected, setSelected] = useState<Date | null>(() => new Date(2026, 5, 15));
  const days = useMemo(() => gridDays(month, weekStartsOn), [month, weekStartsOn]);
  const weekdays =
    weekStartsOn === 1 ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const disabled = state === 'disabled';

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-line bg-surface p-3 text-ink shadow-sm',
        disabled && 'pointer-events-none opacity-45',
      )}
      style={{ maxWidth: compact ? 300 : 350 }}
    >
      <div className="mb-2 flex min-h-10 items-center justify-between">
        <span className={cn('font-semibold', compact ? 'text-[14px]' : 'text-[17px]')}>
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        <div className="flex gap-1">
          <MonthButton label="Previous month" onClick={() => setMonth(addMonths(month, -1))}>
            ‹
          </MonthButton>
          <MonthButton label="Next month" onClick={() => setMonth(addMonths(month, 1))}>
            ›
          </MonthButton>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {weekdays.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="flex h-5 items-center justify-center text-[10px] font-semibold text-ink-3"
          >
            {day}
          </span>
        ))}
        {days.map((date) => {
          const outside = date.getMonth() !== month.getMonth();
          const chosen = sameDay(selected, date);
          const weekendDisabled =
            state === 'weekends disabled' && (date.getDay() === 0 || date.getDay() === 6);
          const hidden = outside && !showOutsideDays;
          return (
            <div
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              className={cn('flex items-center justify-center', compact ? 'h-8' : 'h-10')}
            >
              {!hidden ? (
                <button
                  type="button"
                  aria-label={date.toLocaleDateString('en', { dateStyle: 'full' })}
                  aria-pressed={chosen}
                  disabled={disabled || weekendDisabled}
                  onClick={() => {
                    setSelected(date);
                    if (outside) setMonth(startOfMonth(date));
                  }}
                  className={cn(
                    'flex items-center justify-center rounded-full text-[12px] font-medium transition-colors',
                    compact ? 'size-7' : 'size-9',
                    chosen
                      ? 'bg-[#155DFC] font-semibold text-white'
                      : 'text-ink hover:bg-surface-raised',
                    outside && !chosen && 'text-ink-3',
                    weekendDisabled && 'cursor-not-allowed opacity-30',
                  )}
                >
                  {date.getDate()}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-full text-[27px] leading-none text-ink-2 hover:bg-surface-raised"
    >
      <span className="-translate-y-px">{children}</span>
    </button>
  );
}

type WheelItem = { value: string | number; label: string };

export function DateWheelPickerDemo({
  mode = 'date-time',
  state = 'default',
  compact = false,
}: {
  mode?: WheelMode;
  state?: CalendarState;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState(() => new Date(2026, 5, 15, 13, 10));
  const [initialYear] = useState(() => selected.getFullYear());
  const disabled = state === 'disabled';
  const months = MONTHS.map((label, value) => ({ value, label }));
  const years = Array.from({ length: 201 }, (_, index) => ({
    value: initialYear - 100 + index,
    label: String(initialYear - 100 + index),
  }));
  const days = Array.from(
    { length: new Date(selected.getFullYear(), selected.getMonth() + 1, 0).getDate() },
    (_, index) => ({ value: index + 1, label: String(index + 1).padStart(2, '0') }),
  );
  const dates = Array.from({ length: 61 }, (_, index) => {
    const date = new Date(selected);
    date.setDate(selected.getDate() + index - 30);
    return {
      value: date.getTime(),
      label: date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
    };
  });
  const hours = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: String(index + 1).padStart(2, '0'),
  }));
  const minutes = Array.from({ length: 12 }, (_, index) => ({
    value: index * 5,
    label: String(index * 5).padStart(2, '0'),
  }));
  const periods: WheelItem[] = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];
  const selectedHour = ((selected.getHours() + 11) % 12) + 1;
  const selectedPeriod = selected.getHours() >= 12 ? 'PM' : 'AM';

  function change(parts: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
  }) {
    setSelected((current) => {
      const year = parts.year ?? current.getFullYear();
      const month = parts.month ?? current.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      return new Date(
        year,
        month,
        Math.min(parts.day ?? current.getDate(), lastDay),
        parts.hour ?? current.getHours(),
        parts.minute ?? current.getMinutes(),
      );
    });
  }

  function setPeriod(period: string | number) {
    change({ hour: period === 'PM' ? (selected.getHours() % 12) + 12 : selected.getHours() % 12 });
  }

  return (
    <div
      aria-label="Date wheel picker"
      className={cn(
        'relative flex h-[220px] w-full overflow-hidden rounded-2xl border border-line bg-surface px-2 text-ink shadow-sm',
        disabled && 'pointer-events-none opacity-45',
      )}
      style={{ maxWidth: compact ? 300 : 350 }}
    >
      <div className="pointer-events-none absolute top-[88px] right-2 left-2 h-11 rounded-[10px] bg-surface-raised" />

      {mode === 'date-time' ? (
        <WheelColumn
          label="Date"
          items={dates}
          value={selected.getTime()}
          onChange={(value) => {
            const next = new Date(Number(value));
            change({ year: next.getFullYear(), month: next.getMonth(), day: next.getDate() });
          }}
          className="flex-[2.25]"
        />
      ) : null}

      {mode === 'date' || mode === 'month-year' ? (
        <>
          <WheelColumn
            label="Month"
            items={months}
            value={selected.getMonth()}
            onChange={(value) => change({ month: Number(value) })}
            className="flex-[1.7]"
          />
          {mode === 'date' ? (
            <WheelColumn
              label="Day"
              items={days}
              value={selected.getDate()}
              onChange={(value) => change({ day: Number(value) })}
            />
          ) : null}
          <WheelColumn
            label="Year"
            items={years}
            value={selected.getFullYear()}
            onChange={(value) => change({ year: Number(value) })}
            className="flex-[1.25]"
          />
        </>
      ) : null}

      {mode === 'time' || mode === 'date-time' ? (
        <>
          <WheelColumn
            label="Hour"
            items={hours}
            value={selectedHour}
            onChange={(value) => {
              const hour = (Number(value) % 12) + (selectedPeriod === 'PM' ? 12 : 0);
              change({ hour });
            }}
          />
          <WheelColumn
            label="Minute"
            items={minutes}
            value={Math.floor(selected.getMinutes() / 5) * 5}
            onChange={(value) => change({ minute: Number(value) })}
          />
          <WheelColumn label="Period" items={periods} value={selectedPeriod} onChange={setPeriod} />
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-11 bg-surface/75" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-11 bg-surface/75" />
    </div>
  );
}

function WheelColumn({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string;
  items: WheelItem[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}) {
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  const visible = [-2, -1, 0, 1, 2].map((offset) => ({
    offset,
    item: items[selectedIndex + offset],
  }));

  function move(amount: number) {
    const next = items[Math.max(0, Math.min(items.length - 1, selectedIndex + amount))];
    if (next) onChange(next.value);
  }

  return (
    <div
      role="spinbutton"
      aria-label={label}
      aria-valuetext={items[selectedIndex]?.label}
      tabIndex={0}
      onWheel={(event) => {
        event.preventDefault();
        move(event.deltaY > 0 ? 1 : -1);
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') move(1);
        if (event.key === 'ArrowUp') move(-1);
      }}
      className={cn('relative z-10 min-w-0 flex-1 outline-none', className)}
    >
      {visible.map(({ item, offset }) => (
        <button
          key={item ? `${item.value}-${offset}` : `empty-${offset}`}
          type="button"
          tabIndex={-1}
          disabled={!item}
          onClick={() => item && onChange(item.value)}
          className={cn(
            'flex h-11 w-full items-center justify-center overflow-hidden px-1 text-[15px] leading-[22px] font-medium whitespace-nowrap text-ink-3 transition-colors',
            offset === 0 && 'text-[17px] font-semibold text-ink',
            Math.abs(offset) === 1 ? 'opacity-60' : offset === 0 ? 'opacity-100' : 'opacity-30',
          )}
        >
          {item?.label ?? ''}
        </button>
      ))}
    </div>
  );
}

export function DatePickerDocPlayground({ states }: { states: readonly string[] }) {
  const [presentation, setPresentation] = useState<Presentation>('calendar');
  const [wheelMode, setWheelMode] = useState<WheelMode>('date-time');
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStart>(0);
  const [showOutsideDays, setShowOutsideDays] = useState(true);
  const [state, setState] = useState<CalendarState>('default');

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Configure calendar behavior, then select a date or move between months in the live preview.
      </p>
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(300px,350px)] md:items-start">
        <div className="space-y-5">
          <ControlRow label="Presentation">
            <Chip active={presentation === 'calendar'} onClick={() => setPresentation('calendar')}>
              Calendar
            </Chip>
            <Chip
              active={presentation === 'wheel'}
              onClick={() => {
                setPresentation('wheel');
                if (state === 'weekends disabled') setState('default');
              }}
            >
              Wheel
            </Chip>
          </ControlRow>
          {presentation === 'calendar' ? (
            <>
              <ControlRow label="Week starts">
                <Chip active={weekStartsOn === 0} onClick={() => setWeekStartsOn(0)}>
                  Sunday
                </Chip>
                <Chip active={weekStartsOn === 1} onClick={() => setWeekStartsOn(1)}>
                  Monday
                </Chip>
              </ControlRow>
              <ControlRow label="Outside days">
                <Chip active={showOutsideDays} onClick={() => setShowOutsideDays(true)}>
                  Show
                </Chip>
                <Chip active={!showOutsideDays} onClick={() => setShowOutsideDays(false)}>
                  Hide
                </Chip>
              </ControlRow>
            </>
          ) : (
            <ControlRow label="Wheel mode">
              {(['date-time', 'date', 'time', 'month-year'] as const).map((item) => (
                <Chip key={item} active={wheelMode === item} onClick={() => setWheelMode(item)}>
                  {item.replaceAll('-', ' + ')}
                </Chip>
              ))}
            </ControlRow>
          )}
          <ControlRow label="State">
            {states
              .filter((item) =>
                [
                  'default',
                  'disabled',
                  ...(presentation === 'calendar' ? ['weekends disabled'] : []),
                ].includes(item),
              )
              .map((item) => (
                <Chip
                  key={item}
                  active={state === item}
                  onClick={() => setState(item as CalendarState)}
                >
                  {item}
                </Chip>
              ))}
          </ControlRow>
        </div>
        <div className="flex justify-center rounded-xl border border-line bg-canvas p-4 md:sticky md:top-3">
          {presentation === 'calendar' ? (
            <DatePickerDemo
              weekStartsOn={weekStartsOn}
              showOutsideDays={showOutsideDays}
              state={state}
            />
          ) : (
            <DateWheelPickerDemo mode={wheelMode} state={state} />
          )}
        </div>
      </div>
    </section>
  );
}

function ControlRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[100px_1fr] sm:items-center">
      <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
