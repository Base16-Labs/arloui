'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import {
  docsSections,
  componentGroups,
  primitiveItems,
  archetypeItems,
  agentItems,
  gettingStartedItems,
} from '@/lib/routes';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[68px] hidden h-[calc(100dvh-68px)] w-[264px] shrink-0 self-start overflow-hidden border-r border-line lg:block">
      {/* Top blur */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24"
        style={{
          background:
            'linear-gradient(to bottom, var(--canvas) 0%, var(--canvas) 34%, color-mix(in srgb, var(--canvas) 82%, transparent) 58%, transparent 100%)',
        }}
      />

      {/* Scroll container */}
      <div className="h-full overflow-y-auto overscroll-contain px-[18px] py-7 scrollbar-none">
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
                  <SidebarLink
                    key={item.slug}
                    href={`/docs/components/${item.slug}`}
                    label={item.label}
                    active={pathname === `/docs/components/${item.slug}`}
                  />
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

      {/* Bottom blur */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
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
}: {
  title: string;
  items: readonly { label: string; slug: string }[];
  basePath: string;
  pathname: string;
}) {
  return (
    <>
      <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
        {title}
      </div>
      {items.map((item) => (
        <SidebarLink
          key={item.slug}
          href={`${basePath}/${item.slug}`}
          label={item.label}
          active={pathname === `${basePath}/${item.slug}`}
        />
      ))}
    </>
  );
}
