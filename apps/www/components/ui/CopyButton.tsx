"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({
  text,
  label = "Copy markdown",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-3 py-1.5 text-[12.5px] text-ink-2",
        className
      )}
    >
      <span className="opacity-60">⌘</span>
      {copied ? "Copied" : label}
    </button>
  );
}
