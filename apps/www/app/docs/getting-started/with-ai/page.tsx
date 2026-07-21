import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { CodeBlock } from "@/components/ui/CodeBlock";

const headings = [
  { id: "mcp", label: "MCP server" },
  { id: "skill-pack", label: "Skill pack" },
  { id: "usage", label: "Usage" },
];

const inlineCode =
  "rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[14px] text-ink dark:bg-surface-raised";

const MCP_JSON = `{
  "mcpServers": {
    "arloui": {
      "command": "npx",
      "args": ["-y", "@arloui/mcp"]
    }
  }
}`;

export default function WithAIPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Getting started</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          With AI
        </h1>
        <Lede>
          Arlo UI is built for agents. Give yours live access to the components,
          tokens, and docs so it builds screens that look like Arlo UI from the
          first draft.
        </Lede>

        <section id="mcp" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            MCP server
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            The quickest path. <code className={inlineCode}>@arloui/mcp</code> is a
            read-only Model Context Protocol server that lets your agent search
            components, read their source, and resolve tokens on demand — no
            checkout required. Add it to Claude Code, Cursor, or any MCP client:
          </p>
          <CodeBlock language="json">{MCP_JSON}</CodeBlock>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
            Full tool list and per-client setup on the{" "}
            <Link href="/docs/agents/mcp" className="text-ink underline underline-offset-2">
              MCP page
            </Link>
            .
          </p>
        </section>

        <section id="skill-pack" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Skill pack
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            A markdown skill that teaches the design system itself — tokens,
            component APIs, composition patterns, and motion rules — so the agent
            makes Arlo-shaped choices even before it fetches anything. See the{" "}
            <Link href="/docs/agents/skill-pack" className="text-ink underline underline-offset-2">
              skill pack page
            </Link>{" "}
            for install steps (Claude Code, Cursor).
          </p>
        </section>

        <section id="usage" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Usage
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            With either connected, ask in plain language — &ldquo;Build a settings
            screen using Arlo UI primitives&rdquo; or &ldquo;Add a bottom sheet to
            confirm this action&rdquo; — and the agent composes the right
            primitives with the right tokens, pulling any missing component in
            with <code className={inlineCode}>npx arloui add</code>.
          </p>
        </section>
      </main>
      <RightRail headings={headings} />
    </>
  );
}
