/**
 * Registry sources are copied into consumer apps, so they may only import things
 * that exist *there*: React, React Native, the declared npm peers, and other
 * registry files by relative path.
 *
 * A bare `@arloui/*` specifier is none of those. Those packages are workspace
 * dependencies of this repo, and the CLI's import rewriter only rewrites
 * *relative* paths — a bare specifier sails through untouched and lands in a
 * project that has never heard of it.
 *
 * This is not hypothetical. Five chart files imported `rgbaFromHex` from
 * `@arloui/tokens`, which meant `npx arloui add chart` produced a project that
 * could not typecheck or bundle. The fix was to move the helper into
 * `foundation/tokens.ts` and import it relatively; this test is what stops it
 * coming back.
 *
 * `@arloui/icons` is the one legitimate exception: it ships to npm precisely so
 * consumers don't paste hundreds of SVG wrappers, and components that use it
 * declare it as an npm dependency.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const registryRoot = join(__dirname, '..', '..');

/**
 * Packages a copied file may name directly, because consumers install them.
 * Matched as a package prefix — icons are imported per-glyph
 * (`@arloui/icons/OutlineChartLine`) so subpaths have to pass too.
 */
const ALLOWED_PREFIXES = ['@arloui/icons'];

const isAllowed = (specifier: string): boolean =>
  ALLOWED_PREFIXES.some((pkg) => specifier === pkg || specifier.startsWith(`${pkg}/`));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      // Tests stay in the repo and never get copied, so they may import anything.
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

const IMPORT_RE = /\bfrom\s+['"](@arloui\/[^'"]+)['"]/g;

describe('registry source import portability', () => {
  it('never imports a workspace package the consumer will not have', () => {
    const violations = sourceFiles(registryRoot).flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      return [...source.matchAll(IMPORT_RE)]
        .map((match) => match[1] as string)
        .filter((specifier) => !isAllowed(specifier))
        .map((specifier) => `${path.replace(`${registryRoot}/`, '')}: ${specifier}`);
    });

    expect(violations).toEqual([]);
  });
});
