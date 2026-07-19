"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";

function BadgePill({
  label,
  tone,
  appearance,
  dot,
  dark,
}: {
  label?: string;
  tone: string;
  appearance: string;
  dot?: boolean;
  dark: boolean;
}) {
  const toneColors: Record<string, { soft: { bg: string; fg: string }; solid: { bg: string; fg: string }; outline: { fg: string; border: string } }> = {
    neutral: {
      soft: { bg: dark ? "#262b36" : "#F3F4F6", fg: dark ? "#99A1AF" : "#6A7282" },
      solid: { bg: dark ? "#6A7282" : "#6A7282", fg: "#FFFFFF" },
      outline: { fg: dark ? "#99A1AF" : "#6A7282", border: dark ? "#364153" : "#D1D5DC" },
    },
    info: {
      soft: { bg: dark ? "#1e2a44" : "#EFF6FF", fg: dark ? "#93C5FD" : "#155DFC" },
      solid: { bg: "#155DFC", fg: "#FFFFFF" },
      outline: { fg: dark ? "#93C5FD" : "#155DFC", border: dark ? "#3B82F6" : "#155DFC" },
    },
    success: {
      soft: { bg: dark ? "#132e1b" : "#ECFDF5", fg: dark ? "#4ADE80" : "#00C950" },
      solid: { bg: "#00C950", fg: "#FFFFFF" },
      outline: { fg: dark ? "#4ADE80" : "#00C950", border: dark ? "#22C55E" : "#00C950" },
    },
    warning: {
      soft: { bg: dark ? "#3d2a0e" : "#FFFBEB", fg: dark ? "#FACC15" : "#F59E0B" },
      solid: { bg: "#F59E0B", fg: "#FFFFFF" },
      outline: { fg: dark ? "#FACC15" : "#F59E0B", border: dark ? "#EAB308" : "#F59E0B" },
    },
    error: {
      soft: { bg: dark ? "#3a1517" : "#FEF2F2", fg: dark ? "#F87171" : "#FB2C36" },
      solid: { bg: "#FB2C36", fg: "#FFFFFF" },
      outline: { fg: dark ? "#F87171" : "#FB2C36", border: dark ? "#EF4444" : "#FB2C36" },
    },
  };

  const colors = toneColors[tone] ?? toneColors.neutral;

  const style: React.CSSProperties =
    appearance === "solid"
      ? { backgroundColor: colors.solid.bg, color: colors.solid.fg }
      : appearance === "outline"
        ? {
            backgroundColor: "transparent",
            color: colors.outline.fg,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: colors.outline.border,
          }
        : { backgroundColor: colors.soft.bg, color: colors.soft.fg };

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 text-[11px] font-normal leading-none"
      style={{ height: 24, ...style }}
    >
      {dot && (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: appearance === "solid" ? colors.solid.fg : colors.soft.fg }}
        />
      )}
      {label}
    </span>
  );
}

export function BadgePhonePreview() {
  const { resolved } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolved === "dark";

  const screenBg = dark ? "#0c0c0e" : "#f4f4f2";
  const cardBg = dark ? "#1a1d24" : "#ffffff";
  const textPrimary = dark ? "#E5E7EB" : "#101828";
  const textSecondary = dark ? "#99A1AF" : "#6A7282";

  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <div
          className="flex h-full flex-col items-center justify-center gap-5 px-4"
          style={{ backgroundColor: screenBg }}
        >
          {/* Soft row */}
          <div className="w-full space-y-2">
            <span className="block text-[9px] font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Soft
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["neutral", "info", "success", "warning", "error"].map((t) => (
                <BadgePill key={t} label={t} tone={t} appearance="soft" dark={dark} />
              ))}
            </div>
          </div>

          {/* Solid row */}
          <div className="w-full space-y-2">
            <span className="block text-[9px] font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Solid
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["neutral", "info", "success", "warning", "error"].map((t) => (
                <BadgePill key={t} label={t} tone={t} appearance="solid" dark={dark} />
              ))}
            </div>
          </div>

          {/* Outline row */}
          <div className="w-full space-y-2">
            <span className="block text-[9px] font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Outline
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["neutral", "info", "success", "warning", "error"].map((t) => (
                <BadgePill key={t} label={t} tone={t} appearance="outline" dark={dark} />
              ))}
            </div>
          </div>

          {/* Dot row */}
          <div className="w-full space-y-2">
            <span className="block text-[9px] font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Dot
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["info", "success", "error"].map((t) => (
                <BadgePill key={t} label={t} tone={t} appearance="soft" dot dark={dark} />
              ))}
            </div>
          </div>
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}
