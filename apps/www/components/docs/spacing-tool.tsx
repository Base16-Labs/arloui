"use client";

import { useState } from "react";

const scale = [
  [0, 0],
  [1, 4],
  [2, 8],
  [3, 12],
  [4, 16],
  [5, 20],
  [6, 24],
  [8, 32],
  [10, 40],
  [12, 48],
  [14, 56],
  [16, 64],
  [20, 80],
  [24, 96],
] as const;

function meaningFor(px: number): { label: string; range: string } {
  if (px <= 8) return { label: "Belongs together", range: "4–8px" };
  if (px <= 16) return { label: "Same group, siblings", range: "12–16px" };
  if (px <= 24) return { label: "New group", range: "20–24px" };
  if (px <= 48) return { label: "Major blocks", range: "32–48px" };
  return { label: "New context", range: "56–96px" };
}

export function SpacingTool() {
  const [idx, setIdx] = useState(4); // spacing.4 = 16px
  const [key, value] = scale[idx];
  const meaning = meaningFor(value);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_240px] lg:items-stretch">
      <div className="flex flex-col rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-1 flex-col items-center justify-center gap-0 py-4">
          <div className="flex w-44 items-center gap-2 rounded-md bg-ink/10 px-3 py-3">
            <span className="size-5 rounded-md bg-ink/25" />
            <span className="h-2.5 flex-1 rounded-full bg-ink/25" />
          </div>
          <div
            className="relative w-px bg-transparent"
            style={{ height: value }}
            aria-hidden
          >
            <span className="absolute top-1/2 left-2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] text-ink-3">
              {value}px
            </span>
            <span className="absolute inset-x-0 top-0 border-t border-dashed border-line-strong" />
            <span className="absolute inset-x-0 bottom-0 border-t border-dashed border-line-strong" />
          </div>
          <div className="flex w-44 items-center gap-2 rounded-md bg-ink/10 px-3 py-3">
            <span className="size-5 rounded-md bg-ink/25" />
            <span className="h-2.5 flex-1 rounded-full bg-ink/25" />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={scale.length - 1}
          step={1}
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          aria-label="Spacing scale step"
          className="mt-4 w-full accent-ink"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-3">
          <span>0</span>
          <span>96px</span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 rounded-lg border border-line bg-canvas p-5">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Nearest token
          </div>
          <code className="mt-1 block font-mono text-[18px] text-ink">spacing.{key}</code>
          <div className="mt-0.5 font-mono text-[12px] text-ink-2">
            {value}px · {value === 0 ? "0" : `${value / 16}rem`}
          </div>
        </div>
        <div className="border-t border-line pt-4">
          <div className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
            Reads as
          </div>
          <div className="mt-1 text-[14px] font-medium text-ink">{meaning.label}</div>
          <div className="mt-0.5 font-mono text-[11px] text-ink-3">{meaning.range}</div>
        </div>
      </div>
    </div>
  );
}
