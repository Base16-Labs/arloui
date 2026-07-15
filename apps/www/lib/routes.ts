export const siteLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Roadmap', href: '/roadmap' },
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
    items: [{ label: 'Sheet', slug: 'sheet' }],
  },
  {
    label: 'Controls',
    items: [
      { label: 'Button', slug: 'button' },
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
    items: [{ label: 'Skeleton', slug: 'skeleton' }],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Tab Bar', slug: 'tab-bar' },
      { label: 'Tabs', slug: 'tabs' },
    ],
  },
];
