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
    dependencies: ['@arloui/utils', 'expo-haptics', 'react-native-svg'],
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/button/button.tsx', target: 'button.tsx' },
      { source: 'components/button/ghost-button.tsx', target: 'ghost-button.tsx' },
      { source: 'components/button/fab-button.tsx', target: 'fab-button.tsx' },
      { source: 'components/button/social-auth-button.tsx', target: 'social-auth-button.tsx' },
      { source: 'components/button/press-feedback.tsx', target: 'press-feedback.tsx' },
      { source: 'components/button/index.ts', target: 'button/index.ts' },
    ],
    meta: {
      figma: 'Components/Button/Primary',
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
      { source: 'components/card/card.tsx', target: 'card.tsx' },
      { source: 'components/card/index.ts', target: 'card/index.ts' },
    ],
    meta: {
      figma: 'Components/Card/Default',
      tags: ['surface', 'primitive'],
    },
  },
  {
    name: 'input',
    kind: 'primitive',
    title: 'Input',
    description:
      'A filled text input with labels, helper text, validation, icons, actions, password, and search patterns.',
    dependencies: ['react-native-svg'],
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/input/field.tsx', target: 'field.tsx' },
      { source: 'components/input/input.tsx', target: 'input.tsx' },
      { source: 'components/input/index.ts', target: 'input/index.ts' },
    ],
    meta: {
      figma: 'Components/Text Input/Default',
      tags: ['form', 'primitive'],
    },
  },
  {
    name: 'checkbox',
    kind: 'primitive',
    title: 'Checkbox',
    description:
      'An animated check box with two sizes, check icon, and disabled state.',
    dependencies: ['react-native-svg'],
    registryDependencies: ['tokens', 'theme-provider'],
    files: [
      { source: 'components/checkbox/checkbox.tsx', target: 'checkbox.tsx' },
      { source: 'components/checkbox/index.ts', target: 'checkbox/index.ts' },
    ],
    meta: {
      figma: 'Components/Checkbox/Default',
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
      { source: 'components/radio/radio.tsx', target: 'radio.tsx' },
      { source: 'components/radio/index.ts', target: 'radio/index.ts' },
    ],
    meta: {
      figma: 'Components/Radio/Default',
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
      { source: 'components/toggle/toggle.tsx', target: 'toggle.tsx' },
      { source: 'components/toggle/index.ts', target: 'toggle/index.ts' },
    ],
    meta: {
      figma: 'Components/Toggle/Default',
      tags: ['form', 'primitive'],
    },
  },
];

export const REGISTRY: Registry = {
  $schema: 'https://arloui.dev/schemas/registry-v1.json',
  version: '0.1.0',
  items: [...FOUNDATION, ...COMPONENTS],
};
