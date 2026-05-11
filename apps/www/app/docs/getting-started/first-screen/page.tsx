import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";

const headings = [
  { id: "the-question", label: "The archetype" },
  { id: "scaffold", label: "Scaffold" },
  { id: "add-motion", label: "Add motion" },
  { id: "result", label: "Result" },
];

export default function FirstScreenPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Getting started</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          First screen
        </h1>
        <Lede>
          Build a Question archetype in five minutes — from blank file to
          production-ready screen.
        </Lede>

        <section id="the-question" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            The Question archetype
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Question is the simplest Arlo archetype: a title, a body, one or two
            actions. It covers confirmation dialogs, permission prompts, and
            single-input forms.
          </p>
        </section>

        <section id="scaffold" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Scaffold
          </h2>
          <div className="rounded-xl border border-line bg-[#f8f6ef] p-4 font-mono text-sm dark:bg-surface-raised">
            {'<Stack spacing="lg">'}
            <br />
            {'  <Title level={2}>Confirm payment?</Title>'}
            <br />
            {'  <Body muted>$12.00 will be charged.</Body>'}
            <br />
            {'  <Button label="Confirm" />'}
            <br />
            {"</Stack>"}
          </div>
        </section>

        <section id="add-motion" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Add motion
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Wrap in a Sheet, apply the Fluidity rules, and every transition
            explains itself.
          </p>
        </section>

        <section id="result" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Result
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            A fully accessible, motion-correct screen that matches the ArloUI
            spec — in under five minutes.
          </p>
        </section>
      </main>
      <RightRail headings={headings} />
    </>
  );
}
