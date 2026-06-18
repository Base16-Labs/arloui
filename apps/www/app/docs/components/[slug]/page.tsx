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
import { InputDocPlayground } from "@/components/docs/input-doc-playground";
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
    "plain / no bg",
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

        <PreviewCard className="mb-12">
          <PhoneFrame>
            <div className="flex h-full flex-col justify-center gap-6 overflow-hidden bg-[#F9FAFB] px-5 py-8 dark:bg-[#09090B]">
              <div className="space-y-3">
                <InputPreviewRow label="Name" value="Allan Thomas" />
                <InputPreviewRow label="Password" value="••••••••" icon="eye" state="error" helper="Incorrect password" />
              </div>

              <div className="rounded-xl bg-[#09090B] px-5 py-5 dark:bg-black">
                <div className="space-y-5">
                  <InputPreviewRow appearance="plain" value="Content" icon="copy" helper="Helper text" />
                  <InputPreviewRow appearance="plain" value="••••••••" icon="eye" helper="Helper text" focused />
                </div>
              </div>
            </div>
          </PhoneFrame>
        </PreviewCard>

        <Section
          id="anatomy"
          title="Anatomy"
          sub="Named slots map directly to the registry Input props."
        >
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-[#f8f6ef] font-mono text-xs text-ink-3 dark:bg-surface-raised">
            label · leadingIcon · leadingAction · TextInput · trailingAction · helper/error text
          </div>
        </Section>

        <Section id="when-to-use" title="When to use" sub="Choose the surface treatment based on layout context.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
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
          <div className="flex flex-wrap gap-2">
            {inputData.tokens.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-[#f8f6ef] px-2.5 py-[5px] font-mono text-xs text-ink-2 dark:bg-surface-raised"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Input semantics should survive every visual variant.">
          <ul className="ml-5 space-y-1 text-[15px] leading-relaxed text-ink-2">
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

function InputPreviewRow({
  appearance = "filled",
  label,
  value,
  icon,
  helper,
  state,
  focused = false,
  disabled = false,
  muted = false,
}: {
  appearance?: "filled" | "plain";
  label?: string;
  value: string;
  icon?: "copy" | "eye" | "mail";
  helper?: string;
  state?: "error";
  focused?: boolean;
  disabled?: boolean;
  muted?: boolean;
}) {
  const isPlain = appearance === "plain";
  const tone = state === "error" ? "text-[#FB2C36]" : isPlain ? "text-[#65758B]" : "text-[#6A7282]";
  const textTone = muted ? "text-[#D1D5DC]" : state === "error" ? "text-[#FB2C36]" : isPlain ? "text-[#D1D5DC]" : "text-[#364153]";

  return (
    <div className={isPlain ? "min-w-0" : "space-y-1.5"}>
      <div
        className={
          isPlain
            ? "flex min-h-8 items-center gap-2 bg-transparent"
            : `flex min-h-[54px] items-center gap-2 rounded-md bg-[#F3F4F6] px-3.5 ${
                state === "error" ? "ring-1 ring-[#FB2C36]" : focused ? "ring-1 ring-[#155DFC]" : ""
              }`
        }
      >
        {icon === "mail" ? <MailGlyph className={`size-4 shrink-0 ${tone}`} /> : null}
        <div className="min-w-0 flex-1">
          {label ? (
            <div className={`text-[11px] leading-4 ${state === "error" ? "text-[#FB2C36]" : "text-[#99A1AF]"}`}>
              {label}
            </div>
          ) : null}
          <div className={`truncate text-[15px] font-medium leading-5 ${textTone} ${disabled ? "opacity-35" : ""}`}>
            {value}
            {focused ? <span className="ml-0.5 text-[#155DFC]">|</span> : null}
          </div>
        </div>
        {icon === "copy" ? <CopyGlyph className={`size-4 shrink-0 ${tone} ${disabled ? "opacity-35" : ""}`} /> : null}
        {icon === "eye" ? <EyeOffGlyph className={`size-4 shrink-0 ${tone} ${disabled ? "opacity-35" : ""}`} /> : null}
      </div>
      {helper ? (
        <div className={`mt-1 flex items-center gap-1 text-[10px] leading-3 ${state === "error" ? "text-[#FB2C36]" : "text-[#65758B]"}`}>
          <span className="flex size-3 items-center justify-center rounded-full border border-current text-[8px] font-semibold">
            i
          </span>
          <span>{helper}</span>
        </div>
      ) : null}
    </div>
  );
}

function CopyGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 8h10v10H8z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 15V5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 7.5C4.2 9 3 12 3 12s3 6 9 6c1.7 0 3.1-.5 4.3-1.1M10 6.2A9.8 9.8 0 0 1 12 6c6 0 9 6 9 6s-.7 1.5-2.1 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
