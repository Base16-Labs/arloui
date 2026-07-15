/**
 * Pure, IO-light building blocks for the registry build pipeline.
 *
 * Kept separate from `index.ts` (the CLI entrypoint) so each step can be unit
 * tested: file reading is injectable, hashing is deterministic, and the
 * manifest can be validated without touching the network or writing output.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Registry, RegistryEntry, RegistryFile } from '@arloui/registry';

export type ResolvedFile = RegistryFile & { content: string };
export type ResolvedEntry = Omit<RegistryEntry, 'files'> & {
  files: ResolvedFile[];
  hash: string;
};

export type RegistryIndex = {
  $schema: string;
  version: string;
  items: Array<Omit<RegistryEntry, 'files'>>;
};

/** How a source file is read — overridable in tests. */
export type ReadFile = (absPath: string) => Promise<string>;

const defaultReadFile: ReadFile = (absPath) => readFile(absPath, 'utf8');

export async function readSource(
  srcDir: string,
  file: RegistryFile,
  read: ReadFile = defaultReadFile,
): Promise<ResolvedFile> {
  const content = await read(join(srcDir, file.source));
  return { ...file, content };
}

/**
 * Stable content hash for an entry. Order-independent (files are sorted by
 * target first) so re-ordering the manifest never changes the hash, while any
 * change to a target path or file content does.
 */
export function hashEntry(files: ResolvedFile[]): string {
  const h = createHash('sha256');
  const sorted = [...files].sort((a, b) => a.target.localeCompare(b.target));
  for (const f of sorted) {
    h.update(f.target).update('\0').update(f.content).update('\0');
  }
  return h.digest('hex').slice(0, 16);
}

export async function buildEntry(
  srcDir: string,
  entry: RegistryEntry,
  read: ReadFile = defaultReadFile,
): Promise<ResolvedEntry> {
  const files = await Promise.all(entry.files.map((f) => readSource(srcDir, f, read)));
  return { ...entry, files, hash: hashEntry(files) };
}

export async function buildAll(
  srcDir: string,
  registry: Registry,
  read: ReadFile = defaultReadFile,
): Promise<ResolvedEntry[]> {
  return Promise.all(registry.items.map((entry) => buildEntry(srcDir, entry, read)));
}

/** The directory of entries (without inlined file contents) served as index.json. */
export function buildIndex(registry: Registry, resolved: ResolvedEntry[]): RegistryIndex {
  return {
    $schema: 'https://arloui.com/schemas/registry-index-v1.json',
    version: registry.version,
    items: resolved.map(({ files: _files, hash: _hash, ...meta }) => meta),
  };
}

/**
 * Validate the manifest's internal consistency before building. Catches the
 * mistakes that would otherwise ship broken copy-paste output to every user:
 * duplicate entry names, duplicate write targets within an entry, dangling
 * `registryDependencies`, and empty file lists.
 */
export function validateManifest(registry: Registry): string[] {
  const errors: string[] = [];
  const names = new Set<string>();

  for (const entry of registry.items) {
    if (names.has(entry.name)) {
      errors.push(`duplicate entry name: ${entry.name}`);
    }
    names.add(entry.name);

    if (entry.files.length === 0) {
      errors.push(`${entry.name}: has no files`);
    }

    const targets = new Set<string>();
    for (const file of entry.files) {
      if (targets.has(file.target)) {
        errors.push(`${entry.name}: duplicate file target "${file.target}"`);
      }
      targets.add(file.target);
    }
  }

  for (const entry of registry.items) {
    for (const dep of entry.registryDependencies ?? []) {
      if (!names.has(dep)) {
        errors.push(`${entry.name}: unknown registryDependency "${dep}"`);
      }
    }
  }

  return errors;
}
