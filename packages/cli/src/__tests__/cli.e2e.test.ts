/**
 * End-to-end test for the *published* CLI artifact.
 *
 * Builds the bundle if needed, serves the real generated registry JSON over
 * HTTP, and drives `dist/cli.cjs` as a subprocess in a throwaway project —
 * verifying the shipped binary (shebang, bundled deps, Node fetch) actually
 * fetches from a registry and writes correct files to disk.
 */
import { execFile, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const run = promisify(execFile);

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI_DIR = resolve(HERE, '..', '..'); // packages/cli
const REPO_ROOT = resolve(CLI_DIR, '..', '..');
const BIN = join(CLI_DIR, 'dist', 'cli.cjs');
const REGISTRY_DIR = join(REPO_ROOT, 'apps', 'www', 'public', 'r');

let server: Server;
let baseUrl: string;
let projectDir: string;

/**
 * Run the built CLI as a subprocess and return combined stdout+stderr.
 * Async (not execFileSync) so the in-process registry server — which shares
 * this event loop — can keep responding while the child runs.
 */
async function runCli(args: string[], cwd: string): Promise<string> {
  const { stdout, stderr } = await run('node', [BIN, ...args], { cwd, encoding: 'utf8' });
  return stdout + stderr;
}

beforeAll(async () => {
  if (!existsSync(BIN)) {
    execFileSync('npm', ['run', 'build'], { cwd: CLI_DIR, stdio: 'inherit' });
  }
  if (!existsSync(join(REGISTRY_DIR, 'index.json'))) {
    execFileSync('npm', ['run', 'registry:build'], { cwd: REPO_ROOT, stdio: 'inherit' });
  }

  // Static server that serves the generated registry JSON at the root.
  server = createServer((req, res) => {
    const name = (req.url ?? '/').replace(/^\/+/, '').split('?')[0] || 'index.json';
    readFile(join(REGISTRY_DIR, name), 'utf8').then(
      (body) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(body);
      },
      () => {
        res.writeHead(404, { 'content-type': 'application/json' });
        res.end('{}');
      },
    );
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;

  projectDir = await mkdtemp(join(tmpdir(), 'arloui-e2e-'));
  // Point a real arlo.json at the local registry.
  await writeFile(
    join(projectDir, 'arlo.json'),
    JSON.stringify({
      $schema: 'https://arloui.com/schemas/arlo-config-v1.json',
      registry: baseUrl,
      aliases: {
        components: 'components/ui',
        tokens: 'lib/arloui',
        theme: 'lib/arloui',
        lib: 'lib/arloui',
      },
      style: 'default',
    }),
  );
});

afterAll(async () => {
  await new Promise<void>((r) => server?.close(() => r()));
  if (projectDir) await rm(projectDir, { recursive: true, force: true });
});

describe('published CLI (e2e)', () => {
  it('has an executable bin bundle', async () => {
    expect(existsSync(BIN)).toBe(true);
    const first = await readFile(BIN, 'utf8').then((s) => s.split('\n', 1)[0]);
    expect(first).toBe('#!/usr/bin/env node');
  });

  it('lists registry entries from the served registry', async () => {
    const out = await runCli(['list'], projectDir);
    expect(out).toContain('button');
    expect(out).toContain('tokens');
  });

  it('installs a component and its transitive deps to disk', async () => {
    const out = await runCli(['add', 'button', '--yes'], projectDir);
    expect(out).toMatch(/Done/i);

    // component + its foundation deps landed under the configured aliases
    expect(existsSync(join(projectDir, 'components/ui/button.tsx'))).toBe(true);
    expect(existsSync(join(projectDir, 'lib/arloui/tokens.ts'))).toBe(true);
    expect(existsSync(join(projectDir, 'lib/arloui/theme-provider.tsx'))).toBe(true);

    // and it surfaced the npm dependency hint from the registry entry
    expect(out).toMatch(/expo-haptics/);
  });

  it('writes byte-for-byte what the registry served', async () => {
    const entry = JSON.parse(await readFile(join(REGISTRY_DIR, 'button.json'), 'utf8'));
    const buttonFile = entry.files.find((f: { target: string }) => f.target === 'button.tsx');
    const written = await readFile(join(projectDir, 'components/ui/button.tsx'), 'utf8');
    expect(written).toBe(buttonFile.content);
  });

  it('reports installed components as up to date via diff', async () => {
    const out = await runCli(['diff', 'button'], projectDir);
    expect(out).toMatch(/button/);
    expect(out).toMatch(/up to date/i);
  });

  it('is non-empty on disk (sanity: files actually written)', async () => {
    const info = await stat(join(projectDir, 'components/ui/button.tsx'));
    expect(info.size).toBeGreaterThan(0);
  });
});
