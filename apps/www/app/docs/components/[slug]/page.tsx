import { notFound } from "next/navigation";
import { RightRail } from "@/components/nav/RightRail";
import { Eyebrow } from "@/components/mdx/Eyebrow";
import { Lede } from "@/components/mdx/Lede";
import { DoDont } from "@/components/mdx/DoDont";
import { Pill } from "@/components/ui/Pill";
import { Chip } from "@/components/ui/Chip";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CopyButton } from "@/components/ui/CopyButton";
import { ButtonDocPlayground } from "@/components/docs/button-doc-playground";
import { ButtonPhonePreview } from "@/components/docs/button-phone-preview";
import { InputDocPlayground } from "@/components/docs/input-doc-playground";
import { InputPhonePreview } from "@/components/docs/input-phone-preview";
import { SheetDocPlayground } from "@/components/docs/sheet-doc-playground";
import {
  DocIconArrowRight,
  DocIconLock,
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
    "The primary commitment surface on a mobile screen — strong defaults across three tones and four appearances, with press feedback that earns the tap.",
  figma:
    "https://figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=266-4982",
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
    "RTL",
    "dynamic type",
  ],
  tokens: [
    "colors.interactivePrimary",
    "colors.feedbackError",
    "colors.feedbackErrorBg",
    "colors.feedbackInfoBg",
    "colors.textInteractivePrimary",
    "colors.textInteractiveError",
    "colors.textInteractiveTertiary",
    "colors.textPrimary",
    "colors.textSecondary",
    "colors.textInverse",
    "colors.textTertiary",
    "colors.surfaceInput",
    "colors.interactiveDisabled",
    "colors.interactiveTertiaryPressed",
    "colors.touchFeedbackMain",
    "colors.borderPrimary",
    "colors.borderError",
    "colors.borderSecondary",
    "sizing.buttonHeight.sm",
    "sizing.buttonHeight.md",
    "sizing.buttonHeight.lg",
    "sizing.buttonHeight.xl",
    "sizing.icon.xs",
    "sizing.icon.sm",
    "sizing.icon.md",
    "sizing.touchTarget.minimum",
    "radii.full",
    "focusRing.main",
    "focusRing.error",
    "spacing.3",
    "spacing.4",
    "spacing.5",
    "spacing.6",
    "typography.body",
    "typography.bodySm",
    "typography.title3",
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

const inputData = {
  slug: "input",
  category: "Controls",
  title: "Input",
  lede:
    "A token-driven text input for forms, search, passwords, and compact no-background fields. Use filled inputs when the field needs a clear touch surface; use plain inputs when the surrounding layout already provides structure.",
  figma: "#",
  source:
    "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/input",
  states: [
    "empty",
    "filled",
    "focused",
    "helper",
    "error",
    "disabled",
    "password",
    "search",
    "leading icon",
    "trailing action",
    "dark mode",
  ],
  tokens: [
    "surfaceInput",
    "textPrimary",
    "textTertiary",
    "textInteractiveError",
    "borderFocus",
    "borderError",
    "sizing.icon",
    "radii.md",
    "typography.body",
    "typography.bodySm",
  ],
  headings: [
    { id: "anatomy", label: "Anatomy" },
    { id: "when-to-use", label: "When to use" },
    { id: "variants", label: "Variants" },
    { id: "states", label: "States" },
    { id: "code", label: "Code" },
    { id: "tokens", label: "Tokens" },
    { id: "accessibility", label: "Accessibility" },
    { id: "do-dont", label: "Do · Don't" },
    { id: "related", label: "Related" },
  ],
  actions: [
    { label: "View registry source ↗", href: "https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/input" },
    { label: "Open playground ↗", href: "http://localhost:8081/input" },
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

  if (slug === "input") {
    return <InputDocPage />;
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
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
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
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {sheetData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        {/* Accessibility */}
        <Section id="accessibility" title="Accessibility" sub="Screen reader semantics, focus, dismissal.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
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

function InputDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text="" label="Copy markdown" />
        </div>

        <Eyebrow>{inputData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {inputData.title}
        </h1>
        <Lede>{inputData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={inputData.figma}>
            ◆ Figma <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={inputData.source}>
            ⌘ Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <InputPhonePreview />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="Named slots map directly to the registry Input props — sized, spaced, and coloured from tokens."
        >
          <div className="rounded-xl border border-line bg-[#f8f6ef] p-6 sm:p-10 dark:bg-surface-raised">
            <div className="mx-auto max-w-[320px]">
              <div className="mb-2 flex justify-between px-1 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                <span>leadingIcon</span>
                <span>label · value</span>
                <span>trailingAction</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-[#F3F4F6] px-3 py-2">
                <span className="size-4 shrink-0 rounded-sm border border-line-strong" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] leading-4 text-[#99A1AF]">Username</div>
                  <div className="text-[14px] font-medium leading-5 text-[#364153]">@allanthomas</div>
                </div>
                <span className="size-4 shrink-0 rounded-sm border border-line-strong" aria-hidden />
              </div>
              <div className="mt-1.5 px-1 text-[11px] text-[#6A7282]">Helper / error text</div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ["Inset label", "typography.bodySm / label"],
                ["Value text", "typography.body · textPrimary"],
                ["Placeholder", "colors.textTertiary"],
                ["Leading / trailing icon", "sizing.icon.xs–sm"],
                ["Container fill", "colors.surfaceInput"],
                ["Corner radius", "radii.md (filled) · 0 (plain)"],
                ["Padding", "spacing.3 horizontal · spacing.1–2 vertical"],
                ["Focus / error border", "colors.borderFocus / borderError"],
                ["Helper / error text", "colors.textSecondary / textInteractiveError"],
              ].map(([name, token]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px]"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="shrink-0 font-mono text-[11px] text-ink-3">{token}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="when-to-use" title="When to use" sub="Choose the surface treatment based on layout context.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Use <code className="font-mono text-[13px]">filled</code> for standalone form rows, settings screens, and search inputs that need a visible hit area.</li>
            <li>Use <code className="font-mono text-[13px]">plain</code> for no-background fields inside dense forms, table-like layouts, or surfaces that already frame the content.</li>
            <li>Use inset labels when the field needs to keep context after a value is entered.</li>
          </ul>
        </Section>

        <InputDocPlayground states={[...inputData.states]} />

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <CodeBlock language="tsx">{`npx arloui add input

import { Input, InputAction } from "@/components/ui/input";

<Input
  label="Email"
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>

<Input
  appearance="plain"
  value="Content"
  helperText="Helper text"
  trailingAction={
    <InputAction accessibilityLabel="Copy input value" onPress={copyValue}>
      <CopyIcon />
    </InputAction>
  }
/>

<Input
  label="Password"
  insetLabel
  secureTextEntry={!visible}
  errorText={hasError ? "Incorrect password" : undefined}
/>`}</CodeBlock>
        </Section>

        <Section id="tokens" title="Tokens used" sub="These are the tokens that make the filled and no-bg treatments consistent.">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {inputData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Input semantics should survive every visual variant.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Pass a visible label or an accessibility label for fields without on-screen labels.</li>
            <li>Use helper text for guidance and error text for validation feedback; errors use semantic error color tokens.</li>
            <li>Trailing actions use <code className="font-mono text-[13px]">InputAction</code> so touch targets stay large enough.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: "Use plain/no-bg inputs when the parent surface already creates enough structure.",
                dont: "Stack filled input boxes inside another heavy card when the layout already feels framed.",
              },
              {
                do: "Keep helper text short and tied to the field state.",
                dont: "Use helper text as a paragraph of instructions under every field.",
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {["Button", "Search", "Form row", "Sheet", "Picker"].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...inputData.headings]} actions={[...inputData.actions]} />
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

        <ButtonPhonePreview />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="Every Button is the same slots — an optional leading icon, the label, an optional trailing icon — sized and spaced entirely from tokens."
        >
          <div className="rounded-xl border border-line bg-[#f8f6ef] p-6 sm:p-10 dark:bg-surface-raised">
            <div className="flex flex-col items-center gap-3">
              <div className="mb-1 flex w-full max-w-[300px] justify-between px-1 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                <span>leadingIcon</span>
                <span>label</span>
                <span>trailingIcon</span>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute -inset-2.5 rounded-[22px] border border-dashed border-line-strong" />
                <div className="relative flex items-center gap-2 rounded-full bg-[#155DFC] px-4 py-2.5 text-white shadow-sm">
                  <DocIconLock className="size-[18px] opacity-95" aria-hidden />
                  <span className="text-[14px] font-semibold leading-none">Button</span>
                  <DocIconArrowRight className="size-[18px] opacity-95" aria-hidden />
                </div>
              </div>
              <span className="font-mono text-[10px] text-ink-3">
                dashed bound = 44pt touch target (hitSlop)
              </span>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ["Label", "typography.body · weight 600"],
                ["Leading / trailing icon", "sizing.icon.xs–md"],
                ["Height", "sizing.buttonHeight.sm–xl · 36–52"],
                ["Corner radius", "radii.full (pill)"],
                ["Horizontal padding", "spacing.3–6 by size"],
                ["Icon ↔ label gap", "spacing.1–3 by size"],
                ["Pressed overlay", "colors.touchFeedbackMain"],
                ["Focus ring (web)", "focusRing.main / error"],
              ].map(([name, token]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px]"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="shrink-0 font-mono text-[11px] text-ink-3">{token}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="when-to-use" title="When to use" sub="Three rules.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
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
              Full-width pills with a provider mark and fixed label, the way the{" "}
              <span className="font-medium text-ink-2">Social</span> frame lays
              them out. All four providers — Google, Apple, Facebook, and X — ship in{" "}
              <code className="font-mono text-[12px] text-ink-2">
                SocialAuthButton
              </code>{" "}
              via{" "}
              <code className="font-mono text-[12px] text-ink-2">platform</code>{" "}
              and{" "}
              <code className="font-mono text-[12px] text-ink-2">type</code>{" "}
              (<code className="font-mono text-[12px] text-ink-2">fill</code> or{" "}
              <code className="font-mono text-[12px] text-ink-2">secondary</code>).
            </>
          }
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
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
          <div className="space-y-3">
            <CodeBlock language="tsx">{`npx arloui add button

import { Button, GhostButton, FAB, SocialAuthButton } from "@/components/ui/button";`}</CodeBlock>

            <CodeBlock language="tsx">{`// Tone x appearance
<Button tone="primary" appearance="solid">Continue</Button>
<Button tone="neutral" appearance="soft">Cancel</Button>
<Button tone="neutral" appearance="outline">Skip</Button>
<Button tone="danger" appearance="solid">Delete</Button>

// Icons, icon-only, loading, full width
<Button leadingIcon={<ArrowLeft />}>Back</Button>
<Button trailingIcon={<ChevronRight />}>Next</Button>
<Button iconOnly accessibilityLabel="Settings" leadingIcon={<Settings />} />
<Button loading>Submit</Button>
<Button fullWidth>Continue</Button>`}</CodeBlock>

            <CodeBlock language="tsx">{`// Ghost - chromeless, low emphasis
<GhostButton type="primary">Learn more</GhostButton>
<GhostButton type="destructive">Remove</GhostButton>

// FAB - floating action, requires accessibilityLabel
<FAB tone="primary" icon={<Plus />} accessibilityLabel="Add item" onPress={handleAdd} />

// Social auth - fixed provider styling, four platforms
<SocialAuthButton platform="google" type="fill" onPress={handleGoogle} />
<SocialAuthButton platform="apple" type="secondary" onPress={handleApple} />`}</CodeBlock>
          </div>
        </Section>

        <Section id="tokens" title="Tokens used" sub="Semantic tokens that drive tone, size, spacing, and interaction states.">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {buttonData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Semantics, focus, hit targets, and motion.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Exposes accessibilityRole &quot;button&quot; with the label from children or an explicit accessibilityLabel.</li>
            <li>icon-only buttons and FAB require accessibilityLabel — without it the control announces nothing useful.</li>
            <li>Loading sets accessibilityState busy and blocks interaction until the action resolves.</li>
            <li>Web focus draws the design-system focus ring (primary, or error for the danger tone).</li>
            <li>The sm (36px) and md (40px) sizes expand to a 44pt touch target via hitSlop.</li>
            <li>prefers-reduced-motion replaces the press scale with an opacity dim to 0.85, and the loading spinner runs at reduced speed.</li>
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
