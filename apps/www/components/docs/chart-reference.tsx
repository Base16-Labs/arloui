/**
 * The generated half of the Chart docs: what a form accepts, and what its parts
 * draw.
 *
 * Shared by the Chart overview and each per-form page so the two cannot say
 * different things. Everything here comes from `generated/chart-props`, which
 * is read out of the registry types at build time.
 */
import { CHART_PROPS, type ChartPartDoc, type ChartPropDoc } from '@/lib/generated/chart-props';

function PropRows({ props }: { props: ChartPropDoc[] }) {
  return (
    <>
      {props.map((prop) => (
        <tr key={prop.name} className="border-b border-line last:border-0">
          <td className="px-3 py-3 align-top">
            <code className="break-words font-mono text-[12px] leading-relaxed text-ink">{prop.name}</code>
            {prop.required ? (
              <span className="ml-1.5 text-[10px] uppercase tracking-wide text-ink-3">req</span>
            ) : null}
          </td>
          <td className="px-3 py-3 align-top">
            <code className="break-words font-mono text-[12px] leading-relaxed text-ink-2">{prop.type}</code>
          </td>
          <td className="px-3 py-3 align-top">
            {prop.default ? (
              <code className="break-words font-mono text-[12px] leading-relaxed text-ink-2">{prop.default}</code>
            ) : (
              <span className="text-ink-3">—</span>
            )}
          </td>
          <td className="px-3 py-3 align-top text-[13px] leading-relaxed text-ink-3">{prop.description}</td>
        </tr>
      ))}
    </>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full min-w-[560px] table-fixed border-collapse [overflow-wrap:anywhere] text-left text-[13px] leading-relaxed">
        <colgroup>
          {head.length === 4 ? <><col className="w-[19%]" /><col className="w-[27%]" /><col className="w-[14%]" /><col className="w-[40%]" /></> : <><col className="w-[32%]" /><col className="w-[68%]" /></>}
        </colgroup>
        <thead className="bg-canvas">
          <tr className="border-b border-line">
            {head.map((label) => (
              <th scope="col" key={label} className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-normal text-ink-3">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/**
 * A part, and — where it has them — its own props spelled out.
 *
 * Naming the props was not enough: `<Chart.Bar.Series>` taking `data` says
 * nothing about whether that is a number list or a labelled one, and the type
 * was hidden in a tooltip where nobody would find it.
 */
function PartRows({ parts }: { parts: ChartPartDoc[] }) {
  return (
    <>
      {parts.map((part) => (
        <tr key={part.name} className="border-b border-line last:border-0 align-top">
          <td className="px-3 py-3">
            <code className="break-words font-mono text-[12px] leading-relaxed text-ink">{`<${part.name} />`}</code>
          </td>
          <td className="px-3 py-3 text-ink-3">
            <p>{part.description}</p>
            {part.props.length > 0 ? (
              <dl className="mt-2 space-y-1.5 border-l border-line pl-3">
                {part.props.map((prop) => (
                  <div key={prop.name} className="flex flex-wrap items-baseline gap-x-2">
                    <dt>
                      <code className="font-mono text-[11px] text-ink">{prop.name}</code>
                      {prop.required ? (
                        <span className="ml-1 text-[10px] uppercase tracking-wide text-ink-3">
                          req
                        </span>
                      ) : null}
                      <code className="ml-1.5 font-mono text-[10.5px] text-ink-3">{prop.type}</code>
                    </dt>
                    <dd className="text-[12px] text-ink-2">{prop.description}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-1 text-[12px] text-ink-3">No additional props are listed for this part.</p>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

/** Props and parts for one form, or for every form when `title` is omitted. */
export function ChartReference({ title, exportName }: { title?: string; exportName?: string }) {
  const sections = title ? CHART_PROPS.filter((s) => s.title === title) : CHART_PROPS;
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          {title ? null : (
            <h3 className="mb-3 text-[13px] text-ink">
              {section.displayTitle ?? section.title}
              {section.displayTitle ? (
                <code className="ml-2 break-words font-mono text-[12px] leading-relaxed text-ink-3">{section.title}</code>
              ) : (
                null
              )}
            </h3>
          )}

          {section.props.length > 0 ? (
            <Table head={['Prop', 'Type', 'Default', 'What it does']}>
              <PropRows props={section.props} />
            </Table>
          ) : null}

          {section.parts.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-[12.5px] text-ink-2">
                <span className="text-ink">Child components.</span> Without children, the chart uses
                its default layout. Add child components to choose which optional elements to include.
                The table lists each component and its available props.
              </p>
              <Table head={['Part', 'What it draws, and what it takes']}>
                <PartRows parts={section.parts.map((part) => ({
                  ...part,
                  name: exportName && part.name.startsWith(`${section.title}.`)
                    ? exportName + part.name.slice(section.title.length)
                    : part.name,
                }))} />
              </Table>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
