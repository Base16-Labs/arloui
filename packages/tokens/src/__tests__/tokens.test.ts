import { spacing } from '../spacing';
import { radii } from '../radii';
import { themes } from '../index';

describe('spacing scale', () => {
  it('starts at 0 and increases monotonically', () => {
    const values = Object.values(spacing);
    expect(values[0]).toBe(0);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]!);
    }
  });

  it('sits on a 4px grid', () => {
    for (const v of Object.values(spacing)) {
      expect(v % 4).toBe(0);
    }
  });

  it('keys map to their 4px multiple (space-4 → 16)', () => {
    expect(spacing[4]).toBe(16);
    expect(spacing[1]).toBe(4);
  });
});

describe('radii scale', () => {
  it('uses a pill cap for full', () => {
    expect(radii.full).toBe(9999);
    expect(radii.none).toBe(0);
  });

  it('orders the named steps sm < md < lg < xl < 2xl', () => {
    expect(radii.sm).toBeLessThan(radii.md);
    expect(radii.md).toBeLessThan(radii.lg);
    expect(radii.lg).toBeLessThan(radii.xl);
    expect(radii.xl).toBeLessThan(radii['2xl']);
  });
});

describe('themes', () => {
  it('exposes light and dark', () => {
    expect(Object.keys(themes).sort()).toEqual(['dark', 'light']);
    expect(themes.light.name).toBe('light');
    expect(themes.dark.name).toBe('dark');
  });

  it('light and dark expose the exact same color keys', () => {
    expect(Object.keys(themes.light.colors).sort()).toEqual(
      Object.keys(themes.dark.colors).sort(),
    );
  });

  it('shares scale tokens (spacing/radii) across both themes', () => {
    expect(themes.light.spacing).toBe(spacing);
    expect(themes.dark.radii).toBe(radii);
  });

  it('every color value is a non-empty string', () => {
    for (const theme of [themes.light, themes.dark]) {
      for (const value of Object.values(theme.colors)) {
        expect(typeof value).toBe('string');
        expect((value as string).length).toBeGreaterThan(0);
      }
    }
  });
});
