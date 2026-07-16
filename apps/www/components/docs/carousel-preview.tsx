'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { PhoneFrame, PreviewCard } from '@/components/ui/PhoneFrame';

type Snap = 'item' | 'page';
type Indicator = 'dots' | 'none';

const CARD_LABELS = [
  'Card 1', 'Card 2', 'Card 3', 'Card 4',
  'Card 5', 'Card 6', 'Card 7', 'Card 8',
];

export function CarouselPhonePreview() {
  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <CarouselScreen snap="item" peek indicator="dots" />
      </PhoneFrame>
    </PreviewCard>
  );
}

export function CarouselDocPlayground() {
  const [snap, setSnap] = useState<Snap>('item');
  const [peek, setPeek] = useState(true);
  const [indicator, setIndicator] = useState<Indicator>('dots');
  const [loop, setLoop] = useState(false);
  const [gap, setGap] = useState(12);
  const [current, setCurrent] = useState(0);

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Snap × peek × indicator × loop × gap. Swipe the preview or use dots to navigate.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(280px,330px)] md:items-start">
        <div className="space-y-4">
          <ControlRow label="Snap">
            {(['item', 'page'] as const).map((s) => (
              <Chip key={s} active={snap === s} onClick={() => setSnap(s)}>{s}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Peek">
            {['on', 'off'].map((v) => (
              <Chip key={v} active={peek === (v === 'on')} onClick={() => setPeek(v === 'on')}>{v}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Indicator">
            {(['dots', 'none'] as const).map((i) => (
              <Chip key={i} active={indicator === i} onClick={() => setIndicator(i)}>{i}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Loop">
            {['on', 'off'].map((v) => (
              <Chip key={v} active={loop === (v === 'on')} onClick={() => setLoop(v === 'on')}>{v}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Gap">
            {([0, 4, 8, 12, 16] as const).map((g) => (
              <Chip key={g} active={gap === g} onClick={() => setGap(g)}>{String(g)}</Chip>
            ))}
          </ControlRow>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-canvas p-4 md:sticky md:top-3">
          <CarouselScreen snap={snap} peek={peek} indicator={indicator} gap={gap} current={current} onNavigate={setCurrent} />
        </div>
      </div>
    </section>
  );
}

function CarouselScreen({
  snap,
  peek,
  indicator,
  gap: gapPx = 12,
  current = 0,
  onNavigate,
}: {
  snap: Snap;
  peek: boolean;
  indicator: Indicator;
  gap?: number;
  current?: number;
  onNavigate?: (i: number) => void;
}) {
  const [idx, setIdx] = useState(current);
  const activeIdx = onNavigate ? current : idx;
  const setActive = onNavigate ?? setIdx;

  const containerW = 280;
  const peekAmount = peek ? 24 : 0;
  const gap = gapPx;
  const cardW = snap === 'page' ? containerW : containerW - peekAmount * 2;

  return (
    <div className="w-full max-w-[280px]">
      <div
        className="relative overflow-hidden"
        style={{ height: 180 }}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            gap,
            transform: `translateX(${-(activeIdx * (cardW + gap)) + (peek ? peekAmount : 0)}px)`,
          }}
        >
          {CARD_LABELS.map((label) => (
            <div
              key={label}
              className="shrink-0 rounded-xl bg-[#D1D5DC] dark:bg-[#364153]"
              style={{
                width: cardW,
                height: 180,
              }}
            />
          ))}
        </div>
      </div>

      {indicator === 'dots' && (
        <div className="flex justify-center gap-2 pt-3">
          {CARD_LABELS.map((_, i) => (
            <button
              key={i}
              type="button"
              className="transition-all duration-200"
              style={{
                width: i === activeIdx ? 20 : 7,
                height: 7,
                borderRadius: 9999,
                backgroundColor: i === activeIdx ? 'var(--accent, #155DFC)' : 'var(--border-strong, #D1D5DC)',
              }}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px]">
      <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
