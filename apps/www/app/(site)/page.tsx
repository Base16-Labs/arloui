import Link from "next/link";
import { GithubMark } from "@/components/ui/GithubMark";

const GITHUB_URL = "https://github.com/Base16-Labs/arloui";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-start overflow-hidden px-6 pt-16 sm:pt-24">
      <div className="flex w-full max-w-[760px] flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1 text-[12px] font-medium text-ink-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Beta
        </div>

        <h1 className="mt-6 text-[28px] font-medium leading-[1.05] tracking-tight sm:text-[36px] lg:text-[44px]">
          Mobile UI that looks
          <br className="hidden sm:block" /> great by default.
        </h1>

        <p className="mt-5 max-w-[520px] text-[14px] leading-relaxed text-ink-2 sm:text-[15px]">
          An agent-first component library for building beautiful mobile apps.
          Copy-paste components with strong defaults, full state coverage, and
          motion specs. React Native today, SwiftUI soon.
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/docs"
            className="flex w-full items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas transition-opacity hover:opacity-90 sm:w-auto"
          >
            Read the docs
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-2.5 text-sm text-ink-2 transition-colors hover:bg-ink/[0.04] hover:text-ink sm:w-auto"
          >
            <GithubMark size={15} />
            GitHub
          </a>
        </div>

        <p className="mt-7 text-[13px] text-ink-3">
          Made for agents — just as good in the hands of engineers and vibe
          coders.
        </p>
      </div>
    </main>
  );
}
