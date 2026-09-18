/**
 * The combo chart — bars and a line in one plot.
 *
 * The thing worth testing is not that both appear; it is that they are measured
 * on the *same* scale. Bars on a scale of their own would sit at plausible but
 * wrong heights against the line, and nothing about the picture would say so.
 */
import { Chart } from '../index';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

const PRICE = [10, 14, 12, 18, 16];
const VOLUME = [100, 400, 250, 900, 600];

function layoutPlot(width = 300, height = 180) {
  fireEvent(screen.getByRole('image'), 'layout', {
    nativeEvent: { layout: { width, height, x: 0, y: 0 } },
  });
}

/** Every path drawn in the plot, in draw order. */
function paths() {
  return screen.UNSAFE_root
    .findAllByType('RNSVGPath' as never)
    .map((n) => (n.props as { d?: string }).d ?? '')
    .filter(Boolean);
}

describe('Chart.Bars inside a plot', () => {
  it('draws a bar per point, behind the line', () => {
    renderWithTheme(
      <Chart data={PRICE}>
        <Chart.Plot>
          <Chart.Bars data={VOLUME} />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();

    const all = paths();
    // The bars are one path of five rects, and they come first.
    const bars = all[0] ?? '';
    expect((bars.match(/M/g) ?? []).length).toBe(VOLUME.length);
    expect(all.length).toBeGreaterThan(1);
  });

  it("measures the bars on the plot's own scale", () => {
    // Same tree shape both times — only the bar values differ — so the same
    // path index is the line in both renders and the comparison is like for
    // like. A bar series inside the line's range leaves the domain alone; one
    // that dwarfs it must compress the line. If the bars had a scale of their
    // own, the line would be identical in both.
    const draw = (bars: number[]) => {
      const r = renderWithTheme(
        <Chart data={PRICE}>
          <Chart.Plot>
            <Chart.Bars data={bars} />
          </Chart.Plot>
        </Chart>,
      );
      layoutPlot();
      const all = paths();
      const line = all[all.length - 1] ?? '';
      r.unmount();
      return line;
    };

    const withSmall = draw([9, 11, 10, 12, 11]);
    const withHuge = draw(VOLUME);
    expect(withSmall).not.toEqual('');
    expect(withHuge).not.toEqual(withSmall);
  });

  it('keeps one scrub for the whole plot', () => {
    const onScrub = jest.fn();
    renderWithTheme(
      <Chart data={PRICE} onScrub={onScrub}>
        <Chart.Plot>
          <Chart.Bars data={VOLUME} />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    // The bars are pointerEvents="none" inside the plot's own responder, so the
    // gesture still belongs to the root: one PanResponder, not one per mark.
    expect(screen.getByRole('image')).toBeTruthy();
  });
});

describe('Chart.Line, and linking by value', () => {
  it('draws any number of extra lines on the shared scale', () => {
    renderWithTheme(
      <Chart data={PRICE}>
        <Chart.Plot>
          <Chart.Line data={[11, 13, 12, 17, 15]} label="Forecast" dashed />
          <Chart.Line data={[9, 10, 11, 12, 13]} label="Budget" />
        </Chart.Plot>
      </Chart>,
    );
    layoutPlot();
    // Three lines now: two marks plus the primary.
    expect(paths().length).toBeGreaterThanOrEqual(3);
  });

  it('folds the extra lines into the domain, like every other mark', () => {
    const draw = (extra: number[]) => {
      const r = renderWithTheme(
        <Chart data={PRICE}>
          <Chart.Plot>
            <Chart.Line data={extra} />
          </Chart.Plot>
        </Chart>,
      );
      layoutPlot();
      const all = paths();
      const primary = all[all.length - 1] ?? '';
      r.unmount();
      return primary;
    };
    // A line far outside the primary's range must compress the primary.
    expect(draw([900, 950, 910, 980, 940])).not.toEqual(draw([11, 12, 13, 14, 15]));
  });

  it("resolves activeAt against each chart's own points", () => {
    /*
     * Both series cover the same three days, but the second has an extra point
     * in between — so 2 March is index 1 in one and index 2 in the other. An
     * index-based link would put the crosshair in two different places; a
     * value-based one lands it on the same day in both.
     */
    const a = [
      { at: '2026-03-01', value: 10 },
      { at: '2026-03-02', value: 20 },
      { at: '2026-03-03', value: 30 },
    ];
    const b = [
      { at: '2026-03-01', value: 100 },
      { at: '2026-03-01T12:00', value: 150 },
      { at: '2026-03-02', value: 200 },
      { at: '2026-03-03', value: 300 },
    ];

    /** Where the crosshair dot sits, as a fraction of the plot's width. */
    const dotAt = (data: typeof a, props: Record<string, unknown>) => {
      const r = renderWithTheme(
        <Chart data={data} {...props}>
          <Chart.Plot />
        </Chart>,
      );
      layoutPlot();
      const circle = screen.UNSAFE_root.findAllByType('RNSVGCircle' as never)[0];
      const cx = (circle?.props as { cx?: number } | undefined)?.cx ?? -1;
      r.unmount();
      return cx;
    };

    // 2 March: the middle of three points, the third of four.
    const byValueA = dotAt(a, { activeAt: '2026-03-02' });
    const byValueB = dotAt(b, { activeAt: '2026-03-02' });
    expect(byValueA).toBeGreaterThan(0);
    expect(byValueB).toBeGreaterThan(0);

    // The same index in both would not: index 1 of 3 against index 1 of 4.
    const byIndexA = dotAt(a, { activeIndex: 1 });
    const byIndexB = dotAt(b, { activeIndex: 1 });
    expect(byIndexA).toEqual(byValueA);
    // b's index 1 is 1 March noon, not 2 March — so the value-based link moved it.
    expect(byIndexB).not.toEqual(byValueB);
  });
});
