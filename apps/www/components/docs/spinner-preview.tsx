'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { Chip } from '@/components/ui/Chip';

type Appearance = 'spokes' | 'arc' | 'dots' | 'bars' | 'pulse';
type Size = 'sm' | 'md' | 'lg';
type Tone = 'neutral' | 'accent';

const SIZES: Record<Size, number> = { sm: 16, md: 24, lg: 32 };
const APPEARANCES: Appearance[] = ['spokes', 'arc', 'dots', 'bars', 'pulse'];
const SPOKES = 12;
const BARS = 4;

/**
 * A DOM mirror of the registry Spinner, so the docs show the real thing rather
 * than a screenshot. Geometry and timings track spinner.tsx.
 */
export function Spinner({
  appearance = 'spokes',
  size = 'md',
  tone = 'neutral',
  color,
}: {
  appearance?: Appearance;
  size?: Size | number;
  tone?: Tone;
  color?: string;
}) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const resolved = color ?? (tone === 'accent' ? 'var(--color-accent, #155DFC)' : 'currentColor');
  const shared = { px, color: resolved };

  return (
    <span role="progressbar" aria-busy="true" aria-label="Loading" className="inline-flex">
      {appearance === 'arc' ? (
        <Arc {...shared} />
      ) : appearance === 'dots' ? (
        <Dots {...shared} />
      ) : appearance === 'bars' ? (
        <Bars {...shared} />
      ) : appearance === 'pulse' ? (
        <Pulse {...shared} />
      ) : (
        <Spokes {...shared} />
      )}
    </span>
  );
}

type GlyphProps = { px: number; color: string };

/** Fixed opacity ramp, stepped rotation — the system activity indicator. */
function Spokes({ px, color }: GlyphProps) {
  const length = Math.max(3, px * 0.28);
  const width = Math.max(1.5, px * 0.085);

  return (
    <span
      className="arlo-spinner-motion relative block"
      style={{
        width: px,
        height: px,
        animation: `arlo-spin 900ms steps(${SPOKES}) infinite`,
      }}
    >
      {Array.from({ length: SPOKES }, (_, index) => (
        <span
          key={index}
          className="absolute block"
          style={{
            left: (px - width) / 2,
            top: (px - length) / 2,
            width,
            height: length,
            borderRadius: width / 2,
            background: color,
            opacity: 1 - (index / SPOKES) * 0.85,
            transform: `rotate(${(index * 360) / SPOKES}deg) translateY(${-(px / 2 - length / 2)}px)`,
          }}
        />
      ))}
    </span>
  );
}

/** Faint closed track, one bright segment sweeping round it. */
function Arc({ px, color }: GlyphProps) {
  const width = Math.max(2, px * 0.11);
  const ring: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderWidth: width,
    borderStyle: 'solid',
    borderRadius: '50%',
  };

  return (
    <span className="relative block" style={{ width: px, height: px }}>
      <span style={{ ...ring, borderColor: 'var(--color-line)' }} />
      <span
        className="arlo-spinner-motion"
        style={{
          ...ring,
          borderColor: 'transparent',
          borderTopColor: color,
          borderRightColor: color,
          animation: 'arlo-spin 750ms linear infinite',
        }}
      />
    </span>
  );
}

/** Three dots lifting and fading on a stagger. */
function Dots({ px, color }: GlyphProps) {
  const diameter = Math.max(3, px * 0.3);
  const gap = Math.max(2, px * 0.18);

  return (
    <span className="flex items-center" style={{ height: px, gap }}>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="arlo-spinner-motion block"
          style={
            {
              width: diameter,
              height: diameter,
              borderRadius: '50%',
              background: color,
              opacity: 0.32,
              '--arlo-lift': `${-diameter * 0.45}px`,
              animation: `arlo-spinner-dot 760ms ease-in-out ${index * 140}ms infinite`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

/** An equaliser of bars breathing in sequence. */
function Bars({ px, color }: GlyphProps) {
  const width = Math.max(2, px * 0.15);
  const gap = Math.max(1.5, px * 0.1);

  return (
    <span className="flex items-center" style={{ height: px, gap }}>
      {Array.from({ length: BARS }, (_, index) => (
        <span
          key={index}
          className="arlo-spinner-motion block"
          style={{
            width,
            height: px,
            borderRadius: width / 2,
            background: color,
            transform: 'scaleY(0.35)',
            animation: `arlo-spinner-bar 840ms ease-in-out ${index * 110}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

/** Rings pushing outward from the centre and fading, radar-style. */
function Pulse({ px, color }: GlyphProps) {
  return (
    <span className="relative block" style={{ width: px, height: px }}>
      {[0, 1].map((index) => (
        <span
          key={index}
          className="arlo-spinner-motion absolute block"
          style={{
            inset: 0,
            borderRadius: '50%',
            background: color,
            opacity: 0,
            animation: `arlo-spinner-pulse 1200ms ease-out ${index * 600}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

export function SpinnerDocPlayground() {
  const [appearance, setAppearance] = useState<Appearance>('spokes');
  const [size, setSize] = useState<Size>('lg');
  const [tone, setTone] = useState<Tone>('neutral');

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Appearance &amp; size</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Five loading idioms borrowed from iOS. Pick one per product and stay with it.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(260px,320px)] md:items-start">
        <div className="space-y-4">
          <ControlRow label="Appearance">
            {APPEARANCES.map((item) => (
              <Chip key={item} active={appearance === item} onClick={() => setAppearance(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
          <ControlRow label="Size">
            {(['sm', 'md', 'lg'] as const).map((item) => (
              <Chip key={item} active={size === item} onClick={() => setSize(item)}>
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
        </div>

        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-line bg-canvas p-6 text-ink-2 md:sticky md:top-3">
          <Spinner appearance={appearance} size={size} tone={tone} />
        </div>
      </div>
    </section>
  );
}

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-[86px] shrink-0 text-[12.5px] text-ink-3">{label}</span>
      {children}
    </div>
  );
}
