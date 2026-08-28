import {
  annulusPath,
  areaPath,
  barPath,
  densityMetrics,
  interpolateSeries,
  linePath,
  makeScale,
  resample,
  seriesStats,
  toPoints,
} from '../core';
import { formatMoney, formatNumber, formatPercent } from '../format';

/**
 * The geometry is the thing Arlo took ownership of, so it is tested directly
 * rather than only through what it happens to render. Everything here is pure.
 */
describe('chart data model', () => {
  it('accepts a bare number[] as sugar for points', () => {
    expect(toPoints([1, 2, 3])).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
  });

  it('passes points through untouched, including their time and meta', () => {
    const points = [{ value: 5, at: 1700000000, label: 'Mon', meta: { id: 'a' } }];
    expect(toPoints(points)).toEqual(points);
  });

  it('reports first, last, min, max, and span', () => {
    expect(seriesStats(toPoints([10, 4, 18, 12]))).toEqual({
      count: 4,
      first: 10,
      last: 12,
      min: 4,
      max: 18,
      span: 14,
    });
  });

  it('survives an empty series without producing NaN', () => {
    const stats = seriesStats([]);
    expect(stats).toEqual({ count: 0, first: 0, last: 0, min: 0, max: 0, span: 0 });
  });
});

describe('makeScale', () => {
  const scale = makeScale({ count: 5, min: 0, span: 100, width: 212, height: 180, inset: 6 });

  it('spans the usable track end to end', () => {
    expect(scale.x(0)).toBeCloseTo(6);
    expect(scale.x(4)).toBeCloseTo(206);
  });

  it('puts the maximum at the top, since SVG y grows downward', () => {
    expect(scale.y(100)).toBeCloseTo(6);
    expect(scale.y(0)).toBeCloseTo(174);
  });

  it('is its own inverse at every vertex, which is what keeps the crosshair honest', () => {
    for (let index = 0; index < 5; index += 1) {
      expect(scale.indexAt(scale.x(index))).toBe(index);
    }
  });

  it('clamps a scrub that runs off either end', () => {
    expect(scale.indexAt(-9999)).toBe(0);
    expect(scale.indexAt(9999)).toBe(4);
  });

  it('draws a flat series down the middle rather than dividing by zero', () => {
    const flat = makeScale({ count: 3, min: 5, span: 0, width: 100, height: 100, inset: 0 });
    expect(flat.y(5)).toBe(50);
    expect(Number.isNaN(flat.y(5))).toBe(false);
  });

  it('centres a single point instead of pinning it to the left edge', () => {
    const one = makeScale({ count: 1, min: 0, span: 0, width: 100, height: 50, inset: 10 });
    expect(one.x(0)).toBe(50);
  });
});

describe('path builders', () => {
  const points = [
    { x: 0, y: 10 },
    { x: 10, y: 0 },
    { x: 20, y: 5 },
  ];

  it('joins points with straight segments by default', () => {
    expect(linePath(points)).toBe('M0.00,10.00 L10.00,0.00 L20.00,5.00');
  });

  it('emits cubic curves for a smooth line', () => {
    const smooth = linePath(points, 'smooth');
    expect(smooth).toContain('C');
    expect(smooth.startsWith('M0.00,10.00')).toBe(true);
  });

  it('passes the spline through every sample, not near them', () => {
    // A Catmull-Rom spline interpolates its control points. A chart whose line
    // misses its own data is worse than a jagged one.
    const smooth = linePath(points, 'smooth');
    expect(smooth).toContain('20.00,5.00');
    expect(smooth).toContain('10.00,0.00');
  });

  it('closes the area down to the floor and back', () => {
    const area = areaPath(points, 20);
    expect(area.endsWith('L20.00,20.00 L0.00,20.00 Z')).toBe(true);
  });

  it('returns an empty string rather than a malformed path for no points', () => {
    expect(linePath([])).toBe('');
    expect(areaPath([], 10)).toBe('');
  });
});

describe('barPath', () => {
  it('rounds only the data end of a positive bar', () => {
    const d = barPath({ x: 0, y: 10, width: 20, height: 30, radius: 4, roundedEnd: 'top' });
    // Two arcs at the top, and the bottom closes with plain linetos: a bar is
    // anchored to its baseline, and rounding that end would lift it off zero.
    expect(d.match(/A/g)).toHaveLength(2);
    expect(d).toContain('L20.00,40.00 L0.00,40.00');
  });

  it('rounds the bottom for a bar hanging below the baseline', () => {
    const d = barPath({ x: 0, y: 10, width: 20, height: 30, radius: 4, roundedEnd: 'bottom' });
    expect(d.startsWith('M0.00,10.00 L20.00,10.00')).toBe(true);
    expect(d.match(/A/g)).toHaveLength(2);
  });

  it('clamps the radius so a short bar cannot invert its own corners', () => {
    const d = barPath({ x: 0, y: 0, width: 20, height: 2, radius: 8, roundedEnd: 'top' });
    expect(d).toContain('A2.00,2.00');
  });

  it('draws nothing for a zero-height bar', () => {
    expect(barPath({ x: 0, y: 0, width: 20, height: 0, radius: 4, roundedEnd: 'top' })).toBe('');
  });
});

describe('annulusPath', () => {
  it('cuts a hole rather than painting one', () => {
    const d = annulusPath({
      cx: 50,
      cy: 50,
      outerRadius: 50,
      innerRadius: 30,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    // Out along the outer arc, in to the inner radius, back along the inner arc.
    expect(d.match(/A/g)).toHaveLength(2);
    expect(d).toContain('A50.00,50.00');
    expect(d).toContain('A30.00,30.00');
  });

  it('splits a full turn into two arcs, which a single arc command cannot express', () => {
    const d = annulusPath({
      cx: 50,
      cy: 50,
      outerRadius: 50,
      innerRadius: 30,
      startAngle: 0,
      endAngle: Math.PI * 2,
    });
    // Two per ring, two rings — a lone slice covering the whole donut still has a
    // hole in it.
    expect(d.match(/A/g)).toHaveLength(4);
  });

  it('sets the large-arc flag past a half turn', () => {
    const small = annulusPath({
      cx: 0, cy: 0, outerRadius: 10, innerRadius: 5, startAngle: 0, endAngle: 1,
    });
    const large = annulusPath({
      cx: 0, cy: 0, outerRadius: 10, innerRadius: 5, startAngle: 0, endAngle: 4,
    });
    expect(small).toContain('0 0 1');
    expect(large).toContain('0 1 1');
  });

  it('draws a solid wedge when there is no inner radius', () => {
    const d = annulusPath({
      cx: 0, cy: 0, outerRadius: 10, innerRadius: 0, startAngle: 0, endAngle: 1,
    });
    expect(d.startsWith('M0.00,0.00')).toBe(true);
  });

  it('draws nothing for a zero-width slice', () => {
    expect(
      annulusPath({ cx: 0, cy: 0, outerRadius: 10, innerRadius: 5, startAngle: 1, endAngle: 1 }),
    ).toBe('');
  });
});

describe('resample', () => {
  it('is the identity at the same length', () => {
    expect(resample([1, 2, 3], 3)).toEqual([1, 2, 3]);
  });

  it('keeps both ends pinned when stretching', () => {
    const out = resample([0, 10], 5);
    expect(out[0]).toBe(0);
    expect(out.at(-1)).toBe(10);
    expect(out).toEqual([0, 2.5, 5, 7.5, 10]);
  });

  it('keeps both ends pinned when shrinking', () => {
    const out = resample([0, 1, 2, 3, 4], 3);
    expect(out[0]).toBe(0);
    expect(out.at(-1)).toBe(4);
  });

  it('holds a single point flat across the requested length', () => {
    expect(resample([7], 4)).toEqual([7, 7, 7, 7]);
  });

  it('makes two different-length periods interpolable, which is the whole point', () => {
    const week = [1, 2, 3];
    const year = [10, 20, 30, 40, 50, 60];
    const frames = Math.max(week.length, year.length);
    const a = resample(week, frames);
    const b = resample(year, frames);
    expect(a).toHaveLength(frames);
    expect(b).toHaveLength(frames);

    expect(interpolateSeries(a, b, 0)).toEqual(a);
    expect(interpolateSeries(a, b, 1)).toEqual(b);
    const mid = interpolateSeries(a, b, 0.5);
    expect(mid[0]).toBeCloseTo((a[0] as number + (b[0] as number)) / 2);
  });
});

describe('densityMetrics', () => {
  it('drops labels and thins the stroke at compact', () => {
    expect(densityMetrics('compact')).toMatchObject({ showLabels: false, stroke: 1.5, dot: 4 });
    expect(densityMetrics('default')).toMatchObject({ showLabels: true, stroke: 2, dot: 6 });
  });
});

/**
 * The docs demonstrated a `money` helper that did not exist. These are it.
 * Locales are pinned so the expectations don't depend on the test machine.
 */
describe('formatters', () => {
  it('formats currency', () => {
    expect(formatMoney('USD', { locale: 'en-US' })(1240.5)).toBe('$1,240.50');
  });

  it('honours the currency’s own fraction convention, and an override', () => {
    expect(formatMoney('JPY', { locale: 'en-US' })(1240)).toBe('¥1,240');
    expect(formatMoney('USD', { locale: 'en-US', fractionDigits: 0 })(1240.5)).toBe('$1,241');
  });

  it('compacts when asked', () => {
    expect(formatMoney('USD', { locale: 'en-US', compact: true })(12400)).toBe('$12K');
  });

  it('treats a percent as a fraction by default, and as a percent when told', () => {
    expect(formatPercent({ locale: 'en-US' })(0.6234)).toBe('62.3%');
    expect(formatPercent({ locale: 'en-US', scale: 'percent' })(62.34)).toBe('62.3%');
  });

  it('groups a plain number', () => {
    expect(formatNumber({ locale: 'en-US' })(1240500)).toBe('1,240,500');
  });
});
