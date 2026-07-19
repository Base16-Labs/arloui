'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { cn } from '@/lib/cn';

type Appearance = 'plain' | 'underline' | 'filled';
type Tone = 'neutral' | 'accent';
type Layout = 'content' | 'equal';

const ITEMS = ['For you', 'Following', 'Saved'];

export function TabsDocPlayground() {
  const [appearance, setAppearance] = useState<Appearance>('underline');
  const [tone, setTone] = useState<Tone>('accent');
  const [layout, setLayout] = useState<Layout>('equal');

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Appearance &amp; selection</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Switch the presentation without changing the content-navigation contract.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(280px,330px)] md:items-start">
        <div className="space-y-4">
          <ControlRow label="Appearance">
            {(['plain', 'underline', 'filled'] as const).map((item) => (
              <Chip key={item} active={appearance === item} onClick={() => setAppearance(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
          <ControlRow label="Tone">
            {(['neutral', 'accent'] as const).map((item) => (
              <Chip key={item} active={tone === item} onClick={() => setTone(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
          <ControlRow label="Layout">
            {(['content', 'equal'] as const).map((item) => (
              <Chip key={item} active={layout === item} onClick={() => setLayout(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
        </div>

        <div className="flex justify-center rounded-xl border border-line bg-canvas p-4 md:sticky md:top-3">
          <div className="h-[430px] w-full max-w-[300px] overflow-hidden rounded-[24px] border border-line-strong">
            <TabsScreen appearance={appearance} tone={tone} layout={layout} compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function TabsScreen({
  appearance,
  tone,
  layout,
  compact = false,
}: {
  appearance: Appearance;
  tone: Tone;
  layout: Layout;
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  const colors = [
    ['#BFDBFE', '#DDD6FE', '#FED7AA'],
    ['#BBF7D0', '#BAE6FD', '#FBCFE8'],
    ['#FDE68A', '#E9D5FF', '#BFDBFE'],
  ][active];

  return (
    <div className="h-full bg-white text-[#101828] dark:bg-[#101014] dark:text-white">
      <div className="flex h-16 items-center justify-between px-5">
        <strong className="text-[17px] font-semibold">Discover</strong>
        <span className="text-[17px] text-ink-3">☷</span>
      </div>

      <div
        role="tablist"
        aria-label="Discover content"
        className={cn(
          'flex items-center gap-1 px-3',
          appearance === 'filled' && 'gap-2',
          layout === 'content' && 'justify-center',
        )}
      >
        {ITEMS.map((item, index) => {
          const selected = active === index;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(index)}
              className={cn(
                'relative flex h-11 min-w-0 items-center justify-center whitespace-nowrap px-3 text-[12px] font-medium transition-all duration-200 active:scale-[0.97]',
                layout === 'equal' && 'flex-1',
                selected ? 'font-semibold' : 'text-ink-3',
                selected && tone === 'accent' && 'text-[#155DFC] dark:text-[#51A2FF]',
                appearance === 'filled' && 'rounded-full px-4',
                appearance === 'filled' &&
                  selected &&
                  tone === 'neutral' &&
                  'bg-[#E5E7EB] text-[#101828] dark:bg-[#273244] dark:text-white',
                appearance === 'filled' &&
                  selected &&
                  tone === 'accent' &&
                  'bg-[#155DFC] text-white dark:bg-[#2B7FFF]',
              )}
            >
              {item}
              {appearance === 'underline' ? (
                <span
                  className={cn(
                    'absolute inset-x-2 bottom-0 h-0.5 origin-center rounded-full transition-all duration-200',
                    selected ? 'scale-x-100 opacity-100' : 'scale-x-50 opacity-0',
                    tone === 'accent'
                      ? 'bg-[#155DFC] dark:bg-[#51A2FF]'
                      : 'bg-[#101828] dark:bg-white',
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        key={active}
        className={cn('animate-[tabs-content_200ms_ease-out] space-y-3 p-4', compact && 'pt-4')}
      >
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full" style={{ backgroundColor: colors[0] }} />
          <div className="space-y-1.5">
            <div className="h-2 w-20 rounded-full bg-current" />
            <div className="h-1.5 w-12 rounded-full bg-line-strong" />
          </div>
        </div>
        <div className="h-40 rounded-2xl" style={{ backgroundColor: colors[1] }} />
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color, index) => (
            <div key={color} className="space-y-2">
              <div className="h-16 rounded-xl" style={{ backgroundColor: color }} />
              <div
                className={cn('h-1.5 rounded-full bg-line-strong', index === 1 ? 'w-2/3' : 'w-5/6')}
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes tabs-content { from { opacity: .72; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          [class*="tabs-content"] { animation: none; }
        }
      `}</style>
    </div>
  );
}

function ControlRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[100px_1fr] sm:items-center">
      <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
