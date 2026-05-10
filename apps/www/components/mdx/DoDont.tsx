type DoDontProps = {
  pairs: { do: string; dont: string }[];
};

export function DoDont({ pairs }: DoDontProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      {pairs.map((pair, i) => (
        <div key={i} className="contents">
          <div className="relative h-[170px] rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] p-4 dark:bg-surface-raised">
            <span className="absolute top-3 left-3.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Do
            </span>
            <p className="mt-9 text-[13px] leading-relaxed text-ink-2">
              {pair.do}
            </p>
          </div>
          <div className="relative h-[170px] rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] p-4 dark:bg-surface-raised">
            <span className="absolute top-3 left-3.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Don&apos;t
            </span>
            <p className="mt-9 text-[13px] leading-relaxed text-ink-2">
              {pair.dont}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
