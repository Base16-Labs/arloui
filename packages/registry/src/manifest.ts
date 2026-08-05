/**
 * The single source of truth for what's in the registry.
 *
 * Adding a new component:
 *   1. Drop the source under `src/components/<name>/`.
 *   2. Add an entry below.
 *   3. Run `npm run registry:build` — this regenerates `apps/www/public/r/<name>.json`.
 *   4. Run `npm run skill:sync` — this mirrors metadata into `skills/`.
 *
 * Conventions:
 *   - `target` paths are relative to the consumer's configured alias root
 *     (defaults to `components/ui` like shadcn).
 *   - Tokens and ThemeProvider are foundation entries — they're auto-installed
 *     by `arloui init` and listed as `registryDependencies` of components that need them.
 */
import type { Registry, RegistryEntry } from './schema';

export const FOUNDATION: RegistryEntry[] = [
  {
    name: 'tokens',
    kind: 'foundation',
    title: 'Design tokens',
    description:
      'Color, typography, spacing, radius, motion, shadow, focus ring, blur, and glass material tokens. Single source of truth for the visual system.',
    files: [{ source: 'foundation/tokens.ts', target: 'tokens.ts', type: 'tokens' }],
    meta: { tags: ['foundation', 'tokens'] },
  },
  {
    name: 'theme-provider',
    kind: 'foundation',
    title: 'Theme provider',
    description: 'React context that exposes tokens and follows the system color scheme.',
    registryDependencies: ['tokens'],
    files: [
      { source: 'foundation/theme-provider.tsx', target: 'theme-provider.tsx', type: 'theme' },
    ],
    meta: { tags: ['foundation', 'provider'] },
  },
  {
    name: 'haptics',
    kind: 'foundation',
    title: 'Haptics',
    description:
      'Haptic feedback wrapper that no-ops when expo-haptics is not installed. Pulled in by components that use press feedback.',
    files: [{ source: 'foundation/haptics.ts', target: 'haptics.ts', type: 'utility' }],
    meta: { tags: ['foundation', 'haptics'] },
  },
];

export const COMPONENTS: RegistryEntry[] = [
  {
    name: 'animated-icons',
    kind: 'icon',
    title: 'Animated icons',
    description:
      'Thirty-one stateful SVG icon transitions and feedback animations for common app interactions.',
    dependencies: ['react-native-svg', 'react-native-reanimated'],
    registryDependencies: ['tokens'],
    files: [
      {
        source: 'components/animated-icon/animated-icon.tsx',
        target: 'animated-icon.tsx',
        type: 'component',
      },
    ],
    meta: {
      tags: ['icon', 'motion', 'animated', 'state'],
    },
  },
  {
    name: 'button',
    kind: 'primitive',
    title: 'Button',
    description:
      'Accessible action buttons for primary, secondary, ghost, outline, danger, loading, and icon-only use cases.',
    dependencies: ['expo-haptics', 'react-native-svg'],
    registryDependencies: ['tokens', 'theme-provider', 'haptics'],
    files: [
      { source: 'components/button/button.tsx', target: 'button/button.tsx' },
      { source: 'components/button/ghost-button.tsx', target: 'button/ghost-button.tsx' },
      { source: 'components/button/fab-button.tsx', target: 'button/fab-button.tsx' },
      { source: 'components/button/social-auth-button.tsx', target: 'button/social-auth-button.tsx' },
      { source: 'components/button/press-feedback.tsx', target: 'button/press-feedback.tsx' },
      { source: 'components/button/index.ts', target: 'button/index.ts' },
    ],
    meta: {
      // Figma splits by export, matching this entry's own file split. A single
      // set carrying tone × appearance × size × loading is unusable to design
      // against, so each shape is its own component set.
      figma: [
        { set: 'Buttons/Button', export: 'Button' },
        { set: 'Buttons/Ghost', export: 'GhostButton' },
        { set: 'Buttons/FAB', export: 'FAB' },
        { set: 'Buttons/Social', export: 'SocialAuthButton' },
      ],
      tags: ['action', 'primitive'],
    },
  },
  {
    name: 'card',
    kind: 'primitive',
    title: 'Card',
    description:
      'A flexible surface for grouping related content with header, body, footer, and hierarchy options.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/card/card.tsx', target: 'card/card.tsx' },
      { source: 'components/card/index.ts', target: 'card/index.ts' },
    ],
    meta: {
      figma: [{ set: 'Cards', export: 'Card' }],
      tags: ['surface', 'primitive'],
    },
  },
  {
    name: 'skeleton',
    kind: 'primitive',
    title: 'Skeleton',
    description:
      'A reduced-motion-aware loading placeholder with text, rectangle, and circle geometry plus shimmer, pulse, or static presentation.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/skeleton/skeleton.tsx', target: 'skeleton/skeleton.tsx' },
      { source: 'components/skeleton/index.ts', target: 'skeleton/index.ts' },
    ],
    meta: {
      tags: ['feedback', 'loading', 'placeholder', 'motion', 'primitive'],
    },
  },
  {
    name: 'spinner',
    kind: 'primitive',
    title: 'Spinner',
    description:
      'A reduced-motion-aware activity indicator in five iOS idioms — stepped spokes, a sweeping arc, staggered dots, breathing bars, or radar pulses — at three sizes.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/spinner/spinner.tsx', target: 'spinner/spinner.tsx' },
      { source: 'components/spinner/index.ts', target: 'spinner/index.ts' },
    ],
    meta: {
      tags: ['feedback', 'loading', 'progress', 'motion', 'primitive'],
    },
  },
  {
    name: 'tabs',
    kind: 'primitive',
    title: 'Tabs',
    description:
      'Secondary navigation for categorising content or switching views, with plain, underline, and separate filled appearances plus neutral or accent selection.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/tabs/tabs.tsx', target: 'tabs/tabs.tsx' },
      { source: 'components/tabs/index.ts', target: 'tabs/index.ts' },
    ],
    meta: {
      figma: [{ set: 'Tabs', export: 'Tabs' }],
      tags: ['navigation', 'tabs', 'segmented', 'filter', 'primitive'],
    },
  },
  {
    name: 'sheet',
    kind: 'primitive',
    title: 'Sheet',
    description:
      'A bottom drawer with a grabber, drag-to-dismiss, snap points, tunable motion/gesture, default or stacked width, token-based height and padding, plus composable solid or Liquid-Glass surfaces.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/sheet/sheet.tsx', target: 'sheet/sheet.tsx' },
      { source: 'components/sheet/index.ts', target: 'sheet/index.ts' },
    ],
    meta: {
      // Not drawn in Figma yet.
      tags: ['surface', 'overlay', 'primitive'],
    },
  },
  {
    name: 'field',
    kind: 'primitive',
    title: 'Field',
    description:
      'Composable text-field primitive (Label, Control, Icon, Action, Input, Toolbar, Helper) shared by Input and TextArea.',
    dependencies: ['react-native-svg'],
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/field/field.tsx', target: 'field/field.tsx' },
      { source: 'components/field/index.ts', target: 'field/index.ts' },
    ],
    meta: {
      tags: ['form', 'primitive'],
    },
  },
  {
    name: 'input',
    kind: 'primitive',
    title: 'Input',
    description:
      'A filled text input with labels, helper text, validation, icons, actions, password, and search patterns.',
    registryDependencies: ['tokens', 'theme-provider', 'field'],
    files: [
      { source: 'components/input/input.tsx', target: 'input/input.tsx' },
      { source: 'components/input/index.ts', target: 'input/index.ts' },
    ],
    meta: {
      // Figma splits by variant, not export: Figma cannot express "same
      // component, surface removed" as a prop the way `appearance` does.
      figma: [
        { set: 'Input Field BG STYLE', export: 'Input', props: { appearance: 'filled' } },
        { set: 'Input field NO BG', export: 'Input', props: { appearance: 'plain' } },
      ],
      tags: ['form', 'primitive'],
    },
  },
  {
    name: 'checkbox',
    kind: 'primitive',
    title: 'Checkbox',
    description: 'An animated check box with two sizes, check icon, and disabled state.',
    dependencies: ['react-native-svg'],
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/checkbox/checkbox.tsx', target: 'checkbox/checkbox.tsx' },
      { source: 'components/checkbox/index.ts', target: 'checkbox/index.ts' },
    ],
    meta: {
      // Not drawn in Figma yet.
      tags: ['form', 'primitive'],
    },
  },
  {
    name: 'radio',
    kind: 'primitive',
    title: 'Radio',
    description:
      'An animated radio button with a scaling dot indicator, two sizes, and disabled state.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/radio/radio.tsx', target: 'radio/radio.tsx' },
      { source: 'components/radio/index.ts', target: 'radio/index.ts' },
    ],
    meta: {
      figma: [{ set: 'RadioButton', export: 'Radio' }],
      tags: ['form', 'primitive'],
    },
  },
  {
    name: 'toggle',
    kind: 'primitive',
    title: 'Toggle',
    description:
      'An animated on/off switch with two sizes, disabled state, and smooth thumb transition.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/toggle/toggle.tsx', target: 'toggle/toggle.tsx' },
      { source: 'components/toggle/index.ts', target: 'toggle/index.ts' },
    ],
    meta: {
      // Not drawn in Figma yet.
      tags: ['form', 'primitive'],
    },
  },
  {
    name: 'text-area',
    kind: 'primitive',
    title: 'TextArea',
    description:
      'A multiline text field for comments, notes, bios, support messages, and long-form form content.',
    registryDependencies: ['tokens', 'theme-provider', 'field'],
    files: [
      { source: 'components/text-area/text-area.tsx', target: 'text-area/text-area.tsx' },
      { source: 'components/text-area/index.ts', target: 'text-area/index.ts' },
    ],
    meta: {
      figma: [{ set: 'Text area', export: 'TextArea' }],
      tags: ['form', 'primitive', 'multiline'],
    },
  },
  {
    name: 'tab-bar',
    kind: 'primitive',
    title: 'Tab Bar',
    description:
      'An animated bottom navigation bar with full-width and floating layouts, transparent or filled surfaces, badges, labels, and scroll-aware visibility.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/tab-bar/tab-bar.tsx', target: 'tab-bar/tab-bar.tsx' },
      { source: 'components/tab-bar/index.ts', target: 'tab-bar/index.ts' },
    ],
    meta: {
      tags: ['navigation', 'tabs', 'motion', 'primitive'],
    },
  },
  {
    name: 'carousel',
    kind: 'primitive',
    title: 'Carousel',
    description:
      'A gesture-driven horizontal carousel with item or page snapping, peek, pagination dots, auto-play, and loop support.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/carousel/carousel.tsx', target: 'carousel/carousel.tsx' },
      { source: 'components/carousel/index.ts', target: 'carousel/index.ts' },
    ],
    meta: {
      tags: ['layout', 'scroll', 'gesture', 'motion', 'primitive'],
    },
  },
  {
    name: 'gallery',
    kind: 'primitive',
    title: 'Gallery',
    description:
      'A flexible grid layout with 1–4 columns, optional masonry mode, and token-based gap and corner radius.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/gallery/gallery.tsx', target: 'gallery/gallery.tsx' },
      { source: 'components/gallery/index.ts', target: 'gallery/index.ts' },
    ],
    meta: {
      tags: ['layout', 'grid', 'masonry', 'primitive'],
    },
  },
  {
    name: 'badge',
    kind: 'primitive',
    title: 'Badge',
    description:
      'A non-interactive status label with dot, count, and icon variants across five semantic tones.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/badge/badge.tsx', target: 'badge.tsx' },
      { source: 'components/badge/index.ts', target: 'badge/index.ts' },
    ],
    meta: {
      // Not drawn in Figma yet.
      tags: ['label', 'status', 'primitive'],
    },
  },
  {
    name: 'chip',
    kind: 'primitive',
    title: 'Chip',
    description:
      'An interactive compact element for filters, input tokens, and actions with press feedback and remove affordance.',
    dependencies: ['react-native-svg', 'expo-haptics'],
    registryDependencies: ['tokens', 'theme-provider', 'button'],
    files: [
      { source: 'components/chip/chip.tsx', target: 'chip.tsx' },
      { source: 'components/chip/index.ts', target: 'chip/index.ts' },
    ],
    meta: {
      // Not drawn in Figma yet.
      tags: ['filter', 'tag', 'interactive', 'primitive'],
    },
  },
  {
    name: 'toast',
    kind: 'primitive',
    title: 'Toast',
    description:
      'A transient notification surface with contrast or same-as-background color styles, optional icon and dismiss, swipe-to-dismiss, and auto-dismiss. Mount the Toaster and call useToast() to stack several into a deck.',
    dependencies: ['react-native-svg'],
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/toast/toast.tsx', target: 'toast/toast.tsx' },
      { source: 'components/toast/toaster.tsx', target: 'toast/toaster.tsx' },
      { source: 'components/toast/index.ts', target: 'toast/index.ts' },
    ],
    meta: {
      tags: ['feedback', 'notification', 'overlay', 'primitive'],
    },
  },
  {
    name: 'date-picker',
    kind: 'primitive',
    title: 'Date Picker',
    description:
      'Accessible calendar and wheel surfaces for date, time, date-time, and month-year selection.',
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/date-picker/date-picker.tsx', target: 'date-picker/date-picker.tsx' },
      {
        source: 'components/date-picker/date-wheel-picker.tsx',
        target: 'date-picker/date-wheel-picker.tsx',
      },
      { source: 'components/date-picker/index.ts', target: 'date-picker/index.ts' },
    ],
    meta: {
      // Not drawn in Figma yet. The library's `Calendar` is a Phosphor icon,
      // not a date-picker component set.
      tags: ['form', 'calendar', 'date', 'primitive'],
    },
  },
];

export const REGISTRY: Registry = {
  $schema: 'https://arloui.com/schemas/registry-v1.json',
  version: '0.1.0',
  items: [...FOUNDATION, ...COMPONENTS],
};
