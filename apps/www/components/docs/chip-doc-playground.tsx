"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type ChipType = "filter" | "input" | "assist";
type ChipStyle = "outline" | "fill";
type Accent = "primary" | "neutral";
type Radius = "full" | "lg";
type Indicator = "check" | "none";
type Size = "sm" | "md";
type IconMode = "none" | "leading" | "icon-only";

type Palette = { bg: string; fg: string; border: string; bw: number };

function resolvePalette(chipStyle: ChipStyle, accent: Accent, selected: boolean, disabled: boolean): Palette {
  if (disabled) {
    return { bg: "#F3F4F6", fg: "#99A1AF", border: "#E5E7EB", bw: 1 };
  }
  if (selected) {
    if (chipStyle === "fill") {
      return accent === "primary"
        ? { bg: "#155DFC", fg: "#FFFFFF", border: "#155DFC", bw: 1 }
        : { bg: "#101828", fg: "#FFFFFF", border: "#101828", bw: 1 };
    }
    return accent === "primary"
      ? { bg: "#EFF6FF", fg: "#155DFC", border: "#155DFC", bw: 1 }
      : { bg: "#F3F4F6", fg: "#101828", border: "#101828", bw: 1 };
  }
  if (chipStyle === "fill") {
    return accent === "primary"
      ? { bg: "#F3F4F6", fg: "#101828", border: "transparent", bw: 0 }
      : { bg: "#F3F4F6", fg: "#101828", border: "transparent", bw: 0 };
  }
  return { bg: "transparent", fg: "#101828", border: "#D1D5DC", bw: 1 };
}

function CheckIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7.5L5.5 10L11 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M4 4L10 10M10 4L4 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L9.8 5.7L14.2 6.1L10.9 9.1L11.8 13.5L8 11.3L4.2 13.5L5.1 9.1L1.8 6.1L6.2 5.7L8 1.5Z" fill={color} />
    </svg>
  );
}

function CalendarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M5.5 1.5V3.5M10.5 1.5V3.5M2.5 6.5H13.5M3.5 3H12.5C13.0523 3 13.5 3.44772 13.5 4V13C13.5 13.5523 13.0523 14 12.5 14H3.5C2.94772 14 2.5 13.5523 2.5 13V4C2.5 3.44772 2.94772 3 3.5 3Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM1.5 8H14.5M8 1.5C9.657 3.313 10.614 5.6 10.7 8C10.614 10.4 9.657 12.687 8 14.5C6.343 12.687 5.386 10.4 5.3 8C5.386 5.6 6.343 3.313 8 1.5Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CONTEXTUAL_ICONS = [StarIcon, CalendarIcon, GlobeIcon, StarIcon];

type PlaygroundProps = { states: readonly string[] };

export function ChipDocPlayground({ states }: PlaygroundProps) {
  const [chipType, setChipType] = useState<ChipType>("filter");
  const [chipStyle, setChipStyle] = useState<ChipStyle>("outline");
  const [accent, setAccent] = useState<Accent>("primary");
  const [radius, setRadius] = useState<Radius>("full");
  const [indicator, setIndicator] = useState<Indicator>("check");
  const [size, setSize] = useState<Size>("md");
  const [iconMode, setIconMode] = useState<IconMode>("none");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState(new Set(["Active"]));

  const docState = pinned ?? hovered ?? "default";
  const isDisabled = docState === "disabled";
  const isSelected = docState === "selected";
  const activeType: ChipType = docState === "filter" ? "filter" : docState === "input" ? "input" : docState === "assist" ? "assist" : chipType;
  const isIconOnly = docState === "icon-only" || iconMode === "icon-only";
  const showIcon = iconMode !== "none" || docState === "icon-only";
  const iconSz = size === "sm" ? 14 : 16;

  const h = size === "sm" ? 28 : 32;
  const fontSize = size === "sm" ? 12 : 14;
  const iconSize = size === "sm" ? 16 : 20;
  const gap = size === "sm" ? 4 : 8;
  const px = 12;
  const borderRadius = radius === "full" ? 9999 : 12;

  const filterLabels = ["All", "Active", "Archived", "Draft"];
  const inputLabels = ["React Native", "TypeScript", "Expo"];
  const assistLabels = ["Share", "Export", "Duplicate"];

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Type × style × accent × radius × indicator. Hover or pin a state to preview it live.
      </p>
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,280px)] md:items-start">
        <div className="min-w-0 space-y-7 md:order-1">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Type</span>
            <div className="flex flex-wrap gap-2">
              {(["filter", "input", "assist"] as const).map((t) => (
                <Chip key={t} active={chipType === t} onClick={() => setChipType(t)}>{t}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Style</span>
            <div className="flex flex-wrap gap-2">
              {(["outline", "fill"] as const).map((s) => (
                <Chip key={s} active={chipStyle === s} onClick={() => setChipStyle(s)}>{s}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Accent</span>
            <div className="flex flex-wrap gap-2">
              {(["primary", "neutral"] as const).map((a) => (
                <Chip key={a} active={accent === a} onClick={() => setAccent(a)}>{a}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Radius</span>
            <div className="flex flex-wrap gap-2">
              {(["full", "lg"] as const).map((r) => (
                <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>{r}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Selected</span>
            <div className="flex flex-wrap gap-2">
              {(["check", "none"] as const).map((i) => (
                <Chip key={i} active={indicator === i} onClick={() => setIndicator(i)}>{i}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Icon</span>
            <div className="flex flex-wrap gap-2">
              {(["none", "leading", "icon-only"] as const).map((m) => (
                <Chip key={m} active={iconMode === m} onClick={() => setIconMode(m)}>{m}</Chip>
              ))}
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">Size</span>
            <div className="flex flex-wrap gap-2">
              {(["sm", "md"] as const).map((s) => (
                <Chip key={s} active={size === s} onClick={() => setSize(s)}>{s}</Chip>
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
            <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-line-strong bg-[#f8f6ef] p-6 dark:bg-surface-raised">
              <div className="flex flex-wrap justify-center gap-2">
                {activeType === "filter" &&
                  filterLabels.map((label) => {
                    const sel = isSelected || selectedFilters.has(label);
                    const p = resolvePalette(chipStyle, accent, sel, isDisabled);
                    const showCheck = sel && indicator === "check";
                    return (
                      <span
                        key={label}
                        className="inline-flex items-center"
                        style={{
                          height: h,
                          borderRadius,
                          backgroundColor: p.bg,
                          color: p.fg,
                          borderWidth: p.bw || 1,
                          borderStyle: "solid",
                          borderColor: p.bw ? p.border : "transparent",
                          paddingLeft: px,
                          paddingRight: px,
                          gap,
                          fontSize,
                          ...(isIconOnly ? { width: h, paddingLeft: 0, paddingRight: 0, justifyContent: "center" } : {}),
                        }}
                      >
                        {showCheck && !isIconOnly && <CheckIcon size={size === "sm" ? 14 : 16} color={p.fg} />}
                        {!showCheck && showIcon && (() => { const Icon = CONTEXTUAL_ICONS[filterLabels.indexOf(label) % CONTEXTUAL_ICONS.length]!; return <Icon size={iconSz} color={p.fg} />; })()}
                        {!isIconOnly && label}
                      </span>
                    );
                  })}
                {activeType === "input" &&
                  inputLabels.map((label) => {
                    const p = resolvePalette(chipStyle, accent, false, isDisabled);
                    return (
                      <span
                        key={label}
                        className="inline-flex items-center"
                        style={{
                          height: h,
                          borderRadius,
                          backgroundColor: p.bg,
                          color: p.fg,
                          borderWidth: p.bw || 1,
                          borderStyle: "solid",
                          borderColor: p.bw ? p.border : "transparent",
                          gap,
                          fontSize,
                          ...(isIconOnly
                            ? { width: h, paddingLeft: 0, paddingRight: 0, justifyContent: "center" as const }
                            : { paddingLeft: px, paddingRight: gap }),
                        }}
                      >
                        {showIcon && (() => { const Icon = CONTEXTUAL_ICONS[inputLabels.indexOf(label) % CONTEXTUAL_ICONS.length]!; return <Icon size={iconSz} color={p.fg} />; })()}
                        {!isIconOnly && label}
                        {!isIconOnly && (
                          <span className="flex items-center justify-center" style={{ width: h - gap * 2, height: h - gap * 2 }}>
                            <CloseIcon size={size === "sm" ? 12 : 14} color={p.fg} />
                          </span>
                        )}
                      </span>
                    );
                  })}
                {activeType === "assist" &&
                  assistLabels.map((label) => {
                    const p = resolvePalette(chipStyle, accent, false, isDisabled);
                    return (
                      <span
                        key={label}
                        className="inline-flex items-center"
                        style={{
                          height: h,
                          borderRadius,
                          backgroundColor: p.bg,
                          color: p.fg,
                          borderWidth: p.bw || 1,
                          borderStyle: "solid",
                          borderColor: p.bw ? p.border : "transparent",
                          gap,
                          fontSize,
                          ...(isIconOnly
                            ? { width: h, paddingLeft: 0, paddingRight: 0, justifyContent: "center" as const }
                            : { paddingLeft: px, paddingRight: px }),
                        }}
                      >
                        {showIcon && (() => { const Icon = CONTEXTUAL_ICONS[assistLabels.indexOf(label) % CONTEXTUAL_ICONS.length]!; return <Icon size={iconSz} color={p.fg} />; })()}
                        {!isIconOnly && label}
                      </span>
                    );
                  })}
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
