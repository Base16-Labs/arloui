import { SkeletonBlock } from '../skeleton';
import { waitFor } from '@testing-library/react-native';
/**
 * Loading and empty, across all five forms.
 *
 * These live in their own file because the contract they check is a cross-form
 * one: whatever a chart draws while it waits has to occupy the same footprint the
 * data will, and must never show a number the caller has not supplied. Both are
 * easy to regress one form at a time, which is exactly how they were missing on
 * three of the five to begin with.
 */
import { StyleSheet } from 'react-native';
import { BarChart } from '../bar-chart';
import { Chart } from '../index';
import { DonutChart } from '../donut-chart';
import { Meter } from '../meter';
import { Sparkline } from '../sparkline';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

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

  it('leaves the donut hole empty while loading', async () => {
    // The centre used to hold a skeleton block standing in for the total. Inside
    // a ring that is itself pulsing it read as a line struck through the chart
    // rather than as a number arriving, so the hole is now simply empty and the
    // track's pulse carries the loading state on its own.
    const { rerender } = renderWithTheme(<DonutChart data={spend} format={money} loading />);

    const boxes = screen.UNSAFE_root
      .findAllByType('View' as never)
      .map((n) => (n.props as { style?: { width?: number; height?: number } }).style)
      .filter((st) => st && st.width === 72 && st.height === 20);
    expect(boxes).toEqual([]);

    // Still renders the total once it has one, so the hole is empty, not gone.
    rerender(<DonutChart data={spend} format={money} />);
    await waitFor(() => expect(screen.getByText('$1680.00')).toBeTruthy());
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

/**
 * The readouts, which is where "never show a number the caller has not supplied"
 * was being broken. `Chart.Value` and `Chart.Delta` rendered a formatted zero
 * while loading — indistinguishable from a real zero balance, which is the one
 * value a money screen must never invent.
 */
describe('loading — the readouts', () => {
  it('shows no headline figure until there is one', async () => {
    const { rerender } = renderWithTheme(
      <Chart data={[10, 20, 30]} format={money} loading>
        <Chart.Value />
      </Chart>,
    );
    /*
     * `includeHiddenElements`: the counter rolls per character and hides its
     * glyphs from the a11y tree, so the default query cannot see them either
     * way — which would make this pass whether or not the fix is in place.
     */
    const glyph = (text: string) => screen.queryByText(text, { includeHiddenElements: true });
    expect(glyph('$')).toBeNull();
    expect(glyph('0')).toBeNull();

    rerender(
      <Chart data={[10, 20, 30]} format={money}>
        <Chart.Value />
      </Chart>,
    );
    await waitFor(() => expect(glyph('$')).toBeTruthy());
  });

  it('makes no claim about direction until there is one', () => {
    renderWithTheme(
      <Chart data={[10, 20, 30]} format={money} loading>
        <Chart.Delta />
      </Chart>,
    );
    // No sign, no magnitude, no percentage.
    expect(screen.queryByText(/%/)).toBeNull();
  });

  /**
   * A pressable period row over a chart with no series lets the reader ask for
   * 1Y and get the same shimmer back, so the control reads as broken.
   */
  it('does not offer a period selector while loading', async () => {
    const onPeriodChange = jest.fn();
    const { rerender } = renderWithTheme(
      <Chart data={[]} periods={['1D', '1W']} period="1D" onPeriodChange={onPeriodChange} loading>
        <Chart.Periods />
      </Chart>,
    );
    expect(screen.queryAllByRole('tab')).toHaveLength(0);

    rerender(
      <Chart data={[1, 2]} periods={['1D', '1W']} period="1D" onPeriodChange={onPeriodChange}>
        <Chart.Periods />
      </Chart>,
    );
    await waitFor(() => expect(screen.queryAllByRole('tab')).toHaveLength(2));
  });
});

/**
 * Failing to a blank rectangle is how a data screen looks broken, so the slot is
 * a headline, one line, and one action rather than a bare string.
 */
describe('Chart.Empty', () => {
  function layout(width = 320) {
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width, height: 180, x: 0, y: 0 } },
    });
  }

  it('renders the headline, the line, and the action', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Chart data={[]}>
        <Chart.Empty
          title="No activity yet"
          description="Your spending will show up here."
          action={{ label: 'Log a transaction', onPress }}
        />
        <Chart.Plot />
      </Chart>,
    );

    expect(screen.getByText('No activity yet')).toBeTruthy();
    expect(screen.getByText('Your spending will show up here.')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Log a transaction' }));
    expect(onPress).toHaveBeenCalled();
  });

  /** The slot was a string before it had a shape; that must keep working. */
  it('still takes a bare string', () => {
    renderWithTheme(
      <Chart data={[]}>
        <Chart.Empty>No trades yet</Chart.Empty>
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText('No trades yet')).toBeTruthy();
  });

  it('lets children win over the structured props', () => {
    renderWithTheme(
      <Chart data={[]}>
        <Chart.Empty title="Ignored">Custom slot</Chart.Empty>
        <Chart.Plot />
      </Chart>,
    );
    expect(screen.getByText('Custom slot')).toBeTruthy();
    expect(screen.queryByText('Ignored')).toBeNull();
  });
});

/**
 * The bar chart's own loading state, which had the same leak `Chart.Value` did:
 * a figure painted before the chart had one.
 */
describe('BarChart — loading', () => {
  const week = [
    { label: 'M', value: 30 },
    { label: 'T', value: 12 },
    { label: 'W', value: 44 },
  ];

  function layout(width = 300) {
    const node = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(node as never, 'layout', {
      nativeEvent: { layout: { width, height: 160, x: 0, y: 0 } },
    });
  }

  /**
   * They were positioned by `yFor(bar.value)` — the loaded geometry — while the
   * bars underneath used the fixed skeleton profile, so the numbers floated at
   * heights nothing on screen agreed with.
   */
  it('shows no value labels over the silhouette', async () => {
    const { rerender } = renderWithTheme(
      <BarChart data={week} showValues format={money} loading />,
    );
    layout();
    expect(screen.queryByText('$30.00')).toBeNull();
    expect(screen.queryByText('$44.00')).toBeNull();

    rerender(<BarChart data={week} showValues format={money} />);
    layout();
    await waitFor(() => expect(screen.getByText('$30.00')).toBeTruthy());
  });

  it('shows no value labels for a selected category either', () => {
    renderWithTheme(<BarChart data={week} activeIndex={0} format={money} loading />);
    layout();
    expect(screen.queryByText('$30.00')).toBeNull();
  });
});

/**
 * The sparkline's own rare states. Both were drawn as thin strokes, which made
 * one nearly invisible and the other indistinguishable from real data.
 */
describe('Sparkline — loading and empty', () => {
  function paths() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((n) => n.props as { d?: string; fill?: unknown; strokeDasharray?: unknown });
  }

  it('reserves the plot without drawing an invented trend', () => {
    renderWithTheme(<Sparkline data={[1, 4, 2, 8]} width={120} loading accessibilityLabel="t" />);
    expect(paths()).toHaveLength(0);
    expect(screen.UNSAFE_getByType(SkeletonBlock).props.width).toBeGreaterThan(0);
  });

  /**
   * Every other form falls back to a short label; the sparkline said nothing at
   * all about *why* it was blank. It is opt-in rather than a default because a
   * 28pt list row genuinely has no room for words.
   */
  it('takes the same short label the other forms do', () => {
    renderWithTheme(<Sparkline data={[]} width={120} emptyLabel="No trades" accessibilityLabel="t" />);
    expect(screen.getByText('No trades')).toBeTruthy();
  });

  /**
   * The slot sets its own height. Nested inside the sparkline's fixed box it was
   * crushed — the icon tile alone is 52pt against a 28pt inline mark — which is
   * why it did not look like the empty state on any other form.
   */
  it('lets the composed slot size itself instead of crushing it into the mark', () => {
    renderWithTheme(
      <Sparkline
        data={[]}
        width={240}
        height={28}
        empty={{ title: 'Nothing yet' }}
        accessibilityLabel="t"
      />,
    );
    const box = StyleSheet.flatten(screen.getByText('Nothing yet').parent?.props?.style) as
      | { height?: number }
      | undefined;
    // Whatever wraps it, nothing pins it to the 28pt mark.
    expect(box?.height).toBeUndefined();
    expect(screen.queryByRole('image')).toBeNull();
  });

  it('takes the composed slot where there is height for it', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Sparkline
        data={[]}
        width={240}
        height={160}
        emptyLabel="No trades"
        empty={{ title: 'Nothing yet', description: 'Trades will show here.', action: { label: 'Trade', onPress } }}
        accessibilityLabel="t"
      />,
    );
    expect(screen.getByText('Nothing yet')).toBeTruthy();
    // The slot wins over the bare label.
    expect(screen.queryByText('No trades')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Trade' }));
    expect(onPress).toHaveBeenCalled();
  });

  /**
   * A solid rule across the middle is exactly what a flat series looks like, so
   * "nothing" and "zero change" were the same picture.
   */
  it('dashes the empty rule so it cannot read as flat data', () => {
    const bare = renderWithTheme(<Sparkline data={[]} width={120} accessibilityLabel="t" />);
    expect(paths().find((p) => p.strokeDasharray != null)).toBeDefined();
    bare.unmount();

    // With words, the words replace it — two blank-state marks would be noise.
    const labelled = renderWithTheme(
      <Sparkline data={[]} width={120} emptyLabel="None" accessibilityLabel="t" />,
    );
    expect(paths().find((p) => p.strokeDasharray != null)).toBeUndefined();
    labelled.unmount();

    // A genuinely flat series stays solid — it is a measurement, not an absence.
    renderWithTheme(<Sparkline data={[5, 5, 5, 5]} width={120} accessibilityLabel="t" />);
    expect(paths().find((p) => p.strokeDasharray != null)).toBeUndefined();
  });
});

/**
 * An empty chart is the slot and nothing else, across every form that has one.
 *
 * The slot used to be drawn inside the plot's own box, which left the readout,
 * the delta, and the period selector standing around it on the plot — and the
 * legend under the bar chart naming series that have no bars. Every one of those
 * is a claim about data the chart does not have: a `$0.00` describing a series
 * that is not there, periods selecting between nothing and nothing.
 */
describe('empty collapses to the slot', () => {
  const slot = {
    title: 'No activity yet',
    description: 'Your spending will show up here.',
    action: { label: 'Log a transaction', onPress: () => {} },
  };
  const money = (v: number) => `$${v.toFixed(2)}`;

  /** Every literal string rendered anywhere in the tree. */
  function texts() {
    return screen.UNSAFE_root
      .findAllByType('Text' as never)
      .map((n) => (n.props as { children?: unknown }).children)
      .filter((c): c is string => typeof c === 'string');
  }

  it('shows no readout, delta, or periods on the plot', () => {
    renderWithTheme(
      <Chart
        data={[]}
        format={money}
        periods={['1D', '1W', '1M']}
        period="1D"
        onPeriodChange={() => {}}
      >
        <Chart.Empty {...slot} />
        <Chart.Value />
        <Chart.Delta />
        <Chart.Plot />
        <Chart.Periods />
      </Chart>,
    );

    expect(texts()).toEqual([slot.title, slot.description]);
    expect(screen.getByRole('button', { name: slot.action.label })).toBeTruthy();
    // No period pills to select between nothing and nothing.
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('shows no legend under the bar chart', () => {
    renderWithTheme(<BarChart data={[]} empty={slot} legend={['Sleep', 'Activity']} />);
    expect(texts()).toEqual([slot.title, slot.description]);
    expect(screen.queryByText('Sleep')).toBeNull();
  });

  it('is the same on the donut and the sparkline', () => {
    const donut = renderWithTheme(<DonutChart data={[]} empty={slot} showLegend />);
    expect(texts()).toEqual([slot.title, slot.description]);
    donut.unmount();

    renderWithTheme(
      <Sparkline data={[]} width={240} height={120} empty={slot} accessibilityLabel="t" />,
    );
    expect(texts()).toEqual([slot.title, slot.description]);
  });

  /** Without a slot the forms keep their shape and their own short message. */
  it('leaves the composition alone when no slot is given', () => {
    renderWithTheme(
      <Chart data={[]} format={money} periods={['1D', '1W']} period="1D" onPeriodChange={() => {}}>
        <Chart.Plot />
        <Chart.Periods />
      </Chart>,
    );
    expect(screen.queryAllByRole('tab')).toHaveLength(2);
  });
});
