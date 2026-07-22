'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  AnimatedIconPreview,
  animatedIconDefinitions,
  type AnimatedIconName,
} from '@/components/icons/animated-icon-preview';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

type GalleryTab = 'outline' | 'solid' | 'animated';

const animatedNames = Object.keys(animatedIconDefinitions) as AnimatedIconName[];
// Keep the initial DOM and SVG request burst small; the full catalogue remains
// available through search and incremental loading.
const PAGE_SIZE = 96;
const ONE_SHOT_DURATIONS: Partial<Record<AnimatedIconName, number>> = {
  'copy-check': 1500,
  'spinner-check': 1400,
  'spinner-x': 1400,
  'circle-progress-check': 1600,
  'bell-shake': 800,
  'dot-pulse': 1200,
};

function componentName(fileBase: string) {
  return fileBase
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function displayName(fileBase: string) {
  return fileBase.replace(/^(outline|solid)-/, '');
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function IconLibrary({
  names,
  animatedSource,
}: {
  names: string[];
  animatedSource: string;
}) {
  const [tab, setTab] = useState<GalleryTab>('outline');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedAnimated, setSelectedAnimated] = useState<AnimatedIconName | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [tab, deferredQuery]);

  const filtered = useMemo(() => {
    if (tab === 'animated') return [];
    const prefix = `${tab}-`;
    return names.filter(
      (name) => name.startsWith(prefix) && (!deferredQuery || name.includes(deferredQuery)),
    );
  }, [deferredQuery, names, tab]);

  const animatedFiltered = useMemo(
    () =>
      animatedNames.filter((name) => {
        const definition = animatedIconDefinitions[name];
        const search = `${name} ${definition.labels.join(' ')}`.toLowerCase();
        return !deferredQuery || search.includes(deferredQuery);
      }),
    [deferredQuery],
  );

  const staticCount = names.filter((name) => name.startsWith(`${tab}-`)).length;

  return (
    <main className="min-w-0 flex-1 px-6 pt-9 pb-24 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Foundations
            </div>
            <h1 className="mt-3 text-[44px] font-medium leading-none text-ink sm:text-[56px]">
              Icons
            </h1>
            <p className="mt-4 max-w-[680px] text-[15px] leading-relaxed text-ink-2">
              Static icons use Phosphor. Animated icons are curated Arlo motion variants drawn to
              match Phosphor&apos;s 24px rounded outline style, then copied into your React Native
              project.
            </p>
          </div>
          <div className="text-[12.5px] text-ink-3">
            {tab === 'animated'
              ? `${animatedFiltered.length} animated transitions · ${names.length.toLocaleString()} static icons`
              : `${names.length.toLocaleString()} icons · ${staticCount.toLocaleString()} ${tab}`}
          </div>
        </div>

        <div className="sticky top-0 z-20 -mx-2 mt-6 flex flex-col gap-3 bg-canvas/95 px-2 py-3 backdrop-blur-xl sm:flex-row sm:items-center">
          <div className="inline-flex h-9 w-fit items-center rounded-md border border-line bg-surface p-1">
            {(['outline', 'solid', 'animated'] as GalleryTab[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  'h-7 rounded-sm px-3 text-[12.5px] capitalize transition-colors',
                  tab === item ? 'bg-ink text-canvas' : 'text-ink-2 hover:text-ink',
                )}
              >
                {item === 'solid' ? 'Filled' : item}
              </button>
            ))}
          </div>

          <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-surface px-3 text-ink-3">
            <Icon name="magnifying-glass" size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tab === 'animated' ? 'Search animated transitions' : 'Search icons'}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex size-7 items-center justify-center rounded-full hover:bg-line"
                aria-label="Clear search"
              >
                <Icon name="x" size={13} />
              </button>
            ) : null}
          </label>
        </div>

        {tab === 'animated' ? (
          <AnimatedGrid names={animatedFiltered} onSelect={setSelectedAnimated} />
        ) : (
          <>
            <p className="mt-4 text-[12px] text-ink-3">
              Outline and Filled icons are based on{' '}
              <a
                href="https://phosphoricons.com/"
                target="_blank"
                rel="noreferrer"
                className="text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink"
              >
                Phosphor Icons
              </a>
              .
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
              {filtered.slice(0, visibleCount).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelected(name)}
                  className="group flex aspect-square min-w-0 flex-col items-center justify-center gap-3 rounded-md border border-line bg-canvas p-2 text-ink transition-colors hover:border-line-strong hover:bg-surface"
                >
                  <img
                    src={`/arlo-icons/${name}.preview.svg`}
                    alt=""
                    width={30}
                    height={30}
                    loading="lazy"
                    className="size-[30px] dark:invert"
                  />
                  <span className="w-full truncate font-mono text-[9.5px] text-ink-3 group-hover:text-ink-2">
                    {displayName(name)}
                  </span>
                </button>
              ))}
            </div>

            {visibleCount < filtered.length ? (
              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="rounded-full border border-line-strong bg-canvas px-4 py-2 text-[12.5px] text-ink-2 hover:bg-surface"
                >
                  Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
                </button>
              </div>
            ) : null}

            {filtered.length === 0 ? <EmptySearch /> : null}
          </>
        )}
      </div>

      {selected ? <StaticIconDialog name={selected} onClose={() => setSelected(null)} /> : null}
      {selectedAnimated ? (
        <AnimatedIconDialog
          name={selectedAnimated}
          source={animatedSource}
          onClose={() => setSelectedAnimated(null)}
        />
      ) : null}
    </main>
  );
}

function AnimatedGrid({
  names,
  onSelect,
}: {
  names: AnimatedIconName[];
  onSelect: (name: AnimatedIconName) => void;
}) {
  if (names.length === 0) return <EmptySearch />;

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {names.map((name) => (
        <AnimatedCard key={name} name={name} onSelect={() => onSelect(name)} />
      ))}
    </div>
  );
}

function AnimatedCard({ name, onSelect }: { name: AnimatedIconName; onSelect: () => void }) {
  const { active, isOneShot, preview } = useAnimatedIconPreview(name);
  const definition = animatedIconDefinitions[name];
  const currentLabel = active ? definition.labels[1] : definition.labels[0];

  return (
    <div className="group grid min-h-44 grid-cols-[88px_1fr] items-center gap-4 rounded-md border border-line bg-surface p-4 transition-colors hover:border-line-strong">
      <button
        type="button"
        onClick={preview}
        className="flex size-[88px] items-center justify-center rounded-md border border-line bg-canvas text-ink transition-colors hover:border-line-strong hover:bg-canvas/70"
        aria-label={`Preview ${definition.labels[0]} to ${definition.labels[1]} animation`}
      >
        <AnimatedIconPreview name={name} active={active} size={40} />
      </button>
      <div className="min-w-0">
        <span className="block text-[15px] font-medium text-ink">
          {definition.labels[0]} → {definition.labels[1]}
        </span>
        <span className="mt-1 block font-mono text-[11px] text-ink-3">{name}</span>
        <span className="mt-3 block text-[11px] text-ink-3" aria-live="polite">
          {isOneShot ? (active ? 'Playing animation' : 'Ready to preview') : `Current: ${currentLabel}`}
        </span>
        <span className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={preview}
            className="h-8 rounded-md border border-line-strong bg-canvas px-3 text-[11.5px] font-medium text-ink-2 transition-colors hover:bg-line"
          >
            {isOneShot && active ? 'Replay animation' : 'Preview animation'}
          </button>
          <button
            type="button"
            onClick={onSelect}
            className="h-8 rounded-md bg-ink px-3 text-[11.5px] font-medium text-canvas transition-opacity hover:opacity-90"
            aria-label={`Use ${definition.labels[0]} to ${definition.labels[1]} icon`}
          >
            Use this icon
          </button>
        </span>
      </div>
    </div>
  );
}

function StaticIconDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const [copied, setCopied] = useState<'svg' | 'jsx' | null>(null);
  const component = componentName(name);

  async function copySvg() {
    const response = await fetch(`/arlo-icons/${name}.svg`);
    await copyText(await response.text());
    setCopied('svg');
  }

  async function copyJsx() {
    await copyText(
      `import { ${component} } from '@arloui/icons';\n\n<${component} width={24} height={24} color="currentColor" />`,
    );
    setCopied('jsx');
  }

  return (
    <DialogShell title={displayName(name)} onClose={onClose}>
      <div className="flex h-48 items-center justify-center rounded-md border border-line bg-white text-black">
        <img
          src={`/arlo-icons/${name}.preview.svg`}
          alt=""
          width={72}
          height={72}
          className="size-[72px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <DialogButton onClick={copySvg}>{copied === 'svg' ? 'Copied' : 'Copy SVG'}</DialogButton>
        <DialogButton onClick={copyJsx}>{copied === 'jsx' ? 'Copied' : 'Copy JSX'}</DialogButton>
      </div>
    </DialogShell>
  );
}

function AnimatedIconDialog({
  name,
  source,
  onClose,
}: {
  name: AnimatedIconName;
  source: string;
  onClose: () => void;
}) {
  const { active, isOneShot, preview } = useAnimatedIconPreview(name);
  const [copied, setCopied] = useState<'source' | 'usage' | null>(null);
  const definition = animatedIconDefinitions[name];
  const resetAfter = ONE_SHOT_DURATIONS[name];
  const usage = isOneShot
    ? `import { useState } from 'react';
import { Pressable } from 'react-native';
import { AnimatedIcon } from '@/components/ui/animated-icon';

const [active, setActive] = useState(false);

<Pressable onPress={() => setActive(true)}>
  <AnimatedIcon
    name="${name}"
    active={active}
    autoResetAfter={${resetAfter}}
    onAutoReset={() => setActive(false)}
  />
</Pressable>`
    : `import { useState } from 'react';
import { Pressable } from 'react-native';
import { AnimatedIcon } from '@/components/ui/animated-icon';

const [active, setActive] = useState(false);

<Pressable onPress={() => setActive((value) => !value)}>
  <AnimatedIcon name="${name}" active={active} />
</Pressable>`;

  return (
    <DialogShell title={`${definition.labels[0]} → ${definition.labels[1]}`} onClose={onClose}>
      <div className="flex h-48 w-full items-center justify-center rounded-md border border-line bg-surface text-ink">
        <AnimatedIconPreview name={name} active={active} size={72} />
      </div>
      <div className="flex items-center justify-between gap-3 text-[12px] text-ink-3">
        <span aria-live="polite">
          {isOneShot
            ? active
              ? 'Playing animation'
              : 'Ready to preview'
            : `Current: ${active ? definition.labels[1] : definition.labels[0]}`}
        </span>
        <span>Phosphor-style · react-native-svg · reanimated</span>
      </div>
      <button
        type="button"
        onClick={preview}
        className="h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-[12.5px] font-medium text-ink transition-colors hover:bg-line"
      >
        {isOneShot && active ? 'Replay animation' : 'Preview animation'}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <DialogButton
          onClick={async () => {
            await copyText(source);
            setCopied('source');
          }}
        >
          {copied === 'source' ? 'Component copied' : 'Copy component source'}
        </DialogButton>
        <DialogButton
          onClick={async () => {
            await copyText(usage);
            setCopied('usage');
          }}
        >
          {copied === 'usage' ? 'Example copied' : 'Copy usage example'}
        </DialogButton>
      </div>
      <code className="block rounded-md border border-line bg-surface px-3 py-2.5 font-mono text-[11px] text-ink-2">
        npx arloui add animated-icons
      </code>
    </DialogShell>
  );
}

function useAnimatedIconPreview(name: AnimatedIconName) {
  const [active, setActive] = useState(false);
  const resetAfter = ONE_SHOT_DURATIONS[name];
  const isOneShot = resetAfter !== undefined;

  useEffect(() => {
    if (!active || resetAfter === undefined) return;
    const timer = window.setTimeout(() => setActive(false), resetAfter);
    return () => window.clearTimeout(timer);
  }, [active, resetAfter]);

  function preview() {
    if (!isOneShot) {
      setActive((value) => !value);
      return;
    }

    setActive(false);
    window.requestAnimationFrame(() => setActive(true));
  }

  return { active, isOneShot, preview };
}

function DialogShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
    >
      <button
        type="button"
        className="absolute inset-0 bg-scrim"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative z-10 w-full max-w-[480px] rounded-lg border border-line bg-canvas p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="truncate text-[17px] font-medium text-ink">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 hover:bg-surface"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

function DialogButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 rounded-md bg-ink px-3 text-[12.5px] font-medium text-canvas hover:opacity-90"
    >
      {children}
    </button>
  );
}

function EmptySearch() {
  return (
    <div className="mt-16 text-center">
      <div className="text-[15px] text-ink">No matching icons</div>
      <div className="mt-1 text-[13px] text-ink-3">Try a shorter or more general name.</div>
    </div>
  );
}
