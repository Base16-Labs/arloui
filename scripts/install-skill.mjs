#!/usr/bin/env node
/**
 * Install the Arlo UI skill into a local agent's skills directory.
 *
 *   node scripts/install-skill.mjs cursor [--symlink]
 *   node scripts/install-skill.mjs claude [--symlink]
 *
 * Default copies the skill folder. `--symlink` links it instead, which is
 * preferred during active development so edits flow into the agent without
 * a re-copy.
 */
import { existsSync } from 'node:fs';
import { mkdir, rm, cp, symlink, lstat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const SOURCE = join(ROOT, 'packages/skill/arloui');

const TARGETS = {
  cursor: join(homedir(), '.cursor/skills-cursor/arloui'),
  claude: join(homedir(), '.claude/skills/arloui'),
};

const [, , agent, ...flags] = process.argv;
const useSymlink = flags.includes('--symlink');

if (!agent || !(agent in TARGETS)) {
  console.error(`usage: node scripts/install-skill.mjs <cursor|claude> [--symlink]`);
  process.exit(1);
}

const target = TARGETS[agent];
const mode = useSymlink ? 'symlink' : 'copy';

console.log(`installing arlo-ui skill (${mode}) → ${target}`);

await mkdir(dirname(target), { recursive: true });

if (existsSync(target)) {
  const stat = await lstat(target);
  if (stat.isSymbolicLink() || stat.isDirectory() || stat.isFile()) {
    console.log(`  removing existing ${target}`);
    await rm(target, { recursive: true, force: true });
  }
}

if (useSymlink) {
  await symlink(SOURCE, target, 'dir');
} else {
  await cp(SOURCE, target, { recursive: true });
}

console.log('done.');
