import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
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

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {archetypeItems.map((item, i) => (
          <Link
            key={item.slug}
            href={`/docs/archetypes/${item.slug}`}
            className="rounded-xl border border-line p-5 hover:border-line-strong"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="text-base font-medium text-ink">{item.label}</div>
            <div className="mt-1.5 text-sm text-ink-2">
              {descriptions[item.slug]}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
