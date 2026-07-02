import { DoDont as PrimitiveDoDont } from '@/components/docs/doc-cards';
import {
  DurationPlayground,
  EasingPlayground,
  PressablePlayground,
  ReducedMotionPlayground,
  SpringPlayground,
} from '@/components/docs/motion-doc';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Section } from '../_shared';

const springPresetsCode = `import { withSpring, type WithSpringConfig } from 'react-native-reanimated';

export const springPresets = {
  snappy: { stiffness: 400, damping: 30, mass: 1 } satisfies WithSpringConfig,
  gentle: { stiffness: 150, damping: 20, mass: 1 } satisfies WithSpringConfig,
  heavy:  { stiffness: 300, damping: 40, mass: 1.2 } satisfies WithSpringConfig,
};

// Springs are for elements the user physically drags — or playful moments.
translateY.value = withSpring(0, springPresets.snappy);`;

const pressableRecipeCode = `import { Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Tappable({ onPress, children, style }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 120, easing: Easing.out(Easing.ease) });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) });
      }}
      onPress={onPress}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}`;

const reducedMotionCode = `import { useReducedMotion } from 'react-native-reanimated';

export function useMotionDuration(standardMs: number): number {
  const reduced = useReducedMotion();
  return reduced ? 0 : standardMs;
}

export function useMotionScale(standardScale: number): number {
  const reduced = useReducedMotion();
  return reduced ? 1 : standardScale;
}

// Position and scale collapse to an opacity fade; loaders keep animating.
const duration = useMotionDuration(280);
const pressScale = useMotionScale(0.97);`;

const FOUR_JOBS: { job: string; definition: string; curve: string }[] = [
  { job: 'Origin', definition: 'Show where a thing came from — popover from its trigger, sheet from its row.', curve: 'ease-out' },
  { job: 'State', definition: 'Make a change in status legible — loading → loaded, “Continue” → “Confirm”.', curve: 'ease-in-out' },
  { job: 'Feedback', definition: 'Confirm the system heard the user — press, drag, dismiss.', curve: 'ease-out' },
  { job: 'Continuity', definition: 'Preserve elements that exist on both sides of a transition — shared cards, shared text.', curve: 'ease-in-out' },
];

const LOOKUP: { scenario: string; curve: string; duration: string; transform: string }[] = [
  { scenario: 'Sheet entrance', curve: 'ease-sheet', duration: '280–320 ms', transform: 'translateY(100%) → 0' },
  { scenario: 'Sheet exit', curve: 'ease-sheet', duration: '220–260 ms', transform: 'reverse of entrance' },
  { scenario: 'Popover / menu open', curve: 'ease-out', duration: '180–220 ms', transform: 'scale(0.95) opacity(0) → 1' },
  { scenario: 'Popover / menu close', curve: 'ease-out', duration: '140–180 ms', transform: 'reverse, 20% faster' },
  { scenario: 'Pressable feedback', curve: 'ease-out', duration: '120 ms', transform: 'scale(0.97), opacity(0.85)' },
  { scenario: 'Tab / segment switch', curve: 'none', duration: 'instant', transform: 'no animation (habitual)' },
  { scenario: 'Toast entrance', curve: 'ease-out', duration: '200 ms', transform: 'translateY(16) opacity(0) → 0' },
  { scenario: 'Shared-element transition', curve: 'ease-in-out', duration: '320–480 ms', transform: 'position + scale interp.' },
  { scenario: 'Text morph', curve: 'ease-in-out', duration: '180 ms', transform: 'crossfade, 2px blur mask' },
  { scenario: 'Skeleton shimmer', curve: 'linear', duration: '1200 ms', transform: 'infinite horizontal translate' },
  { scenario: 'Color / opacity change', curve: 'ease', duration: '140–180 ms', transform: 'property interpolation only' },
];

const TEN_RULES: { n: string; title: string; text: string }[] = [
  { n: '01', title: 'Never animate from scale(0)', text: 'Start at 0.94–0.97 with opacity: 0. Nothing appears from nothing.' },
  { n: '02', title: 'Pressables respond instantly', text: 'Every tappable element scales to 0.97 on press within 120 ms. No exceptions.' },
  { n: '03', title: 'Popovers scale from their origin', text: 'Set transform-origin to the trigger. Modals (no trigger) use center.' },
  { n: '04', title: 'Shared elements stay shared', text: 'A card on both screens is one view animating, not a duplicate fading in.' },
  { n: '05', title: 'Text morphs when meaning changes', text: '“Continue” → “Confirm” crossfades, ideally per-character.' },
  { n: '06', title: 'Direction is information', text: 'Tabs slide in the direction of travel. Back reverses forward.' },
  { n: '07', title: 'No animation on habitual actions', text: 'Shortcuts, segment toggles, frequently-used controls — instant.' },
  { n: '08', title: 'Gestures own velocity', text: 'Swipe-to-dismiss commits on velocity (≥ 0.11 px/ms). Boundaries dampen, never hard-stop.' },
  { n: '09', title: 'Transitions, not keyframes, for rapid UI', text: 'Toasts, press states, list items — transitions retarget mid-flight.' },
  { n: '10', title: 'Reduced motion reduces, not removes', text: 'Replace position and scale with opacity. Keep loaders and progress.' },
];

export function MotionPage() {
  const headings = [
    { id: 'jobs', label: 'The four jobs' },
    { id: 'curves', label: 'Easing curves' },
    { id: 'duration', label: 'Duration scale' },
    { id: 'springs', label: 'Spring presets' },
    { id: 'lookup', label: 'Curve + duration' },
    { id: 'pressable', label: 'Pressable feedback' },
    { id: 'reduced', label: 'Reduced motion' },
    { id: 'rules', label: 'The ten rules' },
    { id: 'do-dont', label: 'Do · Don’t' },
    { id: 'related', label: 'Related' },
  ];
  const actions = [
    { label: 'Fluidity essay', href: '/docs/foundations/fluidity' },
    {
      label: 'Source',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/tokens/src/motion.ts',
    },
  ];

  return (
    <>
      <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20 sm:px-14">
        <Eyebrow>Foundations</Eyebrow>
        <h1 className="mt-3.5 text-[44px] font-medium leading-none tracking-tight sm:text-[56px]">
          Motion
        </h1>
        <Lede>
          Motion is not decoration — it is spatial information. Every transition answers where
          something came from and where it is going. Curves and durations are the tokens, applied
          through recipes rather than swatches.
        </Lede>

        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              {action.label}
            </a>
          ))}
        </div>

        <Section id="jobs" title="The four jobs of motion">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            Every animation must serve at least one of these purposes. If it serves none, remove it.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FOUR_JOBS.map((j) => (
              <div key={j.job} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-baseline justify-between">
                  <div className="text-[13px] font-medium text-ink">{j.job}</div>
                  <code className="font-mono text-[11px] text-ink-3">{j.curve}</code>
                </div>
                <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{j.definition}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="curves" title="Easing curves">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            Never use <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-[12px] dark:bg-surface-raised">ease-in</code>{' '}
            for UI, and use stronger curves than the platform defaults. Tap a curve to watch the dot
            travel it.
          </p>
          <EasingPlayground />
        </Section>

        <Section id="duration" title="Duration scale">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            Stay under 300 ms for anything repeated each session. Exits run ~20% faster than
            entrances, and larger surfaces animate slower than smaller ones.
          </p>
          <DurationPlayground />
        </Section>

        <Section id="springs" title="Spring presets">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            Standard controls stay crisp. Springs are for elements the user physically drags or for
            playful moments — the fidget rule.
          </p>
          <SpringPlayground />
          <div className="mt-3">
            <CodeBlock>{springPresetsCode}</CodeBlock>
          </div>
        </Section>

        <Section id="lookup" title="Picking curve + duration">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            The lookup table. Find your scenario, copy the values.
          </p>
          <div className="overflow-hidden rounded-lg border border-line">
            <div className="hidden grid-cols-[1.4fr_0.9fr_0.9fr_1.4fr] gap-4 border-b border-line bg-surface px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-ink-3 sm:grid">
              <div>Scenario</div>
              <div>Curve</div>
              <div>Duration</div>
              <div>Transform</div>
            </div>
            {LOOKUP.map((row) => (
              <div
                key={row.scenario}
                className="grid gap-1 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[1.4fr_0.9fr_0.9fr_1.4fr] sm:gap-4"
              >
                <div className="text-[13px] text-ink">{row.scenario}</div>
                <code className="font-mono text-[11.5px] text-ink-2">{row.curve}</code>
                <code className="font-mono text-[11.5px] text-ink-2">{row.duration}</code>
                <div className="text-[12.5px] text-ink-3">{row.transform}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="pressable" title="Pressable feedback">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            The most common motion pattern in any Arlo app. Every tappable element — buttons, rows,
            cards, icons — scales to 0.97 over 120 ms with a light haptic. Press the previews.
          </p>
          <PressablePlayground />
          <div className="mt-3">
            <CodeBlock>{pressableRecipeCode}</CodeBlock>
          </div>
          <div className="mt-3 rounded-lg border border-line bg-canvas p-4">
            <div className="text-[13px] font-medium text-ink">The fidget rule</div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
              For the one or two interactions a user performs most — the send button in a wallet, the
              like in a feed — invest disproportionately. Combine animation, haptic, and where
              appropriate, sound. This is “earning the tap.”
            </div>
          </div>
        </Section>

        <Section id="reduced" title="Reduced motion">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            <code className="rounded bg-[#f8f6ef] px-1.5 py-0.5 font-mono text-[12px] dark:bg-surface-raised">prefers-reduced-motion</code>{' '}
            reduces, it does not remove. Position and scale become an opacity fade; loaders, spinners,
            and skeletons keep animating because they clarify state.
          </p>
          <ReducedMotionPlayground />
          <div className="mt-3">
            <CodeBlock>{reducedMotionCode}</CodeBlock>
          </div>
        </Section>

        <Section id="rules" title="The ten rules">
          <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
            The non-negotiable behaviors that make an Arlo app feel like an Arlo app.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEN_RULES.map((rule) => (
              <div key={rule.n} className="rounded-lg border border-line bg-surface p-4">
                <div className="text-[11px] font-medium uppercase tracking-widest text-ink-3">
                  Rule {rule.n}
                </div>
                <div className="mt-1.5 text-[13px] font-medium text-ink">{rule.title}</div>
                <div className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">{rule.text}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="do-dont" title="Do · Don’t">
          <div className="space-y-3">
            <PrimitiveDoDont
              doText="Start entrances at scale(0.95) with opacity: 0."
              dontText="Animate from scale(0) — nothing appears from nothing."
            />
            <PrimitiveDoDont
              doText="Animate transform and opacity only."
              dontText="Animate layout properties — width, height, padding, margin."
            />
            <PrimitiveDoDont
              doText="Set transform-origin to the trigger for popovers."
              dontText="Open menus and popovers from the center of the screen."
            />
            <PrimitiveDoDont
              doText="Make habitual actions instant — no transition on frequent toggles."
              dontText="Add a 300 ms transition to a segmented control tapped 40 times a day."
            />
          </div>
        </Section>

        <section id="related" className="scroll-mt-10 pt-12">
          <h2 className="text-[24px] font-medium leading-tight text-ink">Related</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Fluidity', 'Tokens', 'Spacing'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <RightRail headings={headings} actions={actions} />
    </>
  );
}

