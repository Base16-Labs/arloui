"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type Appearance = "filled" | "plain";
type Size = "sm" | "md";
type IconLayout = "none" | "leading" | "trailing" | "both";
type LabelMode = "none" | "inset";
type Content = "empty" | "filled" | "password";

type PlaygroundProps = {
  states: readonly string[];
};

export function InputDocPlayground({ states }: PlaygroundProps) {
  const [appearance, setAppearance] = useState<Appearance>("filled");
  const [size, setSize] = useState<Size>("md");
  const [icons, setIcons] = useState<IconLayout>("trailing");
  const [labelMode, setLabelMode] = useState<LabelMode>("inset");
  const [content, setContent] = useState<Content>("filled");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const docState = pinned ?? hovered ?? "default";

  return (
    <>
      <section id="variants" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
        <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
          Appearance × label × size × slots, all token-driven in the registry.
          Pick a variant and hover or pin a state — the sample updates live
          beside the controls.
        </p>
        <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,280px)] md:items-start">
          <div className="min-w-0 space-y-7 md:order-1">
            <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
          <ControlLabel>Appearance</ControlLabel>
          <ChipRow
            values={["filled", "plain"]}
            value={appearance}
            onChange={(next) => setAppearance(next as Appearance)}
          />
          <ControlLabel>Label</ControlLabel>
          <ChipRow
            values={["none", "inset"]}
            value={labelMode}
            onChange={(next) => setLabelMode(next as LabelMode)}
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
            values={["empty", "filled", "password"]}
            value={content}
            onChange={(next) => setContent(next as Content)}
          />
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

          <div className="order-first md:order-2 md:self-center">
            <div className="sticky top-3">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-line-strong bg-surface-sunken p-6 dark:bg-surface-raised">
                <InputStateSample
                  appearance={appearance}
                  size={size}
                  icons={icons}
                  labelMode={labelMode}
                  content={content}
                  state={docState}
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
    </>
  );
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
      {children}
    </span>
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
          {item === "plain" ? "no bg" : item}
        </Chip>
      ))}
    </div>
  );
}

function InputStateSample({
  appearance,
  size,
  icons,
  labelMode,
  content,
  state,
}: {
  appearance: Appearance;
  size: Size;
  icons: IconLayout;
  labelMode: LabelMode;
  content: Content;
  state: string;
}) {
  const isPlain = appearance === "plain";
  const isError = state === "error";
  const isDisabled = state === "disabled";
  const isFocused = state === "focused";
  const showHelper = state === "helper" || isError;
  const isPassword = content === "password" || state === "password";
  const isEmpty = content === "empty" || state === "empty";
  const showLeading = icons === "leading" || icons === "both" || state === "leading icon";
  const showTrailing =
    icons === "trailing" ||
    icons === "both" ||
    state === "trailing action" ||
    isPassword;
  const inset = labelMode === "inset";
  const dynamicType = state === "dynamic type";
  const darkMode = state === "dark mode";
  const fieldLabel = isPassword ? "Password" : "Username";
  const fieldValue = isEmpty ? "" : isPassword ? "••••••••" : "@allanthomas";
  const placeholder = isPassword ? "Password" : "Username";
  const iconClassName = cn(isPlain && size === "md" ? "size-5" : "size-4", "shrink-0");

  return (
    <div
      className={cn(
        "w-full max-w-[360px] rounded-xl p-5",
        darkMode ? "bg-[#09090B]" : "bg-transparent",
      )}
    >
      <div className={cn("space-y-2", dynamicType && "scale-110 transform-gpu")}>
        <div
          className={cn(
            "flex items-center gap-2",
            isPlain
              ? "min-h-0 min-w-[160px] justify-center"
              : size === "md"
                ? "min-h-[52px]"
                : "min-h-9",
            isPlain
              ? "bg-transparent"
              : "rounded-md bg-[#F3F4F6] px-3 py-2",
            !isPlain && isError && "ring-1 ring-[#FB2C36]",
            isDisabled && "opacity-45",
          )}
        >
          {showLeading ? <MailGlyph className={cn(iconClassName, iconTone(isPlain, isError, darkMode))} /> : null}
          <div className={isPlain ? "min-w-0 flex-none" : "min-w-0 flex-1"}>
            {inset ? (
              <div className={cn("text-[11px] leading-4", labelTone(isPlain, isError, darkMode))}>
                {fieldLabel}
              </div>
            ) : null}
            <div
              className={cn(
                "truncate font-medium",
                isPlain
                  ? size === "md"
                    ? "text-center text-[28px] leading-[35px]"
                    : "text-center text-[20px] leading-[26px]"
                  : size === "md"
                    ? "text-[14px] leading-5"
                    : "text-[12px] leading-4",
                textTone(isPlain, isError, isEmpty, darkMode),
              )}
            >
              {fieldValue || placeholder}
              {isFocused ? <span className="ml-0.5 text-[#155DFC]">|</span> : null}
            </div>
          </div>
          {showTrailing ? (
            isPassword ? (
              <EyeOffGlyph className={cn(iconClassName, iconTone(isPlain, isError, darkMode))} />
            ) : (
              <CopyGlyph className={cn(iconClassName, iconTone(isPlain, isError, darkMode))} />
            )
          ) : null}
        </div>
        {showHelper ? (
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] leading-4",
              isPlain && "justify-center",
              helperTone(isError, isPlain, darkMode),
            )}
          >
            <InfoGlyph className="size-[13px] shrink-0" />
            <span>{isError ? "Username taken" : "Helper text"}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function labelTone(isPlain: boolean, isError: boolean, darkMode: boolean) {
  if (isError) return "text-[#FB2C36]";
  if (isPlain) return darkMode ? "text-[#65758B]" : "text-[#6A7282]";
  return "text-[#99A1AF]";
}

function textTone(isPlain: boolean, isError: boolean, isEmpty: boolean, darkMode: boolean) {
  if (isEmpty) return "text-[#D1D5DC]";
  return isPlain && darkMode ? "text-[#D1D5DC]" : "text-[#364153]";
}

function helperTone(isError: boolean, isPlain: boolean, darkMode: boolean) {
  if (isError) return "text-[#FB2C36]";
  return isPlain && darkMode ? "text-[#65758B]" : "text-[#6A7282]";
}

function iconTone(isPlain: boolean, isError: boolean, darkMode: boolean) {
  return isPlain && darkMode ? "text-[#65758B]" : "text-[#6A7282]";
}

function CopyGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 8h10v10H8z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 15V5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" fill="none" className={className} aria-hidden="true">
      <path
        d="M432 448 64 80"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M255.66 384c-41.49-.11-81.5-13-115.67-35.38-34.86-22.82-64.65-56.78-85.99-92.62a.14.14 0 0 1 0-.14c21.34-35.84 51.13-69.8 85.99-92.62a213.94 213.94 0 0 1 38.28-19.49"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M221.92 131.81A213.14 213.14 0 0 1 256 128c41.49.11 81.5 13 115.67 35.38 34.86 22.82 64.65 56.78 85.99 92.62a.14.14 0 0 1 0 .14c-12.93 21.72-28.96 42.78-47.31 61.18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M302.38 302.38A64 64 0 0 1 209.62 209.62"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M256 192a64 64 0 0 1 64 64"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
}

function InfoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.253a9.76 9.76 0 0 0-5.417 1.64 9.74 9.74 0 0 0-4.146 10.01 9.74 9.74 0 0 0 2.67 4.99 9.8 9.8 0 0 0 4.991 2.67c1.891.37 3.852.18 5.633-.56a9.66 9.66 0 0 0 4.376-3.59 9.74 9.74 0 0 0-1.216-12.31 9.77 9.77 0 0 0-6.89-2.85m0 18a8.3 8.3 0 0 1-4.583-1.39 8.27 8.27 0 0 1-3.039-3.71 8.2 8.2 0 0 1-.469-4.76 8.3 8.3 0 0 1 2.257-4.23 8.3 8.3 0 0 1 4.225-2.26c1.6-.31 3.26-.15 4.766.47a8.33 8.33 0 0 1 3.703 3.04 8.26 8.26 0 0 1 1.39 4.59 8.27 8.27 0 0 1-2.419 5.83 8.32 8.32 0 0 1-5.83 2.42m1.5-3.75a.751.751 0 0 1-.75.75c-.398 0-.779-.16-1.06-.44a1.5 1.5 0 0 1-.44-1.06v-3.75a.751.751 0 0 1 0-1.5c.398 0 .78.15 1.061.44.281.28.44.66.44 1.06v3.75c.198 0 .39.07.53.22.14.14.22.33.22.53m-3-8.63c0-.22.066-.44.19-.62.123-.19.3-.33.504-.42.206-.08.432-.11.65-.06.22.04.42.15.576.31.158.15.265.35.308.57.044.22.022.45-.064.65-.085.21-.229.38-.414.51-.185.12-.402.19-.625.19a1.127 1.127 0 0 1-1.125-1.13"
      />
    </svg>
  );
}

function MailGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
