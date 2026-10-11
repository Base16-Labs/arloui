import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Pill } from "@/components/ui/Pill";
import { FIGMA_FILE_URL } from "@/lib/figma";
import { designItems } from "@/lib/routes";

const slugs: readonly string[] = designItems.map((i) => i.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function DesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();
  if (slug === "figma-tokens") return <FigmaTokensDoc />;
  if (slug === "paper") return <PaperDoc />;
  return <FigmaLibraryDoc />;
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <h2 className="text-[22px] font-medium tracking-tight text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-2">
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ figma tokens */

const figmaHeadings = [
  { id: "what-you-get", label: "What you get" },
  { id: "import", label: "Import" },
  { id: "preview", label: "Preview first" },
  { id: "updating", label: "Updating" },
];

function FigmaTokensDoc() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Design</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Tokens in Figma
        </h1>
        <Lede>
          ArloUI&apos;s tokens live in code. This puts them into Figma as
          variables, so a design binds to the same values the app renders.
        </Lede>

        <Section id="what-you-get" title="What you get">
          <p>
            Six variable collections, generated from{" "}
            <code className="text-ink">@arloui/tokens</code>:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <b className="text-ink">COLOR — PRIMITIVES</b> — the raw ramps
              (<code>Grey/500</code>, <code>Primary/600</code>) plus alpha steps.
            </li>
            <li>
              <b className="text-ink">COLOR — SEMANTIC</b> — the roles components
              actually read (<code>Surfaces &amp; Backgrounds/surface-background</code>,{" "}
              <code>Text &amp; Content/text-primary</code>), with Light and Dark modes.
            </li>
            <li>
              <b className="text-ink">SPACING</b>, <b className="text-ink">BORDER RADIUS</b>,{" "}
              <b className="text-ink">SIZING</b>, <b className="text-ink">TYPOGRAPHY</b>.
            </li>
          </ul>
          <p>
            Bind to the semantic collection wherever you can. Dark mode then
            works by switching the mode, with no second set of layers — that is
            the whole reason the roles exist.
          </p>
        </Section>

        <Section id="import" title="Import">
          <p>
            Figma&apos;s Variables REST API is Enterprise-only, so the import
            runs as a local plugin instead. It works on any plan.
          </p>
          <ol className="ml-5 list-decimal space-y-2">
            <li>
              Clone the repo and generate the payload:
              <CodeBlock language="bash">npm run design:sync</CodeBlock>
            </li>
            <li>
              In Figma: <b className="text-ink">Plugins → Development → Import
              plugin from manifest…</b> and choose{" "}
              <code>tooling/figma-variables-sync/manifest.json</code>.
            </li>
            <li>
              Run it, then drop in{" "}
              <code>tooling/figma-variables-sync/tokens.figma.json</code>.
            </li>
          </ol>
        </Section>

        <Section id="preview" title="Preview first">
          <p>
            The plugin previews before it writes. Read the numbers — they tell
            you whether names line up:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <b className="text-ink">= same</b> — matched an existing variable.
              This is what you want on a file that already has tokens.
            </li>
            <li>
              <b className="text-ink">~ changed</b> — matched, value differs.
              Figma was stale; the import fixes it.
            </li>
            <li>
              <b className="text-ink">+ new</b> — no match. Expected on a fresh
              file. On a file that already has tokens, a large{" "}
              <code>+ new</code> count means the names diverged and you are about
              to get duplicates. Stop and reconcile instead.
            </li>
          </ul>
          <p>
            Nothing is ever deleted. Variables in Figma with no counterpart in
            code are listed as orphans and left alone.
          </p>
        </Section>

        <Section id="updating" title="Updating">
          <p>
            Re-run <code>design:sync</code> and import again. Matching is by
            name, so variable IDs stay stable and existing bindings survive.
          </p>
          <p>
            The payload is committed and CI fails if it drifts from the token
            source, so the file you import is never behind the code.
          </p>
        </Section>
      </main>
      <RightRail headings={figmaHeadings} />
    </>
  );
}

/* ------------------------------------------------------------------ paper */

const paperHeadings = [
  { id: "connect", label: "Connect" },
  { id: "tokens", label: "Add the tokens" },
  { id: "using", label: "Using them" },
];

function PaperDoc() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Design</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Tokens in Paper
        </h1>
        <Lede>
          Paper is agent-driven, so the fastest route is to hand your agent the
          token payload and let it create them.
        </Lede>

        <Section id="connect" title="Connect">
          <p>
            Connect the Paper MCP server to your agent. Paper&apos;s own docs
            cover the setup; nothing ArloUI-specific is needed.
          </p>
        </Section>

        <Section id="tokens" title="Add the tokens">
          <p>
            Point the agent at the generated payload and ask it to create the
            tokens in your file:
          </p>
          <CodeBlock language="text">{`Create these as Paper design tokens, in the order given:
tooling/figma-variables-sync/tokens.paper.json`}</CodeBlock>
          <p>
            The payload is already ordered the way Paper wants — palette first,
            then the semantic roles that alias it. Semantic tokens are emitted as{" "}
            <code>var(--color-…)</code> references, so re-pointing a palette
            value updates everything built on it.
          </p>
          <p>
            Paper holds one value per token, so light is the canonical set and
            dark ships alongside as <code>--color-dark-*</code>.
          </p>
        </Section>

        <Section id="using" title="Using them">
          <p>
            Reference tokens rather than hex when you or your agent write
            layers:
          </p>
          <CodeBlock language="css">{`background-color: var(--color-surface-elevated);
color: var(--color-text-primary);
padding: var(--spacing-5);
border-radius: var(--radius-2xl);`}</CodeBlock>
          <p>
            A hardcoded value looks identical and stops tracking the system the
            moment anything changes, which is the failure worth avoiding.
          </p>
        </Section>
      </main>
      <RightRail headings={paperHeadings} />
    </>
  );
}

/* ---------------------------------------------------------- figma library */

const libraryHeadings = [
  { id: "get-it", label: "Get the file" },
  { id: "whats-inside", label: "What's inside" },
  { id: "how-its-built", label: "How it's built" },
  { id: "figma-and-code", label: "Figma and code" },
];

function FigmaLibraryDoc() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Design</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Figma UI library
        </h1>
        <Lede>
          Every ArloUI component as a Figma component set, bound to the same
          tokens the app renders — in light and dark.
        </Lede>

        <div className="mb-2 flex gap-2">
          <Pill as="a" href={FIGMA_FILE_URL}>
            <img src="/icons/figma.svg" alt="" className="h-3.5 w-3.5" aria-hidden="true" /> Open in Figma{" "}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <Section id="get-it" title="Get the file">
          <ol className="ml-5 list-decimal space-y-2">
            <li>
              <a href={FIGMA_FILE_URL} className="text-ink underline underline-offset-4">
                Open the library
              </a>{" "}
              and duplicate it into your drafts.
            </li>
            <li>
              Move the copy into your team and publish it from the{" "}
              <b className="text-ink">Assets</b> panel. Your other files can then
              enable it as a library and use its components, variables and
              styles.
            </li>
          </ol>
          <p>
            Every component page in these docs links to its place in the file,
            and each page in the file links back to its docs page.
          </p>
        </Section>

        <Section id="whats-inside" title="What's inside">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <b className="text-ink">Foundations</b> — colour, typography,
              icons, spacing and sizing, elevation and materials, each documented
              on its own page.
            </li>
            <li>
              <b className="text-ink">Components</b> — buttons (including Liquid
              Glass and the FAB), inputs, text area, toggle, checkbox, radio,
              stepper, badge, chip, tabs, tab bar, date picker, gallery,
              carousel, sheet, card, list, spinner, toast, and all six chart
              forms.
            </li>
            <li>
              <b className="text-ink">Examples</b> — each component in real
              layouts on a phone frame, light and dark side by side.
            </li>
          </ul>
          <p>
            Skeleton is code-only for now.
          </p>
        </Section>

        <Section id="how-its-built" title="How it's built">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <b className="text-ink">Variables, not values.</b> Fills, strokes,
              spacing and radii bind to the same collections described in{" "}
              <Link href="/docs/design/figma-tokens" className="text-ink underline underline-offset-4">
                Tokens in Figma
              </Link>
              . Switch a frame&apos;s mode to Dark and everything inside follows,
              Liquid Glass included.
            </li>
            <li>
              <b className="text-ink">Text styles</b> for all type, matching the
              typography scale in code.
            </li>
            <li>
              <b className="text-ink">Phosphor icons</b> as instances, so any
              glyph can be swapped from the instance menu.
            </li>
            <li>
              <b className="text-ink">Slots</b> where a component holds content —
              a card body, a sheet, a list row — so you drop in other components
              instead of detaching.
            </li>
          </ul>
        </Section>

        <Section id="figma-and-code" title="Figma and code">
          <p>
            Code is the specification; the file mirrors it. Where the two
            differ, it is in approach, not in values. Figma ships fewer variants
            with strong defaults — a card comes prestyled per surface, where
            code exposes surface, border, elevation and padding as separate
            props. Each page header in the file notes where that applies.
          </p>
        </Section>
      </main>
      <RightRail headings={libraryHeadings} />
    </>
  );
}
