/**
 * The Chart props reference, read out of the registry source.
 *
 * Lives in `scripts/` rather than `lib/` on purpose: it reads the filesystem,
 * and `lib/docs-markdown` is imported by client components, so anything it
 * pulls in has to survive being bundled for the browser. `node:fs` does not.
 * The output is written to `lib/generated/chart-props.ts` as a plain string —
 * the same build-time-resolve rule the icon data follows.
 *
 * Hand-written prop tables were the alternative and they rot: six forms times
 * roughly fifteen props is ninety rows that nothing checks, going stale on the
 * first rename. The types already carry the names, the shapes, and — in their
 * JSDoc — what each one is for, so this reads them at docs-build time and the
 * page cannot disagree with the code.
 *
 * Defaults come from the component's own destructure (`density = 'default'`),
 * which is where they actually live.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHART_SRC = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../packages/registry/src/components/chart',
);

export type PropDoc = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
};

/**
 * Collapse a JSDoc block to the table's one cell.
 *
 * The first *paragraph*, not the first sentence: splitting on ". " truncated
 * "e.g." mid-thought and threw away the half of a two-sentence doc that said
 * what to pair the prop with. A blank line in the block is the author's own
 * signal that the rest is rationale.
 */
function summarize(block: string): string {
  const lines = block
    .replace(/^\s*\/\*\*/, '')
    .replace(/\*\/\s*$/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*/, '').trim());

  const paragraph: string[] = [];
  for (const line of lines) {
    if (line === '' && paragraph.length > 0) break;
    if (line !== '') paragraph.push(line);
  }

  const body = paragraph.join(' ').replace(/\s+/g, ' ').trim();
  // Long enough to need trimming: cut at a real sentence end, which is a period
  // followed by a capital — never at "e.g." or "1D".
  if (body.length <= 200) return body;
  const cut = [...body.slice(0, 200).matchAll(/\.\s+(?=[A-Z])/g)].pop();
  const trimmed = cut ? body.slice(0, cut.index + 1) : `${body.slice(0, 197)}…`;
  return trimmed;
}

/** Every `name = value` in a component's destructure, which is where defaults live. */
function defaultsFor(source: string): Map<string, string> {
  const found = new Map<string, string>();
  for (const match of source.matchAll(/^\s{2}(\w+)\s*=\s*([^,\n]+),$/gm)) {
    const [, name, value] = match;
    if (name && value && !found.has(name)) found.set(name, value.trim());
  }
  return found;
}

/**
 * Pull one exported props type apart.
 *
 * A hand-rolled parse rather than the TypeScript compiler API: the shapes here
 * are one-line members with a JSDoc above them, the generator has to stay fast
 * enough to run on every docs build, and a full program load for six types is
 * more machinery than the job needs. It is strict about what it accepts and
 * skips anything it does not recognise rather than guessing.
 */
export function propsOf(file: string, typeName: string, defaultsFile = file): PropDoc[] {
  const source = readFileSync(join(CHART_SRC, file), 'utf8');
  const start = source.indexOf(`export type ${typeName} = {`);
  if (start === -1) {
    // An alias — `export type BarReferenceProps = ChartReference;` — so follow
    // it. Parts lean on these to say "this takes the same shape as that".
    const alias = source.match(new RegExp(`export type ${typeName} = (\\w+);`));
    if (!alias?.[1]) return [];
    for (const candidate of readdirSync(CHART_SRC)) {
      if (!candidate.endsWith('.ts') && !candidate.endsWith('.tsx')) continue;
      const resolved = propsOf(candidate, alias[1], defaultsFile);
      if (resolved.length > 0) return resolved;
    }
    return [];
  }
  /*
   * Brace-matched rather than scanning for the next `\n};`.
   *
   * `export type ChartReference = { value: number; label?: string };` closes on
   * its own line, so the naive scan ran past it and captured whichever type
   * came next — silently attributing another shape's members to it.
   */
  const open = source.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const block = source.slice(start, end);
  // Bars declare their props in `bar-shared` but destructure them in the two
  // layout renderers, so the defaults are read from wherever they actually are.
  const defaults = defaultsFor(defaultsFile === file ? source : readFileSync(join(CHART_SRC, defaultsFile), 'utf8'));

  const props: PropDoc[] = [];
  let pendingDoc = '';
  // A single-line type declares its members inline; give the loop below the
  // same one-per-line shape it expects rather than a second parser.
  const lines =
    block.includes('\n') ? block.split('\n').slice(1) : block.slice(block.indexOf('{') + 1).split(';').map((m) => `  ${m.trim()};`);
  for (const line of lines) {
    const doc = line.match(/^\s*\/\*\*(.*)\*\/\s*$/);
    if (doc) {
      pendingDoc = summarize(line);
      continue;
    }
    if (line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      pendingDoc += ` ${line.replace(/^\s*[/*]+/, '').replace(/\*\/$/, '').trim()}`;
      continue;
    }
    const member = line.match(/^\s{2}(\w+)(\??):\s*(.+?);?\s*$/);
    if (!member) continue;
    const [, name, optional, type] = member;
    if (!name || !type) continue;
    props.push({
      name,
      type: type.replace(/;$/, '').trim(),
      required: optional !== '?',
      default: defaults.get(name),
      description: summarize(pendingDoc).trim(),
    });
    pendingDoc = '';
  }
  return props;
}

/** Every form's public surface, in the order the page introduces them. */
export const CHART_PROP_TABLES: {
  /** Export name — the key the docs look sections up by. */
  title: string;
  /** What the docs call it, where that differs from the export. */
  displayTitle?: string;
  file: string;
  type: string;
  defaultsFile?: string;
  /** The form's `*Parts` object, when it has one. */
  parts?: { file: string; object: string };
}[] = [
  { title: 'LineChart', displayTitle: 'Line chart', file: 'chart.tsx', type: 'ChartProps' , parts: { file: 'chart.tsx', object: 'ChartPlotParts' } },
  { title: 'LineChart.Plot', file: 'plot.tsx', type: 'ChartPlotProps' },
  { title: 'Chart.Bar', file: 'bar-shared.tsx', type: 'BarChartProps', defaultsFile: 'bar-vertical.tsx' , parts: { file: 'bar-chart.tsx', object: 'BarChartParts' } },
  { title: 'Chart.Sparkline', file: 'sparkline.tsx', type: 'SparklineProps' , parts: { file: 'sparkline.tsx', object: 'SparklineParts' } },
  { title: 'Chart.Donut', file: 'donut-chart.tsx', type: 'DonutChartProps' , parts: { file: 'donut-chart.tsx', object: 'DonutChartParts' } },
  { title: 'Chart.Meter', file: 'meter.tsx', type: 'MeterProps' , parts: { file: 'meter.tsx', object: 'MeterParts' } },
  { title: 'Chart.Heatmap', file: 'heatmap.tsx', type: 'HeatmapProps' , parts: { file: 'heatmap.tsx', object: 'HeatmapParts' } },
];

/** A pipe inside a cell would split it, so escape at render rather than in the data. */
const cell = (text: string) => text.replace(/\|/g, '\\|');

/** The whole reference as markdown, ready to drop into the page. */
export function chartPropsMarkdown(): string {
  const sections = chartPropsData().map(({ title, displayTitle, props, parts }) => {
    const rows = props
      .map((p) => {
        const name = p.required ? `\`${p.name}\` **·** required` : `\`${p.name}\``;
        const dflt = p.default ? `\`${cell(p.default)}\`` : '—';
        return `| ${name} | \`${cell(p.type)}\` | ${dflt} | ${cell(p.description) || '—'} |`;
      })
      .join('\n');
    const partRows = parts
      .map((part) => {
        const takes = part.props.length > 0 ? part.props.map((x) => `\`${x.name}\``).join(' ') : '—';
        return `| \`<${part.name} />\` | ${takes} | ${cell(part.description) || '—'} |`;
      })
      .join('\n');

    return [
      `### ${displayTitle ?? title}${displayTitle ? ` (\`${title}\`)` : ''}`,
      '',
      props.length > 0 ? '| Prop | Type | Default | What it does |' : '',
      props.length > 0 ? '| --- | --- | --- | --- |' : '',
      props.length > 0 ? rows : '',
      parts.length > 0 ? '' : '',
      parts.length > 0 ? `**Parts** — name one and it is drawn; name none and you get the default composition.` : '',
      parts.length > 0 ? '' : '',
      parts.length > 0 ? '| Part | Takes | What it draws |' : '',
      parts.length > 0 ? '| --- | --- | --- |' : '',
      parts.length > 0 ? partRows : '',
    ]
      .filter((line) => line !== '')
      .join('\n');
  }).filter(Boolean);

  return sections.join('\n\n');
}

/** The same reference as data, for the rendered page — which is JSX, not markdown. */
export function chartPropsData(): {
  title: string;
  displayTitle?: string;
  props: PropDoc[];
  parts: PartDoc[];
}[] {
  return CHART_PROP_TABLES.map(({ title, displayTitle, file, type, defaultsFile, parts }) => ({
    title,
    displayTitle,
    props: propsOf(file, type, defaultsFile).filter((p) => p.name !== 'children'),
    // `Chart`'s namespace carries every form as well as its own parts; the form
    // entries are pages of their own, so only the plot's parts belong here.
    parts: parts ? partsOf(parts.file, parts.object, title) : [],
  })).filter((section) => section.props.length > 0 || section.parts.length > 0);
}

/* ------------------------------------------------------------------------- *
 * Parts
 *
 * The props tables were only half the reference: they say how a chart behaves
 * but nothing about what it draws, which is now decided entirely by the parts
 * in the tree. A reader who knows every prop still cannot tell that a bar chart
 * needs a `<Categories />` to show its category names.
 * ------------------------------------------------------------------------- */

export type PartDoc = {
  /** As written in the tree, e.g. `Chart.Bar.Series`. */
  name: string;
  description: string;
  props: PropDoc[];
};

/** Where a function is declared, across the chart folder. */
function declarationOf(fn: string): { file: string; source: string } | null {
  for (const file of readdirSync(CHART_SRC)) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
    const source = readFileSync(join(CHART_SRC, file), 'utf8');
    if (new RegExp(`^(?:export )?function ${fn}\\(`, 'm').test(source)) return { file, source };
  }
  return null;
}

/** The JSDoc immediately above a declaration, if it has one. */
function docAbove(source: string, index: number): string {
  const before = source.slice(0, index).trimEnd();
  if (!before.endsWith('*/')) return '';
  const start = before.lastIndexOf('/**');
  if (start === -1) return '';
  return summarize(before.slice(start));
}

/**
 * Read one form's `*Parts` object into documented entries.
 *
 * Each value is a marker component, so its JSDoc is the description and its
 * single parameter's type is what the part accepts. Parts that take nothing —
 * most of them, since presence is the whole point — come back with no props,
 * which is itself worth saying on the page.
 */
export function partsOf(file: string, objectName: string, prefix: string): PartDoc[] {
  const source = readFileSync(join(CHART_SRC, file), 'utf8');
  const start = source.indexOf(`export const ${objectName} = {`);
  if (start === -1) return [];
  const block = source.slice(start, source.indexOf('\n};', start));

  const parts: PartDoc[] = [];
  for (const match of block.matchAll(/^\s{2}(\w+): (\w+),$/gm)) {
    const [, name, fn] = match;
    if (!name || !fn) continue;
    /*
     * The namespace is assembled from several files — the plot's parts live in
     * `plot`, the readouts in `readouts`, the legend in `legend` — so a part is
     * looked up wherever it is declared rather than only beside its object.
     */
    const home = declarationOf(fn) ?? { file, source };
    const declared = home.source.search(new RegExp(`^(?:export )?function ${fn}\\(`, 'm'));
    if (declared === -1) continue;
    const signature = home.source.slice(declared, home.source.indexOf(')', declared) + 1);
    const typeName = signature.match(/:\s*(\w+Props)/)?.[1];
    // A part with props usually carries its doc above the type rather than the
    // function, because that is where a reader looking up the shape lands.
    const typeAt = typeName ? home.source.indexOf(`export type ${typeName} = `) : -1;
    const description =
      docAbove(home.source, declared) || (typeAt === -1 ? '' : docAbove(home.source, typeAt));
    parts.push({
      name: `${prefix}.${name}`,
      description,
      props: typeName ? propsOf(home.file, typeName) : [],
    });
  }
  return parts;
}
