import {
  agentItems,
  archetypeItems,
  componentGroups,
  docsSections,
  gettingStartedItems,
  primitiveItems,
  siteLinks,
} from '@/lib/routes';

export type SearchEntry = {
  id: string;
  title: string;
  href: string;
  category: string;
  /** Extra terms to match on (group name, slug, aliases). */
  keywords?: string;
};

function build(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const group of componentGroups) {
    for (const item of group.items) {
      entries.push({
        id: `component-${item.slug}`,
        title: item.label,
        href: `/docs/components/${item.slug}`,
        category: 'Components',
        keywords: `${group.label} ${item.slug}`,
      });
    }
  }

  for (const item of archetypeItems) {
    entries.push({
      id: `archetype-${item.slug}`,
      title: item.label,
      href: `/docs/archetypes/${item.slug}`,
      category: 'Archetypes',
      keywords: item.slug,
    });
  }

  for (const item of primitiveItems) {
    entries.push({
      id: `foundation-${item.slug}`,
      title: item.label,
      href: `/docs/primitives/${item.slug}`,
      category: 'Foundations',
      keywords: item.slug,
    });
  }

  for (const item of agentItems) {
    entries.push({
      id: `agent-${item.slug}`,
      title: item.label,
      href: `/docs/agents/${item.slug}`,
      category: 'Agents',
      keywords: item.slug,
    });
  }

  for (const item of gettingStartedItems) {
    entries.push({
      id: `getting-started-${item.slug}`,
      title: item.label,
      href: `/docs/getting-started/${item.slug}`,
      category: 'Getting started',
      keywords: item.slug,
    });
  }

  for (const section of docsSections) {
    entries.push({
      id: `page-${section.href}`,
      title: section.label,
      href: section.href,
      category: 'Pages',
    });
  }

  for (const link of siteLinks) {
    if (entries.some((e) => e.href === link.href)) continue;
    entries.push({
      id: `page-${link.href}`,
      title: link.label,
      href: link.href,
      category: 'Pages',
    });
  }

  return entries;
}

export const searchEntries: SearchEntry[] = build();
