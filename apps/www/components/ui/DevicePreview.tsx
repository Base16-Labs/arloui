"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/cn";
import snackMap from "@/lib/snack-map.json";

// Deep link that opens a Snack in Expo Go on the public Snack runtime (no
// per-user access check — anyone with Expo Go can open it).
const SNACK_RUNTIME =
  "exp://u.expo.dev/933fd9c0-1666-11e7-afca-d980795c5824?runtime-version=exposdk%3A54.0.0&channel-name=production&snack=";

type DevicePreviewProps = {
  /** Doc slug / Expo route, e.g. "button", "text-area". */
  route: string;
  caption?: string;
  className?: string;
};

/**
 * Opens the component's live Expo Snack playground in Expo Go — the real
 * apps/docs screen (variant controls, bottom pill, and all), running natively
 * with haptics. On desktop we show a QR to scan; on a phone you can't scan your
 * own screen, so we show a button that deep-links straight into Expo Go.
 */
export function DevicePreview({ route, className }: DevicePreviewProps) {
  const snackId = (snackMap as Record<string, string>)[route];
  if (!snackId) return null;

  const url = `${SNACK_RUNTIME}${snackId}`;

  return (
    <div className={cn("mb-12", className)}>
      {/* Desktop / tablet: scan the QR with a phone to open it in Expo Go. */}
      <div className="hidden flex-col items-center gap-5 rounded-2xl border border-line py-10 text-ink sm:flex">
        <QRCodeSVG
          value={url}
          size={180}
          bgColor="transparent"
          fgColor="currentColor"
          level="M"
          aria-label={`QR code to open the ${route} playground in Expo Go`}
        />
        <p className="font-mono text-[13px] tracking-tight text-ink-2">
          Scan to open the playground in Expo Go
        </p>
      </div>

      {/* Phone: tap to open the playground directly in Expo Go. */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line py-8 text-ink sm:hidden">
        <a
          href={url}
          className="flex h-11 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-canvas"
        >
          Open in Expo Go
        </a>
        <p className="max-w-[240px] text-center font-mono text-[12px] leading-relaxed text-ink-3">
          Runs natively with haptics. Requires the free Expo Go app.
        </p>
      </div>
    </div>
  );
}
