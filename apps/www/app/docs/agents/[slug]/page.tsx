import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { CodeBlock } from "@/components/ui/CodeBlock";
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
    desc: "Spec for a block/recipe (a full-screen example): composition tree, primitives, archetype, and code.",
  },
];

const CLAUDE_CODE = `claude mcp add arloui -- npx -y @arloui/mcp`;

const MCP_JSON = `{
  "mcpServers": {
    "arloui": {
      "command": "npx",
      "args": ["-y", "@arloui/mcp"]
    }
  }
}`;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-14 mb-4 text-[22px] font-medium tracking-tight text-ink">
      {children}
    </h2>
  );
}

function McpDoc() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Agents</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        MCP
      </h1>
      <Lede>
        A read-only Model Context Protocol server that gives coding agents live
        access to Arlo UI components, tokens, and docs — straight from your
        editor.
      </Lede>

      <p className="mt-8 text-[17px] leading-relaxed text-ink-2">
        The server holds no content of its own. Every tool call resolves to a
        fetch of a canonical Arlo UI URL, so an agent always sees exactly what
        is published on the site — no bundled copy to drift out of date.
      </p>

      <SectionTitle>Connect</SectionTitle>
      <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
        The server runs locally over stdio — your agent launches it as a
        subprocess, no account or network endpoint to configure. In{" "}
        <span className="text-ink">Claude Code</span>:
      </p>
      <CodeBlock language="bash">{CLAUDE_CODE}</CodeBlock>
      <p className="mt-6 mb-4 text-[17px] leading-relaxed text-ink-2">
        In <span className="text-ink">Claude Desktop</span> (
        <code className="font-mono text-[14px] text-ink">
          claude_desktop_config.json
        </code>
        ), <span className="text-ink">Cursor</span> (
        <code className="font-mono text-[14px] text-ink">.cursor/mcp.json</code>
        ), or any MCP client:
      </p>
      <CodeBlock language="json">{MCP_JSON}</CodeBlock>

      <SectionTitle>Tools</SectionTitle>
      <div className="divide-y divide-line border-t border-line">
        {TOOLS.map((t) => (
          <div key={t.name} className="py-4">
            <code className="font-mono text-[14px] text-ink">{t.name}</code>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">
              {t.desc}
            </p>
          </div>
        ))}
      </div>

      <SectionTitle>How it works</SectionTitle>
      <ul className="list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-ink-2 marker:text-ink-3">
        <li>
          Your agent spawns the server and talks JSON-RPC to it over stdin and
          stdout (the stdio transport). Nothing is exposed over the network.
        </li>
        <li>
          Each tool fetches from arloui.com — the registry JSON under{" "}
          <code className="font-mono text-[14px] text-ink">/r</code> and docs
          pages via their <code className="font-mono text-[14px] text-ink">?as=md</code>{" "}
          endpoint — and returns markdown to the agent.
        </li>
        <li>
          Responses are cached briefly, so a burst of calls in one turn does not
          refetch, and new components appear within a minute of a site deploy.
        </li>
      </ul>

      <p className="mt-12 text-[15px] leading-relaxed text-ink-3">
        Point the server at a local site with the{" "}
        <code className="font-mono text-[13px] text-ink-2">ARLO_BASE_URL</code>{" "}
        environment variable; it defaults to the production site so{" "}
        <code className="font-mono text-[13px] text-ink-2">npx @arloui/mcp</code>{" "}
        just works.
      </p>
    </main>
  );
}
