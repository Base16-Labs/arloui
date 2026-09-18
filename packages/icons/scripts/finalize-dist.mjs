/**
 * Stamp module-type markers into the built output.
 *
 * The package itself stays CommonJS-by-default (no top-level "type"), so Node
 * reads `dist/cjs/*.js` correctly with no help. The ESM tree needs its own
 * marker or Node would parse those same `.js` files as CommonJS and fail on the
 * `import` statements.
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not `.pathname` — the latter stays percent-encoded, so a
// checkout path containing a space resolves to a literal "%20" and ENOENTs.
const dist = fileURLToPath(new URL('../dist/', import.meta.url));

await writeFile(join(dist, 'esm', 'package.json'), `${JSON.stringify({ type: 'module' }, null, 2)}\n`);
await writeFile(join(dist, 'cjs', 'package.json'), `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`);

// stderr, not stdout: `prepare` runs inside `npm pack --json`, and anything this
// prints on stdout lands in the middle of that JSON and breaks parsing.
console.error('finalize-dist: wrote module-type markers for dist/esm and dist/cjs');
