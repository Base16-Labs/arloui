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
import { TextAreaDocPlayground } from "@/components/docs/textarea-doc-playground";
import { TextAreaPhonePreview } from "@/components/docs/textarea-phone-preview";
import { SheetDocPlayground } from "@/components/docs/sheet-doc-playground";
import { SheetPhonePreview } from "@/components/docs/sheet-phone-preview";
import {
  DatePickerDocPlayground,
  DatePickerPhonePreview,
} from "@/components/docs/date-picker-preview";
import { FormControlDocPlayground, type Control } from "@/components/docs/form-control-doc-playground";
import { FormControlPhonePreview } from "@/components/docs/form-control-phone-preview";
import {
  DocIconArrowRight,
  DocIconLock,
} from "@/components/docs/button-preview-icons";
import { componentGroups } from "@/lib/routes";
import {
  buttonData,
  checkboxData,
  datePickerData,
  docDataToMarkdown,
  inputData,
  radioData,
  sheetData,
  textAreaData,
  toggleData,
} from "@/lib/docs-markdown";

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

  if (slug === "toggle") {
    return <FormControlDocPage data={toggleData} />;
  }

  if (slug === "checkbox") {
    return <FormControlDocPage data={checkboxData} />;
  }

  if (slug === "radio") {
    return <FormControlDocPage data={radioData} />;
  }

  if (slug === "text-area") {
    return <TextAreaDocPage />;
  }

  if (slug === "sheet") {
    return <SheetDocPage />;
  }

  if (slug === "date-picker") {
    return <DatePickerDocPage />;
  }

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

function DatePickerDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(datePickerData)} label="Copy markdown" />
        </div>

        <Eyebrow>{datePickerData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {datePickerData.title}
        </h1>
        <Lede>{datePickerData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={datePickerData.source}>
            ⌘ Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DatePickerPhonePreview />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A predictable calendar surface with a month header, navigation, weekday labels, and a fixed six-week grid."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[350px] space-y-3">
              {[
                ["Header", "month and year"],
                ["Navigation", "previous and next month"],
                ["Week labels", "Sunday or Monday start"],
                ["Day grid", "42 stable cells"],
                ["Selection", "single selected date"],
              ].map(([name, detail]) => (
                <div key={name} className="flex items-center justify-between border-b border-line pb-3 text-[13px] last:border-0 last:pb-0">
                  <span className="font-medium text-ink">{name}</span>
                  <code className="font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="when-to-use" title="When to use" sub="Use a visible calendar when the date itself matters.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>For appointments, bookings, deadlines, and dates users need to compare visually.</li>
            <li>When unavailable dates or a valid range must be visible before selection.</li>
            <li>Use a native date input instead when speed matters more than calendar context.</li>
          </ul>
        </Section>

        <DatePickerDocPlayground states={datePickerData.states} />

        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npx arloui add date-picker

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

const [date, setDate] = useState<Date | null>(null);

<DatePicker
  value={date}
  onValueChange={setDate}
  minDate={new Date()}
  weekStartsOn={1}
  isDateDisabled={(day) => day.getDay() === 0}
/>`}</CodeBlock>
        </Section>

        <Section id="tokens" title="Tokens used" sub="Calendar color, type, radius, and touch targets come from the same Arlo foundations.">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {datePickerData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Dates remain understandable without relying on color.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Every date exposes its complete weekday, month, day, and year to screen readers.</li>
            <li>Selected and disabled dates use native accessibility state.</li>
            <li>Day cells preserve a 44px touch target even though the visible selection is 36px.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep date choices legible and bounded.">
          <DoDont
            pairs={[
              {
                do: "Set minDate, maxDate, and disabled dates from the real booking rules.",
                dont: "Allow selection first and reveal an invalid date only after submission.",
              },
              {
                do: "Use Monday or Sunday week start to match the user's locale.",
                dont: "Change week start between calendars in the same product.",
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Compose the picker into the flow that fits the task.">
          <div className="flex flex-wrap gap-2">
            {["Input", "Sheet", "Button", "Time Picker"].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...datePickerData.headings]} actions={[...datePickerData.actions]} />
    </>
  );
}

function SheetDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        {/* Page-level copy markdown */}
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(sheetData)} label="Copy markdown" />
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

        <SheetPhonePreview />

        {/* Anatomy */}
        <Section
          id="anatomy"
          title="Anatomy"
          sub="A sheet is a bottom-anchored surface with a handle, optional backdrop, content slots, and safe-area aware detents."
        >
          <div className="rounded-xl border border-line bg-[#f8f6ef] p-6 sm:p-10 dark:bg-surface-raised">
            <div className="mx-auto max-w-[360px]">
              <div className="relative h-[300px] overflow-hidden rounded-[28px] border border-line-strong bg-[#F9FAFB] dark:bg-[#09090B]">
                <div className="px-5 pt-6">
                  <div className="h-3 w-20 rounded-full bg-[#D1D5DC] dark:bg-[#364153]" />
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {["#155DFC", "#00C950", "#F54900", "#FB2C36"].map((color) => (
                      <div
                        key={color}
                        className="h-14 rounded-xl opacity-25 dark:opacity-45"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] border-x border-t border-white/70 bg-white/85 px-5 pb-5 pt-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#111827]/85">
                  <div className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-[#D1D5DC] dark:bg-[#364153]" />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-ink-3">header</span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-ink-3">dismiss</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10" />
                    <div className="h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10" />
                    <div className="h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10" />
                  </div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-wide text-ink-3">footer / safe area</div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ["Backdrop", "scrim or pass-through"],
                ["Surface", "solid or glass"],
                ["Handle", "visible drag affordance"],
                ["Header", "title and optional action"],
                ["Body", "scrollable content area"],
                ["Footer", "sticky actions / safe-area padding"],
                ["Detent", "auto · full · fractional height"],
                ["Dismissal", "backdrop tap · drag · hardware back"],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px]"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="shrink-0 font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
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

        <SheetDocPlayground states={sheetData.states} />

        {/* Code */}
        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npx arloui add sheet

import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { Sheet } from "@/components/ui/sheet";

<Sheet
  visible={open}
  onClose={() => setOpen(false)}
  backdrop="passthrough"
  surface="glass"
  presentation="stack"
  detent="auto"
  horizontalInset={16}
  bottomOffset={16}
  cornerRadius={20}
  handleHeight={3}
  blurComponent={
    <BlurView
      intensity={34}
      tint="systemMaterial"
      style={StyleSheet.absoluteFill}
    />
  }
>
  <Sheet.Header title="Add to collection" />
  <Sheet.Body>
    {/* Your content */}
  </Sheet.Body>
  <Sheet.Footer>
    {/* Primary action */}
  </Sheet.Footer>
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
          <CopyButton text={docDataToMarkdown(inputData)} label="Copy markdown" />
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

function TextAreaDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(textAreaData)} label="Copy markdown" />
        </div>

        <Eyebrow>{textAreaData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {textAreaData.title}
        </h1>
        <Lede>{textAreaData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={textAreaData.figma}>
            ◆ Figma <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={textAreaData.source}>
            ⌘ Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <TextAreaPhonePreview />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A multiline surface with optional label, leading/trailing slots, helper or error text, and an optional character count."
        >
          <div className="rounded-xl border border-line bg-[#f8f6ef] p-6 sm:p-10 dark:bg-surface-raised">
            <div className="mx-auto max-w-[360px]">
              <div className="mb-2 flex justify-between px-1 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                <span>label</span>
                <span>value</span>
                <span>count</span>
              </div>
              <div className="min-h-24 rounded-[16px] bg-[#F3F4F6] px-3 py-3">
                <div className="text-[12px] font-medium leading-4 text-[#65758B]">Message</div>
                <p className="mt-1 text-[14px] leading-5 text-[#364153]">
                  This is a calm place to write longer content.
                </p>
              </div>
              <div className="mt-1.5 flex justify-between gap-3 px-1 text-[11px] text-[#65758B]">
                <span>Helper / error text</span>
                <span>48/200</span>
              </div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ["Container fill", "colors.surfaceInput"],
                ["Value text", "typography.body · textPrimary"],
                ["Placeholder", "colors.textTertiary"],
                ["Height", "96px min-height"],
                ["Corner radius", "radii.xl / 16px (filled) · 0 (plain)"],
                ["Padding", "spacing.3 inside · spacing.0 wrapper"],
                ["Error border", "colors.borderError"],
                ["Helper / count", "typography.bodySm · textSecondary"],
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

        <Section id="when-to-use" title="When to use" sub="Use TextArea when the answer needs room to breathe.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Use it for comments, notes, support messages, bios, descriptions, and feedback forms.</li>
            <li>Use <code className="font-mono text-[13px]">filled</code> when the field needs a clear standalone touch surface.</li>
            <li>Use <code className="font-mono text-[13px]">plain</code> when the parent card, sheet, or row already frames the field.</li>
          </ul>
        </Section>

        <TextAreaDocPlayground states={[...textAreaData.states]} />

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <CodeBlock language="tsx">{`npx arloui add text-area

import { TextArea } from "@/components/ui/text-area";

<TextArea
  label="Message"
  placeholder="Write a message"
  value={message}
  onChangeText={setMessage}
  helperText="Keep it short and specific."
  maxLength={200}
  showCount
/>

<TextArea
  appearance="plain"
  value={notes}
  onChangeText={setNotes}
  errorText={hasError ? "Message is required" : undefined}
/>`}</CodeBlock>
        </Section>

        <Section id="tokens" title="Tokens used" sub="The same semantic tokens used by Input, adapted for multiline content.">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {textAreaData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Longer fields need clear labels and concise validation.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Always provide a visible label or an accessibility label when the visual label is omitted.</li>
            <li>Use helper text for guidance and error text for validation; do not overload helper text with paragraphs.</li>
            <li>Pair <code className="font-mono text-[13px]">maxLength</code> with <code className="font-mono text-[13px]">showCount</code> when users need a hard limit.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: "Keep the field tall enough for the expected answer.",
                dont: "Use a single-line input for messages or notes that naturally wrap.",
              },
              {
                do: "Use counters for constrained content like bios or support tickets.",
                dont: "Show a counter when there is no meaningful limit.",
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {["Input", "Button", "Sheet", "Form row", "Keyboard toolbar"].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...textAreaData.headings]} actions={[...textAreaData.actions]} />
    </>
  );
}

function ButtonDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(buttonData)} label="Copy markdown" />
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

function FormControlDocPage({ data }: { data: typeof toggleData | typeof checkboxData | typeof radioData }) {
  const isToggle = data.slug === "toggle";
  const isCheckbox = data.slug === "checkbox";
  const isRadio = data.slug === "radio";

  const installCmd = `npx arloui add ${data.slug}`;
  const importLine = isToggle
    ? `import { Toggle } from "@/components/ui/toggle";`
    : isCheckbox
      ? `import { Checkbox } from "@/components/ui/checkbox";`
      : `import { Radio } from "@/components/ui/radio";`;

  const usageSnippet = isToggle
    ? `<Toggle
  value={notifications}
  onValueChange={setNotifications}
  accessibilityLabel="Enable notifications"
/>

<Toggle size="sm" value={true} disabled />
`
    : isCheckbox
      ? `<Checkbox
  checked={agreed}
  onCheckedChange={setAgreed}
  accessibilityLabel="I agree to the terms"
/>

<Checkbox size="lg" checked={true} disabled />
`
      : `<Radio
  selected={plan === "pro"}
  onSelect={() => setPlan("pro")}
  accessibilityLabel="Pro plan"
/>

{/* Filled dot style */}
<Radio appearance="filled" selected={true} />

{/* Outlined thick ring style (default) */}
<Radio appearance="outlined" selected={true} />
`;

  const whenToUse = isToggle
    ? [
        "Use for binary settings that take effect immediately — Wi-Fi, dark mode, notifications.",
        "Prefer a checkbox when the change requires a separate submit action.",
        "Keep the label outside the toggle; the control itself is purely visual.",
      ]
    : isCheckbox
      ? [
          "Use for multi-select options within a form that will be submitted together.",
          "Use when toggling a single opt-in (\"I agree to terms\") that requires explicit confirmation.",
          "Prefer a toggle when the state takes effect immediately without a submit step.",
        ]
      : [
          "Use for mutually exclusive choices within a small group (2–6 options).",
          "Use outlined appearance for a subtle ring indicator; use filled for a dot that fills in.",
          "Prefer a select or picker when the option count exceeds what fits comfortably on screen.",
        ];

  const a11yNotes = isToggle
    ? [
        "Exposes accessibilityRole \"switch\" with checked and disabled state.",
        "Touch target expands to 44pt minimum via hitSlop.",
        "Thumb slide animation uses motion tokens; respects reduce-motion settings.",
      ]
    : isCheckbox
      ? [
          "Exposes accessibilityRole \"checkbox\" with checked and disabled state.",
          "Touch target expands to 44pt minimum via hitSlop.",
          "Fill animation uses motion.duration.instant with easeOut easing.",
        ]
      : [
          "Exposes accessibilityRole \"radio\" with selected and disabled state.",
          "Does not fire onSelect when already selected — prevents redundant callbacks.",
          "Touch target expands to 44pt minimum via hitSlop.",
        ];

  const doDont = isToggle
    ? [
        { do: "Use for settings that apply instantly without a save step.", dont: "Use a toggle inside a form that has a submit button — use a checkbox instead." },
        { do: "Place the label to the left or above the toggle, never inside.", dont: "Use a toggle for actions (\"Delete account\") — those need buttons." },
      ]
    : isCheckbox
      ? [
        { do: "Use in forms where multiple options can be selected and submitted together.", dont: "Use a checkbox for an instant-effect setting — use a toggle instead." },
        { do: "Pair with a visible label; the checkbox alone has no text.", dont: "Nest checkboxes more than one level deep — flatten the hierarchy." },
      ]
      : [
        { do: "Group radios visually and semantically — they represent one choice.", dont: "Use radios when multiple selections are valid — use checkboxes." },
        { do: "Pre-select the most common option so the user can confirm with one tap.", dont: "Mix outlined and filled appearances in the same radio group." },
      ];

  const related = isToggle
    ? ["Checkbox", "Radio", "Input", "Button"]
    : isCheckbox
      ? ["Toggle", "Radio", "Input", "Button"]
      : ["Toggle", "Checkbox", "Input", "Button"];

  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(data)} label="Copy markdown" />
        </div>

        <Eyebrow>{data.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {data.title}
        </h1>
        <Lede>{data.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={data.figma}>
            ◆ Figma <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={data.source}>
            ⌘ Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <FormControlPhonePreview control={data.slug as Control} />

        <Section id="anatomy" title="Anatomy" sub={`The parts of a ${data.title}.`}>
          <div className="rounded-xl border border-line bg-[#f8f6ef] p-6 sm:p-10 dark:bg-surface-raised">
            {isToggle && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex h-8 w-[52px] items-center rounded-full bg-[#E5E7EB] px-[3px]">
                    <div className="size-[26px] rounded-full bg-white shadow-sm" />
                  </div>
                  <div className="flex h-8 w-[52px] items-center rounded-full bg-[#155DFC] px-[3px]">
                    <div className="ml-auto size-[26px] rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <div className="mt-2 flex gap-12 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                  <span>off</span>
                  <span>on</span>
                </div>
                <div className="flex flex-col gap-y-0 border-t border-line pt-5 w-full max-w-[380px]">
                  {[
                    ["Track", "52×32 (md) · 40×24 (sm)"],
                    ["Thumb", "26px (md) · 18px (sm)"],
                    ["Track fill", "interactivePrimary (on)"],
                    ["Track empty", "surfaceInput (off)"],
                    ["Corner radius", "height / 2 (capsule)"],
                    ["Animation", "duration.fast · easeOut"],
                  ].map(([name, token]) => (
                    <div key={name} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px]">
                      <span className="text-ink-2">{name}</span>
                      <code className="shrink-0 font-mono text-[11px] text-ink-3">{token}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isCheckbox && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex size-6 items-center justify-center rounded-md border-[1.5px] border-[#D1D5DC]" />
                  <div className="flex size-6 items-center justify-center rounded-md bg-[#155DFC]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5L5.5 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="flex flex-col gap-y-0 border-t border-line pt-5 w-full max-w-[380px]">
                  {[
                    ["Box", "24px (md) · 20px (sm) · 32px (lg)"],
                    ["Check icon", "14px (md) SVG path"],
                    ["Fill", "interactivePrimary (checked)"],
                    ["Border", "borderPrimary (unchecked)"],
                    ["Corner radius", "radii.sm (sm) · radii.md-2 (md)"],
                    ["Animation", "duration.instant · easeOut"],
                  ].map(([name, token]) => (
                    <div key={name} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px]">
                      <span className="text-ink-2">{name}</span>
                      <code className="shrink-0 font-mono text-[11px] text-ink-3">{token}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isRadio && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-[#D1D5DC]" />
                  <div className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-[#155DFC]">
                    <div className="size-3 rounded-full bg-[#155DFC]" />
                  </div>
                  <div className="flex size-6 items-center justify-center rounded-full bg-[#155DFC]">
                    <div className="size-[10px] rounded-full bg-white" />
                  </div>
                </div>
                <div className="mt-2 flex gap-8 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                  <span>unselected</span>
                  <span>filled</span>
                  <span>outlined</span>
                </div>
                <div className="flex flex-col gap-y-0 border-t border-line pt-5 w-full max-w-[380px]">
                  {[
                    ["Outer", "24px (md) · 20px (sm) · 32px (lg)"],
                    ["Dot (filled)", "12px (md) · scales in"],
                    ["Hole (outlined)", "10px (md) · bg-colored"],
                    ["Border", "borderPrimary / interactivePrimary"],
                    ["Animation", "duration.instant · easeOut"],
                    ["Appearances", "outlined (ring) · filled (dot)"],
                  ].map(([name, token]) => (
                    <div key={name} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px]">
                      <span className="text-ink-2">{name}</span>
                      <code className="shrink-0 font-mono text-[11px] text-ink-3">{token}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section id="when-to-use" title="When to use" sub="Choosing the right form control.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            {whenToUse.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </Section>

        <FormControlDocPlayground control={data.slug as Control} states={[...data.states]} />

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <div className="space-y-3">
            <CodeBlock language="tsx">{`${installCmd}\n\n${importLine}`}</CodeBlock>
            <CodeBlock language="tsx">{usageSnippet}</CodeBlock>
          </div>
        </Section>

        <Section id="tokens" title="Tokens used" sub="Semantic tokens driving color, size, and motion.">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {data.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Semantics, focus, and hit targets.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            {a11yNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont pairs={doDont} />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...data.headings]} actions={[...data.actions]} />
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
