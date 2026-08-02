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

const dist = new URL('../dist/', import.meta.url).pathname;

await writeFile(join(dist, 'esm', 'package.json'), `${JSON.stringify({ type: 'module' }, null, 2)}\n`);
await writeFile(join(dist, 'cjs', 'package.json'), `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`);

console.log('finalize-dist: wrote module-type markers for dist/esm and dist/cjs');
