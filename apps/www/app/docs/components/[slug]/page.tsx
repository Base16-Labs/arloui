import { notFound } from "next/navigation";
import { RightRail } from "@/components/nav/RightRail";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { DoDont } from "@/components/mdx/DoDont";
import { Pill } from "@/components/ui/Pill";
import { Chip } from "@/components/ui/Chip";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CopyButton } from "@/components/ui/CopyButton";
import { PhoneFrame, PreviewCard } from "@/components/ui/PhoneFrame";
import { ButtonDocPlayground } from "@/components/docs/button-doc-playground";
import { SheetDocPlayground } from "@/components/docs/sheet-doc-playground";
import {
  DocAppleMark,
  DocFacebookMark,
  DocGoogleMark,
  DocIconArrowRight,
  DocIconLock,
  DocXMark,
  pillRowClass,
} from "@/components/docs/button-preview-icons";
import { componentGroups } from "@/lib/routes";

const sheetData = {
  slug: "sheet",
  category: "Layout & surface",
  title: "Sheet",
  lede: "A bottom-anchored surface with detents — the most-used navigation primitive on mobile, and the moment to demonstrate Fluidity in your UI.",
  figma: "#",
  source: "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/sheet",
  states: [
    "default", "presented", "peek", "dragging", "full", "dismissing",
    "disabled", "loading", "error", "empty", "long content", "RTL",
    "dynamic-type", "reduced motion", "dark mode", "light mode",
  ],
  tokens: ["radius.sheet", "color.scrim", "motion.ease-sheet", "motion.duration-sheet", "space.sheet-pad"],
  headings: [
    { id: "anatomy", label: "Anatomy" },
    { id: "when-to-use", label: "When to use" },
    { id: "archetypes", label: "Archetypes" },
    { id: "variants", label: "Variants" },
    { id: "states", label: "States" },
    { id: "motion", label: "Motion" },
    { id: "code", label: "Code" },
    { id: "tokens", label: "Tokens" },
    { id: "accessibility", label: "Accessibility" },
    { id: "do-dont", label: "Do · Don't" },
    { id: "related", label: "Related" },
  ],
  actions: [
    { label: "View as markdown ↗", href: "/docs/components/sheet.md" },
    { label: "Edit on GitHub ↗", href: "https://github.com/Base16-Labs/arloui" },
  ],
};

const buttonData = {
  slug: "button",
  category: "Controls",
  title: "Button",
  lede:
    "Hierarchy comes from tone, appearance, and size. From there, add icons or an icon-only control, plus loading and disabled where your screen calls for them. Measurements and states follow the Figma Buttons/Button component and the semantic tokens on this page.",
  figma: "#",
  source:
    "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/button",
  states: [
    "default",
    "pressed",
    "loading",
    "disabled",
    "focus",
    "icon-only",
    "reduced motion",
    "dark mode",
    "light mode",
    "RTL",
    "dynamic type",
  ],
  tokens: [
    "sizing.buttonHeight",
    "sizing.icon",
    "interactivePrimary",
    "interactiveError",
    "interactiveSecondary",
    "interactiveDisabled",
    "textDisabled",
    "touchFeedbackMain",
    "interactiveTertiaryPressed",
    "motion.duration.press",
    "motion.pressed.scale",
  ],
  headings: [
    { id: "anatomy", label: "Anatomy" },
    { id: "when-to-use", label: "When to use" },
    { id: "archetypes", label: "Archetypes" },
    { id: "variants", label: "Variants" },
    { id: "states", label: "States" },
    { id: "motion", label: "Motion" },
    { id: "social-auth", label: "Social auth" },
    { id: "code", label: "Code" },
    { id: "tokens", label: "Tokens" },
    { id: "accessibility", label: "Accessibility" },
    { id: "do-dont", label: "Do · Don't" },
    { id: "related", label: "Related" },
  ],
  actions: [
    { label: "View as markdown ↗", href: "/docs/components/button.md" },
    { label: "Edit on GitHub ↗", href: "https://github.com/Base16-Labs/arloui" },
  ],
} as const;

export function generateStaticParams() {
  return componentGroups.flatMap((g) =>
    g.items.map((item) => ({ slug: item.slug }))
  );
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const exists = componentGroups.some((g) => g.items.some((item) => item.slug === slug));
  if (!exists) notFound();

  if (slug === "button") {
    return <ButtonDocPage />;
  }

  if (slug !== "sheet") {
    return (
      <>
        <main className="max-w-[820px] flex-1 px-14 pt-10 pb-20">
          <Eyebrow>Component</Eyebrow>
          <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>
          <Lede>This component page is coming soon.</Lede>
        </main>
        <RightRail headings={[]} actions={[]} />
      </>
    );
  }

  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        {/* Page-level copy markdown */}
        <div className="absolute top-10 right-14">
          <CopyButton text="" label="Copy markdown" />
        </div>

        <Eyebrow>{sheetData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {sheetData.title}
        </h1>
        <Lede>{sheetData.lede}</Lede>

        {/* Action pills */}
        <div className="mb-9 flex gap-2">
          <Pill as="a" href={sheetData.figma}>
            ◆ Figma <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={sheetData.source}>
            ⌘ Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <SheetDocPlayground states={sheetData.states} />

        {/* Anatomy */}
        <Section id="anatomy" title="Anatomy" sub="Named slots so the spec is unambiguous.">
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] font-mono text-xs text-ink-3 dark:bg-surface-raised">
            handle · header · content · scrim · detent line · safe area
          </div>
        </Section>

        {/* When to use */}
        <Section id="when-to-use" title="When to use" sub="Three rules.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
            <li>For a secondary task that should not interrupt the parent context.</li>
            <li>When the input or selection list is short enough to fit a natural-content detent.</li>
            <li>When dismissal should be available via gesture, not just a button.</li>
          </ul>
        </Section>

        {/* Archetypes */}
        <Section id="archetypes" title="Archetypes that use Sheet" sub="Click an archetype for the full screen recipe.">
          <div className="flex flex-wrap gap-2">
            {["Question", "Sheet over content", "Detail"].map((a) => (
              <Chip key={a}>→ {a}</Chip>
            ))}
          </div>
        </Section>

        {/* Code */}
        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npm install @arloui/sheet

import { Sheet } from "@arloui/sheet";

<Sheet detents={["medium","full"]}>
  ...
</Sheet>`}</CodeBlock>
        </Section>

        {/* Tokens used */}
        <Section id="tokens" title="Tokens used" sub="Click any to jump to its definition in /docs/primitives/tokens.">
          <div className="flex flex-wrap gap-2">
            {sheetData.tokens.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-[#f8f6ef] px-2.5 py-[5px] font-mono text-xs text-ink-2 dark:bg-surface-raised"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

        {/* Accessibility */}
        <Section id="accessibility" title="Accessibility" sub="Screen reader semantics, focus, dismissal.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
            <li>VoiceOver / TalkBack announces as a modal sheet.</li>
            <li>Focus traps inside the sheet; Esc / hardware back dismisses.</li>
            <li>Respects prefers-reduced-motion — fades instead of slides.</li>
          </ul>
        </Section>

        {/* Do / Don't */}
        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: "Detent at content height; reach for full only when content demands it.",
                dont: "Spring straight to full on a row tap — it teleports the user.",
              },
              {
                do: "Dismiss on velocity ≥ 0.11 px/ms, not just distance.",
                dont: "Require an explicit close button when a swipe dismiss is available.",
              },
            ]}
          />
        </Section>

        {/* Related */}
        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {["Tray", "Scrim", "Picker", "Modal (rare)"].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={sheetData.headings} actions={sheetData.actions} />
    </>
  );
}

function ButtonDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text="" label="Copy markdown" />
        </div>

        <Eyebrow>{buttonData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">{buttonData.title}</h1>
        <Lede>{buttonData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={buttonData.figma}>
            ◆ Figma <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={buttonData.source}>
            ⌘ Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <PreviewCard className="mb-12">
          <PhoneFrame>
            <div className="relative flex h-full flex-col items-center overflow-y-auto bg-[#f4f4f2] px-4 py-5">
              <div className="flex w-full max-w-[220px] flex-col items-center gap-3">
                <div className="flex w-full flex-col items-center gap-2">
                  <button
                    type="button"
                    className={`${pillRowClass()} bg-[#155DFC] text-white shadow-sm`}
                  >
                    <DocIconLock className="size-[18px] shrink-0 opacity-95" />
                    <span className="whitespace-nowrap">Button</span>
                    <DocIconArrowRight className="size-[18px] shrink-0 opacity-95" />
                  </button>
                  <button
                    type="button"
                    className={`${pillRowClass()} bg-[#F3F4F6] text-[#364153]`}
                  >
                    <DocIconLock className="size-[18px] shrink-0 text-[#364153]" />
                    <span className="whitespace-nowrap">Button</span>
                    <DocIconArrowRight className="size-[18px] shrink-0 text-[#364153]" />
                  </button>
                  <button
                    type="button"
                    className={`${pillRowClass()} border border-[#155DFC] bg-transparent text-[#155DFC]`}
                  >
                    <DocIconLock className="size-[18px] shrink-0" />
                    <span className="whitespace-nowrap">Button</span>
                    <DocIconArrowRight className="size-[18px] shrink-0" />
                  </button>
                  <button
                    type="button"
                    className={`${pillRowClass()} bg-[#FB2C36] text-white`}
                  >
                    <DocIconLock className="size-[18px] shrink-0 opacity-95" />
                    <span className="whitespace-nowrap">Button</span>
                    <DocIconArrowRight className="size-[18px] shrink-0 opacity-95" />
                  </button>
                </div>

                <div className="flex justify-center gap-2 pt-0.5">
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#155DFC] text-white shadow-sm"
                    aria-label="Icon only, primary"
                  >
                    <DocIconLock className="size-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#364153]"
                    aria-label="Icon only, neutral"
                  >
                    <DocIconLock className="size-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#155DFC] bg-transparent text-[#155DFC]"
                    aria-label="Icon only, outline"
                  >
                    <DocIconLock className="size-[18px]" />
                  </button>
                </div>

                <div className="flex w-full flex-col items-center gap-2 border-t border-black/5 pt-3">
                  <button
                    type="button"
                    className={`${pillRowClass()} border border-[#DADCE0] bg-white text-[#1F1F1F]`}
                  >
                    <DocGoogleMark className="size-[18px] shrink-0" />
                    <span className="min-w-0 shrink truncate">Continue with Google</span>
                  </button>
                  <button
                    type="button"
                    className={`${pillRowClass()} bg-[#1877F2] text-white`}
                  >
                    <DocFacebookMark className="size-[18px] shrink-0 text-white" />
                    <span className="min-w-0 shrink truncate">
                      Continue with Facebook
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`${pillRowClass()} bg-black text-white`}
                  >
                    <DocXMark className="size-[18px] shrink-0 text-white" />
                    <span className="min-w-0 shrink truncate">Continue with X</span>
                  </button>
                  <button
                    type="button"
                    className={`${pillRowClass()} bg-black text-white`}
                  >
                    <DocAppleMark className="size-[18px] shrink-0 text-white" />
                    <span className="min-w-0 shrink truncate">
                      Continue with Apple
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </PreviewCard>

        <Section
          id="anatomy"
          title="Anatomy"
          sub="Layout slots mirror the registry component — label, optional icons, and pressed/loading overlays."
        >
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] font-mono text-xs text-ink-3 dark:bg-surface-raised">
            label · leadingIcon · trailingIcon · press overlay · focus ring · minHeight (pill radius)
          </div>
        </Section>

        <Section id="when-to-use" title="When to use" sub="Three rules.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
            <li>Use the primary solid button for the single highest-commitment action on the surface.</li>
            <li>Use neutral soft or outline for secondary actions that should stay visible but quieter.</li>
            <li>Reserve danger tone for destructive or irreversible actions — keep copy explicit.</li>
          </ul>
        </Section>

        <Section id="archetypes" title="Archetypes that use Button" sub="Click an archetype for the full screen recipe.">
          <div className="flex flex-wrap gap-2">
            {["Onboarding", "Detail", "Settings", "Creation", "Decision"].map((a) => (
              <Chip key={a}>→ {a}</Chip>
            ))}
          </div>
        </Section>

        <ButtonDocPlayground states={buttonData.states} />

        <Section
          id="social-auth"
          title="Social auth"
          sub={
            <>
              Full-width pills with a provider mark and label, the way the{" "}
              <span className="font-medium text-ink-2">Social</span> frame lays
              them out. Facebook and X are implemented as{" "}
              <code className="font-mono text-[12px] text-ink-2">
                SocialAuthButton
              </code>
              . For Google or Apple, it&apos;s usually a{" "}
              <code className="font-mono text-[12px] text-ink-2">Button</code>{" "}
              and whatever artwork you pass through{" "}
              <code className="font-mono text-[12px] text-ink-2">
                renderLeading
              </code>
              .
            </>
          }
        >
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
            <li>
              Implementation:{" "}
              <a
                className="underline decoration-[color-mix(in_srgb,var(--ink-2)_25%,transparent)] underline-offset-2 hover:decoration-inherit"
                href="https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/button/social-auth-button.tsx"
              >
                <code className="text-[13px]">social-auth-button.tsx</code>
              </a>
            </li>
            <li>
              Drop in SVGs from{" "}
              <code className="text-[13px]">@arloui/icons</code> or your own
              bundle; the defaults stay text-only so you are not forced to ship
              every provider logo.
            </li>
          </ul>
        </Section>

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <CodeBlock language="tsx">{`npx arloui add button

import { Button, SocialAuthButton } from "@/components/ui/button";

<Button label="Continue" tone="primary" appearance="solid" />
<Button label="Cancel" tone="neutral" appearance="outline" />
<Button label="Remove" tone="danger" appearance="solid" />

<SocialAuthButton provider="facebook" appearance="brandSolid" />
<SocialAuthButton provider="x" appearance="brandSolid" />`}</CodeBlock>
        </Section>

        <Section id="tokens" title="Tokens used" sub="Click any to jump to its definition in /docs/primitives/tokens.">
          <div className="flex flex-wrap gap-2">
            {buttonData.tokens.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-[#f8f6ef] px-2.5 py-[5px] font-mono text-xs text-ink-2 dark:bg-surface-raised"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Semantics, focus, and loading.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
            <li>Exposes accessibilityRole &quot;button&quot; with label from props or explicit accessibilityLabel.</li>
            <li>Web focus uses the design-system focus ring tokens (primary vs danger).</li>
            <li>Loading sets accessibilityState busy; interaction is disabled until the action completes.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: "Use one primary solid CTA per view; pair with neutral outline or soft for secondary actions.",
                dont: "Stack multiple identical primary solids — users lose hierarchy.",
              },
              {
                do: "Keep labels short; put detail in supporting body copy or a sheet.",
                dont: "Let button text wrap to three lines — increase hit target height instead.",
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {["FabButton", "SocialAuthButton", "Pill", "Chip", "Field"].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...buttonData.headings]} actions={[...buttonData.actions]} />
    </>
  );
}

function Section({
  id,
  title,
  sub,
  children,
}: {
  id: string;
  title: string;
  sub?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">{title}</h2>
      {sub && <p className="mt-1.5 mb-5 text-[13px] text-ink-3">{sub}</p>}
      {children}
    </section>
  );
}
