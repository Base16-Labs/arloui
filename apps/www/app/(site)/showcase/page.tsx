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
          {[
            { name: "Cash App", desc: "Payment confirmation flows" },
            { name: "Flighty", desc: "Flight tracking detail screens" },
            { name: "Family", desc: "Location sharing cards" },
          ].map((app) => (
            <div
              key={app.name}
              className="flex aspect-[3/4] flex-col justify-end rounded-2xl border border-line bg-[#f8f6ef] p-5 dark:bg-surface-raised"
            >
              <div className="text-base font-medium text-ink">{app.name}</div>
              <div className="mt-1 text-sm text-ink-2">{app.desc}</div>
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
