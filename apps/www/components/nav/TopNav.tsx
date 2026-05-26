'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { siteLinks } from '@/lib/routes';
import { Icon } from '@/components/ui/Icon';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const GITHUB_URL = 'https://github.com/Base16-Labs/arloui';

export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="relative z-40 h-[68px] border-b border-line bg-canvas">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center gap-4 px-4 lg:gap-6 lg:px-7">
          <div className="flex items-center gap-4 lg:gap-7">
            <Link href="/" className="text-[22px] font-medium tracking-tight text-ink">
              ArloUI
            </Link>
            <nav className="hidden items-center gap-[18px] text-sm lg:flex">
              {siteLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'py-1 transition-colors',
                      active ? 'font-medium text-ink' : 'text-ink-2 hover:text-ink',
                    )}
                    style={{ transitionDuration: 'var(--dur-fast)' }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mx-auto hidden min-w-0 w-full max-w-[520px] flex-1 lg:block">
            <button
              type="button"
              className="flex h-[38px] w-full items-center gap-2.5 rounded-[10px] border border-line bg-surface-sunken px-3.5 text-left text-sm text-ink-3"
              aria-label="Search"
            >
              <Icon name="magnifying-glass" size={14} />
              <span className="truncate">Search components, archetypes, foundations…</span>
            </button>
          </div>

          <div className="hidden items-center gap-3.5 lg:flex">
            <a
              href={GITHUB_URL}
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
              <img src="/icons/figma.svg" alt="" className="h-4 w-4" aria-hidden="true" />
            </a>
            <ThemeToggle />
          </div>

          <button
            type="button"
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-canvas text-ink-2 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="list" size={16} />
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-scrim"
            aria-label="Dismiss menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="pointer-events-none absolute inset-0 flex justify-center overflow-y-auto px-4 pt-[88px] pb-8">
            <div
              className="pointer-events-auto h-fit w-full max-w-[360px] rounded-3xl border border-glass-border bg-glass-bg p-4 shadow-lg backdrop-blur-[20px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/[0.06] text-ink"
                  aria-label="Close menu"
                >
                  <Icon name="x" size={14} />
                </button>
              </div>

              <button
                type="button"
                className="mb-3 flex h-[38px] w-full items-center gap-2.5 rounded-[10px] border border-line bg-ink/[0.04] px-3.5 text-left text-sm text-ink-3"
                aria-label="Search"
              >
                <Icon name="magnifying-glass" size={14} />
                <span className="flex-1 truncate">Search</span>
                <span className="shrink-0 rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[11px]">
                  ⌘K
                </span>
              </button>

              <div className="mx-1.5 mb-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
                Site
              </div>
              <div className="flex flex-col">
                {siteLinks.map((link) => {
                  const active = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center justify-between rounded-md px-2.5 py-2.5 text-[13.5px] transition-colors',
                        active ? 'font-medium text-ink' : 'text-ink hover:bg-ink/[0.04]',
                      )}
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-ink-3">↗</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <div className="flex items-center gap-2">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tabular-nums flex h-9 items-center gap-1 rounded-full border border-line bg-ink/[0.04] px-3 text-[12px] text-ink-2"
                  >
                    <Icon name="star" size={12} />
                    <span>0</span>
                  </a>
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-ink/[0.04] text-ink-2"
                    aria-label="Figma"
                  >
                    <img src="/icons/figma.svg" alt="" className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-ink/[0.04] text-ink-2"
                    aria-label="GitHub"
                  >
                    <img src="/icons/github.svg" alt="" className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
