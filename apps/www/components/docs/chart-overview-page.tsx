import Link from 'next/link';
import { RightRail } from '@/components/nav/RightRail';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DevicePreview } from '@/components/ui/DevicePreview';
import { Icon } from '@/components/ui/Icon';
import { chartForms, chartPitfalls, chartQuickStart } from '@/lib/chart-forms';
import { chartPreviews } from './chart-preview';

const headings = [
  { id: 'overview', label: 'Overview' },
  { id: 'choosing', label: 'Choose a chart' },
  { id: 'install', label: 'Get started' },
];

export function ChartOverviewPage() {
  return <>
    <main className="mx-auto w-full min-w-0 max-w-[860px] px-6 pb-24 pt-12">
      <Eyebrow>Chart</Eyebrow>
      <h1 className="mt-3.5 text-[40px] font-medium leading-none tracking-normal">Chart</h1>
      <Lede>Six React Native charts for trends, comparisons, proportions, progress, and daily activity.</Lede>

      <div className="mt-8"><DevicePreview route="chart" /></div>

      <section id="overview" className="scroll-mt-24">
        <h2 className="text-[22px] font-medium">Overview</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {chartForms.map((form) => {
            const Preview = chartPreviews[form.slug as keyof typeof chartPreviews];
            return <article key={form.slug} className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-line">
              <div className="flex h-[320px] items-center justify-center border-b border-line bg-surface-sunken px-5 py-6">
                <div className="w-full max-w-[320px]"><Preview /></div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[17px] font-medium text-ink">{form.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-2">{form.lede}</p>
                <Link href={`/docs/components/${form.slug}`} className="mt-4 inline-flex min-h-11 items-center justify-between gap-3 rounded-sm text-[13px] font-medium text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  <span>View {form.label.toLowerCase()} docs</span><Icon name="caret-right" size={16} />
                </Link>
              </div>
            </article>;
          })}
        </div>
      </section>

      <section id="choosing" className="mt-14 scroll-mt-24">
        <h2 className="text-[22px] font-medium">Choose a chart</h2>
        <dl className="mt-5 divide-y divide-line border-y border-line">
          {chartPitfalls.map((item) => <div key={item.rule} className="py-4">
            <dt className="text-[14px] font-medium text-ink">{item.rule}</dt>
            <dd className="mt-1 text-[13px] leading-relaxed text-ink-2">{item.body}</dd>
          </div>)}
        </dl>
      </section>

      <section id="install" className="mt-14 scroll-mt-24">
        <h2 className="text-[22px] font-medium">Get started</h2>
        <p className="mb-4 mt-3 text-[13px] leading-relaxed text-ink-2">{chartQuickStart.intro} Follow the <Link href="/docs/getting-started" className="text-ink underline underline-offset-4">setup guide</Link> for the theme provider and fonts.</p>
        <CodeBlock language="bash">{chartQuickStart.command}</CodeBlock>
        <p className="mb-4 mt-4 text-[13px] leading-relaxed text-ink-2">{chartQuickStart.dependencies} <a href="https://docs.expo.dev/versions/latest/sdk/reanimated/" className="text-ink underline underline-offset-4">Expo setup</a> and <a href="https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/" className="text-ink underline underline-offset-4">version compatibility</a>.</p>
        <CodeBlock language="bash">{chartQuickStart.expoCommand}</CodeBlock>
        <p className="mb-4 mt-5 text-[13px] leading-relaxed text-ink-2">{chartQuickStart.exampleIntro}</p>
        <CodeBlock language="tsx">{chartQuickStart.example}</CodeBlock>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-2">{chartQuickStart.family}</p>
      </section>
    </main>
    <RightRail headings={headings} actions={[]} />
  </>;
}
