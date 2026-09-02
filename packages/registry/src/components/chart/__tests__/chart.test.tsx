import { jest } from '@jest/globals';
import { Chart } from '../index';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

const RISING = [10, 12, 11, 15, 18];
const FALLING = [18, 15, 11, 12, 10];

/** Lays the plot out so width-dependent geometry actually runs. */
function layoutPlot(width = 200, height = 180) {
  fireEvent(screen.getByRole('image'), 'layout', {
    nativeEvent: { layout: { width, height, x: 0, y: 0 } },
  });
}

const money = (v: number) => `$${v.toFixed(2)}`;

/**
 * PanResponder derives its gestureState from `touchHistory`, not from `nativeEvent`,
 * so a bare `{ nativeEvent }` blows up inside TouchHistoryMath. This builds the
 * single-touch shape RN expects alongside the locationX the chart actually reads.
 */
function touchEvent(locationX: number) {
  const touch = {
    touchActive: true,
    startPageX: locationX,
    startPageY: 0,
    startTimeStamp: 0,
    currentPageX: locationX,
    currentPageY: 0,
    currentTimeStamp: 1,
    previousPageX: locationX,
    previousPageY: 0,
    previousTimeStamp: 0,
  };
  return {
    nativeEvent: {
      locationX,
      pageX: locationX,
      pageY: 0,
      identifier: 1,
      touches: [touch],
      changedTouches: [touch],
    },
    touchHistory: {
      touchBank: [undefined, touch],
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 1,
      mostRecentTimeStamp: 1,
    },
  };
}

describe('Chart', () => {
  it('shows the latest value and the change from the first point', () => {
    renderWithTheme(
      <Chart data={RISING}>
        <Chart.Value format={money} />
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );

    // The counter renders per-character and hides itself from assistive tech.
    const opts = { includeHiddenElements: true };
    expect(screen.getAllByText('$', opts).length).toBeGreaterThan(0);
    // 18 - 10 = +8.00 (+80.00%)
    expect(screen.getByText(/\+\$8\.00/)).toBeTruthy();
    expect(screen.getByText(/80\.00%/)).toBeTruthy();
  });

  it('always signs the delta so direction is not carried by colour alone', () => {
    const { rerender } = renderWithTheme(
      <Chart data={FALLING}>
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );
    // Minus sign is U+2212, not a hyphen.
    expect(screen.getByText(/−\$8\.00/)).toBeTruthy();

    rerender(
      <Chart data={RISING}>
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText(/\+\$8\.00/)).toBeTruthy();
  });

  it('describes the series to screen readers in place of the plot', () => {
    renderWithTheme(
      <Chart data={RISING}>
        <Chart.Plot />
      </Chart>,
    );

    const plot = screen.getByRole('image');
    expect(plot.props.accessibilityLabel).toBe(
      'Line chart, 5 points, from 10 to 18, low 10, high 18',
    );
  });

  it('accepts a custom plot description', () => {
    renderWithTheme(
      <Chart data={RISING}>
        <Chart.Plot accessibilityLabel="Portfolio, up 80% today" />
      </Chart>,
    );
    expect(screen.getByRole('image').props.accessibilityLabel).toBe('Portfolio, up 80% today');
  });

  it('renders a period selector and reports the chosen range', () => {
    const onPeriodChange = jest.fn();
    renderWithTheme(
      <Chart data={RISING} periods={['1D', '1W', '1M']} period="1D" onPeriodChange={onPeriodChange}>
        <Chart.Periods />
      </Chart>,
    );

    expect(screen.getByRole('tab', { name: '1D' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    fireEvent.press(screen.getByRole('tab', { name: '1W' }));
    expect(onPeriodChange).toHaveBeenCalledWith('1W');
  });

  it('renders no period selector when given no periods', () => {
    renderWithTheme(
      <Chart data={RISING}>
        <Chart.Periods />
      </Chart>,
    );
    expect(screen.queryByRole('tab')).toBeNull();
  });

  it('survives an empty series and a single point', () => {
    const { rerender } = renderWithTheme(
      <Chart data={[]}>
        <Chart.Value format={money} />
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByRole('image')).toBeTruthy();

    rerender(
      <Chart data={[42]}>
        <Chart.Value format={money} />
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByRole('image')).toBeTruthy();
  });

  it('draws a flat series without dividing by its zero range', () => {
    renderWithTheme(
      <Chart data={[5, 5, 5, 5]}>
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();

    // No range and no change: the delta is unsigned zero, not NaN.
    expect(screen.getByText(/\$0\.00/)).toBeTruthy();
    expect(screen.queryByText(/NaN/)).toBeNull();
  });

  it('does not produce NaN when the baseline is zero', () => {
    renderWithTheme(
      <Chart data={[0, 5, 10]} baseline={0}>
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(screen.queryByText(/NaN/)).toBeNull();
  });

  it('honours a forced tone instead of inferring direction', () => {
    // Spending rises but that is not "good" — the caller overrides the tone.
    renderWithTheme(
      <Chart data={RISING} tone="negative">
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );
    // Still signed positive; only the colour differs.
    expect(screen.getByText(/\+\$8\.00/)).toBeTruthy();
  });

  it('throws when a part is used outside the chart', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(() => renderWithTheme(<Chart.Plot />)).toThrow(
        'Chart.* must be rendered inside <Chart>',
      );
    } finally {
      error.mockRestore();
    }
  });

  it('reads out the scrubbed point while dragging and returns to the latest on release', () => {
    renderWithTheme(
      <Chart data={[10, 20, 30, 40, 50]}>
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );
    const plot = screen.getByRole('image');
    layoutPlot(212); // 200px of usable track after the 6px inset either side

    // Resting state shows the last point: 50 - 10 = +40.
    expect(screen.getByText(/\+\$40\.00/)).toBeTruthy();

    // Drag to the middle of the track -> index 2 (value 30) -> +20.
    fireEvent(plot, 'responderGrant', touchEvent(106));
    expect(screen.getByText(/\+\$20\.00/)).toBeTruthy();

    // Drag back to the start -> index 0 (value 10) -> no change.
    fireEvent(plot, 'responderMove', touchEvent(6));
    expect(screen.getByText(/\$0\.00/)).toBeTruthy();

    fireEvent(plot, 'responderRelease', touchEvent(6));
    expect(screen.getByText(/\+\$40\.00/)).toBeTruthy();
  });

  it('clamps a scrub that runs past either end of the plot', () => {
    renderWithTheme(
      <Chart data={[10, 20, 30]}>
        <Chart.Delta format={money} />
        <Chart.Plot />
      </Chart>,
    );
    const plot = screen.getByRole('image');
    layoutPlot(212);

    fireEvent(plot, 'responderGrant', touchEvent(-500));
    expect(screen.getByText(/\$0\.00/)).toBeTruthy();

    fireEvent(plot, 'responderMove', touchEvent(9999));
    expect(screen.getByText(/\+\$20\.00/)).toBeTruthy();
  });

  it('ignores scrub gestures when no Crosshair part is named', () => {
    renderWithTheme(
      <Chart data={[10, 20, 30]}>
        <Chart.Delta format={money} />
        {/* No Crosshair part named, so the plot does not answer a touch. */}
        <Chart.Plot>{null}</Chart.Plot>
      </Chart>,
    );
    const plot = screen.getByRole('image');
    layoutPlot(212);

    expect(plot.props.onResponderGrant).toBeUndefined();
    expect(screen.getByText(/\+\$20\.00/)).toBeTruthy();
  });
});
