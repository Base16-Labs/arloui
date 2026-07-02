import { EffectsDoc } from '@/components/docs/effects-doc';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';

export function EffectsPage() {
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
