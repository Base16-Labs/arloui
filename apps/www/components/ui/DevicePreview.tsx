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
 * Replaces the per-component phone simulations with a QR code that opens the
 * live component in the Arlo UI Playground (Expo) on a device.
 */
export function DevicePreview({
  route,
  caption = "Scan to preview.",
  className,
}: DevicePreviewProps) {
  const url = devicePreviewUrl(route);

  return (
    <PreviewCard className={cn("mb-12", className)}>
      <div className="flex flex-col items-center gap-6 text-ink">
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
    </PreviewCard>
  );
}
