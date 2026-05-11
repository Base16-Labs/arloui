import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { primitiveItems } from "@/lib/routes";

const slugs: readonly string[] = primitiveItems.map((i) => i.slug);

const meta: Record<string, { lede: string }> = {
  tokens: { lede: "The raw values — radii, shadows, durations — that every component references." },
  type: { lede: "PP Neue Montreal, the type scale, and the rules for using it." },
  color: { lede: "Semantic palette, surface hierarchy, and dark mode." },
  spacing: { lede: "The 4 px grid, named steps, and when to break the grid." },
  motion: { lede: "Easing curves, durations, spring configs, and the Fluidity contract." },
  icons: { lede: "Phosphor-based icon set — 2,980 glyphs, React Native SVG." },
};

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function PrimitivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();

  const item = primitiveItems.find((i) => i.slug === slug)!;

  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Primitives</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        {item.label}
      </h1>
      <Lede>{meta[slug]?.lede}</Lede>
      <p className="mt-10 text-[17px] leading-relaxed text-ink-2">
        This primitive reference is coming soon.
      </p>
    </main>
  );
}
