import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { list } from '../commands/list';
import { DEFAULT_CONFIG } from '../config';

const BASE = DEFAULT_CONFIG.registry;

function stubIndex() {
  const index = {
    version: '0.1.0',
    items: [
      { name: 'button', kind: 'primitive', title: 'Button', description: 'an action button' },
      { name: 'tokens', kind: 'foundation', title: 'Tokens', description: 'design tokens' },
      { name: 'animated-icons', kind: 'icon', title: 'Icons', description: 'animated icons' },
    ],
  };
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, status: 200, statusText: 'OK', json: async () => index })),
  );
}

let dir: string;
let logSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-list-'));
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  logSpy.mockRestore();
  vi.unstubAllGlobals();
});

function output() {
  // Strip ANSI color codes so assertions are stable.
  return logSpy.mock.calls
    .map((c) => String(c[0] ?? ''))
    .map((s) => s.replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), ''))
    .join('\n');
}

describe('list', () => {
  it('prints the registry version and all entries', async () => {
    stubIndex();
    await list({ cwd: dir });
    const out = output();
    expect(out).toContain('v0.1.0');
    expect(out).toContain('button');
    expect(out).toContain('an action button');
    expect(out).toContain('tokens');
    expect(out).toContain('animated-icons');
  });

  it('groups entries by kind in foundation → primitive → icon order', async () => {
    stubIndex();
    await list({ cwd: dir });
    const out = output();
    expect(out.indexOf('foundation')).toBeLessThan(out.indexOf('primitive'));
    expect(out.indexOf('primitive')).toBeLessThan(out.indexOf('icon'));
  });

  it('falls back to the default registry when no arlo.json is present', async () => {
    stubIndex();
    await list({ cwd: dir });
    expect(fetch).toHaveBeenCalledWith(`${BASE}/index.json`, expect.anything());
  });
});
