import Link from "next/link";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { componentGroups } from "@/lib/routes";

export default function ComponentsIndexPage() {
  return (
    <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
      <Eyebrow>Components</Eyebrow>
      <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
        Components
      </h1>
      <Lede>
        React Native components — the implementations. Copy-paste primitives
        with strong defaults, full state coverage, and motion specs.
      </Lede>

      <div className="mt-10 space-y-10">
        {componentGroups.map((group) => (
          <div key={group.label}>
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
              {group.label}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/components/${item.slug}`}
                  className="rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink hover:border-line-strong"
                  style={{ transitionDuration: "var(--dur-fast)" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
