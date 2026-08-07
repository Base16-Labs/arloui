import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { CodeBlock } from "@/components/ui/CodeBlock";
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
  if (slug === "skill-pack") return <SkillPackDoc />;

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
    name: "arlo_list_docs",
    desc: "List every docs page that has markdown, grouped by section — so an agent can see what exists instead of guessing slugs.",
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
              <code className={inlineCode}>/r</code> and docs markdown under{" "}
              <code className={inlineCode}>/md</code> — and returns markdown to
              the agent. Every docs page is also readable in a browser by adding{" "}
              <code className={inlineCode}>?as=md</code> or a{" "}
              <code className={inlineCode}>.md</code> suffix to its URL.
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

const skillHeadings = [
  { id: "raw", label: "Raw files" },
  { id: "inside", label: "What's inside" },
  { id: "install", label: "Install" },
  { id: "usage", label: "How agents use it" },
  { id: "prompts", label: "Example prompts" },
  { id: "compatibility", label: "Compatibility" },
];

/** Public URLs for the skill pack — mirrored to `/md/skills/` at docs build time. */
const SKILL_RAW_BASE = "/md/skills";

const SKILL_FILES: Array<{ name: string; desc: string; href?: string }> = [
  {
    name: "SKILL.md",
    href: `${SKILL_RAW_BASE}/SKILL.md`,
    desc: "The entry point. The five facets, the fixed working order agents follow, and the output conventions — the design contract itself.",
  },
  {
    name: "references/tokens.md",
    href: `${SKILL_RAW_BASE}/references/tokens.md`,
    desc: "Type scale, color roles, spacing, radii, and motion — hand-authored with the reasoning behind each value.",
  },
  {
    name: "references/components.md",
    href: `${SKILL_RAW_BASE}/references/components.md`,
    desc: "The primitives, their variants, and full-screen recipes composed from them.",
  },
  {
    name: "references/platform-mapping.md",
    href: `${SKILL_RAW_BASE}/references/platform-mapping.md`,
    desc: "How each pattern translates across Figma, React Native, and SwiftUI.",
  },
  {
    name: "references/*.json · usage.md",
    href: `${SKILL_RAW_BASE}/references/usage.md`,
    desc: "Generated machine-readable tokens, registry, and usage — kept in sync with the packages by npm run skill:sync.",
  },
];

const SKILL_PROMPTS = [
  "Design a settings screen with Arlo UI — group the rows and pick the tokens.",
  "Refine this React Native sheet so it follows Arlo UI's fluidity rules.",
  "Translate this Arlo UI screen concept to SwiftUI.",
];

const CLIENTS: Array<{ label: string; code: string }> = [
  {
    label: "Cursor",
    code: `# user-level (available in every project)
cp -R skills ~/.cursor/skills-cursor/arloui

# or symlink during local dev so updates flow automatically
ln -s "$(pwd)/skills" ~/.cursor/skills-cursor/arloui`,
  },
  {
    label: "Claude Code",
    code: `# user-level
cp -R skills ~/.claude/skills/arloui

# project-level
mkdir -p .claude/skills && cp -R skills .claude/skills/arloui`,
  },
  {
    label: "Codex CLI / AGENTS.md",
    code: `cp -R skills ./arloui
# then point your agent at it from AGENTS.md:
#   For mobile UI work, follow the Arlo UI skill at ./arloui/SKILL.md`,
  },
];

function SkillPackDoc() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Agents</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Skill pack
        </h1>
        <Lede>
          A portable bundle of Arlo UI&apos;s design rules, tokens, and patterns
          that coding agents — Claude Code, Cursor, Codex — load on demand.
        </Lede>

        <p className="mt-8 text-[17px] leading-relaxed text-ink-2">
          The skill is the design language written for machines: a{" "}
          <code className={inlineCode}>SKILL.md</code> entry point plus a{" "}
          <code className={inlineCode}>references/</code> folder. Installing it is
          a folder copy — no account, no network. Once present, an agent picks it
          up automatically whenever you ask for Arlo UI or mobile UI work.
        </p>

        <section id="raw" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Raw files
          </h2>
          <p className="mb-6 text-[17px] leading-relaxed text-ink-2">
            Every skill file is also published as a static URL — same copy-paste
            spirit as the components. Fetch them directly, or open{" "}
            <a
              href={`${SKILL_RAW_BASE}/SKILL.md`}
              className="text-ink underline underline-offset-4 hover:opacity-70"
            >
              /md/skills/SKILL.md
            </a>{" "}
            in a browser.
          </p>
          <div className="space-y-2.5">
            {[
              `${SKILL_RAW_BASE}/SKILL.md`,
              `${SKILL_RAW_BASE}/references/tokens.md`,
              `${SKILL_RAW_BASE}/references/components.md`,
              `${SKILL_RAW_BASE}/references/platform-mapping.md`,
              `${SKILL_RAW_BASE}/references/usage.md`,
            ].map((href) => (
              <a
                key={href}
                href={href}
                className="block rounded-xl border border-line px-5 py-3.5 font-mono text-[14px] text-ink hover:border-line-strong"
                style={{ transitionDuration: "var(--dur-fast)" }}
              >
                {href}
              </a>
            ))}
          </div>
          <div className="mt-6">
            <CodeBlock language="bash">{`# Pull the entry point without cloning the repo
curl -fsSL https://arloui.com/md/skills/SKILL.md -o SKILL.md`}</CodeBlock>
          </div>
        </section>

        <section id="inside" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            What&apos;s inside
          </h2>
          <div className="border-t border-line">
            {SKILL_FILES.map((f) => (
              <div
                key={f.name}
                className="border-b border-line py-4 sm:flex sm:gap-6"
              >
                <code className="shrink-0 font-mono text-[14px] text-ink sm:w-56">
                  {f.href ? (
                    <a
                      href={f.href}
                      className="underline underline-offset-4 hover:opacity-70"
                    >
                      {f.name}
                    </a>
                  ) : (
                    f.name
                  )}
                </code>
                <p className="mt-1.5 text-[17px] leading-relaxed text-ink-2 sm:mt-0">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="install" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Install
          </h2>
          <p className="mb-6 text-[17px] leading-relaxed text-ink-2">
            Copy the repo&apos;s <code className={inlineCode}>skills</code> folder
            into your agent&apos;s skills directory as{" "}
            <code className={inlineCode}>arloui</code>. From the repo root,{" "}
            <code className={inlineCode}>
              node scripts/install-skill.mjs cursor --symlink
            </code>{" "}
            does the same thing.
          </p>
          <div className="space-y-6">
            {CLIENTS.map((c) => (
              <div key={c.label}>
                <div className="mb-2 text-[13px] font-medium text-ink">
                  {c.label}
                </div>
                <CodeBlock language="bash">{c.code}</CodeBlock>
              </div>
            ))}
          </div>
        </section>

        <section id="usage" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            How agents use it
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Once installed, the agent loads the skill on demand and works in a
            fixed order:
          </p>
          <ol className="list-decimal space-y-2.5 pl-5 text-[17px] leading-relaxed text-ink-2 marker:text-ink-3">
            <li>
              Read <code className={inlineCode}>SKILL.md</code> to load the design
              language and the five facets.
            </li>
            <li>
              Pull values from{" "}
              <code className={inlineCode}>references/tokens.md</code>.
            </li>
            <li>
              Pull primitives and screen recipes from{" "}
              <code className={inlineCode}>references/components.md</code>.
            </li>
            <li>
              Translate to the target platform via{" "}
              <code className={inlineCode}>references/platform-mapping.md</code>.
            </li>
          </ol>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
            The skill carries the design intent; pair it with the{" "}
            <Link
              href="/docs/agents/mcp"
              className="text-ink underline underline-offset-4 hover:opacity-70"
            >
              MCP server
            </Link>{" "}
            when the agent needs live component source and resolved token values.
          </p>
        </section>

        <section id="prompts" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Example prompts
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            With the skill installed, ask in plain language:
          </p>
          <div className="space-y-2.5">
            {SKILL_PROMPTS.map((p) => (
              <div
                key={p}
                className="rounded-xl border border-line px-5 py-3.5 text-[17px] leading-relaxed text-ink-2"
              >
                {p}
              </div>
            ))}
          </div>
        </section>

        <section id="compatibility" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Compatibility
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Supported in Cursor, Claude Code, and Codex CLI, and best-effort in
            any agent that reads <code className={inlineCode}>SKILL.md</code> or{" "}
            <code className={inlineCode}>AGENTS.md</code>. It&apos;s pre-1.0 —
            content, token values, and install paths may still change between
            minor releases.
          </p>
        </section>
      </main>
      <RightRail headings={skillHeadings} />
    </>
  );
}
