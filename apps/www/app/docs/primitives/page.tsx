import Link from 'next/link';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { primitiveItems } from '@/lib/routes';

const descriptions: Record<string, string> = {
  type: 'Font-agnostic scale, Manrope default, weights, specimens, and usage rules.',
  color: 'Semantic palette, surface hierarchy, and dark mode.',
  spacing: 'The 4 px grid, named steps, and when to break the grid.',
  effects: 'Shadows, focus rings, blurs, and glass materials.',
  motion: 'Easing curves, durations, spring configs, and the Fluidity contract.',
  icons: 'Phosphor-based icon set — 2,980 glyphs, React Native SVG.',
};

export default function PrimitivesIndexPage() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Primitives</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">Primitives</h1>
      <Lede>
        Tokens, type scale, color, spacing, motion, effects, icons — the raw ingredients every
        component is built from.
      </Lede>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {primitiveItems.map((item) => (
          <Link
            key={item.slug}
            href={`/docs/primitives/${item.slug}`}
            className="rounded-xl border border-line p-5 hover:border-line-strong"
            style={{ transitionDuration: 'var(--dur-fast)' }}
          >
            <div className="text-base font-medium text-ink">{item.label}</div>
            <div className="mt-1.5 text-sm text-ink-2">{descriptions[item.slug]}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
