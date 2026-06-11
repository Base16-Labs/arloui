import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

function repoRoot() {
  return process.cwd().endsWith('/apps/www') ? resolve(process.cwd(), '../..') : process.cwd();
}

export const iconAssetsDir = join(repoRoot(), 'packages/icons/assets/svg');

export async function getIconNames() {
  const files = await readdir(iconAssetsDir);
  return files
    .filter((file) => file.endsWith('.svg'))
    .map((file) => file.slice(0, -4))
    .sort((a, b) => a.localeCompare(b));
}

export async function getIconSvg(name: string) {
  if (!/^[a-z0-9-]+$/.test(name)) return null;

  try {
    return await readFile(join(iconAssetsDir, `${name}.svg`), 'utf8');
  } catch {
    return null;
  }
}

export async function getAnimatedIconSource() {
  return readFile(
    join(repoRoot(), 'packages/registry/src/components/animated-icon/animated-icon.tsx'),
    'utf8',
  );
}
