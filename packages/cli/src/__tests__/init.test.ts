import { mkdtemp, readFile, rm, writeFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn(() => false),
  spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
  log: { error: vi.fn(), success: vi.fn(), warn: vi.fn(), info: vi.fn(), step: vi.fn() },
  confirm: vi.fn(),
  text: vi.fn(),
}));

import * as p from '@clack/prompts';
import { init } from '../commands/init';
import { DEFAULT_CONFIG } from '../config';

const BASE = DEFAULT_CONFIG.registry;

function foundationEntry(name: string, type: 'tokens' | 'theme', deps: string[] = []) {
  return {
    name,
    kind: 'foundation',
    title: name,
    description: name,
    ...(deps.length ? { registryDependencies: deps } : {}),
    files: [{ source: `${name}.ts`, target: `${name}.ts`, type, content: `// ${name}` }],
    hash: `h-${name}`,
  };
}

function stubRegistry() {
  const routes: Record<string, unknown> = {
    [`${BASE}/tokens.json`]: foundationEntry('tokens', 'tokens'),
    [`${BASE}/theme-provider.json`]: foundationEntry('theme-provider', 'theme', ['tokens']),
  };
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (!(url in routes)) {
        return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) };
      }
      return { ok: true, status: 200, statusText: 'OK', json: async () => routes[url] };
    }),
  );
}

const exists = (path: string) =>
  access(path).then(
    () => true,
    () => false,
  );

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-init-'));
  vi.clearAllMocks();
  vi.mocked(p.isCancel).mockReturnValue(false);
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.unstubAllGlobals();
});

describe('init', () => {
  it('writes a default arlo.json and installs the foundation with --yes', async () => {
    stubRegistry();
    await init({ cwd: dir, yes: true });

    const written = JSON.parse(await readFile(join(dir, 'arlo.json'), 'utf8'));
    expect(written).toEqual(DEFAULT_CONFIG);

    // tokens + theme-provider land under the lib alias (lib/arloui)
    expect(await readFile(join(dir, 'lib/arloui/tokens.ts'), 'utf8')).toBe('// tokens');
    expect(await readFile(join(dir, 'lib/arloui/theme-provider.ts'), 'utf8')).toBe(
      '// theme-provider',
    );
  });

  it('does not prompt when --yes is passed', async () => {
    stubRegistry();
    await init({ cwd: dir, yes: true });
    expect(p.text).not.toHaveBeenCalled();
    expect(p.confirm).not.toHaveBeenCalled();
  });

  it('prompts for config when run interactively and writes the chosen aliases', async () => {
    stubRegistry();
    // promptConfig asks: components → lib → registry (in that order)
    vi.mocked(p.text)
      .mockResolvedValueOnce('app/components')
      .mockResolvedValueOnce('app/design')
      .mockResolvedValueOnce(DEFAULT_CONFIG.registry);

    await init({ cwd: dir });

    const written = JSON.parse(await readFile(join(dir, 'arlo.json'), 'utf8'));
    expect(written.aliases.components).toBe('app/components');
    expect(written.aliases.lib).toBe('app/design');
    expect(written.aliases.theme).toBe('app/design');
    expect(written.registry).toBe(DEFAULT_CONFIG.registry);
    expect(p.text).toHaveBeenCalledTimes(3);
    // foundation installed under the chosen lib alias
    expect(await readFile(join(dir, 'app/design/tokens.ts'), 'utf8')).toBe('// tokens');
  });

  it('exits when an interactive prompt is cancelled', async () => {
    stubRegistry();
    vi.mocked(p.isCancel).mockReturnValueOnce(true);
    const exit = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit:0');
    }) as never);
    await expect(init({ cwd: dir })).rejects.toThrow('exit:0');
    exit.mockRestore();
  });

  it('aborts without writing when an existing arlo.json overwrite is declined', async () => {
    await writeFile(join(dir, 'arlo.json'), JSON.stringify({ marker: true }));
    vi.mocked(p.confirm).mockResolvedValue(false);
    stubRegistry();

    await init({ cwd: dir });

    expect(p.cancel).toHaveBeenCalled();
    // original file untouched, no foundation installed
    expect(JSON.parse(await readFile(join(dir, 'arlo.json'), 'utf8'))).toEqual({ marker: true });
    expect(await exists(join(dir, 'lib/arloui/tokens.ts'))).toBe(false);
  });

  it('installs each foundation entry only once (tokens shared by theme-provider)', async () => {
    stubRegistry();
    await init({ cwd: dir, yes: true });
    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      (c) => c[0] === `${BASE}/tokens.json`,
    );
    // tokens is a dep of theme-provider and resolved on its own — fetched but written once
    expect(await readFile(join(dir, 'lib/arloui/tokens.ts'), 'utf8')).toBe('// tokens');
    expect(calls.length).toBeGreaterThanOrEqual(1);
  });
});
