import Link from "next/link";

export default function DocsLandingPage() {
  return (
    <main className="max-w-[820px] px-14 pt-10 pb-20">
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
        Documentation
      </div>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        ArloUI Docs
      </h1>
      <p className="mt-[18px] max-w-[600px] text-[22px] leading-relaxed text-ink-2">
        A mobile-first component library with copy-paste primitives — like
        shadcn for React Native.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[
          {
            label: "Getting started",
            desc: "Install, configure, build your first screen.",
            href: "/docs/getting-started",
          },
          {
            label: "Foundations",
            desc: "The four facets — why ArloUI looks and feels the way it does.",
            href: "/docs/foundations",
          },
          {
            label: "Primitives",
            desc: "Tokens, type scale, color, spacing, motion, icons.",
            href: "/docs/primitives",
          },
          {
            label: "Components",
            desc: "React Native components — the implementations.",
            href: "/docs/components",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-line p-5 hover:border-line-strong"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            <div className="text-base font-medium text-ink">{card.label}</div>
            <div className="mt-1.5 text-sm text-ink-2">{card.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
