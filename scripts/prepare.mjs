import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const binary = join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'husky.cmd' : 'husky',
);

if (!process.env.CI && !process.env.WORKERS_CI && process.env.HUSKY !== '0' && existsSync(binary)) {
  execFileSync(binary, { stdio: 'inherit' });
}
