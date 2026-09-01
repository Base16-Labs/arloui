import { Chart } from '../index';
import { makeScale } from '../core';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

/**
 * This file used to pin Arlo's scrub overlay to gifted-charts' private layout: the
 * library padded its drawing box by a hardcoded 10px, so the dot drifted off the
 * line whenever that constant moved, and nothing about the coupling was
 * type-checked.
 *
 * There is no coupling left to pin. Arlo draws the line and the crosshair from the
 * same `makeScale`, so what this file checks now is that the one scale is really
 * the one being used — the line lands where `makeScale` says, and the dot lands on
 * the line rather than near it.
 */
describe('Chart.Plot geometry', () => {
  const WIDTH = 212; // 6px inset either side => 200px usable track
  const HEIGHT = 180; // => 168px usable
  const INSET = 6; // density="default"

  function layout() {
    fireEvent(screen.getByRole('image'), 'layout', {
      nativeEvent: { layout: { width: WIDTH, height: HEIGHT, x: 0, y: 0 } },
    });
  }

  function paths() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => (node.props as { d?: string }).d?.trim())
      .filter((d): d is string => typeof d === 'string');
  }

  function circles() {
    return screen.UNSAFE_root
      .findAllByType('RNSVGCircle' as never)
      .map((node) => node.props as { cx: number; cy: number });
  }

  function pathsFor(data: number[], curve: 'steep' | 'smooth' = 'steep') {
    renderWithTheme(
      <Chart data={data}>
        <Chart.Plot height={HEIGHT} fill={false} chrome="none" curve={curve} />
      </Chart>,
    );
    layout();
    return paths();
  }

  /** Single-touch shape PanResponder needs; it reads `touchHistory`, not `nativeEvent`. */
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

  it('draws the line exactly where the shared scale puts it', () => {
    // A rising ramp: first point sits at the floor, last at the ceiling.
    const line = pathsFor([0, 25, 50, 75, 100]).find((d) => /^M[\d.]+,[\d.]+( L[\d.]+,[\d.]+){4}$/.test(d));
    expect(line).toBeDefined();

    const drawn = [...(line as string).matchAll(/([\d.]+),([\d.]+)/g)].map(([, x, y]) => ({
      x: Number(x),
      y: Number(y),
    }));

    const scale = makeScale({
      count: 5,
      min: 0,
      span: 100,
      width: WIDTH,
      height: HEIGHT,
      inset: INSET,
    });

    drawn.forEach((point, index) => {
      expect(point.x).toBeCloseTo(scale.x(index), 1);
      expect(point.y).toBeCloseTo(scale.y(index * 25), 1);
    });
  });

  it('puts the scrub dot on the line, not near it', () => {
    renderWithTheme(
      <Chart data={[0, 25, 50, 75, 100]}>
        <Chart.Plot height={HEIGHT} fill={false} chrome="none" />
      </Chart>,
    );
    layout();

    // Drag to the middle of the track -> index 2.
    fireEvent(screen.getByRole('image'), 'responderGrant', touchEvent(INSET + 100));

    const line = paths().find((d) => /^M[\d.]+,[\d.]+( L[\d.]+,[\d.]+){4}$/.test(d));
    const vertices = [...(line as string).matchAll(/([\d.]+),([\d.]+)/g)].map(([, x, y]) => ({
      x: Number(x),
      y: Number(y),
    }));

    const dot = circles().at(-1);
    expect(dot).toBeDefined();
    // The third vertex is the point under the finger. The dot must be on it.
    expect(dot?.cx).toBeCloseTo(vertices[2]?.x as number, 5);
    expect(dot?.cy).toBeCloseTo(vertices[2]?.y as number, 5);
  });

  it('draws straight segments by default and a spline on curve="smooth"', () => {
    const straight = pathsFor([0, 25, 50, 75, 100]).find((d) => d.startsWith('M'));
    // Straight joins are plain lineto commands.
    expect(straight).toMatch(/^M[\d.]+,[\d.]+( L[\d.]+,[\d.]+)+$/);
    // A spline needs curve commands, so the two must not be the same path.
    const smooth = pathsFor([0, 25, 50, 75, 100], 'smooth').find((d) => d.startsWith('M'));
    expect(smooth).toContain('C');
    expect(smooth).not.toEqual(straight);
  });

  it('honours density: compact draws a thinner stroke and a smaller dot', () => {
    renderWithTheme(
      <Chart data={[0, 50, 100]} density="compact">
        <Chart.Plot height={HEIGHT} fill={false} chrome="none" />
      </Chart>,
    );
    layout();
    fireEvent(screen.getByRole('image'), 'responderGrant', touchEvent(6));

    const stroke = screen.UNSAFE_root
      .findAllByType('RNSVGPath' as never)
      .map((node) => (node.props as { strokeWidth?: number }).strokeWidth)
      .find((width) => width === 1.5);
    expect(stroke).toBe(1.5);
    expect(circles().at(-1)).toMatchObject({ r: 4 });
  });
});
