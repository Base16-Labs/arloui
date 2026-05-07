import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const CONFIG_FILE = 'arlo.json';

export type ArloConfig = {
  $schema: string;
  /** URL of the registry index — defaults to the public CDN. */
  registry: string;
  /** Where to write component files (relative to project root). */
  aliases: {
    components: string;
    tokens: string;
    theme: string;
    lib: string;
  };
  /** Style preference. Reserved for future variants (e.g. `compact`). */
  style: 'default';
};

export const DEFAULT_CONFIG: ArloConfig = {
  $schema: 'https://arloui.dev/schemas/arlo-config-v1.json',
  registry: 'https://arloui.dev/r',
  aliases: {
    components: 'components/ui',
    tokens: 'lib/arloui',
    theme: 'lib/arloui',
    lib: 'lib/arloui',
  },
  style: 'default',
};

export async function loadConfig(cwd: string): Promise<ArloConfig | null> {
  const path = resolve(cwd, CONFIG_FILE);
  if (!existsSync(path)) return null;
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw) as ArloConfig;
}

export async function saveConfig(cwd: string, config: ArloConfig): Promise<void> {
  const path = resolve(cwd, CONFIG_FILE);
  await writeFile(path, JSON.stringify(config, null, 2) + '\n');
}
