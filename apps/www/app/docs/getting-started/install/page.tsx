import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";

const headings = [
  { id: "prerequisites", label: "Prerequisites" },
  { id: "install", label: "Install" },
  { id: "peer-deps", label: "Peer dependencies" },
  { id: "expo", label: "Expo notes" },
];

export default function InstallPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Getting started</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Install
        </h1>
        <Lede>
          npm install, peer deps, Expo notes.
        </Lede>

        <section id="prerequisites" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Prerequisites
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            React Native 0.76+, Expo SDK 52+, and React 19.
          </p>
        </section>

        <section id="install" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Install
          </h2>
          <div className="rounded-xl border border-line bg-surface-sunken p-4 font-mono text-sm dark:bg-surface-raised">
            npx arloui init
          </div>
        </section>

        <section id="peer-deps" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Peer dependencies
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            ArloUI requires react-native-reanimated, react-native-gesture-handler,
            and react-native-svg.
          </p>
        </section>

        <section id="expo" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Expo notes
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            If you&apos;re using Expo, peer dependencies are handled automatically
            via the Expo config plugin.
          </p>
        </section>
      </main>
      <RightRail headings={headings} />
    </>
  );
}
