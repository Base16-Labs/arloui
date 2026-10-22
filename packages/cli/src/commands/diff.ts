import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import kleur from 'kleur';
import { aliasFor, loadConfig } from '../config';
import { fileExists, resolveWithin } from '../fs-utils';
import { RegistryClient } from '../registry-client';
import { buildSourceTargetMap, rewriteFileImports } from '../rewrite-imports';

type Options = { cwd: string; name?: string };

/**
 * Compare locally-installed component files to the latest registry version.
 * This is the equivalent of `shadcn diff` — it does NOT modify files. It just
 * surfaces drift so the user can decide whether to re-run `add --overwrite`.
 */
export async function diff({ cwd, name }: Options): Promise<void> {
  const config = await loadConfig(cwd);
  if (!config) {
    console.error(`No arlo.json found. Run \`npx arloui init\` first.`);
    process.exit(1);
  }
  const client = new RegistryClient(config.registry);
  const index = await client.index();

  let items = index.items;
  if (name) {
    const found = index.items.find((i) => i.name === name);
    if (!found) {
      const suggestion = closestName(
        name,
        index.items.map((item) => item.name),
      );
      const hint = suggestion ? ` Did you mean \`${suggestion}\`?` : '';
      console.error(
        `Unknown component "${name}".${hint} Run \`npx arloui list\` to see what's available.`,
      );
      process.exit(1);
    }
    items = [found];
  }

  for (const item of items) {
    // Resolve the component with its transitive deps and build the same
    // source→target map `add` uses, so the comparison accounts for the import
    // rewriting `add` applies — otherwise every rewritten file reads as drifted.
    const entries = await client.resolve(item.name);
    const map = buildSourceTargetMap(cwd, config, entries);
    const entry = entries.find((e) => e.name === item.name) ?? entries[0];
    if (!entry) continue;
    let drifted = 0;
    let missing = 0;

    for (const file of entry.files) {
      const target = resolveWithin(cwd, aliasFor(config, file.type), file.target);
      if (!(await fileExists(target))) {
        missing++;
        continue;
      }
      const local = await readFile(target, 'utf8');
      if (local !== rewriteFileImports(file, cwd, config, map)) drifted++;
    }

    if (missing === entry.files.length) continue; // not installed
    if (drifted === 0) {
      console.log(
        `${kleur.green('●')} ${item.name.padEnd(20)} up to date  ${kleur.dim(entry.hash)}`,
      );
      continue;
    }

    process.exitCode = 1;
    console.log(
      `${kleur.yellow('●')} ${item.name.padEnd(20)} ${drifted} of ${entry.files.length} files drifted  ${kleur.dim(entry.hash)}`,
    );
    for (const file of entry.files) {
      const target = resolveWithin(cwd, aliasFor(config, file.type), file.target);
      if (!(await fileExists(target))) continue;
      const local = await readFile(target, 'utf8');
      const registry = rewriteFileImports(file, cwd, config, map);
      if (local === registry) continue;
      console.log('');
      console.log(unifiedDiff(rel(cwd, target), local, registry));
    }
  }
}

function closestName(input: string, names: string[]): string | undefined {
  let best: { name: string; score: number } | undefined;
  for (const name of names) {
    const score = editDistance(input, name);
    if (!best || score < best.score) best = { name, score };
  }
  if (!best || best.score > 2) return undefined;
  return best.name;
}

function editDistance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let corner = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = prev[j]!;
      prev[j] = a[i - 1] === b[j - 1] ? corner : 1 + Math.min(corner, next, prev[j - 1]!);
      corner = next;
    }
  }
  return prev[b.length]!;
}

function rel(from: string, to: string): string {
  return relative(from, to) || to;
}

type Op = { kind: ' ' | '-' | '+'; line: string; a: number; b: number };

const CONTEXT = 3;
const MAX_CHANGED_LINES = 80;

/**
 * Unified diff of the local file against the registry copy, with 3 lines of
 * context per hunk. Lines are matched by longest common subsequence, so an
 * inserted line shows as one `+` rather than shifting every line after it.
 * Capped so a large file stays readable.
 */
export function unifiedDiff(path: string, local: string, registry: string): string {
  const ops = diffLines(local.replace(/\n$/, '').split('\n'), registry.replace(/\n$/, '').split('\n'));
  const out = [`--- ${path}`, `+++ ${path} (registry)`];
  let changed = 0;
  let i = 0;
  while (i < ops.length) {
    if (ops[i]!.kind === ' ') {
      i++;
      continue;
    }
    // Grow the hunk while the next change sits within two context windows.
    const start = Math.max(0, i - CONTEXT);
    let end = i;
    while (end < ops.length) {
      if (ops[end]!.kind !== ' ') {
        end++;
        continue;
      }
      let gap = end;
      while (gap < ops.length && ops[gap]!.kind === ' ') gap++;
      if (gap === ops.length || gap - end > CONTEXT * 2) break;
      end = gap;
    }
    const stop = Math.min(ops.length, end + CONTEXT);
    const hunk = ops.slice(start, stop);
    const aStart = hunk[0]!.a;
    const bStart = hunk[0]!.b;
    const aLen = hunk.filter((op) => op.kind !== '+').length;
    const bLen = hunk.filter((op) => op.kind !== '-').length;
    out.push(kleur.cyan(`@@ -${aStart + 1},${aLen} +${bStart + 1},${bLen} @@`));
    for (const op of hunk) {
      if (op.kind !== ' ' && ++changed > MAX_CHANGED_LINES) {
        out.push(kleur.dim(`… more changes not shown (over ${MAX_CHANGED_LINES} lines)`));
        return out.join('\n');
      }
      const text = `${op.kind}${op.line}`;
      out.push(op.kind === '-' ? kleur.red(text) : op.kind === '+' ? kleur.green(text) : text);
    }
    i = stop;
  }
  return out.join('\n');
}

function diffLines(a: string[], b: string[]): Op[] {
  // Trim the common head and tail so the table only covers the changed middle.
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head++;
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;

  const midA = a.slice(head, a.length - tail);
  const midB = b.slice(head, b.length - tail);
  const n = midA.length;
  const m = midB.length;
  // lcs[i][j] = length of the LCS of midA[i:] and midB[j:], stored flat.
  const lcs = new Uint32Array((n + 1) * (m + 1));
  for (let x = n - 1; x >= 0; x--) {
    for (let y = m - 1; y >= 0; y--) {
      lcs[x * (m + 1) + y] =
        midA[x] === midB[y]
          ? lcs[(x + 1) * (m + 1) + y + 1]! + 1
          : Math.max(lcs[(x + 1) * (m + 1) + y]!, lcs[x * (m + 1) + y + 1]!);
    }
  }

  const ops: Op[] = [];
  for (let k = 0; k < head; k++) ops.push({ kind: ' ', line: a[k]!, a: k, b: k });
  let x = 0;
  let y = 0;
  while (x < n || y < m) {
    if (x < n && y < m && midA[x] === midB[y]) {
      ops.push({ kind: ' ', line: midA[x]!, a: head + x, b: head + y });
      x++;
      y++;
    } else if (y < m && (x === n || lcs[x * (m + 1) + y + 1]! >= lcs[(x + 1) * (m + 1) + y]!)) {
      ops.push({ kind: '+', line: midB[y]!, a: head + x, b: head + y });
      y++;
    } else {
      ops.push({ kind: '-', line: midA[x]!, a: head + x, b: head + y });
      x++;
    }
  }
  for (let k = 0; k < tail; k++) {
    ops.push({ kind: ' ', line: a[a.length - tail + k]!, a: a.length - tail + k, b: b.length - tail + k });
  }
  return ops;
}
