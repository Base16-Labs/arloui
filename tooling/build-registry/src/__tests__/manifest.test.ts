import { access, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '@arloui/registry/manifest';
import { buildAll, buildIndex, validateManifest } from '../lib';
import { chartForms } from '../../../../apps/www/lib/chart-forms';

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

  /**
   * A component's files must land inside a folder named after it.
   *
   * `badge` and `chip` targeted `badge.tsx` and `chip.tsx` at the root of the
   * components alias while their own `index.ts` targeted `badge/index.ts` — so a
   * consumer got a stray file beside the folder, and the barrel re-exported
   * `'../badge'` to reach back out to it. It worked, which is why it survived;
   * it just read as a mistake in every consumer's tree.
   */
  it('lands every component file inside its own folder', () => {
    const strays: string[] = [];
    for (const entry of REGISTRY.items) {
      for (const file of entry.files) {
        const match = /^components\/([^/]+)\//.exec(file.source);
        if (!match) continue; // foundation files target the foundation alias
        const folder = match[1] as string;
        if (!file.target.startsWith(`${folder}/`)) {
          strays.push(`${entry.name}: ${file.source} -> ${file.target}`);
        }
      }
    }
    expect(strays).toEqual([]);
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
 * Every semantic colour appears in the docs table.
 *
 * The table is hand-written — each row carries a palette name and a sentence of
 * usage that nothing can generate — so it drifts silently every time a token is
 * added. Ten had accumulated: three from the Card work and the whole chart
 * palette. A token nobody can find is a token nobody uses.
 */
describe('the semantic colour table', () => {
  const PAGE = join(ROOT, 'apps/www/app/docs/primitives/[slug]/_pages/color.tsx');

  it('documents every semantic colour, and no colours that no longer exist', async () => {
    const { lightSemanticColors } = (await import('@arloui/tokens/semantic')) as {
      lightSemanticColors: Record<string, string>;
    };
    const page = await readFile(PAGE, 'utf8');
    const documented = [...page.matchAll(/semanticKey: '(\w+)'/g)].map((match) => match[1]!);

    /*
     * The chart roles are held back from the table on purpose — they are a
     * palette vocabulary rather than a UI state, and they are being documented
     * with the Chart component instead.
     *
     * Listed rather than pattern-skipped so the exclusion stays a decision
     * someone made: a new `chart*` token still has to be added here, which is
     * the moment to ask whether the whole set should go back in the table.
     */
    const deliberatelyOmitted = [
      'chartPositive',
      'chartNegative',
      'chartSeries1',
      'chartSeries2',
      'chartSeries3',
      'chartSeries4',
      'chartOther',
    ];
    const source = Object.keys(lightSemanticColors).filter(
      (key) => !deliberatelyOmitted.includes(key),
    );

    // The omission list must not outlive the tokens it names.
    expect(
      deliberatelyOmitted.filter((key) => !(key in lightSemanticColors)),
    ).toEqual([]);
    expect(source.filter((key) => !documented.includes(key))).toEqual([]);
    expect(documented.filter((key) => !source.includes(key))).toEqual([]);
    // A row repeated in two sections reads as two different tokens.
    expect(documented.filter((key, i) => documented.indexOf(key) !== i)).toEqual([]);
  });
});

/**
 * Every documented component has a Snack, so every docs page has its QR code.
 *
 * `SCREENS` in `build-snacks` is hand-written, and `stepper` was simply never
 * added — the screen existed in the playground and the docs page rendered, but
 * `DevicePreview` looks the slug up in the generated map and quietly draws
 * nothing when it misses. A missing QR is invisible until someone notices one
 * page is different from the other nineteen.
 */
describe('the Snack map', () => {
  it('covers every component the docs list', async () => {
    const [{ componentGroups }, snackMap, generator] = await Promise.all([
      import(`${ROOT}/apps/www/lib/routes.ts`) as Promise<{
        componentGroups: { items: { slug: string }[] }[];
      }>,
      readFile(join(ROOT, 'apps/www/lib/snack-map.json'), 'utf8').then(
        (raw) => JSON.parse(raw) as Record<string, string>,
      ),
      readFile(join(ROOT, 'tooling/build-snacks/src/build-snacks.mjs'), 'utf8'),
    ]);

    const slugs = componentGroups.flatMap((group) => group.items.map((item) => item.slug));
    const screens = generator.slice(generator.indexOf('const SCREENS = {'));
    const mapped = [...screens.slice(0, screens.indexOf('};')).matchAll(/: '([\w-]+)'/g)].map(
      (match) => match[1]!,
    );

    // The generator has to know about it, or the next rebuild drops it again.
    expect(slugs.filter((slug) => !mapped.includes(slug))).toEqual([]);

    /*
     * The published map lags the generator until someone runs `snacks:build`,
     * which republishes every Snack and mints new ids for all of them — an
     * outward-facing action, not something to fire off to satisfy a test. So
     * this reports the gap instead of failing: a slug the generator knows about
     * but the map has not caught up with is pending a publish, not a defect.
     */
    const unpublished = slugs.filter((slug) => !(slug in snackMap));
    if (unpublished.length > 0) {
      console.warn(
        `Snack map is behind the generator for: ${unpublished.join(', ')}. ` +
          'Run `npm run snacks:build` to publish — note it re-mints every id.',
      );
    }
    // What must never happen: a slug in the map that nothing generates.
    expect(Object.keys(snackMap).filter((slug) => !mapped.includes(slug))).toEqual([]);
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
    expect(chartForms).toHaveLength(6);

    const wrong: string[] = [];
    for (const { entry: name, file, exportName, slug } of chartForms) {
      const md = await readFile(join(dirname(DOC), `${slug}.md`), 'utf8');
      expect(md).toContain(`npx arloui add ${name}`);
      expect(md).toContain(`import { ${exportName} } from '@/components/ui/${file}'`);
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
      .filter((n) => n.startsWith('chart-') && n !== 'chart-core' && n !== 'chart-plot');
    const undocumented = shipped.filter((n) => !md.includes(`npx arloui add ${n}`));
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
    const section = md.slice(md.indexOf('## API reference'), md.indexOf('## Loading and empty states'));
    for (const form of ['LineChart', 'LineChart.Plot', 'Chart.Bar', 'Chart.Sparkline', 'Chart.Donut', 'Chart.Meter', 'Chart.Heatmap']) {
      expect(section).toContain(form === 'LineChart' ? '### Line chart (`LineChart`)' : `### ${form}`);
    }
    // Every row is `| \`name\` | \`type\` | default | description |`.
    const rows = [...section.matchAll(/^\| `\w+`/gm)];
    expect(rows.length).toBeGreaterThan(80);
  });

  it('documents what every prop does', async () => {
    const md = await readFile(DOC, 'utf8');
    const section = md.slice(md.indexOf('## API reference'), md.indexOf('## Loading and empty states'));
    expect(section.length).toBeGreaterThan(0);
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
    const section = md.slice(md.indexOf('## API reference'), md.indexOf('## Loading and empty states'));
    const rows = [...section.matchAll(/^\| `<([\w.]+) \/>` \|[^|]*\| ([^|]*)\|$/gm)];
    expect(rows.length).toBeGreaterThan(25);

    const undocumented = rows.filter((m) => m[2]!.trim() === '—').map((m) => m[1]);
    expect(undocumented).toEqual([]);

    // The parts a reader is most likely to reach for, by name.
    for (const part of ['LineChart.Crosshair', 'Chart.Bar.Series', 'Chart.Meter.Ring', 'Chart.Sparkline.Fill']) {
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
      .filter((name) => name.startsWith('chart-') && name !== 'chart-core' && name !== 'chart-plot');

    for (const form of forms) {
      const page = await readFile(join(MD, `${form}.md`), 'utf8');
      expect(page).toContain('## Install');
      expect(page).toContain(`npx arloui add ${form}`);
      expect(page).toContain('## Examples');
      expect(page).toContain('## When to use');
      // The reference is the half that cannot be hand-written, so assert it landed.
      expect(page).toMatch(/## (Props|Parts)/);
    }
  });
  it('keeps the legacy raw Markdown URL equivalent to the canonical page', async () => {
    expect(await readFile(join(MD, 'chart-plot.md'), 'utf8'))
      .toBe(await readFile(join(MD, 'chart-line.md'), 'utf8'));
  });
});
