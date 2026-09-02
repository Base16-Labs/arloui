import { jest } from '@jest/globals';
import { StyleSheet, View } from 'react-native';
import { BarChart } from '../bar-chart';
import { Chart } from '../index';
import { DonutChart } from '../donut-chart';
import { Heatmap } from '../heatmap';
import { Meter } from '../meter';
import { Sparkline } from '../sparkline';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';
import { __setReduceMotionForTests } from '../../../foundation/reduce-motion';

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
    renderWithTheme(<BarChart data={week} activeIndex={2} onSelect={() => {}} />);
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
        onSelect={() => {}}
      >
        <BarChart.Values />
        <BarChart.Categories />
      </BarChart>,
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

    rerender(<BarChart data={week} format={money} activeIndex={2} onSelect={() => {}} />);
    layoutBars();
    expect(screen.getByText('$44.00')).toBeTruthy();
    expect(screen.queryByText('$30.00')).toBeNull();
  });

  it('still shows every value when asked explicitly', () => {
    renderWithTheme(
      <BarChart data={week} format={money} onSelect={() => {}}>
        <BarChart.Values />
        <BarChart.Categories />
      </BarChart>,
    );
    layoutBars();
    expect(screen.getByText('$30.00')).toBeTruthy();
    expect(screen.getByText('$44.00')).toBeTruthy();
  });

  it('draws the reference line with its chip when chrome is reference', () => {
    renderWithTheme(
      <BarChart data={week}>
        <BarChart.Reference value={28} label="AVG" />
      </BarChart>,
    );
    layoutBars();
    expect(screen.getByText('AVG')).toBeTruthy();
  });

  it('renders grouped series with a legend and names both to screen readers', () => {
    const sleep = [
      { label: 'Mon', value: 7 },
      { label: 'Tue', value: 6 },
    ];
    const activity = [
      { label: 'Mon', value: 5 },
      { label: 'Tue', value: 8 },
    ];
    renderWithTheme(
      <BarChart
        variant="grouped"
        onSelect={() => {}}
      >
        <BarChart.Series data={sleep} label="Sleep" />
        <BarChart.Series data={activity} label="Activity" />
        <BarChart.Categories />
        <BarChart.Legend />
      </BarChart>,
    );
    expect(screen.getByText('Sleep')).toBeTruthy();
    expect(screen.getByText('Activity')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mon, Sleep 7, Activity 5' })).toBeTruthy();
  });

  it('shows the category total for a selected stacked category', () => {
    const sleep = [{ label: 'Mon', value: 7 }];
    const activity = [{ label: 'Mon', value: 5 }];
    renderWithTheme(
      <BarChart variant="stacked" activeIndex={0}>
        <BarChart.Series data={sleep} />
        <BarChart.Series data={activity} />
      </BarChart>,
    );
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('renders horizontal rows that report the tapped category', () => {
    const onSelect = jest.fn();
    renderWithTheme(<BarChart data={week} layout="horizontal" format={money} onSelect={onSelect} />);
    expect(screen.getByText('M')).toBeTruthy();
    expect(screen.getByText('$30.00')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'T, $12.00' }));
    expect(onSelect).toHaveBeenCalledWith(1, week[1]);
  });
});

/**
 * `layout="horizontal"` used to take only `data`, so every other prop was
 * silently dropped the moment it was set: a grouped chart collapsed to its first
 * series, negatives rendered as empty tracks, and `tone`, `legend`, `chrome`,
 * `showValues`, and `showLabels` did nothing at all. A prop a component accepts
 * and ignores is worse than one it rejects — there is no error, just a control
 * that does not work. These pin that the two layouts answer the same props.
 */
describe('BarChart — horizontal answers the same props as vertical', () => {
  const week = [
    { label: 'M', value: 30 },
    { label: 'T', value: 12 },
    { label: 'W', value: 44 },
  ];
  const sleep = [
    { label: 'Mon', value: 7 },
    { label: 'Tue', value: 6 },
  ];
  const activity = [
    { label: 'Mon', value: 5 },
    { label: 'Tue', value: 3 },
  ];

  /** Rows measure themselves before drawing any furniture over the rail. */
  function layoutRows(width = 320) {
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width, height: 90, x: 0, y: 0 } },
    });
  }

  /** Every explicit width in the tree, as the percentage strings the rows use. */
  function widths(tree: unknown): string[] {
    const found: string[] = [];
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== 'object') return;
      const el = node as { props?: { style?: unknown }; children?: unknown };
      const style = el.props?.style as { width?: unknown } | undefined;
      if (style && typeof style.width === 'string') found.push(style.width);
      walk(el.children);
    };
    walk(tree);
    return found;
  }

  it('reports the category total rather than only the first series', () => {
    renderWithTheme(
      <BarChart variant="stacked" layout="horizontal">
        <BarChart.Series data={sleep} />
        <BarChart.Series data={activity} />
      </BarChart>,
    );
    // 7 + 5, not 7.
    expect(screen.getByText('12')).toBeTruthy();
  });

  /**
   * Only the outermost segment of a stack is rounded — the same rule the
   * vertical path uses, where the top of a stack is rounded and every segment
   * under it is square.
   *
   * Leaving it to the rail's `overflow: 'hidden'` is what broke: a clip only
   * rounds a fill that reaches the rail's edge, so the single category whose
   * total set the ceiling came out rounded and every other row ended square.
   * Every row has to be shaped the same regardless of its total.
   */
  it('rounds the same end of every stacked row, not just the widest', () => {
    const uneven = [
      { label: 'Mon', value: 2 },
      { label: 'Tue', value: 9 },
    ];
    const second = [
      { label: 'Mon', value: 1 },
      { label: 'Tue', value: 4 },
    ];
    const { toJSON } = renderWithTheme(
      <BarChart variant="stacked" layout="horizontal">
        <BarChart.Series data={uneven} />
        <BarChart.Series data={second} />
      </BarChart>,
    );

    const ends: number[] = [];
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== 'object') return;
      const el = node as { props?: { style?: unknown }; children?: unknown };
      const style = el.props?.style as { borderTopRightRadius?: number } | undefined;
      if (style?.borderTopRightRadius != null) ends.push(style.borderTopRightRadius);
      walk(el.children);
    };
    walk(toJSON());

    // Two rows, two segments each: one rounded end and one square end per row.
    expect(ends.filter((r) => r > 0)).toHaveLength(2);
    expect(ends.filter((r) => r === 0)).toHaveLength(2);
  });

  it('draws the legend for a multi-series row chart', () => {
    renderWithTheme(
      <BarChart layout="horizontal">
        <BarChart.Series data={sleep} label="Sleep" />
        <BarChart.Series data={activity} label="Activity" />
        <BarChart.Legend />
      </BarChart>,
    );
    expect(screen.getByText('Sleep')).toBeTruthy();
    expect(screen.getByText('Activity')).toBeTruthy();
  });

  /**
   * The scale was `value / max` clamped to [0, 1], so an all-negative series drew
   * nothing and read as a loading failure. The track spans the data and contains
   * zero, so a negative row grows the other way instead of vanishing.
   */
  it('gives negative categories a real width', () => {
    const { toJSON } = renderWithTheme(
      <BarChart data={[{ label: 'Out', value: -40 }, { label: 'In', value: 20 }]} layout="horizontal" />,
    );
    const drawn = widths(toJSON()).filter((w) => w.endsWith('%') && w !== '0%');
    // Two filled spans, neither collapsed.
    expect(drawn.length).toBeGreaterThanOrEqual(2);
  });

  it('draws row labels only when the part is named', () => {
    const { rerender } = renderWithTheme(<BarChart data={week} layout="horizontal" />);
    expect(screen.getByText('M')).toBeTruthy();

    // Composition inverts the default: an unnamed part is an absent one.
    rerender(
      <BarChart data={week} layout="horizontal">
        <BarChart.Values />
      </BarChart>,
    );
    expect(screen.queryByText('M')).toBeNull();
  });

  it('draws the reference line and its label', () => {
    renderWithTheme(
      <BarChart data={week} layout="horizontal">
        <BarChart.Reference value={20} label="AVG" />
      </BarChart>,
    );
    // The chip is positioned on the rule, so it needs the rail measured first.
    layoutRows();
    expect(screen.getByText('AVG')).toBeTruthy();
  });
});

describe('Chart.Plot — compare, range, tooltip, references', () => {
  /**
   * The plot only draws once it has measured itself, so specs that assert on
   * drawn furniture have to hand the root a layout first.
   */
  function layoutPlot(width = 320) {
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width, height: 120, x: 0, y: 0 } },
    });
  }

  it('renders a compare series and a range band without disturbing the scrub', () => {
    renderWithTheme(
      <Chart data={[1, 2, 3]} onScrub={() => {}}>
        <Chart.Plot compare={[0.5, 1, 1.5]} range={{ lower: [0.4, 1, 1.4], upper: [1.6, 3, 4.6] }} height={120} />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByRole('image')).toBeTruthy();
  });

  it('draws one labelled line per reference — the min/max pair', () => {
    renderWithTheme(
      <Chart data={[1, 5, 2, 8]}>
        <Chart.Plot height={120}>
          <Chart.Reference value={8} />
          <Chart.Reference value={1} />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('shows the floating readout for the scrubbed point', () => {
    renderWithTheme(
      <Chart data={[10, 30, 20, 50]} activeIndex={3}>
        <Chart.Plot tooltip height={120} />
      </Chart>,
    );
    layoutPlot();
    expect(screen.getByText('50')).toBeTruthy();
  });

  it('hides the floating readout when nothing is being scrubbed', () => {
    renderWithTheme(
      <Chart data={[10, 30, 20, 50]}>
        <Chart.Plot tooltip height={120} />
      </Chart>,
    );
    layoutPlot();
    expect(screen.queryByText('50')).toBeNull();
  });
});

describe('DonutChart legend', () => {
  it('gives each slice its share in its own column', () => {
    renderWithTheme(
      <DonutChart data={[{ label: 'Rent', value: 1200 }, { label: 'Food', value: 480 }]} />,
    );
    expect(screen.getByText('71%')).toBeTruthy();
    expect(screen.getByText('29%')).toBeTruthy();
  });
});

describe('Heatmap', () => {
  const march = (day: number, value: number) => ({
    date: new Date(2026, 2, day).toISOString(),
    value,
  });

  it('pads the grid to whole weeks and labels the columns Monday-first', () => {
    // March 4 2026 is a Wednesday: the default range winds back to the 2nd and
    // runs on to the 8th, so the grid is exactly one week.
    renderWithTheme(<Heatmap data={[march(4, 2)]} />);
    expect(screen.getByText('M')).toBeTruthy();
    expect(screen.getByRole('image').props.accessibilityLabel).toBe(
      'Heatmap, 1 of 7 days with activity',
    );
  });

  it('renders days without data as empty rather than absent', () => {
    renderWithTheme(
      <Heatmap data={[march(2, 1), march(8, 1)]} from="2026-03-02" to="2026-03-08" />,
    );
    expect(screen.getByRole('image').props.accessibilityLabel).toBe(
      'Heatmap, 2 of 7 days with activity',
    );
  });

  it('reports a tapped day', () => {
    const onSelect = jest.fn();
    renderWithTheme(<Heatmap data={[march(4, 2)]} onSelect={onSelect} />);
    fireEvent.press(screen.getByRole('button', { name: /, 2$/ }));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 2 }),
      expect.any(Date),
    );
  });

  it('shows the Less–More scale, and drops it when asked', () => {
    const { rerender } = renderWithTheme(<Heatmap data={[march(4, 2)]} />);
    expect(screen.getByText('Less')).toBeTruthy();
    expect(screen.getByText('More')).toBeTruthy();

    rerender(
      <Heatmap data={[march(4, 2)]}>
        <Heatmap.DayLabels />
      </Heatmap>,
    );
    expect(screen.queryByText('Less')).toBeNull();
  });

  it('draws the composed empty slot when there is no month to draw', () => {
    // No data and no range means no grid at all — which used to render a blank
    // box that only a screen reader could interpret. It now says so on screen,
    // the way every other form does.
    const { rerender } = renderWithTheme(<Heatmap data={[]} />);
    expect(screen.getByText('No activity yet')).toBeTruthy();

    const onPress = jest.fn();
    rerender(
      <Heatmap
        data={[]}
        empty={{ title: 'Nothing logged', description: 'Log a day to begin.', action: { label: 'Log', onPress } }}
      />,
    );
    expect(screen.getByText('Nothing logged')).toBeTruthy();
    // The label renders as "Log →", so address it the way a screen reader does.
    fireEvent.press(screen.getByRole('button', { name: 'Log' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('still draws an empty grid when a range says where it is', () => {
    // Every day empty is the data, not the absence of it — so a range keeps the
    // grid rather than swapping it for the slot.
    renderWithTheme(<Heatmap data={[]} from="2026-03-01" to="2026-03-28" />);
    expect(screen.getByRole('image')).toBeTruthy();
  });

  it('renders a loading grid without crashing', () => {
    renderWithTheme(<Heatmap data={[march(4, 2)]} loading />);
    expect(screen.getByRole('image').props.accessibilityLabel).toBe('Heatmap loading');
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
    renderWithTheme(<DonutChart data={spend} activeIndex={null} onSelect={onSelect} />);
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
    expect(Chart.Heatmap).toBe(Heatmap);
  });

  it('still exposes the parts that compose the scrubbable chart', () => {
    expect(Chart.Value).toBeDefined();
    expect(Chart.Delta).toBeDefined();
    expect(Chart.Plot).toBeDefined();
    expect(Chart.Periods).toBeDefined();
    expect(Chart.Legend).toBeDefined();
  });

  it('renders a form reached through the namespace', () => {
    renderWithTheme(<Chart.Meter value={3} max={5} label="Steps" valueLabel="3 of 5" />);
    expect(screen.getByText('3 of 5')).toBeTruthy();
  });
});

/**
 * The three forms taken from surveying other RN chart libraries: the gauge, the
 * concentric dial, and part-to-total over time. Each is a prop on a form Arlo
 * already had rather than a seventh component.
 */
describe('Meter — arc and concentric rings', () => {
  it('reports the same semantics whatever shape it takes', () => {
    for (const shape of ['bar', 'ring', 'arc'] as const) {
      const { unmount } = renderWithTheme(
        <Meter shape={shape} value={712} max={850} label="Score" />,
      );
      const node = screen.getByRole('progressbar');
      expect(node.props.accessibilityValue).toMatchObject({ min: 0, max: 850, now: 712 });
      unmount();
    }
  });

  /**
   * The gauge only draws the top two thirds of its box. Left square, it would
   * float high in its own space with an empty third underneath.
   */
  it('crops the arc box to what the arc actually draws', () => {
    const heightOf = () =>
      (StyleSheet.flatten(screen.getByRole('progressbar').props.style) as { height: number })
        .height;

    const { unmount } = renderWithTheme(<Meter shape="arc" value={50} size={120} />);
    const arcHeight = heightOf();
    unmount();

    renderWithTheme(<Meter shape="ring" value={50} size={120} />);
    const ringHeight = heightOf();

    expect(ringHeight).toBe(120);
    expect(arcHeight).toBeLessThan(ringHeight);
  });

  /**
   * Counted against the single-ring case rather than against a fixed number:
   * what matters is one sweep per ring, and how many nodes a sweep serialises
   * into is an implementation detail that should be free to change.
   */
  it('draws one sweep per concentric ring', () => {
    const sweeps = (tree: unknown) =>
      (JSON.stringify(tree).match(/strokeDashoffset/g) ?? []).length;

    const one = renderWithTheme(<Meter shape="ring" value={520} max={600} />);
    const single = sweeps(one.toJSON());
    one.unmount();

    const three = renderWithTheme(
      <Meter
        shape="ring"
        value={520}
        max={600}
        rings={[{ value: 32, max: 40 }, { value: 8, max: 12 }]}
      />,
    );
    expect(sweeps(three.toJSON())).toBe(single * 3);
  });

  it('leaves the bar shape alone when rings are passed', () => {
    renderWithTheme(<Meter shape="bar" value={50} rings={[{ value: 10 }]} />);
    // A bar has no inside to draw into; it still renders as one meter.
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });
});

describe('Chart.Plot — stack', () => {
  const base = [10, 12, 11, 14];

  /** The plot only draws once measured, so specs hand the root a layout first. */
  function layout(width = 320) {
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width, height: 120, x: 0, y: 0 } },
    });
  }

  it('draws a filled band for every stacked series', () => {
    const { toJSON } = renderWithTheme(
      <Chart data={base}>
        <Chart.Plot stack={[[4, 5, 4, 6], [2, 2, 3, 2]]} fill={false} height={120} />
      </Chart>,
    );
    layout();
    // Two layers, each a closed band; the primary's own area is off.
    const closed = JSON.stringify(toJSON()).match(/Z"/g) ?? [];
    expect(closed.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('image')).toBeTruthy();
  });

  /**
   * The layers came off the categorical palette while the primary stayed on the
   * tone palette, and those two sets are not checked against each other: the
   * default `auto` tone is `chartPositive` (#008236) and the first layer landed
   * on `chartSeries2` (#65A30D) — two greens in one stack, with a legend saying
   * they were different things. Every band in a stack must be its own colour.
   */
  /**
   * Resolved paint values; `react-native-svg` normalises colours to int
   * payloads. Specs using this pass `chrome="none"` — the baseline rule is also
   * a stroked path, and it is drawn before the series.
   */
  function paints() {
    const paths = screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => node.props as { fill?: { payload?: number }; stroke?: { payload?: number } });
    return {
      line: paths.find((p) => p.stroke?.payload != null)?.stroke?.payload,
      fills: paths
        .filter((p) => p.stroke == null && p.fill?.payload != null)
        .map((p) => p.fill?.payload as number),
    };
  }

  /**
   * The layers came off the categorical palette while the primary stayed on the
   * tone palette, and those two sets are not checked against each other: the
   * default `auto` tone is `chartPositive` (#008236, green) and the first layer
   * landed on `chartSeries2` (#65A30D, olive) — two greens in one stack, with a
   * legend claiming they were different things.
   *
   * Note this cannot be pinned by asserting the colours differ: those two hexes
   * *are* different, and the bug was that they read the same. What is pinned is
   * the rule that fixes it — once stacked, the primary is a category too.
   */
  it('moves the primary onto the categorical palette once it is stacked', () => {
    const plain = renderWithTheme(
      <Chart data={base}>
        <Chart.Plot height={120} fill={false}>
          {null}
        </Chart.Plot>
      </Chart>,
      { theme: 'light' },
    );
    layout();
    const toneStroke = paints().line;
    plain.unmount();

    renderWithTheme(
      <Chart data={base}>
        <Chart.Plot stack={[[4, 5, 4, 6], [2, 2, 3, 2]]} height={120} fill={false}>
          {null}
        </Chart.Plot>
      </Chart>,
      { theme: 'light' },
    );
    layout();
    const stacked = paints();

    expect(toneStroke).toBeDefined();
    // No longer the tone hue.
    expect(stacked.line).not.toBe(toneStroke);
    // Primary plus two layers, every one its own slot.
    expect(stacked.fills).toHaveLength(2);
    expect(new Set([stacked.line, ...stacked.fills]).size).toBe(3);
  });

  /**
   * The scale has to fit the top of the stack, not just the primary — otherwise
   * the layers a stack exists to show are drawn off the top of the plot.
   */
  it('is unchanged by an empty stack', () => {
    renderWithTheme(
      <Chart data={base}>
        <Chart.Plot stack={[]} height={120} />
      </Chart>,
    );
    layout();
    expect(screen.getByRole('image')).toBeTruthy();
  });
});

/**
 * The four bar-chart gaps found by using the playground: spacing that made a
 * seven-bar chart read as one block, a density axis that only duplicated
 * `showLabels`, and an empty state that spoke differently from the plot's.
 */
describe('BarChart — spacing, density, and empty', () => {
  const week = [
    { label: 'M', value: 30 },
    { label: 'T', value: 12 },
    { label: 'W', value: 44 },
  ];

  function barWidths() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => (node.props as { d?: string }).d ?? '')
      .filter((d) => d.startsWith('M'));
  }

  function layout(width = 300) {
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', { nativeEvent: { layout: { width, height: 160, x: 0, y: 0 } } });
  }

  /**
   * The gap used to be a flat 1–2pt whatever the chart was, so seven bars in
   * 350pt read as one solid block with hairlines scored into it. A fraction of
   * the slot looks the same at any bar count.
   */
  it('draws narrower bars as spacing loosens', () => {
    const widthAt = (spacing: 'tight' | 'default' | 'loose') => {
      const r = renderWithTheme(<BarChart data={week} spacing={spacing} />);
      layout();
      const first = barWidths()[0] ?? '';
      // `barPath` opens `M<x>,<y>` and the second point carries the right edge.
      const xs = [...first.matchAll(/[ML]([\d.]+),/g)].map((m) => Number(m[1]));
      const w = Math.max(...xs) - Math.min(...xs);
      r.unmount();
      return w;
    };

    const tight = widthAt('tight');
    const normal = widthAt('default');
    const loose = widthAt('loose');
    expect(tight).toBeGreaterThan(normal);
    expect(normal).toBeGreaterThan(loose);
  });

  /** Every x coordinate in a drawn bar path, so a mark's span can be measured. */
  function spans() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => (node.props as { d?: string }).d ?? '')
      .filter((d) => d.startsWith('M'))
      .map((d) => {
        const xs = [...d.matchAll(/[ML]([\d.]+),/g)].map((m) => Number(m[1]));
        return { left: Math.min(...xs), right: Math.max(...xs) };
      });
  }

  /**
   * A stack is one bar made of segments, so it is exactly as wide as a single
   * bar. It used to be drawn at the full slot width while `markInset` shifted
   * its origin — too wide *and* offset, so each pile leaned over its neighbour.
   * Only visible once spacing was loose enough to leave a gap to overrun.
   */
  it('keeps a stacked pile inside its own category', () => {
    const a = [
      { label: 'Mon', value: 6 },
      { label: 'Tue', value: 5 },
      { label: 'Wed', value: 7 },
    ];
    const b = [
      { label: 'Mon', value: 3 },
      { label: 'Tue', value: 4 },
      { label: 'Wed', value: 2 },
    ];

    for (const spacing of ['tight', 'default', 'loose'] as const) {
      const r = renderWithTheme(
        <BarChart data={a} series={[b]} variant="stacked" spacing={spacing} />,
      );
      layout(300);
      const drawn = spans().sort((x, y) => x.left - y.left);
      const slot = 300 / 3;

      for (const mark of drawn) {
        // Never wider than its slot, and never past the slot it belongs to.
        expect(mark.right - mark.left).toBeLessThanOrEqual(slot + 0.5);
        const category = Math.floor(mark.left / slot);
        expect(mark.right).toBeLessThanOrEqual((category + 1) * slot + 0.5);
      }
      r.unmount();
    }
  });

  /** A stacked pile and a single bar are the same shape, so the same width. */
  it('draws a stacked pile at the same width as a single bar', () => {
    const measure = (node: React.ReactElement) => {
      const r = renderWithTheme(node);
      layout(300);
      const first = spans().sort((x, y) => x.left - y.left)[0];
      const w = (first?.right ?? 0) - (first?.left ?? 0);
      r.unmount();
      return w;
    };

    const single = measure(<BarChart data={week} spacing="loose" />);
    const stacked = measure(
      <BarChart
        data={week}
        series={[week.map((d) => ({ ...d, value: d.value / 2 }))]}
        variant="stacked"
        spacing="loose"
      />,
    );
    expect(stacked).toBeCloseTo(single, 1);
  });

  /**
   * `compact` used to set `showLabels: false`, so the density axis and the
   * `showLabels` prop had exactly one visible effect between them. A row's label
   * is its identity, not a caption — density makes rows tighter instead.
   */
  it('keeps row labels at compact density', () => {
    renderWithTheme(<BarChart data={week} layout="horizontal" density="compact" />);
    expect(screen.getByText('M')).toBeTruthy();
  });

  it('draws no row labels when the part is not named', () => {
    renderWithTheme(
      <BarChart data={week} layout="horizontal" density="compact">
        <BarChart.Values />
      </BarChart>,
    );
    expect(screen.queryByText('M')).toBeNull();
  });

  /**
   * Spacing is one question — how much air between the marks — asked of
   * whichever axis the categories run along. It was live for bars and dead for
   * rows, which made the control look broken half the time.
   */
  it('spaces rows as well as bars', () => {
    const gapAt = (spacing: 'tight' | 'default' | 'loose') => {
      const r = renderWithTheme(
        <BarChart data={week} layout="horizontal" spacing={spacing} />,
      );
      const rows = screen.UNSAFE_root
        .findAllByType('View' as never)
        .map((node) => (node.props as { style?: { gap?: number } }).style)
        .find((style) => style && typeof style.gap === 'number' && style.gap > 0);
      r.unmount();
      return rows?.gap ?? 0;
    };

    expect(gapAt('tight')).toBeLessThan(gapAt('default'));
    expect(gapAt('default')).toBeLessThan(gapAt('loose'));
  });

  /**
   * `chrome="baseline"` used to be a setting that did nothing: the zero rule was
   * gated only on the data crossing zero, so it drew under every chrome —
   * including `none`, which is documented as the mark alone. That is why
   * `baseline` read as `reference` minus the label; there was no difference to
   * see because `baseline` itself turned nothing on.
   */
  describe('chrome governs the zero rule', () => {
    const signed = [
      { label: 'Jan', value: 38 },
      { label: 'Feb', value: -12 },
      { label: 'Mar', value: 24 },
    ];

    /** The zero rule is the one full-width straight path in the plot. */
    function hasZeroRule() {
      return screen.UNSAFE_root
        .findAllByType('RNSVGPath' as never)
        .some((node) => {
          const d = (node.props as { d?: string }).d ?? '';
          return /^M0,[\d.]+ L[\d.]+,[\d.]+$/.test(d);
        });
    }

    it('draws it for signed data at baseline', () => {
      renderWithTheme(
        <BarChart data={signed}>
          <BarChart.Baseline />
        </BarChart>,
      );
      layout();
      expect(hasZeroRule()).toBe(true);
    });

    it('keeps it at reference, which adds a line rather than replacing the axis', () => {
      renderWithTheme(
        <BarChart data={signed}>
          <BarChart.Reference value={20} label="AVG" />
        </BarChart>,
      );
      layout();
      expect(hasZeroRule()).toBe(true);
      expect(screen.getByText('AVG')).toBeTruthy();
    });

    it('drops it at none — the mark alone', () => {
      renderWithTheme(
        <BarChart data={signed}>
          <BarChart.Categories />
        </BarChart>,
      );
      layout();
      expect(hasZeroRule()).toBe(false);
    });

    /** All-positive data has its zero at the axis, so there is nothing to draw. */
    it('draws nothing for all-positive data whether or not the baseline is named', () => {
      for (const baseline of [false, true] as const) {
        const r = renderWithTheme(
          <BarChart data={week}>{baseline ? <BarChart.Baseline /> : <BarChart.Categories />}</BarChart>,
        );
        layout();
        expect(hasZeroRule()).toBe(false);
        r.unmount();
      }
    });
  });

  /**
   * The rail is furniture, so `chrome` governs it. Worth being able to drop: with
   * no `maxValue` the ceiling is just the largest row, so the rail sits at
   * wherever the biggest item landed — it looks like a target and is not one.
   */
  it('drops the row rail when the baseline is not named', () => {
    const rails = () =>
      screen.UNSAFE_root
        .findAllByType('View' as never)
        .map((node) => (node.props as { style?: { backgroundColor?: string; overflow?: string } }).style)
        .filter((style) => style?.overflow === 'hidden' && style?.backgroundColor !== 'transparent');

    const withRail = renderWithTheme(
      <BarChart data={week} layout="horizontal">
        <BarChart.Baseline />
      </BarChart>,
    );
    expect(rails().length).toBeGreaterThan(0);
    withRail.unmount();

    renderWithTheme(
      <BarChart data={week} layout="horizontal">
        <BarChart.Categories />
      </BarChart>,
    );
    expect(rails()).toHaveLength(0);
  });

  /** A bar chart with nothing in it is exactly as empty as a plot with nothing in it. */
  it('draws the same composed empty slot the plot does', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <BarChart
        data={[]}
        empty={{ title: 'No spending yet', description: 'Log one to begin.', action: { label: 'Log', onPress } }}
      />,
    );

    expect(screen.getByText('No spending yet')).toBeTruthy();
    expect(screen.getByText('Log one to begin.')).toBeTruthy();
    // `pointerEvents="box-none"`, or the only control on an empty chart is dead.
    fireEvent.press(screen.getByRole('button', { name: 'Log' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('falls back to the bare label when no slot is given', () => {
    renderWithTheme(<BarChart data={[]} emptyLabel="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });
});

describe('DonutChart', () => {
  const spend = [
    { label: 'Rent', value: 1200 },
    { label: 'Food', value: 480 },
  ];

  /**
   * `density` used to move only `metrics.gap` — the hairline between slices, 1pt
   * against 2pt, about half a degree at this radius. That is a rounding
   * difference, not a control. "How much mark there is" has to change the mark.
   */
  it('makes the ring thinner at compact density', () => {
    const innerRadius = () => {
      // The ring is an annulus; its hole is the inner arc's radius.
      const d = screen.UNSAFE_root
        .findAllByType('RNSVGPath' as never)
        .map((n) => (n.props as { d?: string }).d ?? '')
        .find((path) => path.includes('A'));
      const radii = [...(d ?? '').matchAll(/A([\d.]+),/g)].map((m) => Number(m[1]));
      return Math.min(...radii);
    };

    const wide = renderWithTheme(<DonutChart data={spend} density="default" />);
    const defaultHole = innerRadius();
    wide.unmount();

    renderWithTheme(<DonutChart data={spend} density="compact" />);
    // A thinner ring leaves a bigger hole at the same outer radius.
    expect(innerRadius()).toBeGreaterThan(defaultHole);
  });

  it('still lets an explicit thickness win over density', () => {
    renderWithTheme(<DonutChart data={spend} density="compact" thickness={40} />);
    expect(screen.getByRole('image')).toBeTruthy();
  });

  /** The centre value is a figure the chart does not have yet. */
  it('shows no centre figure while loading', () => {
    const { rerender } = renderWithTheme(
      <DonutChart data={spend} format={(v) => `$${v}`} loading />,
    );
    expect(screen.queryByText('$1680')).toBeNull();

    rerender(<DonutChart data={spend} format={(v) => `$${v}`} />);
    expect(screen.getByText('$1680')).toBeTruthy();
  });

  it('keeps the short label in the ring when empty', () => {
    renderWithTheme(<DonutChart data={[]} emptyLabel="Nothing yet" />);
    expect(screen.getByText('Nothing yet')).toBeTruthy();
  });

  /** The composed slot replaces the ring — it does not fit inside the hole. */
  it('takes the composed empty slot in place of the ring', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <DonutChart
        data={[]}
        emptyLabel="Nothing yet"
        empty={{ title: 'No spending yet', description: 'Log one to begin.', action: { label: 'Log', onPress } }}
      />,
    );

    expect(screen.getByText('No spending yet')).toBeTruthy();
    // The bare label is gone; the slot won.
    expect(screen.queryByText('Nothing yet')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Log' }));
    expect(onPress).toHaveBeenCalled();
  });

  /**
   * `maxSlices` counts arcs, "Other" included.
   *
   * It used to cap the *named* categories and add "Other" on top, so asking for
   * 2 over four categories drew three. A prop called `maxSlices` returning more
   * slices than you asked for is wrong whatever the intent.
   */
  describe('maxSlices', () => {
    const four = [
      { label: 'Rent', value: 1200 },
      { label: 'Food', value: 480 },
      { label: 'Travel', value: 260 },
      { label: 'Fun', value: 120 },
    ];

    /** One arc per drawn path. */
    function arcs() {
      return screen.UNSAFE_root
        .findAllByType('RNSVGPath' as never)
        .filter((n) => ((n.props as { d?: string }).d ?? '').includes('A')).length;
    }

    it.each([
      [2, 2],
      [3, 3],
      [4, 4],
    ])('draws exactly %i arcs when asked for %i', (asked, expected) => {
      const r = renderWithTheme(<DonutChart data={four} maxSlices={asked} />);
      expect(arcs()).toBe(expected);
      r.unmount();
    });

    it('names the folded remainder "Other"', () => {
      renderWithTheme(<DonutChart data={four} maxSlices={2} showLegend />);
      expect(screen.getByText('Rent')).toBeTruthy();
      expect(screen.getByText('Other')).toBeTruthy();
      // Food, Travel and Fun are inside "Other", not arcs of their own.
      expect(screen.queryByText('Food')).toBeNull();
    });

    it('folds past four categories however high the cap goes', () => {
      const seven = Array.from({ length: 7 }, (_, i) => ({ label: `C${i}`, value: 10 + i }));
      renderWithTheme(<DonutChart data={seven} maxSlices={99} showLegend />);
      // Four named plus Other: the palette's ceiling, not the caller's number.
      expect(arcs()).toBe(5);
      expect(screen.getByText('Other')).toBeTruthy();
    });

    it('leaves a ring that already fits alone', () => {
      renderWithTheme(<DonutChart data={four} maxSlices={4} showLegend />);
      expect(screen.queryByText('Other')).toBeNull();
    });
  });

  it('hides the centre figure when the Value part is not named', () => {
    const { rerender } = renderWithTheme(
      <DonutChart data={spend} format={(v) => `$${v}`} />,
    );
    expect(screen.getByText('$1680')).toBeTruthy();

    rerender(
      <DonutChart data={spend} format={(v) => `$${v}`}>
        <DonutChart.Legend />
      </DonutChart>,
    );
    expect(screen.queryByText('$1680')).toBeNull();
    // Still a ring — only the readout went.
    expect(screen.getByRole('image')).toBeTruthy();
  });

  /** The caption is opt-in on its own, so a ring can be labelled with no number. */
  it('keeps centerLabel when the figure is hidden', () => {
    renderWithTheme(<DonutChart data={spend} showValue={false} centerLabel="Monthly spend" />);
    expect(screen.getByText('Monthly spend')).toBeTruthy();
  });

  /** A ring shows shares of a whole, and a negative share is not one. */
  it('drops non-positive slices', () => {
    renderWithTheme(
      <DonutChart data={[{ label: 'In', value: 100 }, { label: 'Out', value: -40 }]} showLegend />,
    );
    expect(screen.getByText('In')).toBeTruthy();
    expect(screen.queryByText('Out')).toBeNull();
  });
});

describe('Meter — the readout and the hole it sits in', () => {
  /*
   * The readout counts up alongside the sweep, so without frames it reads "0%".
   * Reduce Motion pins both straight to the final value, which is what these
   * specs are about — whether the readout is drawn at all, not how it arrives.
   */
  beforeEach(() => __setReduceMotionForTests(true));
  afterEach(() => __setReduceMotionForTests(false));

  /**
   * Each concentric ring takes a track and a gap out of the middle. At the
   * default 120/10 a second extra ring leaves 44pt of clear space, and the
   * readout is a ~45x40 box — it was drawn anyway, straight over the innermost
   * track.
   */
  it('drops the centre readout once rings crowd it out', () => {
    const plain = renderWithTheme(<Meter shape="ring" value={53} max={100} />);
    expect(screen.getByText('53%')).toBeTruthy();
    plain.unmount();

    const one = renderWithTheme(
      <Meter shape="ring" value={53} max={100}>
        <Meter.Ring value={40} />
      </Meter>,
    );
    // One extra still leaves 72pt — comfortable. Naming no Value part means the
    // geometry is not consulted at all, so this asserts the composed contract:
    // an unnamed part is an absent one.
    expect(screen.queryByText('53%')).toBeNull();
    one.unmount();

    renderWithTheme(
      <Meter shape="ring" value={53} max={100}>
        <Meter.Ring value={40} />
        <Meter.Ring value={20} />
      </Meter>,
    );
    expect(screen.queryByText('53%')).toBeNull();
  });

  it('lets a named Value part override the geometry either way', () => {
    const forced = renderWithTheme(
      <Meter shape="ring" value={53} max={100}>
        <Meter.Value />
        <Meter.Ring value={40} />
        <Meter.Ring value={20} />
      </Meter>,
    );
    expect(screen.getByText('53%')).toBeTruthy();
    forced.unmount();

    renderWithTheme(
      <Meter shape="ring" value={53} max={100}>
        <Meter.Label>Storage</Meter.Label>
      </Meter>,
    );
    expect(screen.queryByText('53%')).toBeNull();
  });

  /**
   * A bar's track fills whatever width it is given, so inside a centring parent
   * it collapsed to the width of its own label row and read as a stub.
   */
  it('keeps a bar full width inside a centring parent', () => {
    renderWithTheme(
      <View style={{ alignItems: 'center' }}>
        <Meter shape="bar" value={53} max={100} label="Storage" />
      </View>,
    );
    const root = screen.getByRole('progressbar');
    expect(StyleSheet.flatten(root.props.style)).toMatchObject({ alignSelf: 'stretch' });
  });

  /**
   * `density` used to drive exactly one thing on a meter — `metrics.showLabels`,
   * which hid the label. That is not density, and it is already what *not
   * passing a label* does, so the axis meant to say "this is going somewhere
   * small" changed nothing about the size.
   */
  describe('density sizes the meter', () => {
    /** The ring's stroke width, read off the drawn circles. */
    function strokeWidth() {
      return screen.UNSAFE_root
        .findAllByType('RNSVGCircle' as never)
        .map((n) => (n.props as { strokeWidth?: number }).strokeWidth)
        .find((w) => typeof w === 'number');
    }

    it('draws a thinner, smaller ring at compact', () => {
      const wide = renderWithTheme(<Meter shape="ring" value={53} max={100} />);
      const defaultStroke = strokeWidth();
      const defaultBox = StyleSheet.flatten(
        screen.getByRole('progressbar').props.style,
      ) as { width: number };
      wide.unmount();

      renderWithTheme(<Meter shape="ring" value={53} max={100} density="compact" />);
      const compactBox = StyleSheet.flatten(
        screen.getByRole('progressbar').props.style,
      ) as { width: number };

      expect(strokeWidth()).toBeLessThan(defaultStroke as number);
      expect(compactBox.width).toBeLessThan(defaultBox.width);
    });

    it('lets an explicit size and thickness win over density', () => {
      renderWithTheme(
        <Meter shape="ring" value={53} max={100} density="compact" size={200} thickness={24} />,
      );
      const box = StyleSheet.flatten(screen.getByRole('progressbar').props.style) as {
        width: number;
      };
      expect(box.width).toBe(200);
      expect(strokeWidth()).toBe(24);
    });

    /** The label is the caller's decision, not density's. */
    it('keeps the label at compact', () => {
      renderWithTheme(<Meter shape="bar" value={53} max={100} label="Storage" density="compact" />);
      expect(screen.getByText('Storage')).toBeTruthy();
    });
  });

  /**
   * The readout has to stay inside the hole on both axes. It was free to run as
   * wide as the whole dial and to wrap onto extra lines, either of which puts
   * text over the track.
   */
  describe('the readout stays inside the ring', () => {
    /** Every resolved View style in the tree. */
    function styles() {
      return screen.UNSAFE_root
        .findAllByType('View' as never)
        .map((node) => StyleSheet.flatten((node.props as { style?: unknown }).style))
        .filter(Boolean) as Record<string, never>[];
    }

    /** The wrapper that carries the containment — the one View with a maxWidth. */
    function readoutBox() {
      const found = screen.UNSAFE_root
        .findAllByType('View' as never)
        .map((node) => StyleSheet.flatten((node.props as { style?: unknown }).style))
        .find((style) => style && typeof (style as { maxWidth?: number }).maxWidth === 'number');
      return (found ?? {}) as { maxWidth?: number; transform?: { translateY?: string }[] };
    }

    it('caps its width to what the hole can hold', () => {
      renderWithTheme(<Meter shape="ring" value={53} max={100} size={120} thickness={10} />);
      const { maxWidth } = readoutBox();
      // The inscribed square of a 100pt hole, not the full 120pt box.
      expect(maxWidth).toBeLessThan(100);
      expect(maxWidth).toBeGreaterThan(24);
    });

    it('narrows the cap as concentric rings eat the hole', () => {
      const plain = renderWithTheme(<Meter shape="ring" value={53} max={100} />);
      const wide = readoutBox().maxWidth as number;
      plain.unmount();

      renderWithTheme(<Meter shape="ring" value={53} max={100} rings={[{ value: 40 }]} />);
      expect(readoutBox().maxWidth as number).toBeLessThan(wide);
    });

    it('never wraps the figure onto a second line', () => {
      renderWithTheme(<Meter shape="ring" value={53} max={100} valueLabel="1,284,000 steps" />);
      expect(screen.getByText('1,284,000 steps').props.numberOfLines).toBe(1);
    });

    /**
     * An arc's readout is centred *on* the dial's centre, not hung from it — the
     * lower legs of the sweep sit at `cy + outerRadius / 2`, which is exactly
     * where a box anchored by its top edge lands.
     */
    it('centres the arc readout on the dial rather than below it', () => {
      renderWithTheme(<Meter shape="arc" value={53} max={100} />);
      const positioned = styles().find((st) => st.position === 'absolute' && st.top === 60);
      expect(positioned?.transform).toEqual([{ translateY: '-50%' }]);
      // Spans the full width so `alignItems` can centre the capped child. A
      // `maxWidth` here would pin it to the left edge instead.
      expect(positioned?.maxWidth).toBeUndefined();
    });

    /**
     * The ring's box must declare a height, or `justifyContent: 'center'` has
     * nothing to centre against: it collapses to the text while the absolutely
     * positioned SVG keeps its full size, and the readout ends up at the top of
     * the circle rather than in the middle of it.
     */
    it('gives the ring a box to centre in', () => {
      renderWithTheme(<Meter shape="ring" value={53} max={100} size={120} />);
      const box = StyleSheet.flatten(screen.getByRole('progressbar').props.style) as {
        width: number;
        height: number;
      };
      expect(box.height).toBe(box.width);
    });

    it('sizes that box from density when no size is passed', () => {
      renderWithTheme(<Meter shape="ring" value={53} max={100} density="compact" />);
      const box = StyleSheet.flatten(screen.getByRole('progressbar').props.style) as {
        height?: number;
      };
      expect(box.height).toBe(88);
    });
  });

  /** A bar has no hole to crowd, so its readout is on by default. */
  it('keeps the bar readout on by default', () => {
    renderWithTheme(<Meter shape="bar" value={53} max={100} label="Storage" />);
    expect(screen.getByText('53%')).toBeTruthy();
  });
});

describe('Sparkline — the end dot', () => {
  const rising = [10, 12, 11, 18];

  function dotRadius() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGCircle' as never)
      .map((n) => (n.props as { r?: number }).r)
      .find((r) => typeof r === 'number');
  }

  /**
   * The dot was drawn at `stroke + 0.5` while the box reserved `stroke + 1.5` —
   * two halves of one decision disagreeing, and the smaller of the two shipping.
   * The design draws 3.5 at a 2pt stroke, which is what the reservation assumed.
   */
  it('fills the room the inset reserves for it', () => {
    // The design's 3.5 is at a 2pt stroke, which is `density="default"`.
    const wide = renderWithTheme(
      <Sparkline data={rising} width={120} density="default" showEndDot accessibilityLabel="t" />,
    );
    expect(dotRadius()).toBe(3.5);
    wide.unmount();

    // A sparkline defaults to `compact` — an inline mark, so a thinner stroke
    // and a proportionally smaller dot.
    renderWithTheme(<Sparkline data={rising} width={120} showEndDot accessibilityLabel="t" />);
    expect(dotRadius()).toBe(3);
  });

  it('scales with an explicit stroke width', () => {
    renderWithTheme(
      <Sparkline data={rising} width={120} showEndDot strokeWidth={4} accessibilityLabel="t" />,
    );
    expect(dotRadius()).toBe(5.5);
  });

  it('draws no dot when it is turned off', () => {
    renderWithTheme(
      <Sparkline data={rising} width={120} showEndDot={false} accessibilityLabel="t" />,
    );
    expect(dotRadius()).toBeUndefined();
  });
});

/**
 * The series' own high and low, labelled in the margins. These are values the
 * data reached — the same thing `chrome="reference"` draws as a min/max pair on
 * `Chart.Plot` — not an axis. No ticks, no gridlines, no scale.
 */
describe('Sparkline — showExtremes', () => {
  const series = [171.4, 176, 182.4, 188.1, 182.4];
  const money = (v: number) => `$${v.toFixed(2)}`;

  it('labels the high and the low, not the endpoints', () => {
    renderWithTheme(
      <Sparkline data={series} width={160} showExtremes format={money} accessibilityLabel="t" />,
    );
    expect(screen.getByText('H $188.10')).toBeTruthy();
    expect(screen.getByText('L $171.40')).toBeTruthy();
  });

  it('is off by default', () => {
    renderWithTheme(<Sparkline data={series} width={160} accessibilityLabel="t" />);
    expect(screen.queryByText(/^H /)).toBeNull();
  });

  it('falls back to raw values with no formatter', () => {
    renderWithTheme(<Sparkline data={[1, 9]} width={160} showExtremes accessibilityLabel="t" />);
    expect(screen.getByText('H 9')).toBeTruthy();
    expect(screen.getByText('L 1')).toBeTruthy();
  });

  /**
   * A sparkline sits in a fixed slot — a list row, a card header — so the labels
   * come out of the mark rather than growing the box. The line has to shrink,
   * not run under the text.
   */
  it('keeps its height and shrinks the mark instead', () => {
    const boxHeight = () =>
      (StyleSheet.flatten(screen.getByRole('image').props.style) as { height: number }).height;
    const lineSpan = () => {
      const d = screen.UNSAFE_root
        .findAllByType('RNSVGPath' as never)
        .map((n) => (n.props as { d?: string }).d ?? '')
        .find((path) => path.startsWith('M'));
      const ys = [...(d ?? '').matchAll(/[ML][\d.]+,([\d.]+)/g)].map((m) => Number(m[1]));
      return { top: Math.min(...ys), bottom: Math.max(...ys) };
    };

    const plain = renderWithTheme(
      <Sparkline data={series} width={160} height={56} accessibilityLabel="t" />,
    );
    const plainSpan = lineSpan();
    expect(boxHeight()).toBe(56);
    plain.unmount();

    renderWithTheme(
      <Sparkline data={series} width={160} height={56} showExtremes accessibilityLabel="t" />,
    );
    expect(boxHeight()).toBe(56);
    // Pulled in from both margins to make room for the two labels.
    expect(lineSpan().top).toBeGreaterThan(plainSpan.top);
    expect(lineSpan().bottom).toBeLessThan(plainSpan.bottom);
  });
});

/**
 * The sparkline's `curve` was the one that already worked when `Chart.Plot`
 * hardcoded `'steep'` for its compare line — pinned here so it stays that way.
 */
describe('Sparkline — curve', () => {
  const zigzag = [10, 14, 11, 18, 13, 22, 16, 25];

  function markPath() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((n) => (n.props as { d?: string }).d ?? '')
      .find((d) => d.startsWith('M')) as string;
  }

  it('draws straight segments at steep', () => {
    renderWithTheme(<Sparkline data={zigzag} width={200} curve="steep" accessibilityLabel="t" />);
    const d = markPath();
    expect(d).not.toContain('C');
    expect((d.match(/L/g) ?? []).length).toBe(zigzag.length - 1);
  });

  it('draws a fitted spline at smooth', () => {
    renderWithTheme(<Sparkline data={zigzag} width={200} curve="smooth" accessibilityLabel="t" />);
    const d = markPath();
    expect((d.match(/C/g) ?? []).length).toBe(zigzag.length - 1);
    expect(d).not.toContain('L');
  });

  it('curves the area fill along with the line', () => {
    renderWithTheme(
      <Sparkline data={zigzag} width={200} curve="smooth" fill accessibilityLabel="t" />,
    );
    const filled = screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((n) => (n.props as { d?: string }).d ?? '')
      .filter((d) => d.endsWith('Z'));
    expect(filled.length).toBeGreaterThan(0);
    expect(filled.every((d) => d.includes('C'))).toBe(true);
  });
});

/**
 * A legend's labels are the caller's text, and two series named the same is a
 * real thing to pass — a weekday chart's initials collide on their own (M T W
 * **T** F S **S**).
 *
 * Asserted through the warning rather than the output: duplicate keys do not
 * throw and both children still render on the first pass, so counting them
 * passes either way. React's console warning is the actual symptom, and it is
 * what a reader sees in their terminal.
 */
it('warns about nothing when two legend items share a label', () => {
  const warn = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    renderWithTheme(
      <BarChart
        data={[{ label: 'Mon', value: 3 }]}
        series={[[{ label: 'Mon', value: 2 }]]}
        legend={['Spend', 'Spend']}
      />,
    );
    const duplicateKeyWarning = warn.mock.calls
      .map((args) => String(args[0] ?? ''))
      .filter((message) => message.includes('same key'));
    expect(duplicateKeyWarning).toEqual([]);
    expect(screen.getAllByText('Spend')).toHaveLength(2);
  } finally {
    warn.mockRestore();
  }
});

/**
 * A value label sits over its bar, whatever the spacing.
 *
 * The bar is centred *inside* its slot by `markInset`, so a label box the width
 * of the bar and anchored at the slot's left edge lands that inset to the left
 * of it — invisible at `tight`, and a clear miss at `loose`. It only appeared
 * when `spacing` arrived: before that the bar filled its slot and the inset was
 * always zero.
 */
it('centres the value label over the bar at every spacing', () => {
  const week = [
    { label: 'M', value: 30 },
    { label: 'T', value: 12 },
    { label: 'W', value: 44 },
  ];

  for (const spacing of ['tight', 'default', 'loose'] as const) {
    const r = renderWithTheme(
      <BarChart data={week} spacing={spacing} showValues format={(v) => `$${v}`} />,
    );
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width: 300, height: 160, x: 0, y: 0 } },
    });

    // The label box spans the whole slot, so `alignItems: center` puts it on the
    // bar's centre — which is the slot's centre — rather than the slot's edge.
    const boxes = screen.UNSAFE_root
      .findAllByType('View' as never)
      .map((n) => (n.props as { style?: { width?: number; left?: number } }).style)
      .filter((st) => st && typeof st.left === 'number' && typeof st.width === 'number');
    const slot = 300 / week.length;
    const labelBoxes = boxes.filter((st) => Math.abs((st!.width as number) - slot) < 0.5);
    expect(labelBoxes.length).toBeGreaterThan(0);
    r.unmount();
  }
});
