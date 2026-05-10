"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type CompanionProps = {
  children: React.ReactNode;
  caption?: string;
};

export function EssaySection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>{children}</div>
  );
}

export function Companion({ children, caption }: CompanionProps) {
  return (
    <div className="sticky top-[120px]">
      <div className="flex flex-col items-center">
        {children}
        {caption && (
          <p className="mt-4 max-w-[240px] text-center text-[13px] italic leading-snug text-ink-2">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

export function EssayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid max-w-[920px] grid-cols-[1fr_280px] gap-14">
      {children}
    </div>
  );
}
