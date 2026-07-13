import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { agentItems } from "@/lib/routes";

const descriptions: Record<string, string> = {
  "skill-pack": "A markdown document that teaches AI assistants the full ArloUI design system.",
  mcp: "Model Context Protocol server for programmatic access to tokens, components, and archetypes.",
  "prompt-cookbook": "Copy-paste prompts for common screen-building tasks.",
};

export default function AgentsIndexPage() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Agents</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        Agents
      </h1>
      <Lede>
        AI-native affordances — skill pack, MCP server, and prompt cookbook.
        ArloUI is designed to be used by humans and machines alike.
      </Lede>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {agentItems.map((item) => (
          <Link
            key={item.slug}
            href={`/docs/agents/${item.slug}`}
            className="rounded-xl border border-line p-5 hover:border-line-strong"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
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
