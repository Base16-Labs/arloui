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
import { chartPreviews } from '@/components/docs/chart-preview';
import type { ChartFormDoc } from '@/lib/chart-forms';


const HEADINGS = [
  { id: 'when-to-use', label: 'When to use' },
  { id: 'install', label: 'Install' },
  { id: 'code', label: 'Examples' },
  { id: 'reference', label: 'Props and parts' },
  { id: 'motion', label: 'Motion' },
  { id: 'not-this', label: 'Limitations' },
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
  const Preview = chartPreviews[form.slug as keyof typeof chartPreviews];
  const isLine = form.slug === 'chart-line';
  return (
    <>
      <main className="mx-auto w-full max-w-[860px] px-6 pb-24 pt-12">
        <Eyebrow>Chart form</Eyebrow>
        <h1 className="mt-3.5 text-[40px] font-medium leading-none tracking-tight">{form.title}</h1>
        <p className="mt-3 font-mono text-[13px] text-ink-3">{form.exportName}</p>
        <Lede>{form.lede}</Lede>

        <div className="mb-9 mt-6 flex flex-wrap gap-2">
          <Pill as="a" href="/docs/components/chart">
            ← All chart forms
          </Pill>
        </div>

        <DevicePreview route={form.route} />

        <Section
          id="when-to-use"
          title="When to use"
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
          sub="Install this chart and its required dependencies."
        >
          <CodeBlock language="bash">{`npx arloui add ${form.entry}`}</CodeBlock>
          {isLine ? <p className="mt-4 max-w-[62ch] text-[13px] text-ink-2">
            Import <code>LineChart</code> from the installed file. The old <code>chart-plot</code> command
            and <code>Chart</code> export remain supported. To install all chart types, use <code>npx arloui add chart</code>.
          </p> : <p className="mt-4 max-w-[62ch] text-[13px] text-ink-2">
            Import <code className="font-mono text-[12px]">{form.exportName}</code> directly when
            installing this chart on its own. All examples below use this import.
          </p>}
          <div className="mt-3">
            <CodeBlock language="tsx">
              {`import { ${form.exportName} } from '@/components/ui/${form.file}';`}
            </CodeBlock>
          </div>
        </Section>

        <Section id="code" title="Examples" sub={`React Native examples using ${form.exportName}. Set up the theme provider before rendering these examples.`}>
          {Preview ? (
            <div className="mb-8 flex min-h-[320px] items-center justify-center border-y border-line bg-surface-sunken px-5 py-10 sm:px-10">
              <div className="w-full max-w-[360px]">
                <Preview />
              </div>
            </div>
          ) : null}
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
          sub="Available props, default values, and child components."
        >
          <ChartReference title={form.referenceKey} exportName={form.exportName} />
        </Section>

        <Section id="motion" title="Motion">
          <div className="max-w-[68ch] space-y-3 text-[13.5px] text-ink-2">
            <p>{form.motion}</p>
            <p>Motion is enabled by default. Set <code>{'animated={false}'}</code> to disable the chart&apos;s entrance, transitions, and loading pulse. The device&apos;s Reduce Motion setting takes precedence, even when animation is enabled.</p>
            <p>Use <code>loading</code> for the initial fetch. Placeholders fade out before the chart enters. For background updates, pass <code>refreshing</code> and retain the last successful data; the chart stays visible and announces its busy state to assistive technology.</p>
            <p>Loading is a separate state: it shows a placeholder while data is unavailable. The entrance runs when real data becomes available, including after loading or an empty state. It does not loop.</p>
            <p>In the playground, use Motion to compare on and off. Tap On again to replay the animation without changing its variants.</p>
          </div>
          <div className="mt-4"><CodeBlock language="tsx">{`<${form.exportName} data={data} animated={false} />`.replace('data={data}', form.slug === 'chart-meter' ? 'value={53} max={100}' : 'data={data}')}</CodeBlock></div>
        </Section>

        <Section id="not-this" title="Limitations">
          <p className="max-w-[68ch] text-[13.5px] text-ink-2">{form.notThis}</p>
        </Section>

        <Section id="related" title="Related">
          <div className="flex flex-wrap gap-2">
            {isLine || form.slug === 'chart-sparkline' ? (
              <Pill as="a" href={`/docs/components/${isLine ? 'chart-sparkline' : 'chart-line'}`}>
                {isLine ? 'Sparkline: compact trends' : 'Line chart: detailed exploration'}
              </Pill>
            ) : null}
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
