'use client';

import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { GithubMark } from '@/components/ui/GithubMark';
import { useTheme } from '@/lib/theme';
import { markdownForPath } from '@/lib/docs-markdown';

const MORPH_NAME = 'bottom-pill' as const;
const GITHUB_URL = 'https://github.com/Base16-Labs/arloui';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function withViewTransition(update: () => void) {
  if (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    !prefersReducedMotion()
  ) {
    document.startViewTransition(() => {
      flushSync(update);
    });
  } else {
    update();
  }
}

export function BottomPill() {
  const pathname = usePathname();
  const { resolved, setTheme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'opening' | 'closing'>('opening');

  const isDocsPage = pathname.startsWith('/docs');

  const pageLabel = pathname.split('/').pop() ?? 'docs';
  const displayLabel = pageLabel.charAt(0).toUpperCase() + pageLabel.slice(1);

  const pageMarkdown = markdownForPath(pathname);
  const [copied, setCopied] = useState(false);

  const copyMarkdown = useCallback(() => {
    if (!pageMarkdown) return;
    void navigator.clipboard.writeText(pageMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [pageMarkdown]);

  // ⌘⇧C / Ctrl+Shift+C copies the current page's markdown.
  useEffect(() => {
    if (!pageMarkdown) return;
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyMarkdown();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pageMarkdown, copyMarkdown]);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 120);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!isDocsPage) return null;

  const morphStyle = { viewTransitionName: MORPH_NAME } satisfies CSSProperties;

  const openMenu = () => {
    setTransitionDirection('opening');
    withViewTransition(() => setMenuOpen(true));
  };

  const closeMenu = () => {
    setTransitionDirection('closing');
    withViewTransition(() => setMenuOpen(false));
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none',
      )}
      data-pill-transition={transitionDirection}
      style={{
        transitionDuration: 'var(--dur-slow)',
        transitionTimingFunction: 'var(--ease-morph)',
      }}
    >
      {!menuOpen && (
        <div className="rounded-full shadow-[0_6px_20px_rgb(24_24_27/0.14),0_2px_6px_rgb(24_24_27/0.08)] dark:shadow-none">
          <div
            className="bottom-pill-surface flex w-44 items-center justify-between rounded-[100px] border-[0.5px] border-[#D4D4D8] bg-[#FAFAFA] p-1.5 text-[#3F3F46] backdrop-blur-[40px] dark:border-glass-border dark:bg-glass-bg dark:text-ink"
            style={morphStyle}
          >
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 px-1.5 text-left text-[13.5px] leading-tight"
              aria-label={`Scroll to top of ${displayLabel}`}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#71717A]" />
              <span className="truncate">{displayLabel}</span>
            </button>
            <button
              type="button"
              onClick={openMenu}
              onMouseEnter={() => setMenuHovered(true)}
              onMouseLeave={() => setMenuHovered(false)}
              onFocus={() => setMenuHovered(true)}
              onBlur={() => setMenuHovered(false)}
              className="flex h-7 w-[68px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-2 text-[13.5px] leading-none transition-colors"
              style={{
                backgroundColor: menuHovered
                  ? resolved === 'dark'
                    ? 'rgb(255 255 255 / 0.1)'
                    : '#E4E4E7'
                  : 'transparent',
              }}
              aria-label="Open menu"
            >
              <span>Menu</span>
              <span className="relative h-3.5 w-2.5 text-[#3F3F46]" aria-hidden="true">
                <span className="absolute top-[2px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-t border-l border-current" />
                <span className="absolute bottom-[2px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-r border-b border-current" />
              </span>
            </button>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="bottom-pill-shadow rounded-3xl">
          <div
            className="bottom-pill-surface w-[360px] rounded-3xl border border-glass-border bg-glass-bg p-4 backdrop-blur-[20px]"
            style={morphStyle}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-line bg-ink/[0.04] px-3.5 py-2 text-[13px] text-ink-3">
                <Icon name="magnifying-glass" size={12} />
                <span>Search…</span>
                <span className="ml-auto rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[11px]">
                  ⌘K
                </span>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink/[0.06] text-ink"
                aria-label="Close menu"
              >
                <Icon name="x" size={14} />
              </button>
            </div>

            <div className="mx-1.5 mt-3.5 mb-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Site
            </div>
            {['Docs', 'Showcase', 'Roadmap'].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md px-2.5 py-2 text-[13.5px] text-ink hover:bg-ink/[0.04]"
              >
                <span>{label}</span>
                <span className="text-xs text-ink-3">↗</span>
              </div>
            ))}

            {pageMarkdown ? (
              <>
                <div className="my-2 h-px bg-line" />

                <div className="mx-1.5 mt-3.5 mb-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
                  This page
                </div>
                <button
                  type="button"
                  onClick={copyMarkdown}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-ink/[0.04]"
                >
                  <span>{copied ? 'Copied' : 'Copy markdown'}</span>
                  <span className="text-xs text-ink-3">⇧⌘C</span>
                </button>
              </>
            ) : null}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <a
                  href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink-2 transition hover:bg-ink/[0.06] hover:text-ink"
                  aria-label="Open Figma"
                >
                  <img src="/icons/figma.svg" alt="" className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink-2 transition hover:bg-ink/[0.06] hover:text-ink"
                  aria-label="Open GitHub"
                >
                  <GithubMark size={16} />
                </a>
                <button
                  type="button"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-ink-2 transition hover:bg-ink/[0.06] hover:text-ink"
                  aria-label="Scan to preview"
                >
                  <Icon name="qr-code" size={14} />
                </button>
              </div>

              <div className="flex h-[25px] w-[72px] items-center gap-1 rounded-full border border-line bg-zinc-100 p-0.5 dark:bg-ink/[0.06]">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex h-5 flex-1 cursor-pointer items-center justify-center rounded-full text-ink-3 transition',
                    resolved === 'dark' &&
                      'bg-canvas text-ink shadow-[0_1px_4px_rgb(24_24_27/0.12)]',
                  )}
                  aria-label="Use dark mode"
                  aria-pressed={resolved === 'dark'}
                >
                  <Icon name="moon" size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex h-5 flex-1 cursor-pointer items-center justify-center rounded-full text-ink-3 transition',
                    resolved === 'light' &&
                      'bg-zinc-200 text-ink shadow-[0_1px_4px_rgb(24_24_27/0.12)] dark:bg-canvas',
                  )}
                  aria-label="Use light mode"
                  aria-pressed={resolved === 'light'}
                >
                  <Icon name="sun" size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
