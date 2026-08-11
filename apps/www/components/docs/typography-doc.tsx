'use client';

import { useMemo, useState } from 'react';
import { typography } from '@arloui/tokens/typography';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DoDont, RuleCard } from '@/components/docs/doc-cards';
import { cn } from '@/lib/cn';

type Category = 'Display' | 'Heading' | 'Body' | 'Label' | 'Button';
type TypeRow = {
  category: Category;
  token: string;
  label: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  weights: string;
  emphasized?: boolean;
  sample: string;
};

const rowDefinitions = [
  ['Display', 'displayLarge', 'Display large', true, 'Build with clarity'],
  ['Display', 'displayMedium', 'Display medium', true, 'Build with clarity'],
  ['Display', 'displaySmall', 'Display small', true, 'Build with clarity'],
  ['Heading', 'headingLarge', 'Heading large', true, 'Account settings'],
  ['Heading', 'headingMedium', 'Heading medium', true, 'Account settings'],
  ['Heading', 'headingSmall', 'Heading small', true, 'Account settings'],
  ['Body', 'bodyLarge', 'Body large', false, 'Manage your profile and preferences.'],
  ['Body', 'bodyMedium', 'Body medium', false, 'Manage your profile and preferences.'],
  ['Body', 'bodySmall', 'Body small', false, 'Manage your profile and preferences.'],
  ['Label', 'labelLarge', 'Label large', false, 'LAST UPDATED'],
  ['Label', 'labelMedium', 'Label medium', false, 'LAST UPDATED'],
  ['Label', 'labelSmall', 'Label small', false, 'LAST UPDATED'],
  ['Button', 'buttonLarge', 'Button large', false, 'Continue'],
  ['Button', 'buttonMedium', 'Button medium', false, 'Continue'],
  ['Button', 'buttonSmall', 'Button small', false, 'Continue'],
  ['Button', 'buttonLabel', 'Button label', false, 'Continue'],
] as const;

const rows: TypeRow[] = rowDefinitions.map(([category, token, label, emphasized, sample]) => {
  const recipe = typography[token];
  return {
    category,
    token,
    label,
    size: recipe.fontSize,
    lineHeight: recipe.lineHeight,
    letterSpacing: recipe.letterSpacing,
    weights: emphasized ? '400 / 600' : recipe.fontWeight,
    emphasized: emphasized || undefined,
    sample,
  };
});

const categories = ['All', 'Display', 'Heading', 'Body', 'Label', 'Button'] as const;

const configCode = `export const fontFamilies = {
  sans: 'Manrope',
  mono: 'Space Mono',
  display: 'Manrope',
};

export const fontWeights = {
  normal: '400',
  emphasized: '600',
};`;

const usageCode = `import { Text } from '@arloui/primitives';

<Text variant="heading-lg">Account Settings</Text>
<Text variant="body-md">Manage your profile and preferences.</Text>
<Text variant="label-sm" uppercase>Last updated</Text>

<Text variant="body-md" tabularNums>$1,247.50</Text>
<Text variant="body-md" mono>14:32:07</Text>
<Text variant="heading-md" weight="normal">
  This heading uses the normal weight
</Text>`;

export function TypographyDoc() {
  const [font, setFont] = useState<'manrope' | 'inter' | 'serif'>('manrope');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [sort, setSort] = useState<'scale' | 'size-asc' | 'size-desc'>('scale');

  const fontFamily =
    font === 'manrope'
      ? '"Manrope Variable", Manrope, sans-serif'
      : font === 'inter'
        ? 'Inter, system-ui, sans-serif'
        : 'Georgia, serif';

  const visibleRows = useMemo(() => {
    const filtered = category === 'All' ? rows : rows.filter((row) => row.category === category);
    if (sort === 'size-asc') return [...filtered].sort((a, b) => a.size - b.size);
    if (sort === 'size-desc') return [...filtered].sort((a, b) => b.size - a.size);
    return filtered;
  }, [category, sort]);

  return (
    <>
      <TypeSection id="font-configuration" title="Font configuration">
        <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-line bg-surface p-5">
            <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Swapping the typeface
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">
              ArloUI ships with Manrope. Change <code className="font-mono text-ink">fontFamilies.sans</code>{' '}
              once and the scale, rhythm, and hierarchy remain intact.
            </p>
            <div className="mt-5 inline-flex rounded-md border border-line bg-canvas p-1">
              {[
                ['manrope', 'Manrope'],
                ['inter', 'Inter'],
                ['serif', 'Serif'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFont(value as typeof font)}
                  className={cn(
                    'h-7 rounded-sm px-3 text-[12px] transition-colors',
                    font === value ? 'bg-ink text-canvas' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-md border border-line bg-canvas p-4" style={{ fontFamily }}>
              <div className="text-[34px] leading-[1.25]">A scale, not a font.</div>
              <div className="mt-3 text-[14px] leading-[1.4] text-ink-2">
                One family change updates every component that consumes the shared type tokens.
              </div>
            </div>
          </div>
          <CodeBlock language="ts">{configCode}</CodeBlock>
        </div>
      </TypeSection>

      <TypeSection id="type-scale" title="Type scale table">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-md border border-line bg-surface p-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  'h-7 shrink-0 rounded-sm px-2.5 text-[11.5px]',
                  category === item ? 'bg-ink text-canvas' : 'text-ink-2 hover:text-ink',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-[11.5px] text-ink-3">
            Sort
            <div className="relative flex items-center">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as typeof sort)}
                className="appearance-none bg-transparent pr-5 text-ink outline-none"
              >
                <option value="scale">Scale order</option>
                <option value="size-desc">Largest first</option>
                <option value="size-asc">Smallest first</option>
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-0 size-3.5 -translate-y-1/2 text-ink-3"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </label>
        </div>

        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-surface text-[10.5px] uppercase text-ink-3">
              <tr>
                {['Token', 'Size', 'Rem', 'Line height', 'Letter spacing', 'Weight', 'Specimen'].map(
                  (heading) => (
                    <th key={heading} className="border-b border-line px-3 py-3 font-medium">
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, index) => {
                const showGroup =
                  sort === 'scale' &&
                  (index === 0 || visibleRows[index - 1]?.category !== row.category);
                return (
                  <TableRows
                    key={row.token}
                    row={row}
                    showGroup={showGroup}
                    fontFamily={fontFamily}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </TypeSection>

      <TypeSection id="weight-system" title="Weight system">
        <div className="grid gap-3 sm:grid-cols-2">
          <WeightCard
            label="Normal"
            token="fontWeights.normal"
            value="400"
            sample="Hierarchy without shouting"
            fontFamily={fontFamily}
          />
          <WeightCard
            label="Emphasized"
            token="fontWeights.emphasized"
            value="600"
            sample="Hierarchy without shouting"
            fontFamily={fontFamily}
            emphasized
          />
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
          If a replacement face needs 700 to achieve the same visual emphasis, update the weight map
          once rather than overriding individual components.
        </p>
      </TypeSection>

      <TypeSection id="button-typography" title="Button typography">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rows
            .filter((row) => row.category === 'Button')
            .map((row) => (
              <div key={row.token} className="rounded-lg border border-line bg-surface p-4">
                <code className="font-mono text-[10.5px] text-ink-3">{row.token}</code>
                <div
                  className="mt-8 font-semibold text-ink"
                  style={{
                    fontFamily,
                    fontSize: row.size,
                    lineHeight: `${row.lineHeight}px`,
                  }}
                >
                  Continue
                </div>
                <div className="mt-3 font-mono text-[10px] text-ink-3">
                  {row.size}px / {Math.round((row.lineHeight / row.size) * 100)}%
                </div>
              </div>
            ))}
        </div>
      </TypeSection>

      <TypeSection id="specimen" title="Type specimen">
        <div className="overflow-hidden rounded-lg border border-line bg-surface" style={{ fontFamily }}>
          <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-[14px] text-ink-3">
                {font === 'manrope' ? 'Manrope' : font === 'inter' ? 'Inter / system' : 'Georgia'}
              </div>
              <div className="mt-5 text-[72px] leading-none text-ink">Ag</div>
            </div>
            <div className="text-[21px] leading-[1.35] text-ink">
              <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
              <div>abcdefghijklmnopqrstuvwxyz</div>
              <div className="tabular-nums">0123456789 !@#$%^&amp;*()</div>
            </div>
          </div>
          <div className="divide-y divide-line">
            {['Display', 'Heading', 'Body', 'Label', 'Button'].map((group) => {
              const row = rows.find((item) => item.category === group);
              if (!row) return null;
              return (
                <div key={group} className="grid gap-3 px-6 py-5 sm:grid-cols-[120px_1fr] sm:items-center">
                  <div className="font-mono text-[11px] text-ink-3">{group}</div>
                  <div
                    className="min-w-0 break-words text-ink"
                    style={{
                      fontSize: row.size,
                      lineHeight: `${row.lineHeight}px`,
                      letterSpacing: row.letterSpacing,
                      fontWeight: group === 'Button' ? 600 : 400,
                    }}
                  >
                    {row.sample}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TypeSection>

      <TypeSection id="code" title="Code">
        <CodeBlock>{usageCode}</CodeBlock>
      </TypeSection>

      <TypeSection id="tokens" title="Tokens used">
        <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
          {[
            'fontFamilies.sans',
            'fontFamilies.mono',
            'fontFamilies.display',
            'fontWeights.normal',
            'fontWeights.emphasized',
            ...rows.map((row) => `typography.${row.token}`),
          ].map((token) => (
            <div key={token} className="border-b border-line px-4 py-3 last:border-0">
              <code className="font-mono text-[11.5px] text-ink">{token}</code>
            </div>
          ))}
        </div>
      </TypeSection>

      <TypeSection id="rules" title="Rules">
        <div className="grid gap-3 sm:grid-cols-2">
          <RuleCard title="Three sizes" text="Use hero, body, and caption on one screen. Let spacing create the remaining hierarchy." />
          <RuleCard title="Changing numbers" text="Use tabular numerals for prices, counters, timers, and values that update." />
          <RuleCard title="Uppercase labels" text="Add 0.04–0.08em tracking so uppercase metadata does not feel cramped." />
          <RuleCard title="Use the scale" text="Choose the nearest role instead of overriding fontSize inside a component." />
        </div>
      </TypeSection>

      <TypeSection id="do-dont" title="Do · Don’t">
        <div className="space-y-3">
          <DoDont
            doText="Use three sizes per screen and let spacing establish sections."
            dontText="Add a fourth size only to distinguish one more section."
          />
          <DoDont
            doText="Use tabular numerals for any number that changes."
            dontText="Use proportional numerals for prices, counters, or timers."
          />
          <DoDont
            doText="Add tracking to uppercase labels."
            dontText="Set uppercase metadata with default tracking."
          />
          <DoDont
            doText="Swap fontFamilies.sans and test Display plus Body."
            dontText="Override fontSize throughout individual components."
          />
        </div>
      </TypeSection>
    </>
  );
}

function TableRows({
  row,
  showGroup,
  fontFamily,
}: {
  row: TypeRow;
  showGroup: boolean;
  fontFamily: string;
}) {
  const rem = Number((row.size / 16).toFixed(4));
  const lineHeightPercent = Math.round((row.lineHeight / row.size) * 100);
  const tracking = row.letterSpacing === 0 ? '0%' : `${Math.round((row.letterSpacing / row.size) * 100)}%`;

  return (
    <>
      {showGroup ? (
        <tr className="sticky top-0 z-10 bg-canvas">
          <th colSpan={7} className="border-b border-line px-3 py-2 text-[11px] font-medium uppercase text-ink-3">
            {row.category}
          </th>
        </tr>
      ) : null}
      <tr className="border-b border-line last:border-0">
        <td className="px-3 py-4 font-mono text-[10.5px] text-ink">typography.{row.token}</td>
        <td className="px-3 py-4 font-mono text-[10.5px] text-ink-2">{row.size}px</td>
        <td className="px-3 py-4 font-mono text-[10.5px] text-ink-2">{rem}rem</td>
        <td className="px-3 py-4 font-mono text-[10.5px] text-ink-2">{lineHeightPercent}%</td>
        <td className="px-3 py-4 font-mono text-[10.5px] text-ink-2">{tracking}</td>
        <td className="px-3 py-4 font-mono text-[10.5px] text-ink-2">{row.weights}</td>
        <td className="min-w-64 px-3 py-4">
          <div
            className="text-ink"
            style={{
              fontFamily,
              fontSize: row.size,
              lineHeight: `${row.lineHeight}px`,
              letterSpacing: row.letterSpacing,
              fontWeight: row.category === 'Button' ? 600 : 400,
            }}
          >
            {row.sample}
          </div>
          {row.emphasized ? (
            <div
              className="mt-1 text-ink"
              style={{
                fontFamily,
                fontSize: row.size,
                lineHeight: `${row.lineHeight}px`,
                letterSpacing: row.letterSpacing,
                fontWeight: 600,
              }}
            >
              {row.sample}
            </div>
          ) : null}
        </td>
      </tr>
    </>
  );
}

function TypeSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-10 pt-12">
      <h2 className="text-[24px] font-medium leading-tight text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function WeightCard({
  label,
  token,
  value,
  sample,
  fontFamily,
  emphasized,
}: {
  label: string;
  token: string;
  value: string;
  sample: string;
  fontFamily: string;
  emphasized?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <code className="font-mono text-[10.5px] text-ink-3">{token}</code>
        <span className="font-mono text-[11px] text-ink-2">{value}</span>
      </div>
      <div
        className="mt-9 text-[20px] leading-[1.3] text-ink"
        style={{ fontFamily, fontWeight: emphasized ? 600 : 400 }}
      >
        {sample}
      </div>
      <div className="mt-2 text-[12px] text-ink-3">{label}</div>
    </div>
  );
}

// RuleCard and DoDont now live in components/docs/doc-cards.tsx
