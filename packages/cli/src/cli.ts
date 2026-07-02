import kleur from 'kleur';
import { buildProgram } from './program';

buildProgram()
  .parseAsync(process.argv)
  .catch((err: unknown) => {
    console.error(kleur.red('error: ') + (err instanceof Error ? err.message : String(err)));
    process.exit(1);
  });
