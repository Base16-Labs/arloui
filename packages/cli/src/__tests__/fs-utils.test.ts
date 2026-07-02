import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fileExists, readJson, resolveWithin, writeFileEnsuringDir } from '../fs-utils';

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-fs-'));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('writeFileEnsuringDir', () => {
  it('creates missing parent directories then writes the file', async () => {
    const target = join(dir, 'a', 'b', 'c.txt');
    await writeFileEnsuringDir(target, 'hello');
    expect(await readFile(target, 'utf8')).toBe('hello');
  });

  it('overwrites an existing file', async () => {
    const target = join(dir, 'f.txt');
    await writeFileEnsuringDir(target, 'one');
    await writeFileEnsuringDir(target, 'two');
    expect(await readFile(target, 'utf8')).toBe('two');
  });
});

describe('fileExists', () => {
  it('is false for a missing path', async () => {
    expect(await fileExists(join(dir, 'nope.txt'))).toBe(false);
  });

  it('is true for an existing path', async () => {
    const target = join(dir, 'yes.txt');
    await writeFile(target, '');
    expect(await fileExists(target)).toBe(true);
  });
});

describe('readJson', () => {
  it('parses JSON file contents', async () => {
    const target = join(dir, 'data.json');
    await writeFile(target, JSON.stringify({ a: 1, b: ['x'] }));
    expect(await readJson<{ a: number; b: string[] }>(target)).toEqual({ a: 1, b: ['x'] });
  });
});

describe('resolveWithin', () => {
  it('resolves a normal nested target inside root', () => {
    const out = resolveWithin(dir, 'components/ui', 'button.tsx');
    expect(out).toBe(join(dir, 'components/ui/button.tsx'));
  });

  it('rejects a parent-traversal escape', () => {
    expect(() => resolveWithin(dir, 'components', '../../../etc/passwd')).toThrow(
      /outside the project directory/,
    );
  });

  it('rejects an absolute target', () => {
    const abs = `${sep}etc${sep}passwd`;
    expect(() => resolveWithin(dir, 'components', abs)).toThrow(/absolute path/);
  });

  it('rejects a target that resolves to the root itself', () => {
    expect(() => resolveWithin(dir, '.', '.')).toThrow(/outside the project directory/);
  });

  it('allows traversal that stays within root', () => {
    const out = resolveWithin(dir, 'components/ui', '../lib/util.ts');
    expect(out).toBe(join(dir, 'components/lib/util.ts'));
  });
});
