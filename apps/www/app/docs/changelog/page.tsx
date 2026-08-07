import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { componentCount } from "@/lib/routes";

export default function ChangelogPage() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Changelog</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        Changelog
      </h1>
      <Lede>
        What shipped, what changed, what broke. Reverse-chronological.
      </Lede>

      <div className="mt-12 border-l border-line pl-6">
        <div className="mb-10">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
            May 2026
          </div>
          <h2 className="mb-2 text-xl font-medium">v0.1.0 — Initial release</h2>
          <p className="text-[15px] leading-relaxed text-ink-2">
            First public release of ArloUI. {componentCount} components, 6
            primitives, 9 archetypes, and the skill pack.
          </p>
        </div>
      </div>
    </main>
  );
}
