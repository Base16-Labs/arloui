import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { designItems } from "@/lib/routes";

const descriptions: Record<string, string> = {
  "figma-tokens":
    "Import ArloUI's colour, spacing, radius, sizing and type tokens into Figma as variables.",
  paper:
    "Point an agent at the token payload so anything sketched in Paper stays on-system.",
  "figma-library":
    "The component library itself — every primitive as a Figma component set.",
};

/** Pages with nothing behind them yet render as a card, not a dead link. */
const comingSoon = new Set(["figma-library"]);

export default function DesignIndexPage() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Design</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        Design
      </h1>
      <Lede>
        ArloUI is defined in code — the components are the specification. These
        pages are about bringing that system into a design tool, so what you
        draw and what ships stay the same thing.
      </Lede>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {designItems.map((item) => {
          const body = (
            <>
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-ink">{item.label}</span>
                {comingSoon.has(item.slug) && (
                  <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-3">
                    Coming soon
                  </span>
                )}
              </div>
              <div className="mt-1.5 text-sm text-ink-2">
                {descriptions[item.slug]}
              </div>
            </>
          );

          return comingSoon.has(item.slug) ? (
            <div
              key={item.slug}
              className="rounded-xl border border-line border-dashed p-5 opacity-70"
            >
              {body}
            </div>
          ) : (
            <Link
              key={item.slug}
              href={`/docs/design/${item.slug}`}
              className="rounded-xl border border-line p-5 hover:border-line-strong"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              {body}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
