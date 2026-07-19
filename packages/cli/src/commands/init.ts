import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as p from '@clack/prompts';
import kleur from 'kleur';
import { DEFAULT_CONFIG, CONFIG_FILE, saveConfig, type ArloConfig } from '../config';
import { RegistryClient } from '../registry-client';
import { buildSourceTargetMap } from '../rewrite-imports';
import { writeComponent } from './add';

type Options = {
  cwd: string;
  yes?: boolean;
};

export async function init({ cwd, yes }: Options): Promise<void> {
  p.intro(kleur.bgCyan(kleur.black(' arloui ')) + kleur.dim(' init'));

  if (existsSync(resolve(cwd, CONFIG_FILE)) && !yes) {
    const overwrite = await p.confirm({
      message: `${CONFIG_FILE} already exists. Overwrite it?`,
      initialValue: false,
    });
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Init cancelled.');
      return;
    }
  }

  const config: ArloConfig = yes
    ? DEFAULT_CONFIG
    : await promptConfig();

  await saveConfig(cwd, config);
  p.log.success(`wrote ${kleur.cyan(CONFIG_FILE)}`);

  const spinner = p.spinner();
  spinner.start('installing foundation (tokens + theme provider)');
  const client = new RegistryClient(config.registry);
  try {
    const tokens = await client.resolve('tokens');
    const theme = await client.resolve('theme-provider');
    const seen = new Set<string>();
    const foundation: typeof tokens = [];
    for (const entry of [...tokens, ...theme]) {
      if (seen.has(entry.name)) continue;
      seen.add(entry.name);
      foundation.push(entry);
    }
    const sourceTargetMap = buildSourceTargetMap(cwd, config, foundation);
    for (const entry of foundation) {
      await writeComponent({ cwd, config, entry, sourceTargetMap });
    }
    spinner.stop('foundation installed');
  } catch (err) {
    spinner.stop('foundation install failed');
    throw err;
  }

  p.outro(
    [
      kleur.green('Setup complete.'),
      '',
      'Next steps:',
      `  ${kleur.dim('1.')} Wrap your app with ${kleur.cyan('<ThemeProvider>')} from ${kleur.cyan(config.aliases.theme + '/theme-provider')}`,
      `  ${kleur.dim('2.')} Add a component:  ${kleur.cyan('npx arloui add button')}`,
      `  ${kleur.dim('3.')} Browse all:      ${kleur.cyan('npx arloui list')}`,
    ].join('\n'),
  );
}

async function promptConfig(): Promise<ArloConfig> {
  const components = await p.text({
    message: 'Where should components live?',
    placeholder: DEFAULT_CONFIG.aliases.components,
    initialValue: DEFAULT_CONFIG.aliases.components,
  });
  if (p.isCancel(components)) process.exit(0);

  const lib = await p.text({
    message: 'Where should tokens / theme provider live?',
    placeholder: DEFAULT_CONFIG.aliases.lib,
    initialValue: DEFAULT_CONFIG.aliases.lib,
  });
  if (p.isCancel(lib)) process.exit(0);

  const registry = await p.text({
    message: 'Registry URL',
    placeholder: DEFAULT_CONFIG.registry,
    initialValue: DEFAULT_CONFIG.registry,
  });
  if (p.isCancel(registry)) process.exit(0);

  return {
    ...DEFAULT_CONFIG,
    registry: String(registry),
    aliases: {
      ...DEFAULT_CONFIG.aliases,
      components: String(components),
      tokens: String(lib),
      theme: String(lib),
      lib: String(lib),
    },
  };
}
