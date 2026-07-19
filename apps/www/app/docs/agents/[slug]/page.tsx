import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { McpClientTabs } from "@/components/docs/mcp-clients";
import { agentItems } from "@/lib/routes";

const slugs: readonly string[] = agentItems.map((i) => i.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();

  if (slug === "mcp") return <McpDoc />;

  const item = agentItems.find((i) => i.slug === slug)!;

  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Agents</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        {item.label}
      </h1>
      <Lede>This agent affordance page is coming soon.</Lede>
      <p className="mt-10 text-[17px] leading-relaxed text-ink-2">
        The {item.label} reference will be documented here.
      </p>
    </main>
  );
}

const headings = [
  { id: "connect", label: "Connect" },
  { id: "tools", label: "Tools" },
  { id: "how-it-works", label: "How it works" },
  { id: "prompts", label: "Example prompts" },
  { id: "configuration", label: "Configuration" },
];

const TOOLS: Array<{ name: string; desc: string }> = [
  {
    name: "arlo_search",
    desc: "Search components and foundations by natural-language query. Returns a ranked list with ids, summaries, and page urls.",
  },
  {
    name: "arlo_get_component",
    desc: "Full spec for one component: description, variants, dependencies, the tokens it uses, and the React Native source.",
  },
  {
    name: "arlo_get_token",
    desc: "Resolve a semantic colour token (e.g. surfaceInput, interactivePrimary) to its light and dark values.",
  },
  {
    name: "arlo_get_archetype",
    desc: "Spec for one of the nine screen archetypes: hierarchy mapping, primitive composition, examples, and gotchas.",
  },
  {
    name: "arlo_get_foundation",
    desc: "Pull a foundation topic as markdown — spacing, type, motion, color, effects, icons, or a facet essay.",
  },
  {
    name: "arlo_get_recipe",
    desc: "Spec for a block/recipe (a full-screen example): composition tree, primitives used, archetype, and code.",
  },
];

const PROMPTS = [
  "Add an Arlo UI bottom sheet to this screen.",
  "What tone tokens does the Badge use, and what are their dark values?",
  "Build a settings screen using Arlo UI primitives.",
];

const inlineCode =
  "rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[14px] text-ink dark:bg-surface-raised";

function McpDoc() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Agents</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          MCP
        </h1>
        <Lede>
          A read-only Model Context Protocol server that gives coding agents
          live access to Arlo UI components, tokens, and docs — straight from
          your editor.
        </Lede>

        <p className="mt-8 text-[17px] leading-relaxed text-ink-2">
          The server holds no content of its own. Every tool call resolves to a
          fetch of a canonical Arlo UI URL, so an agent always sees exactly what
          is published on the site — no bundled copy to drift out of date.
        </p>

        <section id="connect" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Connect
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            The server runs locally over stdio — your agent launches it as a
            subprocess, with no account or network endpoint to configure.
          </p>

          <div className="mt-6">
            <McpClientTabs />
          </div>
        </section>

        <section id="tools" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Tools
          </h2>
          <div className="border-t border-line">
            {TOOLS.map((t) => (
              <div
                key={t.name}
                className="border-b border-line py-4 sm:flex sm:gap-6"
              >
                <code className="shrink-0 font-mono text-[14px] text-ink sm:w-52">
                  {t.name}
                </code>
                <p className="mt-1.5 text-[17px] leading-relaxed text-ink-2 sm:mt-0">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            How it works
          </h2>
          <ul className="list-disc space-y-2.5 pl-5 text-[17px] leading-relaxed text-ink-2 marker:text-ink-3">
            <li>
              Your agent spawns the server and talks JSON-RPC to it over stdin
              and stdout (the stdio transport). Nothing is exposed over the
              network.
            </li>
            <li>
              Each tool fetches from arloui.com — the registry JSON under{" "}
              <code className={inlineCode}>/r</code> and docs pages via their{" "}
              <code className={inlineCode}>?as=md</code> endpoint — and returns
              markdown to the agent.
            </li>
            <li>
              Responses are cached briefly, so a burst of calls in one turn does
              not refetch, and new components appear within a minute of a site
              deploy.
            </li>
          </ul>
        </section>

        <section id="prompts" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Example prompts
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Once connected, ask your agent in plain language:
          </p>
          <div className="space-y-2.5">
            {PROMPTS.map((p) => (
              <div
                key={p}
                className="rounded-xl border border-line px-5 py-3.5 text-[17px] leading-relaxed text-ink-2"
              >
                {p}
              </div>
            ))}
          </div>
        </section>

        <section id="configuration" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Configuration
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Point the server at a local site with{" "}
            <code className={inlineCode}>ARLO_BASE_URL</code> (and{" "}
            <code className={inlineCode}>ARLO_REGISTRY_URL</code>, which defaults
            to <code className={inlineCode}>&lt;base&gt;/r</code>) to develop
            against unreleased components. It defaults to the production site, so{" "}
            <code className={inlineCode}>npx @arloui/mcp</code> just works.
          </p>
        </section>
      </main>
      <RightRail headings={headings} />
    </>
  );
}
