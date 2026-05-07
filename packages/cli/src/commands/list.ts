import kleur from 'kleur';
import { loadConfig, DEFAULT_CONFIG } from '../config';
import { RegistryClient } from '../registry-client';

type Options = { cwd: string };

export async function list({ cwd }: Options): Promise<void> {
  const config = (await loadConfig(cwd)) ?? DEFAULT_CONFIG;
  const client = new RegistryClient(config.registry);
  const index = await client.index();

  console.log();
  console.log(kleur.bold(`Arlo UI registry  ${kleur.dim(`v${index.version}`)}`));
  console.log();

  const groups: Record<string, typeof index.items> = {};
  for (const it of index.items) {
    (groups[it.kind] ??= []).push(it);
  }

  const order = ['foundation', 'primitive', 'pattern', 'icon'];
  for (const kind of order) {
    const items = groups[kind];
    if (!items?.length) continue;
    console.log(kleur.cyan(kind));
    for (const it of items) {
      console.log(`  ${kleur.bold(it.name.padEnd(20))}${kleur.dim(it.description)}`);
    }
    console.log();
  }
}
