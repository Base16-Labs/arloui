"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type Backdrop = "scrim" | "passthrough";
type Surface = "solid" | "glass";
type Presentation = "edge" | "inset" | "stack";
type Detent = "auto" | "full";

type SheetDocPlaygroundProps = { states: readonly string[] };

const ROWS = ["Recently added", "Favorites", "Shared with you", "Downloads", "Archive"];

export function SheetDocPlayground({ states }: SheetDocPlaygroundProps) {
  const [backdrop, setBackdrop] = useState<Backdrop>("scrim");
  const [surface, setSurface] = useState<Surface>("solid");
  const [presentation, setPresentation] = useState<Presentation>("edge");
  const [detent, setDetent] = useState<Detent>("auto");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const docState = pinned ?? hovered ?? "open";

  // State tokens can override the variant chips for the live preview.
  const effBackdrop: Backdrop = docState === "passthrough" ? "passthrough" : docState === "scrim" ? "scrim" : backdrop;
  const dragging = docState === "dragging";
  const dismissing = docState === "dismissing";
  const long = docState === "long content";
  const rows = long ? [...ROWS, "Trash", "Recently deleted"] : ROWS.slice(0, 3);
  const isGlass = surface === "glass";

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Backdrop and surface are independent axes — combine pass-through with glass
        for a floating Liquid-Glass sheet. Pick a variant and hover or pin a state.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,260px)] md:items-start">
        <div className="min-w-0 space-y-7 md:order-1">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
            <ControlLabel>Backdrop</ControlLabel>
            <ChipRow
              values={["scrim", "passthrough"]}
              value={backdrop}
              onChange={(v) => setBackdrop(v as Backdrop)}
            />
            <ControlLabel>Surface</ControlLabel>
            <ChipRow values={["solid", "glass"]} value={surface} onChange={(v) => setSurface(v as Surface)} />
            <ControlLabel>Style</ControlLabel>
            <ChipRow
              values={["edge", "inset", "stack"]}
              value={presentation}
              onChange={(v) => setPresentation(v as Presentation)}
            />
            <ControlLabel>Detent</ControlLabel>
            <ChipRow values={["auto", "full"]} value={detent} onChange={(v) => setDetent(v as Detent)} />
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
                      : "border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-ink-3">
              Active:{" "}
              <span className="font-mono text-[11px] text-ink-2">
                {docState}
                {pinned ? " (pinned)" : ""}
              </span>
            </p>
          </div>
        </div>

        <div className="order-first md:order-2 md:self-center">
          <div className="sticky top-3">
            <SheetSample
              backdrop={effBackdrop}
              glass={isGlass}
              presentation={presentation}
              detent={detent}
              dark={false}
              dragging={dragging}
              dismissing={dismissing}
              rows={rows}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SheetSample({
  backdrop,
  glass,
  presentation,
  detent,
  dark,
  dragging,
  dismissing,
  rows,
}: {
  backdrop: Backdrop;
  glass: boolean;
  presentation: Presentation;
  detent: Detent;
  dark: boolean;
  dragging: boolean;
  dismissing: boolean;
  rows: string[];
}) {
  const canvas = dark ? "#09090B" : "#F9FAFB";
  const title = dark ? "#F9FAFB" : "#101828";
  const rowText = dark ? "#E5E7EB" : "#364153";
  const divider = dark ? "#1E2939" : "#F3F4F6";
  const handle = dark ? "#364153" : "#D1D5DC";

  const sheetBg = glass
    ? dark
      ? "rgba(16,24,40,0.72)"
      : "rgba(255,255,255,0.72)"
    : dark
      ? "#1E2939"
      : "#FFFFFF";
  const sheetBorder = glass ? (dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.64)") : "transparent";
  const inset = presentation === "edge" ? 0 : 10;
  const radius = presentation === "stack" ? 18 : 22;

  return (
    <div
      className="relative mx-auto aspect-9/17 w-full max-w-[240px] overflow-hidden rounded-[28px] border border-line-strong"
      style={{ backgroundColor: canvas }}
    >
      {/* Background content */}
      <div className="px-4 pt-6">
        <div className="text-[11px] font-semibold" style={{ color: title }}>
          Library
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {["#2B7FFF", "#00C950", "#E17100", "#FB2C36"].map((c, i) => (
            <div key={i} className="h-12 rounded-xl" style={{ backgroundColor: c, opacity: dark ? 0.5 : 0.28 }} />
          ))}
        </div>
      </div>

      {/* Scrim */}
      {backdrop === "scrim" ? (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ backgroundColor: dark ? "rgba(16,24,40,0.7)" : "rgba(16,24,40,0.4)", opacity: dismissing ? 0 : 1 }}
        />
      ) : null}

      {/* Sheet */}
      {presentation === "stack" && !dismissing ? (
        <div
          className="absolute left-5 right-5 h-8 rounded-[18px] border opacity-90 shadow-sm"
          style={{
            bottom: `calc(44% + ${inset + 12}px)`,
            backgroundColor: glass ? "rgba(255,255,255,0.48)" : dark ? "#293142" : "#EEF0F3",
            borderColor: glass ? "rgba(255,255,255,0.46)" : dark ? "#364153" : "#E5E7EB",
          }}
        />
      ) : null}
      <div
        className="absolute border px-4 pb-5 pt-2 shadow-xl transition-transform duration-300 ease-out"
        style={{
          left: inset,
          right: inset,
          bottom: inset,
          backgroundColor: sheetBg,
          borderColor: sheetBorder,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: presentation === "edge" ? 0 : radius,
          borderBottomRightRadius: presentation === "edge" ? 0 : radius,
          backdropFilter: glass ? "blur(20px)" : undefined,
          WebkitBackdropFilter: glass ? "blur(20px)" : undefined,
          height: detent === "full" ? "86%" : undefined,
          transform: dismissing ? "translateY(100%)" : dragging ? "translateY(6%)" : "translateY(0)",
        }}
      >
        <div className="mx-auto mb-2 h-[3px] w-11 rounded-full" style={{ backgroundColor: handle }} />
        <div className="text-[14px] font-semibold" style={{ color: title }}>
          Add to collection
        </div>
        <div className="mt-1">
          {rows.map((row, i) => (
            <div
              key={row}
              className="flex items-center justify-between py-2 text-[12px]"
              style={{ color: rowText, borderTop: i === 0 ? undefined : `1px solid ${divider}` }}
            >
              <span>{row}</span>
              <span style={{ color: dark ? "#94A3B8" : "#99A1AF" }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">{children}</span>;
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
