import Link from "next/link";
import { componentCount } from "@/lib/routes";

export default function DocsLandingPage() {
  return (
    <main className="max-w-[820px] px-14 pt-10 pb-20">
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
        Documentation
      </div>
      <h1 className="mt-4 text-[56px] font-medium leading-[0.95] tracking-tight">
        Building premium mobile apps.
      </h1>
      <p className="mt-[18px] max-w-[600px] text-[14px] leading-relaxed text-ink-2">
        ArloUI is a design system and component library built specifically for
        React Native. It provides the foundations and primitives needed to ship
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[
          {
            label: "Getting started",
            desc: "Install, configure, build your first screen.",
            href: "/docs/getting-started",
          },
          {
            label: "Foundations",
            desc: "The four facets — why ArloUI looks and feels the way it does.",
            href: "/docs/foundations",
          },
          {
            label: "Primitives",
            desc: "Tokens, type scale, color, spacing, motion, icons.",
            href: "/docs/primitives",
          },
          {
            label: "Components",
            desc: `${componentCount} React Native components — copy-paste with strong defaults.`,
            href: "/docs/components",
          },
          {
            label: "Archetypes",
            desc: "Nine screen-level patterns — the recipes that wire components together.",
            href: "/docs/archetypes",
          },
          {
            label: "Agents",
            desc: "Skill pack, MCP server, prompt cookbook — AI-native affordances.",
            href: "/docs/agents",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-line p-5 hover:border-line-strong"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            <div className="text-base font-medium text-ink">{card.label}</div>
            <div className="mt-1.5 text-sm text-ink-2">{card.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
