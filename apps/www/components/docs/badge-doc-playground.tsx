"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "info" | "success" | "warning" | "error";
type Appearance = "soft" | "solid" | "outline";
type Size = "sm" | "md";
type Mode = "label" | "dot" | "icon";

type Palette = { bg: string; fg: string; border: string; bw: number; dotColor: string };

function resolvePalette(tone: Tone, appearance: Appearance): Palette {
  const tones: Record<Tone, { soft: Palette; solid: Palette; outline: Palette }> = {
    neutral: {
      soft: { bg: "#F3F4F6", fg: "#6A7282", border: "transparent", bw: 0, dotColor: "#6A7282" },
      solid: { bg: "#6A7282", fg: "#FFFFFF", border: "transparent", bw: 0, dotColor: "#FFFFFF" },
      outline: { bg: "transparent", fg: "#6A7282", border: "#D1D5DC", bw: 1, dotColor: "#6A7282" },
    },
    info: {
      soft: { bg: "#EFF6FF", fg: "#155DFC", border: "transparent", bw: 0, dotColor: "#155DFC" },
      solid: { bg: "#155DFC", fg: "#FFFFFF", border: "transparent", bw: 0, dotColor: "#FFFFFF" },
      outline: { bg: "transparent", fg: "#155DFC", border: "#155DFC", bw: 1, dotColor: "#155DFC" },
    },
    success: {
      soft: { bg: "#ECFDF5", fg: "#00C950", border: "transparent", bw: 0, dotColor: "#00C950" },
      solid: { bg: "#00C950", fg: "#FFFFFF", border: "transparent", bw: 0, dotColor: "#FFFFFF" },
      outline: { bg: "transparent", fg: "#00C950", border: "#00C950", bw: 1, dotColor: "#00C950" },
    },
    warning: {
      soft: { bg: "#FFFBEB", fg: "#F59E0B", border: "transparent", bw: 0, dotColor: "#F59E0B" },
      solid: { bg: "#F59E0B", fg: "#FFFFFF", border: "transparent", bw: 0, dotColor: "#FFFFFF" },
      outline: { bg: "transparent", fg: "#F59E0B", border: "#F59E0B", bw: 1, dotColor: "#F59E0B" },
    },
    error: {
      soft: { bg: "#FEF2F2", fg: "#FB2C36", border: "transparent", bw: 0, dotColor: "#FB2C36" },
      solid: { bg: "#FB2C36", fg: "#FFFFFF", border: "transparent", bw: 0, dotColor: "#FFFFFF" },
      outline: { bg: "transparent", fg: "#FB2C36", border: "#FB2C36", bw: 1, dotColor: "#FB2C36" },
    },
  };
  return tones[tone][appearance];
}

function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5L9.8 5.7L14.2 6.1L10.9 9.1L11.8 13.5L8 11.3L4.2 13.5L5.1 9.1L1.8 6.1L6.2 5.7L8 1.5Z"
        fill={color}
      />
    </svg>
  );
}

type PlaygroundProps = { states: readonly string[] };

export function BadgeDocPlayground({ states }: PlaygroundProps) {
  const [tone, setTone] = useState<Tone>("info");
  const [appearance, setAppearance] = useState<Appearance>("soft");
  const [size, setSize] = useState<Size>("md");
  const [mode, setMode] = useState<Mode>("label");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const docState = pinned ?? hovered ?? "label";
  const palette = useMemo(() => resolvePalette(tone, appearance), [tone, appearance]);

  const h = size === "sm" ? 20 : 24;
  const fontSize = size === "sm" ? 11 : 12;
  const dotSize = size === "sm" ? 6 : 8;
  const iconSize = size === "sm" ? 12 : 14;

  const activeMode = docState === "dot" ? "dot" : docState === "icon" || docState === "icon-only" ? "icon" : mode;
  const isIconOnly = docState === "icon-only";
  const activeSize: Size = docState === "sm" ? "sm" : docState === "md" ? "md" : size;
  const activeH = activeSize === "sm" ? 20 : 24;
  const activeFontSize = activeSize === "sm" ? 11 : 12;
  const activeDotSize = activeSize === "sm" ? 6 : 8;
  const activeIconSize = activeSize === "sm" ? 12 : 14;

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Tone × appearance × size × mode. Pick a variant and hover or pin a state — the sample updates live.
      </p>
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,240px)] md:items-start">
        <div className="min-w-0 space-y-7 md:order-1">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Tone</span>
            <div className="flex flex-wrap gap-2">
              {(["neutral", "info", "success", "warning", "error"] as const).map((t) => (
                <Chip key={t} active={tone === t} onClick={() => setTone(t)}>{t}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Appearance</span>
            <div className="flex flex-wrap gap-2">
              {(["soft", "solid", "outline"] as const).map((a) => (
                <Chip key={a} active={appearance === a} onClick={() => setAppearance(a)}>{a}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Size</span>
            <div className="flex flex-wrap gap-2">
              {(["sm", "md"] as const).map((s) => (
                <Chip key={s} active={size === s} onClick={() => setSize(s)}>{s}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Mode</span>
            <div className="flex flex-wrap gap-2">
              {(["label", "dot", "icon"] as const).map((m) => (
                <Chip key={m} active={mode === m} onClick={() => setMode(m)}>{m}</Chip>
              ))}
            </div>
          </div>

          <div id="states" className="scroll-mt-24 border-t border-line pt-6">
            <h3 className="text-[12px] font-semibold uppercase tracking-widest text-ink-2">States</h3>
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
                      : "border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink"
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
            <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-line-strong bg-surface-sunken p-6 dark:bg-surface-raised">
              <div className="flex gap-2">
                {[isIconOnly ? undefined : "Badge 1", isIconOnly ? undefined : "Badge 2"].map((label, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 overflow-hidden rounded-full"
                    style={{
                      height: activeH,
                      backgroundColor: palette.bg,
                      color: palette.fg,
                      borderWidth: palette.bw,
                      borderStyle: palette.bw ? "solid" : undefined,
                      borderColor: palette.border,
                      ...(isIconOnly
                        ? { width: activeH, justifyContent: "center" }
                        : { paddingLeft: 8, paddingRight: 8 }),
                    }}
                  >
                    {activeMode === "dot" && (
                      <span
                        className="shrink-0 rounded-full"
                        style={{ width: activeDotSize, height: activeDotSize, backgroundColor: palette.dotColor }}
                      />
                    )}
                    {activeMode === "icon" && (
                      <StarIcon size={activeIconSize} color={palette.fg} />
                    )}
                    {label && (
                      <span style={{ fontSize: activeFontSize, lineHeight: 1, fontWeight: 400 }}>
                        {label}
                      </span>
                    )}
                  </span>
                ))}
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
