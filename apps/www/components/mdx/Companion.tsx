"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const ActiveSectionContext = createContext<string>("");

export function CompanionLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-companion-section]");
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.companionSection;
            if (id) setActiveSection(id);
          }
        }
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    sections.forEach((s) => observerRef.current!.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <ActiveSectionContext.Provider value={activeSection}>
      <div
        ref={containerRef}
        className={cn(
          "grid grid-cols-[1fr_48%] gap-12 lg:gap-16",
          className
        )}
      >
        {children}
      </div>
    </ActiveSectionContext.Provider>
  );
}

export function EssaySection({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-companion-section={id} className={cn("relative", className)}>
      {children}
    </div>
  );
}

export function CompanionPanel({
  sections,
}: {
  sections: Record<string, React.ReactNode>;
}) {
  const activeSection = useContext(ActiveSectionContext);
  const keys = Object.keys(sections);
  const activeKey = activeSection && keys.includes(activeSection)
    ? activeSection
    : keys[0] || "";

  return (
    <aside className="relative">
      <div className="sticky top-1/2 -translate-y-1/2">
        {keys.map((key) => (
          <div
            key={key}
            className={cn(
              "transition-opacity",
              activeKey === key
                ? "opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0"
            )}
            style={{
              transitionDuration: "var(--dur-base)",
              transitionTimingFunction: "var(--ease-out)",
            }}
          >
            {sections[key]}
          </div>
        ))}
      </div>
    </aside>
  );
}
