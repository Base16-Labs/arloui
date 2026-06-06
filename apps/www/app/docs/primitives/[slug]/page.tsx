import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CopyButton } from '@/components/ui/CopyButton';
import { Icon } from '@/components/ui/Icon';
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
    title: 'Type',
    lede: 'The registry typography scale: Space Grotesk for UI, Space Mono for data, and Doto reserved for display moments.',
    intro: [
      'The registry exposes fontFamilies and typography from the same tokens.ts template components use.',
      'Use Space Mono for prices, timestamps, percentages, status labels, and tabular data.',
      'Reserve the display face for one hero element per screen.',
    ],
    rules: [
      'Use displayXl and displayLg sparingly in app screens.',
      'Use title1 through title3 for section and component headings.',
      'Use label for small uppercase metadata; it includes 0.66 letter spacing.',
    ],
    specs: [
      { name: 'fontFamilies.sans', value: 'Space Grotesk', note: 'Default UI face' },
      { name: 'fontFamilies.mono', value: 'Space Mono', note: 'Data and tabular text' },
      { name: 'displayXl', value: '40 / 44 / 600', note: 'Large screen title' },
      { name: 'title1', value: '24 / 30 / 600', note: 'Section title' },
      { name: 'body', value: '15 / 21 / 400', note: 'Default body copy' },
      { name: 'label', value: '11 / 14 / 500', note: 'Small labels with 0.66 tracking' },
    ],
    snippet: `const styles = {
  title: {
    ...theme.typography.title1,
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
    related: ['Tokens', 'Type', 'Icons'],
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
    related: ['Type', 'Tokens', 'Motion'],
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
    ['displayXl', 'Build native screens faster', 'text-[40px]'],
    ['title1', 'Input field', 'text-[24px]'],
    ['body', 'Helper text keeps the next action clear.', 'text-[15px]'],
    ['label', 'USERNAME TAKEN', 'text-[11px] uppercase tracking-[0.06em]'],
  ];

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      {rows.map(([label, sample, className]) => (
        <div
          key={label}
          className="grid gap-3 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[120px_1fr]"
        >
          <div className="text-[12px] text-ink-3">{label}</div>
          <div className={`${className} font-medium leading-tight text-ink`}>{sample}</div>
        </div>
      ))}
    </div>
  );
}

function ColorPreview() {
  const mainPalette = [
    ['Base', '#FFFFFF', '#000000'],
    ['Grey', '#F9FAFB', '#09090B'],
    ['Primary', '#EFF6FF', '#155DFC'],
    ['Success', '#F0FDF4', '#00C950'],
    ['Warning', '#FFFBEB', '#E17100'],
    ['Error', '#FEF2F2', '#FB2C36'],
  ];
  const secondaryPalette = [
    ['Zinc', '#FAFAFA', '#E4E4E7', '#09090B'],
    ['Slate', '#F8FAFC', '#64748B', '#020617'],
    ['Emerald', '#ECFDF5', '#10B981', '#022C22'],
    ['Sky', '#F0F9FF', '#0EA5E9', '#082F49'],
    ['Violet', '#F5F3FF', '#8B5CF6', '#2E1065'],
    ['Rose', '#FFF1F2', '#F43F5E', '#4C0519'],
  ];
  const utilityPalette = [
    ['surfaceBackground', '#F9FAFB', '#09090B'],
    ['surfaceInput', '#F3F4F6', '#1E2939'],
    ['textPrimary', '#101828', '#F9FAFB'],
    ['textSecondary', '#4A5565', '#99A1AF'],
    ['interactivePrimary', '#155DFC', '#2B7FFF'],
    ['borderError', '#FB2C36', '#FB2C36'],
  ];

  return (
    <div className="space-y-5">
      <PaletteBlock
        title="Main palette"
        description="Base, Grey, Primary, Success, Warning, and Error from the Figma Main Palette frame."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {mainPalette.map(([name, start, end]) => (
            <ScaleRow key={name} name={name} values={[start, end]} />
          ))}
        </div>
      </PaletteBlock>

      <PaletteBlock
        title="Secondary palette"
        description="Extended hues used when a component or product surface needs a broader accent family."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {secondaryPalette.map(([name, start, middle, end]) => (
            <ScaleRow key={name} name={name} values={[start, middle, end]} />
          ))}
        </div>
      </PaletteBlock>

      <PaletteBlock
        title="Utility semantic palette"
        description="The color names registry components consume through theme.colors."
      >
        <div className="overflow-hidden rounded-md border border-line">
          {utilityPalette.map(([name, light, dark]) => (
            <div
              key={name}
              className="grid gap-3 border-b border-line px-3 py-3 last:border-b-0 md:grid-cols-[minmax(0,1.35fr)_minmax(128px,0.85fr)_minmax(128px,0.85fr)]"
            >
              <div className="min-w-0 break-words font-mono text-[12px] leading-relaxed text-ink">
                {name}
              </div>
              <ColorValue label="Light" value={light} />
              <ColorValue label="Dark" value={dark} />
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

function ScaleRow({ name, values }: { name: string; values: string[] }) {
  return (
    <div className="rounded-md border border-line bg-canvas p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[13px] text-ink">{name}</span>
        <span className="font-mono text-[11px] text-ink-3">
          {values.length === 2 ? '50 / 950' : '50 / 500 / 950'}
        </span>
      </div>
      <div
        className="grid h-8 overflow-hidden rounded-sm border border-line"
        style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}
      >
        {values.map((value) => (
          <div key={value} style={{ backgroundColor: value }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-2">
        {values.map((value) => (
          <span key={value} className="font-mono text-[10.5px] text-ink-3">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function ColorValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="size-4 shrink-0 rounded-full border border-line"
          style={{ backgroundColor: value }}
        />
        <span className="text-[11px] text-ink-3">{label}</span>
      </div>
      <span className="min-w-0 break-all text-right font-mono text-[11px] text-ink-2">{value}</span>
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
