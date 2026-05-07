/**
 * SVG → React Native icon components.
 *
 * Reads:  packages/icons/assets/svg/*.svg
 * Writes: packages/icons/src/generated/*.tsx + index.ts
 *
 * Naming: chevron-right.svg → ChevronRight.tsx
 *
 * Run from repo root: pnpm icons:build
 */
import { transform } from '@svgr/core';
import jsx from '@svgr/plugin-jsx';
import svgo from '@svgr/plugin-svgo';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../..');
const ASSETS = join(ROOT, 'packages/icons/assets/svg');
const OUT = join(ROOT, 'packages/icons/src/generated');

function toPascalCase(filename: string): string {
  const base = basename(filename, '.svg');
  return base
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

async function main() {
  console.log('arloui · build-icons');
  console.log(`  src = ${ASSETS}`);
  console.log(`  out = ${OUT}`);

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  let files: string[] = [];
  try {
    files = (await readdir(ASSETS)).filter((f) => f.toLowerCase().endsWith('.svg')).sort();
  } catch {
    console.log('  (no assets/svg folder yet — creating stub)');
  }

  if (files.length === 0) {
    await writeFile(
      join(OUT, 'index.ts'),
      `// No SVG assets yet. Add .svg files to packages/icons/assets/svg and run \`pnpm icons:build\`.
export {};
`,
    );
    console.log('  · 0 icons (stub only)');
    console.log('done.');
    return;
  }

  const exportLines: string[] = [];

  for (const file of files) {
    const componentName = toPascalCase(file);
    const svg = await readFile(join(ASSETS, file), 'utf8');
    let tsx = await transform(
      svg,
      {
        plugins: [svgo, jsx],
        native: true,
        typescript: true,
        expandProps: 'end',
        exportType: 'named',
      },
      { componentName },
    );
    // react-native-svg SvgProps omit xmlns; SVGR still emits it for web parity.
    tsx = tsx.replace(/\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');

    await writeFile(join(OUT, `${componentName}.tsx`), tsx + (tsx.endsWith('\n') ? '' : '\n'));
    // SVGR (native + TS) emits `export { ${componentName} as ReactComponent }` only.
    exportLines.push(`export { ReactComponent as ${componentName} } from './${componentName}';`);
    console.log(`  · ${componentName.padEnd(28)} ← ${file}`);
  }

  await writeFile(join(OUT, 'index.ts'), exportLines.join('\n') + '\n');
  console.log(`  · index.ts (${files.length} exports)`);
  console.log('done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
