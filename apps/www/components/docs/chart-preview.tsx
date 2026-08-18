/**
 * Static previews for the five chart forms.
 *
 * The site has no `react-native` dependency, so these are hand-built SVG/CSS
 * rather than the real components — same geometry and the same palette tokens,
 * but they don't scrub. The live, interactive version is the playground route
 * (`/chart`, `/chart/bar`, …), reached through `DevicePreview`.
 */
import { CHART_SERIES, chartNegative, chartPositive } from './chart-preview-palette';

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
    <div className="rounded-xl border border-line bg-canvas p-5">
      <p className="mb-3 font-mono text-[11px] tracking-wide text-ink-3 uppercase">{label}</p>
      {children}
    </div>
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
  const w = 320;
  const h = 44;
  const rows = [
    { label: 'Rising', points: linePoints(SERIES, w, h), color: chartPositive },
    { label: 'Falling', points: linePoints([...SERIES].reverse(), w, h), color: chartNegative },
  ];

  return (
    <Frame label="Chart.Sparkline">
      <div className="space-y-4">
        {rows.map(({ label, points, color }) => {
          const end = points[points.length - 1]!;
          return (
            <div key={label}>
              <p className="mb-1 font-mono text-[10px] tracking-wide text-ink-3 uppercase">
                {label}
              </p>
              <svg
                viewBox={`0 0 ${w} ${h}`}
                className="w-full"
                role="img"
                aria-label={`${label} trend`}
              >
                <path
                  d={toPath(points)}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx={end.x} cy={end.y} r="3" fill={color} />
              </svg>
            </div>
          );
        })}
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
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-1.5">
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
      <div className="flex items-center gap-6">
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
        <ul className="flex-1 space-y-1.5">
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
    { label: 'Goal', value: 42, color: CHART_SERIES[0]! },
    { label: 'Storage', value: 72, color: CHART_SERIES[0]! },
    { label: 'Budget used', value: 88, color: chartNegative },
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

export function ChartFormsPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartLinePreview />
      <ChartSparklinePreview />
      <ChartBarPreview />
      <ChartMeterPreview />
      <div className="md:col-span-2">
        <ChartDonutPreview />
      </div>
    </div>
  );
}
