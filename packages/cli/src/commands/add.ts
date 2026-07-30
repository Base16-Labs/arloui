import { relative } from 'node:path';
import * as p from '@clack/prompts';
import kleur from 'kleur';
import { aliasFor, loadConfig, type ArloConfig } from '../config';
import { fileExists, resolveWithin, writeFileEnsuringDir } from '../fs-utils';
import { RegistryClient, type ResolvedRegistryEntry } from '../registry-client';
import { buildSourceTargetMap, rewriteFileImports } from '../rewrite-imports';

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

  const sourceTargetMap = buildSourceTargetMap(cwd, config, [...allEntries.values()]);
  for (const entry of allEntries.values()) {
    await writeComponent({ cwd, config, entry, overwrite, yes, sourceTargetMap });
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
  sourceTargetMap,
}: {
  cwd: string;
  config: ArloConfig;
  entry: ResolvedRegistryEntry;
  overwrite?: boolean;
  yes?: boolean;
  sourceTargetMap?: Map<string, string>;
}): Promise<void> {
  // When no explicit map is supplied (single-entry writes), a map built from
  // this entry alone still rewrites intra-entry imports correctly.
  const map = sourceTargetMap ?? buildSourceTargetMap(cwd, config, [entry]);

  const targets = entry.files.map((file) => ({
    file,
    target: resolveWithin(cwd, aliasFor(config, file.type), file.target),
  }));
  const present = await Promise.all(targets.map(({ target }) => fileExists(target)));
  const existing = targets.filter((_, i) => present[i]);

  // Decide once for the whole component rather than file by file. Prompting per
  // file lets you answer "no" to an entry point and "yes" to everything it pulls
  // in, which leaves the component half from the registry and half your own —
  // the files land but nothing re-exports them.
  if (existing.length > 0 && !overwrite) {
    const label = kleur.cyan(entry.name);

    // A partial install is the case worth calling out: it usually means the
    // component already lives here under different filenames, so the missing
    // files are additions rather than an update.
    if (existing.length < targets.length) {
      p.log.warn(
        [
          `${label} is partially installed — ${existing.length} of ${targets.length} files already exist:`,
          ...existing.map(({ target }) => `    ${kleur.dim(rel(cwd, target))}`),
          `  Writing only the missing files would mix registry code with yours.`,
        ].join('\n'),
      );
    }

    if (yes) {
      p.log.warn(
        `skip ${label} — already installed (pass --overwrite to replace all ${targets.length} file${targets.length === 1 ? '' : 's'})`,
      );
      return;
    }

    const replace = await p.confirm({
      message: `${entry.name} is already installed. Overwrite all ${targets.length} file${targets.length === 1 ? '' : 's'}?`,
      initialValue: false,
    });
    if (p.isCancel(replace) || !replace) {
      p.log.warn(`skip ${label}`);
      return;
    }
  }

  for (const { file, target } of targets) {
    await writeFileEnsuringDir(target, rewriteFileImports(file, cwd, config, map));
    p.log.success(`wrote ${kleur.cyan(rel(cwd, target))}`);
  }
}

function rel(from: string, to: string): string {
  return relative(from, to) || to;
}
