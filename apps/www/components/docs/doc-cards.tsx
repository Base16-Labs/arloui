/**
 * Shared docs presentation cards.
 *
 * These were previously copy-pasted (identically) across effects-doc, typography-doc,
 * and the primitives page. Consolidated here verbatim — the rendered markup is
 * unchanged, so pages look exactly the same; there's now one place to edit the style.
 */

export function RuleCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="text-[13px] font-medium text-ink">{title}</div>
      <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{text}</div>
    </div>
  );
}

export function DoDont({ doText, dontText }: { doText: string; dontText: string }) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-2">
      <div className="bg-[#DDFBE8] p-4 dark:bg-emerald-500/10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#166534] dark:text-emerald-300">
          Do
        </div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{doText}</div>
      </div>
      <div className="border-t border-line bg-[#FFE4E6] p-4 sm:border-t-0 sm:border-l dark:bg-rose-500/10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9F1D1D] dark:text-rose-300">
          Don’t
        </div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{dontText}</div>
      </div>
    </div>
  );
}
