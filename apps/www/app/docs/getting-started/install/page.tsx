import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { RightRail } from "@/components/nav/RightRail";
import { CodeBlock } from "@/components/ui/CodeBlock";

const headings = [
  { id: "prerequisites", label: "Prerequisites" },
  { id: "setup", label: "Set up" },
  { id: "fonts", label: "Fonts" },
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
            on Expo SDK 57 / React Native 0.86. A new{" "}
            <code className={inlineCode}>create-expo-app</code> project starts on
            SDK 58 / React Native 0.88; component refs use{" "}
            <code className={inlineCode}>ComponentRef</code> so the same source
            typechecks there too.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
            Opening the app in Expo Go? If it says the project is incompatible
            with this version of Expo Go, update Expo Go from the App Store or
            Play Store so it matches your project&apos;s SDK.
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
            <code className={inlineCode}>ThemeProvider</code>. On the default
            Expo template, where <code className={inlineCode}>@/*</code> points
            at <code className={inlineCode}>./src/*</code>, those files go under{" "}
            <code className={inlineCode}>src/</code> so the imports below resolve.
          </p>
          <CodeBlock language="bash">npx arloui init</CodeBlock>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
            Wrap your app root in the provider so components can read tokens.
            Expo Router already exports a{" "}
            <code className={inlineCode}>ThemeProvider</code>, so alias this one:
          </p>
          <CodeBlock language="tsx">{`import { ThemeProvider as ArloThemeProvider } from "@/lib/arloui/theme-provider";
import { useArloFonts } from "@/lib/arloui/fonts";

export default function App() {
  const [fontsLoaded] = useArloFonts();
  if (!fontsLoaded) return null;
  return <ArloThemeProvider>{/* your app */}</ArloThemeProvider>;
}`}</CodeBlock>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
            <code className={inlineCode}>setName(&apos;system&apos;)</code> follows
            the OS appearance. When the OS reports no scheme, that resolves to dark.
          </p>
        </section>

        <section id="fonts" className="mt-12">
          <h2 className="mb-4 text-[28px] font-medium leading-tight tracking-tight">
            Fonts
          </h2>
          <p className="mb-4 text-[17px] leading-relaxed text-ink-2">
            <code className={inlineCode}>init</code> writes{" "}
            <code className={inlineCode}>fonts.ts</code> next to the theme
            provider. Install the font packages, then load them with{" "}
            <code className={inlineCode}>useArloFonts()</code> before the first
            screen, as in the snippet above.
          </p>
          <CodeBlock language="bash">
            npx expo install expo-font @expo-google-fonts/manrope @expo-google-fonts/space-mono
          </CodeBlock>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
            Tokens use <code className={inlineCode}>fontFamily: &apos;Manrope&apos;</code>{" "}
            plus a separate <code className={inlineCode}>fontWeight</code>. A
            development build resolves that pair when the{" "}
            <code className={inlineCode}>expo-font</code> plugin groups every
            Manrope file under one family — <code className={inlineCode}>init</code>{" "}
            prints the plugin entry. Expo Go cannot build that family, so{" "}
            <code className={inlineCode}>useArloFonts</code> also registers each
            file under its own name and exports{" "}
            <code className={inlineCode}>arloFont(weight)</code> for that name.
            Space Mono is registered as{" "}
            <code className={inlineCode}>&apos;Space Mono&apos;</code>, which is{" "}
            <code className={inlineCode}>fontFamilies.mono</code>.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
            <code className={inlineCode}>t.typography.*</code> sets size, line
            height, and weight. It does not set{" "}
            <code className={inlineCode}>fontFamily</code>. Add{" "}
            <code className={inlineCode}>fontFamily: t.fontFamilies.sans</code>{" "}
            on text you style from the type scale.
          </p>
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
