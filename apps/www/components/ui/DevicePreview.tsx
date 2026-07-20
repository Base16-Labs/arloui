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
 * Opens the component's live Snack playground in Expo Go — the real apps/docs
 * screen (variant controls, bottom pill, and all), running natively with
 * haptics. We point at the Snack web URL rather than a raw exp:// deep link: a
 * cold deep link opens Expo Go before Snackager has built the Snack's font
 * packages for the device ("unable to fetch module …"), whereas opening the
 * Snack page builds them first and then hands off to Expo Go. Snacks run on
 * Expo's public runtime, so anyone can open them — no 403.
 */
export function DevicePreview({ route, className }: DevicePreviewProps) {
  const snackId = (snackMap as Record<string, string>)[route];
  if (!snackId) return null;

  const url = `https://snack.expo.dev/${snackId}`;

  return (
    <div className={cn("mb-12", className)}>
      {/* Desktop / tablet: scan to open the playground on a phone. */}
      <div className="hidden flex-col items-center gap-5 rounded-2xl border border-line py-10 text-ink sm:flex">
        <QRCodeSVG
          value={url}
          size={180}
          bgColor="transparent"
          fgColor="currentColor"
          level="M"
          aria-label={`QR code to open the ${route} playground`}
        />
        <p className="max-w-[280px] text-center font-mono text-[13px] leading-relaxed text-ink-2">
          Scan to open the playground, then tap{" "}
          <span className="text-ink">Run</span> to launch it in Expo Go
        </p>
      </div>

      {/* Phone: open the Snack, then launch it in Expo Go. */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line py-8 text-ink sm:hidden">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-canvas"
        >
          Open the playground
        </a>
        <p className="max-w-[250px] text-center font-mono text-[12px] leading-relaxed text-ink-3">
          Tap <span className="text-ink">Run</span> to launch it natively in Expo
          Go (with haptics). Requires the free Expo Go app.
        </p>
      </div>
    </div>
  );
}
