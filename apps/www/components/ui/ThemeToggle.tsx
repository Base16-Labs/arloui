"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme";

const cycle = { light: "dark", dark: "system", system: "light" } as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      onClick={() => setTheme(cycle[theme])}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-canvas text-ink-2"
      aria-label={`Theme: ${theme}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
