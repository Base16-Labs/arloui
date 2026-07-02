import { Command } from 'commander';
import { add } from './commands/add';
import { diff } from './commands/diff';
import { init } from './commands/init';
import { list } from './commands/list';

/**
 * Build the commander program. Kept separate from `cli.ts` (the bin entry that
 * calls `parseAsync`) so the argument wiring can be unit tested without
 * executing on import.
 */
export function buildProgram(): Command {
  const program = new Command();

  program
    .name('arloui')
    .description(
      'Arlo UI — copy-paste React Native components, tokens, and patterns into your Expo or bare RN app.',
    )
    .version('0.1.0');

  program
    .command('init')
    .description('initialize arloui in the current project (writes arlo.json + foundation files)')
    .option('-y, --yes', 'use defaults without prompting', false)
    .action(async (opts: { yes?: boolean }) => {
      await init({ cwd: process.cwd(), yes: opts.yes });
    });

  program
    .command('add [components...]')
    .description('add one or more components from the registry')
    .option('-y, --yes', 'skip confirmation prompts and overwrite existing files', false)
    .option('--overwrite', 'replace existing files without asking', false)
    .action(async (names: string[], opts: { yes?: boolean; overwrite?: boolean }) => {
      await add({ cwd: process.cwd(), names, yes: opts.yes, overwrite: opts.overwrite });
    });

  program
    .command('list')
    .description('list every available registry entry')
    .action(async () => {
      await list({ cwd: process.cwd() });
    });

  program
    .command('diff [component]')
    .description('compare locally installed component files to the latest registry version')
    .action(async (name: string | undefined) => {
      await diff({ cwd: process.cwd(), name });
    });

  return program;
}
