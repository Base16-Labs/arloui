"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/cn";

type QRPopoverProps = {
  url: string;
  className?: string;
};

export function QRPopover({ url, className }: QRPopoverProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface/80 p-5 shadow-sm backdrop-blur-md border border-line",
        className
      )}
    >
      <QRCodeSVG
        value={url}
        size={140}
        bgColor="transparent"
        fgColor="currentColor"
        className="text-ink"
      />
      <p className="text-[13px] text-ink-2">Scan to preview on device</p>
    </div>
  );
}
