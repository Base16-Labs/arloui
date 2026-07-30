'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { PhoneFrame, PreviewCard } from '@/components/ui/PhoneFrame';

type Cols = 1 | 2 | 3 | 4;
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

const ITEM_HEIGHTS = [
  120, 90, 140, 100, 110, 85, 130, 95, 115,
  105, 125, 80, 135, 95, 110, 100, 140, 88,
];

const RADIUS_MAP: Record<Radius, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export function GalleryPhonePreview() {
  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <GalleryScreen columns={2} radius="lg" masonry={false} />
      </PhoneFrame>
    </PreviewCard>
  );
}

export function GalleryDocPlayground() {
  const [columns, setColumns] = useState<Cols>(2);
  const [radius, setRadius] = useState<Radius>('lg');
  const [masonry, setMasonry] = useState(false);
  const [gap, setGap] = useState(8);

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Variants &amp; states</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Columns × radius × masonry × gap. Toggle masonry to see variable-height bin-packing.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(280px,330px)] md:items-start">
        <div className="space-y-4">
          <ControlRow label="Columns">
            {([1, 2, 3, 4] as const).map((c) => (
              <Chip key={c} active={columns === c} onClick={() => setColumns(c)}>{String(c)}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Radius">
            {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((r) => (
              <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>{r}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Masonry">
            {['on', 'off'].map((v) => (
              <Chip key={v} active={masonry === (v === 'on')} onClick={() => setMasonry(v === 'on')}>{v}</Chip>
            ))}
          </ControlRow>
          <ControlRow label="Gap">
            {([0, 4, 8, 12, 16] as const).map((g) => (
              <Chip key={g} active={gap === g} onClick={() => setGap(g)}>{String(g)}</Chip>
            ))}
          </ControlRow>
        </div>

        <div className="flex justify-center rounded-xl border border-line bg-canvas p-4 md:sticky md:top-3">
          <GalleryScreen columns={columns} radius={radius} masonry={masonry} gap={gap} />
        </div>
      </div>
    </section>
  );
}

function GalleryScreen({
  columns,
  radius,
  masonry,
  gap: gapPx = 8,
}: {
  columns: Cols;
  radius: Radius;
  masonry: boolean;
  gap?: number;
}) {
  const gap = gapPx;
  const containerW = 280;
  const br = RADIUS_MAP[radius];
  const colW = (containerW - gap * (columns - 1)) / columns;

  if (masonry) {
    const colHeights = new Array(columns).fill(0) as number[];
    const positions: { col: number; top: number }[] = [];

    ITEM_HEIGHTS.forEach((h) => {
      const shortest = colHeights.indexOf(Math.min(...colHeights));
      positions.push({ col: shortest, top: colHeights[shortest]! });
      colHeights[shortest]! += h + gap;
    });

    const totalHeight = Math.max(...colHeights);

    return (
      <div className="relative w-full max-w-[280px]" style={{ height: totalHeight }}>
        {ITEM_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="absolute bg-[#D1D5DC] dark:bg-[#3F3F46]"
            style={{
              top: positions[i]!.top,
              left: positions[i]!.col * (colW + gap),
              width: colW,
              height: h,
              borderRadius: br,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[280px]"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap,
      }}
    >
      {ITEM_HEIGHTS.map((_, i) => (
        <div
          key={i}
          className="bg-[#D1D5DC] dark:bg-[#3F3F46]"
          style={{
            width: colW,
            height: 80,
            borderRadius: br,
          }}
        />
      ))}
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
