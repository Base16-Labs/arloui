import { notFound, redirect } from 'next/navigation';
import type { ComponentProps } from 'react';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CopyButton } from '@/components/ui/CopyButton';
import { Icon } from '@/components/ui/Icon';
import { IconLibrary } from '@/components/icons/icon-library';
import { getAnimatedIconSource, getIconNames } from '@/lib/icon-assets';
import { primitiveItems } from '@/lib/routes';
import { primitiveDocs } from '@/lib/primitive-docs';
import { Section } from './_shared';
import { TypographyPage } from './_pages/typography';
import { EffectsPage } from './_pages/effects';
import { ColorPage } from './_pages/color';
import { SpacingPage } from './_pages/spacing';
import { MotionPage } from './_pages/motion';

type IconName = ComponentProps<typeof Icon>['name'];

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
  if (slug === 'motion') return <MotionPage />;

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
