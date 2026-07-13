"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { StatusBadge, type StatusIcon, type StatusTone } from "@/components/ui/StatusBadge";

type StateGridProps = {
  states: string[];
  onHover?: (state: string | null) => void;
  onPin?: (state: string | null) => void;
};

export function StateGrid({ states, onHover, onPin }: StateGridProps) {
  const [pinned, setPinned] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2.5">
      {states.map((state) => {
        const nextPinned = pinned === state ? null : state;
        const visual = stateVisual(state, pinned === state);

        return (
          <button
            type="button"
            key={state}
            onMouseEnter={() => onHover?.(state)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => {
              setPinned(nextPinned);
              onPin?.(nextPinned);
            }}
            className={cn(
              "rounded-lg transition-transform hover:-translate-y-0.5",
              pinned === state && "ring-2 ring-ink/20",
            )}
          >
            <StatusBadge tone={visual.tone} icon={visual.icon}>
              {formatState(state)}
            </StatusBadge>
          </button>
        );
      })}
    </div>
  );
}

function formatState(state: string) {
  return state
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stateVisual(state: string, pinned: boolean): { tone: StatusTone; icon: StatusIcon } {
  const normalized = state.toLowerCase();
  if (normalized.includes("error") || normalized.includes("danger") || normalized.includes("fail")) {
    return { tone: "danger", icon: "warning" };
  }
  if (normalized.includes("approved") || normalized.includes("success") || normalized.includes("complete")) {
    return { tone: "approved", icon: "check" };
  }
  if (normalized.includes("live") || normalized.includes("active")) {
    return { tone: "live", icon: "play" };
  }
  if (normalized.includes("archive") || normalized.includes("dismiss")) {
    return { tone: "archived", icon: "archive" };
  }
  if (normalized.includes("waiting") || normalized.includes("peek")) {
    return { tone: "waiting", icon: "eye" };
  }
  if (
    normalized.includes("progress") ||
    normalized.includes("loading") ||
    normalized.includes("scroll") ||
    normalized.includes("snap") ||
    normalized.includes("drag")
  ) {
    return { tone: "progress", icon: "progress" };
  }
  if (normalized.includes("change") || normalized.includes("keyboard")) {
    return { tone: "changes", icon: "flag" };
  }
  return pinned ? { tone: "draft", icon: "pencil" } : { tone: "neutral", icon: "spinner" };
}
