import { jest } from '@jest/globals';
import { BarChart } from '../bar-chart';
import { Chart } from '../chart';
import { DonutChart } from '../donut-chart';
import { Meter } from '../meter';
import { Sparkline } from '../sparkline';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

const money = (v: number) => `$${v.toFixed(2)}`;

describe('Sparkline', () => {
  it('is hidden from assistive tech unless given a label', () => {
    const { rerender } = renderWithTheme(<Sparkline data={[1, 4, 2, 8]} width={80} />);
    expect(screen.queryByRole('image')).toBeNull();

    rerender(<Sparkline data={[1, 4, 2, 8]} width={80} accessibilityLabel="7 day trend" />);
    expect(screen.getByRole('image').props.accessibilityLabel).toBe('7 day trend');
  });

  it('survives empty, single-point, and flat series', () => {
    for (const data of [[], [5], [3, 3, 3]]) {
      const { unmount } = renderWithTheme(
        <Sparkline data={data} width={80} accessibilityLabel="probe" />,
      );
      expect(screen.getByRole('image')).toBeTruthy();
      unmount();
    }
  });
});

describe('BarChart', () => {
  const week = [
    { label: 'M', value: 30 },
    { label: 'T', value: 12 },
    { label: 'W', value: 44 },
  ];

  it('labels every bar with its category and value when bars are tappable', () => {
    renderWithTheme(<BarChart data={week} format={money} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: 'M, $30.00' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'W, $44.00' })).toBeTruthy();
  });

  it('reports the tapped bar', () => {
    const onSelect = jest.fn();
    renderWithTheme(<BarChart data={week} onSelect={onSelect} />);
    fireEvent.press(screen.getByRole('button', { name: 'T, 12' }));
    expect(onSelect).toHaveBeenCalledWith(1, week[1]);
  });

  it('marks the selected bar', () => {
    renderWithTheme(<BarChart data={week} selectedIndex={2} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: 'W, 44' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('becomes one summary element when the bars are not tappable', () => {
    // A container element and focusable children cannot coexist, so a static chart
    // announces itself once instead of exposing bars nothing can do anything with.
    renderWithTheme(<BarChart data={week} />);
    expect(screen.getByRole('image').props.accessibilityLabel).toBe(
      'Bar chart, 3 categories, M 30, T 12, W 44',
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('handles negatives and an all-zero series without crashing', () => {
    const { rerender } = renderWithTheme(
      <BarChart
        data={[{ label: 'A', value: -20 }, { label: 'B', value: 40 }]}
        showValues
        onSelect={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'A, -20' })).toBeTruthy();

    rerender(
      <BarChart data={[{ label: 'A', value: 0 }, { label: 'B', value: 0 }]} onSelect={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'A, 0' })).toBeTruthy();
  });

  it('renders an empty chart without crashing', () => {
    renderWithTheme(<BarChart data={[]} />);
    expect(screen.getByRole('image')).toBeTruthy();
  });

  /**
   * The bars are only drawn once the chart has measured itself, so value labels
   * don't exist until a layout lands. Tests that assert on them have to say so.
   */
  function layoutBars(width = 240, height = 160) {
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width, height, x: 0, y: 0 } },
    });
  }

  it('shows no values until a bar is selected, then only that one', () => {
    // A number over every bar is noise; selection is how you read one figure.
    const { rerender } = renderWithTheme(
      <BarChart data={week} format={money} onSelect={() => {}} />,
    );
    layoutBars();
    expect(screen.queryByText('$30.00')).toBeNull();
    expect(screen.queryByText('$44.00')).toBeNull();

    rerender(<BarChart data={week} format={money} selectedIndex={2} onSelect={() => {}} />);
    layoutBars();
    expect(screen.getByText('$44.00')).toBeTruthy();
    expect(screen.queryByText('$30.00')).toBeNull();
  });

  it('still shows every value when asked explicitly', () => {
    renderWithTheme(<BarChart data={week} format={money} showValues onSelect={() => {}} />);
    layoutBars();
    expect(screen.getByText('$30.00')).toBeTruthy();
    expect(screen.getByText('$44.00')).toBeTruthy();
  });
});

describe('DonutChart', () => {
  const spend = [
    { label: 'Rent', value: 1200 },
    { label: 'Food', value: 480 },
    { label: 'Travel', value: 320 },
  ];

  it('renders a legend entry per slice with its share', () => {
    renderWithTheme(<DonutChart data={spend} format={money} />);
    expect(screen.getByRole('button', { name: 'Rent, $1200.00, 60 percent' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Food, $480.00, 24 percent' })).toBeTruthy();
  });

  it('describes the whole breakdown to screen readers', () => {
    renderWithTheme(<DonutChart data={spend} />);
    expect(screen.getByRole('image').props.accessibilityLabel).toBe(
      'Donut chart. Rent 60 percent, Food 24 percent, Travel 16 percent',
    );
  });

  it('folds categories past the palette capacity into a single Other slice', () => {
    const many = [
      { label: 'A', value: 50 },
      { label: 'B', value: 40 },
      { label: 'C', value: 30 },
      { label: 'D', value: 20 },
      { label: 'E', value: 10 },
      { label: 'F', value: 10 },
    ];
    renderWithTheme(<DonutChart data={many} />);

    // Four named slices survive; E and F are summed rather than given new hues.
    expect(screen.getByText('D')).toBeTruthy();
    expect(screen.queryByText('E')).toBeNull();
    expect(screen.getByText('Other')).toBeTruthy();
    // 20 appears both as D's value and as the folded Other total.
    expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(2);
  });

  it('shows the total in the middle and sums only positive slices', () => {
    renderWithTheme(
      <DonutChart data={[{ label: 'A', value: 30 }, { label: 'B', value: -5 }]} centerLabel="Total" />,
    );
    // Once in the centre as the total, once in the legend as slice A — the
    // negative slice is dropped rather than subtracted.
    expect(screen.getAllByText('30')).toHaveLength(2);
    expect(screen.getByText('Total')).toBeTruthy();
    expect(screen.queryByText('B')).toBeNull();
  });

  it('renders an empty state rather than dividing by a zero total', () => {
    renderWithTheme(<DonutChart data={[]} />);
    expect(screen.getByRole('image')).toBeTruthy();
    expect(screen.queryByText('NaN')).toBeNull();
  });

  it('selects a slice on legend press when uncontrolled', () => {
    renderWithTheme(<DonutChart data={spend} />);
    const food = screen.getByRole('button', { name: 'Food, 480, 24 percent' });
    fireEvent.press(food);
    expect(
      screen.getByRole('button', { name: 'Food, 480, 24 percent' }).props.accessibilityState,
    ).toMatchObject({ selected: true });
  });

  it('reports selection to a controlled owner', () => {
    const onSelect = jest.fn();
    renderWithTheme(<DonutChart data={spend} selectedIndex={null} onSelect={onSelect} />);
    fireEvent.press(screen.getByRole('button', { name: 'Rent, 1200, 60 percent' }));
    expect(onSelect).toHaveBeenCalledWith(0, spend[0]);
  });
});

describe('Meter', () => {
  it('exposes progress semantics for the bar shape', () => {
    renderWithTheme(<Meter value={72} max={100} label="Storage" />);
    const meter = screen.getByRole('progressbar', { name: 'Storage' });
    expect(meter.props.accessibilityValue).toMatchObject({ min: 0, max: 100, now: 72, text: '72%' });
  });

  /**
   * The painted number counts up with the fill, so it is mid-sweep on the render
   * these specs inspect. `accessibilityValue.text` carries the settled value —
   * which is the progressbar's actual contract — so that is what they assert.
   */
  it('exposes progress semantics for the ring shape', () => {
    renderWithTheme(<Meter shape="ring" value={1840} max={2000} label="Steps" />);
    const meter = screen.getByRole('progressbar', { name: 'Steps' });
    expect(meter.props.accessibilityValue).toMatchObject({ now: 1840, max: 2000, text: '92%' });
  });

  it('counts the readout up from empty rather than starting at the value', () => {
    renderWithTheme(<Meter shape="ring" value={1840} max={2000} label="Steps" />);
    // First frame is the empty state; the sweep is what carries it to 92%.
    expect(screen.getByText('0%')).toBeTruthy();
    expect(screen.queryByText('92%')).toBeNull();
  });

  it('settles on the target value once the sweep finishes', async () => {
    renderWithTheme(<Meter shape="ring" value={1840} max={2000} label="Steps" />);
    expect(await screen.findByText('92%')).toBeTruthy();
  });

  it('clamps out-of-range values instead of overflowing the track', () => {
    const { rerender } = renderWithTheme(<Meter value={150} max={100} label="Over" />);
    expect(
      screen.getByRole('progressbar', { name: 'Over' }).props.accessibilityValue,
    ).toMatchObject({ text: '100%' });

    rerender(<Meter value={-20} max={100} label="Under" />);
    expect(
      screen.getByRole('progressbar', { name: 'Under' }).props.accessibilityValue,
    ).toMatchObject({ text: '0%' });
  });

  it('does not divide by a zero range', () => {
    renderWithTheme(<Meter value={5} min={10} max={10} label="Flat" />);
    expect(
      screen.getByRole('progressbar', { name: 'Flat' }).props.accessibilityValue,
    ).toMatchObject({ text: '0%' });
    expect(screen.queryByText('NaN%')).toBeNull();
  });

  it('accepts a custom readout', () => {
    renderWithTheme(<Meter value={3} max={5} label="Steps" valueLabel="3 of 5" />);
    expect(screen.getByText('3 of 5')).toBeTruthy();
  });
});

/**
 * The specs above render each form from its own file. This is the other half of
 * the contract: the namespace is how consumers actually reach them, so a form
 * added to a file but never hung off `Chart` would otherwise ship unreachable.
 */
describe('Chart namespace', () => {
  it('exposes every chart form', () => {
    expect(Chart.Sparkline).toBe(Sparkline);
    expect(Chart.Bar).toBe(BarChart);
    expect(Chart.Donut).toBe(DonutChart);
    expect(Chart.Meter).toBe(Meter);
  });

  it('still exposes the parts that compose the scrubbable chart', () => {
    expect(Chart.Value).toBeDefined();
    expect(Chart.Delta).toBeDefined();
    expect(Chart.Plot).toBeDefined();
    expect(Chart.Periods).toBeDefined();
  });

  it('renders a form reached through the namespace', () => {
    renderWithTheme(<Chart.Meter value={3} max={5} label="Steps" valueLabel="3 of 5" />);
    expect(screen.getByText('3 of 5')).toBeTruthy();
  });
});
