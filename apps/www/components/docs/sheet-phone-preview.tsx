"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";

export function SheetPhonePreview() {
  const { resolved } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolved === "dark";

  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <div
          className="relative h-full overflow-hidden"
          style={{ backgroundColor: dark ? "#09090B" : "#F9FAFB" }}
        >
          {/* Background content — stays visible around a pass-through glass sheet. */}
          <div className="px-5 pt-8">
            <div className="text-[13px] font-semibold" style={{ color: dark ? "#E5E7EB" : "#18181B" }}>
              Library
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["#2B7FFF", "#00C950", "#E17100", "#FB2C36"].map((c, i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl"
                  style={{ backgroundColor: c, opacity: dark ? 0.5 : 0.28 }}
                />
              ))}
            </div>
          </div>

          {/* Liquid-glass sheet (pass-through — no dimming scrim). */}
          <div className="absolute inset-x-0 bottom-0">
            <div
              className="rounded-t-[24px] border-x border-t px-5 pb-8 pt-2 shadow-xl"
              style={{
                backgroundColor: dark ? "rgba(16,24,40,0.72)" : "rgba(255,255,255,0.72)",
                borderColor: dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.64)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div
                className="mx-auto mb-3 h-[5px] w-10 rounded-full"
                style={{ backgroundColor: dark ? "#364153" : "#D1D5DC" }}
              />
              <div className="text-[17px] font-semibold" style={{ color: dark ? "#F9FAFB" : "#101828" }}>
                Add to collection
              </div>
              <div className="mt-3 space-y-1">
                {["Recently added", "Favorites", "Shared with you"].map((row, i) => (
                  <div
                    key={row}
                    className="flex items-center justify-between py-2.5 text-[14px]"
                    style={{
                      color: dark ? "#E5E7EB" : "#364153",
                      borderTop: i === 0 ? undefined : `1px solid ${dark ? "#1E2939" : "#F3F4F6"}`,
                    }}
                  >
                    <span>{row}</span>
                    <span style={{ color: dark ? "#94A3B8" : "#99A1AF" }}>›</span>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 flex h-11 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                style={{ backgroundColor: "#155DFC" }}
              >
                Done
              </div>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}
