"use client";

import { useState } from "react";
import { highlight } from "sugar-high";
import { cn } from "@/lib/cn";

type CodeBlockProps = {
  children: string;
  language?: string;
  className?: string;
};

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        "relative overflow-x-auto rounded-xl bg-[#18181b] px-[22px] py-5 font-mono text-[12.5px] leading-[1.75] text-zinc-300",
        // sugar-high token palette (One Dark-ish) — the block is always dark.
        "[--sh-class:#e5c07b] [--sh-identifier:#d4d4d8] [--sh-sign:#7d8799]",
        "[--sh-string:#98c379] [--sh-keyword:#c678dd] [--sh-comment:#6b7280]",
        "[--sh-jsxliterals:#61afef] [--sh-property:#56b6c2] [--sh-entity:#61afef]",
        className
      )}
    >
      <button
        onClick={copy}
        className="absolute top-3 right-3 z-10 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 font-sans text-[11px] text-zinc-400 hover:bg-white/[0.1]"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="m-0">
        <code dangerouslySetInnerHTML={{ __html: highlight(children) }} />
      </pre>
    </div>
  );
}
