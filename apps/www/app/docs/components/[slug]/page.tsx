import { notFound } from 'next/navigation';
import { RightRail } from '@/components/nav/RightRail';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { DoDont } from '@/components/mdx/DoDont';
import { Pill } from '@/components/ui/Pill';
import { Chip } from '@/components/ui/Chip';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CopyButton } from '@/components/ui/CopyButton';
import { ButtonDocPlayground } from '@/components/docs/button-doc-playground';
import { InputDocPlayground } from '@/components/docs/input-doc-playground';
import { TextAreaDocPlayground } from '@/components/docs/textarea-doc-playground';
import { SheetDocPlayground } from '@/components/docs/sheet-doc-playground';
import { TabBarDocPlayground } from '@/components/docs/tab-bar-preview';
import { TabsDocPlayground } from '@/components/docs/tabs-preview';
import { SkeletonDocPlayground } from '@/components/docs/skeleton-preview';
import { SpinnerDocPlayground } from '@/components/docs/spinner-preview';
import { DatePickerDocPlayground } from '@/components/docs/date-picker-preview';
import {
  FormControlDocPlayground,
  type Control,
} from '@/components/docs/form-control-doc-playground';
import { CarouselDocPlayground } from '@/components/docs/carousel-preview';
import { GalleryDocPlayground } from '@/components/docs/gallery-preview';
import { BadgeDocPlayground } from '@/components/docs/badge-doc-playground';
import { ChipDocPlayground } from '@/components/docs/chip-doc-playground';
import { ChartFormsPreview } from '@/components/docs/chart-preview';
import { DevicePreview } from '@/components/ui/DevicePreview';
import { GithubMark } from '@/components/ui/GithubMark';
import { DocIconArrowRight, DocIconLock } from '@/components/docs/button-preview-icons';
import { componentGroups } from '@/lib/routes';
import {
  buttonData,
  checkboxData,
  datePickerData,
  docDataToMarkdown,
  inputData,
  radioData,
  sheetData,
  skeletonData,
  spinnerData,
  tabBarData,
  tabsData,
  textAreaData,
  toggleData,
  carouselData,
  galleryData,
  badgeData,
  chipData,
  toastData,
  chartData,
} from '@/lib/docs-markdown';

export function generateStaticParams() {
  return componentGroups.flatMap((g) => g.items.map((item) => ({ slug: item.slug })));
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const exists = componentGroups.some((g) => g.items.some((item) => item.slug === slug));
  if (!exists) notFound();

  if (slug === 'button') {
    return <ButtonDocPage />;
  }

  if (slug === 'input') {
    return <InputDocPage />;
  }

  if (slug === 'toggle') {
    return <FormControlDocPage data={toggleData} />;
  }

  if (slug === 'checkbox') {
    return <FormControlDocPage data={checkboxData} />;
  }

  if (slug === 'radio') {
    return <FormControlDocPage data={radioData} />;
  }

  if (slug === 'text-area') {
    return <TextAreaDocPage />;
  }

  if (slug === 'sheet') {
    return <SheetDocPage />;
  }

  if (slug === 'date-picker') {
    return <DatePickerDocPage />;
  }

  if (slug === 'tab-bar') {
    return <TabBarDocPage />;
  }

  if (slug === 'tabs') {
    return <TabsDocPage />;
  }

  if (slug === 'skeleton') {
    return <SkeletonDocPage />;
  }

  if (slug === 'spinner') {
    return <SpinnerDocPage />;
  }

  if (slug === 'carousel') {
    return <CarouselDocPage />;
  }

  if (slug === 'gallery') {
    return <GalleryDocPage />;
  }

  if (slug === 'badge') {
    return <BadgeDocPage />;
  }

  if (slug === 'chip') {
    return <ChipDocPage />;
  }

  if (slug === 'toast') {
    return <ToastDocPage />;
  }

  if (slug === 'chart') {
    return <ChartDocPage />;
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

function TabsDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(tabsData)} label="Copy markdown" />
        </div>

        <Eyebrow>{tabsData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {tabsData.title}
        </h1>
        <Lede>{tabsData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={tabsData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="tabs" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A set of peer destinations with exactly one selected item."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[420px]">
              {[
                ['Container', 'content width or equal distribution'],
                ['Item', 'label and 44px touch target'],
                ['Selection', 'weight, underline, or filled surface'],
                ['Tone', 'neutral or accent'],
                ['Content', 'the current in-screen view'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px] last:border-0"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="when-to-use"
          title="When to use"
          sub="For sibling content or views inside the current screen."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Use plain tabs for quiet categorisation where hierarchy is already obvious.</li>
            <li>Use underline tabs for persistent sections with a strong current-location cue.</li>
            <li>Use filled tabs for compact view switching or mutually exclusive filters.</li>
          </ul>
        </Section>

        <TabsDocPlayground />

        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npx arloui add tabs

import { Tabs } from "@/components/ui/tabs";

<Tabs
  value={section}
  onValueChange={setSection}
  appearance="underline"
  tone="accent"
  layout="equal"
  accessibilityLabel="Profile sections"
>
  <Tabs.Item value="posts" label="Posts" />
  <Tabs.Item value="media" label="Media" />
  <Tabs.Item value="saved" label="Saved" />
</Tabs>`}</CodeBlock>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Text hierarchy, selection color, motion, radius, and touch foundations."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {tabsData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Selection remains clear beyond decoration."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Each item exposes the tab role with selected and disabled state.</li>
            <li>Every item preserves a 44px minimum touch target and a visible text label.</li>
            <li>
              Reduced motion removes selection travel while keeping the state change immediate.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep secondary navigation legible and local.">
          <DoDont
            pairs={[
              {
                do: 'Use short peer labels and keep their order stable.',
                dont: 'Mix actions such as Add or Edit into the tab set.',
              },
              {
                do: 'Use Tabs to switch content within the current screen.',
                dont: 'Use Tabs for primary app destinations — use Tab Bar instead.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Choose navigation by scope and utility."
        >
          <div className="flex flex-wrap gap-2">
            {['Tab Bar', 'Chip', 'Segmented Control', 'Header'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...tabsData.headings]} actions={[...tabsData.actions]} />
    </>
  );
}

function SkeletonDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(skeletonData)} label="Copy markdown" />
        </div>

        <Eyebrow>{skeletonData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {skeletonData.title}
        </h1>
        <Lede>{skeletonData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={skeletonData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="skeleton" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="One neutral bone, shaped to match the content that will replace it."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[420px]">
              {[
                ['Geometry', 'width, height, and shape'],
                ['Base', 'neutral loading surface'],
                ['Highlight', 'optional moving sheen'],
                ['Motion', 'shimmer, pulse, or none'],
                ['Composition', 'mirrors final content layout'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px] last:border-0"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="when-to-use"
          title="When to use"
          sub="For loading states whose layout is already known."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Use when content takes long enough to load that an empty surface would feel broken.
            </li>
            <li>
              Match the approximate size and hierarchy of the incoming content to prevent layout
              shift.
            </li>
            <li>
              Prefer a spinner for an indeterminate action with no meaningful content geometry.
            </li>
          </ul>
        </Section>

        <SkeletonDocPlayground />

        <Section id="code" title="Code" sub="React Native, copy-paste and compose.">
          <CodeBlock language="tsx">{`npx arloui add skeleton

import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

<View
  accessibilityLabel="Loading profile"
  accessibilityLiveRegion="polite"
  style={{ gap: 12 }}
>
  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
    <Skeleton shape="circle" width={44} height={44} />
    <View style={{ flex: 1, gap: 8 }}>
      <Skeleton shape="text" width="48%" />
      <Skeleton shape="text" width="30%" height={9} />
    </View>
  </View>
  <Skeleton height={180} borderRadius={16} animation="shimmer" />
</View>`}</CodeBlock>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Neutral surface, radius, and restrained motion foundations."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {skeletonData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Communicate loading once, not once per bone."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Skeleton bones are hidden from VoiceOver and TalkBack by default.</li>
            <li>
              Label the containing region as loading and announce it politely when appropriate.
            </li>
            <li>
              Reduced-motion settings disable shimmer and pulse while preserving the placeholder.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Make loading feel structurally honest.">
          <DoDont
            pairs={[
              {
                do: "Mirror the final content's broad geometry and hierarchy.",
                dont: 'Build a pixel-perfect fake copy of every word and control.',
              },
              {
                do: 'Animate a composed loading region as one calm system.',
                dont: 'Mix shimmer, pulse, and spinners in the same loading state.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Feedback pieces that cover other loading conditions."
        >
          <div className="flex flex-wrap gap-2">
            {['Spinner', 'Progress', 'Empty', 'Card'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...skeletonData.headings]} actions={[...skeletonData.actions]} />
    </>
  );
}

function SpinnerDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(spinnerData)} label="Copy markdown" />
        </div>

        <Eyebrow>{spinnerData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {spinnerData.title}
        </h1>
        <Lede>{spinnerData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={spinnerData.source}>
            <GithubMark size={14} /> Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="spinner" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="One indicator, sized and toned to the surface it sits on."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[420px]">
              {[
                ['Appearance', 'spokes, arc, dots, bars, or pulse'],
                ['Size', 'sm 16 · md 24 · lg 32, or an exact diameter'],
                ['Tone', 'neutral, accent, or an explicit colour'],
                ['Motion', 'held still under reduce-motion'],
                ['Announcement', 'a busy progressbar with an accessible name'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px] last:border-0"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="when-to-use"
          title="When to use"
          sub="For waiting that has no measurable progress."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Use for indeterminate work — submitting a form, reaching the network, resolving an
              action whose duration you cannot predict.
            </li>
            <li>
              Prefer a skeleton when the incoming content has a known shape, so the layout does not
              jump when it arrives.
            </li>
            <li>
              Reach for a determinate progress bar the moment you can actually measure completion.
            </li>
          </ul>
        </Section>

        <SpinnerDocPlayground />

        <Section id="code" title="Code" sub="React Native, copy-paste and compose.">
          <CodeBlock language="tsx">{`npx arloui add spinner

import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";

// Centred in a loading region
<View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
  <Spinner appearance="spokes" size="lg" accessibilityLabel="Loading your feed" />
</View>

// Inline in a busy button, tinted to the label beside it
<Spinner size="sm" color="#FFFFFF" />`}</CodeBlock>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Foreground tones and the reduced-motion foundation."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {spinnerData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Say what is loading, once."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Reports as a busy <code className="font-mono text-[12.5px]">progressbar</code>, so
              assistive tech announces the wait without a live region.
            </li>
            <li>
              Defaults to an accessible name of &ldquo;Loading&rdquo;; pass{' '}
              <code className="font-mono text-[12.5px]">accessibilityLabel</code> to name the
              specific work in flight.
            </li>
            <li>
              Under reduce-motion every transform is dropped and the shape holds still, so the
              indicator still reads as one.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep waiting states calm and singular.">
          <DoDont
            pairs={[
              {
                do: 'Show one spinner for one unit of work, and say what it is waiting on.',
                dont: 'Scatter several spinners across a screen that is loading as a whole.',
              },
              {
                do: 'Pick one appearance and keep it consistent across the product.',
                dont: 'Mix spokes, arcs, and dots in the same flow.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Other ways to represent work in flight."
        >
          <div className="flex flex-wrap gap-2">
            {['Skeleton', 'Progress', 'Button', 'Empty'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...spinnerData.headings]} actions={[...spinnerData.actions]} />
    </>
  );
}

function TabBarDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(tabBarData)} label="Copy markdown" />
        </div>

        <Eyebrow>{tabBarData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {tabBarData.title}
        </h1>
        <Lede>{tabBarData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={tabBarData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="tab-bar" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="One primary destination per item, one moving indicator, and one optional surface."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[420px]">
              {[
                ['Container', 'full or floating'],
                ['Surface', 'transparent or filled'],
                ['Item', 'icon and optional label'],
                ['Indicator', 'tracks the selected destination'],
                ['Badge', 'short, exceptional count'],
                ['Visibility', 'fixed or driven by scroll direction'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px] last:border-0"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="when-to-use" title="When to use" sub="For stable, top-level app destinations.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Use three to five destinations that remain available across the main app experience.
            </li>
            <li>Use floating when content should remain visible around the navigation surface.</li>
            <li>Use scroll-aware hiding only on immersive, vertically scrolling screens.</li>
          </ul>
        </Section>

        <TabBarDocPlayground />

        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npx arloui add tab-bar

import { ScrollView } from "react-native";
import { OutlineHouse, OutlineMagnifyingGlass, OutlineUser } from "@arloui/icons";
import { TabBar, useTabBarScroll } from "@/components/ui/tab-bar";

const scroll = useTabBarScroll();

<ScrollView onScroll={scroll.onScroll} scrollEventThrottle={16}>
  {/* Screen content */}
</ScrollView>

<TabBar
  value={tab}
  onValueChange={setTab}
  width="floating"
  surface="filled"
  hidden={scroll.hidden}
>
  <TabBar.Item
    value="home"
    label="Home"
    icon={({ color, size }) => <OutlineHouse color={color} width={size} height={size} />}
  />
  <TabBar.Item
    value="search"
    label="Search"
    icon={({ color, size }) => <OutlineMagnifyingGlass color={color} width={size} height={size} />}
  />
  <TabBar.Item
    value="profile"
    label="Profile"
    icon={({ color, size }) => <OutlineUser color={color} width={size} height={size} />}
  />
</TabBar>`}</CodeBlock>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Navigation color, motion, touch, radius, and elevation foundations."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {tabBarData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Selection, labels, and resilient touch targets."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Every destination exposes the tab role and selected state.</li>
            <li>Icon-only tabs retain their label for VoiceOver and TalkBack.</li>
            <li>
              Each item preserves at least a 44px touch target and reduced motion removes travel.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep primary navigation predictable.">
          <DoDont
            pairs={[
              {
                do: "Keep destination order stable and preserve each tab's navigation history.",
                dont: 'Reorder or remove destinations because the user scrolled.',
              },
              {
                do: 'Reveal the bar as soon as scroll direction reverses upward.',
                dont: 'Hide navigation on short screens or non-scrolling task flows.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Navigation pieces that compose with Tab Bar."
        >
          <div className="flex flex-wrap gap-2">
            {['Header', 'Nav', 'Badge', 'SafeArea'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...tabBarData.headings]} actions={[...tabBarData.actions]} />
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
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="date-picker" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="Two selection surfaces share one Date value: a visual calendar and a compact, snapping wheel."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[350px] space-y-3">
              {[
                ['Presentation', 'calendar or wheel'],
                ['Header', 'month and year'],
                ['Navigation', 'previous and next month'],
                ['Day grid', '42 stable cells'],
                ['Wheel columns', 'date, time, month, year'],
                ['Selection', 'centered highlighted row'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-center justify-between border-b border-line pb-3 text-[13px] last:border-0 last:pb-0"
                >
                  <span className="font-medium text-ink">{name}</span>
                  <code className="font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="when-to-use"
          title="When to use"
          sub="Choose the presentation that matches the decision."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              For appointments, bookings, deadlines, and dates users need to compare visually.
            </li>
            <li>When unavailable dates or a valid range must be visible before selection.</li>
            <li>Use the wheel for compact date-time, time-only, or month-year selection.</li>
          </ul>
        </Section>

        <DatePickerDocPlayground states={datePickerData.states} />

        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npx arloui add date-picker

import { useState } from "react";
import { DatePicker, DateWheelPicker } from "@/components/ui/date-picker";

const [date, setDate] = useState<Date | null>(null);

<DatePicker
  value={date}
  onValueChange={setDate}
  minDate={new Date()}
  weekStartsOn={1}
  isDateDisabled={(day) => day.getDay() === 0}
/>

<DateWheelPicker
  value={date ?? undefined}
  onValueChange={setDate}
  mode="date-time"
  minuteInterval={5}
  hourCycle={12}
/>`}</CodeBlock>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Calendar and wheel surfaces share Arlo color, type, radius, and touch foundations."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {datePickerData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Dates remain understandable without relying on color."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Every date exposes its complete weekday, month, day, and year to screen readers.
            </li>
            <li>Selected and disabled dates use native accessibility state.</li>
            <li>
              Day cells preserve a 44px touch target even though the visible selection is 36px.
            </li>
            <li>
              Each wheel column is adjustable with screen-reader increment and decrement actions.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep date choices legible and bounded.">
          <DoDont
            pairs={[
              {
                do: 'Set minDate, maxDate, and disabled dates from the real booking rules.',
                dont: 'Allow selection first and reveal an invalid date only after submission.',
              },
              {
                do: "Use Monday or Sunday week start to match the user's locale.",
                dont: 'Change week start between calendars in the same product.',
              },
              {
                do: 'Use a wheel when users already know the date or time they need.',
                dont: 'Use a wheel when people need to compare availability across days.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Compose the picker into the flow that fits the task."
        >
          <div className="flex flex-wrap gap-2">
            {['Input', 'Sheet', 'Button'].map((item) => (
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
            <img src="/icons/figma.svg" alt="" className="h-3.5 w-3.5" aria-hidden="true" /> Figma{' '}
            <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={sheetData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="sheet" />

        {/* Anatomy */}
        <Section
          id="anatomy"
          title="Anatomy"
          sub="A sheet is a bottom-anchored surface with a handle, optional backdrop, content slots, and safe-area aware detents."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
            <div className="mx-auto max-w-[360px]">
              <div className="relative h-[300px] overflow-hidden rounded-[28px] border border-line-strong bg-canvas">
                <div className="px-5 pt-6">
                  <div className="h-3 w-20 rounded-full bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {['#155DFC', '#00C950', '#F54900', '#FB2C36'].map((color) => (
                      <div
                        key={color}
                        className="h-14 rounded-xl opacity-25 dark:opacity-45"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] border-x border-t border-white/70 bg-white/85 px-5 pb-5 pt-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#27272A]/85">
                  <div className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-ink-3">
                      header
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-ink-3">
                      dismiss
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10" />
                    <div className="h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10" />
                    <div className="h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10" />
                  </div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                    footer / safe area
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ['Backdrop', 'scrim or pass-through'],
                ['Surface', 'solid or glass'],
                ['Handle', 'visible drag affordance'],
                ['Header', 'title and optional action'],
                ['Body', 'scrollable content area'],
                ['Footer', 'sticky actions / safe-area padding'],
                ['Height', 'auto · half · full'],
                ['Width', 'default · stack'],
                ['Padding', 'none · md · lg'],
                ['Dismissal', 'backdrop tap · drag · hardware back'],
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
            <li>
              When the input or selection list is short enough to fit a natural-content detent.
            </li>
            <li>When dismissal should be available via gesture, not just a button.</li>
          </ul>
        </Section>

        {/* Archetypes */}
        <Section
          id="archetypes"
          title="Archetypes that use Sheet"
          sub="Click an archetype for the full screen recipe."
        >
          <div className="flex flex-wrap gap-2">
            {['Question', 'Sheet over content', 'Detail'].map((a) => (
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
  width="stack"
  snapPoints={[0.4, 0.92]}
  padding="md"
  handleHeight={3}
  motion="gentle"
  gesture={{ dismissDistance: 0.35, dismissVelocity: 0.75 }}
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

        <Section
          id="customization"
          title="Customization"
          sub="Strong defaults first — then override the axes that matter."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Layout axes stay token-driven: <code className="font-mono text-[13px]">width</code>,{' '}
              <code className="font-mono text-[13px]">height</code> (or a fraction like{' '}
              <code className="font-mono text-[13px]">0.4</code>),{' '}
              <code className="font-mono text-[13px]">padding</code>,{' '}
              <code className="font-mono text-[13px]">cornerRadius</code>, and{' '}
              <code className="font-mono text-[13px]">style</code>.
            </li>
            <li>
              Multi-detent: pass <code className="font-mono text-[13px]">snapPoints={[0.4, 0.92]}</code>{' '}
              to snap between resting heights; drag past the smallest to dismiss.
            </li>
            <li>
              Material axes compose: <code className="font-mono text-[13px]">backdrop</code> ×{' '}
              <code className="font-mono text-[13px]">surface</code>, plus optional{' '}
              <code className="font-mono text-[13px]">blurComponent</code>.
            </li>
            <li>
              Motion recipes: <code className="font-mono text-[13px]">motion=&quot;gentle&quot; | &quot;snappy&quot; | &quot;heavy&quot;</code>{' '}
              or an object for open/close duration, easing, and spring.
            </li>
            <li>
              Gesture: <code className="font-mono text-[13px]">gesture</code> tunes dismiss
              distance (default 35%), velocity, and overdrag resistance —{' '}
              <code className="font-mono text-[13px]">onDragEnd</code> reports the outcome.
            </li>
          </ul>
        </Section>

        {/* Tokens used */}
        <Section
          id="tokens"
          title="Tokens used"
          sub="Click any to jump to its definition in /docs/primitives/tokens."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {sheetData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        {/* Accessibility */}
        <Section
          id="accessibility"
          title="Accessibility"
          sub="Screen reader semantics, focus, dismissal."
        >
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
                do: 'Use auto height first; reach for full only when content demands it.',
                dont: 'Spring straight to full on a row tap — it teleports the user.',
              },
              {
                do: 'Dismiss on velocity ≥ 0.11 px/ms, not just distance.',
                dont: 'Require an explicit close button when a swipe dismiss is available.',
              },
            ]}
          />
        </Section>

        {/* Related */}
        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {['Tray', 'Scrim', 'Picker', 'Modal (rare)'].map((r) => (
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
            <img src="/icons/figma.svg" alt="" className="h-3.5 w-3.5" aria-hidden="true" /> Figma{' '}
            <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={inputData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="input" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="Named slots map directly to the registry Input props — sized, spaced, and coloured from tokens."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
            <div className="mx-auto max-w-[320px]">
              <div className="mb-2 flex justify-between px-1 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                <span>leadingIcon</span>
                <span>label · value</span>
                <span>trailingAction</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-[#F3F4F6] px-3 py-2">
                <span
                  className="size-4 shrink-0 rounded-sm border border-line-strong"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] leading-4 text-[#99A1AF]">Username</div>
                  <div className="text-[14px] font-medium leading-5 text-[#364153]">
                    @allanthomas
                  </div>
                </div>
                <span
                  className="size-4 shrink-0 rounded-sm border border-line-strong"
                  aria-hidden
                />
              </div>
              <div className="mt-1.5 px-1 text-[11px] text-[#6A7282]">Helper / error text</div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ['Inset label', 'typography.bodySm / label'],
                ['Value text', 'typography.body · textPrimary'],
                ['Placeholder', 'colors.textTertiary'],
                ['Leading / trailing icon', 'sizing.icon.xs–sm'],
                ['Container fill', 'colors.surfaceInput'],
                ['Corner radius', 'radii.md (filled) · 0 (plain)'],
                ['Padding', 'spacing.3 horizontal · spacing.1–2 vertical'],
                ['Focus / error border', 'colors.borderFocus / borderError'],
                ['Helper / error text', 'colors.textSecondary / textInteractiveError'],
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

        <Section
          id="when-to-use"
          title="When to use"
          sub="Choose the surface treatment based on layout context."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Use <code className="font-mono text-[13px]">filled</code> for standalone form rows,
              settings screens, and search inputs that need a visible hit area.
            </li>
            <li>
              Use <code className="font-mono text-[13px]">plain</code> for no-background fields
              inside dense forms, table-like layouts, or surfaces that already frame the content.
            </li>
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

        <Section
          id="tokens"
          title="Tokens used"
          sub="These are the tokens that make the filled and no-bg treatments consistent."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {inputData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Input semantics should survive every visual variant."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Pass a visible label or an accessibility label for fields without on-screen labels.
            </li>
            <li>
              Use helper text for guidance and error text for validation feedback; errors use
              semantic error color tokens.
            </li>
            <li>
              Trailing actions use <code className="font-mono text-[13px]">InputAction</code> so
              touch targets stay large enough.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: 'Use plain/no-bg inputs when the parent surface already creates enough structure.',
                dont: 'Stack filled input boxes inside another heavy card when the layout already feels framed.',
              },
              {
                do: 'Keep helper text short and tied to the field state.',
                dont: 'Use helper text as a paragraph of instructions under every field.',
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {['Button', 'Search', 'Form row', 'Sheet', 'Picker'].map((r) => (
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
            <img src="/icons/figma.svg" alt="" className="h-3.5 w-3.5" aria-hidden="true" /> Figma{' '}
            <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={textAreaData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="text-area" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A multiline surface with optional label, leading/trailing slots, helper or error text, and an optional character count."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
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
                ['Container fill', 'colors.surfaceInput'],
                ['Value text', 'typography.body · textPrimary'],
                ['Placeholder', 'colors.textTertiary'],
                ['Height', '96px min-height'],
                ['Corner radius', 'radii.xl / 16px (filled) · 0 (plain)'],
                ['Padding', 'spacing.3 inside · spacing.0 wrapper'],
                ['Error border', 'colors.borderError'],
                ['Helper / count', 'typography.bodySm · textSecondary'],
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

        <Section
          id="when-to-use"
          title="When to use"
          sub="Use TextArea when the answer needs room to breathe."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Use it for comments, notes, support messages, bios, descriptions, and feedback forms.
            </li>
            <li>
              Use <code className="font-mono text-[13px]">filled</code> when the field needs a clear
              standalone touch surface.
            </li>
            <li>
              Use <code className="font-mono text-[13px]">plain</code> when the parent card, sheet,
              or row already frames the field.
            </li>
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

        <Section
          id="tokens"
          title="Tokens used"
          sub="The same semantic tokens used by Input, adapted for multiline content."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {textAreaData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Longer fields need clear labels and concise validation."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Always provide a visible label or an accessibility label when the visual label is
              omitted.
            </li>
            <li>
              Use helper text for guidance and error text for validation; do not overload helper
              text with paragraphs.
            </li>
            <li>
              Pair <code className="font-mono text-[13px]">maxLength</code> with{' '}
              <code className="font-mono text-[13px]">showCount</code> when users need a hard limit.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: 'Keep the field tall enough for the expected answer.',
                dont: 'Use a single-line input for messages or notes that naturally wrap.',
              },
              {
                do: 'Use counters for constrained content like bios or support tickets.',
                dont: 'Show a counter when there is no meaningful limit.',
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {['Input', 'Button', 'Sheet', 'Form row', 'Keyboard toolbar'].map((r) => (
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
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {buttonData.title}
        </h1>
        <Lede>{buttonData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={buttonData.figma}>
            <img src="/icons/figma.svg" alt="" className="h-3.5 w-3.5" aria-hidden="true" /> Figma{' '}
            <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={buttonData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="button" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="Every Button is the same slots — an optional leading icon, the label, an optional trailing icon — sized and spaced entirely from tokens."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
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
                ['Label', 'typography.body · weight 600'],
                ['Leading / trailing icon', 'sizing.icon.xs–md'],
                ['Height', 'sizing.buttonHeight.sm–xl · 36–52'],
                ['Corner radius', 'radii.full (pill)'],
                ['Horizontal padding', 'spacing.3–6 by size'],
                ['Icon ↔ label gap', 'spacing.1–3 by size'],
                ['Pressed overlay', 'colors.touchFeedbackMain'],
                ['Focus ring (web)', 'focusRing.main / error'],
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
            <li>
              Use the primary solid button for the single highest-commitment action on the surface.
            </li>
            <li>
              Use neutral soft or outline for secondary actions that should stay visible but
              quieter.
            </li>
            <li>
              Reserve danger tone for destructive or irreversible actions — keep copy explicit.
            </li>
          </ul>
        </Section>

        <Section
          id="archetypes"
          title="Archetypes that use Button"
          sub="Click an archetype for the full screen recipe."
        >
          <div className="flex flex-wrap gap-2">
            {['Onboarding', 'Detail', 'Settings', 'Creation', 'Decision'].map((a) => (
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
              Full-width pills with a provider mark and fixed label, the way the{' '}
              <span className="font-medium text-ink-2">Social</span> frame lays them out. All four
              providers — Google, Apple, Facebook, and X — ship in{' '}
              <code className="font-mono text-[12px] text-ink-2">SocialAuthButton</code> via{' '}
              <code className="font-mono text-[12px] text-ink-2">platform</code> and{' '}
              <code className="font-mono text-[12px] text-ink-2">type</code> (
              <code className="font-mono text-[12px] text-ink-2">fill</code> or{' '}
              <code className="font-mono text-[12px] text-ink-2">secondary</code>).
            </>
          }
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Implementation:{' '}
              <a
                className="underline decoration-[color-mix(in_srgb,var(--ink-2)_25%,transparent)] underline-offset-2 hover:decoration-inherit"
                href="https://github.com/Base16-Labs/arloui/tree/main/packages/registry/src/components/button/social-auth-button.tsx"
              >
                <code className="text-[13px]">social-auth-button.tsx</code>
              </a>
            </li>
            <li>
              Drop in SVGs from <code className="text-[13px]">@arloui/icons</code> or your own
              bundle; the defaults stay text-only so you are not forced to ship every provider logo.
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

        <Section
          id="tokens"
          title="Tokens used"
          sub="Semantic tokens that drive tone, size, spacing, and interaction states."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {buttonData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Semantics, focus, hit targets, and motion."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Exposes accessibilityRole &quot;button&quot; with the label from children or an
              explicit accessibilityLabel.
            </li>
            <li>
              icon-only buttons and FAB require accessibilityLabel — without it the control
              announces nothing useful.
            </li>
            <li>
              Loading sets accessibilityState busy and blocks interaction until the action resolves.
            </li>
            <li>
              Web focus draws the design-system focus ring (primary, or error for the danger tone).
            </li>
            <li>The sm (36px) and md (40px) sizes expand to a 44pt touch target via hitSlop.</li>
            <li>
              prefers-reduced-motion replaces the press scale with an opacity dim to 0.85, and the
              loading spinner runs at reduced speed.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: 'Use one primary solid CTA per view; pair with neutral outline or soft for secondary actions.',
                dont: 'Stack multiple identical primary solids — users lose hierarchy.',
              },
              {
                do: 'Keep labels short; put detail in supporting body copy or a sheet.',
                dont: 'Let button text wrap to three lines — increase hit target height instead.',
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {['FabButton', 'SocialAuthButton', 'Pill', 'Chip', 'Field'].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...buttonData.headings]} actions={[...buttonData.actions]} />
    </>
  );
}

function FormControlDocPage({
  data,
}: {
  data: typeof toggleData | typeof checkboxData | typeof radioData;
}) {
  const isToggle = data.slug === 'toggle';
  const isCheckbox = data.slug === 'checkbox';
  const isRadio = data.slug === 'radio';

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
        'Use for binary settings that take effect immediately — Wi-Fi, dark mode, notifications.',
        'Prefer a checkbox when the change requires a separate submit action.',
        'Keep the label outside the toggle; the control itself is purely visual.',
      ]
    : isCheckbox
      ? [
          'Use for multi-select options within a form that will be submitted together.',
          'Use when toggling a single opt-in ("I agree to terms") that requires explicit confirmation.',
          'Prefer a toggle when the state takes effect immediately without a submit step.',
        ]
      : [
          'Use for mutually exclusive choices within a small group (2–6 options).',
          'Use outlined appearance for a subtle ring indicator; use filled for a dot that fills in.',
          'Prefer a select or picker when the option count exceeds what fits comfortably on screen.',
        ];

  const a11yNotes = isToggle
    ? [
        'Exposes accessibilityRole "switch" with checked and disabled state.',
        'Touch target expands to 44pt minimum via hitSlop.',
        'Thumb slide animation uses motion tokens; respects reduce-motion settings.',
      ]
    : isCheckbox
      ? [
          'Exposes accessibilityRole "checkbox" with checked and disabled state.',
          'Touch target expands to 44pt minimum via hitSlop.',
          'Fill animation uses motion.duration.instant with easeOut easing.',
        ]
      : [
          'Exposes accessibilityRole "radio" with selected and disabled state.',
          'Does not fire onSelect when already selected — prevents redundant callbacks.',
          'Touch target expands to 44pt minimum via hitSlop.',
        ];

  const doDont = isToggle
    ? [
        {
          do: 'Use for settings that apply instantly without a save step.',
          dont: 'Use a toggle inside a form that has a submit button — use a checkbox instead.',
        },
        {
          do: 'Place the label to the left or above the toggle, never inside.',
          dont: 'Use a toggle for actions ("Delete account") — those need buttons.',
        },
      ]
    : isCheckbox
      ? [
          {
            do: 'Use in forms where multiple options can be selected and submitted together.',
            dont: 'Use a checkbox for an instant-effect setting — use a toggle instead.',
          },
          {
            do: 'Pair with a visible label; the checkbox alone has no text.',
            dont: 'Nest checkboxes more than one level deep — flatten the hierarchy.',
          },
        ]
      : [
          {
            do: 'Group radios visually and semantically — they represent one choice.',
            dont: 'Use radios when multiple selections are valid — use checkboxes.',
          },
          {
            do: 'Pre-select the most common option so the user can confirm with one tap.',
            dont: 'Mix outlined and filled appearances in the same radio group.',
          },
        ];

  const related = isToggle
    ? ['Checkbox', 'Radio', 'Input', 'Button']
    : isCheckbox
      ? ['Toggle', 'Radio', 'Input', 'Button']
      : ['Toggle', 'Checkbox', 'Input', 'Button'];

  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(data)} label="Copy markdown" />
        </div>

        <Eyebrow>{data.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">{data.title}</h1>
        <Lede>{data.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={data.figma}>
            <img src="/icons/figma.svg" alt="" className="h-3.5 w-3.5" aria-hidden="true" /> Figma{' '}
            <span className="opacity-50">↗</span>
          </Pill>
          <Pill as="a" href={data.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route={data.slug} />

        <Section id="anatomy" title="Anatomy" sub={`The parts of a ${data.title}.`}>
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
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
                    ['Track', '52×32 (md) · 40×24 (sm)'],
                    ['Thumb', '26px (md) · 18px (sm)'],
                    ['Track fill', 'interactivePrimary (on)'],
                    ['Track empty', 'surfaceInput (off)'],
                    ['Corner radius', 'height / 2 (capsule)'],
                    ['Animation', 'duration.fast · easeOut'],
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
            )}
            {isCheckbox && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex size-6 items-center justify-center rounded-md border-[1.5px] border-[#D1D5DC]" />
                  <div className="flex size-6 items-center justify-center rounded-md bg-[#155DFC]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7.5L5.5 10L11 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-y-0 border-t border-line pt-5 w-full max-w-[380px]">
                  {[
                    ['Box', '24px (md) · 20px (sm) · 32px (lg)'],
                    ['Check icon', '14px (md) SVG path'],
                    ['Fill', 'interactivePrimary (checked)'],
                    ['Border', 'borderPrimary (unchecked)'],
                    ['Corner radius', 'radii.sm (sm) · radii.md-2 (md)'],
                    ['Animation', 'duration.instant · easeOut'],
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
                    ['Outer', '24px (md) · 20px (sm) · 32px (lg)'],
                    ['Dot (filled)', '12px (md) · scales in'],
                    ['Hole (outlined)', '10px (md) · bg-colored'],
                    ['Border', 'borderPrimary / interactivePrimary'],
                    ['Animation', 'duration.instant · easeOut'],
                    ['Appearances', 'outlined (ring) · filled (dot)'],
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

        <Section
          id="tokens"
          title="Tokens used"
          sub="Semantic tokens driving color, size, and motion."
        >
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

function CarouselDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(carouselData)} label="Copy markdown" />
        </div>

        <Eyebrow>{carouselData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {carouselData.title}
        </h1>
        <Lede>{carouselData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={carouselData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="carousel" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A horizontal track driven by gesture velocity and spring physics."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
            <div className="mx-auto max-w-[360px]">
              <div className="relative overflow-hidden rounded-[28px] border border-line-strong bg-[#F9FAFB] px-4 py-6 dark:bg-[#09090B]">
                <div className="mb-1 flex justify-between px-1 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                  <span>peek</span>
                  <span>item</span>
                  <span>peek</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-24 w-4 shrink-0 rounded-lg bg-[#D1D5DC]/40 dark:bg-[#3F3F46]/40" />
                  <div className="h-24 flex-1 rounded-xl bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                  <div className="h-24 w-4 shrink-0 rounded-lg bg-[#D1D5DC]/40 dark:bg-[#3F3F46]/40" />
                </div>
                <div className="mt-3 flex justify-center gap-1.5">
                  <div className="h-[6px] w-5 rounded-full bg-[#155DFC]" />
                  <div className="h-[6px] w-[6px] rounded-full bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                  <div className="h-[6px] w-[6px] rounded-full bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                </div>
                <div className="mt-1 text-center font-mono text-[10px] uppercase tracking-wide text-ink-3">dots</div>
              </div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ['Container', 'clips overflow, measures width'],
                ['Track', 'Animated row of items'],
                ['Item', 'child wrapped at computed width'],
                ['Peek', 'inset revealing adjacent items'],
                ['Dots', 'below or overlay on content'],
                ['Arrows', 'prev / next below content, right'],
                ['Gap', 'spacing.0–4 between items'],
                ['Snap', 'item (inset) or page (full-width)'],
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

        <Section
          id="when-to-use"
          title="When to use"
          sub="For horizontally browsing a set of peers."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Use for media galleries, onboarding flows, or featured content that fits a fixed viewport.</li>
            <li>Enable peek so users see adjacent items and understand horizontal scrollability.</li>
            <li>Use page snap for full-bleed hero images or onboarding steps.</li>
          </ul>
        </Section>

        <CarouselDocPlayground />

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <div className="space-y-3">
            <CodeBlock language="tsx">{`npx arloui add carousel

import { Carousel } from "@/components/ui/carousel";

<Carousel snap="item" peek indicator="dots" gap={12}>
  <Card title="Mountain Lake" />
  <Card title="Desert Sunset" />
  <Card title="Forest Path" />
</Carousel>`}</CodeBlock>

            <CodeBlock language="tsx">{`{/* Full-width page mode with loop */}
<Carousel snap="page" loop autoPlay autoPlayInterval={5000}>
  <HeroSlide image={banner1} />
  <HeroSlide image={banner2} />
  <HeroSlide image={banner3} />
</Carousel>`}</CodeBlock>

            <CodeBlock language="tsx">{`{/* Imperative control via ref */}
const ref = useRef<CarouselRef>(null);

<Carousel ref={ref} indicator="none">
  {items.map(item => <Slide key={item.id} {...item} />)}
</Carousel>

<Button onPress={() => ref.current?.next()}>Next</Button>`}</CodeBlock>

            <CodeBlock language="tsx">{`{/* Contained carousel with overlay dots and arrows */}
<Carousel snap="page" indicatorPosition="overlay" arrows>
  <Image source={photo1} style={{ width: '100%', aspectRatio: 4/3 }} />
  <Image source={photo2} style={{ width: '100%', aspectRatio: 4/3 }} />
  <Image source={photo3} style={{ width: '100%', aspectRatio: 4/3 }} />
</Carousel>`}</CodeBlock>
          </div>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Spring physics, spacing, and indicator styling."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {carouselData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Swipeable content stays navigable without gestures."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>The container exposes the adjustable role with an &quot;Item N of M&quot; value.</li>
            <li>Each pagination dot is a tappable button with a clear label.</li>
            <li>Reduced motion replaces spring animations with instant position changes.</li>
            <li>RTL layouts reverse gesture and translation direction automatically.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep horizontal browsing discoverable.">
          <DoDont
            pairs={[
              {
                do: 'Enable peek so users see there is more content to swipe.',
                dont: 'Hide all adjacent items — users may not discover the carousel.',
              },
              {
                do: 'Use dots or a visible item count for discoverability.',
                dont: 'Put critical actions inside carousel items that scroll off-screen.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Choose the right container by axis and density."
        >
          <div className="flex flex-wrap gap-2">
            {['Gallery', 'ScrollView', 'FlatList', 'Card'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...carouselData.headings]} actions={[...carouselData.actions]} />
    </>
  );
}

function GalleryDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(galleryData)} label="Copy markdown" />
        </div>

        <Eyebrow>{galleryData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {galleryData.title}
        </h1>
        <Lede>{galleryData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={galleryData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="gallery" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A measured container that distributes children into equal-width columns."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
            <div className="mx-auto max-w-[360px]">
              <div className="relative overflow-hidden rounded-[28px] border border-line-strong bg-[#F9FAFB] px-4 py-6 dark:bg-[#09090B]">
                <div className="mb-2 flex justify-between px-1 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                  <span>col 1</span>
                  <span>gap</span>
                  <span>col 2</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-xl bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                  <div className="h-16 rounded-xl bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                  <div className="h-16 rounded-xl bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                  <div className="h-16 rounded-xl bg-[#D1D5DC] dark:bg-[#3F3F46]" />
                </div>
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-ink-3">radius</span>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-ink-3">cell</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ['ScrollView', 'scrollable wrapper with onLayout'],
                ['Row', 'flexDirection row per chunk of N'],
                ['Cell', 'width-constrained, overflow clipped'],
                ['Radius', 'radii.none–full per cell'],
                ['Gap', 'spacing.0–4 between cells'],
                ['Columns', '1 | 2 | 3 | 4'],
                ['Masonry', 'absolute-positioned bin-packing'],
                ['Measurement', 'onLayout for container width'],
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

        <Section
          id="when-to-use"
          title="When to use"
          sub="For vertical collections where items are visually similar."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Use for photo grids, product catalogs, or any collection of visual cards.</li>
            <li>Enable masonry when item heights vary naturally (e.g. images with different aspect ratios).</li>
            <li>Use 1 column for detail-heavy list items, 3–4 for compact thumbnails.</li>
          </ul>
        </Section>

        <GalleryDocPlayground />

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <div className="space-y-3">
            <CodeBlock language="tsx">{`npx arloui add gallery

import { Gallery } from "@/components/ui/gallery";

{/* Uniform 2-column grid */}
<Gallery columns={2} radius="lg" gap={8}>
  {photos.map(photo => (
    <Image key={photo.id} source={photo.src}
      style={{ width: '100%', aspectRatio: 1 }} />
  ))}
</Gallery>`}</CodeBlock>

            <CodeBlock language="tsx">{`{/* Masonry layout with 3 columns */}
<Gallery columns={3} masonry radius="md">
  {items.map(item => (
    <View key={item.id} style={{ height: item.height }}>
      <Image source={item.src}
        style={{ width: '100%', height: '100%' }} />
    </View>
  ))}
</Gallery>`}</CodeBlock>
          </div>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Spacing and radius tokens for consistent grid styling."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {galleryData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Grid content remains navigable by assistive tech."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>The gallery container exposes an accessibility label for screen readers.</li>
            <li>Individual items maintain their own accessibility roles and labels.</li>
            <li>Layout reflows to fewer columns on narrow viewports naturally.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep grid layouts scannable.">
          <DoDont
            pairs={[
              {
                do: 'Keep items within the same grid visually similar in type and weight.',
                dont: 'Mix landscape photos and tall cards in a non-masonry grid.',
              },
              {
                do: 'Use masonry when aspect ratios genuinely vary.',
                dont: 'Use masonry for uniform content — it adds complexity without benefit.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Choose the right layout by scroll direction and density."
        >
          <div className="flex flex-wrap gap-2">
            {['Carousel', 'FlatList', 'Card', 'Stack'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...galleryData.headings]} actions={[...galleryData.actions]} />
    </>
  );
}

function BadgeDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(badgeData)} label="Copy markdown" />
        </div>

        <Eyebrow>{badgeData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">{badgeData.title}</h1>
        <Lede>{badgeData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={badgeData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="badge" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A compact pill with optional dot or leading icon, sized and colored from tokens."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2" style={{ height: 24 }}>
                  <span className="size-2 rounded-full bg-[#155DFC]" />
                  <span className="text-[12px] text-[#155DFC]">Active</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#155DFC] px-2" style={{ height: 24 }}>
                  <span className="text-[12px] text-white">3 new</span>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-[#00C950] px-2" style={{ height: 24 }}>
                  <span className="text-[12px] text-[#00C950]">Verified</span>
                </div>
              </div>
              <div className="flex gap-6 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                <span>dot + label</span>
                <span>solid</span>
                <span>outline</span>
              </div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ["Label", "typography 11–12px · weight 400"],
                ["Dot", "6px (sm) · 8px (md) circle"],
                ["Leading icon", "sizing.icon.xs (16px)"],
                ["Height", "20px (sm) · 24px (md)"],
                ["Corner radius", "radii.full (pill)"],
                ["Padding", "spacing.2 horizontal"],
                ["Solid inset", "1–1.5px rgba(255,255,255,0.12–0.15)"],
                ["Icon ↔ label gap", "spacing.1 (4px)"],
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

        <Section id="when-to-use" title="When to use" sub="Three rules for status labels.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Use a badge to surface status, count, or category without demanding a tap.</li>
            <li>Use dot mode for a minimal alive/offline indicator next to an avatar or row.</li>
            <li>If the label needs to be interactive (dismissible, selectable), use a Chip instead.</li>
          </ul>
        </Section>

        <BadgeDocPlayground states={badgeData.states} />

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <CodeBlock language="tsx">{`npx arloui add badge

import { Badge } from "@/components/ui/badge";

{/* Label badge */}
<Badge tone="info" appearance="soft">Active</Badge>

{/* Solid with count */}
<Badge tone="error" appearance="solid">3</Badge>

{/* Dot indicator */}
<Badge tone="success" dot>Online</Badge>

{/* Leading icon */}
<Badge tone="warning" appearance="outline" leadingIcon={<StarIcon />}>
  Featured
</Badge>

{/* Icon-only */}
<Badge tone="info" leadingIcon={<BellIcon />} />`}</CodeBlock>
        </Section>

        <Section id="tokens" title="Tokens used" sub="Semantic tokens driving tone, size, and appearance.">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {badgeData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Non-interactive labels that announce clearly.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Exposes accessibilityRole &quot;text&quot; with the label from children or an explicit accessibilityLabel.</li>
            <li>Dot-only and icon-only badges require accessibilityLabel — without it, the badge announces nothing useful.</li>
            <li>Color is never the sole differentiator — tone names and labels carry the meaning.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: "Use semantic tones (success, error, warning) to communicate status at a glance.",
                dont: "Use badge colors decoratively — each tone should carry meaning.",
              },
              {
                do: "Keep badge labels short — one or two words, or a number.",
                dont: "Put sentences or long phrases inside a badge — use body text instead.",
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {["Chip", "Toast", "Banner", "Button", "Pill"].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...badgeData.headings]} actions={[...badgeData.actions]} />
    </>
  );
}

function ChipDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(chipData)} label="Copy markdown" />
        </div>

        <Eyebrow>{chipData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">{chipData.title}</h1>
        <Lede>{chipData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={chipData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="chip" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="An interactive pill with optional check, leading icon, and remove button — sized from tokens with press feedback."
        >
          <div className="rounded-xl border border-line bg-surface-sunken p-6 sm:p-10 dark:bg-surface-raised">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-[#155DFC] bg-[#EFF6FF] px-3" style={{ height: 32 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke="#155DFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[14px] text-[#155DFC]">Filter</span>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-[#D1D5DC] px-3" style={{ height: 32 }}>
                  <span className="text-[14px] text-[#101828]">Token</span>
                  <span className="flex size-6 items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M4 4L10 10M10 4L4 10" stroke="#101828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="flex items-center rounded-full border border-[#D1D5DC] px-3" style={{ height: 32 }}>
                  <span className="text-[14px] text-[#101828]">Assist</span>
                </div>
              </div>
              <div className="flex gap-6 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                <span>filter (selected)</span>
                <span>input (remove)</span>
                <span>assist</span>
              </div>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ["Label", "typography 12–14px · weight 400"],
                ["Check icon", "14–16px SVG (filter selected)"],
                ["Remove button", "12–14px ✕ with hitSlop"],
                ["Leading icon", "sizing.icon.xs–sm"],
                ["Height", "28px (sm) · 32px (md)"],
                ["Corner radius", "radii.full or radii.lg"],
                ["Padding", "spacing.3 horizontal"],
                ["Touch target", "44pt via hitSlop"],
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

        <Section id="when-to-use" title="When to use" sub="Three types, three jobs.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Use <code className="font-mono text-[13px]">filter</code> chips for toggling a set of criteria — each chip is independently selectable.</li>
            <li>Use <code className="font-mono text-[13px]">input</code> chips for tokenised values the user can remove (tags, recipients, skills).</li>
            <li>Use <code className="font-mono text-[13px]">assist</code> chips for single-tap contextual actions (share, export, duplicate).</li>
          </ul>
        </Section>

        <ChipDocPlayground states={chipData.states} />

        <Section id="code" title="Code" sub="React Native, copy-paste from the registry.">
          <div className="space-y-3">
            <CodeBlock language="tsx">{`npx arloui add chip

import { Chip } from "@/components/ui/chip";`}</CodeBlock>

            <CodeBlock language="tsx">{`{/* Filter chips — toggleable */}
<Chip type="filter" selected={isActive} onPress={toggle}>
  Active
</Chip>

{/* Input chips — removable tokens */}
<Chip type="input" onRemove={() => remove(tag)}>
  {tag}
</Chip>

{/* Assist chips — single-tap actions */}
<Chip type="assist" onPress={handleShare}>
  Share
</Chip>

{/* Visual options */}
<Chip chipStyle="fill" accent="neutral" radius="lg">
  Rounded
</Chip>

{/* Selection indicator — icon stays visible */}
<Chip
  type="filter"
  selectionIndicator="none"
  selected={on}
  leadingIcon={<CalendarIcon />}
>
  Today
</Chip>

{/* Icon-only */}
<Chip leadingIcon={<FilterIcon />} />`}</CodeBlock>
          </div>
        </Section>

        <Section id="tokens" title="Tokens used" sub="Semantic tokens driving type, style, accent, and interaction states.">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {chipData.tokens.map((t) => (
              <div key={t} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="accessibility" title="Accessibility" sub="Semantics, selection state, and touch targets.">
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Exposes accessibilityRole &quot;button&quot; with the label from children or an explicit accessibilityLabel.</li>
            <li>Filter chips expose accessibilityState selected so screen readers announce toggle state.</li>
            <li>The remove button on input chips has its own accessibilityLabel (&quot;Remove {'{'}label{'}'}&quot;) and hitSlop.</li>
            <li>All chips expand to a 44pt touch target via hitSlop when the visible height is smaller.</li>
            <li>Press feedback uses haptics and scale animation via the shared usePressFeedback hook.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Common pitfalls, paired.">
          <DoDont
            pairs={[
              {
                do: "Use filter chips for multi-select filtering; each chip toggles independently.",
                dont: "Use filter chips for mutually exclusive choices — use radio or a segmented control.",
              },
              {
                do: "Use input chips for user-generated tokens that can be individually removed.",
                dont: "Use input chips for static labels that never change — use Badge instead.",
              },
            ]}
          />
        </Section>

        <Section id="related" title="Related primitives" sub="Complements and alternatives.">
          <div className="flex flex-wrap gap-2">
            {["Badge", "Button", "Pill", "Toggle", "Radio"].map((r) => (
              <Chip key={r}>→ {r}</Chip>
            ))}
          </div>
        </Section>
      </main>

      <RightRail headings={[...chipData.headings]} actions={[...chipData.actions]} />
    </>
  );
}

function ToastDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(toastData)} label="Copy markdown" />
        </div>

        <Eyebrow>{toastData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {toastData.title}
        </h1>
        <Lede>{toastData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={toastData.source}>
            <GithubMark size={14} /> Source{' '}
            <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="toast" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="A floating bar with icon, message, and dismiss — positioned at the screen edge."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[420px]">
              {[
                ['Container', 'floating surface with shadow'],
                ['Icon', 'optional filled leading icon'],
                ['Message', 'up to two lines of body text'],
                ['Dismiss', 'optional close button'],
                ['Position', 'top or bottom edge'],
                ['Color style', 'contrast or same'],
                ['Elevation', 'shadows.lg (not configurable)'],
                ['Radius', 'radii.xl / 16px (opinionated)'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px] last:border-0"
                >
                  <span className="text-ink-2">{name}</span>
                  <code className="font-mono text-[11px] text-ink-3">{detail}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="when-to-use"
          title="When to use"
          sub="For transient, non-blocking confirmations and alerts."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              Use for confirmations the user doesn&apos;t need to act on — saved, copied, sent.
            </li>
            <li>
              Use persistent toasts (duration 0) for errors that need acknowledgement.
            </li>
            <li>
              Mount a <code className="font-mono text-[13px]">Toaster</code> when several messages
              can arrive at once — newest sits in front, older ones peek out behind it, three at a
              time.
            </li>
            <li>
              If the message needs more than two lines or an action beyond dismiss, use a sheet instead.
            </li>
          </ul>
        </Section>

        <Section id="code" title="Code" sub="React Native, copy-paste.">
          <CodeBlock language="tsx">{`npx arloui add toast

{/* Mount one Toaster near the root, inside ThemeProvider */}
import { Toaster } from "@/components/ui/toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();

<Toaster position="bottom" topInset={insets.top} bottomInset={insets.bottom} />

{/* Then queue toasts from anywhere — they stack into a deck */}
import { useToast } from "@/components/ui/toast";

const { toast, dismiss, dismissAll } = useToast();

toast("Changes saved successfully");
toast("Connection lost", { colorStyle: "same", duration: 0, showDismiss: true });

{/* Reuse an id to replace a live toast in place */}
const id = toast("Uploading…", { duration: 0 });
toast("Uploaded", { id });

{/* Or drive a single toast yourself, without the Toaster */}
import { useState } from "react";
import { Toast } from "@/components/ui/toast";

const [visible, setVisible] = useState(false);

<Toast
  visible={visible}
  message="Changes saved successfully"
  position="bottom"
  colorStyle="contrast"
  showDismiss
  topInset={insets.top}
  bottomInset={insets.bottom}
  onDismiss={() => setVisible(false)}
/>

{/* Persistent error toast */}
<Toast
  visible={hasError}
  message="Connection lost"
  position="top"
  colorStyle="same"
  duration={0}
  showDismiss
  icon={<ErrorIcon />}
  topInset={insets.top}
  onDismiss={() => setHasError(false)}
/>`}</CodeBlock>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="Color, elevation, radius, motion, and type foundations."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {toastData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Announce once, don't overwhelm."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>Uses accessibilityRole &quot;alert&quot; with accessibilityLiveRegion &quot;assertive&quot;.</li>
            <li>Screen readers announce the message immediately without requiring focus.</li>
            <li>Reduced motion disables the slide animation while preserving the state change.</li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Keep toasts brief and non-blocking.">
          <DoDont
            pairs={[
              {
                do: 'Auto-dismiss confirmations after 3–4 seconds.',
                dont: 'Auto-dismiss error toasts — persist them until the user dismisses.',
              },
              {
                do: 'Keep copy under two lines. If more context is needed, use a sheet.',
                dont: 'Toast an action the user just performed and can clearly see — it creates noise.',
              },
            ]}
          />
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="Feedback pieces for different contexts."
        >
          <div className="flex flex-wrap gap-2">
            {['Sheet', 'Badge', 'Skeleton', 'Alert'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...toastData.headings]} actions={[...toastData.actions]} />
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

function ChartDocPage() {
  return (
    <>
      <main className="relative max-w-[820px] flex-1 px-14 pt-10 pb-20">
        <div className="absolute top-10 right-14">
          <CopyButton text={docDataToMarkdown(chartData)} label="Copy markdown" />
        </div>

        <Eyebrow>{chartData.category}</Eyebrow>
        <h1 className="mt-3.5 text-[56px] font-medium leading-none tracking-tight">
          {chartData.title}
        </h1>
        <Lede>{chartData.lede}</Lede>

        <div className="mb-9 flex gap-2">
          <Pill as="a" href={chartData.source}>
            <GithubMark size={14} /> Source <span className="opacity-50">↗</span>
          </Pill>
        </div>

        <DevicePreview route="chart" />

        <Section
          id="anatomy"
          title="Anatomy"
          sub="The scrubbable line chart, composed from its parts."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[420px]">
              {[
                ['Chart', 'holds the series, the format, and the scrub state'],
                ['Chart.Value', 'headline number, rolls as you scrub'],
                ['Chart.Delta', 'change from the baseline, always signed'],
                ['Chart.Plot', 'the line or area, and the scrub target'],
                ['Chart.Periods', 'the range selector'],
                ['Chart.Empty', 'what the plot draws when there is no series'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[12.5px] last:border-0"
                >
                  <code className="font-mono text-[11.5px] text-ink">{name}</code>
                  <span className="text-right text-ink-3">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="forms"
          title="Forms"
          sub="Six charts on one palette, all under the Chart namespace."
        >
          <ChartFormsPreview />
          <p className="mt-4 text-[13px] text-ink-3">
            Static previews. Scrubbing, selection, and the threshold colours are live in the
            playground.
          </p>
        </Section>

        <Section
          id="when-to-use"
          title="When to use"
          sub="Pick the form by the question the reader is asking."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              <strong>Chart</strong> for &quot;how is this number doing&quot; — one series over time,
              with a readout you scrub. It carries no axis furniture on purpose: it answers shape and
              direction, not what exactly happened on Tuesday.
            </li>
            <li>
              <strong>Chart.Sparkline</strong> inline beside a number that is already labelled.{' '}
              <strong>Chart.Bar</strong> to compare categories. <strong>Chart.Donut</strong> for
              part-to-whole, never more than four slices before the rest fold into Other.
            </li>
            <li>
              <strong>Chart.Meter</strong> for one value against a target — a budget, a quota, a goal.
            </li>
            <li>
              <strong>Chart.Heatmap</strong> for showing up — a calendar of filled and empty squares
              with a headline streak the app composes. No library, no axes, one hue in tints.
            </li>
          </ul>
        </Section>

        <Section id="code" title="Code" sub="React Native, copy-paste and compose.">
          <CodeBlock language="tsx">{`npx arloui add chart

import { Chart, formatMoney } from "@/components/ui/chart";

// No children renders the documented composition:
// value, delta, plot, periods — in that order.
<Chart
  data={points}
  format={formatMoney("USD")}
  periods={["1D", "1W", "1M", "1Y"]}
  period={p}
  onPeriodChange={setP}
/>

// Name the parts to reorder or drop one. \`format\` flows down from the root.
<Chart data={points} format={formatMoney("USD")} chrome="reference" reference={{ value: 1000, label: "Target" }}>
  <Chart.Empty>No trades yet</Chart.Empty>
  <Chart.Plot height={200} fill />
  <Chart.Value />
  <Chart.Periods />
</Chart>

<Chart.Sparkline data={points} height={44} showEndDot />
<Chart.Bar data={week} showValues onSelect={setSelected} />
<Chart.Donut data={breakdown} centerLabel="Monthly spend" />
<Chart.Meter value={88} max={100} label="Budget used" warnAt={0.75} dangerAt={0.9} />
<Chart.Heatmap data={days} onSelect={setDay} />

// A second series and a likely range are props on Plot, not new forms.
<Chart data={projected} format={formatMoney("GBP")}>
  <Chart.Value />
  <Chart.Plot
    compare={baseline}
    range={{ lower: pessimistic, upper: optimistic }}
    tooltip
  />
  <Chart.Legend
    items={[
      { label: "Projected", color: "…" },
      { label: "Baseline", color: "…" },
      { label: "Likely range", color: "…", faded: true },
    ]}
  />
</Chart>

// Bars: two series share a category — grouped or stacked, legend names them.
<Chart.Bar data={sleep} series={[activity]} variant="grouped" legend={["Sleep", "Activity"]} />
<Chart.Bar data={private_} series={[state]} variant="stacked" legend={["Private", "State"]} />

// Layout is a prop, not a form — the same categories as ranked rows.
<Chart.Bar data={spend} layout="horizontal" format={formatMoney("GBP")} />`}</CodeBlock>

          <p className="mt-4 text-[13px] text-ink-3">
            The data model is <code className="font-mono text-[11.5px]">number[]</code> or{' '}
            <code className="font-mono text-[11.5px]">
              {'{ value, at?, label?, meta? }[]'}
            </code>
            . Pass <code className="font-mono text-[11.5px]">formatAt</code> on the root and the
            readout says <em>when</em> as well as what. Selection is
            controlled-or-uncontrolled everywhere — the same{' '}
            <code className="font-mono text-[11.5px]">activeIndex</code> /{' '}
            <code className="font-mono text-[11.5px]">onScrub</code> /{' '}
            <code className="font-mono text-[11.5px]">onSelect</code> contract on the root, Bar,
            and Donut.
          </p>
        </Section>

        <Section
          id="axes"
          title="Two axes"
          sub="Closed sets, like Card. Everything else is data."
        >
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <div className="mx-auto max-w-[520px] space-y-4 text-[13px]">
              <div>
                <code className="font-mono text-[11.5px] text-ink">density</code>
                <span className="ml-2 text-ink-3">compact · default</span>
                <p className="mt-1 text-ink-2">
                  Stroke weight, dot and bar radius, and whether labels render at all.
                  <code className="ml-1 font-mono text-[11.5px]">compact</code> is what makes a
                  chart survive inside a table row.
                </p>
              </div>
              <div>
                <code className="font-mono text-[11.5px] text-ink">chrome</code>
                <span className="ml-2 text-ink-3">none · baseline · reference</span>
                <p className="mt-1 text-ink-2">
                  Furniture around the data. There is no{' '}
                  <code className="font-mono text-[11.5px]">axis</code> member and there will not
                  be one — ticks and gridlines are how a chart this size stops being readable.
                  <code className="ml-1 font-mono text-[11.5px]">reference</code> is one labelled
                  line at a value you name, not a band system.
                </p>
              </div>
              <div>
                <code className="font-mono text-[11.5px] text-ink">tone</code>
                <span className="ml-2 text-ink-3">
                  auto · positive · negative · brand · series · neutral
                </span>
                <p className="mt-1 text-ink-2">
                  One vocabulary across all six forms. Each form documents what it does with the
                  members it cannot honour — a line has no categories to enumerate, a meter has no
                  direction to infer, and neither invents one.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="tokens"
          title="Tokens used"
          sub="One validated palette across every form."
        >
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {chartData.tokens.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility"
          sub="Direction is never carried by colour alone."
        >
          <ul className="list-disc list-inside space-y-1.5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [&>li]:pl-[1.4em] [&>li]:indent-[-1.4em]">
            <li>
              <code>Chart.Delta</code> always renders an explicit sign. The positive and negative
              tones sit near the deuteranopia separation floor, so the sign is what keeps direction
              readable — don&apos;t replace it with a bare coloured number.
            </li>
            <li>
              Donuts always carry a legend, and categories past the palette&apos;s capacity fold into
              one neutral Other slice rather than repeating a hue.
            </li>
            <li>
              Each chart exposes a summary label to assistive tech. Sparklines are hidden by default,
              since the number beside them is already announced — pass{' '}
              <code>accessibilityLabel</code> when one stands alone.
            </li>
          </ul>
        </Section>

        <Section id="do-dont" title="Do · Don't" sub="Show the data, not the chart junk.">
          <DoDont
            pairs={[
              {
                do: 'Let the value readout be the label, and update it as you scrub.',
                dont: 'Add gridlines, ticks, and axis labels to a chart this size.',
              },
              {
                do: 'Keep segments straight between points.',
                dont: 'Smooth the path — a spline invents peaks that were never in the data.',
              },
              {
                do: 'Let bars cross-fade when the data changes.',
                dont: 'Grow bars from zero — a bar’s height is its datum, so that animates the number.',
              },
            ]}
          />
        </Section>

        <Section
          id="not-in-the-kit"
          title="Not in the kit"
          sub="Six forms, drawn by Arlo. The rest is yours."
        >
          <p className="text-[15px] leading-relaxed text-ink-2">
            Arlo owns the geometry and the render loop for the six forms above — there is no
            charting library underneath, only{' '}
            <code className="font-mono text-[11.5px]">react-native-svg</code>. That is what makes
            the crosshair land on the line and the period morph possible, and it is also why the
            list of forms is closed.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            These are <strong>not</strong> coming: candlestick, radar, population pyramid, scatter,
            and 3-D anything. If you need one of them, the scale and the path builders the six are
            drawn with are exported from{' '}
            <code className="font-mono text-[11.5px]">chart/core.ts</code> —{' '}
            <code className="font-mono text-[11.5px]">makeScale</code>,{' '}
            <code className="font-mono text-[11.5px]">linePath</code>,{' '}
            <code className="font-mono text-[11.5px]">barPath</code>,{' '}
            <code className="font-mono text-[11.5px]">bandPath</code>,{' '}
            <code className="font-mono text-[11.5px]">annulusPath</code> — so a seventh form you
            write measures the way these do.
          </p>
        </Section>

        <Section
          id="related"
          title="Related primitives"
          sub="What charts usually sit inside or beside."
        >
          <div className="flex flex-wrap gap-2">
            {['Card', 'Badge', 'Skeleton', 'Spinner'].map((item) => (
              <Chip key={item}>→ {item}</Chip>
            ))}
          </div>
        </Section>
      </main>
      <RightRail headings={[...chartData.headings]} actions={[...chartData.actions]} />
    </>
  );
}
