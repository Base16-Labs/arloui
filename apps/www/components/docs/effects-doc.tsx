'use client';

import { useEffect, useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme';

const shadows = [
  {
    name: 'sm',
    use: 'Tight lift — chips and FAB rest state',
    offset: 0,
    blur: 2,
    lightOpacity: 0.06,
    darkOpacity: 0.18,
    elevation: 2,
    darkSurface: '#1f1f23',
  },
  {
    name: 'md',
    use: 'Cards and controls',
    offset: 1,
    blur: 6,
    lightOpacity: 0.08,
    darkOpacity: 0.22,
    elevation: 4,
    darkSurface: '#27272b',
  },
  {
    name: 'lg',
    use: 'Elevated surfaces and popovers',
    offset: 2,
    blur: 12,
    lightOpacity: 0.1,
    darkOpacity: 0.28,
    elevation: 8,
    darkSurface: '#313137',
  },
  {
    name: 'xl',
    use: 'Modals, menus, and overlays',
    offset: 4,
    blur: 28,
    lightOpacity: 0.12,
    darkOpacity: 0.34,
    elevation: 12,
    darkSurface: '#3b3b42',
  },
] as const;

const blurLevels = [
  ['xs', 4, 'Minimal softening'],
  ['sm', 8, 'Subtle frost'],
  ['md', 16, 'Standard glass'],
  ['lg', 24, 'Heavy frost, sheets'],
  ['xl', 40, 'Full obscuration'],
] as const;

const shadowCode = `import { shadows } from '@arloui/tokens';

<View style={[styles.card, shadows.md]}>
  <CardContent />
</View>

<Pressable>
  {({ pressed }) => (
    <View style={[styles.fab, pressed ? shadows.none : shadows.sm]}>
      <Icon name="plus" />
    </View>
  )}
</Pressable>`;

const focusCode = `.button:focus-visible {
  box-shadow: var(--focus-ring-main);
  /* 0 0 0 2px var(--surface-background),
     0 0 0 4px var(--focus-ring-main) */
}`;

const blurCode = `import { BlurView } from 'expo-blur';
import { blurs } from '@arloui/tokens';

<BlurView intensity={blurs.md} tint="default">
  <SheetContent />
</BlurView>`;

export function EffectsDoc() {
  const { resolved } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolved === 'dark';

  return (
    <>
      <EffectSection id="shadows" title="Shadows">
        <p className="mb-4 max-w-[560px] text-[13.5px] leading-relaxed text-ink-2">
          Use the lightest level that separates the surface. Each level resolves to a stronger
          treatment against dark backgrounds.
        </p>

        <div
          className={cn(
            'space-y-5 rounded-lg border p-6 transition-colors',
            isDark
              ? 'border-white/10 bg-[#18181b]'
              : 'border-[#D1D5DC] bg-[#E5E7EB]',
          )}
        >
          {shadows.map((shadow) => {
            const opacity = isDark ? shadow.darkOpacity : shadow.lightOpacity;
            const color = isDark ? '0, 0, 0' : '16, 24, 40';
            const hexColor = isDark ? '#000000' : '#101828';
            const css = `0 ${shadow.offset}px ${shadow.blur}px rgba(${color}, ${opacity})`;
            const rn = `{ shadowColor: '${hexColor}', shadowOffset: { width: 0, height: ${shadow.offset} }, shadowOpacity: ${opacity}, shadowRadius: ${shadow.blur}, elevation: ${shadow.elevation} }`;

            return (
              <div
                key={shadow.name}
                className={cn(
                  'grid gap-4 rounded-lg border p-5 sm:grid-cols-[1fr_1.15fr] sm:items-center',
                  isDark
                    ? 'border-white/10 text-white'
                    : 'border-black/5 bg-white text-[#101828]',
                )}
                style={{ boxShadow: css, ...(isDark ? { backgroundColor: shadow.darkSurface } : null) }}
              >
                <div>
                  <div className="font-mono text-[11px] opacity-55">
                    theme.shadows.{shadow.name}
                  </div>
                  <div className="mt-6 text-[16px] font-medium">{shadow.use}</div>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10.5px] leading-relaxed opacity-70">
                  <div>
                    <dt>Offset Y</dt>
                    <dd>{shadow.offset}px</dd>
                  </div>
                  <div>
                    <dt>Blur</dt>
                    <dd>{shadow.blur}px</dd>
                  </div>
                  <div>
                    <dt>Opacity</dt>
                    <dd>{Math.round(opacity * 100)}%</dd>
                  </div>
                  <div>
                    <dt>Android</dt>
                    <dd>elevation {shadow.elevation}</dd>
                  </div>
                  <div className="col-span-2 break-all">
                    <dt>CSS</dt>
                    <dd>{css}</dd>
                  </div>
                  <div className="col-span-2 break-all">
                    <dt>React Native</dt>
                    <dd>
                      theme.shadows.{shadow.name} = {rn}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </EffectSection>

      <EffectSection id="focus-rings" title="Focus rings">
        <p className="mb-5 text-[13.5px] leading-relaxed text-ink-2">
          Focus uses two solid spreads: a 2px surface-colored gap and a 4px semantic outer ring.
          Web uses stacked box shadows; React Native composes a wrapper and border.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FocusExample
            label="Main"
            description="Primary-400 outer ring"
            ring="0 0 0 2px var(--canvas), 0 0 0 4px #51A2FF"
            radius="rounded-full"
          >
            <button className="flex h-10 items-center rounded-full bg-[#155DFC] px-5 text-[13px] font-medium text-white">
              Continue
            </button>
          </FocusExample>
          <FocusExample
            label="Error"
            description="Error-300 outer ring"
            ring="0 0 0 2px var(--canvas), 0 0 0 4px #FFA2A2"
            radius="rounded-md"
          >
            <div className="h-11 w-44 rounded-md border border-[#FB2C36] bg-canvas px-3 py-2 text-[13px] text-[#FB2C36]">
              Invalid value
            </div>
          </FocusExample>
        </div>
        <div className="mt-3 grid grid-cols-[72px_1fr] overflow-hidden rounded-lg border border-line text-[12px]">
          <div className="bg-canvas p-4 font-mono text-ink-3">2px</div>
          <div className="bg-surface p-4 text-ink-2">Inner gap matches the surrounding surface</div>
          <div className="border-t border-line bg-[#51A2FF] p-4 font-mono text-white">4px</div>
          <div className="border-t border-line bg-surface p-4 text-ink-2">
            Outer ring carries the main or error semantic color
          </div>
        </div>
      </EffectSection>

      <EffectSection id="blur-levels" title="Blur levels">
        <div className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-5">
          {blurLevels.map(([name, value, use]) => (
            <div
              key={name}
              className="relative min-h-56 border-b border-white/10 bg-[url('/demos/effects-blur-bg.jpg')] bg-cover bg-center last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
            >
              <div
                className="absolute inset-0 bg-white/8"
                style={{ backdropFilter: `blur(${value}px)`, WebkitBackdropFilter: `blur(${value}px)` }}
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-black/35 px-3 py-2.5 text-white backdrop-blur-md">
                <div className="font-mono text-[11px]">blurs.{name}</div>
                <div className="mt-1 text-[13px] font-medium">{value}px</div>
                <div className="mt-1 text-[10.5px] leading-snug text-white/70">{use}</div>
              </div>
            </div>
          ))}
        </div>
        <StatusBadge
          tone="changes"
          className="mt-3 min-h-0 w-full items-start justify-start rounded-lg px-4 py-3 text-left text-[12.5px] leading-relaxed"
        >
          Blur is GPU-intensive. Test scrolling, gestures, and sheets on low-end Android hardware;
          use the semi-transparent tint without live blur when frame rate drops.
        </StatusBadge>
      </EffectSection>

      <EffectSection id="liquid-glass" title="Liquid Glass">
        <StatusBadge tone="draft" className="mb-4 min-h-0 rounded-full py-1 text-[11px] uppercase">
          Experimental · iOS 26+
        </StatusBadge>
        <p className="mb-5 text-[13.5px] leading-relaxed text-ink-2">
          Treat native Liquid Glass as progressive enhancement. Non-supported platforms should use
          the matching blur, surface tint, and border preset rather than losing hierarchy.
        </p>
        <div className="relative overflow-hidden rounded-lg border border-line bg-[url('/demos/effects-blur-bg.jpg')] bg-cover bg-center p-6">
          <div className="grid min-h-64 items-end gap-4 sm:grid-cols-3">
            <GlassSample name="Large" use="Nav and tab bars" className="min-h-36" />
            <GlassSample name="Medium" use="Overlays and sheets" className="min-h-28" />
            <GlassSample
              name="Small"
              use="Buttons and chips"
              className="min-h-20"
              states={['Default', 'Preferred']}
            />
          </div>
        </div>
      </EffectSection>

      <EffectSection id="dark-mode" title="Dark mode behavior">
        <div className="grid gap-3 sm:grid-cols-2">
          <RuleCard
            title="Shadows"
            text="Increase opacity and use a slightly blue-shifted tint so elevation remains visible without muddy black halos."
          />
          <RuleCard
            title="Focus and glass"
            text="Use brighter ring values, darker translucent overlays, and a visible light border against changing content."
          />
        </div>
      </EffectSection>

      <EffectSection id="code" title="Code">
        <div className="space-y-3">
          <CodeBlock>{shadowCode}</CodeBlock>
          <CodeBlock language="css">{focusCode}</CodeBlock>
          <CodeBlock>{blurCode}</CodeBlock>
        </div>
      </EffectSection>

      <EffectSection id="tokens" title="Tokens used">
        <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
          {[
            ['theme.shadows.none–xl', 'React Native shadow objects and Android elevation'],
            ['focusRing.light.main/error', 'Two-layer web focus ring strings'],
            ['focusRing.dark.main/error', 'Brighter dark-mode focus treatment'],
            ['blurs.none–xl', '0, 4, 8, 16, 24, and 40'],
            ['materials.glassSmall', 'Buttons and chips'],
            ['materials.glassMedium', 'Overlays and sheets'],
            ['materials.glassLarge', 'Navigation and tab bars'],
          ].map(([token, detail]) => (
            <div
              key={token}
              className="grid gap-1 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[220px_1fr]"
            >
              <code className="break-words font-mono text-[11.5px] text-ink">{token}</code>
              <div className="text-[12.5px] text-ink-3">{detail}</div>
            </div>
          ))}
        </div>
      </EffectSection>

      <EffectSection id="rules" title="Rules">
        <div className="grid gap-3 sm:grid-cols-2">
          <RuleCard title="Depth first" text="Establish hierarchy with spacing and layering before adding a shadow." />
          <RuleCard title="One shadow" text="Never stack multiple elevation presets on the same surface." />
          <RuleCard title="Press downward" text="Drop the shadow level on press so the control feels physically depressed." />
          <RuleCard title="Tint the blur" text="Always pair blur with a translucent surface tint for reliable contrast." />
        </div>
      </EffectSection>

      <EffectSection id="do-dont" title="Do · Don’t">
        <div className="space-y-3">
          <DoDont
            doText="Use shadow-sm for subtle lift, shadow-md for cards, and reserve shadow-xl for modals."
            dontText="Apply shadow-xl to every card. Heavy shadows flatten the hierarchy into noise."
          />
          <DoDont
            doText="Drop shadow-sm to shadow-none on press."
            dontText="Increase the shadow on press. A pushed object should not float higher."
          />
          <DoDont
            doText="Reserve glass for sheets, navigation chrome, and rare expressive controls."
            dontText="Apply live blur to every card, especially in scrolling Android lists."
          />
          <DoDont
            doText="Pair blur with a semi-transparent tint and test over real content."
            dontText="Rely on blur alone to make text readable."
          />
        </div>
      </EffectSection>
    </>
  );
}

function EffectSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-10 pt-12">
      <h2 className="text-[24px] font-medium leading-tight text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FocusExample({
  label,
  description,
  ring,
  radius,
  children,
}: {
  label: string;
  description: string;
  ring: string;
  radius: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex min-h-24 items-center justify-center rounded-md bg-canvas p-5">
        <div className={cn('inline-flex', radius)} style={{ boxShadow: ring }}>
          {children}
        </div>
      </div>
      <div className="mt-4 text-[14px] font-medium text-ink">{label}</div>
      <div className="mt-1 text-[12px] text-ink-3">{description}</div>
    </div>
  );
}

function GlassSample({
  name,
  use,
  className,
  states,
}: {
  name: string;
  use: string;
  className?: string;
  states?: string[];
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-end rounded-lg border border-white/55 bg-white/65 p-4 text-[#101828] shadow-lg backdrop-blur-[24px]',
        className,
      )}
    >
      <div className="text-[15px] font-medium">{name}</div>
      <div className="mt-1 text-[11.5px] text-[#4A5565]">{use}</div>
      {states ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {states.map((state) => (
            <span
              key={state}
              className="rounded-full border border-white/60 bg-white/45 px-2 py-0.5 text-[10px] font-medium text-[#101828] backdrop-blur-[24px]"
            >
              {state}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RuleCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="text-[13px] font-medium text-ink">{title}</div>
      <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{text}</div>
    </div>
  );
}

function DoDont({ doText, dontText }: { doText: string; dontText: string }) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-2">
      <div className="bg-[#DDFBE8] p-4 dark:bg-emerald-500/10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#166534] dark:text-emerald-300">
          Do
        </div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{doText}</div>
      </div>
      <div className="border-t border-line bg-[#FFE4E6] p-4 sm:border-t-0 sm:border-l dark:bg-rose-500/10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9F1D1D] dark:text-rose-300">
          Don’t
        </div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{dontText}</div>
      </div>
    </div>
  );
}
