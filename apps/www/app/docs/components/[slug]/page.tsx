import { notFound } from "next/navigation";
import { RightRail } from "@/components/nav/RightRail";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { StateGrid } from "@/components/mdx/StateGrid";
import { DoDont } from "@/components/mdx/DoDont";
import { Pill } from "@/components/ui/Pill";
import { Chip } from "@/components/ui/Chip";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CopyButton } from "@/components/ui/CopyButton";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";
import { componentGroups } from "@/lib/routes";

const sheetData = {
  slug: "sheet",
  category: "Layout & surface",
  title: "Sheet",
  lede: "A bottom-anchored surface with detents — the most-used navigation primitive on mobile, and the moment to demonstrate Fluidity in your UI.",
  figma: "#",
  source: "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/sheet",
  states: [
    "default", "presented", "peek", "dragging", "full", "dismissing",
    "disabled", "loading", "error", "empty", "long content", "RTL",
    "dynamic-type", "reduced motion", "dark mode", "light mode",
  ],
  tokens: ["radius.sheet", "color.scrim", "motion.ease-sheet", "motion.duration-sheet", "space.sheet-pad"],
  headings: [
    { id: "anatomy", label: "Anatomy" },
    { id: "when-to-use", label: "When to use" },
    { id: "archetypes", label: "Archetypes" },
    { id: "variants", label: "Variants" },
    { id: "states", label: "States" },
    { id: "motion", label: "Motion" },
    { id: "code", label: "Code" },
    { id: "tokens", label: "Tokens" },
    { id: "accessibility", label: "Accessibility" },
    { id: "do-dont", label: "Do · Don't" },
    { id: "related", label: "Related" },
  ],
  actions: [
    { label: "View as markdown ↗", href: "/docs/components/sheet.md" },
    { label: "Edit on GitHub ↗", href: "https://github.com/Base16-Labs/arloui" },
  ],
};

export function generateStaticParams() {
  return componentGroups.flatMap((g) =>
    g.items.map((item) => ({ slug: item.slug }))
  );
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug !== "sheet") {
    const exists = componentGroups.some((g) =>
      g.items.some((item) => item.slug === slug)
    );
    if (!exists) notFound();

    return (
      <>
        <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
          <Eyebrow>Component</Eyebrow>
          <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>
          <Lede>This component page is coming soon.</Lede>
        </main>
        <RightRail headings={[]} actions={[]} />
      </>
    );
  }

  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        {/* Page-level copy markdown */}
        <div className="absolute top-10 right-14">
          <CopyButton text="" label="Copy markdown" />
        </div>

        <Eyebrow>{sheetData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {sheetData.title}
        </h1>
        <Lede>{sheetData.lede}</Lede>

        {/* Action pills */}
        <div className="mb-9 flex gap-2">
          <Pill as="a" href={sheetData.figma}>
            ◆ Figma <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={sheetData.source}>
            ⌘ Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        {/* Preview card */}
        <PreviewCard className="mb-12">
          <PhoneFrame>
            <div className="relative h-full">
              <div className="absolute inset-x-0 bottom-0 h-[65%] rounded-t-[24px] bg-white">
                <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-zinc-300" />
                <div className="mt-3 text-center text-[15px] font-semibold">
                  Add Flight
                </div>
                {["XiamenAir · MF · CXA", "United · UA · UAL", "John F Kennedy Intl. · JFK", "Incheon Intl · ICN", "Find by Route", "Find by Flight Number"].map(
                  (row) => (
                    <div
                      key={row}
                      className="flex h-[38px] items-center border-t border-[#f0eee7] px-4 text-xs text-ink-2"
                    >
                      {row}
                    </div>
                  )
                )}
              </div>
            </div>
          </PhoneFrame>
        </PreviewCard>

        {/* Anatomy */}
        <Section id="anatomy" title="Anatomy" sub="Named slots so the spec is unambiguous.">
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] font-mono text-xs text-ink-3 dark:bg-surface-raised">
            handle · header · content · scrim · detent line · safe area
          </div>
        </Section>

        {/* When to use */}
        <Section id="when-to-use" title="When to use" sub="Three rules.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
            <li>For a secondary task that should not interrupt the parent context.</li>
            <li>When the input or selection list is short enough to fit a natural-content detent.</li>
            <li>When dismissal should be available via gesture, not just a button.</li>
          </ul>
        </Section>

        {/* Archetypes */}
        <Section id="archetypes" title="Archetypes that use Sheet" sub="Click an archetype for the full screen recipe.">
          <div className="flex flex-wrap gap-2">
            {["Question", "Sheet over content", "Detail"].map((a) => (
              <Chip key={a}>→ {a}</Chip>
            ))}
          </div>
        </Section>

        {/* Variants */}
        <Section id="variants" title="Variants" sub="Sizes, tones, density. All token-driven.">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-[18px] gap-y-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">Detent</span>
            <div className="flex flex-wrap gap-2">
              <Chip>small</Chip>
              <Chip active>medium</Chip>
              <Chip>large</Chip>
              <Chip>full</Chip>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">Style</span>
            <div className="flex flex-wrap gap-2">
              <Chip active>opaque</Chip>
              <Chip>translucent</Chip>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">Density</span>
            <div className="flex flex-wrap gap-2">
              <Chip active>comfortable</Chip>
              <Chip>compact</Chip>
            </div>
          </div>
        </Section>

        {/* States */}
        <Section id="states" title="States" sub="Hover any cell to update the device preview above. Click to pin.">
          <StateGrid states={sheetData.states} />
        </Section>

        {/* Motion */}
        <Section id="motion" title="Motion" sub="Curves, durations, reduced-motion behavior.">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex h-[130px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] font-mono text-xs text-ink-3 dark:bg-surface-raised">
              --arlo-ease-sheet
            </div>
            <div className="flex h-[130px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] font-mono text-xs text-ink-3 dark:bg-surface-raised">
              280–360ms enter · 220–290ms exit
            </div>
          </div>
        </Section>

        {/* Code */}
        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npm install @arloui/sheet

import { Sheet } from "@arloui/sheet";

<Sheet detents={["medium","full"]}>
  ...
</Sheet>`}</CodeBlock>
        </Section>

        {/* Tokens used */}
        <Section id="tokens" title="Tokens used" sub="Click any to jump to its definition in /docs/primitives/tokens.">
          <div className="flex flex-wrap gap-2">
            {sheetData.tokens.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-[#f8f6ef] px-2.5 py-[5px] font-mono text-xs text-ink-2 dark:bg-surface-raised"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

        {/* Accessibility */}
        <Section id="accessibility" title="Accessibility" sub="Screen reader semantics, focus, dismissal.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
            <li>VoiceOver / TalkBack announces as a modal sheet.</li>
            <li>Focus traps inside the sheet; Esc / hardware back dismisses.</li>
            <li>Respects prefers-reduced-motion — fades instead of slides.</li>
          </ul>
        </Section>

        {/* Do / Don't */}
        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: "Detent at content height; reach for full only when content demands it.",
                dont: "Spring straight to full on a row tap — it teleports the user.",
              },
              {
                do: "Dismiss on velocity ≥ 0.11 px/ms, not just distance.",
                dont: "Require an explicit close button when a swipe dismiss is available.",
              },
            ]}
          />
        </Section>

        {/* Related */}
        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {["Tray", "Scrim", "Picker", "Modal (rare)"].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={sheetData.headings} actions={sheetData.actions} />
    </>
  );
}

function Section({
  id,
  title,
  sub,
  children,
}: {
  id: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">{title}</h2>
      {sub && <p className="mt-1.5 mb-5 text-[13px] text-ink-3">{sub}</p>}
      {children}
    </section>
  );
}
