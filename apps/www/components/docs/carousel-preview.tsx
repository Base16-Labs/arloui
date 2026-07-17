'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { PhoneFrame, PreviewCard } from '@/components/ui/PhoneFrame';

type Snap = 'item' | 'page';
type Indicator = 'dots' | 'none';
type IndicatorPosition = 'below' | 'overlay';

const CARD_LABELS = [
  'Card 1', 'Card 2', 'Card 3', 'Card 4',
  'Card 5', 'Card 6', 'Card 7', 'Card 8',
];

export function CarouselPhonePreview() {
  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <CarouselScreen snap="item" peek indicator="dots" indicatorPosition="below" arrows={false} />
      </PhoneFrame>
    </PreviewCard>
  );
}

export function CarouselDocPlayground() {
  const [snap, setSnap] = useState<Snap>('item');
  const [peek, setPeek] = useState(true);
  const [indicator, setIndicator] = useState<Indicator>('dots');
  const [indicatorPosition, setIndicatorPosition] = useState<IndicatorPosition>('below');
  const [arrows, setArrows] = useState(false);
  const [loop, setLoop] = useState(false);
  const [gap, setGap] = useState(12);
  const [current, setCurrent] = useState(0);

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Snap × peek × indicator × arrows × gap. Click dots or arrows to navigate.
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
          <ControlRow label="Dots">
            {(['below', 'overlay'] as const).map((p) => (
              <Chip key={p} active={indicatorPosition === p} onClick={() => setIndicatorPosition(p)}>{p}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Arrows">
            {['on', 'off'].map((v) => (
              <Chip key={v} active={arrows === (v === 'on')} onClick={() => setArrows(v === 'on')}>{v}</Chip>
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
          <CarouselScreen
            snap={snap}
            peek={peek}
            indicator={indicator}
            indicatorPosition={indicatorPosition}
            arrows={arrows}
            loop={loop}
            gap={gap}
            current={current}
            onNavigate={setCurrent}
          />
        </div>
      </div>
    </section>
  );
}

function CarouselScreen({
  snap,
  peek,
  indicator,
  indicatorPosition = 'below',
  arrows = false,
  loop = false,
  gap: gapPx = 12,
  current = 0,
  onNavigate,
}: {
  snap: Snap;
  peek: boolean;
  indicator: Indicator;
  indicatorPosition?: IndicatorPosition;
  arrows?: boolean;
  loop?: boolean;
  gap?: number;
  current?: number;
  onNavigate?: (i: number) => void;
}) {
  const [idx, setIdx] = useState(current);
  const activeIdx = onNavigate ? current : idx;
  const setActive = onNavigate ?? setIdx;
  const count = CARD_LABELS.length;

  const containerW = 280;
  const peekAmount = peek ? 24 : 0;
  const itemInset = peek ? 0 : 16;
  const gap = gapPx;
  const cardW = snap === 'page' ? containerW : containerW - peekAmount * 2 - (peek ? 0 : itemInset * 2);

  const inset = snap === 'page' ? 0 : peek ? peekAmount : itemInset;
  const tx = -(activeIdx * (cardW + gap)) + inset;

  const canGoPrev = loop || activeIdx > 0;
  const canGoNext = loop || activeIdx < count - 1;

  const goPrev = () => {
    if (loop) { setActive(((activeIdx - 1) % count + count) % count); }
    else if (activeIdx > 0) setActive(activeIdx - 1);
  };
  const goNext = () => {
    if (loop) { setActive((activeIdx + 1) % count); }
    else if (activeIdx < count - 1) setActive(activeIdx + 1);
  };

  const showDotsBelow = indicator === 'dots' && indicatorPosition === 'below';
  const showDotsOverlay = indicator === 'dots' && indicatorPosition === 'overlay';

  return (
    <div className="w-full max-w-[280px]">
      <div className="relative">
        <div className="overflow-hidden" style={{ height: 180 }}>
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ gap, transform: `translateX(${tx}px)` }}
          >
            {CARD_LABELS.map((label) => (
              <div
                key={label}
                className="shrink-0 rounded-xl bg-[#D1D5DC] dark:bg-[#364153]"
                style={{ width: cardW, height: 180 }}
              />
            ))}
          </div>
        </div>

        {showDotsOverlay && (
          <div className="absolute bottom-3 left-0 right-0">
            <Dots count={count} current={activeIdx} onPress={setActive} overlay />
          </div>
        )}
      </div>

      {arrows ? (
        <div
          className="flex items-center pt-3"
          style={{ justifyContent: showDotsBelow ? 'space-between' : 'flex-end', paddingLeft: inset, paddingRight: inset }}
        >
          {showDotsBelow ? (
            <Dots count={count} current={activeIdx} onPress={setActive} />
          ) : <div />}
          <div className="flex gap-2">
            <ArrowBtn direction="left" onClick={goPrev} disabled={!canGoPrev} />
            <ArrowBtn direction="right" onClick={goNext} disabled={!canGoNext} />
          </div>
        </div>
      ) : showDotsBelow ? (
        <Dots count={count} current={activeIdx} onPress={setActive} padded />
      ) : null}
    </div>
  );
}

function Dots({
  count,
  current,
  onPress,
  overlay = false,
  padded = false,
}: {
  count: number;
  current: number;
  onPress: (i: number) => void;
  overlay?: boolean;
  padded?: boolean;
}) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 6,
        justifyContent: padded ? 'center' : undefined,
        paddingTop: padded ? 12 : 0,
        paddingBottom: padded ? 4 : 0,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className="transition-all duration-200"
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            borderRadius: 9999,
            backgroundColor:
              overlay
                ? i === current
                  ? 'var(--accent, #155DFC)'
                  : 'rgba(128,128,128,0.5)'
                : i === current
                  ? 'var(--accent, #155DFC)'
                  : 'var(--border-strong, #D1D5DC)',
          }}
          onClick={() => onPress(i)}
        />
      ))}
    </div>
  );
}

function ArrowBtn({
  direction,
  onClick,
  disabled = false,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised transition-opacity hover:bg-line disabled:opacity-35"
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
    >
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <path
          d={direction === 'left' ? 'M10 3L5 8L10 13' : 'M6 3L11 8L6 13'}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
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
