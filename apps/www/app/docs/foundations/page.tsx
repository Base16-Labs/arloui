import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";

const facets = [
  {
    n: "01",
    label: "Craft",
    slug: "craft",
    desc: "Hierarchy, spacing, alignment, and typography do the heavy lifting.",
  },
  {
    n: "02",
    label: "Fluidity",
    slug: "fluidity",
    desc: "The user should never feel like they teleported.",
  },
  {
    n: "03",
    label: "Opinionated",
    slug: "opinionated",
    desc: "Arlo has a point of view. The defaults are the design.",
  },
  {
    n: "04",
    label: "Detailed",
    slug: "detailed",
    desc: "A great hero with an unconsidered empty state is not a great component.",
  },
];

export default function FoundationsIndexPage() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Foundations</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        Foundations
      </h1>
      <Lede>
        The four facets — why ArloUI looks and feels the way it does. Each is an
        essay, not a reference doc.
      </Lede>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {facets.map((f) => (
          <Link
            key={f.slug}
            href={`/docs/foundations/${f.slug}`}
            className="rounded-xl border border-line p-5 hover:border-line-strong"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Facet {f.n}
            </div>
            <div className="text-lg font-medium text-ink">{f.label}</div>
            <div className="mt-1.5 text-sm text-ink-2">{f.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
