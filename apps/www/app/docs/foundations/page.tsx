import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";

const facets = [
  {
    n: "01",
    label: "Craft",
    slug: "craft",
    desc: "Hierarchy, spacing, alignment, and typography do the heavy lifting. Decoration is a last resort.",
  },
  {
    n: "02",
    label: "Fluidity",
    slug: "fluidity",
    desc: "Interactions feel alive because they obey a consistent sense of space, not because they bounce. The app is one continuous surface.",
  },
  {
    n: "03",
    label: "Opinionated",
    slug: "opinionated",
    desc: "Arlo has a point of view. Strong defaults mean the average use is already good — customization is permitted, abandonment is not.",
  },
  {
    n: "04",
    label: "Detailed",
    slug: "detailed",
    desc: "A component is finished when its rare states — empty, error, long content, slow network, accessibility — are as considered as the happy path.",
  },
  {
    n: "05",
    label: "Extensible",
    slug: "extensible",
    desc: "Components are primitives, not products. They compose into anything — a banking dashboard, a journaling app — without being rewritten.",
  },
];

export default function FoundationsIndexPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Facets</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Facets
        </h1>
        <Lede>
          The five facets — why ArloUI looks and feels the way it does. Every
          decision traces back to one of them. Full essays are coming soon.
        </Lede>

        <div className="mt-8">
          {facets.map((f) => (
            <section
              key={f.slug}
              id={f.slug}
              className="scroll-mt-24 border-t border-line py-8 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-3.5">
                <span className="font-mono text-[13px] tabular-nums text-ink-3">
                  {f.n}
                </span>
                <h2 className="text-[22px] font-medium tracking-tight text-ink">
                  {f.label}
                </h2>
              </div>
              <p className="mt-2 max-w-[620px] text-[15px] leading-relaxed text-ink-2">
                {f.desc}
              </p>
            </section>
          ))}
        </div>
      </main>

      <RightRail
        headings={facets.map((f) => ({ id: f.slug, label: f.label }))}
      />
    </>
  );
}
