import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { CopyButton } from "@/components/ui/CopyButton";
import { FootnoteRef, Footnotes } from "@/components/mdx/Footnote";
import {
  CompanionLayout,
  CompanionPanel,
  EssaySection,
} from "@/components/mdx/Companion";
import { Icon } from "@/components/ui/Icon";
import { ESSAYS } from "@/lib/docs-markdown";

const foundationSlugs = ["craft", "fluidity", "opinionated", "detailed"];

const fluidityData = {
  footnotes: [
    {
      n: 1,
      content:
        "The four words are origin, state, feedback, and continuity. See also skill.md §2.1.",
    },
    {
      n: 2,
      content:
        "Sheets get their own pattern page at /docs/components/sheet and a section in the Sheet over content archetype.",
    },
    {
      n: 3,
      content:
        "The 0.11 px/ms threshold is from iOS UIKit conventions and matches what Cash App, Family, and Flighty use in production.",
    },
  ],
};

function CompanionContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[32px] bg-surface-sunken p-6 ring-1 ring-line">
      <div className="absolute inset-x-0 top-6 z-10 flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-glass-bg p-1.5 backdrop-blur-[var(--glass-blur)] ring-1 ring-glass-border">
          {[
            { icon: "qr-code" as const, label: "Refresh" },
            { icon: "copy" as const, label: "Code" },
            { icon: "github-logo" as const, label: "Github" },
          ].map((action) => (
            <div key={action.label} className="group relative flex">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-line-strong hover:text-ink"
                aria-label={action.label}
              >
                <Icon name={action.icon} size={14} />
              </button>
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[11px] font-medium text-canvas opacity-0 transition-opacity group-hover:opacity-100">
                {action.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-14 flex items-center justify-center">{children}</div>
    </div>
  );
}

function SheetCompanion() {
  return (
    <CompanionContainer>
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
              "John F Kennedy Intl. · JFK",
              "Incheon Intl · ICN · RKSI",
              "Find by Route",
              "Find by Flight Number",
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
    </CompanionContainer>
  );
}

function OriginCompanion() {
  return (
    <CompanionContainer>
      <PhoneFrame>
        <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6">
          <div className="w-full rounded-xl border border-[#f0eee7] bg-white px-4 py-3 text-center text-xs font-medium text-ink">
            Origin Trigger
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-ink-3"
          >
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="w-full rounded-xl bg-white px-4 py-4 shadow-lg ring-1 ring-line">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-zinc-200" />
            <div className="text-center text-xs font-semibold">Expanded State</div>
          </div>
        </div>
      </PhoneFrame>
    </CompanionContainer>
  );
}

function RulesCompanion() {
  return (
    <CompanionContainer>
      <PhoneFrame>
        <div className="flex h-full flex-col items-center justify-center gap-4 px-5">
          <div className="flex w-full flex-col gap-2">
            <div
              className="rounded-lg bg-white px-4 py-3 text-xs font-medium shadow-sm ring-1 ring-line"
              style={{ transform: "scale(0.97)", opacity: 0.5 }}
            >
              scale(0.97) + opacity: 0
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="mx-auto text-ink-3"
            >
              <path
                d="M8 3v10M3 8l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
            <div className="rounded-lg bg-white px-4 py-3 text-xs font-medium shadow-sm ring-1 ring-line">
              scale(1) + opacity: 1
            </div>
          </div>
        </div>
      </PhoneFrame>
    </CompanionContainer>
  );
}

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
      <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20">
        <Eyebrow>
          Foundations · Facet{" "}
          {String(foundationSlugs.indexOf(slug) + 1).padStart(2, "0")}
        </Eyebrow>
        <h1 className="mt-3 text-[64px] font-medium leading-none tracking-tight">
          {slug.charAt(0).toUpperCase() + slug.slice(1)}
        </h1>
        <p className="mt-5 max-w-[560px] text-[14px] leading-relaxed text-ink-2">
          This foundation essay is coming soon.
        </p>
      </main>
    );
  }

  return (
    <main className="relative flex-1 px-8 pt-10 pb-20">
      <CompanionLayout>
        <div className="max-w-[600px] pb-[40vh]">
          <EssaySection id="intro" className="mb-24">
            <Eyebrow>Foundations · Facet 02</Eyebrow>
            <div className="mt-3 flex items-center gap-4">
              <h1 className="text-[56px] font-medium leading-none tracking-tight">
                Fluidity
              </h1>
              <div className="pt-2">
                <CopyButton text={ESSAYS.fluidity} label="Copy markdown" />
              </div>
            </div>
            <p className="mt-[22px] mb-12 max-w-[560px] text-[14px] leading-relaxed text-ink">
              The user should never feel like they teleported.{" "}
              <em className="text-ink-2">
                Movement explains where they came from and where they are
                going.
              </em>
            </p>

            <p className="mb-[18px] text-[17px] leading-relaxed text-ink-2">
              Fluidity is not &ldquo;more animation.&rdquo; It is the rule
              that every transition should be explainable as movement through
              a coherent space. Most apps fail this not because they animate
              too little, but because they animate without intent — a sheet
              that drops in from nowhere, a button that flashes for no reason
              a person could name.
            </p>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Arlo treats motion as a language with four words
              <FootnoteRef n={1} /> and a small grammar. Get those right and
              everything else follows.
            </p>
          </EssaySection>

          <EssaySection id="four-jobs" className="mb-32">
            <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
              The four jobs of motion
            </h2>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Every animation must do at least one of these. If none, remove
              it.
            </p>

            <ul className="mb-[22px] space-y-2 pl-0 text-[17px] leading-relaxed">
              <li>
                <strong>Origin</strong> — show where a thing came from. A
                popover from its trigger; a sheet from its row.
              </li>
              <li>
                <strong>State</strong> — make a change in status legible.{" "}
                <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-sm dark:bg-surface-raised">
                  Continue
                </code>{" "}
                &rarr;{" "}
                <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-sm dark:bg-surface-raised">
                  Confirm
                </code>
                . Loading &rarr; loaded.
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
          </EssaySection>

          <EssaySection id="sheets">
            <h2 className="mt-14 mb-4 text-[28px] font-medium leading-tight tracking-tight">
              Sheets are first-class
            </h2>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Sheets are the primary navigation primitive on mobile in 2026.
              Every Arlo app should use them well
              <FootnoteRef n={2} />.
            </p>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              Default to a content-sized detent plus a full-screen detent.
              Never spring straight to full from a row tap — it teleports the
              user, which is exactly the failure mode Fluidity was named to
              prevent.
            </p>

            <p className="mb-[18px] text-[17px] leading-relaxed">
              The dim of the parent isn&apos;t decoration. It&apos;s the
              signal that focus has shifted, and the same signal carries the
              gesture: drag the sheet down past 35% of its detent, or release
              with a velocity above 0.11 px/ms, and it commits to dismiss
              <FootnoteRef n={3} />. Boundaries dampen, never hard-stop.
            </p>
          </EssaySection>

          <EssaySection id="ten-rules">
            <h2 className="mt-14 mb-4 text-[28px] font-medium leading-tight tracking-tight">
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
              ... continues for all ten rules.
            </p>
          </EssaySection>
        </div>

        <CompanionPanel
          sections={{
            intro: <SheetCompanion />,
            "four-jobs": <OriginCompanion />,
            sheets: <SheetCompanion />,
            "ten-rules": <RulesCompanion />,
          }}
        />
      </CompanionLayout>

      {/* Footnotes — aligned with prose column, no companion */}
      <div className="mt-20 max-w-[600px]">
        <Footnotes notes={fluidityData.footnotes} />
      </div>
    </main>
  );
}
