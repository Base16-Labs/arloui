"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";

export function TextAreaPhonePreview() {
  const { resolved } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolved === "dark";

  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <div
          className="flex h-full flex-col justify-center gap-6 overflow-hidden px-5 py-8"
          style={{ backgroundColor: dark ? "#09090B" : "#F9FAFB" }}
        >
          <TextAreaPreviewRow
            dark={dark}
            label="Message"
            value="This is a calm place to write longer content."
            helper="Helper text"
            count="48/200"
          />
          <TextAreaPreviewRow
            dark={dark}
            label="Feedback"
            value=""
            helper="Feedback is required"
            count="0/200"
            state="error"
          />
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}

function TextAreaPreviewRow({
  dark = false,
  appearance = "filled",
  label,
  value,
  helper,
  count,
  state,
}: {
  dark?: boolean;
  appearance?: "filled" | "plain";
  label?: string;
  value: string;
  helper?: string;
  count?: string;
  state?: "error";
}) {
  const isPlain = appearance === "plain";
  const fieldBg = dark ? "#101828" : "#F3F4F6";
  const valueColor = dark ? "#E5E7EB" : "#364153";
  const labelColor = state === "error" ? "#FB2C36" : dark ? "#9AA4B2" : "#65758B";
  const helperColor = state === "error" ? "#FB2C36" : dark ? "#94A3B8" : "#65758B";
  const placeholder = label ?? "Message";

  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="text-[12px] font-medium leading-4" style={{ color: labelColor }}>
          {label}
        </div>
      ) : null}
      <div
        className={
          isPlain
            ? "min-h-[104px] bg-transparent"
            : `min-h-24 rounded-[16px] px-3 py-3 ${state === "error" ? "ring-1 ring-[#FB2C36]" : ""}`
        }
        style={isPlain ? undefined : { backgroundColor: fieldBg }}
      >
        <p
          className="whitespace-pre-wrap text-[14px] leading-5"
          style={{ color: value ? valueColor : dark ? "#4A5565" : "#99A1AF" }}
        >
          {value || placeholder}
        </p>
      </div>
      {(helper || count) ? (
        <div className="flex items-center justify-between gap-3 text-[11px] leading-4" style={{ color: helperColor }}>
          <div className="flex min-w-0 items-center gap-1">
            {helper ? <InfoGlyph className="size-[13px] shrink-0" /> : null}
            {helper ? <span className="truncate">{helper}</span> : null}
          </div>
          {count ? <span className="shrink-0 tabular-nums">{count}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

function InfoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.253a9.76 9.76 0 0 0-5.417 1.64 9.74 9.74 0 0 0-4.146 10.01 9.74 9.74 0 0 0 2.67 4.99 9.8 9.8 0 0 0 4.991 2.67c1.891.37 3.852.18 5.633-.56a9.66 9.66 0 0 0 4.376-3.59 9.74 9.74 0 0 0-1.216-12.31 9.77 9.77 0 0 0-6.89-2.85m0 18a8.3 8.3 0 0 1-4.583-1.39 8.27 8.27 0 0 1-3.039-3.71 8.2 8.2 0 0 1-.469-4.76 8.3 8.3 0 0 1 2.257-4.23 8.3 8.3 0 0 1 4.225-2.26c1.6-.31 3.26-.15 4.766.47a8.33 8.33 0 0 1 3.703 3.04 8.26 8.26 0 0 1 1.39 4.59 8.27 8.27 0 0 1-2.419 5.83 8.32 8.32 0 0 1-5.83 2.42m1.5-3.75a.751.751 0 0 1-.75.75c-.398 0-.779-.16-1.06-.44a1.5 1.5 0 0 1-.44-1.06v-3.75a.751.751 0 0 1 0-1.5c.398 0 .78.15 1.061.44.281.28.44.66.44 1.06v3.75c.198 0 .39.07.53.22.14.14.22.33.22.53m-3-8.63c0-.22.066-.44.19-.62.123-.19.3-.33.504-.42.206-.08.432-.11.65-.06.22.04.42.15.576.31.158.15.265.35.308.57.044.22.022.45-.064.65-.085.21-.229.38-.414.51-.185.12-.402.19-.625.19a1.127 1.127 0 0 1-1.125-1.13" />
    </svg>
  );
}
