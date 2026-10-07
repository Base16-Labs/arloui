/**
 * Production-dependency audit gate.
 *
 * Replaces a bare `npm audit --omit=dev --audit-level=high`, which cannot
 * distinguish "high vuln with a real fix" from "high vuln with no fix" (or only
 * a breaking-downgrade 'fix', which npm still reports as fixAvailable).
 *
 * Policy: FAIL on any high/critical production vuln that has a *safe* fix
 * (non-major). PASS — but log — high/critical vulns whose only remedy is a
 * breaking major change or that have no fix at all. Such a vuln re-blocks the
 * build automatically the moment a non-breaking fix is published.
 *
 * Today this lets `sharp` through: it reaches us only via `next`, npm offers no
 * remedy that does not move next backwards by a major, and it is not part of the
 * Cloudflare Worker runtime. Anything actually fixable still fails the build —
 * `next` itself sat here until 16.2.12 shipped a non-major fix and the gate
 * correctly started blocking on it.
 */
import { execSync } from 'node:child_process';

function hasSafeFix(fixAvailable) {
  if (fixAvailable === true) return true;
  if (fixAvailable && typeof fixAvailable === 'object') {
    return fixAvailable.isSemVerMajor === false;
  }
  return false; // false / undefined => no fix
}

let raw = '';
try {
  raw = execSync('npm audit --omit=dev --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
} catch (err) {
  // npm audit exits non-zero whenever vulnerabilities exist; the JSON report is
  // still written to stdout, so recover it from the error.
  raw = err.stdout?.toString() ?? '';
}

if (!raw.trim()) {
  console.error('audit-gate: no output from `npm audit` — cannot evaluate.');
  process.exit(1);
}

const vulns = JSON.parse(raw).vulnerabilities ?? {};
const blocking = [];
const ignored = [];

/** Whether `from` reaches `target` by following `via` package names. */
function reaches(from, target, seen = new Set()) {
  if (seen.has(from)) return false;
  seen.add(from);
  return (vulns[from]?.via ?? []).some(
    (dep) => typeof dep === 'string' && (dep === target || reaches(dep, target, seen)),
  );
}

/**
 * npm marks a package `fixAvailable: true` when it sits in a dependency cycle
 * with an unfixable one — metro and metro-transform-worker require each other,
 * and metro is vulnerable in every version — although `npm audit fix` changes
 * nothing. So a package flagged only *through* other packages, every one of
 * them unfixable and depending back on it, is treated as unfixable too.
 *
 * Deliberately narrow: without the cycle, `fixAvailable: true` is trusted, since
 * a patch can drop the vulnerable dependency outright (@expo/metro-file-map
 * 57.0.4 stopped depending on the unfixable micromatch).
 */
function isFixable(name) {
  const info = vulns[name];
  if (!hasSafeFix(info.fixAvailable)) return false;
  const viaPackagesOnly = info.via.every((v) => typeof v === 'string');
  const onlyThroughUnfixableCycle =
    viaPackagesOnly &&
    info.via.every((dep) => !hasSafeFix(vulns[dep]?.fixAvailable) && reaches(dep, name));
  return !onlyThroughUnfixableCycle;
}

for (const [name, info] of Object.entries(vulns)) {
  if (info.severity !== 'high' && info.severity !== 'critical') continue;
  const label = `${info.severity} · ${name} (${info.range})`;
  (isFixable(name) ? blocking : ignored).push(label);
}

// Everything goes to one stream. Splitting the report across stdout/stderr let
// CI interleave the two lists, so the blocking entries appeared shuffled into
// the allowed ones and the log was unreadable. The exit code carries the verdict.
const out = (line = '') => process.stdout.write(`${line}\n`);

if (ignored.length) {
  out('Allowed high/critical (no safe fix — breaking-only or none):');
  for (const item of ignored.sort()) out(`  - ${item}`);
  out();
}

if (blocking.length) {
  out('BLOCKING high/critical with a safe fix available — resolve these:');
  for (const item of blocking.sort()) out(`  - ${item}`);
  out('\nRun `npm audit fix` (or `npm update <pkg>`) and commit the lockfile.');
  process.exit(1);
}

out('audit-gate: no fixable high/critical vulnerabilities in production dependencies. ✔');
