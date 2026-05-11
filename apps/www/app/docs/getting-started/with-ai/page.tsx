import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";

const headings = [
  { id: "skill-pack", label: "The skill pack" },
  { id: "editors", label: "Editor setup" },
  { id: "usage", label: "Usage" },
];

export default function WithAIPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Getting started</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          With AI
        </h1>
        <Lede>
          Drop the skill pack into your editor and let your AI build screens
          that look like ArloUI from the start.
        </Lede>

        <section id="skill-pack" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            The skill pack
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            The ArloUI skill pack is a markdown document that teaches your AI
            assistant the design system — tokens, components, patterns, and
            motion rules.
          </p>
        </section>

        <section id="editors" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Editor setup
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Works with Claude Code, Cursor, Windsurf, and any editor that
            supports system prompts or context files.
          </p>
        </section>

        <section id="usage" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Usage
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            &ldquo;Build a Question screen that asks the user to pick a payment
            method&rdquo; — and the AI will compose the right primitives with
            the right tokens.
          </p>
        </section>
      </main>
      <RightRail headings={headings} />
    </>
  );
}
