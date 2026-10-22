import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import kleur from 'kleur';
import { writeFileEnsuringDir } from '../fs-utils';

const SKILL_BASE = 'https://arloui.com/md/skills';

/** The published skill pack. Getting started never asks you to clone the repo. */
const SKILL_FILES = [
  'SKILL.md',
  'README.md',
  'references/tokens.md',
  'references/components.md',
  'references/platform-mapping.md',
  'references/usage.md',
  'references/tokens.json',
  'references/registry.json',
] as const;

/** Where each agent looks for user-level skills. Matches scripts/install-skill.mjs. */
export const SKILL_TARGETS = {
  cursor: ['.cursor', 'skills-cursor', 'arloui'],
  claude: ['.claude', 'skills', 'arloui'],
} as const;

export type SkillAgent = keyof typeof SKILL_TARGETS;

type Options = {
  cwd: string;
  dir?: string;
  agent?: SkillAgent;
};

/**
 * Download the whole skill pack (entry file and `references/`) into the
 * agent's skills directory (Cursor by default), or into `--dir` when set.
 * Every file is fetched before any is written, so a failed download never
 * leaves a half-updated pack behind.
 */
export async function installSkill({ cwd, dir, agent = 'cursor' }: Options): Promise<void> {
  if (!(agent in SKILL_TARGETS)) {
    throw new Error(`Unknown agent "${agent}". Use one of: ${Object.keys(SKILL_TARGETS).join(', ')}`);
  }
  const dest = dir ? resolve(cwd, dir) : join(homedir(), ...SKILL_TARGETS[agent]);

  const files: [string, string][] = [];
  for (const file of SKILL_FILES) {
    const url = `${SKILL_BASE}/${file}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not download ${url} (${res.status} ${res.statusText})`);
    }
    files.push([file, await res.text()]);
  }
  for (const [file, text] of files) await writeFileEnsuringDir(join(dest, file), text);

  console.log(`${kleur.green('Installed')} the Arlo UI skill pack to ${kleur.cyan(dest)}`);
}
