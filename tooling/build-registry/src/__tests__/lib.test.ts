import { describe, expect, it, vi } from 'vitest';
import type { Registry, RegistryEntry } from '@arloui/registry';
import {
  buildAll,
  buildEntry,
  buildIndex,
  hashEntry,
  readSource,
  validateManifest,
  type ResolvedFile,
} from '../lib';

const file = (target: string, content: string): ResolvedFile => ({
  source: target,
  target,
  content,
});

describe('hashEntry', () => {
  it('is deterministic for the same input', () => {
    const files = [file('a.ts', 'A'), file('b.ts', 'B')];
    expect(hashEntry(files)).toBe(hashEntry(files));
  });

  it('is independent of file order', () => {
    const a = [file('a.ts', 'A'), file('b.ts', 'B')];
    const b = [file('b.ts', 'B'), file('a.ts', 'A')];
    expect(hashEntry(a)).toBe(hashEntry(b));
  });

  it('changes when content changes', () => {
    expect(hashEntry([file('a.ts', 'A')])).not.toBe(hashEntry([file('a.ts', 'A2')]));
  });

  it('changes when a target path changes', () => {
    expect(hashEntry([file('a.ts', 'A')])).not.toBe(hashEntry([file('renamed.ts', 'A')]));
  });

  it('returns a 16-char hex digest', () => {
    expect(hashEntry([file('a.ts', 'A')])).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('readSource', () => {
  it('joins srcDir with file.source and attaches content', async () => {
    const read = vi.fn(async (abs: string) => `// ${abs}`);
    const resolved = await readSource(
      '/src',
      { source: 'components/x.tsx', target: 'x.tsx' },
      read,
    );
    expect(read).toHaveBeenCalledWith('/src/components/x.tsx');
    expect(resolved.content).toBe('// /src/components/x.tsx');
    expect(resolved.target).toBe('x.tsx');
  });
});

describe('buildEntry', () => {
  it('reads every file and computes a hash', async () => {
    const entry: RegistryEntry = {
      name: 'card',
      kind: 'primitive',
      title: 'Card',
      description: '',
      files: [
        { source: 'card.tsx', target: 'card.tsx' },
        { source: 'index.ts', target: 'card/index.ts' },
      ],
    };
    const read = vi.fn(async (abs: string) => abs);
    const built = await buildEntry('/src', entry, read);
    expect(built.files).toHaveLength(2);
    expect(built.files[0]?.content).toBe('/src/card.tsx');
    expect(built.hash).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('buildIndex', () => {
  it('strips files and hash, keeps metadata, and stamps generatedAt', async () => {
    const registry: Registry = {
      $schema: 'https://arloui.com/schemas/registry-v1.json',
      version: '9.9.9',
      items: [{ name: 'tokens', kind: 'foundation', title: 'Tokens', description: 'd', files: [] }],
    };
    const read = vi.fn(async () => 'content');
    const resolved = await buildAll('/src', registry, read);
    const now = new Date('2026-02-03T04:05:06.000Z');
    const index = buildIndex(registry, resolved, now);

    expect(index.version).toBe('9.9.9');
    expect(index.generatedAt).toBe('2026-02-03T04:05:06.000Z');
    expect(index.items).toHaveLength(1);
    expect(index.items[0]).not.toHaveProperty('files');
    expect(index.items[0]).not.toHaveProperty('hash');
    expect(index.items[0]?.name).toBe('tokens');
  });
});

describe('validateManifest', () => {
  const base = (over: Partial<RegistryEntry>): RegistryEntry => ({
    name: 'x',
    kind: 'primitive',
    title: 'X',
    description: '',
    files: [{ source: 'x.tsx', target: 'x.tsx' }],
    ...over,
  });

  it('returns no errors for a consistent manifest', () => {
    const registry: Registry = {
      $schema: 'https://arloui.com/schemas/registry-v1.json',
      version: '1',
      items: [
        base({ name: 'tokens', kind: 'foundation' }),
        base({ name: 'button', registryDependencies: ['tokens'] }),
      ],
    };
    expect(validateManifest(registry)).toEqual([]);
  });

  it('flags duplicate entry names', () => {
    const registry: Registry = {
      $schema: 'https://arloui.com/schemas/registry-v1.json',
      version: '1',
      items: [base({ name: 'dup' }), base({ name: 'dup' })],
    };
    expect(validateManifest(registry)).toContain('duplicate entry name: dup');
  });

  it('flags duplicate file targets within an entry', () => {
    const registry: Registry = {
      $schema: 'https://arloui.com/schemas/registry-v1.json',
      version: '1',
      items: [
        base({
          name: 'c',
          files: [
            { source: 'a.tsx', target: 'same.tsx' },
            { source: 'b.tsx', target: 'same.tsx' },
          ],
        }),
      ],
    };
    expect(validateManifest(registry)).toContain('c: duplicate file target "same.tsx"');
  });

  it('flags an entry with no files', () => {
    const registry: Registry = {
      $schema: 'https://arloui.com/schemas/registry-v1.json',
      version: '1',
      items: [base({ name: 'empty', files: [] })],
    };
    expect(validateManifest(registry)).toContain('empty: has no files');
  });

  it('flags an unknown registryDependency', () => {
    const registry: Registry = {
      $schema: 'https://arloui.com/schemas/registry-v1.json',
      version: '1',
      items: [base({ name: 'button', registryDependencies: ['ghost'] })],
    };
    expect(validateManifest(registry)).toContain('button: unknown registryDependency "ghost"');
  });
});
