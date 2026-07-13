import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { agentItems } from "@/lib/routes";

const slugs: readonly string[] = agentItems.map((i) => i.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();

  const item = agentItems.find((i) => i.slug === slug)!;

  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Agents</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        {item.label}
      </h1>
      <Lede>This agent affordance page is coming soon.</Lede>
      <p className="mt-10 text-[17px] leading-relaxed text-ink-2">
        The {item.label} reference will be documented here.
      </p>
    </main>
  );
}
