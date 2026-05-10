import { notFound } from "next/navigation";
import { RightRail } from "@/components/nav/RightRail";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { CopyButton } from "@/components/ui/CopyButton";
import { FootnoteRef, Footnotes } from "@/components/mdx/Footnote";

const foundationSlugs = ["craft", "fluidity", "opinionated", "detailed"];

const fluidityData = {
  headings: [
    { id: "four-jobs", label: "The four jobs of motion" },
    { id: "sheets", label: "Sheets are first-class" },
    { id: "ten-rules", label: "The ten Fluidity rules" },
  ],
  actions: [
    { label: "View as markdown ↗", href: "/docs/foundations/fluidity.md" },
    { label: "Edit on GitHub ↗", href: "https://github.com/Base16-Labs/arloui" },
  ],
  footnotes: [
    {
      n: 1,
      content: "The four words are origin, state, feedback, and continuity. See also skill.md §2.1.",
    },
    {
      n: 2,
      content: "Sheets get their own pattern page at /docs/components/sheet and a section in the Sheet over content archetype.",
    },
    {
      n: 3,
      content: "The 0.11 px/ms threshold is from iOS UIKit conventions and matches what Cash App, Family, and Flighty use in production.",
    },
  ],
};

export function generateStaticParams() {
  return foundationSlugs.map((slug) => ({ slug }));
}

export default async function FoundationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!foundationSlugs.includes(slug)) notFound();

  if (slug !== "fluidity") {
    return (
      <>
        <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20">
          <Eyebrow>
            Foundations · Facet{" "}
            {String(foundationSlugs.indexOf(slug) + 1).padStart(2, "0")}
          </Eyebrow>
          <h1 className="mt-3 text-[64px] font-medium leading-none tracking-tight">
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>
          <p className="mt-5 max-w-[560px] text-[22px] leading-relaxed text-ink-2">
            This foundation essay is coming soon.
          </p>
        </main>
        <RightRail headings={[]} actions={[]} />
      </>
    );
  }

  return (
    <>
      <main className="relative flex-1 px-8 pt-10 pb-20">
        {/* Copy markdown */}
        <div className="absolute top-10 right-8 z-[3]">
          <CopyButton text="" label="Copy markdown" />
        </div>

        {/* Two-column essay layout */}
        <div className="grid max-w-[920px] grid-cols-[1fr_280px] gap-14">
          {/* Prose column */}
          <div className="max-w-[580px]">
            <Eyebrow>Foundations · Facet 02</Eyebrow>
            <h1 className="mt-3 text-[64px] font-medium leading-none tracking-tight">
              Fluidity
            </h1>
            <p className="mt-[22px] mb-12 max-w-[560px] text-[22px] leading-relaxed text-ink">
              The user should never feel like they teleported.{" "}
              <em className="text-ink-2">
                Movement explains where they came from and where they are going.
              </em>
            </p>

            {/* Meta row */}
            <div className="mb-16 flex items-center gap-[18px] border-y border-line py-3.5 text-xs text-ink-3">
              <span>10 min read</span>
              <span className="h-[3px] w-[3px] rounded-full bg-ink-4" />
              <span>Updated May 9, 2026</span>
              <span className="h-[3px] w-[3px] rounded-full bg-ink-4" />
              <span>v0.1</span>
            </div>

            <p className="mb-[18px] text-[19px] leading-relaxed text-ink-2">
              Fluidity is not &ldquo;more animation.&rdquo; It is the rule that
              every transition should be explainable as movement through a
              coherent space. Most apps fail this not because they animate too
              little, but because they animate without intent.
            </p>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Arlo treats motion as a language with four words
              <FootnoteRef n={1} /> and a small grammar. Get those right and
              everything else follows.
            </p>

            {/* The four jobs */}
            <h2
              id="four-jobs"
              className="mt-14 mb-4 text-[32px] font-medium leading-tight tracking-tight"
            >
              The four jobs of motion
            </h2>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Every animation must do at least one of these. If none, remove it.
            </p>

            <ul className="mb-[22px] space-y-2 pl-6 text-[17px] leading-relaxed">
              <li>
                <strong>Origin</strong> — show where a thing came from. A
                popover from its trigger; a sheet from its row.
              </li>
              <li>
                <strong>State</strong> — make a change in status legible.{" "}
                <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-sm dark:bg-surface-raised">
                  Continue
                </code>{" "}
                →{" "}
                <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-sm dark:bg-surface-raised">
                  Confirm
                </code>
                .
              </li>
              <li>
                <strong>Feedback</strong> — confirm the system heard the user.
                Press, drag, dismiss.
              </li>
              <li>
                <strong>Continuity</strong> — preserve elements that exist on
                both sides of a transition.
              </li>
            </ul>

            {/* Sheets are first-class */}
            <h2
              id="sheets"
              className="mt-14 mb-4 text-[32px] font-medium leading-tight tracking-tight"
            >
              Sheets are first-class
            </h2>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Sheets are the primary navigation primitive on mobile in 2026.
              Every Arlo app should use them well
              <FootnoteRef n={2} />.
            </p>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Default to a content-sized detent plus a full-screen detent. Never
              spring straight to full from a row tap — it teleports the user,
              which is exactly the failure mode Fluidity was named to prevent.
            </p>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              The dim of the parent isn&apos;t decoration. It&apos;s the signal
              that focus has shifted, and the same signal carries the gesture:
              drag the sheet down past 35% of its detent, or release with a
              velocity above 0.11 px/ms, and it commits to dismiss
              <FootnoteRef n={3} />.
            </p>

            <blockquote className="my-6 border-l-2 border-ink pl-5 text-[19px] italic leading-relaxed">
              A sheet at its smallest detent should be tall enough that the
              title and primary action are visible without dragging.
            </blockquote>

            {/* The ten rules */}
            <h2
              id="ten-rules"
              className="mt-14 mb-4 text-[32px] font-medium leading-tight tracking-tight"
            >
              The ten Fluidity rules
            </h2>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              These are non-negotiable. They are how Arlo apps feel like Arlo
              apps.
            </p>

            <h3 className="mt-9 mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Rule 01 · Never animate from scale(0)
            </h3>
            <p className="mb-[18px] text-[17px] leading-relaxed">
              Nothing in the real world appears from nothing. Start at{" "}
              <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-sm dark:bg-surface-raised">
                scale(0.94–0.97)
              </code>{" "}
              with{" "}
              <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-sm dark:bg-surface-raised">
                opacity: 0
              </code>
              .
            </p>

            <h3 className="mt-9 mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Rule 02 · Pressables respond instantly
            </h3>
            <p className="text-[17px] leading-relaxed text-ink-3 italic">
              … continues for all ten rules.
            </p>

            {/* Footnotes */}
            <Footnotes notes={fluidityData.footnotes} />
          </div>

          {/* Companion column */}
          <aside className="relative">
            <div className="sticky top-[120px] mt-10">
              <PhoneFrame>
                <div className="relative h-full">
                  <div className="absolute inset-x-0 bottom-0 h-[65%] rounded-t-[24px] bg-white">
                    <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-zinc-300" />
                    <div className="mt-3 text-center text-[15px] font-semibold">
                      Add Flight
                    </div>
                    {[
                      "XiamenAir · MF · CXA",
                      "United · UA · UAL",
                      "JFK · John F Kennedy",
                      "ICN · Incheon",
                      "Find by Route",
                      "Find by Number",
                    ].map((row) => (
                      <div
                        key={row}
                        className="flex h-[38px] items-center border-t border-[#f0eee7] px-4 text-xs text-ink-2"
                      >
                        {row}
                      </div>
                    ))}
                  </div>
                </div>
              </PhoneFrame>
              <p className="mx-auto mt-4 max-w-[240px] text-center text-[13px] italic leading-snug text-ink-2">
                <strong className="not-italic font-medium text-ink">
                  Sheets are first-class.
                </strong>{" "}
                Content-sized detent with handle and title visible at peek.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <RightRail
        headings={fluidityData.headings}
        actions={fluidityData.actions}
      />
    </>
  );
}
