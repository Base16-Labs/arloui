'use client';

import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { searchEntries, type SearchEntry } from '@/lib/search-index';

const CATEGORY_ORDER = [
  'Components',
  'Foundations',
  'Archetypes',
  'Getting started',
  'Agents',
  'Pages',
];

function orderByCategory(entries: SearchEntry[]): SearchEntry[] {
  return [...entries].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
  );
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const fuse = useMemo(
    () =>
      new Fuse(searchEntries, {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'keywords', weight: 0.2 },
          { name: 'category', weight: 0.1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [],
  );

  const results = useMemo<SearchEntry[]>(() => {
    const q = query.trim();
    // Group by category (each appears once) while preserving relevance order
    // within a category — orderByCategory is a stable sort.
    if (!q) return orderByCategory(searchEntries);
    return orderByCategory(fuse.search(q).map((r) => r.item));
  }, [query, fuse]);

  // Reset when the dialog opens.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // Focus after the dialog paints.
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  // Keep the active index in range as results change.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
  }, [results.length]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    onClose();
    router.push(entry.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  // Scroll the active row into view.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({
      block: 'nearest',
    });
  }, [active]);

  if (!open) return null;

  // Group results while keeping a flat index for keyboard navigation.
  let flatIndex = -1;
  const groups: { category: string; items: { entry: SearchEntry; idx: number }[] }[] = [];
  for (const entry of results) {
    flatIndex += 1;
    const last = groups[groups.length - 1];
    if (last && last.category === entry.category) {
      last.items.push({ entry, idx: flatIndex });
    } else {
      groups.push({ category: entry.category, items: [{ entry, idx: flatIndex }] });
    }
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        className="absolute inset-0 bg-scrim backdrop-blur-[2px]"
        aria-label="Dismiss search"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-[10vh] mx-auto flex w-full max-w-[560px] justify-center px-4">
        <div
          className="w-full overflow-hidden rounded-2xl border border-glass-border bg-glass-bg shadow-2xl backdrop-blur-[24px]"
          onKeyDown={onKeyDown}
        >
          <div className="flex items-center gap-2.5 border-b border-line px-4">
            <Icon name="magnifying-glass" size={16} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, archetypes, foundations…"
              className="h-[52px] w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
              aria-label="Search"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="hidden shrink-0 rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-ink-3 sm:block">
              Esc
            </kbd>
          </div>

          <div ref={listRef} className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
            {results.length === 0 ? (
              <div className="px-3 py-10 text-center text-[14px] text-ink-3">
                No results for &ldquo;{query.trim()}&rdquo;
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.category} className="mb-1">
                  <div className="px-2.5 pt-2 pb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
                    {group.category}
                  </div>
                  {group.items.map(({ entry, idx }) => (
                    <button
                      key={entry.id}
                      type="button"
                      data-idx={idx}
                      onMouseMove={() => setActive(idx)}
                      onClick={() => go(entry)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left',
                        idx === active ? 'bg-ink/[0.06] text-ink' : 'text-ink-2',
                      )}
                    >
                      <span className="flex-1 truncate text-[14px]">{entry.title}</span>
                      {idx === active ? (
                        <kbd className="shrink-0 font-mono text-[11px] text-ink-3">↵</kbd>
                      ) : null}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
