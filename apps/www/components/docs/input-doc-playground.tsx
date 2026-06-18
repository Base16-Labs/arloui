"use client";

import { useState } from "react";
import { StateGrid } from "@/components/mdx/StateGrid";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type Appearance = "filled" | "plain";
type Size = "md" | "lg";
type IconLayout = "none" | "leading" | "trailing" | "both";
type LabelMode = "none" | "above" | "inset";
type Content = "empty" | "filled" | "password";

type PlaygroundProps = {
  states: readonly string[];
};

export function InputDocPlayground({ states }: PlaygroundProps) {
  const [appearance, setAppearance] = useState<Appearance>("filled");
  const [size, setSize] = useState<Size>("lg");
  const [icons, setIcons] = useState<IconLayout>("trailing");
  const [labelMode, setLabelMode] = useState<LabelMode>("inset");
  const [content, setContent] = useState<Content>("filled");
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const docState = pinned ?? hovered ?? "default";

  return (
    <>
      <section id="variants" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">Variants</h2>
        <p className="mt-1.5 mb-5 text-[13px] text-ink-3">
          Appearance × label × size × slots. Tap to update the live sample in{" "}
          <strong className="font-medium">States</strong>.
        </p>
        <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
          <ControlLabel>Appearance</ControlLabel>
          <ChipRow
            values={["filled", "plain"]}
            value={appearance}
            onChange={(next) => setAppearance(next as Appearance)}
          />
          <ControlLabel>Label</ControlLabel>
          <ChipRow
            values={["none", "above", "inset"]}
            value={labelMode}
            onChange={(next) => setLabelMode(next as LabelMode)}
          />
          <ControlLabel>Size</ControlLabel>
          <ChipRow values={["md", "lg"]} value={size} onChange={(next) => setSize(next as Size)} />
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
      </section>

      <section id="states" className="border-t border-line py-9">
        <h2 className="text-[26px] font-semibold tracking-tight">States</h2>
        <p className="mt-1.5 mb-5 text-[13px] text-ink-3">
          Hover any cell to preview; click to pin. The sample reflects your
          variant picks and the active state.
        </p>
        <StateGrid states={[...states]} onHover={setHovered} onPin={setPinned} />
        <p className="mt-4 text-[12px] text-ink-3">
          Active:{" "}
          <span className="font-mono text-[11px] text-ink-2">
            {docState}
            {pinned ? " (pinned)" : ""}
          </span>
        </p>
        <div className="mt-5 flex min-h-[150px] items-center justify-center rounded-xl border border-line-strong bg-[#f8f6ef] p-6 dark:bg-surface-raised">
          <InputStateSample
            appearance={appearance}
            size={size}
            icons={icons}
            labelMode={labelMode}
            content={content}
            state={docState}
          />
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
  const isPlain = appearance === "plain" || state === "plain / no bg";
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
  const above = labelMode === "above";
  const dynamicType = state === "dynamic type";
  const darkMode = state === "dark mode";
  const fieldLabel = isPassword ? "Password" : "Username";
  const fieldValue = isEmpty ? "" : isPassword ? "••••••••" : "@allanthomas";
  const placeholder = isPassword ? "Password" : "Username";

  return (
    <div
      className={cn(
        "w-full max-w-[360px] rounded-xl p-5",
        darkMode ? "bg-[#09090B]" : isPlain ? "bg-[#09090B]" : "bg-white/45",
      )}
    >
      <div className={cn("space-y-2", dynamicType && "scale-110 transform-gpu")}>
        {above ? (
          <div
            className={cn(
              "text-[12px] font-semibold leading-4",
              isError ? "text-[#FB2C36]" : darkMode || isPlain ? "text-[#D1D5DC]" : "text-[#364153]",
            )}
          >
            {fieldLabel}
          </div>
        ) : null}
        <div
          className={cn(
            "flex items-center gap-2",
            size === "lg" ? "min-h-[54px]" : "min-h-11",
            isPlain
              ? "bg-transparent"
              : "rounded-md bg-[#F3F4F6] px-3.5",
            !isPlain && isFocused && "ring-1 ring-[#155DFC]",
            !isPlain && isError && "ring-1 ring-[#FB2C36]",
            isDisabled && "opacity-45",
          )}
        >
          {showLeading ? <MailGlyph className={cn("size-4 shrink-0", iconTone(isPlain, isError))} /> : null}
          <div className="min-w-0 flex-1">
            {inset ? (
              <div className={cn("text-[11px] leading-4", labelTone(isPlain, isError))}>
                {fieldLabel}
              </div>
            ) : null}
            <div
              className={cn(
                "truncate font-medium",
                size === "lg" ? "text-[15px] leading-5" : "text-[14px] leading-5",
                textTone(isPlain, isError, isEmpty),
              )}
            >
              {fieldValue || placeholder}
              {isFocused ? <span className="ml-0.5 text-[#155DFC]">|</span> : null}
            </div>
          </div>
          {showTrailing ? (
            isPassword ? (
              <EyeOffGlyph className={cn("size-4 shrink-0", iconTone(isPlain, isError))} />
            ) : (
              <CopyGlyph className={cn("size-4 shrink-0", iconTone(isPlain, isError))} />
            )
          ) : null}
        </div>
        {showHelper ? (
          <div className={cn("flex items-center gap-1 text-[11px] leading-4", helperTone(isError, isPlain))}>
            <span className="flex size-3 items-center justify-center rounded-full border border-current text-[8px] font-semibold">
              i
            </span>
            <span>{isError ? "Username taken" : "Helper text"}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function labelTone(isPlain: boolean, isError: boolean) {
  if (isError) return "text-[#FB2C36]";
  return isPlain ? "text-[#65758B]" : "text-[#99A1AF]";
}

function textTone(isPlain: boolean, isError: boolean, isEmpty: boolean) {
  if (isError) return "text-[#FB2C36]";
  if (isEmpty) return "text-[#D1D5DC]";
  return isPlain ? "text-[#D1D5DC]" : "text-[#364153]";
}

function helperTone(isError: boolean, isPlain: boolean) {
  if (isError) return "text-[#FB2C36]";
  return isPlain ? "text-[#65758B]" : "text-[#6A7282]";
}

function iconTone(isPlain: boolean, isError: boolean) {
  if (isError) return "text-[#FB2C36]";
  return isPlain ? "text-[#65758B]" : "text-[#6A7282]";
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 7.5C4.2 9 3 12 3 12s3 6 9 6c1.7 0 3.1-.5 4.3-1.1M10 6.2A9.8 9.8 0 0 1 12 6c6 0 9 6 9 6s-.7 1.5-2.1 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
