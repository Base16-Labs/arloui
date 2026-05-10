"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type CodeBlockProps = {
  children: string;
  language?: string;
  className?: string;
};

export function CodeBlock({
  children,
  language = "tsx",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        "relative overflow-x-auto rounded-xl bg-[#18181b] px-[22px] py-5 font-mono text-[12.5px] leading-[1.75] text-zinc-400",
        className
      )}
    >
      <button
        onClick={copy}
        className="absolute top-3 right-3 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 font-sans text-[11px] text-zinc-400 hover:bg-white/[0.1]"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="m-0">
        <code>{children}</code>
      </pre>
    </div>
  );
}
