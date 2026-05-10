"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { docsSections, componentGroups } from "@/lib/routes";

export function Sidebar() {
  const pathname = usePathname();

  const currentSection = docsSections.find((s) =>
    pathname.startsWith(s.href)
  );

  return (
    <aside className="relative h-full w-[264px] shrink-0 overflow-hidden border-r border-line">
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-canvas to-transparent" />

      {/* Scroll container */}
      <div className="h-full overflow-y-auto px-[18px] py-7">
        {/* Sections */}
        <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
          Sections
        </div>
        {docsSections.map((section) => {
          const active = pathname.startsWith(section.href);
          return (
            <Link
              key={section.href}
              href={section.href}
              className={cn(
                "block rounded-sm px-2.5 py-1.5 text-[13.5px] font-medium leading-snug",
                active
                  ? "bg-surface-sunken text-ink"
                  : "text-ink hover:bg-surface-sunken/50"
              )}
            >
              {section.label}
            </Link>
          );
        })}

        {/* Divider */}
        <hr className="mx-2 my-[18px] border-line" />

        {/* Components — always visible */}
        <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
          Components
        </div>

        {componentGroups.map((group) => (
          <div key={group.label}>
            <div className="mt-3.5 mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              {group.label}
            </div>
            {group.items.map((item) => {
              const href = `/docs/components/${item.slug}`;
              const active = pathname === href;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  className={cn(
                    "block rounded-sm px-2.5 py-1.5 text-[13.5px] leading-snug",
                    active
                      ? "bg-ink font-medium text-canvas"
                      : "text-ink-2 hover:bg-surface-sunken/50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-canvas to-transparent" />
    </aside>
  );
}
