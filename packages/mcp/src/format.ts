import { urls, type FigmaBinding, type IndexEntry, type RegistryEntry } from './client.js';

/** Map a registry `kind` to the docs section a page lives under. */
function docSection(kind: string): string {
  switch (kind) {
    case 'foundation':
      return 'docs/primitives';
    case 'icon':
      return 'docs/components';
    default:
      return 'docs/components';
  }
}

export function pagePathFor(entry: Pick<IndexEntry, 'name' | 'kind'>): string {
  return `${docSection(entry.kind)}/${entry.name}`;
}

// ---- search ----------------------------------------------------------------

function scoreEntry(entry: IndexEntry, terms: string[]): number {
  const haystacks: Array<[string, number]> = [
    [entry.name, 6],
    [entry.title, 5],
    [(entry.meta?.tags ?? []).join(' '), 3],
    [entry.description, 2],
    [entry.kind, 1],
  ];
  let score = 0;
  for (const term of terms) {
    for (const [text, weight] of haystacks) {
      const t = text.toLowerCase();
      if (t === term) score += weight * 3;
      else if (t.split(/[\s-]+/).includes(term)) score += weight * 2;
      else if (t.includes(term)) score += weight;
    }
  }
  return score;
}

export function searchMarkdown(items: IndexEntry[], query: string, kind: string | undefined): string {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const pool = kind ? items.filter((i) => i.kind === kind) : items;
  const ranked = pool
    .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  if (ranked.length === 0) {
    return `No matches for “${query}”${kind ? ` in kind “${kind}”` : ''}.`;
  }

  const lines = ranked.map(({ entry }) => {
    const path = pagePathFor(entry);
    const tags = entry.meta?.tags?.length ? `  _${entry.meta.tags.join(', ')}_` : '';
    return `- **${entry.title}** \`${entry.name}\` · ${entry.kind}${tags}\n  ${entry.description}\n  ${urls.page(path)} · md: ${urls.md(path)}`;
  });
  return `### Results for “${query}”${kind ? ` (kind: ${kind})` : ''}\n\n${lines.join('\n')}`;
}

// ---- component -------------------------------------------------------------

/** Pull the design tokens a component references straight from its source. */
function tokensUsed(entry: RegistryEntry): string[] {
  const re = /\bt\.(?:colors|spacing|radii|sizing|typography|motion|shadows|fontFamilies|focusRing|blur)\.[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*/g;
  const found = new Set<string>();
  for (const file of entry.files) {
    for (const match of file.content.match(re) ?? []) found.add(match.replace(/^t\./, ''));
  }
  return [...found].sort();
}

export function componentMarkdown(entry: RegistryEntry, prose: string | null): string {
  const meta: string[] = [
    `- **id**: \`${entry.name}\``,
    `- **kind**: ${entry.kind}`,
  ];
  if (entry.meta?.tags?.length) meta.push(`- **tags**: ${entry.meta.tags.join(', ')}`);
  if (entry.dependencies?.length) meta.push(`- **npm dependencies**: ${entry.dependencies.join(', ')}`);
  if (entry.registryDependencies?.length)
    meta.push(`- **registry dependencies**: ${entry.registryDependencies.join(', ')} (installed automatically)`);
  if (entry.meta?.figma) meta.push(`- **figma**: ${entry.meta.figma}`);
  const tokens = tokensUsed(entry);
  if (tokens.length) meta.push(`- **tokens used**: ${tokens.join(', ')}`);

  const files = entry.files.map((f) => {
    const lang = f.target.endsWith('.ts') ? 'ts' : 'tsx';
    return `### \`${f.target}\`\n\n\`\`\`${lang}\n${f.content.trimEnd()}\n\`\`\``;
  });

  const parts = [`# ${entry.title}`, '', entry.description, '', meta.join('\n')];
  if (prose) parts.push('', '---', '', prose.trim());
  parts.push('', '## Source', '', files.join('\n\n'));
  return parts.join('\n');
}

// ---- tokens ----------------------------------------------------------------

function extractBlock(src: string, exportName: string): string | null {
  const m = src.match(new RegExp(`export const ${exportName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const`));
  return m?.[1] ?? null;
}

function readKey(block: string | null, key: string): string | undefined {
  if (!block) return undefined;
  const m = block.match(new RegExp(`\\b${key}:\\s*'([^']*)'`));
  return m ? m[1] : undefined;
}

/** Resolve a semantic colour token to its light + dark values from tokens source. */
export function tokenMarkdown(source: string, path: string): string {
  const key = path.replace(/^colors\./, '').trim();
  const light = readKey(extractBlock(source, 'lightSemanticColors'), key);
  const dark = readKey(extractBlock(source, 'darkSemanticColors'), key);

  if (light == null && dark == null) {
    return `Token \`${path}\` was not found among the semantic colour tokens.\n\nFor sizing, spacing, radii, typography or motion tokens, use \`arlo_get_foundation\` with topic \`spacing\`, \`type\`, or \`motion\`.`;
  }
  return [
    `# Token \`${key}\``,
    '',
    '| theme | value |',
    '| --- | --- |',
    `| light | \`${light ?? '—'}\` |`,
    `| dark | \`${dark ?? '—'}\` |`,
    '',
    `Access in a component as \`t.colors.${key}\`.`,
  ].join('\n');
}

/* ------------------------------------------------------- figma ↔ code map */

const describeProps = (props?: Record<string, string | boolean>) =>
  props
    ? Object.entries(props)
        .map(([k, v]) => (typeof v === 'boolean' ? (v ? k : `${k}={false}`) : `${k}="${v}"`))
        .join(' ')
    : '';

/** One `Figma set → code` row, including the props that select that set. */
function bindingLine(entry: IndexEntry, b: FigmaBinding): string {
  const usage = describeProps(b.props);
  const code = b.export ?? entry.title.replace(/\s+/g, '');
  const snippet = usage ? `<${code} ${usage} />` : `<${code} />`;
  return `| \`${b.set}\` | \`${code}\` | \`${snippet}\` | ${b.note ?? '—'} |`;
}

/**
 * Resolve a Figma component-set name to the code behind it.
 *
 * Matching is case-insensitive and tolerant of the group prefix, so both
 * `Buttons/Ghost` and `Ghost` resolve. Substring matches are offered as
 * suggestions rather than guessed at.
 */
export function figmaResolveMarkdown(items: IndexEntry[], query: string): string {
  const q = query.trim().toLowerCase();
  const leaf = (s: string) => s.split('/').pop()!.toLowerCase();

  const exact: string[] = [];
  const near: string[] = [];

  for (const entry of items) {
    for (const b of entry.meta?.figma ?? []) {
      const set = b.set.toLowerCase();
      if (set === q || leaf(b.set) === q) exact.push(bindingLine(entry, b));
      else if (set.includes(q) || q.includes(leaf(b.set))) near.push(bindingLine(entry, b));
    }
  }

  const hits = exact.length ? exact : near;
  if (!hits.length) {
    const known = items
      .flatMap((e) => (e.meta?.figma ?? []).map((b) => b.set))
      .sort();
    return [
      `No Arlo UI component is mapped to the Figma set “${query}”.`,
      '',
      known.length
        ? `Mapped sets:\n${known.map((s) => `- \`${s}\``).join('\n')}`
        : 'No Figma mappings are recorded yet.',
      '',
      'Most Arlo UI components are not drawn in Figma — the code is the source of truth. Use `arlo_search` to find the component by name instead.',
    ].join('\n');
  }

  return [
    `# Figma → code: “${query}”`,
    exact.length ? '' : '\nNo exact match; showing the closest mapped sets.\n',
    '',
    '| Figma set | Code | Usage | Note |',
    '| --- | --- | --- | --- |',
    ...hits,
    '',
    'Pull the full API with `arlo_get_component`.',
  ].join('\n');
}

/** Every recorded Figma ↔ code correspondence, plus what has no Figma at all. */
export function figmaMapMarkdown(items: IndexEntry[]): string {
  const mapped = items.filter((e) => (e.meta?.figma ?? []).length);
  const unmapped = items.filter(
    (e) => e.kind !== 'foundation' && !(e.meta?.figma ?? []).length,
  );

  const lines = ['# Arlo UI — Figma ↔ code map', ''];
  lines.push('| Figma set | Code | Usage | Note |', '| --- | --- | --- | --- |');
  for (const entry of mapped) {
    for (const b of entry.meta!.figma!) lines.push(bindingLine(entry, b));
  }
  if (unmapped.length) {
    lines.push(
      '',
      '## Not drawn in Figma',
      '',
      'These exist only in code. Build from the registry source, not from a canvas.',
      '',
      ...unmapped.map((e) => `- \`${e.name}\` — ${e.title}`),
    );
  }
  return lines.join('\n');
}
