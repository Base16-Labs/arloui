"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { siteLinks } from "@/lib/routes";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function TopNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > 120 && y > lastScroll.current);
      lastScroll.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[68px] border-b border-line bg-canvas transition-transform",
        hidden && "-translate-y-full"
      )}
      style={{
        transitionDuration: "var(--dur-slow)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-6 px-7">
        <div className="flex items-center gap-7">
          <Link
            href="/"
            className="text-[22px] font-medium tracking-tight text-ink"
          >
            ArloUI
          </Link>
          <nav className="flex items-center gap-[18px] text-sm">
            {siteLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "py-1 transition-colors",
                    active ? "font-medium text-ink" : "text-ink-2 hover:text-ink"
                  )}
                  style={{ transitionDuration: "var(--dur-fast)" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mx-auto w-full max-w-[520px]">
          <button
            className="flex h-[38px] w-full items-center gap-2.5 rounded-[10px] border border-line bg-surface-sunken px-3.5 text-sm text-ink-3"
            aria-label="Search"
          >
            <Icon name="magnifying-glass" size={14} />
            <span>Search components, archetypes, foundations…</span>
          </button>
        </div>

        <div className="flex items-center gap-3.5">
          <a
            href="https://github.com/Base16-Labs/arloui"
            target="_blank"
            rel="noopener noreferrer"
            className="tabular-nums flex items-center gap-1.5 rounded-md border border-line bg-canvas px-2.5 py-1 text-[13px] text-ink-2"
          >
            <Icon name="star" size={14} />
            <span>0</span>
          </a>
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-canvas text-ink-2"
            aria-label="Figma"
          >
            <Icon name="figma-logo" size={14} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
