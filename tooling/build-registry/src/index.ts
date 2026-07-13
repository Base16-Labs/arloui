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
 *
 * The pure building blocks live in `lib.ts` and are unit tested.
 */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTRY } from '@arloui/registry/manifest';
import { buildEntry, buildIndex, validateManifest } from './lib';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../../..');
const REGISTRY_SRC = join(ROOT, 'packages/registry/src');
const OUT_DIR = join(ROOT, 'apps/www/public/r');

async function main() {
  console.log('arloui · build-registry');
  console.log(`  src = ${REGISTRY_SRC}`);
  console.log(`  out = ${OUT_DIR}`);

  const errors = validateManifest(REGISTRY);
  if (errors.length > 0) {
    console.error('manifest validation failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const resolved = [];
  for (const entry of REGISTRY.items) {
    const built = await buildEntry(REGISTRY_SRC, entry);
    const target = join(OUT_DIR, `${entry.name}.json`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify(built, null, 2));
    resolved.push(built);
    console.log(`  · ${entry.name.padEnd(20)} ${built.hash}  (${built.files.length} files)`);
  }

  const index = buildIndex(REGISTRY, resolved);
  await writeFile(join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`  · index.json (${resolved.length} entries)`);
  console.log('done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
