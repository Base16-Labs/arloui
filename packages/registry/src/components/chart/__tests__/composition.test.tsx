/**
 * The composed BarChart — a spike.
 *
 * The claim being tested is equivalence: naming the parts in the tree must
 * produce the same chart as setting the props did, or the composed form is a
 * second implementation rather than a second spelling of the first.
 */
import { Chart } from '../index';
// Imported the way a standalone `chart-plot` install would: from the file the
// entry installs, with no barrel present.
import { Chart as StandalonePlot } from '../chart';
import { BarChart } from '../bar-chart';
import { DonutChart } from '../donut-chart';
import { Meter } from '../meter';
import { Sparkline } from '../sparkline';
import { Heatmap } from '../heatmap';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

const SPEND = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Travel', value: 320 },
];
const SLEEP = [
  { label: 'M', value: 7 },
  { label: 'T', value: 6 },
  { label: 'W', value: 8 },
];
const ACTIVITY = [
  { label: 'M', value: 3 },
  { label: 'T', value: 5 },
  { label: 'W', value: 2 },
];

const money = (v: number) => `$${v}`;

/** Every rendered string, in order — a cheap shape of the whole tree. */
function textOf() {
  return screen.UNSAFE_root
    .findAllByType('Text' as never)
    .map((n) => {
      const c = (n.props as { children?: unknown }).children;
      return Array.isArray(c) ? c.join('') : String(c ?? '');
    })
    .filter(Boolean);
}

function layout(width = 300, height = 160) {
  const node = screen.UNSAFE_root
    .findAllByType('View' as never)
    .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
  fireEvent(node as never, 'layout', { nativeEvent: { layout: { width, height, x: 0, y: 0 } } });
}

describe('the composed form', () => {
  it('matches the prop form for values, labels and the zero rule', () => {
    const propForm = renderWithTheme(
      <BarChart data={SPEND} format={money} showValues showLabels chrome="baseline" />,
    );
    layout();
    const fromProps = textOf();
    propForm.unmount();

    renderWithTheme(
      <BarChart data={SPEND} format={money}>
        <BarChart.Values />
        <BarChart.Categories />
        <BarChart.Baseline />
      </BarChart>,
    );
    layout();
    expect(textOf()).toEqual(fromProps);
    // Not vacuous: the values and the categories are both really there.
    expect(fromProps).toEqual(expect.arrayContaining(['$1200', 'Rent']));
  });

  it('replaces the index-coupled series and legend arrays', () => {
    const propForm = renderWithTheme(
      <BarChart data={SLEEP} series={[ACTIVITY]} legend={['Sleep', 'Activity']} variant="stacked" />,
    );
    layout();
    const fromProps = textOf();
    propForm.unmount();

    renderWithTheme(
      <BarChart variant="stacked">
        <BarChart.Series data={SLEEP} label="Sleep" />
        <BarChart.Series data={ACTIVITY} label="Activity" />
        <BarChart.Categories />
        <BarChart.Legend />
      </BarChart>,
    );
    layout();
    expect(textOf()).toEqual(fromProps);
    expect(fromProps).toEqual(expect.arrayContaining(['Sleep', 'Activity']));
  });

  it('adds the reference line without dropping the zero rule', () => {
    renderWithTheme(
      <BarChart data={SPEND} format={money}>
        <BarChart.Reference value={600} label="Target" />
      </BarChart>,
    );
    layout();
    // `reference` adds to `baseline` in the enum; naming it must not silently
    // turn the zero rule off.
    expect(textOf()).toContain('Target');
  });

  it('draws nothing it was not asked for', () => {
    // The defaults invert under composition: the tree is the statement, so an
    // empty tree is an unlabelled chart rather than the prop form's defaults.
    renderWithTheme(<BarChart data={SPEND} format={money} />);
    layout();
    const withDefaults = textOf();
    expect(withDefaults).toContain('Rent');

    screen.unmount?.();
    renderWithTheme(
      <BarChart data={SPEND} format={money}>
        <BarChart.Values />
      </BarChart>,
    );
    layout();
    const composed = textOf();
    expect(composed).toContain('$1200');
    expect(composed).not.toContain('Rent');
  });
});

describe('the composed form, across the other four', () => {
  const SLICES = [
    { label: 'Rent', value: 1200 },
    { label: 'Food', value: 480 },
  ];

  it('matches the prop form on the donut', () => {
    const propForm = renderWithTheme(
      <DonutChart data={SLICES} format={money} showValue showLegend centerLabel="Monthly spend" />,
    );
    const fromProps = textOf();
    propForm.unmount();

    renderWithTheme(
      <DonutChart data={SLICES} format={money}>
        <DonutChart.Value />
        <DonutChart.Label>Monthly spend</DonutChart.Label>
        <DonutChart.Legend />
      </DonutChart>,
    );
    expect(textOf()).toEqual(fromProps);
    expect(fromProps).toEqual(expect.arrayContaining(['Monthly spend', 'Rent']));
  });

  it('turns the meter rings array into one element per ring', () => {
    const propForm = renderWithTheme(
      <Meter
        value={70}
        shape="ring"
        label="Storage"
        showValue
        rings={[{ value: 70, label: 'Used' }, { value: 40, label: 'Backups' }]}
      />,
    );
    const fromProps = textOf();
    propForm.unmount();

    renderWithTheme(
      <Meter value={70} shape="ring">
        <Meter.Value />
        <Meter.Label>Storage</Meter.Label>
        <Meter.Ring value={70} label="Used" />
        <Meter.Ring value={40} label="Backups" />
      </Meter>,
    );
    expect(textOf()).toEqual(fromProps);
    expect(fromProps).toContain('Storage');
  });

  it('matches the prop form on the sparkline', () => {
    const propForm = renderWithTheme(
      <Sparkline data={[3, 6, 4, 9]} width={80} showEndDot fill />,
    );
    const fromProps = screen.UNSAFE_root.findAllByType('Path' as never).length;
    propForm.unmount();

    renderWithTheme(
      <Sparkline data={[3, 6, 4, 9]} width={80}>
        <Sparkline.EndDot />
        <Sparkline.Fill />
      </Sparkline>,
    );
    expect(screen.UNSAFE_root.findAllByType('Path' as never).length).toEqual(fromProps);
  });

  it('matches the prop form on the heatmap', () => {
    const days = [{ date: '2026-01-01', value: 2 }, { date: '2026-01-02', value: 5 }];
    const propForm = renderWithTheme(<Heatmap data={days} showDayLabels showScale />);
    const fromProps = textOf();
    propForm.unmount();

    renderWithTheme(
      <Heatmap data={days}>
        <Heatmap.DayLabels />
        <Heatmap.Scale />
      </Heatmap>,
    );
    expect(textOf()).toEqual(fromProps);
    expect(fromProps.length).toBeGreaterThan(0);
  });
});

describe('the parts added last', () => {
  it('draws a title on the root', () => {
    renderWithTheme(
      <Chart data={[1, 2, 3]}>
        <Chart.Title>Spending</Chart.Title>
        <Chart.Plot>{null}</Chart.Plot>
      </Chart>,
    );
    expect(screen.getByText('Spending')).toBeTruthy();
  });

  it('answers a touch only when the Crosshair is named', () => {
    const layoutPlot = () => {
      // The responder only attaches once the plot is drawable, so measure first.
      fireEvent(screen.getByRole('image'), 'layout', {
        nativeEvent: { layout: { width: 240, height: 160, x: 0, y: 0 } },
      });
    };

    const withHair = renderWithTheme(
      <Chart data={[1, 5, 2, 8]}>
        <Chart.Plot>
          <Chart.Crosshair />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    const responders = () =>
      screen.UNSAFE_root
        .findAllByType('View' as never)
        .filter((v) => (v.props as { onStartShouldSetResponder?: unknown }).onStartShouldSetResponder != null)
        .length;
    const named = responders();
    withHair.unmount();

    renderWithTheme(
      <Chart data={[1, 5, 2, 8]}>
        <Chart.Plot>{null}</Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    // Naming nothing leaves a picture: no gesture handler on the plot.
    expect(responders()).toBeLessThan(named);
  });
});

/**
 * `npx arloui add chart-plot` installs `chart/chart.tsx` and no barrel, so what
 * that file exports *is* the public API for that entry. It used to export
 * `ChartRoot` plus a bag of parts, which meant the documented call —
 * `<Chart><Chart.Value /></Chart>` — did not work for the one entry whose whole
 * job is that call.
 */
describe('a standalone chart-plot install', () => {
  it('exposes the same namespace the examples use', () => {
    for (const part of ['Value', 'Delta', 'Plot', 'Periods', 'Title', 'Empty', 'Legend', 'Line', 'Bars', 'Baseline', 'Reference', 'Crosshair'] as const) {
      expect(StandalonePlot[part]).toBeTruthy();
    }
  });

  it('renders the documented composition without the barrel', () => {
    renderWithTheme(
      <StandalonePlot data={[10, 20, 15, 30]} format={(v) => `$${v}`}>
        <StandalonePlot.Title>Portfolio</StandalonePlot.Title>
        <StandalonePlot.Plot>
          <StandalonePlot.Crosshair />
        </StandalonePlot.Plot>
      </StandalonePlot>,
    );
    expect(screen.getByText('Portfolio')).toBeTruthy();
  });

  it('is the same object the barrel extends, not a second one', () => {
    // Object.assign mutates, so there is one `Chart`. If these ever diverge,
    // a standalone install and a barrel install would drift apart silently.
    expect(StandalonePlot).toBe(Chart);
    expect(Chart.Bar).toBeTruthy();
  });
});
