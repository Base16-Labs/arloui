import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { detectAliases } from '../aliases';
import { DEFAULT_CONFIG } from '../config';

const SRC = {
  components: 'src/components/ui',
  tokens: 'src/lib/arloui',
  theme: 'src/lib/arloui',
  lib: 'src/lib/arloui',
};

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-aliases-'));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('detectAliases', () => {
  it('follows the tsconfig @/* path, comments and trailing commas included', async () => {
    await writeFile(
      join(dir, 'tsconfig.json'),
      `{
        // Expo template
        "compilerOptions": { "paths": { "@/*": ["./src/*"], }, },
      }`,
    );
    expect(await detectAliases(dir)).toEqual(SRC);
  });

  it('keeps root aliases when @/* points at the project root', async () => {
    await writeFile(join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { paths: { '@/*': ['./*'] } } }));
    expect(await detectAliases(dir)).toEqual(DEFAULT_CONFIG.aliases);
  });

  it('falls back to src/app when tsconfig is unreadable', async () => {
    await writeFile(join(dir, 'tsconfig.json'), '{ not json');
    await mkdir(join(dir, 'src/app'), { recursive: true });
    expect(await detectAliases(dir)).toEqual(SRC);
  });

  it('uses the root when there is no tsconfig and no src/app', async () => {
    expect(await detectAliases(dir)).toEqual(DEFAULT_CONFIG.aliases);
  });
});
