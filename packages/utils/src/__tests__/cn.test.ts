import { cn } from '../cn';

describe('cn', () => {
  it('drops falsy values and keeps truthy styles', () => {
    const a = { color: 'red' };
    const b = { fontSize: 12 };
    expect(cn(a, false, null, undefined, b)).toEqual([a, b]);
  });

  it('returns an empty array when everything is falsy', () => {
    expect(cn(false, null, undefined)).toEqual([]);
  });

  it('preserves order', () => {
    const a = { margin: 1 };
    const b = { margin: 2 };
    expect(cn(a, b)).toEqual([a, b]);
  });
});
