'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type RightRailProps = {
  headings?: { id: string; label: string }[];
  actions?: { label: string; href: string }[];
};

export function RightRail({ headings = [], actions = [] }: RightRailProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className="sticky top-0 hidden h-dvh w-[200px] shrink-0 overflow-y-auto overscroll-contain px-5 pt-10 lg:block">
      {headings.length > 0 && (
        <div className="mb-7">
          <div className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
            On this page
          </div>
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={cn(
                'block py-1.5 text-[12.5px] leading-snug',
                activeId === h.id ? 'font-medium text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {h.label}
            </a>
          ))}
        </div>
      )}

      {actions.length > 0 && (
        <div>
          <div className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Actions
          </div>
          {actions.map((a) => (
            <a
              key={a.href}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1.5 text-[12.5px] text-ink-2 hover:text-ink"
            >
              {a.label}
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
