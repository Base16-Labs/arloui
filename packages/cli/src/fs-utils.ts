import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export async function writeFileEnsuringDir(target: string, contents: string): Promise<void> {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

export async function fileExists(target: string): Promise<boolean> {
  return existsSync(target);
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

export function resolveAlias(cwd: string, alias: string, target: string): string {
  return resolve(cwd, alias, target);
}
