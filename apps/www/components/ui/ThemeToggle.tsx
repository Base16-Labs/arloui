"use client";

import { useTheme } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

const cycle = { light: "dark", dark: "system", system: "light" } as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const iconName = theme === "dark" ? "moon" : theme === "light" ? "sun" : "monitor";

  return (
    <button
      onClick={() => setTheme(cycle[theme])}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-canvas text-ink-2"
      aria-label={`Theme: ${theme}`}
    >
      <Icon name={iconName} size={14} />
    </button>
  );
}
