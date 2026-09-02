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
        <tr key={prop.name} className="border-b border-line/60 last:border-0">
          <td className="whitespace-nowrap px-4 py-2.5 align-top">
            <code className="font-mono text-[11.5px] text-ink">{prop.name}</code>
            {prop.required ? (
              <span className="ml-1.5 text-[10px] uppercase tracking-wide text-ink-3">req</span>
            ) : null}
          </td>
          <td className="px-4 py-2.5 align-top">
            <code className="font-mono text-[11px] text-ink-2">{prop.type}</code>
          </td>
          <td className="whitespace-nowrap px-4 py-2.5 align-top">
            {prop.default ? (
              <code className="font-mono text-[11px] text-ink-2">{prop.default}</code>
            ) : (
              <span className="text-ink-3">—</span>
            )}
          </td>
          <td className="px-4 py-2.5 align-top text-ink-2">{prop.description}</td>
        </tr>
      ))}
    </>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-canvas">
      <table className="w-full min-w-[560px] border-collapse text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line">
            {head.map((label) => (
              <th key={label} className="px-4 py-2.5 font-medium text-ink-3">
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
        <tr key={part.name} className="border-b border-line/60 last:border-0 align-top">
          <td className="whitespace-nowrap px-4 py-3">
            <code className="font-mono text-[11.5px] text-ink">{`<${part.name} />`}</code>
          </td>
          <td className="px-4 py-3 text-ink-2">
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
              <p className="mt-1 text-[12px] text-ink-3">Takes no props — naming it is the switch.</p>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

/** Props and parts for one form, or for every form when `title` is omitted. */
export function ChartReference({ title }: { title?: string }) {
  const sections = title ? CHART_PROPS.filter((s) => s.title === title) : CHART_PROPS;
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          {title ? null : (
            <h3 className="mb-3 text-[13px] text-ink">
              {section.displayTitle ?? section.title}
              {section.displayTitle ? (
                <code className="ml-2 font-mono text-[11.5px] text-ink-3">{section.title}</code>
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
                <span className="text-ink">Parts.</span> Name one and it is drawn; name none and you
                get the default composition. Some take props of their own.
              </p>
              <Table head={['Part', 'What it draws, and what it takes']}>
                <PartRows parts={section.parts} />
              </Table>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
