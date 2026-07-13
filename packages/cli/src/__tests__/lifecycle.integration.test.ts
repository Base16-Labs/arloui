/**
 * Integration test: drives the real init → add → diff commands end-to-end
 * against a single in-memory registry served over a stubbed global fetch, in a
 * throwaway temp project. Exercises config loading, transitive resolution,
 * alias routing, file writing, skip-on-exists, and drift detection together.
 */
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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

import { add } from '../commands/add';
import { diff } from '../commands/diff';
import { init } from '../commands/init';
import { DEFAULT_CONFIG } from '../config';

const BASE = DEFAULT_CONFIG.registry;

type Spec = { kind: string; deps?: string[]; files: [string, string, string?][] };

const REGISTRY: Record<string, Spec> = {
  tokens: { kind: 'foundation', files: [['tokens.ts', '// TOKENS', 'tokens']] },
  'theme-provider': {
    kind: 'foundation',
    deps: ['tokens'],
    files: [['theme-provider.tsx', '// THEME', 'theme']],
  },
  button: {
    kind: 'primitive',
    deps: ['tokens', 'theme-provider'],
    files: [['button.tsx', '// BUTTON']],
  },
};

function entryJson(name: string, spec: Spec) {
  return {
    name,
    kind: spec.kind,
    title: name,
    description: name,
    ...(spec.deps ? { registryDependencies: spec.deps } : {}),
    files: spec.files.map(([target, content, type]) => ({
      source: target,
      target,
      ...(type ? { type } : {}),
      content,
    })),
    hash: `hash-${name}`,
  };
}

function stubRegistry() {
  const routes: Record<string, unknown> = {
    [`${BASE}/index.json`]: {
      version: '0.1.0',
      items: Object.entries(REGISTRY).map(([name, spec]) => ({
        name,
        kind: spec.kind,
        title: name,
        description: name,
      })),
    },
  };
  for (const [name, spec] of Object.entries(REGISTRY)) {
    routes[`${BASE}/${name}.json`] = entryJson(name, spec);
  }

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

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-lifecycle-'));
  vi.clearAllMocks();
  stubRegistry();
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function diffOutput() {
  return logSpy.mock.calls
    .map((c) => String(c[0] ?? ''))
    .map((s) => s.replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), ''))
    .join('\n');
}

describe('init → add → diff lifecycle', () => {
  it('initializes, installs a component with deps, and reports clean diff', async () => {
    // 1. init: config + foundation
    await init({ cwd: dir, yes: true });
    expect(JSON.parse(await readFile(join(dir, 'arlo.json'), 'utf8'))).toEqual(DEFAULT_CONFIG);
    expect(await readFile(join(dir, 'lib/arloui/tokens.ts'), 'utf8')).toBe('// TOKENS');
    expect(await readFile(join(dir, 'lib/arloui/theme-provider.tsx'), 'utf8')).toBe('// THEME');

    // 2. add button (foundation already present → skipped, button written)
    await add({ cwd: dir, names: ['button'], yes: true });
    expect(await readFile(join(dir, 'components/ui/button.tsx'), 'utf8')).toBe('// BUTTON');

    // 3. diff: everything matches the registry
    logSpy.mockClear();
    await diff({ cwd: dir });
    const clean = diffOutput();
    expect(clean).toMatch(/button.*up to date/s);
    expect(clean).not.toMatch(/drifted/);

    // 4. mutate a file → diff detects drift
    await writeFile(join(dir, 'components/ui/button.tsx'), '// EDITED LOCALLY');
    logSpy.mockClear();
    await diff({ cwd: dir, name: 'button' });
    expect(diffOutput()).toMatch(/button.*drifted/s);
  });

  it('is idempotent: re-adding with --yes does not corrupt installed files', async () => {
    await init({ cwd: dir, yes: true });
    await add({ cwd: dir, names: ['button'], yes: true });
    await add({ cwd: dir, names: ['button'], yes: true });
    expect(await readFile(join(dir, 'components/ui/button.tsx'), 'utf8')).toBe('// BUTTON');
  });
});
