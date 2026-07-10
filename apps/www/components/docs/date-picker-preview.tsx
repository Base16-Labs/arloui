"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";
import { cn } from "@/lib/cn";

type WeekStart = 0 | 1;
type CalendarState = "default" | "disabled" | "weekends disabled";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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
    (_, index) =>
      new Date(first.getFullYear(), first.getMonth(), 1 - leading + index),
  );
}

export function DatePickerDemo({
  weekStartsOn = 0,
  showOutsideDays = true,
  state = "default",
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
  const weekdays = weekStartsOn === 1
    ? ["M", "T", "W", "T", "F", "S", "S"]
    : ["S", "M", "T", "W", "T", "F", "S"];
  const disabled = state === "disabled";

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-line bg-surface p-3 text-ink shadow-sm",
        disabled && "pointer-events-none opacity-45",
      )}
      style={{ maxWidth: compact ? 300 : 350 }}
    >
      <div className="mb-2 flex min-h-10 items-center justify-between">
        <span className={cn("font-semibold", compact ? "text-[14px]" : "text-[17px]")}> 
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        <div className="flex gap-1">
          <MonthButton label="Previous month" onClick={() => setMonth(addMonths(month, -1))}>‹</MonthButton>
          <MonthButton label="Next month" onClick={() => setMonth(addMonths(month, 1))}>›</MonthButton>
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
          const weekendDisabled = state === "weekends disabled" && (date.getDay() === 0 || date.getDay() === 6);
          const hidden = outside && !showOutsideDays;
          return (
            <div
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              className={cn("flex items-center justify-center", compact ? "h-8" : "h-10")}
            >
              {!hidden ? (
                <button
                  type="button"
                  aria-label={date.toLocaleDateString("en", { dateStyle: "full" })}
                  aria-pressed={chosen}
                  disabled={disabled || weekendDisabled}
                  onClick={() => {
                    setSelected(date);
                    if (outside) setMonth(startOfMonth(date));
                  }}
                  className={cn(
                    "flex items-center justify-center rounded-full text-[12px] font-medium transition-colors",
                    compact ? "size-7" : "size-9",
                    chosen
                      ? "bg-[#155DFC] font-semibold text-white"
                      : "text-ink hover:bg-surface-raised",
                    outside && !chosen && "text-ink-3",
                    weekendDisabled && "cursor-not-allowed opacity-30",
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

export function DatePickerPhonePreview() {
  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <div className="flex h-full items-center justify-center bg-canvas px-4">
          <DatePickerDemo compact />
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}

export function DatePickerDocPlayground({ states }: { states: readonly string[] }) {
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStart>(0);
  const [showOutsideDays, setShowOutsideDays] = useState(true);
  const [state, setState] = useState<CalendarState>("default");

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Configure calendar behavior, then select a date or move between months in the live preview.
      </p>
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(300px,350px)] md:items-start">
        <div className="space-y-5">
          <ControlRow label="Week starts">
            <Chip active={weekStartsOn === 0} onClick={() => setWeekStartsOn(0)}>Sunday</Chip>
            <Chip active={weekStartsOn === 1} onClick={() => setWeekStartsOn(1)}>Monday</Chip>
          </ControlRow>
          <ControlRow label="Outside days">
            <Chip active={showOutsideDays} onClick={() => setShowOutsideDays(true)}>Show</Chip>
            <Chip active={!showOutsideDays} onClick={() => setShowOutsideDays(false)}>Hide</Chip>
          </ControlRow>
          <ControlRow label="State">
            {states.filter((item) => ["default", "disabled", "weekends disabled"].includes(item)).map((item) => (
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
          <DatePickerDemo
            weekStartsOn={weekStartsOn}
            showOutsideDays={showOutsideDays}
            state={state}
          />
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
