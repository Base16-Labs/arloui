import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the interactive prompt library so tests run headless and we can drive
// confirm()/multiselect() deterministically.
vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn(() => false),
  spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
  log: { error: vi.fn(), success: vi.fn(), warn: vi.fn(), info: vi.fn(), step: vi.fn() },
  confirm: vi.fn(),
  multiselect: vi.fn(),
  text: vi.fn(),
}));

import * as p from '@clack/prompts';
import { add, writeComponent } from '../commands/add';
import { DEFAULT_CONFIG, type ArloConfig } from '../config';
import type { ResolvedRegistryEntry } from '../registry-client';

const config: ArloConfig = DEFAULT_CONFIG;

function makeEntry(over: Partial<ResolvedRegistryEntry> = {}): ResolvedRegistryEntry {
  return {
    name: 'button',
    kind: 'primitive',
    title: 'Button',
    description: 'btn',
    files: [{ source: 'button.tsx', target: 'button.tsx', content: 'export const Button = 1;' }],
    hash: 'h',
    ...over,
  };
}

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-add-'));
  vi.clearAllMocks();
  vi.mocked(p.isCancel).mockReturnValue(false);
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.unstubAllGlobals();
});

describe('writeComponent', () => {
  it('writes a file under the components alias', async () => {
    await writeComponent({ cwd: dir, config, entry: makeEntry() });
    const written = await readFile(join(dir, 'components/ui/button.tsx'), 'utf8');
    expect(written).toBe('export const Button = 1;');
  });

  it('routes files to the alias matching their type', async () => {
    const entry = makeEntry({
      files: [{ source: 'tokens.ts', target: 'tokens.ts', type: 'tokens', content: 'tk' }],
    });
    await writeComponent({ cwd: dir, config, entry });
    // DEFAULT_CONFIG.aliases.tokens === 'lib/arloui'
    expect(await readFile(join(dir, 'lib/arloui/tokens.ts'), 'utf8')).toBe('tk');
  });

  it('skips an existing file when --yes is set without --overwrite', async () => {
    const target = join(dir, 'components/ui/button.tsx');
    await mkdir(join(dir, 'components/ui'), { recursive: true });
    await writeFile(target, 'OLD');
    await writeComponent({ cwd: dir, config, entry: makeEntry(), yes: true });
    expect(await readFile(target, 'utf8')).toBe('OLD');
    expect(p.confirm).not.toHaveBeenCalled();
  });

  it('overwrites an existing file when --overwrite is set', async () => {
    const target = join(dir, 'components/ui/button.tsx');
    await mkdir(join(dir, 'components/ui'), { recursive: true });
    await writeFile(target, 'OLD');
    await writeComponent({ cwd: dir, config, entry: makeEntry(), overwrite: true });
    expect(await readFile(target, 'utf8')).toBe('export const Button = 1;');
  });

  it('prompts and overwrites when the user confirms', async () => {
    const target = join(dir, 'components/ui/button.tsx');
    await mkdir(join(dir, 'components/ui'), { recursive: true });
    await writeFile(target, 'OLD');
    vi.mocked(p.confirm).mockResolvedValue(true);
    await writeComponent({ cwd: dir, config, entry: makeEntry() });
    expect(p.confirm).toHaveBeenCalledOnce();
    expect(await readFile(target, 'utf8')).toBe('export const Button = 1;');
  });

  it('prompts and keeps the file when the user declines', async () => {
    const target = join(dir, 'components/ui/button.tsx');
    await mkdir(join(dir, 'components/ui'), { recursive: true });
    await writeFile(target, 'OLD');
    vi.mocked(p.confirm).mockResolvedValue(false);
    await writeComponent({ cwd: dir, config, entry: makeEntry() });
    expect(await readFile(target, 'utf8')).toBe('OLD');
  });

  it('refuses a path-traversal target from the registry', async () => {
    const evil = makeEntry({
      files: [{ source: 'x', target: '../../../evil.tsx', content: 'pwned' }],
    });
    await expect(writeComponent({ cwd: dir, config, entry: evil })).rejects.toThrow(
      /outside the project directory/,
    );
  });
});

/** Serve a fake registry over the global fetch the RegistryClient uses. */
function stubRegistry(entries: ResolvedRegistryEntry[]) {
  const base = config.registry;
  const byUrl = new Map<string, unknown>();
  byUrl.set(`${base}/index.json`, {
    version: '0.1.0',
    items: entries.map(({ files: _f, hash: _h, ...meta }) => meta),
  });
  for (const e of entries) byUrl.set(`${base}/${e.name}.json`, e);

  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (!byUrl.has(url)) {
        return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) };
      }
      return { ok: true, status: 200, statusText: 'OK', json: async () => byUrl.get(url) };
    }),
  );
}

describe('add (end-to-end with a fake registry)', () => {
  it('exits with an error when no arlo.json is present', async () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`exit:${code}`);
    });
    await expect(add({ cwd: dir, names: ['button'] })).rejects.toThrow('exit:1');
    expect(p.log.error).toHaveBeenCalled();
    exit.mockRestore();
  });

  it('installs a component with its transitive foundation dependencies', async () => {
    await writeFile(join(dir, 'arlo.json'), JSON.stringify(config));
    stubRegistry([
      makeEntry({
        name: 'button',
        registryDependencies: ['tokens', 'theme-provider'],
        files: [{ source: 'button.tsx', target: 'button.tsx', content: 'BTN' }],
      }),
      makeEntry({
        name: 'theme-provider',
        kind: 'foundation',
        registryDependencies: ['tokens'],
        files: [{ source: 't.tsx', target: 'theme-provider.tsx', type: 'theme', content: 'TP' }],
      }),
      makeEntry({
        name: 'tokens',
        kind: 'foundation',
        files: [{ source: 'tokens.ts', target: 'tokens.ts', type: 'tokens', content: 'TK' }],
      }),
    ]);

    await add({ cwd: dir, names: ['button'], yes: true });

    expect(await readFile(join(dir, 'components/ui/button.tsx'), 'utf8')).toBe('BTN');
    expect(await readFile(join(dir, 'lib/arloui/theme-provider.tsx'), 'utf8')).toBe('TP');
    expect(await readFile(join(dir, 'lib/arloui/tokens.ts'), 'utf8')).toBe('TK');
  });

  it('shows an interactive picker when no components are named', async () => {
    await writeFile(join(dir, 'arlo.json'), JSON.stringify(config));
    stubRegistry([
      makeEntry({ name: 'button', files: [{ source: 'b.tsx', target: 'button.tsx', content: 'BTN' }] }),
    ]);
    vi.mocked(p.multiselect).mockResolvedValue(['button']);

    await add({ cwd: dir, names: [], yes: true });

    expect(p.multiselect).toHaveBeenCalledOnce();
    expect(await readFile(join(dir, 'components/ui/button.tsx'), 'utf8')).toBe('BTN');
  });

  it('cancels cleanly when the picker is dismissed', async () => {
    await writeFile(join(dir, 'arlo.json'), JSON.stringify(config));
    stubRegistry([makeEntry({ name: 'button' })]);
    vi.mocked(p.multiselect).mockResolvedValue(Symbol('cancel'));
    vi.mocked(p.isCancel).mockReturnValueOnce(true);

    await add({ cwd: dir, names: [] });

    expect(p.cancel).toHaveBeenCalled();
    const exists = await readFile(join(dir, 'components/ui/button.tsx'), 'utf8').then(
      () => true,
      () => false,
    );
    expect(exists).toBe(false);
  });

  it('reports npm and native dependencies in the outro', async () => {
    await writeFile(join(dir, 'arlo.json'), JSON.stringify(config));
    stubRegistry([
      makeEntry({
        name: 'button',
        dependencies: ['expo-haptics'],
        nativeDeps: [{ name: 'expo-haptics', setup: 'npx expo install expo-haptics' }],
      }),
    ]);
    await add({ cwd: dir, names: ['button'], yes: true });
    const outro = vi.mocked(p.outro).mock.calls.at(-1)?.[0] ?? '';
    expect(outro).toContain('expo-haptics');
  });
});
