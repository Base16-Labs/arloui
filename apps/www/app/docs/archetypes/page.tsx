import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { archetypeItems } from "@/lib/routes";

const descriptions: Record<string, string> = {
  question: "A title, a body, one or two actions. Confirmation, permission, single-input.",
  decision: "Multiple options, comparison, selection. Picking a plan, choosing a card.",
  status: "Real-time state of a process. Order tracking, upload progress, sync.",
  feed: "Chronological or ranked stream. Timeline, notifications, activity log.",
  detail: "Deep view of a single entity. Profile, transaction receipt, flight info.",
  creation: "Multi-step form or wizard. Onboarding flow, checkout, compose.",
  settings: "Grouped toggles, pickers, navigation rows. App preferences, account.",
  onboarding: "First-run experience. Permissions, value props, account setup.",
  empty: "Zero-data state. First launch, no results, error recovery.",
};

export default function ArchetypesIndexPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Archetypes</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Archetypes
        </h1>
        <Lede>
          Nine compositional patterns that cover every screen shape in a mobile
          app. Each is a recipe — components, tokens, and motion rules wired
          together.
        </Lede>

        <div className="mt-8">
          {archetypeItems.map((item, i) => (
            <section
              key={item.slug}
              id={item.slug}
              className="scroll-mt-24 border-t border-line py-8 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-3.5">
                <span className="font-mono text-[13px] tabular-nums text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-[22px] font-medium tracking-tight text-ink">
                  {item.label}
                </h2>
              </div>
              <p className="mt-2 max-w-[620px] text-[15px] leading-relaxed text-ink-2">
                {descriptions[item.slug]}
              </p>
            </section>
          ))}
        </div>
      </main>

      <RightRail
        headings={archetypeItems.map((item) => ({
          id: item.slug,
          label: item.label,
        }))}
      />
    </>
  );
}
