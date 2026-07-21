"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/cn";
import snackMap from "@/lib/snack-map.json";

type DevicePreviewProps = {
  /** Doc slug / Expo route, e.g. "button", "text-area". */
  route: string;
  caption?: string;
  className?: string;
};

/**
 * The component's live Snack playground — the real apps/docs screen (variant
 * controls, bottom pill, and all). Desktop: scan the QR to open it on a phone,
 * or click through to the playground in the browser. Mobile: tap to open the
 * Snack, then Run launches it natively in Expo Go (with haptics). Snacks run on
 * Expo's public runtime, so anyone can open them — no 403.
 */
export function DevicePreview({ route, className }: DevicePreviewProps) {
  const snackId = (snackMap as Record<string, string>)[route];
  if (!snackId) return null;

  const url = `https://snack.expo.dev/${snackId}`;

  return (
    <div className={cn("mb-12", className)}>
      {/* Desktop / tablet: scan with a phone, or open the playground here. */}
      <div className="hidden flex-col items-center gap-5 rounded-2xl border border-line py-10 text-ink sm:flex">
        <QRCodeSVG
          value={url}
          size={180}
          bgColor="transparent"
          fgColor="currentColor"
          level="M"
          aria-label={`QR code to open the ${route} playground`}
        />
        <p className="font-mono text-[13px] tracking-tight text-ink-2">
          Scan to open the playground on your phone
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-ink transition-colors hover:text-ink-2"
        >
          Open playground in your browser
          <span className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </a>
      </div>

      {/* Phone: open the Snack, then Run launches it in Expo Go. */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line py-8 text-ink sm:hidden">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-canvas"
        >
          Open the playground
          <span className="opacity-70">↗</span>
        </a>
        <p className="max-w-[250px] text-center font-mono text-[12px] leading-relaxed text-ink-3">
          Tap <span className="text-ink">Run</span> to launch it natively in Expo
          Go (with haptics). Requires the free Expo Go app.
        </p>
      </div>
    </div>
  );
}
