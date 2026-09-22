/**
 * A JSDoc block must be attached to the thing it describes.
 *
 * When a prop moves to the composition API the prop is deleted, and it is easy
 * to leave its doc behind. TypeScript does not complain — it silently attaches
 * the orphan to whatever member comes next, so the public type ends up
 * documenting props that do not exist and mis-describing ones that do.
 *
 * This is not hypothetical either. `MeterProps` advertised a `format` prop that
 * had become `<Meter.Value />`, `ChartProps` documented `reference` lines that
 * were now `<Chart.Reference />`, and `SparklineProps` still described `fill`
 * and `showEndDot`. Thirteen blocks across the chart folder had come loose.
 *
 * The rule is mechanical: a doc block may not be immediately followed by another
 * doc block. Standalone prose that belongs to no declaration should use a plain
 * `/* … *\/` banner instead, which tooling never tries to attach.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const registryRoot = join(__dirname, '..', '..');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

/** Start and end line index of every JSDoc block, single- or multi-line. */
function docBlocks(lines: string[]): Array<[number, number]> {
  const blocks: Array<[number, number]> = [];
  let i = 0;
  while (i < lines.length) {
    const line = (lines[i] as string).trim();
    if (line.startsWith('/**')) {
      if (line.endsWith('*/') && line.length > 4) {
        blocks.push([i, i]);
        i += 1;
        continue;
      }
      let j = i;
      while (j < lines.length && !(lines[j] as string).trim().endsWith('*/')) j += 1;
      blocks.push([i, j]);
      i = j + 1;
      continue;
    }
    i += 1;
  }
  return blocks;
}

describe('registry doc comments', () => {
  it('never leaves a doc block attached to nothing', () => {
    const orphans = sourceFiles(registryRoot).flatMap((path) => {
      const lines = readFileSync(path, 'utf8').split('\n');
      return docBlocks(lines)
        .filter(([, end]) => {
          let next = end + 1;
          while (next < lines.length && (lines[next] as string).trim() === '') next += 1;
          return next < lines.length && (lines[next] as string).trim().startsWith('/**');
        })
        .map(([start]) => {
          const rel = path.replace(`${registryRoot}/`, '');
          return `${rel}:${start + 1}: ${(lines[start] as string).trim().slice(0, 60)}`;
        });
    });

    expect(orphans).toEqual([]);
  });
});
