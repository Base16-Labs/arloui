"use client";

import { cn } from "@/lib/cn";

export function PreviewThemeToggle({
  mode,
  onChange,
}: {
  mode: "light" | "dark";
  onChange: (mode: "light" | "dark") => void;
}) {
  return (
    <div className="absolute top-4 left-4 z-10 inline-flex rounded-full border border-line bg-canvas p-0.5 text-[11px]">
      {(["light", "dark"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          aria-pressed={mode === m}
          className={cn(
            "rounded-full px-2.5 py-1 capitalize transition-colors",
            mode === m ? "bg-ink text-canvas" : "text-ink-2 hover:text-ink",
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
