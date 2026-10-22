import { urls, type IndexEntry, type RegistryEntry } from './client.js';

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

export function componentMarkdown(
  entry: RegistryEntry,
  prose: string | null,
  options?: { source?: boolean },
): string {
  const meta: string[] = [
    `- **id**: \`${entry.name}\``,
    `- **kind**: ${entry.kind}`,
  ];
  if (entry.meta?.tags?.length) meta.push(`- **tags**: ${entry.meta.tags.join(', ')}`);
  if (entry.dependencies?.length) meta.push(`- **npm dependencies**: ${entry.dependencies.join(', ')}`);
  if (entry.registryDependencies?.length)
    meta.push(`- **registry dependencies**: ${entry.registryDependencies.join(', ')} (installed automatically)`);
  const tokens = tokensUsed(entry);
  if (tokens.length) meta.push(`- **tokens used**: ${tokens.join(', ')}`);

  const files = entry.files.map((f) => {
    const lang = f.target.endsWith('.ts') ? 'ts' : 'tsx';
    return `### \`${f.target}\`\n\n\`\`\`${lang}\n${f.content.trimEnd()}\n\`\`\``;
  });

  const parts = [`# ${entry.title}`, '', entry.description, '', meta.join('\n')];
  if (prose) parts.push('', '---', '', prose.trim());
  if (options?.source !== false) parts.push('', '## Source', '', files.join('\n\n'));
  else parts.push('', 'Source omitted. Call again with `source: true` for the React Native files.');
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

const SCALE_EXPORTS = ['spacing', 'radii', 'fontWeights', 'fontFamilies'] as const;

function readScalar(block: string | null, key: string): string | undefined {
  if (!block) return undefined;
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(
    new RegExp(`(?:^|[\\n,{])\\s*(?:'${escaped}'|"${escaped}"|${escaped})\\s*:\\s*([^,\\n]+)`),
  );
  return match?.[1]?.trim().replace(/,$/, '');
}

/** Resolve a colour token, or a top-level scale token such as `spacing.6`. */
export function tokenMarkdown(source: string, path: string): string {
  const trimmed = path.trim();
  const [group, scaleKey] = trimmed.split('.');
  if (group && scaleKey && (SCALE_EXPORTS as readonly string[]).includes(group)) {
    const value = readScalar(extractBlock(source, group), scaleKey);
    if (value == null) {
      return `Token \`${trimmed}\` was not found on \`${group}\`.`;
    }
    return [
      `# Token \`${trimmed}\``,
      '',
      `| | value |`,
      `| --- | --- |`,
      `| ${group}.${scaleKey} | \`${value}\` |`,
      '',
      `Access in a component as \`t.${group}[${/^\d/.test(scaleKey) ? scaleKey : `'${scaleKey}'`}]\`.`,
    ].join('\n');
  }

  const key = trimmed.replace(/^colors\./, '');
  const light = readKey(extractBlock(source, 'lightSemanticColors'), key);
  const dark = readKey(extractBlock(source, 'darkSemanticColors'), key);

  if (light == null && dark == null) {
    return `Token \`${path}\` was not found among the semantic colour tokens or the spacing, radii, and font scales.\n\nFor sizing, typography, or motion, use \`arlo_get_foundation\` with topic \`spacing\`, \`type\`, or \`motion\`.`;
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
