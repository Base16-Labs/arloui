import Link from "next/link";

const phases = [
  {
    label: "Now",
    items: [
      "Core 35 components with full state coverage",
      "Skill pack v1 for Claude Code, Cursor, Windsurf",
      "Documentation site scaffold",
    ],
  },
  {
    label: "Next",
    items: [
      "MCP server for programmatic token access",
      "Archetype templates — copy-paste full screens",
      "Figma kit with code-connect mappings",
      "Motion playground with live spring tuning",
    ],
  },
  {
    label: "Later",
    items: [
      "Web (react-native-web) parity",
      "Storybook integration",
      "VS Code extension with inline previews",
      "Community archetype registry",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-24">
      <div className="mx-auto max-w-[960px]">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
          Roadmap
        </div>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Roadmap
        </h1>
        <p className="mt-5 max-w-[560px] text-[14px] leading-relaxed text-ink-2">
          Where ArloUI is headed. Updated as priorities shift.
        </p>

        <div className="mt-14 space-y-12">
          {phases.map((phase) => (
            <div key={phase.label}>
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
                {phase.label}
              </h2>
              <ul className="space-y-2.5">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-line px-5 py-3.5 text-[15px] text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/docs"
            className="text-sm text-ink-2 hover:text-ink"
          >
            &larr; Back to docs
          </Link>
        </div>
      </div>
    </main>
  );
}
