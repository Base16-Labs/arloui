import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { diff } from '../commands/diff';
import { DEFAULT_CONFIG } from '../config';

const BASE = DEFAULT_CONFIG.registry;

const buttonEntry = {
  name: 'button',
  kind: 'primitive',
  title: 'Button',
  description: 'btn',
  files: [{ source: 'button.tsx', target: 'button.tsx', content: 'BUTTON_V2' }],
  hash: 'deadbeef',
};

function stubRegistry() {
  const routes: Record<string, unknown> = {
    [`${BASE}/index.json`]: {
      version: '0.1.0',
      items: [{ name: 'button', kind: 'primitive', title: 'Button', description: 'btn' }],
    },
    [`${BASE}/button.json`]: buttonEntry,
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

let dir: string;
let logSpy: ReturnType<typeof vi.spyOn>;
let errSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-diff-'));
  await writeFile(join(dir, 'arlo.json'), JSON.stringify(DEFAULT_CONFIG));
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`exit:${code}`);
  });
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function output() {
  return logSpy.mock.calls
    .map((c) => String(c[0] ?? ''))
    .map((s) => s.replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), ''))
    .join('\n');
}

async function installButton(content: string) {
  await mkdir(join(dir, 'components/ui'), { recursive: true });
  await writeFile(join(dir, 'components/ui/button.tsx'), content);
}

describe('diff', () => {
  it('reports up to date when local matches the registry', async () => {
    stubRegistry();
    await installButton('BUTTON_V2');
    await diff({ cwd: dir });
    expect(output()).toMatch(/button.*up to date/s);
  });

  it('reports drift when local differs from the registry', async () => {
    stubRegistry();
    await installButton('BUTTON_V1_OLD');
    await diff({ cwd: dir });
    expect(output()).toMatch(/button.*1 of 1 files drifted/s);
  });

  it('skips components that are not installed locally', async () => {
    stubRegistry();
    await diff({ cwd: dir }); // nothing installed
    expect(output().trim()).toBe('');
  });

  it('errors and exits for an unknown component name', async () => {
    stubRegistry();
    await expect(diff({ cwd: dir, name: 'does-not-exist' })).rejects.toThrow('exit:1');
    expect(errSpy).toHaveBeenCalledWith(expect.stringMatching(/Unknown component/));
  });

  it('errors and exits when no arlo.json is present', async () => {
    await rm(join(dir, 'arlo.json'));
    stubRegistry();
    await expect(diff({ cwd: dir })).rejects.toThrow('exit:1');
    expect(errSpy).toHaveBeenCalledWith(expect.stringMatching(/No arlo\.json/));
  });
});
