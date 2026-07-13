type DoDontProps = {
  pairs: { do: string; dont: string }[];
};

export function DoDont({ pairs }: DoDontProps) {
  return (
    <div className="space-y-3">
      {pairs.map((pair, i) => (
        <div key={i} className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-2">
          <div className="bg-[#DDFBE8] p-4 dark:bg-emerald-500/10">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#166534] dark:text-emerald-300">
              Do
            </div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{pair.do}</div>
          </div>
          <div className="border-t border-line bg-[#FFE4E6] p-4 sm:border-t-0 sm:border-l dark:bg-rose-500/10">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9F1D1D] dark:text-rose-300">
              Don&apos;t
            </div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{pair.dont}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
