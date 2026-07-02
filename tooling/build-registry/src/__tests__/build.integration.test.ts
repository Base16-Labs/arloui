/**
 * Integration test for the build pipeline: builds the real manifest, writes the
 * JSON artifacts to a temp dir exactly like `index.ts` does, then reads them
 * back the way the CLI would — verifying the on-disk shape, determinism, and
 * that the index lines up with the per-entry files.
 */
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { REGISTRY } from '@arloui/registry/manifest';
import { buildAll, buildIndex } from '../lib';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../../..');
const REGISTRY_SRC = join(ROOT, 'packages/registry/src');

let outDir: string;
beforeEach(async () => {
  outDir = await mkdtemp(join(tmpdir(), 'arloui-registry-out-'));
});
afterEach(async () => {
  await rm(outDir, { recursive: true, force: true });
});

describe('registry build pipeline (integration)', () => {
  it('produces byte-identical output across two runs (deterministic hashes)', async () => {
    const first = await buildAll(REGISTRY_SRC, REGISTRY);
    const second = await buildAll(REGISTRY_SRC, REGISTRY);
    const hashes = (r: typeof first) => r.map((e) => `${e.name}:${e.hash}`);
    expect(hashes(first)).toEqual(hashes(second));
  });

  it('writes per-entry JSON + index.json that round-trip back to the same data', async () => {
    const resolved = await buildAll(REGISTRY_SRC, REGISTRY);
    for (const entry of resolved) {
      await writeFile(join(outDir, `${entry.name}.json`), JSON.stringify(entry, null, 2));
    }
    const index = buildIndex(REGISTRY, resolved);
    await writeFile(join(outDir, 'index.json'), JSON.stringify(index, null, 2));

    // Read the index back like the CLI's `list`/`diff`/`add` would.
    const readIndex = JSON.parse(await readFile(join(outDir, 'index.json'), 'utf8'));
    expect(readIndex.items.map((i: { name: string }) => i.name).sort()).toEqual(
      REGISTRY.items.map((i) => i.name).sort(),
    );

    // Every index entry resolves to a per-entry file with inlined content.
    for (const item of readIndex.items) {
      const entry = JSON.parse(await readFile(join(outDir, `${item.name}.json`), 'utf8'));
      expect(entry.name).toBe(item.name);
      expect(entry.hash).toMatch(/^[0-9a-f]{16}$/);
      expect(Array.isArray(entry.files)).toBe(true);
      expect(entry.files.length).toBeGreaterThan(0);
      for (const f of entry.files) expect(typeof f.content).toBe('string');
    }
  });

  it('keeps the index free of inlined file contents', async () => {
    const resolved = await buildAll(REGISTRY_SRC, REGISTRY);
    const index = buildIndex(REGISTRY, resolved);
    for (const item of index.items) {
      expect(item).not.toHaveProperty('files');
      expect(item).not.toHaveProperty('hash');
    }
  });
});
