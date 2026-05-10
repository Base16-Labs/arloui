export const siteLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Showcase", href: "/showcase" },
  { label: "Roadmap", href: "/roadmap" },
] as const;

export const docsSections = [
  { label: "Getting started", href: "/docs/getting-started" },
  { label: "Foundations", href: "/docs/foundations" },
  { label: "Primitives", href: "/docs/primitives" },
  { label: "Components", href: "/docs/components" },
  { label: "Archetypes", href: "/docs/archetypes" },
  { label: "Agents", href: "/docs/agents" },
  { label: "Changelog", href: "/docs/changelog" },
] as const;

export type ComponentGroup = {
  label: string;
  items: { label: string; slug: string }[];
};

export const componentGroups: ComponentGroup[] = [
  {
    label: "Layout & surface",
    items: [
      { label: "Stack", slug: "stack" },
      { label: "Group", slug: "group" },
      { label: "Card", slug: "card" },
      { label: "Sheet", slug: "sheet" },
      { label: "Tray", slug: "tray" },
      { label: "Scrim", slug: "scrim" },
      { label: "SafeArea", slug: "safearea" },
    ],
  },
  {
    label: "Type & content",
    items: [
      { label: "Title", slug: "title" },
      { label: "Body", slug: "body" },
      { label: "Caption", slug: "caption" },
      { label: "Stat", slug: "stat" },
      { label: "Note", slug: "note" },
      { label: "Eyebrow", slug: "eyebrow" },
    ],
  },
  {
    label: "Controls",
    items: [
      { label: "Button", slug: "button" },
      { label: "Pill", slug: "pill" },
      { label: "Chip", slug: "chip" },
      { label: "Tab", slug: "tab" },
      { label: "Toggle", slug: "toggle" },
      { label: "Stepper", slug: "stepper" },
      { label: "Slider", slug: "slider" },
      { label: "Field", slug: "field" },
      { label: "Select", slug: "select" },
      { label: "Picker", slug: "picker" },
    ],
  },
  {
    label: "Lists & rows",
    items: [
      { label: "List", slug: "list" },
      { label: "Row", slug: "row" },
      { label: "Divider", slug: "divider" },
    ],
  },
  {
    label: "Feedback",
    items: [
      { label: "Toast", slug: "toast" },
      { label: "Banner", slug: "banner" },
      { label: "Spinner", slug: "spinner" },
      { label: "Progress", slug: "progress" },
      { label: "Empty", slug: "empty" },
      { label: "Loader", slug: "loader" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { label: "Nav", slug: "nav" },
      { label: "Header", slug: "header" },
      { label: "Breadcrumb", slug: "breadcrumb" },
    ],
  },
];
