import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import * as p from '@clack/prompts';
import kleur from 'kleur';
import { aliasFor, loadConfig, type ArloConfig } from '../config';
import { FONTS_MODULE } from '../fonts';
import { fileExists, resolveWithin, writeFileEnsuringDir } from '../fs-utils';
import { RegistryClient, type ResolvedRegistryEntry } from '../registry-client';
import { buildSourceTargetMap, rewriteFileImports } from '../rewrite-imports';
import { isInteractive, spinner as makeSpinner } from '../tty';

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
  if (toAdd.length === 0 && !isInteractive()) {
    console.error(
      'No component names, and this is not a terminal. Pass the names and -y, for example: npx arloui add button -y',
    );
    process.exit(1);
  }
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
  const spinner = makeSpinner();
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
    throw await unknownComponentError(client, toAdd, err);
  }

  const sourceTargetMap = buildSourceTargetMap(cwd, config, [...allEntries.values()]);
  const named = new Set(toAdd);
  for (const entry of allEntries.values()) {
    const asked = named.has(entry.name);
    // `--overwrite` replaces the components you named. Foundation files that
    // came along as dependencies are left in place, so a theme you edited is
    // not wiped by `add button --overwrite`. Missing foundation files are
    // still written.
    await writeComponent({
      cwd,
      config,
      entry,
      sourceTargetMap,
      overwrite: Boolean(overwrite && asked),
      yes: asked ? yes : true,
    });
  }

  await ensureFonts(cwd, config);

  const npmDeps = new Set<string>();
  const nativeDeps: Array<{ name: string; setup: string }> = [];
  for (const entry of allEntries.values()) {
    entry.dependencies?.forEach((d) => npmDeps.add(d));
    entry.nativeDeps?.forEach((d) => nativeDeps.push(d));
  }

  const lines: string[] = [kleur.green('Done.')];
  const install = await installCommand(cwd, [...npmDeps]);
  if (install) {
    lines.push('', `Install npm dependencies:`, `  ${kleur.cyan(install)}`);
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

    if (!isInteractive()) {
      console.error(
        `skip ${entry.name} — already installed. Pass -y to leave existing files, or --overwrite to replace them.`,
      );
      process.exitCode = 1;
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

/** `fonts.ts` is written by init. `add` creates it when the alias moved or init never ran the font step. */
async function ensureFonts(cwd: string, config: ArloConfig): Promise<void> {
  const target = resolveWithin(cwd, config.aliases.lib, 'fonts.ts');
  if (await fileExists(target)) return;
  await writeFileEnsuringDir(target, FONTS_MODULE);
  p.log.success(`wrote ${kleur.cyan(rel(cwd, target))}`);
}

/**
 * Expo projects should use `npx expo install` so the versions match the SDK.
 * Packages already listed in package.json are left out.
 */
async function installCommand(cwd: string, deps: string[]): Promise<string | null> {
  if (deps.length === 0) return null;
  let installed = new Set<string>();
  let expo = false;
  try {
    const pkg = JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    installed = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ]);
    expo = Boolean(pkg.dependencies?.expo || pkg.devDependencies?.expo);
  } catch {
    // No package.json — print every dependency.
  }
  if (await fileExists(join(cwd, 'app.json'))) expo = true;
  const pending = deps.filter((dep) => !installed.has(dep));
  if (pending.length === 0) return null;
  const bins = pending.join(' ');
  return expo ? `npx expo install ${bins}` : `npm i ${bins}`;
}

async function unknownComponentError(
  client: RegistryClient,
  names: string[],
  err: unknown,
): Promise<Error> {
  const message = err instanceof Error ? err.message : String(err);
  if (!/\b404\b/.test(message)) return err instanceof Error ? err : new Error(message);
  const failed = names.find(
    (name) => message.includes(`/${encodeURIComponent(name)}.json`) || message.includes(`/${name}.json`),
  );
  const suggestion = failed ? await suggestName(client, failed) : undefined;
  const who = failed ? `"${failed}"` : 'that name';
  const hint = suggestion ? ` Did you mean \`${suggestion}\`?` : '';
  return new Error(
    `Unknown component ${who}.${hint} Run \`npx arloui list\` to see what's available.`,
  );
}

async function suggestName(client: RegistryClient, input: string): Promise<string | undefined> {
  try {
    const index = await client.index();
    return closestName(
      input,
      index.items.map((item) => item.name),
    );
  } catch {
    return undefined;
  }
}

function closestName(input: string, names: string[]): string | undefined {
  let best: { name: string; score: number } | undefined;
  for (const name of names) {
    const score = editDistance(input, name);
    if (!best || score < best.score) best = { name, score };
  }
  if (!best || best.score > 2) return undefined;
  return best.name;
}

function editDistance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let corner = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = prev[j]!;
      prev[j] =
        a[i - 1] === b[j - 1]
          ? corner
          : 1 + Math.min(corner, next, prev[j - 1]!);
      corner = next;
    }
  }
  return prev[b.length]!;
}
