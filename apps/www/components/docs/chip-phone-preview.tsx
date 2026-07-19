"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";

function ChipPill({
  label,
  selected,
  dark,
  showCheck,
  showRemove,
}: {
  label: string;
  selected?: boolean;
  dark: boolean;
  showCheck?: boolean;
  showRemove?: boolean;
}) {
  const bg = selected
    ? dark ? "#1e2a44" : "#EFF6FF"
    : dark ? "#262b36" : "transparent";
  const fg = selected
    ? dark ? "#93C5FD" : "#155DFC"
    : dark ? "#E5E7EB" : "#101828";
  const border = selected
    ? dark ? "#3B82F6" : "#155DFC"
    : dark ? "#364153" : "#D1D5DC";

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full text-[12px] font-normal leading-none"
      style={{
        height: 32,
        paddingLeft: 12,
        paddingRight: showRemove ? 4 : 12,
        backgroundColor: bg,
        color: fg,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: border,
      }}
    >
      {showCheck && selected && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7.5L5.5 10L11 4" stroke={fg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {label}
      {showRemove && (
        <span
          className="ml-0.5 flex size-6 items-center justify-center rounded-full"
          style={{ color: fg }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  );
}

export function ChipPhonePreview() {
  const { resolved } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolved === "dark";

  const screenBg = dark ? "#0c0c0e" : "#f4f4f2";
  const textSecondary = dark ? "#99A1AF" : "#6A7282";

  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <div
          className="flex h-full flex-col items-center justify-center gap-6 px-4"
          style={{ backgroundColor: screenBg }}
        >
          {/* Filter chips */}
          <div className="w-full space-y-2">
            <span className="block text-[9px] font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Filter
            </span>
            <div className="flex flex-wrap gap-1.5">
              <ChipPill label="All" selected dark={dark} showCheck />
              <ChipPill label="Active" selected dark={dark} showCheck />
              <ChipPill label="Archived" dark={dark} showCheck />
              <ChipPill label="Draft" dark={dark} showCheck />
            </div>
          </div>

          {/* Input chips */}
          <div className="w-full space-y-2">
            <span className="block text-[9px] font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Input
            </span>
            <div className="flex flex-wrap gap-1.5">
              <ChipPill label="React Native" dark={dark} showRemove />
              <ChipPill label="TypeScript" dark={dark} showRemove />
              <ChipPill label="Expo" dark={dark} showRemove />
            </div>
          </div>

          {/* Assist chips */}
          <div className="w-full space-y-2">
            <span className="block text-[9px] font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Assist
            </span>
            <div className="flex flex-wrap gap-1.5">
              <ChipPill label="Share" dark={dark} />
              <ChipPill label="Export" dark={dark} />
              <ChipPill label="Duplicate" dark={dark} />
            </div>
          </div>
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}
