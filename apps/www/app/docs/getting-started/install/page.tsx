import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { CodeBlock } from "@/components/ui/CodeBlock";

const headings = [
  { id: "prerequisites", label: "Prerequisites" },
  { id: "setup", label: "Set up" },
  { id: "add", label: "Add components" },
  { id: "peer-deps", label: "Peer dependencies" },
  { id: "sync", label: "Staying in sync" },
];

const inlineCode =
  "rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[14px] text-ink dark:bg-surface-raised";

export default function InstallPage() {
  return (
    <>
      <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <Eyebrow>Getting started</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          Install
        </h1>
        <Lede>
          Arlo UI isn&apos;t an npm component library — the{" "}
          <code className={inlineCode}>arloui</code> CLI copies source components
          into your project, so you own and can edit every file.
        </Lede>

        <section id="prerequisites" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Prerequisites
          </h2>
          <p className="text-[17px] leading-relaxed text-ink-2">
            A React Native app on React 19 and React Native 0.79+ — an Expo
            project (SDK 53+) is the smoothest path. Arlo UI is built and tested
            on Expo SDK 54 / React Native 0.81.
          </p>
        </section>

        <section id="setup" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Set up
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Run <code className={inlineCode}>init</code> once. It asks where your
            components, tokens, and theme should live, writes an{" "}
            <code className={inlineCode}>arlo.json</code>, and copies in the
            design tokens and the{" "}
            <code className={inlineCode}>ThemeProvider</code>.
          </p>
          <CodeBlock language="bash">npx arloui init</CodeBlock>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
            Then wrap your app root in the provider so components can read tokens:
          </p>
          <CodeBlock language="tsx">{`import { ThemeProvider } from "@/lib/arloui/theme-provider";

export default function App() {
  return <ThemeProvider>{/* your app */}</ThemeProvider>;
}`}</CodeBlock>
        </section>

        <section id="add" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Add components
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Pull in a component (and its dependencies) as source files. Add one or
            several at a time:
          </p>
          <CodeBlock language="bash">{`npx arloui add button
npx arloui add button card sheet`}</CodeBlock>
        </section>

        <section id="peer-deps" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Peer dependencies
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Components rely on a few native packages —{" "}
            <code className={inlineCode}>react-native-svg</code>,{" "}
            <code className={inlineCode}>react-native-reanimated</code>,{" "}
            <code className={inlineCode}>react-native-gesture-handler</code>, and{" "}
            <code className={inlineCode}>expo-haptics</code> — only when they use
            them. Each <code className={inlineCode}>add</code> prints exactly which
            ones the component needs; install those:
          </p>
          <CodeBlock language="bash">
            npx expo install react-native-svg react-native-reanimated
          </CodeBlock>
        </section>

        <section id="sync" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Staying in sync
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            Because components live in your repo, you edit them freely. See what
            the registry offers and whether your local copies have drifted:
          </p>
          <CodeBlock language="bash">{`npx arloui list          # everything available
npx arloui diff button   # local vs. registry`}</CodeBlock>
        </section>
      </main>
      <RightRail headings={headings} />
    </>
  );
}
