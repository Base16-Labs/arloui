import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { archetypeItems } from "@/lib/routes";

const slugs: readonly string[] = archetypeItems.map((i) => i.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function ArchetypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();

  const item = archetypeItems.find((i) => i.slug === slug)!;
  const index = archetypeItems.indexOf(item);

  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>
        Archetypes · {String(index + 1).padStart(2, "0")}
      </Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        {item.label}
      </h1>
      <Lede>This archetype page is coming soon.</Lede>
      <p className="mt-10 text-[17px] leading-relaxed text-ink-2">
        The {item.label} archetype reference — components, layout recipe, motion
        rules, and example code — will be documented here.
      </p>
    </main>
  );
}
