import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CONFIG_FILE,
  DEFAULT_CONFIG,
  aliasFor,
  loadConfig,
  saveConfig,
  type ArloConfig,
} from '../config';

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-config-'));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('loadConfig', () => {
  it('returns null when no config file exists', async () => {
    expect(await loadConfig(dir)).toBeNull();
  });

  it('loads and returns a valid config', async () => {
    await writeFile(join(dir, CONFIG_FILE), JSON.stringify(DEFAULT_CONFIG));
    const config = await loadConfig(dir);
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it('throws a clear error on malformed JSON', async () => {
    await writeFile(join(dir, CONFIG_FILE), '{ not json');
    await expect(loadConfig(dir)).rejects.toThrow(/not valid JSON/);
  });

  it('throws when the registry is not a URL', async () => {
    await writeFile(
      join(dir, CONFIG_FILE),
      JSON.stringify({ ...DEFAULT_CONFIG, registry: 'not-a-url' }),
    );
    await expect(loadConfig(dir)).rejects.toThrow(/registry must be a valid URL/);
  });

  it('throws when a required alias is missing', async () => {
    const broken = { ...DEFAULT_CONFIG, aliases: { components: 'x' } };
    await writeFile(join(dir, CONFIG_FILE), JSON.stringify(broken));
    await expect(loadConfig(dir)).rejects.toThrow(/arlo\.json is invalid/);
  });

  it('rejects an unknown style', async () => {
    await writeFile(join(dir, CONFIG_FILE), JSON.stringify({ ...DEFAULT_CONFIG, style: 'fancy' }));
    await expect(loadConfig(dir)).rejects.toThrow(/arlo\.json is invalid/);
  });
});

describe('saveConfig', () => {
  it('writes pretty JSON with a trailing newline and round-trips', async () => {
    const config: ArloConfig = { ...DEFAULT_CONFIG, registry: 'https://example.com/r' };
    await saveConfig(dir, config);
    const raw = await readFile(join(dir, CONFIG_FILE), 'utf8');
    expect(raw.endsWith('\n')).toBe(true);
    expect(raw).toContain('  "registry": "https://example.com/r"');
    expect(await loadConfig(dir)).toEqual(config);
  });
});

describe('aliasFor', () => {
  const config: ArloConfig = {
    ...DEFAULT_CONFIG,
    aliases: { components: 'comp', tokens: 'tok', theme: 'thm', lib: 'lib' },
  };

  it.each([
    ['tokens', 'tok'],
    ['theme', 'thm'],
    ['utility', 'lib'],
    ['component', 'comp'],
    [undefined, 'comp'],
    ['example', 'comp'],
  ])('maps file type %s to %s', (type, expected) => {
    expect(aliasFor(config, type as string | undefined)).toBe(expected);
  });
});
