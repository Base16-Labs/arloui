"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";
import { ControlGlyph, type Control } from "@/components/docs/form-control-doc-playground";

export function FormControlPhonePreview({ control }: { control: Control }) {
  const { resolved } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolved === "dark";

  const cardBg = dark ? "#101828" : "#FFFFFF";
  const divider = dark ? "#1E2939" : "#F3F4F6";
  const title = dark ? "#E5E7EB" : "#18181B";
  const sub = dark ? "#94A3B8" : "#65758B";

  const heading =
    control === "toggle" ? "Settings" : control === "checkbox" ? "Preferences" : "Choose a plan";

  const rows =
    control === "toggle"
      ? [
          { label: "Notifications", desc: "Push alerts and reminders", on: true },
          { label: "Dark appearance", desc: "Match the system theme", on: false },
          { label: "Wi-Fi sync", desc: "Back up on wireless only", on: true },
          { label: "Location", desc: "Unavailable on this device", on: false, disabled: true },
        ]
      : control === "checkbox"
        ? [
            { label: "Product updates", desc: "New features and releases", on: true },
            { label: "Weekly digest", desc: "A summary every Monday", on: true },
            { label: "Promotions", desc: "Occasional offers", on: false },
            { label: "Partner emails", desc: "Turned off by your admin", on: false, disabled: true },
          ]
        : [
            { label: "Starter", desc: "For side projects", on: false },
            { label: "Pro", desc: "For growing teams", on: true },
            { label: "Enterprise", desc: "Custom limits and SSO", on: false },
          ];

  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <div
          className="flex h-full flex-col justify-center gap-4 overflow-hidden px-5 py-8"
          style={{ backgroundColor: dark ? "#09090B" : "#F9FAFB" }}
        >
          <div className="px-1 text-[13px] font-semibold" style={{ color: title }}>
            {heading}
          </div>
          <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: cardBg }}>
            {rows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  borderTop: i === 0 ? undefined : `1px solid ${divider}`,
                  opacity: row.disabled ? 0.45 : 1,
                }}
              >
                {control === "toggle" ? null : (
                  <ControlGlyph
                    control={control}
                    size="md"
                    on={row.on}
                    appearance="outlined"
                    dark={dark}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium leading-5" style={{ color: title }}>
                    {row.label}
                  </div>
                  <div className="text-[12px] leading-4" style={{ color: sub }}>
                    {row.desc}
                  </div>
                </div>
                {control === "toggle" ? (
                  <ControlGlyph control="toggle" size="md" on={row.on} dark={dark} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}
