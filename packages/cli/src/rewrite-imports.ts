import { dirname, posix, relative, sep } from 'node:path';
import { aliasFor, type ArloConfig } from './config';
import { resolveWithin } from './fs-utils';
import type { ResolvedRegistryEntry, ResolvedRegistryFile } from './registry-schema';

/**
 * Registry sources are authored with monorepo-internal import paths (e.g.
 * `../../foundation/theme-provider`). Those don't resolve once files are copied
 * into a consumer project, where foundation and components land under different,
 * user-configurable alias roots.
 *
 * The fix is to recompute every registry-internal relative import in the
 * consumer's layout: resolve the specifier against the file's original `source`
 * path to find which registry file it points at, then emit a fresh relative path
 * between the two files' resolved `target` locations. Imports that don't resolve
 * to a registry file (react-native, expo-haptics, test helpers) are left alone.
 */

const toPosix = (p: string): string => (sep === '/' ? p : p.split(sep).join('/'));
const stripExt = (p: string): string => p.replace(/\.(tsx|ts|jsx|js)$/, '');

/** Map every in-scope registry file's `source` (extensionless) to its resolved absolute target. */
export function buildSourceTargetMap(
  cwd: string,
  config: ArloConfig,
  entries: ResolvedRegistryEntry[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of entries) {
    for (const file of entry.files) {
      if (!file.source) continue;
      const abs = resolveWithin(cwd, aliasFor(config, file.type), file.target);
      map.set(stripExt(toPosix(file.source)), abs);
    }
  }
  return map;
}

const FROM_RE = /(\bfrom\s+)(['"])(\.\.?\/[^'"\n]+)\2/g;

/** Rewrite a single file's registry-internal relative imports for the consumer's layout. */
export function rewriteFileImports(
  file: ResolvedRegistryFile,
  cwd: string,
  config: ArloConfig,
  sourceTargetMap: Map<string, string>,
): string {
  if (!file.source) return file.content;

  const sourceDir = posix.dirname(toPosix(file.source));
  const targetAbs = resolveWithin(cwd, aliasFor(config, file.type), file.target);
  const targetDir = dirname(targetAbs);

  return file.content.replace(FROM_RE, (whole, fromKw: string, quote: string, spec: string) => {
    const resolvedSource = stripExt(posix.normalize(posix.join(sourceDir, spec)));
    const depAbs =
      sourceTargetMap.get(resolvedSource) ?? sourceTargetMap.get(posix.join(resolvedSource, 'index'));
    if (!depAbs) return whole; // not a registry file — leave untouched

    let rel = stripExt(toPosix(relative(targetDir, depAbs))).replace(/\/index$/, '');
    if (rel === '') rel = '.';
    if (!rel.startsWith('.')) rel = `./${rel}`;
    return `${fromKw}${quote}${rel}${quote}`;
  });
}
