/**
 * Build the registry JSON files served to the CLI.
 *
 * For each entry in `packages/registry/src/manifest.ts`:
 *   - Read every `file.source` from `packages/registry/src/`
 *   - Emit `apps/www/public/r/<name>.json` containing the entry metadata plus
 *     inlined file contents and a content hash.
 *
 * Also emits `apps/www/public/r/index.json` — a directory of all entries used
 * by the docs site and the CLI's `arloui list` command.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTRY } from '@arloui/registry/manifest';
import type { RegistryEntry, RegistryFile } from '@arloui/registry';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../../..');
const REGISTRY_SRC = join(ROOT, 'packages/registry/src');
const OUT_DIR = join(ROOT, 'apps/www/public/r');

type ResolvedFile = RegistryFile & { content: string };
type ResolvedEntry = Omit<RegistryEntry, 'files'> & {
  files: ResolvedFile[];
  hash: string;
};

async function readSource(file: RegistryFile): Promise<ResolvedFile> {
  const abs = join(REGISTRY_SRC, file.source);
  const content = await readFile(abs, 'utf8');
  return { ...file, content };
}

function hashEntry(files: ResolvedFile[]): string {
  const h = createHash('sha256');
  for (const f of files.sort((a, b) => a.target.localeCompare(b.target))) {
    h.update(f.target).update('\0').update(f.content).update('\0');
  }
  return h.digest('hex').slice(0, 16);
}

async function buildEntry(entry: RegistryEntry): Promise<ResolvedEntry> {
  const files = await Promise.all(entry.files.map(readSource));
  return { ...entry, files, hash: hashEntry(files) };
}

async function main() {
  console.log('arloui · build-registry');
  console.log(`  src = ${REGISTRY_SRC}`);
  console.log(`  out = ${OUT_DIR}`);

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const resolved: ResolvedEntry[] = [];
  for (const entry of REGISTRY.items) {
    const built = await buildEntry(entry);
    const target = join(OUT_DIR, `${entry.name}.json`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify(built, null, 2));
    resolved.push(built);
    console.log(`  · ${entry.name.padEnd(20)} ${built.hash}  (${built.files.length} files)`);
  }

  const index = {
    $schema: 'https://arloui.dev/schemas/registry-index-v1.json',
    version: REGISTRY.version,
    generatedAt: new Date().toISOString(),
    items: resolved.map(({ files: _files, ...meta }) => meta),
  };
  await writeFile(join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`  · index.json (${resolved.length} entries)`);
  console.log('done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
