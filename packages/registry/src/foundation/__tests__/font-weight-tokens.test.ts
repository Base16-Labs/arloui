/**
 * Chart text takes its weight from `fontWeights`, like the rest of the kit.
 *
 * The `token-usage` suite exempts `chart/` wholesale, because chart marks pack
 * against a density scale and their `fontSize`/`lineHeight` literals *are* that
 * scale. Font weight was never part of that argument, but it inherited the
 * exemption, and nineteen literals accumulated behind it — including eight
 * `'700'`s, a weight the scale does not define at all (`fontWeights` stops at
 * `semibold`). The only other 700/900 in the kit are brand logo glyphs rendered
 * in System font, which are deliberately off-token.
 *
 * So this covers the one axis that exemption should never have included.
 *
 * Deliberately scoped to `chart/`: `stepper` and `list` still hardcode four
 * `'600'`s. Those are byte-identical to `fontWeights.semibold` and render the
 * same, so they are a separate, zero-risk cleanup rather than something to fold
 * into a chart change.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const chartRoot = join(__dirname, '..', '..', 'components', 'chart');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

describe('chart font weights', () => {
  it('never hardcodes a numeric font weight', () => {
    const violations = sourceFiles(chartRoot).flatMap((path) => {
      const lines = readFileSync(path, 'utf8').split('\n');
      return lines.flatMap((line, index) =>
        // Brand glyph artwork renders in System font and is off-token by design.
        line.includes("fontFamily: 'System'")
          ? []
          : (line.match(/fontWeight:\s*'\d+'/g) ?? []).map(
              (match) => `${path.replace(`${chartRoot}/`, '')}:${index + 1}: ${match}`,
            ),
      );
    });

    expect(violations).toEqual([]);
  });
});
