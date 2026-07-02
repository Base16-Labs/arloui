import { relative } from 'node:path';
import * as p from '@clack/prompts';
import kleur from 'kleur';
import { aliasFor, loadConfig, type ArloConfig } from '../config';
import { fileExists, resolveWithin, writeFileEnsuringDir } from '../fs-utils';
import { RegistryClient, type ResolvedRegistryEntry } from '../registry-client';

type Options = {
  cwd: string;
  names: string[];
  yes?: boolean;
  overwrite?: boolean;
};

export async function add({ cwd, names, yes, overwrite }: Options): Promise<void> {
  p.intro(kleur.bgCyan(kleur.black(' arloui ')) + kleur.dim(' add'));

  const config = await loadConfig(cwd);
  if (!config) {
    p.log.error(`No ${kleur.cyan('arlo.json')} found. Run ${kleur.cyan('npx arloui init')} first.`);
    process.exit(1);
  }

  const client = new RegistryClient(config.registry);

  let toAdd = names;
  if (toAdd.length === 0) {
    const index = await client.index();
    const choice = await p.multiselect({
      message: 'Pick components to install',
      options: index.items
        .filter((it) => it.kind !== 'foundation')
        .map((it) => ({ label: `${it.title}  ${kleur.dim(it.description)}`, value: it.name })),
      required: true,
    });
    if (p.isCancel(choice)) {
      p.cancel('Add cancelled.');
      return;
    }
    toAdd = choice as string[];
  }

  const allEntries = new Map<string, ResolvedRegistryEntry>();
  const spinner = p.spinner();
  spinner.start('resolving registry');
  try {
    for (const name of toAdd) {
      const entries = await client.resolve(name);
      for (const e of entries) {
        if (!allEntries.has(e.name)) allEntries.set(e.name, e);
      }
    }
    spinner.stop(`resolved ${allEntries.size} entr${allEntries.size === 1 ? 'y' : 'ies'}`);
  } catch (err) {
    spinner.stop('resolution failed');
    throw err;
  }

  for (const entry of allEntries.values()) {
    await writeComponent({ cwd, config, entry, overwrite, yes });
  }

  const npmDeps = new Set<string>();
  const nativeDeps: Array<{ name: string; setup: string }> = [];
  for (const entry of allEntries.values()) {
    entry.dependencies?.forEach((d) => npmDeps.add(d));
    entry.nativeDeps?.forEach((d) => nativeDeps.push(d));
  }

  const lines: string[] = [kleur.green('Done.')];
  if (npmDeps.size > 0) {
    lines.push(
      '',
      `Install npm dependencies:`,
      `  ${kleur.cyan(`npm i ${[...npmDeps].join(' ')}`)}`,
    );
  }
  if (nativeDeps.length > 0) {
    lines.push('', `Native modules:`);
    for (const d of nativeDeps) {
      lines.push(`  ${kleur.cyan(d.name)} — ${d.setup}`);
    }
  }
  p.outro(lines.join('\n'));
}

export async function writeComponent({
  cwd,
  config,
  entry,
  overwrite,
  yes,
}: {
  cwd: string;
  config: ArloConfig;
  entry: ResolvedRegistryEntry;
  overwrite?: boolean;
  yes?: boolean;
}): Promise<void> {
  for (const file of entry.files) {
    const aliasRoot = aliasFor(config, file.type);
    const target = resolveWithin(cwd, aliasRoot, file.target);

    if ((await fileExists(target)) && !overwrite) {
      if (yes) {
        p.log.warn(`skip ${kleur.dim(rel(cwd, target))} (exists; pass --overwrite to replace)`);
        continue;
      }
      const replace = await p.confirm({
        message: `${rel(cwd, target)} already exists. Overwrite?`,
        initialValue: false,
      });
      if (p.isCancel(replace) || !replace) {
        p.log.warn(`skip ${kleur.dim(rel(cwd, target))}`);
        continue;
      }
    }

    await writeFileEnsuringDir(target, file.content);
    p.log.success(`wrote ${kleur.cyan(rel(cwd, target))}`);
  }
}

function rel(from: string, to: string): string {
  return relative(from, to) || to;
}
