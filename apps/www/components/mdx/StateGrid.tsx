"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type StateGridProps = {
  states: string[];
  onHover?: (state: string | null) => void;
  onPin?: (state: string | null) => void;
};

export function StateGrid({ states, onHover, onPin }: StateGridProps) {
  const [pinned, setPinned] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-6 gap-2.5">
      {states.map((state) => (
        <button
          key={state}
          onMouseEnter={() => onHover?.(state)}
          onMouseLeave={() => onHover?.(null)}
          onClick={() => {
            const next = pinned === state ? null : state;
            setPinned(next);
            onPin?.(next);
          }}
          className={cn(
            "flex aspect-square items-end rounded-[10px] border border-dashed p-2 text-[10px] uppercase tracking-[0.04em]",
            pinned === state
              ? "border-ink bg-surface-sunken text-ink"
              : "border-line-strong bg-[#f8f6ef] text-ink-3 hover:border-ink-3 dark:bg-surface-raised"
          )}
        >
          {state}
        </button>
      ))}
    </div>
  );
}
