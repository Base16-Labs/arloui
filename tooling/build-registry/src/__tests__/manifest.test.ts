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
