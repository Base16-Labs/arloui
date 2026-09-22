/**
 * Naming a part replaces the whole default composition. That stays — it is the
 * only way to ask for a bare mark — but it used to fail by subtraction and in
 * silence: adding `<Chart.Bar.Amounts />` to put amounts on the bars also took
 * away the category labels and the zero rule, with nothing on screen to say so.
 *
 * These tests pin the warning that replaced the silence, and, just as
 * importantly, pin that it stays quiet when it should.
 */
import { BarChart } from '../bar-chart';
import { DonutChart } from '../donut-chart';
import { Heatmap } from '../heatmap';
import { Meter } from '../meter';
import { Chart } from '../chart';
import { renderWithTheme } from '../../../../test/render';

const BARS = [
  { label: 'Mon', value: 3 },
  { label: 'Tue', value: 5 },
];

let warn: jest.SpyInstance;

beforeEach(() => {
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => warn.mockRestore());

const messages = () => warn.mock.calls.map((call) => String(call[0]));
const said = (needle: string) => messages().some((m) => m.includes(needle));

describe('dropped default parts warn in dev', () => {
  it('names what a partial BarChart tree turned off', () => {
    renderWithTheme(
      <BarChart data={BARS}>
        <BarChart.Amounts />
      </BarChart>,
    );
    expect(said('<Chart.Bar.Categories />')).toBe(true);
    expect(said('<Chart.Bar.Baseline />')).toBe(true);
  });

  it('says nothing when the tree names the defaults back', () => {
    renderWithTheme(
      <BarChart data={BARS}>
        <BarChart.Amounts />
        <BarChart.Categories />
        <BarChart.Baseline />
      </BarChart>,
    );
    expect(said('Chart.Bar')).toBe(false);
  });

  it('says nothing for the uncomposed form, which keeps every default', () => {
    renderWithTheme(<BarChart data={BARS} />);
    expect(said('Chart.Bar')).toBe(false);
  });

  it('warns for a donut that lost its centre figure and legend', () => {
    renderWithTheme(
      <DonutChart data={[{ label: 'a', value: 1 }]}>
        <DonutChart.Label>Spend</DonutChart.Label>
      </DonutChart>,
    );
    expect(said('<Chart.Donut.Value />')).toBe(true);
    expect(said('<Chart.Donut.Legend />')).toBe(true);
  });

  it('warns for a heatmap that lost its day labels and key', () => {
    renderWithTheme(
      <Heatmap data={[]}>
        <Heatmap.DayLabels />
      </Heatmap>,
    );
    expect(said('<Chart.Heatmap.Scale />')).toBe(true);
    expect(said('<Chart.Heatmap.DayLabels />')).toBe(false);
  });

  it('stays silent for `{null}`, which asks for a bare mark on purpose', () => {
    renderWithTheme(<Heatmap data={[]}>{null}</Heatmap>);
    expect(said('Chart.Heatmap')).toBe(false);
  });

  it('warns for a meter whose readout went quiet', () => {
    renderWithTheme(
      <Meter value={0.4}>
        <Meter.Label>Used</Meter.Label>
      </Meter>,
    );
    expect(said('<Chart.Meter.Value />')).toBe(true);
  });

  it('warns when a plot tree drops the crosshair', () => {
    renderWithTheme(
      <Chart data={[1, 2, 3]}>
        <Chart.Plot>
          <Chart.Baseline />
        </Chart.Plot>
      </Chart>,
    );
    expect(said('<Chart.Crosshair />')).toBe(true);
    // A baseline *was* named, so it must not be reported as dropped.
    expect(said('<Chart.Baseline />')).toBe(false);
  });

  it('treats a reference line as standing in for the baseline', () => {
    renderWithTheme(
      <Chart data={[1, 2, 3]}>
        <Chart.Plot>
          <Chart.Reference value={2} />
          <Chart.Crosshair />
        </Chart.Plot>
      </Chart>,
    );
    expect(said('Chart.Plot')).toBe(false);
  });
});
