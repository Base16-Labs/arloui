import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installSkill } from '../commands/skill';

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'arloui-skill-'));
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function stubFetch(fail?: string) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      fail && url.endsWith(fail)
        ? { ok: false, status: 404, statusText: 'Not Found', text: async () => '' }
        : { ok: true, status: 200, statusText: 'OK', text: async () => `content of ${url}` },
    ),
  );
}

describe('skill install', () => {
  it('writes the entry file and every reference into --dir', async () => {
    stubFetch();
    await installSkill({ cwd: dir, dir: 'pack' });
    expect(await readFile(join(dir, 'pack/SKILL.md'), 'utf8')).toMatch(/md\/skills\/SKILL\.md$/);
    expect(await readFile(join(dir, 'pack/references/tokens.json'), 'utf8')).toMatch(/tokens\.json$/);
  });

  it('writes nothing when any file fails to download', async () => {
    stubFetch('references/usage.md');
    await expect(installSkill({ cwd: dir, dir: 'pack' })).rejects.toThrow(/usage\.md \(404/);
    await expect(stat(join(dir, 'pack'))).rejects.toThrow();
  });

  it('rejects an unknown agent', async () => {
    stubFetch();
    await expect(installSkill({ cwd: dir, agent: 'vim' as never })).rejects.toThrow(/Unknown agent "vim"/);
  });

  it('installs into the Claude Code skills folder with --agent claude', async () => {
    stubFetch();
    vi.stubEnv('HOME', dir);
    await installSkill({ cwd: dir, agent: 'claude' });
    expect(await readFile(join(dir, '.claude/skills/arloui/SKILL.md'), 'utf8')).toMatch(/SKILL\.md$/);
    vi.unstubAllEnvs();
  });
});
