import { DoDont as PrimitiveDoDont, RuleCard as PrimitiveRuleCard } from '@/components/docs/doc-cards';
import { SpacingTool } from '@/components/docs/spacing-tool';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Icon } from '@/components/ui/Icon';
import { Section } from '../_shared';

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

export function SpacingPage() {
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

