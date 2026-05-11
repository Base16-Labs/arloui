import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { gettingStartedItems } from "@/lib/routes";

export default function GettingStartedPage() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Getting started</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        Getting started
      </h1>
      <Lede>
        Install ArloUI, drop a skill pack into your editor, and build your first
        screen in five minutes.
      </Lede>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {gettingStartedItems.map((item) => (
          <Link
            key={item.slug}
            href={`/docs/getting-started/${item.slug}`}
            className="rounded-xl border border-line p-5 hover:border-line-strong"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            <div className="text-base font-medium text-ink">{item.label}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
