import { readFile } from 'node:fs/promises';

const runNumber = Number.parseInt(process.argv[2] ?? '', 10);

if (!Number.isSafeInteger(runNumber) || runNumber < 1) {
  throw new Error('Expected a positive GitHub Actions run number.');
}

const packageJsonUrl = new URL('../packages/cli/package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonUrl, 'utf8'));
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(packageJson.version);

if (!match) {
  throw new Error(`CLI base version must be plain semver; received ${packageJson.version}.`);
}

const [, major, minor, patch] = match;
console.log(`${major}.${minor}.${Number(patch) + runNumber}`);
