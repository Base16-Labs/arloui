"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type Appearance = "filled" | "plain";
type Size = "sm" | "md";
type IconLayout = "none" | "leading" | "trailing" | "both";
type Content = "empty" | "filled" | "long";

type PlaygroundProps = {
  states: readonly string[];
};

export function TextAreaDocPlayground({ states }: PlaygroundProps) {
  const [appearance, setAppearance] = useState<Appearance>("filled");
  const [size, setSize] = useState<Size>("md");
  const [icons, setIcons] = useState<IconLayout>("none");
  const [content, setContent] = useState<Content>("filled");
  const [count, setCount] = useState("on");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const docState = pinned ?? hovered ?? "helper";

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        One multiline field, controlled by appearance, slots, validation, and
        count states. The same variants are available in the native playground.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,300px)] md:items-start">
        <div className="min-w-0 space-y-7 md:order-1">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
            <ControlLabel>Appearance</ControlLabel>
            <ChipRow
              values={["filled", "plain"]}
              value={appearance}
              onChange={(next) => setAppearance(next as Appearance)}
            />
            <ControlLabel>Size</ControlLabel>
            <ChipRow values={["sm", "md"]} value={size} onChange={(next) => setSize(next as Size)} />
            <ControlLabel>Icons</ControlLabel>
            <ChipRow
              values={["none", "leading", "trailing", "both"]}
              value={icons}
              onChange={(next) => setIcons(next as IconLayout)}
            />
            <ControlLabel>Content</ControlLabel>
            <ChipRow
              values={["empty", "filled", "long"]}
              value={content}
              onChange={(next) => setContent(next as Content)}
            />
            <ControlLabel>Count</ControlLabel>
            <ChipRow values={["off", "on"]} value={count} onChange={setCount} />
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
            <div className="flex min-h-[230px] items-center justify-center rounded-xl border border-line-strong bg-[#f8f6ef] p-6 dark:bg-surface-raised">
              <TextAreaStateSample
                appearance={appearance}
                size={size}
                icons={icons}
                content={content}
                state={docState}
                count={count === "on"}
              />
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
          {item === "plain" ? "no bg" : item}
        </Chip>
      ))}
    </div>
  );
}

function TextAreaStateSample({
  appearance,
  size,
  icons,
  content,
  state,
  count,
}: {
  appearance: Appearance;
  size: Size;
  icons: IconLayout;
  content: Content;
  state: string;
  count: boolean;
}) {
  const isPlain = appearance === "plain";
  const isError = state === "error";
  const isDisabled = state === "disabled";
  const isFocused = state === "focused";
  const showHelper = state === "helper" || isError;
  const showLeading = icons === "leading" || icons === "both" || state === "leading icon";
  const showTrailing = icons === "trailing" || icons === "both" || state === "trailing icon";
  const darkMode = state === "dark mode";
  const long = content === "long" || state === "long content";
  const empty = content === "empty" || state === "empty";
  const value = empty
    ? ""
    : long
      ? "Arlo UI components should feel native, quiet, and easy to copy into a real app."
      : "This is a calm place to write longer content.";

  return (
    <div className={cn("w-full max-w-[360px] rounded-xl p-5", darkMode && "bg-[#09090B]")}>
      <div className={cn("space-y-2", isDisabled && "opacity-45")}>
        {!isPlain ? (
          <div className={cn("text-[12px] font-medium leading-4", isError ? "text-[#FB2C36]" : darkMode ? "text-[#9AA4B2]" : "text-[#65758B]")}>
            Message
          </div>
        ) : null}
        <div
          className={cn(
            "flex flex-col items-stretch gap-2",
            isPlain
              ? size === "md"
                ? "min-h-[118px]"
                : "min-h-[86px]"
              : "min-h-24 rounded-[16px] px-3 py-3",
            !isPlain && (darkMode ? "bg-[#101828]" : "bg-[#F3F4F6]"),
            !isPlain && isError && "ring-1 ring-[#FB2C36]",
          )}
        >
          <p
            className={cn(
              "min-w-0 flex-1 whitespace-pre-wrap",
              size === "md" ? "text-[14px] leading-5" : "text-[12px] leading-4",
              empty ? "text-[#99A1AF]" : darkMode ? "text-[#E5E7EB]" : "text-[#364153]",
            )}
          >
            {value || "Write a message"}
            {isFocused ? <span className="ml-0.5 text-[#155DFC]">|</span> : null}
          </p>
          {showLeading || showTrailing ? (
            <div className="flex items-center justify-end gap-1">
              {showLeading ? <MicButtonGlyph dark={darkMode} /> : null}
              {showTrailing ? <SendButtonGlyph /> : null}
            </div>
          ) : null}
        </div>

        {(showHelper || count) ? (
          <div
            className={cn(
              "flex items-center justify-between gap-3 text-[11px] leading-4",
              isError ? "text-[#FB2C36]" : darkMode ? "text-[#94A3B8]" : "text-[#65758B]",
            )}
          >
            <div className="flex min-w-0 items-center gap-1">
              {showHelper ? <InfoGlyph className="size-[13px] shrink-0" /> : null}
              {showHelper ? <span className="truncate">{isError ? "Message is required" : "Helper text"}</span> : null}
            </div>
            {count ? <span className="shrink-0 tabular-nums">{value.length}/200</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MicButtonGlyph({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        dark ? "bg-[#1E2939] text-[#99A1AF]" : "bg-[#E5E7EBB2] text-[#6A7282]",
      )}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M12 16.125c1.19 0 2.34-.48 3.18-1.32a4.53 4.53 0 0 0 1.32-3.18v-6c0-1.2-.47-2.34-1.32-3.19A4.5 4.5 0 0 0 12 1.125c-1.19 0-2.34.47-3.18 1.31-.85.85-1.32 1.99-1.32 3.19v6c0 1.19.48 2.33 1.32 3.18.84.84 1.99 1.32 3.18 1.32m-3-10.5c0-.8.32-1.56.88-2.13.56-.56 1.32-.87 2.12-.87s1.56.31 2.12.87c.56.57.88 1.33.88 2.13v6c0 .79-.32 1.55-.88 2.12a2.997 2.997 0 0 1-4.24 0c-.56-.57-.88-1.33-.88-2.12zm3.75 13.46v3.04a.75.75 0 0 1-1.5 0v-3.04a7.56 7.56 0 0 1-4.81-2.43 7.5 7.5 0 0 1-1.94-5.03.75.75 0 0 1 1.5 0 6.012 6.012 0 0 0 6 6 6.01 6.01 0 0 0 6-6 .75.75 0 0 1 1.5 0c0 1.85-.69 3.65-1.94 5.03a7.56 7.56 0 0 1-4.81 2.43" />
      </svg>
    </span>
  );
}

function SendButtonGlyph() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#155DFC] text-white">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M19.28 11.03a.74.74 0 0 1-.53.22.735.735 0 0 1-.53-.22l-5.47-5.47v14.69a.751.751 0 0 1-1.5 0V5.56l-5.47 5.47a.745.745 0 0 1-1.06 0 .75.75 0 0 1 0-1.06l6.75-6.75a.8.8 0 0 1 .24-.163.77.77 0 0 1 .58 0q.135.058.24.163l6.75 6.75c.07.07.13.152.16.243a.7.7 0 0 1 0 .575.6.6 0 0 1-.16.242" />
      </svg>
    </span>
  );
}

function InfoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.253a9.76 9.76 0 0 0-5.417 1.64 9.74 9.74 0 0 0-4.146 10.01 9.74 9.74 0 0 0 2.67 4.99 9.8 9.8 0 0 0 4.991 2.67c1.891.37 3.852.18 5.633-.56a9.66 9.66 0 0 0 4.376-3.59 9.74 9.74 0 0 0-1.216-12.31 9.77 9.77 0 0 0-6.89-2.85m0 18a8.3 8.3 0 0 1-4.583-1.39 8.27 8.27 0 0 1-3.039-3.71 8.2 8.2 0 0 1-.469-4.76 8.3 8.3 0 0 1 2.257-4.23 8.3 8.3 0 0 1 4.225-2.26c1.6-.31 3.26-.15 4.766.47a8.33 8.33 0 0 1 3.703 3.04 8.26 8.26 0 0 1 1.39 4.59 8.27 8.27 0 0 1-2.419 5.83 8.32 8.32 0 0 1-5.83 2.42m1.5-3.75a.751.751 0 0 1-.75.75c-.398 0-.779-.16-1.06-.44a1.5 1.5 0 0 1-.44-1.06v-3.75a.751.751 0 0 1 0-1.5c.398 0 .78.15 1.061.44.281.28.44.66.44 1.06v3.75c.198 0 .39.07.53.22.14.14.22.33.22.53m-3-8.63c0-.22.066-.44.19-.62.123-.19.3-.33.504-.42.206-.08.432-.11.65-.06.22.04.42.15.576.31.158.15.265.35.308.57.044.22.022.45-.064.65-.085.21-.229.38-.414.51-.185.12-.402.19-.625.19a1.127 1.127 0 0 1-1.125-1.13" />
    </svg>
  );
}
