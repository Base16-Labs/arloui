import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';

export const CONFIG_FILE = 'arlo.json';

const aliasesSchema = z
  .object({
    components: z.string().min(1),
    tokens: z.string().min(1),
    theme: z.string().min(1),
    lib: z.string().min(1),
  })
  .strict();

export const arloConfigSchema = z
  .object({
    $schema: z.string(),
    /** URL of the registry index — defaults to the public CDN. */
    registry: z.string().url('registry must be a valid URL'),
    /** Where to write component files (relative to project root). */
    aliases: aliasesSchema,
    /** Style preference. Reserved for future variants (e.g. `compact`). */
    style: z.literal('default'),
  })
  .strict();

export type ArloConfig = z.infer<typeof arloConfigSchema>;

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

  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    throw new Error(`${CONFIG_FILE} is not valid JSON. Fix it or re-run \`arloui init\`.`);
  }

  const result = arloConfigSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`${CONFIG_FILE} is invalid:\n${issues}`);
  }
  return result.data;
}

export async function saveConfig(cwd: string, config: ArloConfig): Promise<void> {
  const path = resolve(cwd, CONFIG_FILE);
  await writeFile(path, JSON.stringify(config, null, 2) + '\n');
}

/** Map a registry file's `type` to the configured alias root it belongs under. */
export function aliasFor(config: ArloConfig, type: string | undefined): string {
  switch (type) {
    case 'tokens':
      return config.aliases.tokens;
    case 'theme':
      return config.aliases.theme;
    case 'utility':
      return config.aliases.lib;
    default:
      return config.aliases.components;
  }
}
