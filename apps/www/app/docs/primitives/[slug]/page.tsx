import { notFound, redirect } from 'next/navigation';
import type { ComponentProps } from 'react';
import { TailwindAlphaRamp, TailwindPaletteGrid } from '@/components/docs/tailwind-palette';
import { EffectsDoc } from '@/components/docs/effects-doc';
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
        <Eyebrow>Primitives</Eyebrow>
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
        <Eyebrow>Primitives</Eyebrow>
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
  if (slug === 'color') return <ColorPreview />;
  if (slug === 'spacing') return <SpacingPreview />;
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

function ColorPreview() {
  return (
    <div className="space-y-5">
      <PaletteBlock
        title="Main palette"
        description="Base, Grey, Primary, Success, Warning, and Error from @arloui/tokens paletteMain."
      >
        <TailwindPaletteGrid
          scales={mainScales}
          includeBase={{ white: paletteBase.white, black: paletteBase.black }}
        />
      </PaletteBlock>

      <PaletteBlock
        title="Secondary palette"
        description="Extended hues from @arloui/tokens paletteSecondary, plus alpha ramps for overlays and scrims."
      >
        <div className="space-y-8">
          <TailwindPaletteGrid scales={paletteSecondary} />
          <div>
            <div className="mb-4 text-[13px] font-medium text-ink">Alpha ramps</div>
            <TailwindAlphaRamp
              white={alphaRamp.white}
              black={alphaRamp.black}
              whiteBase={alphaRamp.whiteBase}
              blackBase={alphaRamp.blackBase}
            />
          </div>
        </div>
      </PaletteBlock>

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
    </div>
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

function SpacingPreview() {
  const steps = [
    [1, 4],
    [2, 8],
    [3, 12],
    [4, 16],
    [6, 24],
    [10, 40],
    [16, 64],
    [24, 96],
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-surface p-5">
        <div className="space-y-3">
          {steps.map(([key, value]) => (
            <div key={key} className="grid grid-cols-[72px_1fr_44px] items-center gap-4">
              <div className="font-mono text-[12px] text-ink-3">spacing.{key}</div>
              <div className="h-6 rounded-full bg-ink" style={{ width: value * 2 }} />
              <div className="text-right font-mono text-[12px] text-ink-2">{value}px</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Sizing scale
          </div>
          <div className="mt-5 flex items-end gap-4">
            {[16, 24, 32, 40].map((size) => (
              <div key={size} className="text-center">
                <div
                  className="mx-auto rounded-md border border-line-strong bg-canvas"
                  style={{ width: size, height: size }}
                />
                <div className="mt-2 font-mono text-[10px] text-ink-3">{size}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[12.5px] leading-relaxed text-ink-2">
            Named presets replace one-off dimensions for icons, avatars, and controls.
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Touch target
          </div>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-md border border-dashed border-line-strong">
              <div className="size-10 rounded-full bg-ink" />
            </div>
            <div>
              <div className="font-mono text-[12px] text-ink">44pt minimum</div>
              <div className="mt-1 text-[11.5px] text-ink-3">40pt visible control + 2pt inset</div>
            </div>
          </div>
          <div className="mt-4 text-[12.5px] leading-relaxed text-ink-2">
            The interaction area can be larger than the visible component.
          </div>
        </div>
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
