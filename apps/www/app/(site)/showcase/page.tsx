import Link from "next/link";

export default function ShowcasePage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-24">
      <div className="mx-auto max-w-[960px]">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
          Showcase
        </div>
        <h1 className="mt-3 text-[64px] font-medium leading-none tracking-tight">
          Showcase
        </h1>
        <p className="mt-5 max-w-[560px] text-[14px] leading-relaxed text-ink-2">
          Apps built with ArloUI. Submission opens soon.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex aspect-[3/4] items-center justify-center rounded-2xl border-2 border-dotted border-line-strong p-5 text-sm font-medium text-ink-3"
            >
              Your app
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/docs"
            className="text-sm text-ink-2 hover:text-ink"
          >
            &larr; Back to docs
          </Link>
        </div>
      </div>
    </main>
  );
}
