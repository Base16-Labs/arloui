/**
 * One chart form, on its own page.
 *
 * Data-driven rather than six hand-written branches: the prose lives in
 * `lib/chart-forms`, the reference is generated from the registry types, and
 * the layout is written once here. A seventh form is a data entry, not a
 * thousand lines of JSX that will drift from the other six.
 */
import { RightRail } from '@/components/nav/RightRail';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { Pill } from '@/components/ui/Pill';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DevicePreview } from '@/components/ui/DevicePreview';
import { ChartReference } from '@/components/docs/chart-reference';
import type { ChartFormDoc } from '@/lib/chart-forms';

const HEADINGS = [
  { id: 'when-to-use', label: 'When to use' },
  { id: 'install', label: 'Install' },
  { id: 'code', label: 'Code' },
  { id: 'reference', label: 'Props and parts' },
  { id: 'not-this', label: 'What it will not do' },
  { id: 'related', label: 'Related' },
];

function Section({
  id,
  title,
  sub,
  children,
}: {
  id: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <h2 className="text-[22px] font-medium tracking-tight">{title}</h2>
      {sub ? <p className="mt-1.5 text-[13px] text-ink-3">{sub}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ChartFormPage({ form }: { form: ChartFormDoc }) {
  return (
    <>
      <main className="mx-auto w-full max-w-[860px] px-6 pb-24 pt-12">
        <Eyebrow>Chart form</Eyebrow>
        <h1 className="mt-3.5 text-[40px] font-medium leading-none tracking-tight">{form.title}</h1>
        <p className="mt-3 font-mono text-[13px] text-ink-3">{form.referenceKey}</p>
        <Lede>{form.lede}</Lede>

        <p className="mt-4 text-[15px] text-ink-2">
          Answers <span className="text-ink">{form.answers}</span>
        </p>

        <div className="mb-9 mt-6 flex flex-wrap gap-2">
          <Pill as="a" href="/docs/components/chart">
            ← All chart forms
          </Pill>
        </div>

        <DevicePreview route={form.route} />

        <Section
          id="when-to-use"
          title="When to use"
          sub="Pick by the question the reader is asking, not by the shape you want."
        >
          <ul className="space-y-2.5 text-[13.5px] text-ink-2">
            {form.whenToUse.map((line) => (
              <li key={line} className="flex gap-2.5">
                <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-3" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="install"
          title="Install"
          sub="This form and the shared core — not the whole namespace."
        >
          <CodeBlock language="bash">{`npx arloui add ${form.entry}`}</CodeBlock>
          <p className="mt-4 max-w-[62ch] text-[13px] text-ink-2">
            Taking a single form does not bring the <code className="font-mono text-[12px]">Chart</code>{' '}
            barrel, so import the component itself. Take{' '}
            <code className="font-mono text-[12px]">chart</code> instead and the same component is{' '}
            <code className="font-mono text-[12px]">{form.title}</code>.
          </p>
          <div className="mt-3">
            <CodeBlock language="tsx">
              {`import { ${form.exportName} } from '@/components/ui/${form.file}';`}
            </CodeBlock>
          </div>
        </Section>

        <Section id="code" title="Code" sub="React Native, copy-paste and compose.">
          <div className="space-y-6">
            {form.examples.map((example) => (
              <div key={example.caption}>
                <p className="mb-2.5 max-w-[62ch] text-[13px] text-ink-2">{example.caption}</p>
                <CodeBlock language="tsx">{example.code}</CodeBlock>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="reference"
          title="Props and parts"
          sub="Generated from the types, so it cannot drift from the code."
        >
          <ChartReference title={form.referenceKey} />
        </Section>

        <Section id="not-this" title="What it will not do" sub="And what to reach for instead.">
          <p className="max-w-[68ch] text-[13.5px] text-ink-2">{form.notThis}</p>
        </Section>

        <Section id="related" title="Related">
          <div className="flex flex-wrap gap-2">
            <Pill as="a" href="/docs/components/chart">
              Chart overview
            </Pill>
            <Pill as="a" href="/docs/primitives/color">
              Chart colour roles
            </Pill>
          </div>
        </Section>
      </main>
      <RightRail headings={HEADINGS} actions={[]} />
    </>
  );
}
