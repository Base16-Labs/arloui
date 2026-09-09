import { jest } from '@jest/globals';
import { Chart, LineChart } from '../index';
import { LineChart as StandaloneLineChart } from '../chart';
import { BarChart } from '../bar-chart';
import { DonutChart } from '../donut-chart';
import { formatMoney } from '../format';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

const SERIES = [10, 12, 11, 15, 18];

function layoutPlot(width = 212, height = 180) {
  fireEvent(screen.getByRole('image'), 'layout', {
    nativeEvent: { layout: { width, height, x: 0, y: 0 } },
  });
}

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

/**
 * `react-native-svg` normalises a colour prop into a processed `{ type, payload }`
 * object, so distinct hues are only distinguishable by payload — comparing the
 * objects themselves counts every bar as unique. Stroke-only paths are excluded:
 * a bar's fill is what carries its tone.
 */
function barFills(): number[] {
  return screen.UNSAFE_root
    .findAllByType('RNSVGPath' as never)
    .map((node) => node.props as { fill?: { payload?: number }; stroke?: unknown })
    .filter((props) => props.stroke == null && props.fill?.payload != null)
    .map((props) => props.fill?.payload as number);
}

describe('default composition', () => {
  it('exposes LineChart without breaking the existing Chart API', () => {
    expect(LineChart).toBe(Chart);
    expect(StandaloneLineChart).toBe(LineChart);
    expect(LineChart.Plot).toBe(Chart.Plot);
    renderWithTheme(<LineChart data={SERIES} periods={['1D']} />);
    expect(screen.getByRole('image')).toBeTruthy();
    expect(screen.getByRole('tab', { name: '1D' })).toBeTruthy();
  });

  it('renders value, delta, plot, and periods when given no children', () => {
    renderWithTheme(
      <Chart data={SERIES} periods={['1D', '1W']} period="1D" format={formatMoney('USD', { locale: 'en-US' })} />,
    );

    // Plot.
    expect(screen.getByRole('image')).toBeTruthy();
    // Periods.
    expect(screen.getByRole('tab', { name: '1D' })).toBeTruthy();
    // Delta: 18 - 10 = +$8.00.
    expect(screen.getByText(/\+\$8\.00/)).toBeTruthy();
    // Value, drawn per-character by the counter.
    expect(screen.getAllByText('$', { includeHiddenElements: true }).length).toBeGreaterThan(0);
  });

  it('is the same chart as spelling the parts out', () => {
    const { unmount } = renderWithTheme(<Chart data={SERIES} periods={['1D']} period="1D" />);
    const auto = screen.getByRole('image').props.accessibilityLabel;
    unmount();

    renderWithTheme(
      <Chart data={SERIES} periods={['1D']} period="1D">
        <Chart.Value />
        <Chart.Delta />
        <Chart.Plot />
        <Chart.Periods />
      </Chart>,
    );
    expect(screen.getByRole('image').props.accessibilityLabel).toBe(auto);
  });
});

describe('format flows from the root', () => {
  it('formats value and delta without repeating the prop on each part', () => {
    renderWithTheme(<Chart data={SERIES} format={formatMoney('USD', { locale: 'en-US' })} />);
    expect(screen.getByText(/\+\$8\.00/)).toBeTruthy();
  });

  it('lets a part override the root', () => {
    renderWithTheme(
      <Chart data={SERIES} format={formatMoney('USD', { locale: 'en-US' })}>
        <Chart.Delta format={(v) => `${v} pts`} />
      </Chart>,
    );
    expect(screen.getByText(/\+8 pts/)).toBeTruthy();
  });
});

describe('ChartPoint data model', () => {
  const points = [
    { value: 10, at: '2026-01-01', label: 'Jan' },
    { value: 30, at: '2026-02-01', label: 'Feb' },
    { value: 20, at: '2026-03-01', label: 'Mar' },
  ];

  it('reads a series of points as well as a series of numbers', () => {
    renderWithTheme(
      <Chart data={points}>
        <Chart.Delta />
        <Chart.Plot />
      </Chart>,
    );
    // Last point is 20, baseline is the first (10) => +10.
    expect(screen.getByText(/\+10/)).toBeTruthy();
  });

  it('lets the readout say when, not just what', () => {
    renderWithTheme(
      <Chart data={points} formatAt={(at) => `on ${String(at)}`}>
        <Chart.Value />
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText('on 2026-03-01')).toBeTruthy();
  });

  it('follows the scrubbed point’s time while dragging', () => {
    renderWithTheme(
      <Chart data={points} formatAt={(at) => `on ${String(at)}`}>
        <Chart.Value />
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    fireEvent(screen.getByRole('image'), 'responderGrant', touchEvent(6));
    expect(screen.getByText('on 2026-01-01')).toBeTruthy();
  });

  it('falls back to the point’s own label with no formatAt', () => {
    renderWithTheme(
      <Chart data={points}>
        <Chart.Value />
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText('Mar')).toBeTruthy();
  });
});

describe('rare states', () => {
  it('says so when there is no data', () => {
    renderWithTheme(
      <Chart data={[]}>
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByText('No data')).toBeTruthy();
  });

  it('distinguishes "no data" from "not enough data"', () => {
    // One point has a value but no shape, which is a different problem from none.
    renderWithTheme(
      <Chart data={[42]}>
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByText('Not enough data')).toBeTruthy();
    expect(screen.queryByText('No data')).toBeNull();
  });

  /**
   * The slot replaces the composition rather than sitting inside the plot. It
   * needs no layout pass for the same reason: there is no plot left to measure.
   */
  it('takes a custom empty slot in place of the whole composition', () => {
    renderWithTheme(
      <Chart data={[]}>
        <Chart.Empty>No trades yet</Chart.Empty>
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText('No trades yet')).toBeTruthy();
    expect(screen.queryByText('No data')).toBeNull();
  });

  it('announces loading instead of describing a series it does not have', () => {
    renderWithTheme(
      <Chart data={SERIES} loading>
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByRole('image').props.accessibilityLabel).toBe('Chart loading');
  });

  it('does not attach scrub handlers to a plot with nothing to scrub', () => {
    renderWithTheme(
      <Chart data={[42]}>
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByRole('image').props.onResponderGrant).toBeUndefined();
  });
});

describe('chrome', () => {
  function baselineCount() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => (node.props as { strokeDasharray?: unknown }).strokeDasharray)
      .filter(Boolean).length;
  }

  it('draws a dashed baseline by default', () => {
    renderWithTheme(
      <Chart data={SERIES}>
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    expect(baselineCount()).toBe(1);
  });

  it('draws no rule when the plot names no furniture', () => {
    renderWithTheme(
      <Chart data={SERIES}>
        {/* A named child inverts the default: the plot draws only what is in it. */}
        <Chart.Plot>
          <Chart.Line data={[1, 2, 3, 4, 5]} />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    expect(baselineCount()).toBe(0);
  });

  it('draws one labelled line per Reference part', () => {
    renderWithTheme(
      <Chart data={SERIES}>
        <Chart.Plot>
          <Chart.Reference value={14} label="Target" />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    expect(baselineCount()).toBe(1);
    expect(screen.getByText('Target')).toBeTruthy();
  });

  it('labels the reference with the root format when given no label', () => {
    renderWithTheme(
      <Chart data={SERIES} format={formatMoney('USD', { locale: 'en-US', fractionDigits: 0 })}>
        <Chart.Plot>
          <Chart.Reference value={14} />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByText('$14')).toBeTruthy();
  });
});

describe('selection is controlled-or-uncontrolled everywhere', () => {
  it('holds the scrub itself and still reports it', () => {
    const onScrub = jest.fn();
    renderWithTheme(
      <Chart data={SERIES} onScrub={onScrub}>
        <Chart.Delta />
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    fireEvent(screen.getByRole('image'), 'responderGrant', touchEvent(6));
    expect(onScrub).toHaveBeenCalledWith(0, { value: 10 });
    // Uncontrolled, so the readout moved with it: index 0 is the baseline.
    expect(screen.getByText(/^0 \(\+?0\.00%\)$/)).toBeTruthy();
  });

  it('lets an owner pin the scrub', () => {
    const onScrub = jest.fn();
    renderWithTheme(
      <Chart data={SERIES} activeIndex={1} onScrub={onScrub}>
        <Chart.Delta />
        <Chart.Plot />
      </Chart>,
    );
    layoutPlot();
    // Pinned to index 1 (12) => +2, regardless of where the finger lands.
    expect(screen.getByText(/\+2 /)).toBeTruthy();
    fireEvent(screen.getByRole('image'), 'responderGrant', touchEvent(206));
    expect(onScrub).toHaveBeenCalledWith(4, { value: 18 });
    expect(screen.getByText(/\+2 /)).toBeTruthy();
  });

  it('seeds an uncontrolled bar selection and toggles it off on a second tap', () => {
    const week = [
      { label: 'M', value: 30 },
      { label: 'T', value: 12 },
    ];
    renderWithTheme(<BarChart data={week} defaultActiveIndex={0} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: 'M, 30' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    fireEvent.press(screen.getByRole('button', { name: 'M, 30' }));
    expect(screen.getByRole('button', { name: 'M, 30' }).props.accessibilityState).toMatchObject({
      selected: false,
    });
  });

  it('gives the donut the same contract', () => {
    const slices = [
      { label: 'Rent', value: 60 },
      { label: 'Food', value: 40 },
    ];
    renderWithTheme(<DonutChart data={slices} defaultActiveIndex={1} />);
    expect(
      screen.getByRole('button', { name: 'Food, 40, 40 percent' }).props.accessibilityState,
    ).toMatchObject({ selected: true });
  });
});

/**
 * The value label sits above the bar. Reserving the room by shortening the
 * drawing height alone is not enough — the reserved strip has to be *above* the
 * bars, or the tallest bar's top lands at y=0, its label clamps to the top of the
 * box, and the number is painted inside the bar.
 */
describe('bar value labels clear the bar', () => {
  const week = [
    { label: 'M', value: 30 },
    { label: 'T', value: 12 },
    { label: 'W', value: 44 },
  ];
  const HEIGHT = 160;
  const LABEL_HEIGHT = 18; // category labels
  const VALUE_HEIGHT = 16; // reserved strip

  function render(props: Partial<Parameters<typeof BarChart>[0]> = {}) {
    renderWithTheme(<BarChart data={week} showValues height={HEIGHT} {...props} />);
    fireEvent(screen.getByRole('image'), 'layout', {
      nativeEvent: { layout: { width: 240, height: HEIGHT, x: 0, y: 0 } },
    });
  }

  /** Every bar's top edge, read off the drawn path's first vertex. */
  function barTops(): number[] {
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => (node.props as { d?: string; stroke?: unknown }))
      .filter((props) => props.stroke == null && props.d)
      .map((props) => {
        const ys = [...(props.d as string).matchAll(/[ML]-?[\d.]+,(-?[\d.]+)/g)].map(([, y]) =>
          Number(y),
        );
        return Math.min(...ys);
      });
  }

  it('leaves a label’s height of room above the tallest bar', () => {
    render();
    const highest = Math.min(...barTops());
    // The tallest bar must start below the reserved strip, not at the very top.
    expect(highest).toBeGreaterThanOrEqual(VALUE_HEIGHT - 0.01);
  });

  it('anchors every bar to the floor rather than stranding the spare room below', () => {
    render();
    const plotHeight = HEIGHT - LABEL_HEIGHT;
    const bottoms = screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => node.props as { d?: string; stroke?: unknown })
      .filter((props) => props.stroke == null && props.d)
      .map((props) => {
        const ys = [...(props.d as string).matchAll(/[ML]-?[\d.]+,(-?[\d.]+)/g)].map(([, y]) =>
          Number(y),
        );
        return Math.max(...ys);
      });
    // All positive: every bar sits on the baseline at the bottom of the plot.
    for (const bottom of bottoms) expect(bottom).toBeCloseTo(plotHeight, 1);
  });

  it('gives the full height back when no value can ever show', () => {
    // Nothing to make room for, so the tallest bar uses the whole box.
    renderWithTheme(<BarChart data={week} height={HEIGHT} />);
    fireEvent(screen.getByRole('image'), 'layout', {
      nativeEvent: { layout: { width: 240, height: HEIGHT, x: 0, y: 0 } },
    });
    expect(Math.min(...barTops())).toBeCloseTo(0, 1);
  });
});

describe('bars take a bare number[] too', () => {
  it('labels them by position when the data has no labels', () => {
    renderWithTheme(<BarChart data={[5, 9]} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: '1, 5' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '2, 9' })).toBeTruthy();
  });
});

describe('tone vocabulary', () => {
  it('is one vocabulary across the forms', () => {
    // Every form takes the same member names. `series` on a single-series line has
    // nothing to enumerate, so it resolves rather than throwing.
    for (const tone of ['auto', 'positive', 'negative', 'brand', 'series', 'neutral'] as const) {
      const { unmount } = renderWithTheme(
        <Chart data={SERIES} tone={tone}>
          <Chart.Plot />
          <Chart.Sparkline data={SERIES} width={40} />
        </Chart>,
      );
      expect(screen.getByRole('image')).toBeTruthy();
      unmount();
    }
  });

  it('colours bars by sign under tone="auto"', () => {
    renderWithTheme(
      <BarChart data={[{ label: 'A', value: -5 }, { label: 'B', value: 5 }]} tone="auto" />,
    );
    // Bars are only drawn once the chart has measured itself.
    fireEvent(screen.getByRole('image'), 'layout', {
      nativeEvent: { layout: { width: 240, height: 160, x: 0, y: 0 } },
    });

    // Two bars, two different hues — down is not up.
    expect(barFills()).toHaveLength(2);
    expect(new Set(barFills()).size).toBe(2);
  });

  it('spends one hue on a single measure, and the palette only when asked', () => {
    const week = [
      { label: 'A', value: 5 },
      { label: 'B', value: 9 },
      { label: 'C', value: 3 },
    ];
    const { rerender } = renderWithTheme(<BarChart data={week} />);
    const layout = () =>
      fireEvent(screen.getByRole('image'), 'layout', {
        nativeEvent: { layout: { width: 240, height: 160, x: 0, y: 0 } },
      });

    layout();
    // Magnitude, not identity: one measure does not spend the categorical palette.
    expect(new Set(barFills()).size).toBe(1);

    rerender(<BarChart data={week} tone="series" />);
    layout();
    expect(new Set(barFills()).size).toBe(3);
  });
});
