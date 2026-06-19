"use client";

import { useState } from "react";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";
import { PreviewThemeToggle } from "@/components/docs/preview-theme-toggle";

export function InputPhonePreview() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const dark = mode === "dark";

  return (
    <PreviewCard className="mb-12">
      <PreviewThemeToggle mode={mode} onChange={setMode} />
      <PhoneFrame>
        <div
          className="flex h-full flex-col justify-center gap-6 overflow-hidden px-5 py-8"
          style={{ backgroundColor: dark ? "#09090B" : "#F9FAFB" }}
        >
          <div className="space-y-3">
            <InputPreviewRow dark={dark} label="Name" value="Allan Thomas" />
            <InputPreviewRow
              dark={dark}
              label="Password"
              value="••••••••"
              icon="eye"
              state="error"
              helper="Incorrect password"
            />
            <div className="flex flex-col items-center gap-8 pt-3">
              <InputPreviewRow dark={dark} appearance="plain" value="Content" helper="Helper text" />
              <InputPreviewRow
                dark={dark}
                appearance="plain"
                value="••••••••"
                icon="eye"
                helper="Helper text"
              />
            </div>
          </div>
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}

function InputPreviewRow({
  dark = false,
  appearance = "filled",
  label,
  value,
  icon,
  helper,
  state,
  focused = false,
  disabled = false,
}: {
  dark?: boolean;
  appearance?: "filled" | "plain";
  label?: string;
  value: string;
  icon?: "copy" | "eye" | "mail";
  helper?: string;
  state?: "error";
  focused?: boolean;
  disabled?: boolean;
}) {
  const isPlain = appearance === "plain";
  const fieldBg = dark ? "#1f2937" : "#F3F4F6";
  const valueColor =
    isPlain
        ? dark ? "#D1D5DC" : "#364153"
        : dark ? "#E5E7EB" : "#364153";
  const labelColor = state === "error" ? "#FB2C36" : dark ? "#9AA4B2" : "#99A1AF";
  const iconColor =
    isPlain ? dark ? "#65758B" : "#6A7282" : dark ? "#9AA4B2" : "#6A7282";
  const helperColor =
    state === "error" ? "#FB2C36" : isPlain ? dark ? "#65758B" : "#6A7282" : dark ? "#94A3B8" : "#65758B";
  const iconClassName = `${isPlain ? "size-5" : "size-4"} shrink-0 ${disabled ? "opacity-35" : ""}`;

  return (
    <div className={isPlain ? "inline-flex min-w-0 flex-col items-center" : "space-y-1.5"}>
      <div
        className={
          isPlain
            ? "flex min-w-[160px] items-center justify-center gap-1 bg-transparent"
            : `flex min-h-[52px] items-center gap-2 rounded-md px-3 py-2 ${
                state === "error" ? "ring-1 ring-[#FB2C36]" : ""
              }`
        }
        style={isPlain ? undefined : { backgroundColor: fieldBg }}
      >
        {icon === "mail" ? <MailGlyph className={iconClassName} style={{ color: iconColor }} /> : null}
        <div className={isPlain ? "min-w-0 flex-none" : "min-w-0 flex-1"}>
          {label ? (
            <div className="text-[11px] leading-4" style={{ color: labelColor }}>
              {label}
            </div>
          ) : null}
          <div
            className={`truncate ${
              isPlain ? "text-center text-[28px] font-medium leading-[35px]" : "text-[14px] font-medium leading-5"
            } ${disabled ? "opacity-35" : ""}`}
            style={{ color: valueColor }}
          >
            {value}
            {focused ? <span className="ml-0.5 text-[#155DFC]">|</span> : null}
          </div>
        </div>
        {icon === "copy" ? (
          <CopyGlyph className={iconClassName} style={{ color: iconColor }} />
        ) : null}
        {icon === "eye" ? (
          <EyeOffGlyph className={iconClassName} style={{ color: iconColor }} />
        ) : null}
      </div>
      {helper ? (
        <div
          className={`mt-1 flex items-center gap-1 text-[11px] leading-4 ${
            isPlain ? "justify-center" : ""
          }`}
          style={{ color: helperColor }}
        >
          <InfoGlyph className="size-[13px] shrink-0" />
          <span>{helper}</span>
        </div>
      ) : null}
    </div>
  );
}

function CopyGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M8 8h10v10H8z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 15V5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 512 512" fill="none" className={className} style={style} aria-hidden="true">
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

function MailGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
