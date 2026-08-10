import { Chart } from '../chart';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

/**
 * The line is drawn by gifted-charts, but the scrub dot and the baseline rule are
 * this component's own SVG overlay. Nothing about that coupling is type-checked:
 * gifted-charts pads its drawing box by a hardcoded 10px
 * (`getExtendedContainerHeightWithPadding`), so if that constant ever changes the
 * dot silently drifts off the line. This pins the two together.
 */
describe('Chart.Plot overlay alignment', () => {
  const WIDTH = 212; // 6px inset either side => 200px usable track
  const HEIGHT = 180; // => 168px usable, 5 points => 50px spacing
  const INSET = 6;

  function pathsFor(data: number[], curve: 'steep' | 'smooth' = 'steep') {
    renderWithTheme(
      <Chart data={data}>
        <Chart.Plot height={HEIGHT} fill={false} showBaseline={false} curve={curve} />
      </Chart>,
    );
    fireEvent(screen.getByRole('image'), 'layout', {
      nativeEvent: { layout: { width: WIDTH, height: HEIGHT, x: 0, y: 0 } },
    });
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => (node.props as { d?: string }).d?.trim())
      .filter((d): d is string => typeof d === 'string');
  }

  it('draws the line where the scrub overlay computes its points', () => {
    // A rising ramp: first point sits at the floor, last at the ceiling.
    const paths = pathsFor([0, 25, 50, 75, 100]);
    const line = paths.find((d) => /^M[\d.]+ [\d.]+( L[\d.]+ [\d.]+){4}$/.test(d));
    expect(line).toBeDefined();

    const points = [...(line as string).matchAll(/([\d.]+) ([\d.]+)/g)].map(([, x, y]) => ({
      // The plot is offset by the inset, and lifted by gifted-charts' 10px pad.
      x: Number(x) + INSET,
      y: Number(y) + INSET - 10,
    }));

    const usableWidth = WIDTH - INSET * 2;
    const usableHeight = HEIGHT - INSET * 2;

    // Same geometry `pointAt` uses to place the scrub dot.
    points.forEach((point, index) => {
      const ratio = index / (points.length - 1);
      expect(point.x).toBeCloseTo(INSET + ratio * usableWidth, 1);
      expect(point.y).toBeCloseTo(INSET + (1 - ratio) * usableHeight, 1);
    });
  });

  it('draws straight segments by default and a spline on curve="smooth"', () => {
    const straight = pathsFor([0, 25, 50, 75, 100]).find((d) => d.startsWith('M'));
    // Straight joins are plain lineto commands.
    expect(straight).toMatch(/^M[\d.]+ [\d.]+( L[\d.]+ [\d.]+)+$/);
    // A spline needs curve commands, so the two must not be the same path.
    const smooth = pathsFor([0, 25, 50, 75, 100], 'smooth').find((d) => d.startsWith('M'));
    expect(smooth).toContain('C');
    expect(smooth).not.toEqual(straight);
  });
});
