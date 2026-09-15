/**
 * Static previews for the six chart forms.
 *
 * The site has no `react-native` dependency, so these are hand-built SVG/CSS
 * rather than the real components — same geometry and the same palette tokens,
 * but they don't scrub. The live, interactive version is the playground route
 * (`/chart`, `/chart/bar`, …), reached through `DevicePreview`.
 */
import { CHART_SERIES, chartPositive } from './chart-preview-palette';

const SERIES = [
  912, 918, 927, 921, 934, 946, 941, 958, 972, 966, 981, 995, 989, 1004, 1018,
  1012, 1031, 1044, 1039, 1058, 1072, 1066, 1085, 1099, 1094, 1112, 1128, 1121,
  1141, 1156,
];

/** Points first, so callers can both draw the path and place a dot on its end. */
function linePoints(values: number[], w: number, h: number, inset = 3) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const usable = h - inset * 2;
  // Inset horizontally too, or an end dot sits half-clipped on the viewBox edge.
  return values.map((v, i) => ({
    x: inset + (i / (values.length - 1)) * (w - inset * 2),
    y: inset + (1 - (v - min) / span) * usable,
  }));
}

function toPath(points: { x: number; y: number }[]) {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');
}

function linePath(values: number[], w: number, h: number, inset = 3) {
  return toPath(linePoints(values, w, h, inset));
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure aria-label={label} className="m-0 min-w-0">
      {children}
    </figure>
  );
}

/** Scrubbable single-series line — shown at rest, with its value readout. */
export function ChartLinePreview() {
  const w = 320;
  const h = 120;
  const d = linePath(SERIES, w, h);
  const last = SERIES[SERIES.length - 1]!;
  const first = SERIES[0]!;
  const delta = last - first;

  return (
    <Frame label="Chart — line">
      <p className="text-[30px] leading-none font-bold tracking-tight text-ink tabular-nums">
        ${last.toFixed(2)}
      </p>
      <p className="mt-1.5 text-[14px] font-semibold" style={{ color: chartPositive }}>
        +${delta.toFixed(2)}
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" role="img" aria-label="Rising series">
        <defs>
          <linearGradient id="docChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={chartPositive} stopOpacity="0.22" />
            <stop offset="1" stopColor={chartPositive} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#docChartFill)" />
        <path d={d} fill="none" stroke={chartPositive} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="mt-3 flex gap-1.5">
        {['1D', '1W', '1M', '1Y', 'ALL'].map((p, i) => (
          <span
            key={p}
            className={`rounded-md px-2 py-1 font-mono text-[11px] ${
              i === 0 ? 'bg-surface-raised text-ink' : 'text-ink-3'
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    </Frame>
  );
}

/** Inline line with everything else removed. */
export function ChartSparklinePreview() {
  return (
    <Frame label="Portfolio sparkline">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-ink-2">Portfolio</p>
          <p className="mt-1 text-[20px] font-medium text-ink tabular-nums">$1,156.00</p>
        </div>
        <svg viewBox="0 0 140 28" className="w-[42%] shrink-0" role="img" aria-label="Rising portfolio trend">
          <path d={linePath(SERIES, 140, 28)} fill="none" stroke={chartPositive} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </Frame>
  );
}

/** Categorical bars, negatives below the baseline. */
export function ChartBarPreview() {
  const bars = [
    { label: 'M', value: 42 },
    { label: 'T', value: 28 },
    { label: 'W', value: 61 },
    { label: 'T', value: 35 },
    { label: 'F', value: 74 },
    { label: 'S', value: 18 },
    { label: 'S', value: 12 },
  ];
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <Frame label="Chart.Bar">
      <div className="flex h-[150px] items-end gap-1.5">
        {/*
          Keyed by position, not label. The labels are weekday initials — M T W
          T F S S — so two Ts and two Ss collide, and React drops one of each
          pair. A day's identity here *is* its place in the week.
        */}
        {bars.map((b, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] text-ink-3 tabular-nums">${b.value}</span>
            <div
              className="w-full rounded-[4px]"
              style={{ height: `${(b.value / max) * 100}px`, background: CHART_SERIES[0] }}
            />
            <span className="font-mono text-[10px] text-ink-3">{b.label}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** Part-to-whole, legend mandatory. */
export function ChartDonutPreview() {
  const slices = [
    { label: 'Rent', value: 1200 },
    { label: 'Food', value: 480 },
    { label: 'Travel', value: 320 },
    { label: 'Utilities', value: 180 },
  ];
  const total = slices.reduce((n, s) => n + s.value, 0);
  const size = 148;
  const r = 58;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <Frame label="Chart.Donut">
      <div className="flex flex-col items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Spend by category">
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {slices.map((s, i) => {
              const len = (s.value / total) * c;
              const dash = `${Math.max(0, len - 2)} ${c - len + 2}`;
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={CHART_SERIES[i % CHART_SERIES.length]}
                  strokeWidth="16"
                  strokeDasharray={dash}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
          </g>
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            className="fill-ink font-semibold tabular-nums"
            fontSize="19"
          >
            ${total.toLocaleString()}
          </text>
          <text x="50%" y="60%" textAnchor="middle" className="fill-ink-3" fontSize="10">
            Monthly spend
          </text>
        </svg>
        <ul className="w-full space-y-1.5">
          {slices.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2 text-[12.5px]">
              <span
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ background: CHART_SERIES[i % CHART_SERIES.length] }}
              />
              <span className="flex-1 text-ink-2">{s.label}</span>
              <span className="font-mono text-[11px] text-ink-3 tabular-nums">
                ${s.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/** One value against a target, as a bar or a ring. */
export function ChartMeterPreview() {
  const rows = [
    { label: 'Storage', value: 53, color: CHART_SERIES[0]! },
  ];

  return (
    <Frame label="Chart.Meter">
      <div className="space-y-3.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-[13px] text-ink-2">{r.label}</span>
              <span className="font-mono text-[11px] text-ink-3 tabular-nums">{r.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
              <div
                className="h-full rounded-full"
                style={{ width: `${r.value}%`, background: r.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/**
 * A month of days as filled and empty squares — the sixth form, and the one the
 * page kept claiming without ever drawing.
 *
 * Deterministic rather than random: this renders on the server and again on the
 * client, and a grid that disagrees with itself between the two is a hydration
 * mismatch. The pattern is a fixed bitmask so both passes draw the same month.
 */
export function ChartHeatmapPreview() {
  const weeks = 5;
  const days = weeks * 7;
  // Four intensity steps, tinted from one hue — intensity is a magnitude, so it
  // does not spend the categorical palette.
  const level = (index: number) => (index * 7) % 11;
  const tint = (value: number) =>
    value === 0 ? undefined : 0.25 + (0.75 * Math.min(3, Math.floor(value / 3))) / 3;

  return (
    <Frame label="Chart.Heatmap">
      <div className="space-y-1.5">
        <div className="grid grid-cols-7 gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((initial, index) => (
            // Keyed by position: the weekday initials repeat.
            <span key={index} className="text-center font-mono text-[10px] text-ink-3">
              {initial}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: days }, (_, index) => {
            const alpha = tint(level(index));
            return (
              <div
                key={index}
                className="aspect-square rounded-[3px] bg-surface-raised"
                style={alpha ? { background: CHART_SERIES[0], opacity: alpha } : undefined}
              />
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

export const chartPreviews = {
  'chart-line': ChartLinePreview,
  'chart-bar': ChartBarPreview,
  'chart-sparkline': ChartSparklinePreview,
  'chart-donut': ChartDonutPreview,
  'chart-meter': ChartMeterPreview,
  'chart-heatmap': ChartHeatmapPreview,
};
