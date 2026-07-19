"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

export type Control = "toggle" | "checkbox" | "radio";
type Size = "sm" | "md" | "lg";
type Appearance = "outlined" | "filled";

type PlaygroundProps = {
  control: Control;
  states: readonly string[];
};

const SIZES_BY_CONTROL: Record<Control, Size[]> = {
  toggle: ["sm", "md"],
  checkbox: ["sm", "md", "lg"],
  radio: ["sm", "md", "lg"],
};

const DEFAULT_STATE: Record<Control, string> = {
  toggle: "on",
  checkbox: "checked",
  radio: "selected",
};

const SAMPLE_LABEL: Record<Control, string> = {
  toggle: "Notifications",
  checkbox: "I agree to the terms",
  radio: "Pro plan",
};

/** Map a state token to the glyph's visual props. */
function stateToProps(state: string): { on: boolean; disabled: boolean; dark: boolean } {
  return {
    on: /(^|\s)(on|checked|selected)$/.test(state) && !state.includes("unchecked") && !state.includes("unselected"),
    disabled: state.startsWith("disabled"),
    dark: state === "dark mode",
  };
}

export function FormControlDocPlayground({ control, states }: PlaygroundProps) {
  const [size, setSize] = useState<Size>("md");
  const [appearance, setAppearance] = useState<Appearance>("outlined");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const docState = pinned ?? hovered ?? DEFAULT_STATE[control];
  const { on, disabled, dark } = stateToProps(docState);

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Every size and appearance is token-driven in the registry. Pick a variant
        and hover or pin a state — the sample updates live beside the controls.
      </p>
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,280px)] md:items-start">
        <div className="min-w-0 space-y-7 md:order-1">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
            {control === "radio" ? (
              <>
                <ControlLabel>Appearance</ControlLabel>
                <ChipRow
                  values={["outlined", "filled"]}
                  value={appearance}
                  onChange={(next) => setAppearance(next as Appearance)}
                />
              </>
            ) : null}
            <ControlLabel>Size</ControlLabel>
            <ChipRow
              values={SIZES_BY_CONTROL[control]}
              value={size}
              onChange={(next) => setSize(next as Size)}
            />
          </div>

          <div id="states" className="scroll-mt-24 border-t border-line pt-6">
            <h3 className="text-[12px] font-semibold uppercase tracking-widest text-ink-2">
              States
            </h3>
            <p className="mt-1 mb-3 text-[12px] text-ink-3">Hover to preview, click to pin.</p>
            <div className="flex flex-wrap gap-2">
              {[...states].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setPinned(pinned === s ? null : s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11.5px] capitalize transition-colors",
                    pinned === s
                      ? "border-ink bg-ink text-canvas"
                      : "border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="order-first md:order-2 md:self-center">
          <div className="sticky top-3">
            <div
              className={cn(
                "flex min-h-[150px] items-center justify-center rounded-xl border border-line-strong p-6",
                dark ? "bg-[#09090B]" : "bg-surface-sunken dark:bg-surface-raised",
              )}
            >
              <div className={cn("flex items-center gap-3", disabled && "opacity-45")}>
                <ControlGlyph
                  control={control}
                  size={size}
                  on={on}
                  appearance={appearance}
                  dark={dark}
                />
                <span
                  className="text-[14px] font-medium leading-5"
                  style={{ color: dark ? "#E5E7EB" : "#364153" }}
                >
                  {SAMPLE_LABEL[control]}
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-[12px] text-ink-3">
              Active:{" "}
              <span className="font-mono text-[11px] text-ink-2">
                {docState}
                {pinned ? " (pinned)" : ""}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">{children}</span>
  );
}

function ChipRow({
  values,
  value,
  onChange,
}: {
  values: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((item) => (
        <Chip key={item} active={value === item} onClick={() => onChange(item)}>
          {item}
        </Chip>
      ))}
    </div>
  );
}

/**
 * Static, token-styled render of a Toggle / Checkbox / Radio for docs previews.
 * Mirrors the registry components' visual spec without pulling in React Native.
 */
export function ControlGlyph({
  control,
  size = "md",
  on = false,
  appearance = "outlined",
  dark = false,
}: {
  control: Control;
  size?: Size;
  on?: boolean;
  appearance?: Appearance;
  dark?: boolean;
}) {
  const emptyBorder = dark ? "#374151" : "#D1D5DC";
  const emptyBg = dark ? "#1f2937" : "#E5E7EB";

  if (control === "toggle") {
    const dims =
      size === "sm"
        ? { w: 40, h: 24, thumb: 18 }
        : { w: 52, h: 32, thumb: 26 };
    return (
      <span
        className="flex items-center rounded-full px-[3px]"
        style={{ width: dims.w, height: dims.h, backgroundColor: on ? "#155DFC" : emptyBg }}
      >
        <span
          className="rounded-full bg-white shadow-sm"
          style={{ width: dims.thumb, height: dims.thumb, marginLeft: on ? "auto" : 0 }}
        />
      </span>
    );
  }

  const box = size === "sm" ? 20 : size === "lg" ? 32 : 24;

  if (control === "checkbox") {
    const radius = size === "sm" ? 4 : size === "lg" ? 8 : 6;
    return (
      <span
        className="flex items-center justify-center"
        style={{
          width: box,
          height: box,
          borderRadius: radius,
          backgroundColor: on ? "#155DFC" : "transparent",
          border: on ? "none" : `1.5px solid ${emptyBorder}`,
        }}
      >
        {on ? (
          <svg width={box * 0.58} height={box * 0.58} viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7.5L5.5 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
    );
  }

  // radio
  const dot = Math.round(box * 0.5);
  const filled = appearance === "filled";
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{
        width: box,
        height: box,
        backgroundColor: on && filled ? "#155DFC" : "transparent",
        border: on ? "1.5px solid #155DFC" : `1.5px solid ${emptyBorder}`,
      }}
    >
      {on ? (
        <span
          className="rounded-full"
          style={{
            width: filled ? Math.round(box * 0.42) : dot,
            height: filled ? Math.round(box * 0.42) : dot,
            backgroundColor: filled ? "#FFFFFF" : "#155DFC",
          }}
        />
      ) : null}
    </span>
  );
}
