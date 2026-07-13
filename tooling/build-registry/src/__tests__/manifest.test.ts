import { access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '@arloui/registry/manifest';
import { buildAll, buildIndex, validateManifest } from '../lib';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../../..');
const REGISTRY_SRC = join(ROOT, 'packages/registry/src');

describe('the real registry manifest', () => {
  it('passes internal consistency validation', () => {
    expect(validateManifest(REGISTRY)).toEqual([]);
  });

  it('references only source files that exist on disk', async () => {
    const missing: string[] = [];
    for (const entry of REGISTRY.items) {
      for (const file of entry.files) {
        const abs = join(REGISTRY_SRC, file.source);
        try {
          await access(abs);
        } catch {
          missing.push(`${entry.name} -> ${file.source}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('builds every entry into non-empty, hashed JSON', async () => {
    const resolved = await buildAll(REGISTRY_SRC, REGISTRY);
    expect(resolved).toHaveLength(REGISTRY.items.length);
    for (const entry of resolved) {
      expect(entry.hash).toMatch(/^[0-9a-f]{16}$/);
      expect(entry.files.length).toBeGreaterThan(0);
      for (const f of entry.files) {
        expect(f.content.length).toBeGreaterThan(0);
      }
    }
  });

  it('produces an index whose item count matches the manifest', async () => {
    const resolved = await buildAll(REGISTRY_SRC, REGISTRY);
    const index = buildIndex(REGISTRY, resolved);
    expect(index.items).toHaveLength(REGISTRY.items.length);
    expect(index.version).toBe(REGISTRY.version);
  });
});
