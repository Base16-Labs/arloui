import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { TailwindAlphaRamp, TailwindPaletteGrid } from '@/components/docs/tailwind-palette';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CopyButton } from '@/components/ui/CopyButton';
import { Icon } from '@/components/ui/Icon';
import { IconLibrary } from '@/components/icons/icon-library';
import {
  alphaRamp,
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
    lede: 'A 4 px grid from the registry spacing scale, shared by layout rhythm, component padding, and control gaps.',
    intro: [
      'The spacing object uses numeric keys where spacing[4] equals 16 px.',
      'Keys are the suffix of the Figma token name, so space-4 maps to spacing[4].',
      'Use spacing with sizing and radii instead of hard-coding component dimensions.',
    ],
    rules: [
      'Use spacing[4] to spacing[5] for common horizontal gutters.',
      'Use spacing[1] and spacing[2] for icon, label, and compact control gaps.',
      'Use sizing tokens for fixed component dimensions such as buttons and icons.',
    ],
    specs: [
      { name: 'spacing.0', value: '0', note: 'No gap' },
      { name: 'spacing.1', value: '4', note: 'Small icon gap' },
      { name: 'spacing.2', value: '8', note: 'Control inner gap' },
      { name: 'spacing.4', value: '16', note: 'Common gutter' },
      { name: 'spacing.6', value: '24', note: 'Section rhythm' },
      { name: 'spacing.24', value: '96', note: 'Large screen spacing' },
      { name: 'sizing.icon.md', value: '24', note: 'Default icon size' },
      { name: 'sizing.buttonHeight.md', value: '40', note: 'Default button height' },
    ],
    snippet: `<View style={{
  paddingHorizontal: theme.spacing[4],
  gap: theme.spacing[2],
}}>
  <Text>Label</Text>
  <Input />
</View>`,
    related: ['Typography', 'Tokens', 'Motion'],
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
  if (!slugs.includes(slug)) notFound();

  const doc = primitiveDocs[slug];
  if (!doc) notFound();

  if (slug === 'icons') {
    const [names, animatedSource] = await Promise.all([getIconNames(), getAnimatedIconSource()]);
    return <IconLibrary names={names} animatedSource={animatedSource} />;
  }

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
    <div className="overflow-hidden rounded-lg border border-line bg-surface font-['Manrope']">
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
        usage: 'Main app background',
      },
      {
        token: 'surface-input*',
        semanticKey: 'surfaceInput',
        palette: 'Grey-100',
        usage: 'Input backgrounds',
      },
      {
        token: 'surface-elevated',
        semanticKey: 'surfaceElevated',
        palette: 'Base-White',
        usage: 'Cards, sheets, modals (above background)',
      },
      {
        token: 'surface-overlay',
        semanticKey: 'surfaceOverlay',
        palette: 'Grey-900 @ 40%',
        usage: 'Overlays, backdrops, scrims',
      },
      {
        token: 'surface-inverse',
        semanticKey: 'surfaceInverse',
        palette: 'Grey-900',
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
        usage: 'Main content, headlines',
      },
      {
        token: 'text-secondary',
        semanticKey: 'textSecondary',
        palette: 'Grey-600',
        usage: 'Supporting text, descriptions',
      },
      {
        token: 'text-tertiary',
        semanticKey: 'textTertiary',
        palette: 'Grey-400',
        usage: 'Captions, metadata',
      },
      {
        token: 'text-disabled**',
        semanticKey: 'textDisabled',
        palette: 'Grey-900 @ 5%',
        usage: 'Disabled states',
      },
      {
        token: 'text-inverse',
        semanticKey: 'textInverse',
        palette: 'Base-White',
        usage: 'Text on inverse backgrounds',
      },
      {
        token: 'text-placeholder',
        semanticKey: 'textPlaceholder',
        palette: 'Grey-300',
        usage: 'Input placeholders',
      },
      {
        token: 'text-interactive-primary*',
        semanticKey: 'textInteractivePrimary',
        palette: 'Base-White',
        usage: 'Text on primary interactive elements',
      },
      {
        token: 'text-interactive-secondary*',
        semanticKey: 'textInteractiveSecondary',
        palette: 'Grey-700',
        usage: 'Text on secondary interactive elements',
      },
      {
        token: 'text-interactive-tertiary*',
        semanticKey: 'textInteractiveTertiary',
        palette: 'Primary-600',
        usage: 'Text on tertiary interactive elements',
      },
      {
        token: 'text-interactive-error*',
        semanticKey: 'textInteractiveError',
        palette: 'Error-600',
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
        usage: 'Main CTAs, primary buttons',
      },
      {
        token: 'interactive-primary-pressed**',
        semanticKey: 'interactivePrimaryPressed',
        palette: 'Primary-700',
        usage: 'Pressed state',
      },
      {
        token: 'interactive-secondary',
        semanticKey: 'interactiveSecondary',
        palette: 'Grey-100',
        usage: 'Secondary buttons, tabs',
      },
      {
        token: 'interactive-secondary-pressed',
        semanticKey: 'interactiveSecondaryPressed',
        palette: 'Grey-200',
        usage: 'Secondary hover state',
      },
      {
        token: 'interactive-tertiary',
        semanticKey: 'interactiveTertiary',
        palette: 'Transparent',
        usage: 'Ghost buttons, text links',
      },
      {
        token: 'interactive-tertiary-pressed**',
        semanticKey: 'interactiveTertiaryPressed',
        palette: 'Grey-100 @ 40%',
        usage: 'Tertiary hover state',
      },
      {
        token: 'interactive-disabled',
        semanticKey: 'interactiveDisabled',
        palette: 'Grey-100',
        usage: 'Disabled button (or action) backgrounds',
      },
      {
        token: 'interactive-error*',
        semanticKey: 'interactiveError',
        palette: 'Error-500',
        usage: 'Error state backgrounds',
      },
      {
        token: 'focus-ring-main**',
        semanticKey: 'focusRingMain',
        palette: 'Primary-400',
        usage: 'Accessibility focus indicators',
      },
      {
        token: 'focus-ring-error*',
        semanticKey: 'focusRingError',
        palette: 'Error-300',
        usage: 'Accessibility focus indicators for error states',
      },
      {
        token: 'touch-feedback-main**',
        semanticKey: 'touchFeedbackMain',
        palette: 'Grey-900 @ 10%',
        usage: 'Ripple, highlight, or haptic feedback overlays on saturated surfaces',
      },
      {
        token: 'touch-feedback-light*',
        semanticKey: 'touchFeedbackLight',
        palette: 'Grey-100 @ 40%',
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
        usage: 'Input borders, strong dividers',
      },
      {
        token: 'border-secondary',
        semanticKey: 'borderSecondary',
        palette: 'Grey-200',
        usage: 'Subtle separators',
      },
      {
        token: 'border-focus',
        semanticKey: 'borderFocus',
        palette: 'Primary-500',
        usage: 'Active input borders',
      },
      {
        token: 'border-error',
        semanticKey: 'borderError',
        palette: 'Error-500',
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
        usage: 'Success messages, confirmations',
      },
      {
        token: 'feedback-success-bg',
        semanticKey: 'feedbackSuccessBg',
        palette: 'Success-50',
        usage: 'Success background areas',
      },
      {
        token: 'feedback-warning',
        semanticKey: 'feedbackWarning',
        palette: 'Warning-600',
        usage: 'Warnings, important notices',
      },
      {
        token: 'feedback-warning-bg',
        semanticKey: 'feedbackWarningBg',
        palette: 'Warning-50',
        usage: 'Warning background areas',
      },
      {
        token: 'feedback-error',
        semanticKey: 'feedbackError',
        palette: 'Error-500',
        usage: 'Errors, validation issues',
      },
      {
        token: 'feedback-error-bg',
        semanticKey: 'feedbackErrorBg',
        palette: 'Error-50',
        usage: 'Error background areas',
      },
      {
        token: 'feedback-info',
        semanticKey: 'feedbackInfo',
        palette: 'Primary-500',
        usage: 'Information, neutral notices',
      },
      {
        token: 'feedback-info-bg',
        semanticKey: 'feedbackInfoBg',
        palette: 'Primary-50',
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
        usage: 'Tab bars, nav bars',
      },
      {
        token: 'nav-border',
        semanticKey: 'navBorder',
        palette: 'Grey-200',
        usage: 'Navigation separators',
      },
      {
        token: 'nav-active',
        semanticKey: 'navActive',
        palette: 'Primary-500',
        usage: 'Active nav items',
      },
      {
        token: 'nav-inactive',
        semanticKey: 'navInactive',
        palette: 'Grey-400',
        usage: 'Inactive nav items',
      },
      {
        token: 'nav-indicator',
        semanticKey: 'navIndicator',
        palette: 'Primary-500',
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
        description="Semantic roles mapped from the main palette. Swatches read from @arloui/tokens lightSemanticColors; components consume these through theme.colors in camelCase."
      >
        <div className="overflow-hidden rounded-md border border-line">
          <div className="hidden border-b border-line bg-canvas px-3 py-2.5 md:grid md:grid-cols-[minmax(0,1.35fr)_minmax(140px,0.75fr)_minmax(0,1.4fr)] md:gap-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Token
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Color (light)
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
                  className="grid gap-2 border-b border-line px-3 py-3 last:border-b-0 md:grid-cols-[minmax(0,1.35fr)_minmax(140px,0.75fr)_minmax(0,1.4fr)] md:items-center md:gap-4"
                >
                  <div className="min-w-0 break-words font-mono text-[12px] leading-relaxed text-ink">
                    {row.token}
                  </div>
                  <PaletteRef
                    label="Light"
                    palette={row.palette}
                    swatch={lightSemanticColors[row.semanticKey]}
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
