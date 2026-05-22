"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { StateGrid } from "@/components/mdx/StateGrid";
import { cn } from "@/lib/cn";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";

type Detent = "small" | "medium" | "large" | "full";
type SheetStyle = "opaque" | "translucent";
type Density = "comfortable" | "compact";

const DETENT_H: Record<Detent, string> = {
  small: "h-[38%]",
  medium: "h-[55%]",
  large: "h-[68%]",
  full: "h-[90%]",
};

const ROWS = [
  "XiamenAir · MF · CXA",
  "United · UA · UAL",
  "John F Kennedy Intl. · JFK",
  "Incheon Intl · ICN",
  "Find by Route",
  "Find by Flight Number",
] as const;

type SheetDocPlaygroundProps = { states: readonly string[] };

export function SheetDocPlayground({ states }: SheetDocPlaygroundProps) {
  const [detent, setDetent] = useState<Detent>("medium");
  const [sheetStyle, setSheetStyle] = useState<SheetStyle>("opaque");
  const [density, setDensity] = useState<Density>("comfortable");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const docState = pinned ?? hovered ?? "default";

  const rowH = density === "compact" ? "h-8" : "h-[38px]";
  const rowPx = density === "compact" ? "px-3 text-[11px]" : "px-4 text-xs";

  const sheetChrome = useMemo(() => {
    const base =
      sheetStyle === "translucent"
        ? "border border-white/30 bg-white/80 shadow-lg backdrop-blur-md"
        : "bg-white shadow-md";
    return cn("rounded-t-[24px] transition-all duration-300 ease-out", base, DETENT_H[detent]);
  }, [detent, sheetStyle]);

  const showLoading = docState === "loading";
  const showError = docState === "error";
  const dragging = docState === "dragging";

  return (
    <>
      <PreviewCard className="mb-12">
        <PhoneFrame>
          <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-200/80 to-zinc-100">
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end">
              <div
                className={cn(
                  sheetChrome,
                  dragging && "motion-safe:translate-y-1 motion-reduce:translate-y-0"
                )}
              >
                <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-zinc-300" />
                <div className="relative mt-3 text-center text-[15px] font-semibold">
                  Add Flight
                  {showLoading && (
                    <span className="ml-2 inline-block size-3 animate-[spin_0.5s_linear_infinite] rounded-full border-2 border-zinc-400 border-t-transparent align-middle" />
                  )}
                </div>
                {showError && (
                  <p className="px-4 pt-1 text-center text-[11px] font-medium text-red-600">
                    Couldn&apos;t load flights — try again.
                  </p>
                )}
                {ROWS.map((row) => (
                  <div
                    key={row}
                    className={cn(
                      "flex items-center border-t border-[#f0eee7] text-ink-2",
                      rowH,
                      rowPx
                    )}
                  >
                    {row}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PhoneFrame>
      </PreviewCard>

      <section id="variants" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">Variants</h2>
        <p className="mt-1.5 mb-5 text-[13px] text-ink-3">
          Sizes, tones, density. Tap to update the device preview above.
        </p>
        <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
          <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Detent
          </span>
          <div className="flex flex-wrap gap-2">
            {(["small", "medium", "large", "full"] as const).map((d) => (
              <Chip key={d} active={detent === d} onClick={() => setDetent(d)}>
                {d}
              </Chip>
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Style
          </span>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={sheetStyle === "opaque"}
              onClick={() => setSheetStyle("opaque")}
            >
              opaque
            </Chip>
            <Chip
              active={sheetStyle === "translucent"}
              onClick={() => setSheetStyle("translucent")}
            >
              translucent
            </Chip>
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Density
          </span>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={density === "comfortable"}
              onClick={() => setDensity("comfortable")}
            >
              comfortable
            </Chip>
            <Chip
              active={density === "compact"}
              onClick={() => setDensity("compact")}
            >
              compact
            </Chip>
          </div>
        </div>
      </section>

      <section id="states" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">States</h2>
        <p className="mt-1.5 mb-5 text-[13px] text-ink-3">
          Hover any cell to preview; click to pin. The preview above updates for
          supported states.
        </p>
        <StateGrid states={[...states]} onHover={setHovered} onPin={setPinned} />
        <p className="mt-4 text-[12px] text-ink-3">
          Active:{" "}
          <span className="font-mono text-[11px] text-ink-2">
            {docState}
            {pinned ? " (pinned)" : ""}
          </span>
        </p>
      </section>

      <section id="motion" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">Motion</h2>
        <p className="mt-1.5 mb-5 text-[13px] text-ink-3">
          Detent changes animate height with an ease close to sheet motion;
          reduced-motion users still see the end state.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] px-4 py-5 dark:bg-surface-raised">
            <span className="text-center font-mono text-[11px] text-ink-3">
              motion.ease-sheet · motion.duration-sheet
            </span>
            <button
              type="button"
              onClick={() =>
                setDetent((d) => {
                  const order: Detent[] = ["small", "medium", "large", "full"];
                  const i = order.indexOf(d);
                  return order[(i + 1) % order.length];
                })
              }
              className="rounded-full border border-line-strong bg-canvas px-4 py-2 text-[12px] font-semibold text-ink-2 hover:border-ink-3"
            >
              Cycle detent →
            </button>
            <span className="font-mono text-[10px] text-ink-3">
              current: {detent}
            </span>
          </div>
          <div className="flex min-h-[130px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] px-4 dark:bg-surface-raised">
            <p className="text-center font-mono text-[11px] leading-relaxed text-ink-3">
              280–360ms enter · 220–290ms exit
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
