"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * Shared data — curves and durations ARE the motion tokens.
 * ------------------------------------------------------------------ */

type Bezier = readonly [number, number, number, number];

const CURVES: { key: string; label: string; value: Bezier; use: string }[] = [
  { key: "ease-out", label: "ease-out", value: [0.23, 1, 0.32, 1], use: "Default. Entrances, exits, pressable return" },
  { key: "ease-in-out", label: "ease-in-out", value: [0.77, 0, 0.175, 1], use: "Moving or morphing on screen" },
  { key: "ease-sheet", label: "ease-sheet", value: [0.32, 0.72, 0, 1], use: "Sheet and drawer gestures" },
];

const DURATIONS: { name: string; ms: number; range: string; use: string }[] = [
  { name: "Instant", ms: 130, range: "100–160 ms", use: "Press feedback, micro-interactions" },
  { name: "Fast", ms: 200, range: "180–220 ms", use: "Tooltips, small popovers, toggles" },
  { name: "Base", ms: 280, range: "220–320 ms", use: "Sheets, drawers, modals, swaps" },
  { name: "Slow", ms: 420, range: "320–480 ms", use: "Shared-element transitions, morphs" },
];

const SPRINGS: { name: string; stiffness: number; damping: number; mass: number; use: string; overshoot: number; ms: number }[] = [
  { name: "snappy", stiffness: 400, damping: 30, mass: 1, use: "Pressable snap-back, toggle bounce", overshoot: 1.08, ms: 420 },
  { name: "gentle", stiffness: 150, damping: 20, mass: 1, use: "Sheet settle, card reposition", overshoot: 1.04, ms: 620 },
  { name: "heavy", stiffness: 300, damping: 40, mass: 1.2, use: "Drag-to-dismiss commit, large surface", overshoot: 1.0, ms: 540 },
];

function cssCurve(v: Bezier): string {
  return `cubic-bezier(${v.join(", ")})`;
}

/** Parametric point on the cubic bezier P0(0,0) P1 P2 P3(1,1) at t. */
function bezierPoint(t: number, [x1, y1, x2, y2]: Bezier): { x: number; y: number } {
  const u = 1 - t;
  const x = 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t;
  const y = 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
  return { x, y };
}

/* ------------------------------------------------------------------ *
 * Easing curves — plot + a dot that travels the curve so you feel it.
 * ------------------------------------------------------------------ */

function CurveCard({ label, value, use }: { label: string; value: Bezier; use: string }) {
  const [t, setT] = useState(1);
  const raf = useRef<number | null>(null);
  const W = 184;
  const H = 132;
  const pad = 16;
  const DUR = 1000;

  const play = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DUR);
      setT(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    setT(0);
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const sx = (x: number) => pad + x * (W - 2 * pad);
  const sy = (y: number) => H - pad - y * (H - 2 * pad);
  const p = bezierPoint(t, value);
  const c1 = { x: sx(value[0]), y: sy(value[1]) };
  const c2 = { x: sx(value[2]), y: sy(value[3]) };

  return (
    <button
      type="button"
      onClick={play}
      className="group flex flex-col rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong"
    >
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {/* grid box */}
        <rect x={pad} y={pad} width={W - 2 * pad} height={H - 2 * pad} className="fill-none stroke-line" strokeWidth={1} />
        {/* control handles */}
        <line x1={sx(0)} y1={sy(0)} x2={c1.x} y2={c1.y} className="stroke-line-strong" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={sx(1)} y1={sy(1)} x2={c2.x} y2={c2.y} className="stroke-line-strong" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={c1.x} cy={c1.y} r={3} className="fill-ink-3" />
        <circle cx={c2.x} cy={c2.y} r={3} className="fill-ink-3" />
        {/* the curve */}
        <path
          d={`M ${sx(0)} ${sy(0)} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${sx(1)} ${sy(1)}`}
          className="fill-none stroke-ink"
          strokeWidth={2}
        />
        {/* travelling dot */}
        <circle cx={sx(p.x)} cy={sy(p.y)} r={5} className="fill-ink" />
      </svg>
      <div className="mt-3 font-mono text-[12px] text-ink">{label}</div>
      <code className="mt-0.5 font-mono text-[10.5px] text-ink-3">{cssCurve(value)}</code>
      <div className="mt-2 text-[12px] leading-relaxed text-ink-2">{use}</div>
      <span className="mt-2 text-[11px] text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
        Tap to replay
      </span>
    </button>
  );
}

export function EasingPlayground() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CURVES.map((c) => (
        <CurveCard key={c.key} label={c.label} value={c.value} use={c.use} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Duration scale — feel 130 ms vs 420 ms on the same entrance.
 * ------------------------------------------------------------------ */

export function DurationPlayground() {
  const [active, setActive] = useState(2);
  const [nonce, setNonce] = useState(0);
  const tier = DURATIONS[active];

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-wrap gap-2">
        {DURATIONS.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => {
              setActive(i);
              setNonce((n) => n + 1);
            }}
            className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${
              i === active
                ? "border-ink bg-ink text-canvas"
                : "border-line bg-canvas text-ink-2 hover:border-line-strong"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex h-32 items-end justify-center overflow-hidden rounded-md bg-canvas">
        <div
          key={nonce}
          className="mb-4 w-3/4 rounded-lg bg-white px-4 py-3 text-center text-[13px] font-medium text-ink shadow-sm ring-1 ring-line dark:bg-surface-raised"
          style={{
            animation: `motion-rise ${tier.ms}ms ${cssCurve(CURVES[0].value)} both`,
          }}
        >
          {tier.name} · {tier.ms}ms
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="font-mono text-[12px] text-ink">{tier.range}</div>
        <div className="text-[12.5px] text-ink-2">{tier.use}</div>
      </div>

      <style>{`
        @keyframes motion-rise {
          from { transform: translateY(36px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Spring presets — tap to fling to target; feel overshoot + settle.
 * ------------------------------------------------------------------ */

function SpringCard({ s }: { s: (typeof SPRINGS)[number] }) {
  const [on, setOn] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="flex flex-col rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong"
    >
      <div className="relative h-10 overflow-hidden rounded-md bg-canvas">
        <div
          className="absolute top-1/2 size-6 -translate-y-1/2 rounded-md bg-ink"
          style={{
            left: on ? "calc(100% - 28px)" : "4px",
            transition: `left ${s.ms}ms cubic-bezier(0.34, ${1.2 + (s.overshoot - 1) * 6}, 0.36, 1)`,
          }}
        />
      </div>
      <div className="mt-3 font-mono text-[12px] text-ink">{s.name}</div>
      <div className="mt-0.5 font-mono text-[10.5px] text-ink-3">
        {s.stiffness} / {s.damping} / {s.mass}
      </div>
      <div className="mt-2 text-[12px] leading-relaxed text-ink-2">{s.use}</div>
    </button>
  );
}

export function SpringPlayground() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {SPRINGS.map((s) => (
        <SpringCard key={s.name} s={s} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Pressable feedback — the universal scale(0.97) recipe.
 * ------------------------------------------------------------------ */

function Pressable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`cursor-pointer select-none ${className ?? ""}`}
      style={{
        transform: `scale(${pressed ? 0.97 : 1})`,
        opacity: pressed ? 0.92 : 1,
        transition: `transform 120ms ${cssCurve(CURVES[0].value)}, opacity 120ms ${cssCurve(CURVES[0].value)}`,
      }}
    >
      {children}
    </div>
  );
}

export function PressablePlayground() {
  return (
    <div className="grid gap-3 rounded-lg border border-line bg-surface p-5 sm:grid-cols-3">
      <Pressable className="flex h-12 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-canvas">
        Button
      </Pressable>
      <Pressable className="flex h-12 items-center gap-3 rounded-lg bg-canvas px-3 ring-1 ring-line">
        <span className="size-6 rounded-md bg-ink/20" />
        <span className="text-[13px] text-ink">List row</span>
      </Pressable>
      <Pressable className="flex h-12 items-center justify-center rounded-xl bg-canvas text-[13px] text-ink-2 ring-1 ring-line">
        Card
      </Pressable>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Reduced motion — reduces, it does not remove.
 * ------------------------------------------------------------------ */

export function ReducedMotionPlayground() {
  const [reduced, setReduced] = useState(false);
  const [nonce, setNonce] = useState(0);
  const replay = () => setNonce((n) => n + 1);

  const sheetAnim = reduced
    ? `motion-fade 280ms ${cssCurve(CURVES[0].value)} both`
    : `motion-sheet 300ms ${cssCurve(CURVES[2].value)} both`;
  const toastAnim = reduced
    ? `motion-fade 200ms ${cssCurve(CURVES[0].value)} both`
    : `motion-toast 200ms ${cssCurve(CURVES[0].value)} both`;

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          role="switch"
          aria-checked={reduced}
          onClick={() => {
            setReduced((v) => !v);
            replay();
          }}
          className="flex items-center gap-2.5"
        >
          <span
            className={`relative h-5 w-9 rounded-full transition-colors ${reduced ? "bg-ink" : "bg-line-strong"}`}
          >
            <span
              className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform"
              style={{ transform: reduced ? "translateX(16px)" : "none" }}
            />
          </span>
          <span className="text-[13px] text-ink">Simulate reduced motion</span>
        </button>
        <button
          type="button"
          onClick={replay}
          className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
        >
          Replay
        </button>
      </div>

      <div key={nonce} className="mt-5 grid gap-3 sm:grid-cols-3">
        {/* sheet */}
        <div className="relative h-28 overflow-hidden rounded-md bg-canvas">
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 rounded-t-xl bg-white shadow-sm dark:bg-surface-raised"
            style={{ animation: sheetAnim }}
          >
            <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-line-strong" />
            <div className="mt-3 text-center text-[12px] font-medium text-ink">Sheet</div>
          </div>
        </div>
        {/* loader — unchanged under reduced motion */}
        <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-md bg-canvas">
          <span className="size-6 animate-spin rounded-full border-2 border-line border-t-ink" />
          <span className="text-[11px] text-ink-3">Loader · always animates</span>
        </div>
        {/* toast */}
        <div className="relative flex h-28 items-start justify-center rounded-md bg-canvas p-3">
          <div
            className="w-full rounded-lg bg-ink px-3 py-2 text-center text-[12px] font-medium text-canvas"
            style={{ animation: toastAnim }}
          >
            Toast
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-ink-2">
        {reduced
          ? "Position and scale are replaced with an opacity fade. Loaders and progress keep animating — they clarify state."
          : "Standard motion: the sheet rises, the toast slides up. Toggle the switch to see the reduced-motion replacement."}
      </p>

      <style>{`
        @keyframes motion-sheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes motion-toast { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes motion-fade  { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
