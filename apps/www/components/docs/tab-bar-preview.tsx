'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { PhoneFrame, PreviewCard } from '@/components/ui/PhoneFrame';
import { cn } from '@/lib/cn';

type Width = 'full' | 'floating';
type Surface = 'transparent' | 'filled';
type Behavior = 'fixed' | 'on scroll';

const TABS = [
  { label: 'Home', icon: 'monitor' as const },
  { label: 'Search', icon: 'magnifying-glass' as const },
  { label: 'Saved', icon: 'star' as const },
  { label: 'Profile', icon: 'list' as const },
];

export function TabBarPhonePreview() {
  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <TabBarScreen width="floating" surface="filled" behavior="on scroll" />
      </PhoneFrame>
    </PreviewCard>
  );
}

export function TabBarDocPlayground() {
  const [width, setWidth] = useState<Width>('floating');
  const [surface, setSurface] = useState<Surface>('filled');
  const [behavior, setBehavior] = useState<Behavior>('on scroll');
  const [labels, setLabels] = useState(false);

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; behavior</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Width and surface are independent. Select tabs or scroll the preview to exercise the motion.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(280px,330px)] md:items-start">
        <div className="space-y-4">
          <ControlRow label="Width">
            {(['full', 'floating'] as const).map((item) => (
              <Chip key={item} active={width === item} onClick={() => setWidth(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
          <ControlRow label="Surface">
            {(['transparent', 'filled'] as const).map((item) => (
              <Chip key={item} active={surface === item} onClick={() => setSurface(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
          <ControlRow label="Labels">
            <Chip active={!labels} onClick={() => setLabels(false)}>
              Icons only
            </Chip>
            <Chip active={labels} onClick={() => setLabels(true)}>
              Show
            </Chip>
          </ControlRow>
          <ControlRow label="Behavior">
            {(['fixed', 'on scroll'] as const).map((item) => (
              <Chip key={item} active={behavior === item} onClick={() => setBehavior(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
        </div>

        <div className="flex justify-center rounded-xl border border-line bg-canvas p-4 md:sticky md:top-3">
          <div className="w-full max-w-[300px] overflow-hidden rounded-[24px] border border-line-strong">
            <TabBarScreen
              width={width}
              surface={surface}
              behavior={behavior}
              labels={labels}
              compact
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TabBarScreen({
  width,
  surface,
  behavior,
  labels = false,
  compact = false,
}: {
  width: Width;
  surface: Surface;
  behavior: Behavior;
  labels?: boolean;
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  return (
    <div
      className={cn('relative bg-[#F9FAFB] dark:bg-[#09090B]', compact ? 'h-[430px]' : 'h-full')}
    >
      <div
        className="h-full overflow-y-auto px-3 pt-7 pb-24 [scrollbar-width:none]"
        onScroll={(event) => {
          if (behavior === 'fixed') return;
          const next = event.currentTarget.scrollTop;
          if (next <= 12) setHidden(false);
          else if (next - lastScroll.current > 10) setHidden(true);
          else if (lastScroll.current - next > 10) setHidden(false);
          lastScroll.current = next;
        }}
      >
        <div className="mb-4 flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-[#155DFC]" />
          <div className="space-y-1.5">
            <div className="h-2 w-20 rounded-full bg-ink" />
            <div className="h-1.5 w-12 rounded-full bg-line-strong" />
          </div>
        </div>
        {['#BFDBFE', '#BBF7D0', '#FED7AA', '#E9D5FF', '#FECACA', '#BAE6FD'].map((color) => (
          <div key={color} className="mb-4">
            <div
              className={cn('w-full rounded-xl', compact ? 'h-36' : 'h-44')}
              style={{ backgroundColor: color }}
            />
            <div className="mt-2 flex gap-2 text-ink-2">
              <span className="size-2 rounded-full bg-current" />
              <span className="h-2 w-10 rounded-full bg-current opacity-35" />
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'absolute inset-x-0 bottom-3 z-10 transition-all duration-200 ease-out',
          hidden && 'translate-y-20 opacity-20',
        )}
      >
        <div
          className={cn(
            'relative mx-auto flex h-14 overflow-hidden border-line text-ink-3 transition-[width,background-color,border-radius] duration-200',
            width === 'floating' ? 'w-[92%] rounded-full border p-1 shadow-lg' : 'w-full border-t',
            surface === 'filled' ? 'bg-canvas/95 backdrop-blur-xl' : 'bg-transparent',
          )}
        >
          <span
            className={cn(
              'pointer-events-none absolute transition-transform duration-300 ease-out',
              width === 'floating'
                ? 'top-1 bottom-1 rounded-full bg-surface-strong'
                : 'top-0 h-0.5 bg-[#155DFC]',
            )}
            style={{
              width: width === 'floating' ? 'calc((100% - 8px) / 4)' : '11.5%',
              left: width === 'floating' ? 4 : `${active * 25 + 6.75}%`,
              transform: width === 'floating' ? `translateX(${active * 100}%)` : undefined,
            }}
          />
          {TABS.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              aria-label={tab.label}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={cn(
                'relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 transition-colors active:scale-[0.97]',
                active === index ? 'text-[#155DFC] dark:text-[#51A2FF]' : 'text-ink-3',
              )}
            >
              <Icon name={tab.icon} size={21} />
              {labels ? (
                <span className="max-w-full truncate text-[9px] font-semibold">{tab.label}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
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
