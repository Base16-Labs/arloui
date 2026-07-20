"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/cn";
import { devicePreviewUrl } from "@/lib/preview";
import { PreviewCard } from "@/components/ui/PhoneFrame";

type DevicePreviewProps = {
  /** Doc slug / Expo route to open, e.g. "button", "tab-bar". */
  route: string;
  /** Caption under the code. Defaults to "Scan to preview." */
  caption?: string;
  className?: string;
};

/**
 * Opens the live component in the Arlo UI Playground (Expo Go) on a device.
 * On desktop we show a QR code to scan; on a phone you can't scan your own
 * screen, so we show a button that deep-links straight into Expo Go.
 */
export function DevicePreview({
  route,
  caption = "Scan to preview.",
  className,
}: DevicePreviewProps) {
  const url = devicePreviewUrl(route);

  return (
    <PreviewCard className={cn("mb-12", className)}>
      {/* Desktop / tablet: scan the QR with a phone. */}
      <div className="hidden flex-col items-center gap-6 text-ink sm:flex">
        <QRCodeSVG
          value={url}
          size={176}
          bgColor="transparent"
          fgColor="currentColor"
          level="M"
          aria-label={`QR code linking to the ${route} playground`}
        />
        <p className="font-mono text-[13px] tracking-tight text-ink-2">
          {caption}
        </p>
      </div>

      {/* Phone: tap to open the route directly in Expo Go. */}
      <div className="flex flex-col items-center gap-3 py-3 text-ink sm:hidden">
        <a
          href={url}
          className="flex h-11 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-canvas"
        >
          Open in Expo Go
        </a>
        <p className="font-mono text-[12px] tracking-tight text-ink-3">
          Requires the free Expo Go app
        </p>
      </div>
    </PreviewCard>
  );
}
