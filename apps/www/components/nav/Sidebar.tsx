'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  docsSections,
  componentGroups,
  primitiveItems,
  archetypeItems,
  agentItems,
  gettingStartedItems,
  chartFormRoutes,
} from '@/lib/routes';

export function Sidebar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowTop(el.scrollTop > 4);
    setShowBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    const observer = new ResizeObserver(updateFades);
    observer.observe(el);
    window.addEventListener('resize', updateFades);
    return () => {
      el.removeEventListener('scroll', updateFades);
      observer.disconnect();
      window.removeEventListener('resize', updateFades);
    };
  }, [updateFades, pathname]);

  return (
    <aside className="sticky top-[68px] hidden h-[calc(100dvh-68px)] w-[264px] shrink-0 self-start overflow-hidden lg:block">
      {/* Right divider — fades out at the top and bottom so it doesn't read as
          a hard full-height rule when the header scrolls away. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-px"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, var(--line) 12%, var(--line) 88%, transparent 100%)',
        }}
      />

      {/* Top blur — only when scrolled down */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-10 h-24 transition-opacity duration-200',
          showTop ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          background:
            'linear-gradient(to bottom, var(--canvas) 0%, var(--canvas) 34%, color-mix(in srgb, var(--canvas) 82%, transparent) 58%, transparent 100%)',
        }}
      />

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain px-[18px] py-7 scrollbar-none"
      >
        {/* Sections */}
        <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
          Sections
        </div>
        {docsSections.map((section) => {
          const active = pathname === section.href;
          return (
            <Link
              key={section.href}
              href={section.href}
              className={cn(
                'block rounded-sm px-2.5 py-1.5 text-[13.5px] font-medium leading-snug',
                active
                  ? 'bg-surface-sunken text-ink dark:bg-surface'
                  : 'text-ink hover:bg-surface-sunken/50',
              )}
            >
              {section.label}
            </Link>
          );
        })}

        {/* Divider */}
        <hr className="mx-2 my-[18px] border-line" />

        {/* Contextual sub-navigation */}
        {pathname.startsWith('/docs/components') && (
          <>
            <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Components
            </div>
            {componentGroups.map((group) => (
              <div key={group.label}>
                <div className="mt-3.5 mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <div key={item.slug}>
                    <SidebarLink
                      href={`/docs/components/${item.slug}`}
                      label={item.label}
                      active={pathname === `/docs/components/${item.slug}`}
                    />
                    {/*
                      Chart's forms are pages of their own but not components of
                      their own, so they nest under it rather than sitting in the
                      component list — which is also what `componentCount` counts.
                    */}
                    {item.slug === 'chart' ? (
                      <div className="ml-3 border-l border-line pl-1.5">
                        {chartFormRoutes.map((form) => (
                          <SidebarLink
                            key={form.slug}
                            href={`/docs/components/${form.slug}`}
                            label={form.label}
                            active={pathname === `/docs/components/${form.slug}`}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {pathname.startsWith('/docs/getting-started') && (
          <SidebarGroup
            title="Getting started"
            items={gettingStartedItems}
            basePath="/docs/getting-started"
            pathname={pathname}
          />
        )}

        {pathname.startsWith('/docs/primitives') && (
          <SidebarGroup
            title="Foundations"
            items={primitiveItems}
            basePath="/docs/primitives"
            pathname={pathname}
          />
        )}

        {pathname.startsWith('/docs/archetypes') && (
          <SidebarGroup
            title="Archetypes"
            items={archetypeItems}
            basePath="/docs/archetypes"
            pathname={pathname}
            anchor
          />
        )}

        {pathname.startsWith('/docs/agents') && (
          <SidebarGroup
            title="Agents"
            items={agentItems}
            basePath="/docs/agents"
            pathname={pathname}
          />
        )}
      </div>

      {/* Bottom blur — only when more content below */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 transition-opacity duration-200',
          showBottom ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          background:
            'linear-gradient(to top, var(--canvas) 0%, var(--canvas) 34%, color-mix(in srgb, var(--canvas) 82%, transparent) 58%, transparent 100%)',
        }}
      />
    </aside>
  );
}

function SidebarLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'block rounded-sm px-2.5 py-1.5 text-[13.5px] leading-snug',
        active
          ? 'bg-surface-sunken font-medium text-ink dark:bg-surface'
          : 'text-ink-2 hover:bg-surface-sunken/50',
      )}
    >
      {label}
    </Link>
  );
}

function SidebarGroup({
  title,
  items,
  basePath,
  pathname,
  anchor = false,
}: {
  title: string;
  items: readonly { label: string; slug: string }[];
  basePath: string;
  pathname: string;
  /** Link to in-page sections (`basePath#slug`) instead of separate routes. */
  anchor?: boolean;
}) {
  return (
    <>
      <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
        {title}
      </div>
      {items.map((item) => (
        <SidebarLink
          key={item.slug}
          href={anchor ? `${basePath}#${item.slug}` : `${basePath}/${item.slug}`}
          label={item.label}
          active={!anchor && pathname === `${basePath}/${item.slug}`}
        />
      ))}
    </>
  );
}
