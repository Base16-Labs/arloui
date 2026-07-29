/**
 * Central source for "Copy markdown" across the docs.
 *
 * Rather than maintaining a separate `.md` file per page (which drifts from the
 * rendered page), every page's markdown is generated here from the same
 * structured data the page renders from. One format, one place —
 * single content source feeding both the page and its markdown.
 *
 * - Data-driven pages (components, primitives) pass their doc object to
 *   `pageMarkdown()`.
 * - Prose pages (foundation essays) register authored markdown in `ESSAYS`.
 */

import { primitiveDocs, type PrimitiveDoc } from './primitive-docs';

const SITE = 'https://arloui.com';

export type DocLink = { label: string; href: string };

export type DocMeta = {
  kind: 'Component' | 'Foundation' | 'Primitive';
  title: string;
  slug: string;
  lede: string;
  category?: string;
  /** Rendered section outline (uses the page's `headings`). */
  sections?: { label: string }[];
  states?: readonly string[];
  tokens?: readonly string[];
  figma?: string;
  source?: string;
  links?: readonly DocLink[];
  /** Optional authored prose appended after the generated metadata. */
  body?: string;
};

function cleanLabel(label: string): string {
  // Strip trailing affordances like " ↗" used in on-page link labels.
  return label.replace(/\s*↗\s*$/, '').trim();
}

/** Serialize a page's structured data into a single markdown document. */
export function pageMarkdown(meta: DocMeta): string {
  const out: string[] = [];

  out.push(`# ${meta.title}`);
  out.push('');
  out.push(`> ${meta.lede}`);

  const facts: string[] = [];
  facts.push(`**Type:** ${meta.kind}`);
  if (meta.category) facts.push(`**Category:** ${meta.category}`);
  if (meta.source) facts.push(`**Source:** ${meta.source}`);
  if (facts.length) {
    out.push('');
    out.push(facts.join('  \n'));
  }

  if (meta.sections?.length) {
    out.push('');
    out.push('## On this page');
    out.push('');
    for (const s of meta.sections) out.push(`- ${s.label}`);
  }

  if (meta.states?.length) {
    out.push('');
    out.push('## States');
    out.push('');
    out.push(meta.states.map((s) => `\`${s}\``).join(' · '));
  }

  if (meta.tokens?.length) {
    out.push('');
    out.push('## Tokens used');
    out.push('');
    for (const t of meta.tokens) out.push(`- \`${t}\``);
  }

  if (meta.body) {
    out.push('');
    out.push(meta.body.trim());
  }

  const links: DocLink[] = [];
  if (meta.figma && meta.figma !== '#') links.push({ label: 'Figma', href: meta.figma });
  if (meta.source) links.push({ label: 'Source', href: meta.source });
  for (const l of meta.links ?? []) {
    const href = cleanLabel(l.href);
    if (
      href &&
      href !== '#' &&
      !href.includes('localhost') &&
      !links.some((x) => x.href === href)
    ) {
      links.push({ label: cleanLabel(l.label), href });
    }
  }
  if (links.length) {
    out.push('');
    out.push('## Links');
    out.push('');
    for (const l of links) out.push(`- [${l.label}](${l.href})`);
  }

  out.push('');
  out.push(`---`);
  out.push(`Source: ${SITE}`);
  out.push('');

  return out.join('\n');
}

/**
 * Adapter for the component/primitive page data objects, which already carry
 * `headings`, `states`, `tokens`, `figma`, `source`, and `actions`.
 */
type PageData = {
  title: string;
  slug: string;
  lede: string;
  category?: string;
  headings?: readonly { label: string }[];
  states?: readonly string[];
  tokens?: readonly string[];
  figma?: string;
  source?: string;
  actions?: readonly DocLink[];
};

export function docDataToMarkdown(
  data: PageData,
  kind: DocMeta['kind'] = 'Component',
  body?: string,
): string {
  return pageMarkdown({
    kind,
    title: data.title,
    slug: data.slug,
    lede: data.lede,
    category: data.category,
    sections: data.headings ? [...data.headings] : undefined,
    states: data.states,
    tokens: data.tokens,
    figma: data.figma,
    source: data.source,
    links: data.actions,
    body,
  });
}

/* ------------------------------------------------------------------ *
 * Prose pages — foundation essays authored directly as markdown.
 * ------------------------------------------------------------------ */

export const ESSAYS: Record<string, string> = {
  fluidity: `# Fluidity

> The user should never feel like they teleported. Movement explains where they came from and where they are going.

**Type:** Foundation · Facet 02

Fluidity is not "more animation." It is the rule that every transition should be explainable as movement through a coherent space. Most apps fail this not because they animate too little, but because they animate without intent — a sheet that drops in from nowhere, a button that flashes for no reason a person could name.

Arlo treats motion as a language with four words and a small grammar.

## The four jobs of motion

Every animation must do at least one of these. If none, remove it.

- **Origin** — show where a thing came from. A popover from its trigger; a sheet from its row.
- **State** — make a change in status legible. \`Continue\` → \`Confirm\`. Loading → loaded.
- **Feedback** — confirm the system heard the user. Press, drag, dismiss.
- **Continuity** — preserve elements that exist on both sides of a transition.

## Sheets are first-class

Sheets are the primary navigation primitive on mobile. Default to a content-sized detent plus a full-screen detent. Never spring straight to full from a row tap — it teleports the user.

The dim of the parent isn't decoration. Drag the sheet down past 35% of its detent, or release with a velocity above 0.11 px/ms, and it commits to dismiss. Boundaries dampen, never hard-stop.

## The ten Fluidity rules

1. Never animate from scale(0). Start at scale(0.94–0.97) with opacity: 0.
2. Pressables respond instantly — scale to 0.97 within 120 ms.
3. Popovers scale from their origin; modals use center.
4. Shared elements stay shared — one view animating, not a duplicate fading in.
5. Text morphs when meaning changes.
6. Direction is information — tabs slide in the direction of travel.
7. No animation on habitual actions.
8. Gestures own velocity (commit ≥ 0.11 px/ms); boundaries dampen.
9. Transitions, not keyframes, for rapid UI.
10. Reduced motion reduces, not removes — replace position and scale with opacity; keep loaders.

---
Related: Motion, Tokens, Sheet
`,
};

/* ------------------------------------------------------------------ *
 * Component page data — the single source for both the rendered page
 * (imported by app/docs/components/[slug]/page.tsx) and its markdown.
 * ------------------------------------------------------------------ */

export const sheetData = {
  slug: 'sheet',
  category: 'Layout & surface',
  title: 'Sheet',
  lede: 'A bottom drawer with a slim grabber, drag-to-dismiss, default or stacked width, three useful heights, and token-based outer padding. Backdrop and surface stay composable, from scrim modal to pass-through Liquid Glass.',
  figma: '#',
  source: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/sheet',
  states: ['open', 'dragging', 'dismissing', 'scrim', 'passthrough', 'long content'],
  tokens: [
    'colors.surfaceElevated',
    'colors.surfaceOverlay',
    'materials.glassMedium',
    'spacing.4',
    'spacing.6',
    'radii.xl',
    'radii.2xl',
    'shadows.xl',
    'motion.easing.easeSheet',
    'motion.duration.base',
    'motion.spring.gentle',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'states', label: 'States' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/sheet',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/sheet' },
  ],
};

export const tabBarData = {
  slug: 'tab-bar',
  category: 'Navigation',
  title: 'Tab Bar',
  lede: "Bottom navigation for switching between an app's primary destinations, with full-width and floating layouts, transparent or filled surfaces, directional selection motion, and scroll-aware visibility.",
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/tab-bar',
  states: ['default', 'selected', 'pressed', 'disabled', 'hidden on scroll'],
  tokens: [
    'colors.navBackground',
    'colors.navBorder',
    'colors.navActive',
    'colors.navInactive',
    'colors.navIndicator',
    'motion.duration.fast',
    'motion.spring.snappy',
    'sizing.touchTarget.minimum',
    'radii.full',
    'shadows.md',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/tab-bar',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/tab-bar' },
  ],
};

export const skeletonData = {
  slug: 'skeleton',
  category: 'Feedback',
  title: 'Skeleton',
  lede: 'A loading placeholder that preserves the geometry of incoming content, with composable text, rectangle, and circle shapes plus restrained shimmer or pulse motion.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/skeleton',
  states: ['shimmer', 'pulse', 'static', 'reduced motion'],
  tokens: [
    'colors.surfaceStrong',
    'radii.md',
    'radii.full',
    'motion.duration.slow',
    'accessibility.reduceMotion',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/skeleton',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/skeleton' },
  ],
};

export const spinnerData = {
  slug: 'spinner',
  category: 'Feedback',
  title: 'Spinner',
  lede: 'An activity indicator for work with no measurable progress, in five iOS idioms — stepped spokes, a sweeping arc, staggered dots, breathing bars, or radar pulses.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/spinner',
  states: ['spokes', 'arc', 'dots', 'bars', 'pulse', 'reduced motion'],
  tokens: [
    'colors.textSecondary',
    'colors.accent',
    'colors.surfaceStrong',
    'accessibility.reduceMotion',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/spinner',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/spinner' },
  ],
};

export const tabsData = {
  slug: 'tabs',
  category: 'Navigation',
  title: 'Tabs',
  lede: 'Secondary navigation for categorising content or switching views within the current screen, with plain, underlined, and separate filled presentations.',
  figma: '#',
  source: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/tabs',
  states: ['default', 'selected', 'pressed', 'disabled', 'overflow'],
  tokens: [
    'colors.textPrimary',
    'colors.textSecondary',
    'colors.accent',
    'colors.surfaceStrong',
    'radii.full',
    'motion.duration.fast',
    'motion.pressed',
    'sizing.touchTarget.minimum',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/tabs',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/tabs' },
  ],
};

export const buttonData = {
  slug: 'button',
  category: 'Controls',
  title: 'Button',
  lede: 'The primary commitment surface on a mobile screen — strong defaults across three tones and four appearances, with press feedback that earns the tap.',
  figma: 'https://figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=266-4982',
  source: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/button',
  states: [
    'default',
    'pressed',
    'loading',
    'disabled',
    'focus',
    'icon-only',
    'reduced motion',
    'RTL',
    'dynamic type',
  ],
  tokens: [
    'colors.interactivePrimary',
    'colors.feedbackError',
    'colors.feedbackErrorBg',
    'colors.feedbackInfoBg',
    'colors.textInteractivePrimary',
    'colors.textInteractiveError',
    'colors.textInteractiveTertiary',
    'colors.textPrimary',
    'colors.textSecondary',
    'colors.textInverse',
    'colors.textTertiary',
    'colors.surfaceInput',
    'colors.interactiveDisabled',
    'colors.interactiveTertiaryPressed',
    'colors.touchFeedbackMain',
    'colors.borderPrimary',
    'colors.borderError',
    'colors.borderSecondary',
    'sizing.buttonHeight.sm',
    'sizing.buttonHeight.md',
    'sizing.buttonHeight.lg',
    'sizing.buttonHeight.xl',
    'sizing.icon.xs',
    'sizing.icon.sm',
    'sizing.icon.md',
    'sizing.touchTarget.minimum',
    'radii.full',
    'focusRing.main',
    'focusRing.error',
    'spacing.3',
    'spacing.4',
    'spacing.5',
    'spacing.6',
    'typography.body',
    'typography.bodySm',
    'typography.title3',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'archetypes', label: 'Archetypes' },
    { id: 'variants', label: 'Variants' },
    { id: 'states', label: 'States' },
    { id: 'motion', label: 'Motion' },
    { id: 'social-auth', label: 'Social auth' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [{ label: 'Edit on GitHub ↗', href: 'https://github.com/Base16-Labs/arloui' }],
} as const;

export const datePickerData = {
  slug: 'date-picker',
  category: 'Controls',
  title: 'Date Picker',
  lede: 'Calendar and wheel surfaces for choosing dates and times. Use the calendar for visual comparison, or the snapping wheel for compact date, time, date-time, and month-year selection.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/date-picker',
  states: ['default', 'selected', 'today', 'disabled', 'weekends disabled'],
  tokens: [
    'colors.surfaceElevated',
    'colors.surfaceInput',
    'colors.interactivePrimary',
    'colors.interactiveSecondaryPressed',
    'colors.textPrimary',
    'colors.textTertiary',
    'colors.borderFocus',
    'colors.borderSecondary',
    'radii.xl',
    'sizing.touchTarget.minimum',
    'typography.bodyMedium',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/date-picker',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/date-picker' },
  ],
} as const;

export const inputData = {
  slug: 'input',
  category: 'Controls',
  title: 'Input',
  lede: 'A token-driven text input for forms, search, passwords, and compact no-background fields. Use filled inputs when the field needs a clear touch surface; use plain inputs when the surrounding layout already provides structure.',
  figma: '#',
  source: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/input',
  states: [
    'empty',
    'filled',
    'focused',
    'helper',
    'error',
    'disabled',
    'password',
    'search',
    'leading icon',
    'trailing action',
    'dark mode',
  ],
  tokens: [
    'surfaceInput',
    'textPrimary',
    'textTertiary',
    'textInteractiveError',
    'borderFocus',
    'borderError',
    'sizing.icon',
    'radii.xl',
    'typography.body',
    'typography.bodySm',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'states', label: 'States' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/input',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/input' },
  ],
} as const;

export const toggleData = {
  slug: 'toggle',
  category: 'Controls',
  title: 'Toggle',
  lede: 'An animated on/off switch for binary settings — smooth thumb slide with track color transition, two sizes, and a disabled state.',
  figma: '#',
  source: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/toggle',
  states: ['off', 'on', 'disabled off', 'disabled on', 'dark mode'],
  tokens: [
    'colors.interactivePrimary',
    'colors.surfaceInput',
    'colors.interactiveDisabled',
    'colors.textTertiary',
    'colors.borderPrimary',
    'colors.borderSecondary',
    'sizing.touchTarget.minimum',
    'motion.duration.fast',
    'motion.easing.easeOut',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'states', label: 'States' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/toggle',
    },
  ],
} as const;

export const checkboxData = {
  slug: 'checkbox',
  category: 'Controls',
  title: 'Checkbox',
  lede: 'An animated check box for multi-select forms — fill transition with an SVG check icon, three sizes, and a disabled state.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/checkbox',
  states: ['unchecked', 'checked', 'disabled unchecked', 'disabled checked', 'dark mode'],
  tokens: [
    'colors.interactivePrimary',
    'colors.interactiveDisabled',
    'colors.textInteractivePrimary',
    'colors.textTertiary',
    'colors.borderPrimary',
    'colors.borderSecondary',
    'radii.sm',
    'radii.md',
    'sizing.touchTarget.minimum',
    'motion.duration.instant',
    'motion.easing.easeOut',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'states', label: 'States' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/checkbox',
    },
  ],
} as const;

export const radioData = {
  slug: 'radio',
  category: 'Controls',
  title: 'Radio',
  lede: 'An animated radio button for single-select groups — two appearances (outlined ring, filled dot), three sizes, and a disabled state.',
  figma: '#',
  source: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/radio',
  states: ['unselected', 'selected', 'disabled unselected', 'disabled selected', 'dark mode'],
  tokens: [
    'colors.interactivePrimary',
    'colors.textTertiary',
    'colors.textSecondary',
    'colors.surfaceBackground',
    'colors.borderPrimary',
    'colors.borderSecondary',
    'sizing.touchTarget.minimum',
    'motion.duration.instant',
    'motion.easing.easeOut',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'states', label: 'States' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/radio',
    },
  ],
} as const;

export const badgeData = {
  slug: "badge",
  category: "Feedback",
  title: "Badge",
  lede:
    "A non-interactive status label — five semantic tones, three appearances, optional dot and leading icon, with a subtle solid inset border for craft. Use it to surface state without demanding a tap.",
  figma: "#",
  source:
    "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/badge",
  states: [
    "label",
    "dot",
    "icon",
    "icon-only",
    "sm",
    "md",
  ],
  tokens: [
    "colors.surfaceInput",
    "colors.textSecondary",
    "colors.textInteractivePrimary",
    "colors.feedbackInfo",
    "colors.feedbackInfoBg",
    "colors.feedbackSuccess",
    "colors.feedbackSuccessBg",
    "colors.feedbackWarning",
    "colors.feedbackWarningBg",
    "colors.feedbackError",
    "colors.feedbackErrorBg",
    "colors.borderPrimary",
    "radii.full",
    "spacing.1",
    "spacing.2",
    "sizing.icon.xs",
  ],
  headings: [
    { id: "anatomy", label: "Anatomy" },
    { id: "when-to-use", label: "When to use" },
    { id: "variants", label: "Variants" },
    { id: "states", label: "States" },
    { id: "code", label: "Code" },
    { id: "tokens", label: "Tokens" },
    { id: "accessibility", label: "Accessibility" },
    { id: "do-dont", label: "Do · Don't" },
    { id: "related", label: "Related" },
  ],
  actions: [
    { label: "View registry source ↗", href: "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/badge" },
    { label: "Open playground ↗", href: "http://localhost:8081/badge" },
  ],
} as const;

export const chipData = {
  slug: "chip",
  category: "Controls",
  title: "Chip",
  lede:
    "An interactive compact element for filtering, tokenised input, and one-tap actions. Three types — filter, input, assist — with press feedback, selection indicators, and icon-only mode.",
  figma: "#",
  source:
    "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chip",
  states: [
    "default",
    "selected",
    "disabled",
    "filter",
    "input",
    "assist",
    "icon-only",
  ],
  tokens: [
    "colors.interactivePrimary",
    "colors.interactiveSecondary",
    "colors.interactiveDisabled",
    "colors.textPrimary",
    "colors.textInverse",
    "colors.textTertiary",
    "colors.textInteractivePrimary",
    "colors.feedbackInfoBg",
    "colors.surfaceInput",
    "colors.borderSecondary",
    "radii.full",
    "radii.lg",
    "spacing.1",
    "spacing.2",
    "spacing.3",
    "sizing.icon.xs",
    "sizing.icon.sm",
    "sizing.touchTarget.minimum",
    "motion.duration.instant",
    "motion.easing.easeOut",
  ],
  headings: [
    { id: "anatomy", label: "Anatomy" },
    { id: "when-to-use", label: "When to use" },
    { id: "variants", label: "Variants" },
    { id: "states", label: "States" },
    { id: "code", label: "Code" },
    { id: "tokens", label: "Tokens" },
    { id: "accessibility", label: "Accessibility" },
    { id: "do-dont", label: "Do · Don't" },
    { id: "related", label: "Related" },
  ],
  actions: [
    { label: "View registry source ↗", href: "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chip" },
    { label: "Open playground ↗", href: "http://localhost:8081/chip" },
  ],
} as const;

export const textAreaData = {
  slug: 'text-area',
  category: 'Controls',
  title: 'TextArea',
  lede: "A multiline field for messages, notes, bios, and support forms. It shares Input's filled and no-background language while keeping longer text top-aligned and easy to scan.",
  figma: 'https://www.figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=875-2658&m=dev',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/text-area',
  states: [
    'empty',
    'filled',
    'focused',
    'helper',
    'error',
    'disabled',
    'leading icon',
    'trailing icon',
    'character count',
    'long content',
    'dark mode',
  ],
  tokens: [
    'surfaceInput',
    'textPrimary',
    'textSecondary',
    'textTertiary',
    'textInteractiveError',
    'borderError',
    'sizing.icon',
    'radii.md',
    'spacing.2',
    'spacing.3',
    'typography.body',
    'typography.bodySm',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'states', label: 'States' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/text-area',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/textarea' },
  ],
} as const;

export const carouselData = {
  slug: 'carousel',
  category: 'Layout & surface',
  title: 'Carousel',
  lede: 'A gesture-driven horizontal carousel for swiping through cards, images, or any content with spring physics, peek, pagination dots, and loop support.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/carousel',
  states: ['default', 'swiping', 'settling', 'auto-play'],
  tokens: [
    'spacing.2',
    'spacing.3',
    'spacing.8',
    'radii.full',
    'colors.accent',
    'colors.borderStrong',
    'motion.spring.gentle',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/carousel',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/carousel' },
  ],
} as const;

export const galleryData = {
  slug: 'gallery',
  category: 'Layout & surface',
  title: 'Gallery',
  lede: 'A flexible grid layout for displaying collections of images, cards, or content with 1–4 columns, optional masonry mode, and token-based gap and corner radius.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/gallery',
  states: ['default', '1-col', '2-col', '3-col', '4-col', 'masonry'],
  tokens: [
    'spacing.2',
    'radii.none',
    'radii.sm',
    'radii.md',
    'radii.lg',
    'radii.xl',
    'radii.2xl',
    'radii.full',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/gallery',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/gallery' },
  ],
} as const;

export const toastData = {
  slug: 'toast',
  category: 'Feedback',
  title: 'Toast',
  lede: 'A transient notification surface that appears from the top or bottom edge. Two color styles — contrast and same — with optional icon, dismiss button, swipe-to-dismiss, and auto-dismiss. Mount the Toaster to stack several into a deck.',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/toast',
  states: ['contrast', 'same', 'with-icon', 'with-dismiss', 'top', 'bottom'],
  tokens: [
    'colors.textPrimary',
    'colors.surfaceBackground',
    'colors.surfaceElevated',
    'shadows.lg',
    'radii.xl',
    'spacing.3',
    'spacing.4',
    'typography.body',
    'motion.spring.snappy',
    'motion.duration.fast',
    'motion.easing.easeOut',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'variants', label: 'Variants' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/toast',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/toast' },
  ],
} as const;

/* ------------------------------------------------------------------ *
 * Path → markdown registry. One lookup powers every "Copy markdown"
 * surface — the per-page buttons and the global pill.
 * ------------------------------------------------------------------ */

/** Serialize a primitive (foundation) doc into markdown. */
function primitiveMarkdown(doc: PrimitiveDoc): string {
  const out: string[] = [`# ${doc.title}`, '', `> ${doc.lede}`, '', '**Type:** Primitive'];

  if (doc.intro?.length) {
    out.push('', '## Overview', '');
    for (const i of doc.intro) out.push(`- ${i}`);
  }
  if (doc.rules?.length) {
    out.push('', '## Rules', '');
    for (const r of doc.rules) out.push(`- ${r}`);
  }
  if (doc.specs?.length) {
    out.push('', '## Specs', '');
    for (const s of doc.specs) {
      out.push(`- \`${s.name}\` — ${s.value}${s.note ? ` · ${s.note}` : ''}`);
    }
  }
  if (doc.snippet) {
    out.push('', '## Code', '', '```ts', doc.snippet.trim(), '```');
  }
  if (doc.related?.length) {
    out.push('', '## Related', '', doc.related.join(' · '));
  }
  out.push('', '---', `Source: ${SITE}`, '');
  return out.join('\n');
}

const PAGE_MARKDOWN: Record<string, string> = {
  '/docs/foundations/fluidity': ESSAYS.fluidity,
  '/docs/components/sheet': docDataToMarkdown(sheetData),
  '/docs/components/date-picker': docDataToMarkdown(datePickerData),
  '/docs/components/tab-bar': docDataToMarkdown(tabBarData),
  '/docs/components/skeleton': docDataToMarkdown(skeletonData),
  '/docs/components/spinner': docDataToMarkdown(spinnerData),
  '/docs/components/tabs': docDataToMarkdown(tabsData),
  '/docs/components/button': docDataToMarkdown(buttonData),
  '/docs/components/input': docDataToMarkdown(inputData),
  '/docs/components/toggle': docDataToMarkdown(toggleData),
  '/docs/components/checkbox': docDataToMarkdown(checkboxData),
  '/docs/components/radio': docDataToMarkdown(radioData),
  '/docs/components/text-area': docDataToMarkdown(textAreaData),
  '/docs/components/carousel': docDataToMarkdown(carouselData),
  '/docs/components/gallery': docDataToMarkdown(galleryData),
  '/docs/components/badge': docDataToMarkdown(badgeData),
  '/docs/components/chip': docDataToMarkdown(chipData),
  '/docs/components/toast': docDataToMarkdown(toastData),
  // Every primitives (foundation) page — Tokens, Type, Color, Spacing, Motion, Effects, Icons.
  ...Object.fromEntries(
    Object.entries(primitiveDocs).map(([slug, doc]) => [
      `/docs/primitives/${slug}`,
      primitiveMarkdown(doc),
    ]),
  ),
};

/** Resolve the markdown for a docs pathname, or null if the page has none yet. */
export function markdownForPath(pathname: string): string | null {
  const key = pathname.replace(/\/+$/, '');
  return PAGE_MARKDOWN[key] ?? null;
}
