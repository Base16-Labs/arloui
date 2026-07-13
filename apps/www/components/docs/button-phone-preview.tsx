"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/theme";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";
import {
  DocAppleMark,
  DocFacebookMark,
  DocGoogleMark,
  DocIconArrowRight,
  DocIconLock,
  DocXMark,
  pillRowClass,
} from "@/components/docs/button-preview-icons";

export function ButtonPhonePreview() {
  const { resolved } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolved === "dark";

  const screenBg = dark ? "#0c0c0e" : "#f4f4f2";
  const soft = dark ? { bg: "#262b36", fg: "#E5E7EB" } : { bg: "#F3F4F6", fg: "#364153" };
  const outline = dark ? { border: "#3B82F6", fg: "#93C5FD" } : { border: "#155DFC", fg: "#155DFC" };
  const google = dark
    ? { bg: "#1b1f27", border: "#333a47", fg: "#E5E7EB" }
    : { bg: "#ffffff", border: "#DADCE0", fg: "#1F1F1F" };
  const xPill = dark ? { bg: "#0c0c0e", border: "#2a2f3a" } : { bg: "#000000", border: "transparent" };
  const apple = dark ? { bg: "#ffffff", fg: "#000000" } : { bg: "#000000", fg: "#ffffff" };
  const divider = dark ? "border-white/10" : "border-black/5";

  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <div
          className="relative flex h-full flex-col items-center overflow-y-auto px-4 py-5"
          style={{ backgroundColor: screenBg }}
        >
          <div className="flex w-full max-w-[240px] flex-col items-center gap-3">
            <div className="flex w-full flex-col items-center gap-2">
              <button
                type="button"
                className={`${pillRowClass()} text-white shadow-sm`}
                style={{ backgroundColor: "#155DFC" }}
              >
                <DocIconLock className="size-[18px] shrink-0 opacity-95" />
                <span className="whitespace-nowrap">Button</span>
                <DocIconArrowRight className="size-[18px] shrink-0 opacity-95" />
              </button>
              <button
                type="button"
                className={pillRowClass()}
                style={{ backgroundColor: soft.bg, color: soft.fg }}
              >
                <DocIconLock className="size-[18px] shrink-0" />
                <span className="whitespace-nowrap">Button</span>
                <DocIconArrowRight className="size-[18px] shrink-0" />
              </button>
              <button
                type="button"
                className={pillRowClass()}
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: outline.border,
                  color: outline.fg,
                }}
              >
                <DocIconLock className="size-[18px] shrink-0" />
                <span className="whitespace-nowrap">Button</span>
                <DocIconArrowRight className="size-[18px] shrink-0" />
              </button>
              <button
                type="button"
                className={`${pillRowClass()} text-white`}
                style={{ backgroundColor: "#FB2C36" }}
              >
                <DocIconLock className="size-[18px] shrink-0 opacity-95" />
                <span className="whitespace-nowrap">Button</span>
                <DocIconArrowRight className="size-[18px] shrink-0 opacity-95" />
              </button>
            </div>

            <div className="flex justify-center gap-2 pt-0.5">
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ backgroundColor: "#155DFC" }}
                aria-label="Icon only, primary"
              >
                <DocIconLock className="size-[18px]" />
              </button>
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: soft.bg, color: soft.fg }}
                aria-label="Icon only, neutral"
              >
                <DocIconLock className="size-[18px]" />
              </button>
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: outline.border,
                  color: outline.fg,
                }}
                aria-label="Icon only, outline"
              >
                <DocIconLock className="size-[18px]" />
              </button>
            </div>

            <div className={cn("flex w-full flex-col items-center gap-2 border-t pt-3", divider)}>
              <button
                type="button"
                className={pillRowClass()}
                style={{
                  backgroundColor: google.bg,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: google.border,
                  color: google.fg,
                }}
              >
                <DocGoogleMark className="size-[18px] shrink-0" />
                <span className="whitespace-nowrap">Continue with Google</span>
              </button>
              <button
                type="button"
                className={`${pillRowClass()} text-white`}
                style={{ backgroundColor: "#1877F2" }}
              >
                <DocFacebookMark className="size-[18px] shrink-0 text-white" />
                <span className="whitespace-nowrap">Continue with Facebook</span>
              </button>
              <button
                type="button"
                className={`${pillRowClass()} text-white`}
                style={{
                  backgroundColor: xPill.bg,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: xPill.border,
                }}
              >
                <DocXMark className="size-[18px] shrink-0 text-white" />
                <span className="whitespace-nowrap">Continue with X</span>
              </button>
              <button
                type="button"
                className={pillRowClass()}
                style={{ backgroundColor: apple.bg, color: apple.fg }}
              >
                <DocAppleMark className="size-[18px] shrink-0" />
                <span className="whitespace-nowrap">Continue with Apple</span>
              </button>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </PreviewCard>
  );
}
