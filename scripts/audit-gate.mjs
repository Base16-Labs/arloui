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
 * Today this lets `sharp`/`next` through (libvips CVEs; npm's only "fix" is a
 * major next downgrade, and sharp isn't in the Cloudflare Worker runtime),
 * while still failing on anything actually fixable.
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

for (const [name, info] of Object.entries(vulns)) {
  if (info.severity !== 'high' && info.severity !== 'critical') continue;
  const label = `${info.severity} · ${name} (${info.range})`;
  (hasSafeFix(info.fixAvailable) ? blocking : ignored).push(label);
}

if (ignored.length) {
  console.log('Allowed high/critical (no safe fix — breaking-only or none):');
  for (const item of ignored.sort()) console.log(`  - ${item}`);
  console.log('');
}

if (blocking.length) {
  console.error('BLOCKING high/critical with a safe fix available — resolve these:');
  for (const item of blocking.sort()) console.error(`  - ${item}`);
  console.error('\nRun `npm audit fix` (or `npm update <pkg>`) and commit the lockfile.');
  process.exit(1);
}

console.log('audit-gate: no fixable high/critical vulnerabilities in production dependencies. ✔');
