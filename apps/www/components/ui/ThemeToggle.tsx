"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

export function ThemeToggle() {
  const { resolved, setTheme } = useTheme();
  // `resolved` differs between the server (always "light") and the client's
  // first render, so gate the active state until after mount to avoid a
  // hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolved === "dark";
  const isLight = mounted && resolved === "light";

  return (
    <div className="flex h-8 w-[72px] items-center gap-1 rounded-full border border-line bg-surface-sunken p-0.5 dark:bg-ink/[0.06]">
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-full flex-1 cursor-pointer items-center justify-center rounded-full text-ink-3 transition",
          isDark && "bg-canvas text-ink shadow-[0_1px_4px_rgb(24_24_27/0.12)]",
        )}
        aria-label="Use dark mode"
        aria-pressed={isDark}
      >
        <Icon name="moon" size={13} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex h-full flex-1 cursor-pointer items-center justify-center rounded-full text-ink-3 transition",
          isLight &&
            "bg-zinc-200 text-ink shadow-[0_1px_4px_rgb(24_24_27/0.12)] dark:bg-canvas",
        )}
        aria-label="Use light mode"
        aria-pressed={isLight}
      >
        <Icon name="sun" size={13} />
      </button>
    </div>
  );
}
