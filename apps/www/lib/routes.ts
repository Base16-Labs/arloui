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
    items: [
      { label: 'Stack', slug: 'stack' },
      { label: 'Group', slug: 'group' },
      { label: 'Card', slug: 'card' },
      { label: 'Sheet', slug: 'sheet' },
      { label: 'Tray', slug: 'tray' },
      { label: 'Scrim', slug: 'scrim' },
      { label: 'SafeArea', slug: 'safearea' },
    ],
  },
  {
    label: 'Type & content',
    items: [
      { label: 'Title', slug: 'title' },
      { label: 'Body', slug: 'body' },
      { label: 'Caption', slug: 'caption' },
      { label: 'Stat', slug: 'stat' },
      { label: 'Note', slug: 'note' },
      { label: 'Eyebrow', slug: 'eyebrow' },
    ],
  },
  {
    label: 'Controls',
    items: [
      { label: 'Button', slug: 'button' },
      { label: 'Pill', slug: 'pill' },
      { label: 'Chip', slug: 'chip' },
      { label: 'Tab', slug: 'tab' },
      { label: 'Toggle', slug: 'toggle' },
      { label: 'Checkbox', slug: 'checkbox' },
      { label: 'Radio', slug: 'radio' },
      { label: 'Stepper', slug: 'stepper' },
      { label: 'Slider', slug: 'slider' },
      { label: 'Input', slug: 'input' },
      { label: 'TextArea', slug: 'text-area' },
      { label: 'Date Picker', slug: 'date-picker' },
      { label: 'Select', slug: 'select' },
      { label: 'Picker', slug: 'picker' },
    ],
  },
  {
    label: 'Lists & rows',
    items: [
      { label: 'List', slug: 'list' },
      { label: 'Row', slug: 'row' },
      { label: 'Divider', slug: 'divider' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { label: 'Toast', slug: 'toast' },
      { label: 'Banner', slug: 'banner' },
      { label: 'Spinner', slug: 'spinner' },
      { label: 'Progress', slug: 'progress' },
      { label: 'Empty', slug: 'empty' },
      { label: 'Loader', slug: 'loader' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Nav', slug: 'nav' },
      { label: 'Header', slug: 'header' },
      { label: 'Breadcrumb', slug: 'breadcrumb' },
    ],
  },
];
