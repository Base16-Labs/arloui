import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, isAbsolute } from 'node:path';

export async function writeFileEnsuringDir(target: string, contents: string): Promise<void> {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

export async function fileExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

/**
 * Resolve `parts` under `root` and guarantee the result stays inside `root`.
 *
 * Registry file targets come from a remote, user-configurable URL. Without this
 * guard a crafted entry with a `../../../etc/...` target could make the CLI
 * write outside the consumer's project. Any path that escapes `root` (or is
 * absolute) is rejected.
 */
export function resolveWithin(root: string, ...parts: string[]): string {
  const rootResolved = resolve(root);
  if (parts.some((part) => isAbsolute(part))) {
    throw new Error(`refusing to write to an absolute path: ${parts.join('/')}`);
  }
  const target = resolve(rootResolved, ...parts);
  const rel = relative(rootResolved, target);
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`refusing to write outside the project directory: ${parts.join('/')}`);
  }
  return target;
}
