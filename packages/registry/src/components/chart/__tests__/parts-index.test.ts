/**
 * The parts table in `index.ts` has to match the parts that exist.
 *
 * A table of names in a docblock is exactly the kind of thing that goes stale
 * the moment a part is added or renamed — the same failure as the thirteen
 * orphaned prop docs the props-to-parts migration left behind. This reads the
 * table out of the barrel and checks it against the real namespace, so the
 * documentation cannot drift from the code without a red test.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Chart } from '../index';

/** Parses the `| Form | Parts |` table out of the barrel's docblock. */
function documentedParts(): Map<string, string[]> {
  const source = readFileSync(join(__dirname, '..', 'index.ts'), 'utf8');
  const rows = new Map<string, string[]>();
  for (const line of source.split('\n')) {
    const match = /^\s*\*\s*\|\s*`([^`]+)`\s*\|([^|]+)\|/.exec(line);
    if (!match) continue;
    rows.set(
      (match[1] as string).trim(),
      (match[2] as string).split(',').map((p) => p.trim()).filter(Boolean),
    );
  }
  return rows;
}

/** The five forms hang off `Chart` alongside its parts, and are not parts. */
const FORMS = ['Bar', 'Donut', 'Heatmap', 'Meter', 'Sparkline'];

/** The parts actually hanging off a namespace member, minus forms and aliases. */
function actualParts(target: object): string[] {
  return Object.keys(target).filter(
    (key) => /^[A-Z]/.test(key) && key !== 'Values' && !FORMS.includes(key),
  );
}

const NAMESPACES: Record<string, object> = {
  'Chart': Chart,
  'Chart.Bar': Chart.Bar,
  'Chart.Donut': Chart.Donut,
  'Chart.Meter': Chart.Meter,
  'Chart.Heatmap': Chart.Heatmap,
  'Chart.Sparkline': Chart.Sparkline,
};

describe('the parts table in index.ts', () => {
  const documented = documentedParts();

  it('documents every form', () => {
    expect([...documented.keys()].sort()).toEqual(
      [...Object.keys(NAMESPACES), 'Chart.Plot'].sort(),
    );
  });

  it.each(Object.entries(NAMESPACES))('lists exactly the parts on %s', (name, target) => {
    const listed = documented.get(name);
    expect(listed).toBeDefined();
    // `Chart` carries the plot's parts too; they are documented on their own row.
    const plotParts = name === 'Chart' ? (documented.get('Chart.Plot') ?? []) : [];
    expect([...(listed as string[]), ...plotParts].sort()).toEqual(actualParts(target).sort());
  });

  it('keeps `Values` working as a deprecated alias without documenting it', () => {
    expect(Chart.Bar.Values).toBe(Chart.Bar.Amounts);
    expect(documented.get('Chart.Bar')).not.toContain('Values');
  });
});
