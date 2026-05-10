"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

export function BottomPill() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDocsPage = pathname.startsWith("/docs");
  const isComponentPage = pathname.startsWith("/docs/components/");

  const pageLabel = pathname.split("/").pop() ?? "docs";
  const displayLabel =
    pageLabel.charAt(0).toUpperCase() + pageLabel.slice(1);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 120);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!isDocsPage) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
      style={{
        transitionDuration: "var(--dur-slow)",
        transitionTimingFunction: "var(--ease-morph)",
      }}
    >
      {/* State A — Compact */}
      {!menuOpen && (
        <div className="flex items-center gap-3 rounded-full border border-glass-border bg-glass-bg px-3.5 py-2.5 shadow-lg backdrop-blur-[20px]">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-ink/[0.06] text-ink"
            aria-label="Open menu"
          >
            <Menu className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[13px] font-medium text-ink"
          >
            {displayLabel}
          </button>
          {isComponentPage && (
            <>
              <span className="text-ink-3">·</span>
              <button
                className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-ink/[0.06] text-ink"
                aria-label="Scan to preview"
              >
                <span className="text-xs">📱</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* State C — Menu morph */}
      {menuOpen && (
        <div className="w-[360px] rounded-3xl border border-glass-border bg-glass-bg p-4 shadow-lg backdrop-blur-[20px]">
          {/* Search */}
          <div className="mb-3 flex items-center gap-2 rounded-full border border-line bg-ink/[0.04] px-3.5 py-2 text-[13px] text-ink-3">
            <span>Search…</span>
            <span className="ml-auto rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[11px]">
              ⌘K
            </span>
          </div>

          {/* Site links */}
          <div className="mx-1.5 mt-3.5 mb-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Site
          </div>
          {["Docs", "Showcase", "Roadmap"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-md px-2.5 py-2 text-[13.5px] text-ink hover:bg-ink/[0.04]"
            >
              <span>{label}</span>
              <span className="text-xs text-ink-3">↗</span>
            </div>
          ))}

          <div className="my-2 h-px bg-line" />

          {/* Page actions */}
          <div className="mx-1.5 mt-3.5 mb-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
            This page
          </div>
          {["Copy markdown", "View as markdown", "Edit on GitHub"].map(
            (label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md px-2.5 py-2 text-[13.5px] text-ink hover:bg-ink/[0.04]"
              >
                <span>{label}</span>
                <span className="text-xs text-ink-3">
                  {label.includes("Copy") ? "⌘" : "↗"}
                </span>
              </div>
            )
          )}

          {/* Bottom action row */}
          <div className="mt-2 flex gap-2">
            {["★ 0", "Figma ↗", "Theme"].map((label) => (
              <div
                key={label}
                className="flex-1 rounded-md bg-ink/[0.04] py-2.5 text-center text-xs text-ink-2"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Close */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-canvas shadow-md border border-line"
            aria-label="Close menu"
          >
            <X className="h-3.5 w-3.5 text-ink" />
          </button>
        </div>
      )}
    </div>
  );
}
