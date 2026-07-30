/**
 * Guard: the lockfile must carry every platform-specific optional dependency,
 * not just the ones for whoever last ran `npm install`.
 *
 * Native packages (esbuild, @ast-grep/napi, @cloudflare/workerd, rollup,
 * lightningcss, @tailwindcss/oxide, …) ship their binary as a per-platform
 * optional dependency. npm prunes those it does not need for the current
 * machine (npm/cli#4828), so a lockfile regenerated on macOS can silently drop
 * every linux entry. It installs fine locally and then fails on the deploy
 * runner — either `npm ci` refuses the tree, or the build dies at
 * "Cannot find native binding".
 *
 * Both failure modes have happened here, in both directions, which is why this
 * is checked rather than remembered.
 *
 * Regenerate a complete lockfile by resolving for a platform that is NOT this
 * machine, which stops npm pruning to the local one:
 *
 *     rm package-lock.json
 *     npm install --package-lock-only --os=linux --cpu=x64
 *
 * That records the full optional set for every platform, macOS included.
 */
import { readFileSync } from 'node:fs';

const PLATFORM = /(linux|win32|darwin|freebsd|android|openbsd|netbsd|sunos|aix|openharmony|musl|gnu|arm64|x64|ia32|ppc64|s390x|riscv|loong)/;

const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
const packages = lock.packages ?? {};

/** Lock keys are install paths; the package name is the last node_modules segment. */
const nameOf = (key) => key.replace(/.*node_modules\//, '');
const present = new Set(Object.keys(packages).map(nameOf));

const missing = new Map();
for (const [key, meta] of Object.entries(packages)) {
  for (const dep of Object.keys(meta.optionalDependencies ?? {})) {
    if (!PLATFORM.test(dep) || present.has(dep)) continue;
    if (!missing.has(dep)) missing.set(dep, nameOf(key) || '<root>');
  }
}

if (missing.size > 0) {
  const lines = [
    `lockfile-platform-guard: ${missing.size} platform-specific optional dependenc${missing.size === 1 ? 'y is' : 'ies are'} missing from package-lock.json.`,
    '',
    'Every one of these will be absent on a deploy runner of that platform:',
    ...[...missing].sort().map(([dep, owner]) => `  - ${dep}  (optional dep of ${owner})`),
    '',
    'Regenerate the lockfile resolving for a foreign platform so npm records them all:',
    '  rm package-lock.json && npm install --package-lock-only --os=linux --cpu=x64',
  ];
  process.stdout.write(`${lines.join('\n')}\n`);
  process.exit(1);
}

process.stdout.write('lockfile-platform-guard: all platform optional dependencies present. ✔\n');
