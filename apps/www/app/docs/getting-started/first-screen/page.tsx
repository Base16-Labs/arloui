import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { CodeBlock } from "@/components/ui/CodeBlock";

const headings = [
  { id: "archetype", label: "The archetype" },
  { id: "add", label: "Add the pieces" },
  { id: "compose", label: "Compose the screen" },
  { id: "next", label: "Next" },
];

const inlineCode =
  "rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[14px] text-ink dark:bg-surface-raised";

const SCREEN = `import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";

export function ConfirmPayment({ onConfirm, onCancel }) {
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Confirm payment?</Text>
      <Text style={{ fontSize: 15, color: "#667085" }}>
        $12.00 will be charged to your card.
      </Text>

      <View style={{ gap: 8, marginTop: 8 }}>
        <Button tone="primary" onPress={onConfirm}>
          Confirm
        </Button>
        <Button appearance="ghost" onPress={onCancel}>
          Cancel
        </Button>
      </View>
    </View>
  );
}`;

export default function FirstScreenPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Getting started</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          First screen
        </h1>
        <Lede>
          Build a Question archetype — a title, a bit of context, and one or two
          actions — from real Arlo UI primitives.
        </Lede>

        <section id="archetype" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            The archetype
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Question is the simplest of the nine{" "}
            <Link href="/docs/archetypes" className="text-ink underline underline-offset-2">
              archetypes
            </Link>
            : a headline, supporting text, and clear actions. It covers
            confirmations, permission prompts, and single-input forms.
          </p>
        </section>

        <section id="add" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Add the pieces
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Assuming you&apos;ve run <code className={inlineCode}>npx arloui init</code>{" "}
            (see <Link href="/docs/getting-started/install" className="text-ink underline underline-offset-2">Install</Link>),
            pull in the button:
          </p>
          <CodeBlock language="bash">npx arloui add button</CodeBlock>
        </section>

        <section id="compose" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Compose the screen
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Buttons take their label as <code className={inlineCode}>children</code>,
            with <code className={inlineCode}>tone</code> and{" "}
            <code className={inlineCode}>appearance</code> for hierarchy. Everything
            reads from the theme, so it&apos;s correct in light and dark out of the box:
          </p>
          <CodeBlock language="tsx">{SCREEN}</CodeBlock>
        </section>

        <section id="next" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Next
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Present it modally by adding <code className={inlineCode}>sheet</code>{" "}
            (<code className={inlineCode}>npx arloui add sheet</code>), or browse the
            full set on the{" "}
            <Link href="/docs/components" className="text-ink underline underline-offset-2">
              Components
            </Link>{" "}
            page — each has a live playground you can open in Expo Go.
          </p>
        </section>
      </main>
      <RightRail headings={headings} />
    </>
  );
}
