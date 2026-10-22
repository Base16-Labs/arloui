import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DEFAULT_CONFIG, type ArloConfig } from './config';

/**
 * Where `init` should put files.
 *
 * The default Expo template (SDK 58) maps `@/*` to `./src/*` and keeps the
 * app under `src/app`. Writing `components/ui` and `lib/arloui` at the project
 * root makes `@/components/ui/button` and `@/lib/arloui/theme-provider` fail
 * to resolve. When that layout is present, the aliases go under `src/` so they
 * land in the folder the alias already points at — including beside the
 * template's `src/components/ui/collapsible.tsx`.
 *
 * A project with no `src/` layout keeps the root aliases.
 */
export async function detectAliases(cwd: string): Promise<ArloConfig['aliases']> {
  const prefix = (await prefixFromTsconfig(cwd)) ?? (await prefixFromSrcApp(cwd));
  if (!prefix) return { ...DEFAULT_CONFIG.aliases };
  return {
    components: `${prefix}components/ui`,
    tokens: `${prefix}lib/arloui`,
    theme: `${prefix}lib/arloui`,
    lib: `${prefix}lib/arloui`,
  };
}

async function prefixFromTsconfig(cwd: string): Promise<string | null> {
  for (const file of ['tsconfig.json', 'tsconfig.app.json']) {
    let raw: string;
    try {
      raw = await readFile(join(cwd, file), 'utf8');
    } catch {
      continue;
    }
    let parsed: { compilerOptions?: { paths?: Record<string, unknown> } };
    try {
      parsed = JSON.parse(stripJsonComments(raw));
    } catch {
      continue;
    }
    const paths = parsed.compilerOptions?.paths;
    const star = paths?.['@/*'] ?? paths?.['@*'];
    const target = Array.isArray(star) ? star[0] : star;
    if (typeof target !== 'string') continue;
    const prefix = prefixFromPathTarget(target);
    if (prefix) return prefix;
  }
  return null;
}

async function prefixFromSrcApp(cwd: string): Promise<string | null> {
  try {
    await access(join(cwd, 'src', 'app'));
    return 'src/';
  } catch {
    return null;
  }
}

/** `./src/*` → `src/`. A target of `./*` means the project root. */
function prefixFromPathTarget(target: string): string | null {
  const cleaned = target.replace(/^\.\//, '').replace(/\*$/, '').replace(/\/$/, '');
  if (!cleaned || cleaned === '.') return null;
  return `${cleaned}/`;
}

function stripJsonComments(raw: string): string {
  return raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1');
}
