import { readFile } from 'node:fs/promises';
import kleur from 'kleur';
import { aliasFor, loadConfig } from '../config';
import { fileExists, resolveWithin } from '../fs-utils';
import { RegistryClient } from '../registry-client';

type Options = { cwd: string; name?: string };

/**
 * Compare locally-installed component files to the latest registry version.
 * This is the equivalent of `shadcn diff` — it does NOT modify files. It just
 * surfaces drift so the user can decide whether to re-run `add --overwrite`.
 */
export async function diff({ cwd, name }: Options): Promise<void> {
  const config = await loadConfig(cwd);
  if (!config) {
    console.error(`No arlo.json found. Run \`npx arloui init\` first.`);
    process.exit(1);
  }
  const client = new RegistryClient(config.registry);
  const index = await client.index();

  let items = index.items;
  if (name) {
    const found = index.items.find((i) => i.name === name);
    if (!found) {
      console.error(
        `Unknown component "${name}". Run \`npx arloui list\` to see what's available.`,
      );
      process.exit(1);
    }
    items = [found];
  }

  for (const item of items) {
    const entry = await client.get(item.name);
    let drifted = 0;
    let missing = 0;

    for (const file of entry.files) {
      const target = resolveWithin(cwd, aliasFor(config, file.type), file.target);
      if (!(await fileExists(target))) {
        missing++;
        continue;
      }
      const local = await readFile(target, 'utf8');
      if (local !== file.content) drifted++;
    }

    if (missing === entry.files.length) continue; // not installed
    if (drifted === 0) {
      console.log(
        `${kleur.green('●')} ${item.name.padEnd(20)} up to date  ${kleur.dim(entry.hash)}`,
      );
    } else {
      console.log(
        `${kleur.yellow('●')} ${item.name.padEnd(20)} ${drifted} of ${entry.files.length} files drifted  ${kleur.dim(entry.hash)}`,
      );
    }
  }
}
