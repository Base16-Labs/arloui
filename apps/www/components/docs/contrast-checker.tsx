"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { darkSemanticColors, lightSemanticColors } from "@/lib/color-tokens";
import { StatusBadge, type StatusIcon, type StatusTone } from "@/components/ui/StatusBadge";

const FG_TOKENS = [
  "textPrimary",
  "textSecondary",
  "textTertiary",
  "textInverse",
  "textInteractivePrimary",
  "interactivePrimary",
  "feedbackError",
  "feedbackSuccess",
] as const;

const BG_TOKENS = [
  "surfaceBackground",
  "surfaceElevated",
  "surfaceInput",
  "surfaceInverse",
  "interactivePrimary",
  "feedbackErrorBg",
  "feedbackSuccessBg",
  "navBackground",
] as const;

type FgToken = (typeof FG_TOKENS)[number];
type BgToken = (typeof BG_TOKENS)[number];

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function verdict(ratio: number): { text: string; tone: StatusTone; icon: StatusIcon } {
  if (ratio >= 7) {
    return {
      text: "Excellent — passes AAA. Legible at any text size.",
      tone: "approved",
      icon: "check",
    };
  }
  if (ratio >= 4.5) {
    return {
      text: "Good — passes AA for body text (and AAA for large text).",
      tone: "approved",
      icon: "check",
    };
  }
  if (ratio >= 3) {
    return {
      text: "Large text only — passes AA for headings/large text, but fails for body text.",
      tone: "changes",
      icon: "warning",
    };
  }
  return {
    text: "Too low — not enough contrast for text. Use only for decorative or non-essential elements.",
    tone: "danger",
    icon: "warning",
  };
}

function Badge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <StatusBadge
      tone={pass ? "approved" : "danger"}
      icon={pass ? "check" : "warning"}
      className="min-h-10 w-full justify-between rounded-lg text-[12px]"
    >
      <span>{label}</span>
      <span className="font-mono">{pass ? "Pass" : "Fail"}</span>
    </StatusBadge>
  );
}

function TokenSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-line bg-canvas py-0 pr-9 pl-2.5 font-mono text-[11.5px] text-ink outline-none"
        >
          {options.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-ink-3"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </label>
  );
}

export function ContrastChecker() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [fg, setFg] = useState<FgToken>("textPrimary");
  const [bg, setBg] = useState<BgToken>("surfaceBackground");

  const colors = mode === "light" ? lightSemanticColors : darkSemanticColors;
  const fgHex = colors[fg];
  const bgHex = colors[bg];
  const ratio = contrastRatio(fgHex, bgHex);
  const rounded = Math.round(ratio * 100) / 100;
  const v = verdict(ratio);

  return (
    <div className="space-y-3">
      <p className="text-[13.5px] leading-relaxed text-ink-2">
        Pick a text role and a surface role to see their WCAG contrast ratio in the selected mode.
        Higher is more legible; the badges show which standards the pair clears.
      </p>
      <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-lg border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Resolved · {mode}
          </div>
          <div className="inline-flex rounded-md border border-line bg-canvas p-0.5 text-[11px]">
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-sm px-2.5 py-1 capitalize transition-colors",
                  mode === m ? "bg-ink text-canvas" : "text-ink-2 hover:text-ink",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-4 flex flex-col gap-2 rounded-md border border-line p-5"
          style={{ backgroundColor: bgHex }}
        >
          <span className="text-[28px] font-semibold leading-none" style={{ color: fgHex }}>
            Ag
          </span>
          <span className="text-[14px]" style={{ color: fgHex }}>
            The quick brown fox jumps over.
          </span>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-[28px] font-medium text-ink">{rounded.toFixed(2)}</span>
          <span className="text-[12px] text-ink-3">: 1 contrast ratio</span>
        </div>
        <div className="mt-1 flex gap-3 font-mono text-[10.5px] text-ink-3">
          <span>{fgHex}</span>
          <span>on</span>
          <span>{bgHex}</span>
        </div>

        <StatusBadge
          tone={v.tone}
          icon={v.icon}
          className="mt-4 min-h-0 items-start rounded-lg px-3 py-2 text-[12.5px] leading-relaxed"
        >
          {v.text}
        </StatusBadge>
      </div>

      <div className="rounded-lg border border-line bg-surface p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <TokenSelect
            label="Text"
            value={fg}
            options={FG_TOKENS}
            onChange={(v) => setFg(v as FgToken)}
          />
          <TokenSelect
            label="Surface"
            value={bg}
            options={BG_TOKENS}
            onChange={(v) => setBg(v as BgToken)}
          />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Badge label="AA · normal" pass={ratio >= 4.5} />
          <Badge label="AA · large" pass={ratio >= 3} />
          <Badge label="AAA · normal" pass={ratio >= 7} />
          <Badge label="AAA · large" pass={ratio >= 4.5} />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          WCAG AA needs 4.5:1 for body text and 3:1 for large text (≥18.66px bold or ≥24px). AAA
          raises those to 7:1 and 4.5:1.
        </p>
      </div>
      </div>
      <p className="text-[12px] leading-relaxed text-ink-3">
        Options are the design system’s semantic color tokens — the same roles in the Semantic tokens
        table above, resolved live for light or dark. Only solid-color roles are listed; overlay and
        translucent tokens are excluded.
      </p>
    </div>
  );
}
