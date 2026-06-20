import { notFound, redirect } from 'next/navigation';
import type { ComponentProps } from 'react';
import { TailwindAlphaRamp, TailwindPaletteGrid } from '@/components/docs/tailwind-palette';
import { ContrastChecker } from '@/components/docs/contrast-checker';
import { EffectsDoc } from '@/components/docs/effects-doc';
import { SpacingTool } from '@/components/docs/spacing-tool';
import { TypographyDoc } from '@/components/docs/typography-doc';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CopyButton } from '@/components/ui/CopyButton';
import { Icon } from '@/components/ui/Icon';
import { IconLibrary } from '@/components/icons/icon-library';
import {
  alphaRamp,
  darkSemanticColors,
  lightSemanticColors,
  mainScales,
  paletteBase,
  paletteSecondary,
} from '@/lib/color-tokens';
import { getAnimatedIconSource, getIconNames } from '@/lib/icon-assets';
import { primitiveItems } from '@/lib/routes';

type IconName = ComponentProps<typeof Icon>['name'];

type PrimitiveDoc = {
  title: string;
  lede: string;
  intro: string[];
  rules: string[];
  specs: { name: string; value: string; note: string }[];
  snippet: string;
  related: string[];
};

const primitiveDocs: Record<string, PrimitiveDoc> = {
  tokens: {
    title: 'Tokens',
    lede: 'The registry source template for colors, type, spacing, radii, sizing, motion, shadows, and focus rings.',
    intro: [
      'The consumer-owned copy lives at <alias>/tokens.ts after arloui init.',
      'The registry source is dependency-free so it works in Expo and bare React Native projects.',
      'Components read from themes.light and themes.dark through the foundation theme provider.',
    ],
    rules: [
      'Edit tokens.ts in the consuming app when a product needs brand changes.',
      'Keep semantic color names stable so copied components continue to compile.',
      'Use raw palette values to define semantic roles, not directly inside components.',
    ],
    specs: [
      {
        name: 'radius.sm',
        value: '4',
        note: 'Inputs, small controls, menu rows',
      },
      {
        name: 'radius.md',
        value: '8',
        note: 'Buttons, repeated cards, compact surfaces',
      },
      {
        name: 'motion.duration.press',
        value: '140ms',
        note: 'Hover, focus, and pressed feedback',
      },
      {
        name: 'motion.pressed.scale',
        value: '0.98',
        note: 'Default pressed transform',
      },
      {
        name: 'spacing.4',
        value: '16',
        note: 'Common horizontal gutter',
      },
      {
        name: 'sizing.buttonHeight.md',
        value: '40',
        note: 'Default button height',
      },
      {
        name: 'shadowBaseColor',
        value: '#101828',
        note: 'Grey-900 tint used by shadows',
      },
      {
        name: 'duration.state',
        value: '200ms',
        note: 'State changes that need to be noticed',
      },
    ],
    snippet: `export const themes = {
  light: {
    colors: lightColors,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    focusRing: focusRing.light,
  },
};`,
    related: ['Color', 'Spacing', 'Motion'],
  },
  type: {
    title: 'Typography',
    lede: 'A Manrope type system for display, headings, body copy, labels, and button text across Arlo UI.',
    intro: [
      'The Figma foundation uses Manrope for every interface role.',
      'Normal styles use 400 weight; emphasized and button styles use 600.',
      'The registry exposes explicit display, heading, body, label, and button tokens from tokens.ts.',
    ],
    rules: [
      'Use display styles for prominent screen-level content.',
      'Use heading styles to establish hierarchy inside screens and components.',
      'Use body, label, and button roles according to their intended interface context.',
    ],
    specs: [
      { name: 'fontFamilies.sans', value: 'Manrope', note: 'All interface typography' },
      { name: 'displayLarge', value: '34 / 125% / -2%', note: 'Normal and emphasized' },
      { name: 'displayMedium', value: '28 / 125% / -2%', note: 'Normal and emphasized' },
      { name: 'displaySmall', value: '24 / 125% / -2%', note: 'Normal and emphasized' },
      { name: 'headingLarge', value: '20 / 130% / -1%', note: 'Normal and emphasized' },
      { name: 'headingMedium', value: '17 / 130% / -1%', note: 'Normal and emphasized' },
      { name: 'headingSmall', value: '14 / 130% / -1%', note: 'Normal and emphasized' },
      { name: 'bodyLarge', value: '17 / 140% / 0%', note: 'Long-form and supporting copy' },
      { name: 'bodyMedium', value: '14 / 140% / 0%', note: 'Default body copy' },
      { name: 'bodySmall', value: '12 / 140% / 0%', note: 'Compact supporting copy' },
      { name: 'labelLarge', value: '14 / 120% / 0%', note: 'Large interface label' },
      { name: 'labelMedium', value: '12 / 120% / 0%', note: 'Default interface label' },
      { name: 'labelSmall', value: '11 / 120% / 0%', note: 'Compact metadata' },
      { name: 'buttonLarge', value: '20 / 110% / 0%', note: 'Large action label' },
      { name: 'buttonMedium', value: '17 / 110% / 0%', note: 'Medium action label' },
      { name: 'buttonSmall', value: '14 / 110% / 0%', note: 'Small action label' },
      { name: 'buttonLabel', value: '12 / 110% / 0%', note: 'Compact button label' },
    ],
    snippet: `const styles = {
  heading: {
    ...theme.typography.headingLargeEmphasized,
    fontFamily: theme.fontFamilies.sans,
    color: theme.colors.textPrimary,
  },
};`,
    related: ['Spacing', 'Tokens', 'Color'],
  },
  color: {
    title: 'Color',
    lede: 'Main palette, secondary palette, and utility semantic colors. Components should use semantic roles, not raw palette values.',
    intro: [
      'Main palette contains Base, Grey, Primary, Success, Warning, and Error scales.',
      'Secondary palette contains extended Tailwind-aligned hue scales and alpha ramps.',
      'Utility semantic colors map those palettes into component-facing light and dark theme roles.',
    ],
    rules: [
      'Use paletteMain and paletteSecondary as source material for theme roles.',
      'Use lightSemanticColors and darkSemanticColors inside components through theme.colors.',
      'Keep raw brand changes in tokens.ts so copied registry components inherit them automatically.',
    ],
    specs: [
      { name: 'paletteMain.grey.950', value: '#09090B', note: 'Dark background' },
      { name: 'paletteMain.primary.600', value: '#155DFC', note: 'Light interactive primary' },
      { name: 'paletteMain.error.500', value: '#FB2C36', note: 'Error fill and border' },
      { name: 'paletteSecondary.zinc.200', value: '#E4E4E7', note: 'Neutral UI utility' },
      { name: 'alphaRamp.black.40', value: 'rgba(16,24,40,0.4)', note: 'Light overlay' },
      { name: 'lightSemanticColors.surfaceInput', value: '#F3F4F6', note: 'Input surface' },
      { name: 'darkSemanticColors.surfaceInput', value: '#1E2939', note: 'Dark input surface' },
      { name: 'lightSemanticColors.interactivePrimary', value: '#155DFC', note: 'Primary action' },
    ],
    snippet: `import { useTheme } from "@/foundation/theme-provider";

const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.surfaceInput }}>
  <Text style={{ color: theme.colors.textPrimary }}>
    Label
  </Text>
</View>`,
    related: ['Tokens', 'Typography', 'Icons'],
  },
  spacing: {
    title: 'Spacing',
    lede: 'A memorable base-4 scale for visual rhythm, component sizing, and accessible touch ergonomics.',
    intro: [
      'ArloUI uses a base-4 spacing scale where spacing[4] equals 16 px.',
      'Keys are the suffix of the Figma token name, so space-4 maps to spacing[4].',
      'Sizing tokens keep components, icons, avatars, and containers consistent without magic numbers.',
      'A control may look smaller than 44 pt while hitSlop expands its interactive area.',
    ],
    rules: [
      'Use spacing[4] to spacing[5] for common horizontal gutters.',
      'Use spacing[1] and spacing[2] for icon, label, and compact control gaps.',
      'Use sizing tokens for fixed component dimensions such as buttons and icons.',
      'Give every interactive element at least a 44 × 44 pt touch target; prefer 48 × 48 pt for comfortable primary actions.',
      'Keep enough separation between adjacent touch targets to prevent accidental activation.',
    ],
    specs: [
      { name: 'spacing.0', value: '0', note: 'No gap' },
      { name: 'spacing.1', value: '4', note: 'Small icon gap' },
      { name: 'spacing.2', value: '8', note: 'Control inner gap' },
      { name: 'spacing.4', value: '16', note: 'Common gutter' },
      { name: 'spacing.6', value: '24', note: 'Section rhythm' },
      { name: 'spacing.24', value: '96', note: 'Large screen spacing' },
      { name: 'sizing.icon.md', value: '24', note: 'Default icon size' },
      { name: 'sizing.buttonHeight.md', value: '40', note: 'Default visual button height' },
      { name: 'sizing.touchTarget.minimum', value: '44', note: 'Minimum interactive area' },
      { name: 'sizing.touchTarget.comfortable', value: '48', note: 'Preferred primary-action area' },
    ],
    snippet: `const touchInset =
  (theme.sizing.touchTarget.minimum - theme.sizing.buttonHeight.md) / 2;

<View style={{
  paddingHorizontal: theme.spacing[4],
  gap: theme.spacing[2],
}}>
  <Text>Label</Text>
  <Pressable hitSlop={touchInset}>
    <View style={{ height: theme.sizing.buttonHeight.md }}>
      <Text>Action</Text>
    </View>
  </Pressable>
</View>`,
    related: ['Typography', 'Tokens', 'Motion'],
  },
  effects: {
    title: 'Effects',
    lede: 'Shadow, elevation, blur, and translucent-surface presets for functional depth without visual noise.',
    intro: [
      'Elevation communicates which surfaces are interactive, floating, or modal.',
      'Blur preserves context behind navigation, sheets, and overlays while separating the active layer.',
      'Liquid Glass is progressive enhancement: supported iOS experiences can use a native treatment while every other platform receives blur, tint, and a subtle border.',
      'Material presets are starting points for polish, not a requirement to add depth to every surface.',
    ],
    rules: [
      'Use glass only for functional layers such as navigation bars, tab bars, sidebars, sheets, and key controls.',
      'Do not use translucent materials as general content backgrounds or repeated card decoration.',
      'Pair glass surfaces with high-contrast, vibrant semantic label and icon colors.',
      'Test over light, dark, photographic, and scrolling content before shipping.',
      'Test on real devices and older hardware; reduce blur strength or use the overlay-only fallback if scrolling or gestures become janky.',
    ],
    specs: [
      { name: 'shadows.sm', value: '0 / 2 / 6%', note: 'Floating controls and subtle lift' },
      { name: 'shadows.md', value: '1 / 6 / 8%', note: 'Menus and compact overlays' },
      { name: 'shadows.lg', value: '2 / 12 / 10%', note: 'Sheets and elevated navigation' },
      { name: 'shadows.xl', value: '4 / 28 / 12%', note: 'Modal surfaces only' },
      { name: 'blur.sm', value: '8', note: 'Thin navigation material' },
      { name: 'blur.md', value: '16', note: 'Compact overlays' },
      { name: 'blur.lg', value: '24', note: 'Default glass surface' },
      { name: 'blur.xl', value: '40', note: 'Dense modal material' },
      { name: 'materials.glassRegular', value: '24 + overlay', note: 'Cross-platform glass fallback' },
    ],
    snippet: `import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

const scheme = useColorScheme() ?? 'light';
const material = theme.materials.glassRegular;
const overlay =
  scheme === 'dark' ? material.darkOverlay : material.lightOverlay;
const border =
  scheme === 'dark' ? material.darkBorder : material.lightBorder;

const styles = StyleSheet.create({
  material: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: theme.radii.xl,
  },
});

<View style={[styles.material, { borderColor: border }]}>
  <BlurView
    intensity={material.blur}
    tint={scheme}
    style={StyleSheet.absoluteFill}
  />
  <View
    pointerEvents="none"
    style={[
      StyleSheet.absoluteFill,
      { backgroundColor: Platform.OS === 'ios' ? 'transparent' : overlay },
    ]}
  />
  <NavigationContent />
</View>`,
    related: ['Color', 'Spacing', 'Motion'],
  },
  motion: {
    title: 'Motion',
    lede: 'Registry motion tokens for press feedback, state transitions, sheet movement, easing, and restrained springs.',
    intro: [
      'Default easing is easeOut, with easeInOut available for balanced state changes.',
      'Springs are reserved for gesture-driven elements and should stay restrained.',
      'Pressed feedback combines scale and opacity so touch response feels immediate.',
    ],
    rules: [
      'Use duration.press for tap acknowledgement.',
      'Use duration.state for selected, loading, and visibility states.',
      'Avoid transition-all patterns and never animate from scale(0).',
    ],
    specs: [
      { name: 'duration.press', value: '140', note: 'Tap acknowledgement' },
      { name: 'duration.state', value: '200', note: 'State transition' },
      { name: 'duration.sheet', value: '280', note: 'Sheet movement' },
      { name: 'easing.easeOut', value: '0.16, 1, 0.3, 1', note: 'Default cubic bezier' },
      { name: 'spring.soft', value: '180 / 22 / 0.9', note: 'Stiffness, damping, mass' },
      { name: 'spring.snappy', value: '260 / 24 / 0.9', note: 'Gesture-driven response' },
      { name: 'pressed.scale', value: '0.98', note: 'Pressed transform' },
      { name: 'pressed.opacity', value: '0.92', note: 'Pressed opacity' },
    ],
    snippet: `<Pressable style={({ pressed }) => ({
  opacity: pressed ? theme.motion.pressed.opacity : 1,
  transform: [
    { scale: pressed ? theme.motion.pressed.scale : 1 },
  ],
})}>
  <Text>Button</Text>
</Pressable>`,
    related: ['Spacing', 'Tokens', 'Color'],
  },
  icons: {
    title: 'Icons',
    lede: 'A filled icon language for navigation, actions, empty states, and controls, exposed as React Native SVG components.',
    intro: [
      'Icons should help recognition, not decorate the layout.',
      'Use a consistent 24 px view box and size down visually inside compact controls.',
      'Icon-only controls need a clear accessible label in app code.',
    ],
    rules: [
      'Use icons in buttons when they make the action faster to recognize.',
      'Keep navigation icons visually equal even when the paths have different density.',
      'Prefer familiar symbols for search, copy, close, theme, and scan actions.',
    ],
    specs: [
      { name: 'viewBox', value: '24', note: 'Shared icon grid' },
      { name: 'control', value: '16-20', note: 'Inside buttons and inputs' },
      { name: 'nav', value: '18-24', note: 'Navigation and tab rows' },
      { name: 'color', value: 'currentColor', note: 'Inherit from text role' },
    ],
    snippet: `import { Icon } from "@/components/ui/Icon";

<Icon name="magnifying-glass" size={18} />`,
    related: ['Color', 'Tokens', 'Motion'],
  },
};

const slugs: readonly string[] = primitiveItems.map((i) => i.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function PrimitivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'materials') redirect('/docs/primitives/effects');
  if (!slugs.includes(slug)) notFound();

  const doc = primitiveDocs[slug];
  if (!doc) notFound();

  if (slug === 'icons') {
    const [names, animatedSource] = await Promise.all([getIconNames(), getAnimatedIconSource()]);
    return <IconLibrary names={names} animatedSource={animatedSource} />;
  }

  if (slug === 'type') return <TypographyPage />;
  if (slug === 'effects') return <EffectsPage />;
  if (slug === 'color') return <ColorPage />;
  if (slug === 'spacing') return <SpacingPage />;

  const headings = [
    { id: 'preview', label: 'Preview' },
    { id: 'usage', label: 'Usage' },
    { id: 'specs', label: 'Specs' },
    { id: 'code', label: 'Code' },
    { id: 'related', label: 'Related' },
  ];

  return (
    <>
      <main className="relative max-w-[860px] flex-1 px-8 pt-10 pb-20 sm:px-14">
        <div className="absolute top-10 right-8 hidden sm:block">
          <CopyButton text={doc.snippet} label="Copy snippet" />
        </div>

        <Eyebrow>Foundations</Eyebrow>
        <h1 className="mt-3.5 text-[44px] font-medium leading-none tracking-tight sm:text-[56px]">
          {doc.title}
        </h1>
        <Lede>{doc.lede}</Lede>

        <Section id="preview" title="Preview">
          <PrimitivePreview slug={slug} />
        </Section>

        <Section id="usage" title="Usage">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
                Purpose
              </div>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-2">
                {doc.intro.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-4">
              <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
                Rules
              </div>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-2">
                {doc.rules.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          {slug === 'effects' ? (
            <a
              href="https://developer.apple.com/design/human-interface-guidelines/materials"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3 text-[13px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              <span>Apple Human Interface Guidelines: Materials</span>
              <span aria-hidden="true">Open</span>
            </a>
          ) : null}
        </Section>

        <Section id="specs" title="Specs">
          <div className="overflow-hidden rounded-lg border border-line">
            {doc.specs.map((spec) => (
              <div
                key={spec.name}
                className="grid gap-2 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.7fr)_minmax(140px,0.7fr)_minmax(0,1fr)] sm:gap-4"
              >
                <div className="min-w-0 break-words font-mono text-[11.5px] leading-relaxed text-ink">
                  {spec.name}
                </div>
                <div className="min-w-0 break-words font-mono text-[11.5px] leading-relaxed text-ink-2">
                  {spec.value}
                </div>
                <div className="text-[13px] leading-relaxed text-ink-3">{spec.note}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="code" title="Code">
          <CodeBlock language={slug === 'icons' ? 'tsx' : 'ts'}>{doc.snippet}</CodeBlock>
        </Section>

        <Section id="related" title="Related">
          <div className="flex flex-wrap gap-2">
            {doc.related.map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={headings} actions={[]} />
    </>
  );
}

function TypographyPage() {
  const headings = [
    { id: 'font-configuration', label: 'Font configuration' },
    { id: 'type-scale', label: 'Type scale' },
    { id: 'weight-system', label: 'Weight system' },
    { id: 'button-typography', label: 'Button typography' },
    { id: 'specimen', label: 'Type specimen' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens used' },
    { id: 'rules', label: 'Rules' },
    { id: 'do-dont', label: 'Do · Don’t' },
    { id: 'related', label: 'Related' },
  ];
  const actions = [
    {
      label: 'Figma',
      href: 'https://figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=74-4376',
    },
    {
      label: 'Source',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/tokens/src/typography.ts',
    },
  ];

  return (
    <>
      <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20 sm:px-14">
        <Eyebrow>Foundations</Eyebrow>
        <h1 className="mt-3.5 text-[44px] font-medium leading-none tracking-tight sm:text-[56px]">
          Typography
        </h1>
        <Lede>
          A scale, not a font. Swap your typeface in one line — the sizes, rhythm, and hierarchy
          stay.
        </Lede>

        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              {action.label}
            </a>
          ))}
        </div>

        <TypographyDoc />

        <section id="related" className="scroll-mt-10 pt-12">
          <h2 className="text-[24px] font-medium leading-tight text-ink">Related</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Tokens', 'Color', 'Spacing'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <RightRail headings={headings} actions={actions} />
    </>
  );
}

function EffectsPage() {
  const headings = [
    { id: 'shadows', label: 'Shadows' },
    { id: 'focus-rings', label: 'Focus rings' },
    { id: 'blur-levels', label: 'Blur levels' },
    { id: 'liquid-glass', label: 'Liquid Glass' },
    { id: 'dark-mode', label: 'Dark mode' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens used' },
    { id: 'rules', label: 'Rules' },
    { id: 'do-dont', label: 'Do · Don’t' },
    { id: 'related', label: 'Related' },
  ];
  const actions = [
    {
      label: 'Figma',
      href: 'https://figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=238-2275',
    },
    {
      label: 'Source',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/tokens/src/effects.ts',
    },
  ];

  return (
    <>
      <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20 sm:px-14">
        <Eyebrow>Foundations</Eyebrow>
        <h1 className="mt-3.5 text-[44px] font-medium leading-none tracking-tight sm:text-[56px]">
          Effects
        </h1>
        <Lede>
          Depth comes from layering and spacing first, not shadows. When you do reach for
          elevation, use the lightest option that works.
        </Lede>

        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              {action.label}
            </a>
          ))}
        </div>

        <EffectsDoc />

        <section id="related" className="scroll-mt-10 pt-12">
          <h2 className="text-[24px] font-medium leading-tight text-ink">Related</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Color', 'Spacing', 'Motion'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <RightRail headings={headings} actions={actions} />
    </>
  );
}

const spacingScale = [
  [0, 0],
  [1, 4],
  [2, 8],
  [3, 12],
  [4, 16],
  [5, 20],
  [6, 24],
  [8, 32],
  [10, 40],
  [12, 48],
  [14, 56],
  [16, 64],
  [20, 80],
  [24, 96],
] as const;

const spacingHeuristics = [
  {
    range: '4–8px',
    gap: 6,
    meaning: 'Belongs together',
    examples: 'Icon + label, value + unit, chip internals',
  },
  {
    range: '12–16px',
    gap: 14,
    meaning: 'Same group, siblings',
    examples: 'List items, form field rows, default gutters',
  },
  {
    range: '20–24px',
    gap: 22,
    meaning: 'New group',
    examples: 'Section within a card, roomy rows',
  },
  {
    range: '32–48px',
    gap: 40,
    meaning: 'Major blocks',
    examples: 'Card to card, content sections',
  },
  {
    range: '56–96px',
    gap: 72,
    meaning: 'New context',
    examples: 'Hero → body, page-level breaks',
  },
] as const;

const radiusScale = [
  ['none', 0, 'Sharp corners'],
  ['sm', 4, 'Tags, inline code'],
  ['md', 8, 'Inputs, search'],
  ['lg', 12, 'Cards, code blocks'],
  ['xl', 16, 'Preview cards, modals'],
  ['2xl', 24, 'Sheets, large panels'],
  ['full', 9999, 'Pills, buttons, avatars'],
] as const;

const iconSizes = [
  ['xs', 16],
  ['sm', 20],
  ['md', 24],
  ['lg', 32],
] as const;

const avatarSizes = [
  ['xs', 16],
  ['sm', 24],
  ['md', 32],
  ['lg', 40],
] as const;

const buttonHeights = [
  ['sm', 36],
  ['md', 40],
  ['lg', 48],
  ['xl', 52],
] as const;

const spacingCode = `import { spacing } from '@arloui/tokens';

<View style={{ gap: spacing[4], padding: spacing[5] }}>
  <Card />
  <Card />
</View>`;

const radiusCode = `import { radii } from '@arloui/tokens';

<View style={{ borderRadius: radii.lg, overflow: 'hidden' }}>
  <CardContent />
</View>`;

const sizingCode = `import { sizing } from '@arloui/tokens';

<Icon size={sizing.icon.md} name="settings" />
<Avatar size={sizing.avatar.lg} source={user.avatar} />`;

function SpacingScaleTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="hidden border-b border-line bg-canvas px-4 py-2.5 sm:grid sm:grid-cols-[120px_64px_72px_1fr] sm:gap-4">
        {['Token', 'Px', 'Rem', 'Visual'].map((heading) => (
          <div key={heading} className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
            {heading}
          </div>
        ))}
      </div>
      {spacingScale.map(([key, value]) => (
        <div
          key={key}
          className="grid gap-2 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[120px_64px_72px_1fr] sm:items-center sm:gap-4"
        >
          <code className="font-mono text-[12px] text-ink">spacing.{key}</code>
          <div className="font-mono text-[11.5px] text-ink-2">{value}px</div>
          <div className="font-mono text-[11.5px] text-ink-2">
            {value === 0 ? '0' : `${value / 16}rem`}
          </div>
          <div className="h-2.5 rounded-full bg-ink" style={{ width: value }} />
        </div>
      ))}
    </div>
  );
}

function SpacingHeuristics() {
  return (
    <div className="space-y-3">
      {spacingHeuristics.map((item) => (
        <div
          key={item.range}
          className="grid gap-4 rounded-lg border border-line bg-surface p-4 sm:grid-cols-[210px_1fr] sm:items-center"
        >
          <div>
            <div className="font-mono text-[12px] text-ink">{item.range}</div>
            <div className="mt-1 text-[13px] font-medium text-ink">{item.meaning}</div>
            <div className="mt-1 text-[12px] leading-relaxed text-ink-3">{item.examples}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md bg-canvas p-3" style={{ gap: item.gap }}>
              <div className="h-10 w-16 rounded-md bg-ink/15" />
              <div className="h-10 w-16 rounded-md bg-ink/15" />
            </div>
            <span className="font-mono text-[10.5px] text-ink-3">{item.gap}px</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RadiusScale() {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="hidden border-b border-line bg-canvas px-4 py-2.5 sm:grid sm:grid-cols-[120px_64px_64px_1fr] sm:gap-4">
        {['Token', 'Px', 'Shape', 'Use'].map((heading) => (
          <div key={heading} className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
            {heading}
          </div>
        ))}
      </div>
      {radiusScale.map(([key, value, use]) => (
        <div
          key={key}
          className="grid gap-2 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[120px_64px_64px_1fr] sm:items-center sm:gap-4"
        >
          <code className="font-mono text-[12px] text-ink">radii.{key}</code>
          <div className="font-mono text-[11.5px] text-ink-2">{value === 9999 ? 'pill' : `${value}px`}</div>
          <div
            className="size-10 border border-line-strong bg-canvas"
            style={{ borderRadius: value === 9999 ? 9999 : value }}
          />
          <div className="text-[13px] text-ink-3">{use}</div>
        </div>
      ))}
    </div>
  );
}

function SizingBlock({
  title,
  pathPrefix,
  children,
}: {
  title: string;
  pathPrefix: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[13px] font-medium text-ink">{title}</div>
        <code className="font-mono text-[10.5px] text-ink-3">{pathPrefix}</code>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ComponentSizing() {
  return (
    <div className="space-y-3">
      <SizingBlock title="Icons" pathPrefix="sizing.icon">
        <div className="flex flex-wrap items-end gap-6">
          {iconSizes.map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="flex h-8 items-end justify-center text-ink">
                <Icon name="magnifying-glass" size={value} />
              </div>
              <div className="mt-2 font-mono text-[10.5px] text-ink-3">
                {key} · {value}
              </div>
            </div>
          ))}
        </div>
      </SizingBlock>

      <SizingBlock title="Avatars" pathPrefix="sizing.avatar">
        <div className="flex flex-wrap items-end gap-6">
          {avatarSizes.map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="flex h-10 items-end justify-center">
                <div className="rounded-full bg-ink/15" style={{ width: value, height: value }} />
              </div>
              <div className="mt-2 font-mono text-[10.5px] text-ink-3">
                {key} · {value}
              </div>
            </div>
          ))}
        </div>
      </SizingBlock>

      <SizingBlock title="Button heights" pathPrefix="sizing.buttonHeight">
        <div className="flex flex-wrap items-end gap-4">
          {buttonHeights.map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="flex items-center justify-center rounded-full bg-[#155DFC] px-5 text-[13px] font-medium text-white"
                style={{ height: value }}
              >
                Button
              </div>
              <div className="mt-2 font-mono text-[10.5px] text-ink-3">
                {key} · {value}
              </div>
            </div>
          ))}
        </div>
      </SizingBlock>
    </div>
  );
}

function SpacingPage() {
  const headings = [
    { id: 'scale', label: 'Spacing scale' },
    { id: 'heuristics', label: 'Semantic heuristics' },
    { id: 'radius', label: 'Radius scale' },
    { id: 'sizing', label: 'Component sizing' },
    { id: 'tool', label: 'Spacing tool' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens used' },
    { id: 'rules', label: 'Rules' },
    { id: 'do-dont', label: 'Do · Don’t' },
    { id: 'related', label: 'Related' },
  ];
  const actions = [
    {
      label: 'Figma',
      href: 'https://figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=226-1271',
    },
    {
      label: 'Source',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/tokens/src/spacing.ts',
    },
  ];
  const tokenPaths = [
    ...spacingScale.map(([key]) => `spacing.${key}`),
    ...radiusScale.map(([key]) => `radii.${key}`),
    ...iconSizes.map(([key]) => `sizing.icon.${key}`),
    ...avatarSizes.map(([key]) => `sizing.avatar.${key}`),
    ...buttonHeights.map(([key]) => `sizing.buttonHeight.${key}`),
    'sizing.touchTarget.minimum',
    'sizing.touchTarget.comfortable',
  ];

  return (
    <>
      <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20 sm:px-14">
        <Eyebrow>Foundations</Eyebrow>
        <h1 className="mt-3.5 text-[44px] font-medium leading-none tracking-tight sm:text-[56px]">
          Spacing
        </h1>
        <Lede>
          Spacing is the primary tool for showing relationships. If you’re reaching for a divider,
          the surrounding spacing is probably wrong.
        </Lede>

        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              {action.label}
            </a>
          ))}
        </div>

        <Section id="scale" title="Spacing scale">
          <SpacingScaleTable />
        </Section>

        <Section id="heuristics" title="Semantic heuristics">
          <SpacingHeuristics />
        </Section>

        <Section id="radius" title="Radius scale">
          <RadiusScale />
        </Section>

        <Section id="sizing" title="Component sizing">
          <ComponentSizing />
        </Section>

        <Section id="tool" title="Spacing tool">
          <SpacingTool />
        </Section>

        <Section id="code" title="Code">
          <div className="space-y-3">
            <CodeBlock>{spacingCode}</CodeBlock>
            <CodeBlock>{radiusCode}</CodeBlock>
            <CodeBlock>{sizingCode}</CodeBlock>
          </div>
        </Section>

        <Section id="tokens" title="Tokens used">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {tokenPaths.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="rules" title="Rules">
          <div className="grid gap-3 sm:grid-cols-2">
            <PrimitiveRuleCard
              title="Spacing, not dividers"
              text="Show relationships with space. If you’re reaching for a divider between two already-spaced groups, increase the spacing instead."
            />
            <PrimitiveRuleCard
              title="Stay on the grid"
              text="Use scale tokens only. Arbitrary values like 13px or 27px break the 4px rhythm."
            />
            <PrimitiveRuleCard
              title="Hit targets"
              text="Every interactive element needs a 44×44pt minimum touch area. Expand small visuals with hitSlop."
            />
            <PrimitiveRuleCard
              title="Vertical rhythm"
              text="Group with 4–8px, separate siblings with 12–16px, and break contexts at 32px and up."
            />
          </div>
        </Section>

        <Section id="do-dont" title="Do · Don’t">
          <div className="space-y-3">
            <PrimitiveDoDont
              doText="Use spacing to group related elements — 4–8px between icon and label, 24–32px between groups."
              dontText="Add a divider line between groups that are already separated by spacing."
            />
            <PrimitiveDoDont
              doText="Use the spacing scale tokens. The 4px grid keeps everything aligned."
              dontText="Use arbitrary values like 13px or 27px. They break the grid."
            />
            <PrimitiveDoDont
              doText="Use radii.full for buttons and pills to match the platform’s rounded-corner language."
              dontText="Use radii.md (8px) for everything. Different surfaces earn different radii."
            />
            <PrimitiveDoDont
              doText="Ensure a 44×44pt minimum hit area on every interactive element; use hitSlop for small visuals."
              dontText="Rely on the visual size for touch targets. A 24px icon needs invisible padding to reach 44px."
            />
          </div>
        </Section>

        <section id="related" className="scroll-mt-10 pt-12">
          <h2 className="text-[24px] font-medium leading-tight text-ink">Related</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Tokens', 'Typography', 'Color'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <RightRail headings={headings} actions={actions} />
    </>
  );
}

const colorThemeCode = `import { useTheme } from '@/foundation/theme-provider';

function MyCard() {
  const { theme } = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.surfaceElevated }}>
      <Text style={{ color: theme.colors.textPrimary }}>Hello</Text>
      <Text style={{ color: theme.colors.textSecondary }}>Description</Text>
    </View>
  );
}`;

const colorModeCode = `// Semantic colors resolve per mode — no light/dark branching
const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.surfaceBackground }}>
  <View
    style={{
      backgroundColor: theme.colors.feedbackSuccessBg,
      borderColor: theme.colors.feedbackSuccess,
    }}
  >
    <Text style={{ color: theme.colors.feedbackSuccess }}>Payment sent</Text>
  </View>
</View>`;

const colorPaletteCode = `import { paletteMain } from '@arloui/tokens';

// Raw palette is for data visualization only
const chartColors = [
  paletteMain.primary[500],
  paletteMain.success[500],
  paletteMain.warning[500],
];`;

function ColorThreeLayer() {
  const layers = [
    {
      name: 'Palette',
      detail: 'Raw values — Grey-50, Primary-600, Error-500.',
      example: 'paletteMain.primary[600]',
    },
    {
      name: 'Semantic',
      detail: 'Roles that resolve per mode across light and dark.',
      example: 'colors.interactivePrimary',
    },
    {
      name: 'Component',
      detail: 'Reads semantic roles only, never raw palette.',
      example: 'theme.colors.interactivePrimary',
    },
  ];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {layers.map((layer, index) => (
          <div key={layer.name} className="rounded-lg border border-line bg-surface p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Layer {index + 1}
            </div>
            <div className="mt-2 text-[15px] font-medium text-ink">{layer.name}</div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{layer.detail}</div>
            <code className="mt-3 block font-mono text-[10.5px] text-ink-3">{layer.example}</code>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
        Components never read palette values directly. Semantic tokens resolve per mode, so the same
        role returns the right value in light and dark.
      </p>
    </>
  );
}

function PrimitiveRuleCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="text-[13px] font-medium text-ink">{title}</div>
      <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{text}</div>
    </div>
  );
}

function PrimitiveDoDont({ doText, dontText }: { doText: string; dontText: string }) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-2">
      <div className="bg-[#DDFBE8] p-4 dark:bg-emerald-500/10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#166534] dark:text-emerald-300">
          Do
        </div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{doText}</div>
      </div>
      <div className="border-t border-line bg-[#FFE4E6] p-4 sm:border-t-0 sm:border-l dark:bg-rose-500/10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9F1D1D] dark:text-rose-300">
          Don’t
        </div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{dontText}</div>
      </div>
    </div>
  );
}

function ColorPage() {
  const headings = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'semantic-tokens', label: 'Semantic tokens' },
    { id: 'main-palette', label: 'Main palette' },
    { id: 'secondary-palette', label: 'Secondary palette' },
    { id: 'alpha-ramps', label: 'Alpha ramps' },
    { id: 'contrast', label: 'Contrast checker' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens used' },
    { id: 'rules', label: 'Rules' },
    { id: 'do-dont', label: 'Do · Don’t' },
    { id: 'related', label: 'Related' },
  ];
  const actions = [
    {
      label: 'Figma',
      href: 'https://figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=16-2033',
    },
    {
      label: 'Source',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/tokens/src/colors.ts',
    },
  ];
  const tokenPaths = [
    ...utilitySemanticPalette.flatMap((group) =>
      group.rows.map((row) => `theme.colors.${row.semanticKey}`),
    ),
    'paletteMain.grey',
    'paletteMain.primary',
    'paletteMain.success',
    'paletteMain.warning',
    'paletteMain.error',
    'paletteSecondary',
    'alphaRamp.white',
    'alphaRamp.black',
  ];

  return (
    <>
      <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20 sm:px-14">
        <Eyebrow>Foundations</Eyebrow>
        <h1 className="mt-3.5 text-[44px] font-medium leading-none tracking-tight sm:text-[56px]">
          Color
        </h1>
        <Lede>One accent per screen. Neutral grey carries the chrome. The accent is an event.</Lede>

        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              {action.label}
            </a>
          ))}
        </div>

        <Section id="architecture" title="Three-layer architecture">
          <ColorThreeLayer />
        </Section>

        <Section id="semantic-tokens" title="Semantic tokens">
          <SemanticTokenTable />
        </Section>

        <Section id="main-palette" title="Main palette">
          <MainPalette />
        </Section>

        <Section id="secondary-palette" title="Secondary palette">
          <SecondaryPalette />
        </Section>

        <Section id="alpha-ramps" title="Alpha ramps">
          <AlphaRamps />
        </Section>

        <Section id="contrast" title="Contrast checker">
          <ContrastChecker />
        </Section>

        <Section id="code" title="Code">
          <div className="space-y-3">
            <CodeBlock>{colorThemeCode}</CodeBlock>
            <CodeBlock>{colorModeCode}</CodeBlock>
            <CodeBlock>{colorPaletteCode}</CodeBlock>
          </div>
        </Section>

        <Section id="tokens" title="Tokens used">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {tokenPaths.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="rules" title="Rules">
          <div className="grid gap-3 sm:grid-cols-2">
            <PrimitiveRuleCard
              title="One accent"
              text="Use a single accent per screen — a CTA, a live status, a selection. The accent is an event, not decoration."
            />
            <PrimitiveRuleCard
              title="Semantic over palette"
              text="Read theme.colors.* inside components. Never hardcode palette values; they do not adapt across modes."
            />
            <PrimitiveRuleCard
              title="Design both modes"
              text="Neither mode is derived from the other. Test every screen in light and dark."
            />
            <PrimitiveRuleCard
              title="Tints for backgrounds"
              text="Use feedback-*-bg tints for status surfaces. Reserve the saturated feedback color for text and icons."
            />
          </div>
        </Section>

        <Section id="do-dont" title="Do · Don’t">
          <div className="space-y-3">
            <PrimitiveDoDont
              doText="Use one accent per screen. The accent is an event — a CTA, a live status, a selection."
              dontText="Use primary blue for headers, badges, links, and buttons all on the same screen."
            />
            <PrimitiveDoDont
              doText="Use semantic tokens like surfaceBackground and textPrimary. They resolve correctly in both modes."
              dontText="Reference palette values like grey-50 or #F9FAFB in component code. They do not adapt to dark mode."
            />
            <PrimitiveDoDont
              doText="Design both modes in parallel and test every screen in both."
              dontText="Build in light mode and invert for dark. The result always feels wrong."
            />
            <PrimitiveDoDont
              doText="Use feedback-*-bg tints for status backgrounds."
              dontText="Use feedback-error (saturated red) as a background fill. It is meant for text and icons."
            />
          </div>
        </Section>

        <section id="related" className="scroll-mt-10 pt-12">
          <h2 className="text-[24px] font-medium leading-tight text-ink">Related</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Tokens', 'Typography', 'Effects'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <RightRail headings={headings} actions={actions} />
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-10 pt-11">
      <h2 className="text-[24px] font-medium leading-tight text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PrimitivePreview({ slug }: { slug: string }) {
  if (slug === 'type') return <TypePreview />;
  if (slug === 'effects') return <MaterialsPreview />;
  if (slug === 'motion') return <MotionPreview />;
  if (slug === 'icons') return <IconsPreview />;
  return <TokensPreview />;
}

function TokensPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        ['Colors', '44+', 'semantic roles'],
        ['Spacing', '0-96', '4 px grid'],
        ['Radii', '0-9999', 'corner scale'],
        ['Motion', '140 / 200 / 280', 'durations'],
      ].map(([label, value, note]) => (
        <div key={label} className="rounded-lg border border-line bg-surface p-4">
          <div className="text-[12px] text-ink-3">{label}</div>
          <div className="mt-5 break-words text-[24px] font-medium leading-tight text-ink">
            {value}
          </div>
          <div className="mt-2 text-[12.5px] text-ink-2">{note}</div>
        </div>
      ))}
    </div>
  );
}

function TypePreview() {
  const rows = [
    {
      group: 'Display',
      name: 'Large',
      size: 34,
      lineHeight: 1.25,
      tracking: '-2%',
      letterSpacing: '-0.02em',
      emphasized: true,
    },
    {
      group: 'Display',
      name: 'Medium',
      size: 28,
      lineHeight: 1.25,
      tracking: '-2%',
      letterSpacing: '-0.02em',
      emphasized: true,
    },
    {
      group: 'Display',
      name: 'Small',
      size: 24,
      lineHeight: 1.25,
      tracking: '-2%',
      letterSpacing: '-0.02em',
      emphasized: true,
    },
    {
      group: 'Heading',
      name: 'Large',
      size: 20,
      lineHeight: 1.3,
      tracking: '-1%',
      letterSpacing: '-0.01em',
      emphasized: true,
    },
    {
      group: 'Heading',
      name: 'Medium',
      size: 17,
      lineHeight: 1.3,
      tracking: '-1%',
      letterSpacing: '-0.01em',
      emphasized: true,
    },
    {
      group: 'Heading',
      name: 'Small',
      size: 14,
      lineHeight: 1.3,
      tracking: '-1%',
      letterSpacing: '-0.01em',
      emphasized: true,
    },
    { group: 'Body', name: 'Large', size: 17, lineHeight: 1.4, tracking: '0%' },
    { group: 'Body', name: 'Medium', size: 14, lineHeight: 1.4, tracking: '0%' },
    { group: 'Body', name: 'Small', size: 12, lineHeight: 1.4, tracking: '0%' },
    { group: 'Label', name: 'Large', size: 14, lineHeight: 1.2, tracking: '0%' },
    { group: 'Label', name: 'Medium', size: 12, lineHeight: 1.2, tracking: '0%' },
    { group: 'Label', name: 'Small', size: 11, lineHeight: 1.2, tracking: '0%' },
    { group: 'Button', name: 'Large', size: 20, lineHeight: 1.1, tracking: '0%', button: true },
    { group: 'Button', name: 'Medium', size: 17, lineHeight: 1.1, tracking: '0%', button: true },
    { group: 'Button', name: 'Small', size: 14, lineHeight: 1.1, tracking: '0%', button: true },
    { group: 'Button', name: 'Label', size: 12, lineHeight: 1.1, tracking: '0%', button: true },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface font-sans">
      <div className="grid gap-8 border-b border-line p-5 sm:grid-cols-[1fr_1.15fr] sm:p-7">
        <div>
          <div className="text-[15px] font-medium text-ink">Manrope</div>
          <div className="mt-6 text-[76px] font-normal leading-none tracking-[-0.04em] text-ink">
            Ag
          </div>
        </div>
        <div className="self-start text-[20px] leading-[1.35] tracking-[-0.02em] text-ink sm:text-[22px]">
          <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
          <div>abcdefghijklmnopqrstuvwxyz</div>
          <div>0123456789 !@#$%^&amp;*()</div>
        </div>
      </div>

      <div className="divide-y divide-line">
        {rows.map((row) => {
          const lineHeightPercent = Math.round(row.lineHeight * 100);
          const em = row.size / 16;
          const label = `${row.group} ${row.name}`;

          return (
            <div
              key={label}
              className="grid gap-5 px-5 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(240px,0.9fr)] sm:px-7"
            >
              <div
                className="grid gap-5 sm:grid-cols-2"
                style={{
                  fontSize: row.size,
                  lineHeight: row.lineHeight,
                  letterSpacing: row.letterSpacing ?? '0',
                }}
              >
                {!row.button ? (
                  <div className="font-normal text-ink">
                    {label}
                    {row.emphasized ? <span className="block">Normal</span> : null}
                  </div>
                ) : null}
                {row.emphasized ? (
                  <div className="font-semibold text-ink">
                    {label}
                    <span className="block">Emphasized</span>
                  </div>
                ) : null}
                {row.button ? <div className="font-semibold text-ink">{label}</div> : null}
              </div>

              <div className="self-center">
                <div className="text-[12px] font-medium text-ink-2">{label}</div>
                <div className="mt-2 font-mono text-[10px] leading-relaxed text-ink-3 sm:text-[11px]">
                  Font size: {row.size}px / {Number(em.toFixed(4))}rem | Line height:{' '}
                  {lineHeightPercent}% | Letter spacing: {row.tracking}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type UtilitySemanticRow = {
  token: string;
  semanticKey: keyof typeof lightSemanticColors;
  palette: string;
  darkPalette: string;
  usage: string;
};

const utilitySemanticPalette: { section: string; rows: UtilitySemanticRow[] }[] = [
  {
    section: 'Surfaces & Backgrounds',
    rows: [
      {
        token: 'surface-background',
        semanticKey: 'surfaceBackground',
        palette: 'Grey-50',
        darkPalette: 'Grey-950',
        usage: 'Main app background',
      },
      {
        token: 'surface-input*',
        semanticKey: 'surfaceInput',
        palette: 'Grey-100',
        darkPalette: 'Grey-800',
        usage: 'Input backgrounds',
      },
      {
        token: 'surface-elevated',
        semanticKey: 'surfaceElevated',
        palette: 'Base-White',
        darkPalette: 'Grey-900',
        usage: 'Cards, sheets, modals (above background)',
      },
      {
        token: 'surface-overlay',
        semanticKey: 'surfaceOverlay',
        palette: 'Grey-900 @ 40%',
        darkPalette: 'Grey-900 @ 70%',
        usage: 'Overlays, backdrops, scrims',
      },
      {
        token: 'surface-inverse',
        semanticKey: 'surfaceInverse',
        palette: 'Grey-900',
        darkPalette: 'Grey-50',
        usage: 'Dark surfaces, tooltips',
      },
    ],
  },
  {
    section: 'Text & Content',
    rows: [
      {
        token: 'text-primary',
        semanticKey: 'textPrimary',
        palette: 'Grey-900',
        darkPalette: 'Grey-50',
        usage: 'Main content, headlines',
      },
      {
        token: 'text-secondary',
        semanticKey: 'textSecondary',
        palette: 'Grey-600',
        darkPalette: 'Grey-400',
        usage: 'Supporting text, descriptions',
      },
      {
        token: 'text-tertiary',
        semanticKey: 'textTertiary',
        palette: 'Grey-400',
        darkPalette: 'Grey-500',
        usage: 'Captions, metadata',
      },
      {
        token: 'text-disabled**',
        semanticKey: 'textDisabled',
        palette: 'Grey-900 @ 5%',
        darkPalette: 'Grey-50 @ 12%',
        usage: 'Disabled states',
      },
      {
        token: 'text-inverse',
        semanticKey: 'textInverse',
        palette: 'Base-White',
        darkPalette: 'Grey-900',
        usage: 'Text on inverse backgrounds',
      },
      {
        token: 'text-placeholder',
        semanticKey: 'textPlaceholder',
        palette: 'Grey-300',
        darkPalette: 'Grey-600',
        usage: 'Input placeholders',
      },
      {
        token: 'text-interactive-primary*',
        semanticKey: 'textInteractivePrimary',
        palette: 'Base-White',
        darkPalette: 'Base-White',
        usage: 'Text on primary interactive elements',
      },
      {
        token: 'text-interactive-secondary*',
        semanticKey: 'textInteractiveSecondary',
        palette: 'Grey-700',
        darkPalette: 'Grey-200',
        usage: 'Text on secondary interactive elements',
      },
      {
        token: 'text-interactive-tertiary*',
        semanticKey: 'textInteractiveTertiary',
        palette: 'Primary-600',
        darkPalette: 'Primary-400',
        usage: 'Text on tertiary interactive elements',
      },
      {
        token: 'text-interactive-error*',
        semanticKey: 'textInteractiveError',
        palette: 'Error-600',
        darkPalette: 'Error-400',
        usage: 'Text for error states',
      },
    ],
  },
  {
    section: 'Interactive Elements',
    rows: [
      {
        token: 'interactive-primary**',
        semanticKey: 'interactivePrimary',
        palette: 'Primary-600',
        darkPalette: 'Primary-500',
        usage: 'Main CTAs, primary buttons',
      },
      {
        token: 'interactive-primary-pressed**',
        semanticKey: 'interactivePrimaryPressed',
        palette: 'Primary-700',
        darkPalette: 'Primary-600',
        usage: 'Pressed state',
      },
      {
        token: 'interactive-secondary',
        semanticKey: 'interactiveSecondary',
        palette: 'Grey-100',
        darkPalette: 'Grey-800',
        usage: 'Secondary buttons, tabs',
      },
      {
        token: 'interactive-secondary-pressed',
        semanticKey: 'interactiveSecondaryPressed',
        palette: 'Grey-200',
        darkPalette: 'Grey-700',
        usage: 'Secondary hover state',
      },
      {
        token: 'interactive-tertiary',
        semanticKey: 'interactiveTertiary',
        palette: 'Transparent',
        darkPalette: 'Transparent',
        usage: 'Ghost buttons, text links',
      },
      {
        token: 'interactive-tertiary-pressed**',
        semanticKey: 'interactiveTertiaryPressed',
        palette: 'Grey-100 @ 40%',
        darkPalette: 'Grey-800 @ 55%',
        usage: 'Tertiary hover state',
      },
      {
        token: 'interactive-disabled',
        semanticKey: 'interactiveDisabled',
        palette: 'Grey-100',
        darkPalette: 'Grey-800',
        usage: 'Disabled button (or action) backgrounds',
      },
      {
        token: 'interactive-error*',
        semanticKey: 'interactiveError',
        palette: 'Error-500',
        darkPalette: 'Error-500',
        usage: 'Error state backgrounds',
      },
      {
        token: 'focus-ring-main**',
        semanticKey: 'focusRingMain',
        palette: 'Primary-400',
        darkPalette: 'Primary-400',
        usage: 'Accessibility focus indicators',
      },
      {
        token: 'focus-ring-error*',
        semanticKey: 'focusRingError',
        palette: 'Error-300',
        darkPalette: 'Error-400',
        usage: 'Accessibility focus indicators for error states',
      },
      {
        token: 'touch-feedback-main**',
        semanticKey: 'touchFeedbackMain',
        palette: 'Grey-900 @ 10%',
        darkPalette: 'Grey-50 @ 8%',
        usage: 'Ripple, highlight, or haptic feedback overlays on saturated surfaces',
      },
      {
        token: 'touch-feedback-light*',
        semanticKey: 'touchFeedbackLight',
        palette: 'Grey-100 @ 40%',
        darkPalette: 'Grey-800 @ 50%',
        usage: 'Ripple, highlight, or haptic feedback overlays on main backgrounds',
      },
    ],
  },
  {
    section: 'Borders & Dividers',
    rows: [
      {
        token: 'border-primary',
        semanticKey: 'borderPrimary',
        palette: 'Grey-300',
        darkPalette: 'Grey-700',
        usage: 'Input borders, strong dividers',
      },
      {
        token: 'border-secondary',
        semanticKey: 'borderSecondary',
        palette: 'Grey-200',
        darkPalette: 'Grey-800',
        usage: 'Subtle separators',
      },
      {
        token: 'border-focus',
        semanticKey: 'borderFocus',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Active input borders',
      },
      {
        token: 'border-error',
        semanticKey: 'borderError',
        palette: 'Error-500',
        darkPalette: 'Error-500',
        usage: 'Error state borders',
      },
    ],
  },
  {
    section: 'Feedback States',
    rows: [
      {
        token: 'feedback-success',
        semanticKey: 'feedbackSuccess',
        palette: 'Success-500',
        darkPalette: 'Success-400',
        usage: 'Success messages, confirmations',
      },
      {
        token: 'feedback-success-bg',
        semanticKey: 'feedbackSuccessBg',
        palette: 'Success-50',
        darkPalette: 'Success-950',
        usage: 'Success background areas',
      },
      {
        token: 'feedback-warning',
        semanticKey: 'feedbackWarning',
        palette: 'Warning-600',
        darkPalette: 'Warning-400',
        usage: 'Warnings, important notices',
      },
      {
        token: 'feedback-warning-bg',
        semanticKey: 'feedbackWarningBg',
        palette: 'Warning-50',
        darkPalette: 'Warning-950',
        usage: 'Warning background areas',
      },
      {
        token: 'feedback-error',
        semanticKey: 'feedbackError',
        palette: 'Error-500',
        darkPalette: 'Error-500',
        usage: 'Errors, validation issues',
      },
      {
        token: 'feedback-error-bg',
        semanticKey: 'feedbackErrorBg',
        palette: 'Error-50',
        darkPalette: 'Error-950',
        usage: 'Error background areas',
      },
      {
        token: 'feedback-info',
        semanticKey: 'feedbackInfo',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Information, neutral notices',
      },
      {
        token: 'feedback-info-bg',
        semanticKey: 'feedbackInfoBg',
        palette: 'Primary-50',
        darkPalette: 'Primary-950',
        usage: 'Info background areas',
      },
    ],
  },
  {
    section: 'Navigation & UI Chrome',
    rows: [
      {
        token: 'nav-background',
        semanticKey: 'navBackground',
        palette: 'Base-White',
        darkPalette: 'Grey-900',
        usage: 'Tab bars, nav bars',
      },
      {
        token: 'nav-border',
        semanticKey: 'navBorder',
        palette: 'Grey-200',
        darkPalette: 'Grey-800',
        usage: 'Navigation separators',
      },
      {
        token: 'nav-active',
        semanticKey: 'navActive',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Active nav items',
      },
      {
        token: 'nav-inactive',
        semanticKey: 'navInactive',
        palette: 'Grey-400',
        darkPalette: 'Grey-500',
        usage: 'Inactive nav items',
      },
      {
        token: 'nav-indicator',
        semanticKey: 'navIndicator',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Tab indicators, progress',
      },
    ],
  },
  {
    section: 'Gestures',
    rows: [
      {
        token: 'pull-indicator',
        semanticKey: 'pullIndicator',
        palette: 'Grey-300',
        darkPalette: 'Grey-600',
        usage: 'Pull-to-refresh indicators',
      },
    ],
  },
];

function MainPalette() {
  return (
    <PaletteBlock
      title="Main palette"
      description="Base, Grey, Primary, Success, Warning, and Error from @arloui/tokens paletteMain. Hover any step for its hex."
    >
      <TailwindPaletteGrid
        scales={mainScales}
        includeBase={{ white: paletteBase.white, black: paletteBase.black }}
      />
    </PaletteBlock>
  );
}

function SecondaryPalette() {
  return (
    <PaletteBlock
      title="Secondary palette"
      description="Extended Tailwind-aligned hues from @arloui/tokens paletteSecondary, reserved for data visualization and decoration."
    >
      <TailwindPaletteGrid scales={paletteSecondary} />
    </PaletteBlock>
  );
}

function AlphaRamps() {
  return (
    <PaletteBlock
      title="Alpha ramps"
      description="White and Black at 10% increments over a checkerboard, for overlays, scrims, and press feedback."
    >
      <TailwindAlphaRamp
        white={alphaRamp.white}
        black={alphaRamp.black}
        whiteBase={alphaRamp.whiteBase}
        blackBase={alphaRamp.blackBase}
      />
    </PaletteBlock>
  );
}

function SemanticTokenTable() {
  return (
    <PaletteBlock
      title="Utility semantic palette"
      description="Semantic roles mapped from the main palette. Swatches read from @arloui/tokens lightSemanticColors and darkSemanticColors; components consume these through theme.colors in camelCase."
    >
      <div className="overflow-hidden rounded-md border border-line">
          <div className="hidden border-b border-line bg-canvas px-3 py-2.5 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(112px,0.7fr)_minmax(112px,0.7fr)_minmax(0,1.2fr)] md:gap-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Token
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Color (light)
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Color (dark)
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Usage
            </div>
          </div>
          {utilitySemanticPalette.map((group) => (
            <div key={group.section}>
              <div className="border-b border-line bg-canvas px-3 py-2.5">
                <div className="text-[12px] font-medium text-ink">{group.section}</div>
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.token}
                  className="grid gap-2 border-b border-line px-3 py-3 last:border-b-0 md:grid-cols-[minmax(0,1.15fr)_minmax(112px,0.7fr)_minmax(112px,0.7fr)_minmax(0,1.2fr)] md:items-center md:gap-4"
                >
                  <div className="min-w-0 break-words font-mono text-[12px] leading-relaxed text-ink">
                    {row.token}
                  </div>
                  <PaletteRef
                    label="Light"
                    palette={row.palette}
                    swatch={lightSemanticColors[row.semanticKey]}
                  />
                  <PaletteRef
                    label="Dark"
                    palette={row.darkPalette}
                    swatch={darkSemanticColors[row.semanticKey]}
                  />
                  <div className="text-[13px] leading-relaxed text-ink-3">{row.usage}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </PaletteBlock>
  );
}

function PaletteBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="mb-4 flex flex-col gap-1">
        <div className="text-[14px] font-medium text-ink">{title}</div>
        <div className="text-[12.5px] leading-relaxed text-ink-3">{description}</div>
      </div>
      {children}
    </div>
  );
}

function PaletteRef({
  label,
  palette,
  swatch,
}: {
  label: string;
  palette: string;
  swatch: string;
}) {
  const isTransparent = swatch === 'transparent';
  const checkerboard = {
    backgroundImage:
      'linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%), linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%)',
    backgroundSize: '6px 6px',
    backgroundPosition: '0 0, 3px 3px',
  };

  return (
    <div className="group relative flex min-w-0 items-center gap-2">
      <span className="relative shrink-0">
        <span
          className="block size-4 rounded-full border border-line"
          style={isTransparent ? checkerboard : { backgroundColor: swatch }}
        />
        <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[10px] leading-none text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          {swatch}
        </span>
      </span>
      <div className="min-w-0">
        <span className="sr-only">{label}</span>
        <span className="text-[12.5px] text-ink-2">{palette}</span>
      </div>
    </div>
  );
}

function MaterialsPreview() {
  const shadowLevels = [
    ['sm', 'Control', '0 0 2px rgba(16,24,40,0.06)'],
    ['md', 'Menu', '0 1px 6px rgba(16,24,40,0.08)'],
    ['lg', 'Sheet', '0 2px 12px rgba(16,24,40,0.10)'],
    ['xl', 'Modal', '0 4px 28px rgba(16,24,40,0.12)'],
  ] as const;

  return (
    <div className="space-y-3">
      <div className="grid gap-4 rounded-lg border border-line bg-[#D1D5DC] p-5 sm:grid-cols-2 lg:grid-cols-4">
        {shadowLevels.map(([level, role, shadow]) => (
          <div
            key={level}
            className="flex min-h-36 flex-col justify-between rounded-lg border border-black/5 bg-white p-4 text-[#101828]"
            style={{ boxShadow: shadow }}
          >
            <div className="font-mono text-[11px] text-[#6A7282]">shadows.{level}</div>
            <div>
              <div className="text-[14px] font-medium">{role}</div>
              <div className="mt-1 text-[11.5px] text-[#6A7282]">
                Increasing spatial priority
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-64 overflow-hidden rounded-lg border border-line bg-[#155DFC] p-5">
          <div className="absolute top-8 right-8 size-24 rounded-lg bg-[#FB2C36]" />
          <div className="absolute bottom-7 left-10 h-16 w-36 rounded-lg bg-[#00C950]" />
          <div className="relative z-10 flex h-full min-h-54 items-end">
            <div className="w-full rounded-lg border border-white/60 bg-white/70 p-4 text-[#101828] shadow-lg backdrop-blur-[24px] dark:border-white/15 dark:bg-[#101828]/75 dark:text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[12px] font-medium uppercase tracking-[0.1em] opacity-60">
                    Glass regular
                  </div>
                  <div className="mt-1 text-[15px] font-medium">Functional navigation layer</div>
                </div>
                <div className="flex gap-2">
                  <span className="size-8 rounded-full bg-[#155DFC]" />
                  <span className="size-8 rounded-full border border-current/20 bg-white/40 dark:bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Blur presets
          </div>
          <div className="mt-5 space-y-4">
            {[
              ['sm', 8],
              ['md', 16],
              ['lg', 24],
              ['xl', 40],
            ].map(([name, value]) => (
              <div key={name} className="grid grid-cols-[54px_1fr_38px] items-center gap-3">
                <div className="font-mono text-[11px] text-ink-3">blur.{name}</div>
                <div className="h-2 rounded-full bg-line">
                  <div
                    className="h-2 rounded-full bg-ink"
                    style={{ width: `${(Number(value) / 40) * 100}%` }}
                  />
                </div>
                <div className="text-right font-mono text-[11px] text-ink-2">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-2">
            Begin with overlay, border, and contrast. Add blur only when it improves context and
            remains smooth on-device.
          </div>
        </div>
      </div>
    </div>
  );
}

function MotionPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ['Press', '140ms', 'Tap response'],
        ['State', '200ms', 'Selected/loading'],
        ['Sheet', '280ms', 'Surface movement'],
      ].map(([label, value, note]) => (
        <div key={label} className="rounded-lg border border-line bg-surface p-4">
          <div className="flex h-12 items-center">
            <div className="h-2 w-20 rounded-full bg-line">
              <div className="h-2 w-8 rounded-full bg-ink" />
            </div>
          </div>
          <div className="mt-4 text-[13px] text-ink">{label}</div>
          <div className="mt-1 font-mono text-[12px] text-ink-3">{value}</div>
          <div className="mt-2 text-[12.5px] text-ink-2">{note}</div>
        </div>
      ))}
    </div>
  );
}

function IconsPreview() {
  const icons: { name: IconName; label: string }[] = [
    { name: 'magnifying-glass', label: 'Search' },
    { name: 'copy', label: 'Copy' },
    { name: 'x', label: 'Close' },
    { name: 'qr-code', label: 'Scan' },
    { name: 'moon', label: 'Moon' },
    { name: 'sun', label: 'Sun' },
    { name: 'github-logo', label: 'GitHub' },
    { name: 'figma-logo', label: 'Figma' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {icons.map((item) => (
        <div
          key={item.name}
          className="flex h-28 flex-col items-center justify-center gap-3 rounded-lg border border-line bg-surface text-ink"
        >
          <Icon name={item.name} size={24} />
          <div className="text-[12.5px] text-ink-2">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
