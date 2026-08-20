export const siteLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'Showcase', href: '/showcase' },
] as const;

export const docsSections = [
  { label: 'Getting started', href: '/docs/getting-started' },
  { label: 'Facets', href: '/docs/foundations' },
  { label: 'Foundations', href: '/docs/primitives' },
  { label: 'Components', href: '/docs/components' },
  { label: 'Archetypes', href: '/docs/archetypes' },
  { label: 'Agents', href: '/docs/agents' },
  { label: 'Changelog', href: '/docs/changelog' },
] as const;

export type ItemGroup = {
  label: string;
  items: { label: string; slug: string }[];
};

export const primitiveItems = [
  { label: 'Typography', slug: 'type' },
  { label: 'Color', slug: 'color' },
  { label: 'Spacing', slug: 'spacing' },
  { label: 'Motion', slug: 'motion' },
  { label: 'Effects', slug: 'effects' },
  { label: 'Icons', slug: 'icons' },
] as const;

export const archetypeItems = [
  { label: 'Question', slug: 'question' },
  { label: 'Decision', slug: 'decision' },
  { label: 'Status', slug: 'status' },
  { label: 'Feed', slug: 'feed' },
  { label: 'Detail', slug: 'detail' },
  { label: 'Creation', slug: 'creation' },
  { label: 'Settings', slug: 'settings' },
  { label: 'Onboarding', slug: 'onboarding' },
  { label: 'Empty', slug: 'empty' },
] as const;

/**
 * One-line summary per archetype. Lives here rather than in the page component
 * because the markdown pipeline (lib/docs-markdown) renders the same text.
 */
export const archetypeDescriptions: Record<string, string> = {
  question: 'A title, a body, one or two actions. Confirmation, permission, single-input.',
  decision: 'Multiple options, comparison, selection. Picking a plan, choosing a card.',
  status: 'Real-time state of a process. Order tracking, upload progress, sync.',
  feed: 'Chronological or ranked stream. Timeline, notifications, activity log.',
  detail: 'Deep view of a single entity. Profile, transaction receipt, flight info.',
  creation: 'Multi-step form or wizard. Onboarding flow, checkout, compose.',
  settings: 'Grouped toggles, pickers, navigation rows. App preferences, account.',
  onboarding: 'First-run experience. Permissions, value props, account setup.',
  empty: 'Zero-data state. First launch, no results, error recovery.',
};

export const agentItems = [
  { label: 'Skill pack', slug: 'skill-pack' },
  { label: 'MCP', slug: 'mcp' },
  { label: 'Prompt cookbook', slug: 'prompt-cookbook' },
] as const;

export const gettingStartedItems = [
  { label: 'Install', slug: 'install' },
  { label: 'With AI', slug: 'with-ai' },
  { label: 'First screen', slug: 'first-screen' },
] as const;

export type ComponentGroup = ItemGroup;

export const componentGroups: ComponentGroup[] = [
  {
    label: 'Layout & surface',
    items: [
      { label: 'Card', slug: 'card' },
      { label: 'List', slug: 'list' },
      { label: 'Sheet', slug: 'sheet' },
      { label: 'Carousel', slug: 'carousel' },
      { label: 'Gallery', slug: 'gallery' },
    ],
  },
  {
    label: 'Controls',
    items: [
      { label: 'Button', slug: 'button' },
      { label: 'Chip', slug: 'chip' },
      { label: 'Toggle', slug: 'toggle' },
      { label: 'Checkbox', slug: 'checkbox' },
      { label: 'Radio', slug: 'radio' },
      { label: 'Input', slug: 'input' },
      { label: 'TextArea', slug: 'text-area' },
      { label: 'Date Picker', slug: 'date-picker' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { label: 'Skeleton', slug: 'skeleton' },
      { label: 'Spinner', slug: 'spinner' },
      { label: 'Badge', slug: 'badge' },
      { label: 'Toast', slug: 'toast' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Tab Bar', slug: 'tab-bar' },
      { label: 'Tabs', slug: 'tabs' },
    ],
  },
];

/** Documented component count — keep copy in sync with `componentGroups`. */
export const componentCount = componentGroups.reduce(
  (n, group) => n + group.items.length,
  0,
);
