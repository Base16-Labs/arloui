import { access, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '@arloui/registry/manifest';
import { buildAll, buildIndex, validateManifest } from '../lib';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../../..');
const REGISTRY_SRC = join(ROOT, 'packages/registry/src');

describe('the real registry manifest', () => {
  it('passes internal consistency validation', () => {
    expect(validateManifest(REGISTRY)).toEqual([]);
  });

  it('references only source files that exist on disk', async () => {
    const missing: string[] = [];
    for (const entry of REGISTRY.items) {
      for (const file of entry.files) {
        const abs = join(REGISTRY_SRC, file.source);
        try {
          await access(abs);
        } catch {
          missing.push(`${entry.name} -> ${file.source}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('builds every entry into non-empty, hashed JSON', async () => {
    const resolved = await buildAll(REGISTRY_SRC, REGISTRY);
    expect(resolved).toHaveLength(REGISTRY.items.length);
    for (const entry of resolved) {
      expect(entry.hash).toMatch(/^[0-9a-f]{16}$/);
      expect(entry.files.length).toBeGreaterThan(0);
      for (const f of entry.files) {
        expect(f.content.length).toBeGreaterThan(0);
      }
    }
  });

  it('produces an index whose item count matches the manifest', async () => {
    const resolved = await buildAll(REGISTRY_SRC, REGISTRY);
    const index = buildIndex(REGISTRY, resolved);
    expect(index.items).toHaveLength(REGISTRY.items.length);
    expect(index.version).toBe(REGISTRY.version);
  });
});

/**
 * The Chart page hand-writes a table mapping each split entry to the file it
 * lands in and the symbol it exports. Nothing regenerates that table, so it
 * drifts silently the moment an entry is renamed or a form moves file — which
 * is how the page came to promise six forms while rendering five. Read it back
 * and hold it against the manifest.
 */
describe('the chart docs import table', () => {
  const DOC = join(ROOT, 'apps/www/public/md/docs/components/chart.md');

  it('names entries that exist, with the files they actually install', async () => {
    const md = await readFile(DOC, 'utf8');
    const rows = [...md.matchAll(/^\| `(chart-[a-z]+)` \| `([^`]+)` \|/gm)];
    expect(rows.length).toBeGreaterThan(0);

    const wrong: string[] = [];
    for (const [, name, file] of rows) {
      const entry = REGISTRY.items.find((i) => i.name === name);
      if (!entry) {
        wrong.push(`${name}: documented but not in the manifest`);
        continue;
      }
      // The table drops the extension, so compare against the stripped target.
      const targets = entry.files.map((f) => f.target.replace(/\.(tsx|ts)$/, ''));
      if (!targets.includes(file)) {
        wrong.push(`${name}: docs say ${file}, entry installs ${targets.join(', ')}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('documents every split form the manifest ships', async () => {
    const md = await readFile(DOC, 'utf8');
    const shipped = REGISTRY.items
      .map((i) => i.name)
      .filter((n) => n.startsWith('chart-') && n !== 'chart-core');
    const undocumented = shipped.filter((n) => !md.includes(`\`${n}\``));
    expect(undocumented).toEqual([]);
  });
});

/**
 * The Chart page's props tables are generated from the registry types, so the
 * failure mode is not staleness but silence: a parser that stops matching emits
 * an empty table and the page still builds. Assert the tables are there and
 * that they carry the props the source actually declares.
 */
describe('the chart props reference', () => {
  const DOC = join(ROOT, 'apps/www/public/md/docs/components/chart.md');

  it('emits a table for every form, with real rows', async () => {
    const md = await readFile(DOC, 'utf8');
    const section = md.slice(md.indexOf('## Props'), md.indexOf('## Accessibility'));
    for (const form of ['Chart', 'Chart.Plot', 'Chart.Bar', 'Chart.Sparkline', 'Chart.Donut', 'Chart.Meter', 'Chart.Heatmap']) {
      expect(section).toContain(`### ${form}`);
    }
    // Every row is `| \`name\` | \`type\` | default | description |`.
    const rows = [...section.matchAll(/^\| `\w+`/gm)];
    expect(rows.length).toBeGreaterThan(80);
  });

  it('documents what every prop does', async () => {
    const md = await readFile(DOC, 'utf8');
    const section = md.slice(md.indexOf('## Props'), md.indexOf('## Accessibility'));
    // An em dash in the last cell is the generator saying "no JSDoc found".
    const undocumented = [...section.matchAll(/^\| (`\w+`[^|]*)\|[^|]*\|[^|]*\| — \|$/gm)].map(
      (m) => m[1].trim(),
    );
    expect(undocumented).toEqual([]);
  });
});

/**
 * Parts are half the reference now: props say how a chart behaves, parts say
 * what it draws. An undocumented part is the gap that sent readers into the
 * source to find out that a bar chart needs `<Categories />` to show names.
 */
describe('the chart parts reference', () => {
  const DOC = join(ROOT, 'apps/www/public/md/docs/components/chart.md');

  it('documents every part of every form', async () => {
    const md = await readFile(DOC, 'utf8');
    const section = md.slice(md.indexOf('## Props'), md.indexOf('## Accessibility'));
    const rows = [...section.matchAll(/^\| `<([\w.]+) \/>` \|[^|]*\| ([^|]*)\|$/gm)];
    expect(rows.length).toBeGreaterThan(25);

    const undocumented = rows.filter((m) => m[2]!.trim() === '—').map((m) => m[1]);
    expect(undocumented).toEqual([]);

    // The parts a reader is most likely to reach for, by name.
    for (const part of ['Chart.Crosshair', 'Chart.Bar.Series', 'Chart.Meter.Ring', 'Chart.Sparkline.Fill']) {
      expect(section).toContain(`<${part} />`);
    }
  });
});

/**
 * Each chart form has a page of its own, generated from one data source shared
 * with the rendered site. The failure worth catching is a form that exists in
 * the registry but never got a page — the reader's route into it just is not
 * there, and nothing else notices.
 */
describe('the per-form chart pages', () => {
  const MD = join(ROOT, 'apps/www/public/md/docs/components');

  it('gives every shipped form a page with its reference on it', async () => {
    const forms = REGISTRY.items
      .map((item) => item.name)
      .filter((name) => name.startsWith('chart-') && name !== 'chart-core');

    for (const form of forms) {
      const page = await readFile(join(MD, `${form}.md`), 'utf8');
      expect(page).toContain('## Install');
      expect(page).toContain(`npx arloui add ${form}`);
      expect(page).toContain('## Code');
      expect(page).toContain('## When to use');
      // The reference is the half that cannot be hand-written, so assert it landed.
      expect(page).toMatch(/## (Props|Parts)/);
    }
  });
});
