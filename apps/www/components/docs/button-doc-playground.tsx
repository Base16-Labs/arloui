"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import {
  DocCircleNotch,
  DocFabIcon,
  DocIconArrowRight,
  DocIconLock,
  docLoadingSpinCls,
} from "@/components/docs/button-preview-icons";

type Tone = "primary" | "neutral" | "danger";
type Appearance = "solid" | "soft" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "xl";
type IconLayout = "none" | "leading" | "both";

type Palette = { bg: string; fg: string; border: string; bw: number };

function resolvePalette(tone: Tone, appearance: Appearance): Palette {
  if (tone === "primary") {
    switch (appearance) {
      case "solid":
        return { bg: "#155DFC", fg: "#FFFFFF", border: "transparent", bw: 0 };
      case "soft":
        return { bg: "#EFF6FF", fg: "#155DFC", border: "transparent", bw: 0 };
      case "ghost":
        return { bg: "transparent", fg: "#155DFC", border: "transparent", bw: 0 };
      case "outline":
        return { bg: "transparent", fg: "#155DFC", border: "#155DFC", bw: 1 };
    }
  }
  if (tone === "neutral") {
    switch (appearance) {
      case "solid":
        return { bg: "#4A5565", fg: "#FFFFFF", border: "transparent", bw: 0 };
      case "soft":
        return { bg: "#F3F4F6", fg: "#364153", border: "transparent", bw: 0 };
      case "ghost":
        return { bg: "transparent", fg: "#364153", border: "transparent", bw: 0 };
      case "outline":
        return { bg: "transparent", fg: "#101828", border: "#D1D5DC", bw: 1 };
    }
  }
  switch (appearance) {
    case "solid":
      return { bg: "#FB2C36", fg: "#FFFFFF", border: "transparent", bw: 0 };
    case "soft":
      return { bg: "#FEF2F2", fg: "#E7000B", border: "transparent", bw: 0 };
    case "ghost":
      return { bg: "transparent", fg: "#E7000B", border: "transparent", bw: 0 };
    case "outline":
      return { bg: "transparent", fg: "#FB2C36", border: "#FB2C36", bw: 1 };
  }
}

function resolveDisabled(appearance: Appearance): Palette {
  const fg = "#99A1AF";
  if (appearance === "outline") {
    return { bg: "transparent", fg, border: "#E5E7EB", bw: 1 };
  }
  if (appearance === "ghost") {
    return { bg: "transparent", fg, border: "transparent", bw: 0 };
  }
  return { bg: "#F3F4F6", fg, border: "transparent", bw: 0 };
}

function sizeClasses(size: Size): string {
  switch (size) {
    case "sm":
      return "h-8 gap-1.5 px-3 text-[12px]";
    case "md":
      return "h-9 gap-1.5 px-4 text-[13px]";
    case "lg":
      return "h-10 gap-2 px-5 text-[14px]";
    case "xl":
      return "h-11 gap-2 px-6 text-[15px]";
  }
}

function iconSize(size: Size): string {
  switch (size) {
    case "sm":
      return "size-4 shrink-0";
    case "md":
      return "size-[18px] shrink-0";
    case "lg":
      return "size-5 shrink-0";
    case "xl":
      return "size-5 shrink-0";
  }
}

function fabVariant(tone: Tone, appearance: Appearance) {
  if (tone === "danger") return "danger" as const;
  if (appearance === "outline") return "outline" as const;
  if (tone === "neutral") return "neutral" as const;
  return "primary" as const;
}

type PlaygroundProps = { states: readonly string[] };

export function ButtonDocPlayground({ states }: PlaygroundProps) {
  const [tone, setTone] = useState<Tone>("primary");
  const [appearance, setAppearance] = useState<Appearance>("solid");
  const [size, setSize] = useState<Size>("md");
  const [iconLayout, setIconLayout] = useState<IconLayout>("both");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const docState = pinned ?? hovered ?? "default";

  const basePalette = useMemo(
    () => resolvePalette(tone, appearance),
    [tone, appearance]
  );
  const palette =
    docState === "disabled" ? resolveDisabled(appearance) : basePalette;

  const isIconOnly = docState === "icon-only";
  const showPressed = docState === "pressed";
  const isLoading = docState === "loading";
  const showFocusRing = docState === "focus";
  const reducedMotion = docState === "reduced motion";
  const darkChrome = docState === "dark mode";
  const rtl = docState === "RTL";
  const dynamicType = docState === "dynamic type";

  const transitionCls = reducedMotion
    ? "transition-none"
    : "transition-[transform,box-shadow] duration-100 ease-out";

  const sz = sizeClasses(size);
  const icn = iconSize(size);
  const fabShell = isIconOnly && !isLoading;
  const fab = fabVariant(tone, appearance);

  return (
    <>
      <section id="variants" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
        <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
          Tone × appearance × size, all token-driven in the registry. Pick a
          variant and hover or pin a state — the sample updates live beside the
          controls.
        </p>
        <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,240px)] md:items-start">
          <div className="min-w-0 space-y-7 md:order-1">
            <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
          <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Tone
          </span>
          <div className="flex flex-wrap gap-2">
            {(["primary", "neutral", "danger"] as const).map((t) => (
              <Chip key={t} active={tone === t} onClick={() => setTone(t)}>
                {t}
              </Chip>
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Appearance
          </span>
          <div className="flex flex-wrap gap-2">
            {(["solid", "soft", "ghost", "outline"] as const).map((a) => (
              <Chip
                key={a}
                active={appearance === a}
                onClick={() => setAppearance(a)}
              >
                {a}
              </Chip>
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Size
          </span>
          <div className="flex flex-wrap gap-2">
            {(["sm", "md", "lg", "xl"] as const).map((s) => (
              <Chip key={s} active={size === s} onClick={() => setSize(s)}>
                {s}
              </Chip>
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Icons
          </span>
          <div className="flex flex-wrap gap-2">
            {(["none", "leading", "both"] as const).map((il) => (
              <Chip
                key={il}
                active={iconLayout === il}
                onClick={() => setIconLayout(il)}
              >
                {il}
              </Chip>
            ))}
          </div>
            </div>

            <div id="states" className="scroll-mt-24 border-t border-line pt-6">
              <h3 className="text-[12px] font-semibold uppercase tracking-widest text-ink-2">
                States
              </h3>
              <p className="mt-1 mb-3 text-[12px] text-ink-3">
                Hover to preview, click to pin.
              </p>
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

          <div className="order-first md:order-2">
            <div className="sticky top-3">
              <div
                className={cn(
                  "flex min-h-[150px] items-center justify-center rounded-xl border border-line-strong bg-[#f8f6ef] p-6 dark:bg-surface-raised",
                  darkChrome && "border-zinc-700 bg-zinc-900"
                )}
                dir={rtl ? "rtl" : "ltr"}
              >
          <div
            className={cn(
              "relative inline-flex",
              dynamicType && "scale-110 transform-gpu"
            )}
          >
            <button
              type="button"
              disabled={docState === "disabled"}
              className={cn(
                "relative flex min-w-0 items-center justify-center overflow-hidden rounded-full font-semibold leading-none",
                isIconOnly
                  ? cn(
                      "w-auto justify-center px-0",
                      size === "sm" && "size-8",
                      size === "md" && "size-9",
                      size === "lg" && "size-10",
                      size === "xl" && "size-11"
                    )
                  : cn("w-full max-w-[280px] gap-2", sz),
                transitionCls,
                showPressed && !reducedMotion && "scale-[0.97]",
                showFocusRing &&
                  "ring-2 ring-[#51A2FF] ring-offset-2 ring-offset-[#f8f6ef] dark:ring-offset-zinc-900"
              )}
              style={
                fabShell
                  ? {
                      backgroundColor: "transparent",
                      color: "inherit",
                      borderWidth: 0,
                      borderStyle: undefined,
                      borderColor: undefined,
                    }
                  : {
                      backgroundColor: palette.bg,
                      color: palette.fg,
                      borderWidth: palette.bw,
                      borderStyle: palette.bw ? "solid" : undefined,
                      borderColor: palette.border,
                    }
              }
            >
              {!isIconOnly && isLoading && (
                <DocCircleNotch
                  className={cn(icn, !reducedMotion && docLoadingSpinCls)}
                  style={{ color: palette.fg }}
                />
              )}
              {!isIconOnly &&
                !isLoading &&
                (iconLayout === "leading" || iconLayout === "both") && (
                  <DocIconLock className={cn(icn, "opacity-95")} aria-hidden />
                )}
              {!isIconOnly && (
                <span className="min-w-0 flex-1 text-center">Button</span>
              )}
              {!isIconOnly &&
                !isLoading &&
                iconLayout === "both" && (
                  <DocIconArrowRight
                    className={cn(icn, "opacity-95")}
                    aria-hidden
                  />
                )}
              {isIconOnly && !isLoading && (
                <DocFabIcon
                  variant={fab}
                  className={cn(
                    "shrink-0",
                    size === "sm" && "size-8",
                    size === "md" && "size-9",
                    size === "lg" && "size-10",
                    size === "xl" && "size-11",
                  )}
                />
              )}
              {isIconOnly && isLoading && (
                <DocCircleNotch
                  className={cn(icn, !reducedMotion && docLoadingSpinCls)}
                  style={{ color: palette.fg }}
                />
              )}
              {isLoading && !isIconOnly && (
                <span
                  className="pointer-events-none absolute inset-0 bg-[#101828]/10"
                  aria-hidden
                />
              )}
              {showPressed && (
                <span
                  className="pointer-events-none absolute inset-0 bg-black/10"
                  aria-hidden
                />
              )}
            </button>
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

      <section id="motion" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">Motion</h2>
        <p className="mt-1.5 mb-5 text-[13px] text-ink-3">
          Press feedback uses tokenized duration, scale, and semantic overlays —
          try the sample (hold to feel the press).
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] px-4 py-5 dark:bg-surface-raised">
            <span className="text-center font-mono text-[11px] text-ink-3">
              motion.duration.press · motion.pressed.scale
            </span>
            <button
              type="button"
              className={cn(
                "relative flex h-10 min-w-[140px] items-center justify-center overflow-hidden rounded-full bg-[#155DFC] px-5 text-[13px] font-semibold text-white",
                "transition-[transform] duration-100 ease-out",
                "motion-safe:active:scale-[0.97]",
                "motion-reduce:active:scale-100"
              )}
            >
              <span className="relative z-[1]">Press &amp; hold</span>
              <span className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-100 motion-safe:active:opacity-100 motion-reduce:opacity-0" />
            </button>
          </div>
          <div className="flex min-h-[130px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] px-4 py-5 dark:bg-surface-raised">
            <div className="flex w-full flex-col items-center gap-2">
              <span className="text-center font-mono text-[11px] text-ink-3">
                touchFeedbackMain
              </span>
              <button
                type="button"
                className={cn(
                  "relative flex h-10 min-w-[140px] items-center justify-center overflow-hidden rounded-full bg-[#155DFC] px-5 text-[13px] font-semibold text-white",
                  "transition-[transform] duration-100 ease-out",
                  "motion-safe:active:scale-[0.97]",
                  "motion-reduce:active:scale-100",
                )}
              >
                <span className="relative z-[1]">Solid · press</span>
                <span className="pointer-events-none absolute inset-0 bg-[#101828]/10 opacity-0 transition-opacity duration-100 motion-safe:active:opacity-100 motion-reduce:opacity-0" />
              </button>
            </div>
            <div className="flex w-full flex-col items-center gap-2">
              <span className="text-center font-mono text-[11px] text-ink-3">
                interactiveTertiaryPressed
              </span>
              <button
                type="button"
                className={cn(
                  "relative flex h-10 min-w-[140px] items-center justify-center overflow-hidden rounded-full border border-[#D1D5DC] bg-transparent px-5 text-[13px] font-semibold text-[#364153]",
                  "transition-[transform] duration-100 ease-out",
                  "motion-safe:active:scale-[0.97]",
                  "motion-reduce:active:scale-100",
                )}
              >
                <span className="relative z-[1]">Outline · press</span>
                <span className="pointer-events-none absolute inset-0 bg-[#101828]/5 opacity-0 transition-opacity duration-100 motion-safe:active:opacity-100 motion-reduce:opacity-0" />
              </button>
            </div>
            <p className="text-center text-[11px] leading-relaxed text-ink-2">
              Solid fills use a 10% ink overlay (
              <code className="font-mono text-[10px]">touchFeedbackMain</code>
              ); outline/ghost use a lighter wash. With{" "}
              <code className="font-mono text-[10px]">
                prefers-reduced-motion
              </code>
              , the demo skips scale.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
