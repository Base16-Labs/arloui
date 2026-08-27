import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const componentsRoot = join(__dirname, '..', '..', 'components');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

describe('component token usage', () => {
  it('does not hardcode application typography outside brand glyph artwork', () => {
    const violations = sourceFiles(componentsRoot).flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      return source
        .split('\n')
        .filter((line) => !line.includes("fontFamily: 'System'"))
        .flatMap((line) =>
          line.match(/(?:fontSize|lineHeight|letterSpacing):\s*-?\d+(?:\.\d+)?/g)?.map(
            (match) => `${path.replace(`${componentsRoot}/`, '')}: ${match}`,
          ) ?? [],
        );
    });

    expect(violations).toEqual([]);
  });

  it('does not hardcode component padding or gaps', () => {
    const violations = sourceFiles(componentsRoot).flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      return source
        .split('\n')
        .filter((line) => !line.includes('token-ignore:'))
        .flatMap((line) =>
          line.match(/(?:padding(?:Top|Right|Bottom|Left|Horizontal|Vertical)?|gap):\s*-?\d+(?:\.\d+)?/g)?.map(
            (match) => `${path.replace(`${componentsRoot}/`, '')}: ${match}`,
          ) ?? [],
        );
    });

    expect(violations).toEqual([]);
  });
});
