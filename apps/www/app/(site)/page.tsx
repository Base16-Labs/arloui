import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <h1 className="text-[64px] font-medium leading-none tracking-tight text-ink">
        ArloUI
      </h1>
      <p className="mt-5 max-w-[480px] text-center text-[22px] leading-relaxed text-ink-2">
        Copy-paste React Native components with strong defaults, full state
        coverage, and motion specs.
      </p>
      <div className="mt-10 flex gap-3">
        <Link
          href="/docs"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas"
        >
          Read the docs
        </Link>
        <a
          href="https://github.com/Base16-Labs/arloui"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink-2"
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
