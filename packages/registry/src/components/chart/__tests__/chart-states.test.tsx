/**
 * Loading and empty, across all five forms.
 *
 * These live in their own file because the contract they check is a cross-form
 * one: whatever a chart draws while it waits has to occupy the same footprint the
 * data will, and must never show a number the caller has not supplied. Both are
 * easy to regress one form at a time, which is exactly how they were missing on
 * three of the five to begin with.
 */
import { BarChart } from '../bar-chart';
import { Chart } from '../chart';
import { DonutChart } from '../donut-chart';
import { Meter } from '../meter';
import { Sparkline } from '../sparkline';
import { renderWithTheme, screen } from '../../../../test/render';

const money = (v: number) => `$${v.toFixed(2)}`;
const week = [
  { label: 'M', value: 30 },
  { label: 'T', value: 12 },
  { label: 'W', value: 44 },
];
const spend = [
  { label: 'Rent', value: 1200 },
  { label: 'Food', value: 480 },
];

describe('loading', () => {
  it('announces itself rather than the data it does not have yet', () => {
    renderWithTheme(
      <Chart data={[1, 4, 2, 8]} loading>
        <Chart.Plot accessibilityLabel={undefined} />
      </Chart>,
    );
    expect(screen.getByLabelText('Chart loading')).toBeTruthy();
  });

  it('holds back the donut total and its legend', () => {
    const { rerender } = renderWithTheme(
      <DonutChart data={spend} format={money} centerLabel="Monthly spend" />,
    );
    expect(screen.getByText('$1680.00')).toBeTruthy();
    expect(screen.getByText('Rent')).toBeTruthy();

    rerender(<DonutChart data={spend} format={money} centerLabel="Monthly spend" loading />);
    expect(screen.queryByText('$1680.00')).toBeNull();
    expect(screen.queryByText('Monthly spend')).toBeNull();
    // The legend is the other place the categories would leak out.
    expect(screen.queryByText('Rent')).toBeNull();
  });

  it('keeps the meter label but drops its readout, and never sweeps the fill', () => {
    renderWithTheme(<Meter value={88} max={100} label="Budget used" loading />);
    // The label is known before the value is, so skeletoning it would just flicker.
    expect(screen.getByText('Budget used')).toBeTruthy();
    expect(screen.queryByText('88%')).toBeNull();
  });

  it('suppresses the bars without collapsing the plot', () => {
    renderWithTheme(<BarChart data={week} format={money} onSelect={() => {}} loading />);
    // No bar is pressable while loading — a skeleton you can select is a lie.
    expect(screen.queryByRole('button', { name: 'M, $30.00' })).toBeNull();
  });

  it('does not fall back to the empty label', () => {
    renderWithTheme(<BarChart data={[]} emptyLabel="No data" loading />);
    expect(screen.queryByText('No data')).toBeNull();
  });

  it('leaves a labelled sparkline addressable', () => {
    renderWithTheme(<Sparkline data={[1, 4, 2, 8]} width={80} loading accessibilityLabel="trend" />);
    expect(screen.getByRole('image')).toBeTruthy();
  });
});

describe('empty', () => {
  it('says so on the bar chart', () => {
    renderWithTheme(<BarChart data={[]} emptyLabel="Nothing yet" />);
    expect(screen.getByText('Nothing yet')).toBeTruthy();
  });

  it('says so in the donut centre', () => {
    renderWithTheme(<DonutChart data={[]} emptyLabel="Nothing yet" />);
    expect(screen.getByText('Nothing yet')).toBeTruthy();
  });

  it('renders a sparkline as a rule, not as a caption', () => {
    // A 28px inline box has no room for text, and the number beside it already
    // carries the label — so empty is a flat line and nothing else.
    renderWithTheme(<Sparkline data={[]} width={80} accessibilityLabel="trend" />);
    expect(screen.getByRole('image')).toBeTruthy();
    expect(screen.queryByText('No data')).toBeNull();
  });

  it('distinguishes a one-point series from an empty one', () => {
    const { rerender } = renderWithTheme(
      <Chart data={[]}>
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText('No data')).toBeTruthy();

    rerender(
      <Chart data={[42]}>
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText('Not enough data')).toBeTruthy();
  });
});
