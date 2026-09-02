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

import { CHART_PROPS, CHART_PROPS_MD } from './generated/chart-props';
import { chartChoices, chartForms, chartPitfalls } from './chart-forms';
import { primitiveDocs, type PrimitiveDoc } from './primitive-docs';
import { archetypeDescriptions, archetypeItems } from './routes';

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

/** A body's own top-level headings, in the order it emits them. */
function tocOf(body: string): { label: string }[] {
  return [...body.matchAll(/^## (.+)$/gm)].map((match) => ({ label: match[1]!.trim() }));
}

/** The choosing table and the pitfalls, from the same data the page renders. */
function chartWhenToUseMarkdown(): string {
  const rows = chartChoices.map((choice) => `| ${choice.question} | ${choice.form} |`);
  const bullets = chartPitfalls.map((item) => `- **${item.rule}** ${item.body}`);
  return [
    'Start from the question the reader is asking, then check the exceptions below —',
    `they are the ${['zero', 'one', 'two', 'three', 'four', 'five', 'six'][chartPitfalls.length] ?? chartPitfalls.length} calls people get wrong.`,
    '',
    '| The reader asks | Reach for |',
    '| --- | --- |',
    ...rows,
    '',
    ...bullets,
  ].join('\n');
}

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
    /*
     * Derived from the body, not from `headings`.
     *
     * `headings` drives the rendered page's right rail, and a page and its
     * markdown do not carry the same sections — the page has an interactive
     * Anatomy and a Do · Don't the markdown has no way to express. One list
     * serving both meant the markdown promised sections it never emitted, and
     * trimming it to suit the markdown left the page's rail pointing at
     * anchors that were not there. Each document now lists itself.
     */
    sections: body ? tocOf(body) : data.headings ? [...data.headings] : undefined,
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
  lede: 'A bottom drawer with a slim grabber, drag-to-dismiss, optional snap points, tunable motion and gesture, default or stacked width, and token-based outer padding. Backdrop and surface stay composable, from scrim modal to pass-through Liquid Glass.',
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
    { id: 'props', label: 'Props' },
    { id: 'customization', label: 'Customization' },
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
    { id: 'props', label: 'Props' },
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

export const cardData = {
  slug: 'card',
  category: 'Layout & surface',
  title: 'Card',
  lede: 'A surface that groups related content, with two independent axes — tone for how far it lifts off the page, surface for what it is made of — plus four presets for the shapes that recur: stat, list, media, and action.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/card',
  states: ['default', 'raised', 'floating', 'glass', 'pressable', 'padding', 'margin', 'radius'],
  tokens: [
    'colors.surface',
    'colors.surfaceRaised',
    'colors.border',
    'colors.borderSecondary',
    'radii.none … radii.full',
    'spacing.2 … spacing.8',
    'shadows.md',
    'materials.glassLarge',
    'motion.pressed.scale',
  ],
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'presets', label: 'Presets' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'code', label: 'Code' },
    { id: 'props', label: 'Props' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/card',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/cards' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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
    { id: 'props', label: 'Props' },
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

/**
 * Archetype pages render as sections of a single index route, but agents ask for
 * them one at a time (`arlo_get_archetype`), so each gets its own markdown doc.
 */
function archetypeMarkdown(slug: string, label: string, index: number): string {
  return [
    `# ${label}`,
    '',
    `> ${archetypeDescriptions[slug]}`,
    '',
    '**Type:** Archetype',
    `**Position:** ${String(index + 1).padStart(2, '0')} of ${archetypeItems.length}`,
    '',
    '## Overview',
    '',
    'Archetypes are compositional patterns, not components — each describes how',
    'primitives, tokens, and motion wire together to make one shape of screen.',
    '',
    '## Related',
    '',
    archetypeItems
      .filter((a) => a.slug !== slug)
      .map((a) => a.label)
      .join(' · '),
    '',
    '---',
    `Source: ${SITE}/docs/archetypes#${slug}`,
    '',
  ].join('\n');
}

/** The prose half of the Chart page — see `chartData.headings`. */
const CHART_BODY = `## Forms

Six, all reached through the \`Chart\` namespace. Pick by the question the reader
is asking, not by the shape you want.

| Form | Answers | Reach for it when |
| --- | --- | --- |
| Line chart (\`Chart\`) | "How has this moved?" | One series over time, scrubbable, with a big readout above it. The money screen. |
| \`Chart.Sparkline\` | "Which way is this going?" | An inline mark in a list row or a stat card. No axes, no scrub, often no labels. |
| \`Chart.Bar\` | "How do these compare?" | Categories side by side — grouped, stacked, or as ranked horizontal rows. |
| \`Chart.Donut\` | "What is this made of?" | Parts of one whole. Four named slices, then everything else folds into \`Other\`. |
| \`Chart.Meter\` | "How close am I?" | One value against a target, as a bar, a ring, or an arc gauge. |
| \`Chart.Heatmap\` | "Did I show up?" | A month of days as filled and empty squares. Streaks and consistency. |

\`Chart.Plot\`, \`Chart.Value\`, \`Chart.Delta\`, \`Chart.Periods\`, \`Chart.Legend\`, and
\`Chart.Empty\` compose inside a \`Chart\` root, which owns the data and the scrub
state. The other five are standalone and take their own \`data\`.

## When to use

__CHART_WHEN__

## Reading the three axes

Every form answers the same three props, so learning them once is enough.

**\`tone\` — what the number means.** Not what colour to use. Up is not always
good: savings rising is welcome, spending rising is not, and only you know
which. \`auto\` infers direction, \`positive\`/\`negative\` assert it, \`brand\` is
magnitude with no direction to report, \`series\` spends the categorical palette,
\`neutral\` is context for something else.

**\`density\` — how much mark there is.** \`compact\` thins strokes, shrinks dots and
rings, tightens rows. It is for fitting a chart into a table row or a card
without hand-tuning six numbers at each call site.

**\`chrome\` — the furniture around the data.** \`none\` is the mark alone.
\`baseline\` adds the zero rule, drawn only when the data actually crosses zero.
\`reference\` adds one labelled dashed line at a value you name — a budget, an
average. There is no \`axis\` member and there will not be one.

## Install

Take the namespace, or take one form:

\`\`\`bash
# every form, reached through the Chart namespace
npx arloui add chart

# or one, which brings the shared core and nothing else
npx arloui add chart-bar
npx arloui add chart-sparkline
\`\`\`

A single form gives you the component itself (\`BarChart\`, \`Sparkline\`, and so
on) plus \`chart-core\` — the scale, the tones and densities, the legend, the
empty slot, and the loading skeleton. Seven files for a sparkline, ten for a bar
chart, against nineteen for the kit — and no \`expo-haptics\` unless the form you
took responds to touch.

### Which import

\`Chart.Bar\` and \`BarChart\` are the same component. The namespace is assembled
in \`chart/index.ts\`, and a single form doesn't bring that barrel — so reach for
the form's own export instead:

\`\`\`tsx
// npx arloui add chart
import { Chart } from '@/components/ui/chart';
<Chart.Bar data={spend} />

// npx arloui add chart-bar — same component, no barrel to reach it through
import { BarChart } from '@/components/ui/chart/bar-chart';
<BarChart data={spend} />
\`\`\`

| Entry | File | Export | Through the namespace |
| --- | --- | --- | --- |
| \`chart-plot\` | \`chart/chart\` | \`Chart\` | \`Chart\`, \`Chart.Plot\`, \`Chart.Value\`, \`Chart.Delta\`, \`Chart.Periods\` |
| \`chart-bar\` | \`chart/bar-chart\` | \`BarChart\` | \`Chart.Bar\` |
| \`chart-sparkline\` | \`chart/sparkline\` | \`Sparkline\` | \`Chart.Sparkline\` |
| \`chart-donut\` | \`chart/donut-chart\` | \`DonutChart\` | \`Chart.Donut\` |
| \`chart-meter\` | \`chart/meter\` | \`Meter\` | \`Chart.Meter\` |
| \`chart-heatmap\` | \`chart/heatmap\` | \`Heatmap\` | \`Chart.Heatmap\` |

Paths follow your \`aliases.components\` — \`components/ui\` by default. The props
are identical either way, so every example below reads the same once the import
is swapped.

Every entry reads the same whether you took it alone or through \`chart\`. The
plot's namespace is assembled in \`chart/chart\` itself, not in the barrel, so a
standalone \`chart-plot\` gives you the same \`<Chart>\` the examples use — the
barrel only adds the other five forms to that same object.

## Two ways to call every form

**Pass no children and you get the form's default composition** — the sensible
chart, in one line:

\`\`\`tsx
<Chart data={points} format={money} periods={['1D', '1W', '1M']} period={p} onPeriodChange={setP} />
\`\`\`

**Name any child and you get exactly what you named** — nothing else is drawn:

\`\`\`tsx
<Chart data={points} format={money}>
  <Chart.Value />
  <Chart.Periods />
  <Chart.Plot height={200} fill>
    <Chart.Reference value={1000} label="Target" />
  </Chart.Plot>
</Chart>
\`\`\`

That inversion is the whole rule. There is no third way and no mixing: presence
lives in the tree, so no form takes a \`showValues\`, a \`showLegend\`, or a
\`chrome\` prop to decide what exists. For the bare mark — no zero rule, no
labels — pass \`{null}\`, which says "I named nothing" rather than "give me the
defaults".

**Where a part goes** follows the same split: the root's children are
information — \`Title\`, \`Value\`, \`Delta\`, \`Periods\`, \`Legend\`, \`Empty\` —
and the plot's children are what is drawn inside the box — \`Line\`, \`Bars\`,
\`Baseline\`, \`Reference\`, \`Crosshair\`.

\`Crosshair\` is the scrub: name it and the plot answers a touch and draws the
rule and dot that follow it; leave it out and the plot is a picture. There is no
\`scrubbable\` prop, because a plot that tracks a finger and draws nothing is not
a thing anyone wants.

On naming: \`Value\` is the one big readout, \`Values\` is a number on every mark,
and the category names are \`Categories\` rather than \`Labels\` — \`Label\` and
\`Labels\` meaning different things one letter apart was a trap.

The rule is presence against behaviour. A prop answering *does this element
exist?* belongs in the tree; one answering *how does the whole chart behave?* —
\`variant\`, \`layout\`, \`density\`, \`tone\`, \`spacing\` — stays a prop.

| Form | Parts |
| --- | --- |
| \`Chart.Bar\` | \`Series\` \`Values\` \`Categories\` \`Baseline\` \`Reference\` \`Legend\` |
| \`Chart.Donut\` | \`Value\` \`Label\` \`Legend\` |
| \`Chart.Meter\` | \`Value\` \`Label\` \`Ring\` |
| \`Chart.Sparkline\` | \`Fill\` \`EndDot\` \`Extremes\` |
| \`Chart.Heatmap\` | \`DayLabels\` \`Scale\` |

One thing this replaced outright: series and their names used to be two
index-coupled arrays, \`series\` beside \`legend\`, where \`legend[1]\` named
\`series[0]\` because \`data\` was series zero. A \`Series\` carries its own label.
The meter's \`rings\` array went the same way.

## Code

A scrubbable series with a readout and a period selector:

\`\`\`tsx
<Chart data={points} format={money} periods={['1D', '1W', '1M']} period={period} onPeriodChange={setPeriod}>
  <Chart.Value />
  <Chart.Delta />
  <Chart.Plot fill curve="smooth" />
  <Chart.Periods />
</Chart>
\`\`\`

An inline mark in a list row — compact by default, tinted by direction:

\`\`\`tsx
<Chart.Sparkline data={prices} width={80} />
\`\`\`

Categories, ranked as rows rather than bars:

\`\`\`tsx
<Chart.Bar data={spend} layout="horizontal" format={money}>
  <Chart.Bar.Categories />
</Chart.Bar>
\`\`\`

Two series stacked, with a legend:

\`\`\`tsx
<Chart.Bar variant="stacked">
  <Chart.Bar.Series data={sleep} label="Sleep" />
  <Chart.Bar.Series data={activity} label="Activity" />
  <Chart.Bar.Categories />
  <Chart.Bar.Legend />
</Chart.Bar>
\`\`\`

One value against a target, as a gauge:

\`\`\`tsx
<Chart.Meter shape="arc" value={712} max={850} warnAt={0.75} dangerAt={0.85}>
  <Chart.Meter.Value />
  <Chart.Meter.Label>Credit score</Chart.Meter.Label>
</Chart.Meter>
\`\`\`

Every form that can be empty takes the same slot, and it replaces the chart
rather than sitting inside it. A meter is exempt — an empty meter is a zero —
and a heatmap only counts as empty with no data *and* no date range, because a
grid of empty squares is usually the data rather than the absence of it:

\`\`\`tsx
<Chart.Bar
  data={[]}
  empty={{
    title: 'No spending yet',
    description: 'Categories will appear here once you log a transaction.',
    action: { label: 'Log a transaction', onPress: open },
  }}
/>
\`\`\`

A second quantity that shares the x-axis but wants a different shape — volume
behind price, rainfall behind temperature:

\`\`\`tsx
<Chart data={price} format={money}>
  <Chart.Value />
  <Chart.Plot>
    <Chart.Bars data={volume} />
  </Chart.Plot>
</Chart>
\`\`\`

\`Chart.Line\` is the same idea for a second, third, nth line — each with its own
colour and name, all on the one scale:

\`\`\`tsx
<Chart data={actual} format={money}>
  <Chart.Plot>
    <Chart.Line data={forecast} label="Forecast" dashed />
    <Chart.Line data={budget} label="Budget" />
  </Chart.Plot>
</Chart>
\`\`\`

The marks are measured into the plot's own domain, so they agree about
what a height means — bars on a scale of their own would sit at plausible but
wrong heights, and nothing about the picture would say so. Scrubbing stays with
the root: one gesture for the plot, however many marks are in it.

### Linking two charts

\`activeIndex\` is an index into one chart's own series, so two charts sharing it
line up only if their points do. \`activeAt\` is resolved against each chart's own
\`at\` values instead, so linked charts agree about *when*:

\`\`\`tsx
const [at, setAt] = useState<ChartPoint['at']>(undefined);

<Chart data={price}  activeAt={at} onScrub={(_, p) => setAt(p?.at)}>…</Chart>
<Chart data={volume} activeAt={at} onScrub={(_, p) => setAt(p?.at)}>…</Chart>
\`\`\`

Each chart still owns its own gesture, so this is a synchronised crosshair —
scrub either, both follow — rather than one drag travelling between them.

## Props

Every prop each form accepts, read out of the source at build time — so this
cannot drift from the types. Presence is not here: what the chart *draws* is
named in the tree (see above), and these are the props that say how it behaves.

__CHART_PROPS__

## Accessibility

- A chart with no \`onSelect\` or \`onScrub\` is **one image** to a screen reader,
  labelled with a summary of the series. It does not become forty-two tappable
  squares unless you asked for selection.
- Readouts never show a figure the chart does not have. While \`loading\`, the
  value, the delta and the period pills are skeletons — a \`$0.00\` placeholder is
  indistinguishable from a real zero balance.
- Reduce Motion pins sweeps, morphs and counters to their final values, and
  stops the loading sheen. Scrubbing is unaffected: it is direct manipulation,
  tracked one to one, and has no duration to remove.
- Status colour never travels alone. A meter past \`warnAt\` or \`dangerAt\` always
  ships its value alongside the colour change.

## Not in the kit

Candlestick, radar, population pyramid, scatter, matrix heatmaps, and 3-D
anything. They are consumer-owned on purpose.

\`core.ts\` is exported for exactly this: \`makeScale\`, \`linePath\`, \`areaPath\`,
\`bandPath\`, \`barPath\`, \`annulusPath\`, \`arcPath\`, and the tone and density
helpers. A seventh form written against them measures the same way these do, so
a crosshair lands on the line rather than near it.`;

export const chartData = {
  slug: 'chart',
  category: 'Data',
  title: 'Chart',
  lede: 'Six chart forms sharing one validated palette, all reached through the Chart namespace: a scrubbable single-series line, an inline sparkline, categorical bars (grouped, stacked, or horizontal), a part-to-whole donut, a meter against a target, and a calendar heatmap.',
  figma: '#',
  source:
    'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chart',
  states: [
    'scrub',
    'rising',
    'falling',
    'neutral',
    'stacked',
    'gauge',
    'concentric rings',
    'loading',
    'empty',
    'not enough data',
    'reduced motion',
  ],
  tokens: [
    'colors.chartPositive',
    'colors.chartNegative',
    'colors.chartSeries1',
    'colors.chartSeries2',
    'colors.chartSeries3',
    'colors.chartSeries4',
    'colors.chartOther',
    'colors.interactivePrimary',
    'colors.textPrimary',
    'colors.textSecondary',
    'colors.textTertiary',
    'colors.surfaceElevated',
    'colors.surfaceInput',
    'colors.borderSecondary',
    'colors.feedbackWarning',
    'colors.feedbackError',
    'radii.md',
    'radii.full',
    'motion.chart.data',
    'motion.chart.barSwap',
    'motion.duration.slow',
  ],
  /*
   * These name what the page actually emits, in the order it emits it.
   *
   * The list used to promise ten sections — Anatomy, Do · Don't, and the rest —
   * against a page that rendered four, because nothing passed a body to the
   * generator. A table of contents pointing at content that does not exist is
   * worse than a short page: a reader counts six forms in the lede, goes looking
   * for the section that names them, and finds the page has ended.
   */
  headings: [
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'forms', label: 'Forms' },
    { id: 'when-to-use', label: 'When to use' },
    { id: 'code', label: 'Code' },
    { id: 'axes', label: 'Two axes' },
    { id: 'props', label: 'Props' },
    { id: 'tokens', label: 'Tokens used' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'do-dont', label: "Do · Don't" },
    { id: 'not-in-the-kit', label: 'Not in the kit' },
    { id: 'related', label: 'Related' },
  ],
  actions: [
    {
      label: 'View registry source ↗',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/chart',
    },
    { label: 'Open playground ↗', href: 'http://localhost:8081/chart' },
  ],
};

const PAGE_MARKDOWN: Record<string, string> = {
  '/docs/foundations/fluidity': ESSAYS.fluidity,
  ...Object.fromEntries(
    archetypeItems.map((item, i) => [
      `/docs/archetypes/${item.slug}`,
      archetypeMarkdown(item.slug, item.label, i),
    ]),
  ),
  '/docs/components/sheet': docDataToMarkdown(sheetData),
  '/docs/components/date-picker': docDataToMarkdown(datePickerData),
  '/docs/components/tab-bar': docDataToMarkdown(tabBarData),
  '/docs/components/skeleton': docDataToMarkdown(skeletonData),
  '/docs/components/spinner': docDataToMarkdown(spinnerData),
  '/docs/components/tabs': docDataToMarkdown(tabsData),
  '/docs/components/button': docDataToMarkdown(buttonData),
  '/docs/components/card': docDataToMarkdown(cardData),
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
  '/docs/components/chart': docDataToMarkdown(
    chartData,
    'Component',
    CHART_BODY.replace('__CHART_PROPS__', CHART_PROPS_MD).replace(
      '__CHART_WHEN__',
      chartWhenToUseMarkdown(),
    ),
  ),
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

/**
 * Every path that has markdown, for the build step that emits `public/md`.
 *
 * The site runs on Cloudflare Workers, where there is no request-time
 * filesystem, so markdown cannot be read from disk on demand — it is written to
 * static assets at build time and served from there.
 */

/**
 * A chart form's page, as markdown.
 *
 * Built from the same data the rendered page uses, so the two cannot say
 * different things — the prose from `chart-forms`, the reference from the
 * generated tables.
 */
function chartFormMarkdown(form: (typeof chartForms)[number]): string {
  const reference = CHART_PROPS.find((section) => section.title === form.referenceKey);
  const props = reference?.props ?? [];
  const parts = reference?.parts ?? [];
  const pipe = (text: string) => text.replace(/\|/g, '\\|');

  const out: string[] = [
    `# ${form.title}`,
    '',
    `\`${form.referenceKey}\``,
    '',
    form.lede,
    '',
    `Answers ${form.answers}`,
    '',
    '## When to use',
    '',
    ...form.whenToUse.map((line) => `- ${line}`),
    '',
    '## Install',
    '',
    '```bash',
    `npx arloui add ${form.entry}`,
    '```',
    '',
    'A single form does not bring the `Chart` barrel, so import the component itself:',
    '',
    '```tsx',
    `import { ${form.exportName} } from '@/components/ui/${form.file}';`,
    '```',
    '',
    '## Code',
    '',
  ];

  for (const example of form.examples) {
    out.push(example.caption, '', '```tsx', example.code, '```', '');
  }

  if (props.length > 0) {
    out.push('## Props', '', '| Prop | Type | Default | What it does |', '| --- | --- | --- | --- |');
    for (const prop of props) {
      const name = prop.required ? `\`${prop.name}\` **·** required` : `\`${prop.name}\``;
      out.push(
        `| ${name} | \`${pipe(prop.type)}\` | ${prop.default ? `\`${pipe(prop.default)}\`` : '—'} | ${pipe(prop.description) || '—'} |`,
      );
    }
    out.push('');
  }

  if (parts.length > 0) {
    out.push(
      '## Parts',
      '',
      'Name one and it is drawn; name none and you get the default composition.',
      '',
      '| Part | Takes | What it draws |',
      '| --- | --- | --- |',
    );
    for (const part of parts) {
      const takes =
        part.props.length > 0
          ? part.props.map((prop) => `\`${prop.name}: ${pipe(prop.type)}\``).join(' ')
          : '—';
      out.push(`| \`<${part.name} />\` | ${takes} | ${pipe(part.description) || '—'} |`);
    }
    out.push('');
  }

  out.push('## What it will not do', '', form.notThis, '', '## Related', '', '- [Chart overview](/docs/components/chart)');
  return out.join('\n');
}

export function allMarkdownPages(): { path: string; markdown: string }[] {
  return [
    ...Object.entries(PAGE_MARKDOWN).map(([path, markdown]) => ({ path, markdown })),
    ...chartForms.map((form) => ({
      path: `/docs/components/${form.slug}`,
      markdown: chartFormMarkdown(form),
    })),
  ].sort((a, b) => a.path.localeCompare(b.path));
}
