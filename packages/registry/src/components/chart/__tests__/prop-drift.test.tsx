/**
 * Every prop must change something.
 *
 * The most repeated defect in this component was a prop declared in the type
 * and never read in the body: `curve` did nothing on three forms, the
 * horizontal layout ignored most of what it accepted, the heatmap's range was
 * inert, and the meter's density moved nothing you could see. Each was found by
 * eye on a simulator, which is the slowest and least reliable place to find it.
 *
 * This renders each form twice — once at a prop's default, once at another
 * value — and fails if the output is byte-identical. It cannot prove a prop is
 * *correct*; it proves the prop is *connected*, which is the failure that
 * actually kept happening.
 */
import { BarChart } from '../bar-chart';
import { DonutChart } from '../donut-chart';
import { Meter } from '../meter';
import { Sparkline } from '../sparkline';
import { Heatmap } from '../heatmap';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

const SERIES = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 30 },
  { label: 'Wed', value: 8 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 17 },
];
const SECOND = [
  { label: 'Mon', value: 6 },
  { label: 'Tue', value: 9 },
  { label: 'Wed', value: 4 },
  { label: 'Thu', value: 11 },
  { label: 'Fri', value: 7 },
];
const SLICES = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
];
const DAYS = Array.from({ length: 20 }, (_, i) => ({
  date: `2026-03-${String(i + 1).padStart(2, '0')}`,
  value: (i % 5) + 1,
}));

/** Lay the chart out, then take the whole tree as a string. */
function shapeOf(render: () => React.ReactElement): string {
  const r = renderWithTheme(render());
  const layoutable = screen.UNSAFE_root
    .findAllByType('View' as never)
    .filter((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
  for (const node of layoutable) {
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width: 320, height: 180, x: 0, y: 0 } },
    });
  }
  const json = JSON.stringify(r.toJSON());
  r.unmount();
  return json;
}

/** Each case: a name, the baseline render, and the same render with one prop moved. */
const CASES: [string, () => React.ReactElement, () => React.ReactElement][] = [
  ['BarChart layout', () => <BarChart data={SERIES} />, () => <BarChart data={SERIES} layout="horizontal" />],
  // Stacking needs two series to mean anything, so the case has to supply them.
  ['BarChart variant', () => <BarChart data={SERIES} series={[SECOND]} />, () => <BarChart data={SERIES} series={[SECOND]} variant="stacked" />],
  ['BarChart spacing', () => <BarChart data={SERIES} />, () => <BarChart data={SERIES} spacing="loose" />],
  ['BarChart density', () => <BarChart data={SERIES} />, () => <BarChart data={SERIES} density="compact" />],
  ['BarChart tone', () => <BarChart data={SERIES} />, () => <BarChart data={SERIES} tone="positive" />],
  ['BarChart height', () => <BarChart data={SERIES} />, () => <BarChart data={SERIES} height={240} />],
  ['BarChart maxValue', () => <BarChart data={SERIES} />, () => <BarChart data={SERIES} maxValue={200} />],
  ['BarChart loading', () => <BarChart data={SERIES} />, () => <BarChart data={SERIES} loading />],

  ['Donut thickness', () => <DonutChart data={SLICES} />, () => <DonutChart data={SLICES} thickness={40} />],
  ['Donut size', () => <DonutChart data={SLICES} />, () => <DonutChart data={SLICES} size={240} />],
  ['Donut density', () => <DonutChart data={SLICES} />, () => <DonutChart data={SLICES} density="compact" />],
  ['Donut maxSlices', () => <DonutChart data={SLICES} />, () => <DonutChart data={SLICES} maxSlices={2} />],
  ['Donut loading', () => <DonutChart data={SLICES} />, () => <DonutChart data={SLICES} loading />],

  ['Meter shape', () => <Meter value={53} />, () => <Meter value={53} shape="ring" />],
  ['Meter tone', () => <Meter value={53} />, () => <Meter value={53} tone="positive" />],
  ['Meter density', () => <Meter value={53} shape="ring" />, () => <Meter value={53} shape="ring" density="compact" />],
  ['Meter thickness', () => <Meter value={53} shape="ring" />, () => <Meter value={53} shape="ring" thickness={20} />],
  ['Meter size', () => <Meter value={53} shape="ring" />, () => <Meter value={53} shape="ring" size={200} />],
  ['Meter warnAt', () => <Meter value={80} />, () => <Meter value={80} warnAt={0.5} />],
  ['Meter loading', () => <Meter value={53} />, () => <Meter value={53} loading />],

  ['Sparkline curve', () => <Sparkline data={SERIES} width={120} curve="smooth" />, () => <Sparkline data={SERIES} width={120} curve="steep" />],
  ['Sparkline tone', () => <Sparkline data={SERIES} width={120} />, () => <Sparkline data={SERIES} width={120} tone="negative" />],
  ['Sparkline density', () => <Sparkline data={SERIES} width={120} />, () => <Sparkline data={SERIES} width={120} density="default" />],
  ['Sparkline height', () => <Sparkline data={SERIES} width={120} />, () => <Sparkline data={SERIES} width={120} height={60} />],
  ['Sparkline strokeWidth', () => <Sparkline data={SERIES} width={120} />, () => <Sparkline data={SERIES} width={120} strokeWidth={5} />],
  ['Sparkline loading', () => <Sparkline data={SERIES} width={120} />, () => <Sparkline data={SERIES} width={120} loading />],

  // 3 is the default, so comparing against it proves nothing.
  ['Heatmap levels', () => <Heatmap data={DAYS} />, () => <Heatmap data={DAYS} levels={5} />],
  ['Heatmap loading', () => <Heatmap data={DAYS} />, () => <Heatmap data={DAYS} loading />],
];

describe('every prop is connected to something', () => {
  it.each(CASES)('%s changes the render', (_name, base, moved) => {
    expect(shapeOf(moved)).not.toEqual(shapeOf(base));
  });
});
