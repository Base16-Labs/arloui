import { ContrastChecker } from '@/components/docs/contrast-checker';
import { DoDont as PrimitiveDoDont, RuleCard as PrimitiveRuleCard } from '@/components/docs/doc-cards';
import { TailwindAlphaRamp, TailwindPaletteGrid } from '@/components/docs/tailwind-palette';
import { Eyebrow } from '@/components/mdx/Eyebrow';
import { Lede } from '@/components/mdx/Lede';
import { RightRail } from '@/components/nav/RightRail';
import { CodeBlock } from '@/components/ui/CodeBlock';
import {
  alphaRamp,
  darkSemanticColors,
  lightSemanticColors,
  mainScales,
  paletteBase,
  paletteSecondary,
} from '@/lib/color-tokens';
import { Section } from '../_shared';

const colorThemeCode = `import { useTheme } from '@/foundation/theme-provider';

function MyCard() {
  const { theme } = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.surfaceElevated }}>
      <Text style={{ color: theme.colors.textPrimary }}>Hello</Text>
      <Text style={{ color: theme.colors.textSecondary }}>Description</Text>
    </View>
  );
}`;

const colorModeCode = `// Semantic colors resolve per mode — no light/dark branching
const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.surfaceBackground }}>
  <View
    style={{
      backgroundColor: theme.colors.feedbackSuccessBg,
      borderColor: theme.colors.feedbackSuccess,
    }}
  >
    <Text style={{ color: theme.colors.feedbackSuccess }}>Payment sent</Text>
  </View>
</View>`;

const colorPaletteCode = `import { paletteMain } from '@arloui/tokens';

// Raw palette is for data visualization only
const chartColors = [
  paletteMain.primary[500],
  paletteMain.success[500],
  paletteMain.warning[500],
];`;

function ColorThreeLayer() {
  const layers = [
    {
      name: 'Palette',
      detail: 'Raw values — Grey-50, Primary-600, Error-500.',
      example: 'paletteMain.primary[600]',
    },
    {
      name: 'Semantic',
      detail: 'Roles that resolve per mode across light and dark.',
      example: 'colors.interactivePrimary',
    },
    {
      name: 'Component',
      detail: 'Reads semantic roles only, never raw palette.',
      example: 'theme.colors.interactivePrimary',
    },
  ];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {layers.map((layer, index) => (
          <div key={layer.name} className="rounded-lg border border-line bg-surface p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
              Layer {index + 1}
            </div>
            <div className="mt-2 text-[15px] font-medium text-ink">{layer.name}</div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{layer.detail}</div>
            <code className="mt-3 block font-mono text-[10.5px] text-ink-3">{layer.example}</code>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
        Components never read palette values directly. Semantic tokens resolve per mode, so the same
        role returns the right value in light and dark.
      </p>
    </>
  );
}

// PrimitiveRuleCard / PrimitiveDoDont now come from components/docs/doc-cards.tsx (imported above)

export function ColorPage() {
  const headings = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'semantic-tokens', label: 'Semantic tokens' },
    { id: 'main-palette', label: 'Main palette' },
    { id: 'secondary-palette', label: 'Secondary palette' },
    { id: 'alpha-ramps', label: 'Alpha ramps' },
    { id: 'contrast', label: 'Contrast checker' },
    { id: 'code', label: 'Code' },
    { id: 'tokens', label: 'Tokens used' },
    { id: 'rules', label: 'Rules' },
    { id: 'do-dont', label: 'Do · Don’t' },
    { id: 'related', label: 'Related' },
  ];
  const actions = [
    {
      label: 'Figma',
      href: 'https://figma.com/design/WRSHkSNQqCYLEhSYJnyVGb/Arlo-UI-v1.0?node-id=16-2033',
    },
    {
      label: 'Source',
      href: 'https://github.com/Base16-Labs/arloui/tree/main/packages/tokens/src/colors.ts',
    },
  ];
  const tokenPaths = [
    ...utilitySemanticPalette.flatMap((group) =>
      group.rows.map((row) => `theme.colors.${row.semanticKey}`),
    ),
    'paletteMain.grey',
    'paletteMain.primary',
    'paletteMain.success',
    'paletteMain.warning',
    'paletteMain.error',
    'paletteSecondary',
    'alphaRamp.white',
    'alphaRamp.black',
  ];

  return (
    <>
      <main className="max-w-[820px] flex-1 px-8 pt-10 pb-20 sm:px-14">
        <Eyebrow>Foundations</Eyebrow>
        <h1 className="mt-3.5 text-[44px] font-medium leading-none tracking-tight sm:text-[56px]">
          Color
        </h1>
        <Lede>One accent per screen. Neutral grey carries the chrome. The accent is an event.</Lede>

        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              {action.label}
            </a>
          ))}
        </div>

        <Section id="architecture" title="Three-layer architecture">
          <ColorThreeLayer />
        </Section>

        <Section id="semantic-tokens" title="Semantic tokens">
          <SemanticTokenTable />
        </Section>

        <Section id="main-palette" title="Main palette">
          <MainPalette />
        </Section>

        <Section id="secondary-palette" title="Secondary palette">
          <SecondaryPalette />
        </Section>

        <Section id="alpha-ramps" title="Alpha ramps">
          <AlphaRamps />
        </Section>

        <Section id="contrast" title="Contrast checker">
          <ContrastChecker />
        </Section>

        <Section id="code" title="Code">
          <div className="space-y-3">
            <CodeBlock>{colorThemeCode}</CodeBlock>
            <CodeBlock>{colorModeCode}</CodeBlock>
            <CodeBlock>{colorPaletteCode}</CodeBlock>
          </div>
        </Section>

        <Section id="tokens" title="Tokens used">
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-line">
            {tokenPaths.map((token) => (
              <div key={token} className="border-b border-line px-4 py-3 last:border-0">
                <code className="font-mono text-[11.5px] text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="rules" title="Rules">
          <div className="grid gap-3 sm:grid-cols-2">
            <PrimitiveRuleCard
              title="One accent"
              text="Use a single accent per screen — a CTA, a live status, a selection. The accent is an event, not decoration."
            />
            <PrimitiveRuleCard
              title="Semantic over palette"
              text="Read theme.colors.* inside components. Never hardcode palette values; they do not adapt across modes."
            />
            <PrimitiveRuleCard
              title="Design both modes"
              text="Neither mode is derived from the other. Test every screen in light and dark."
            />
            <PrimitiveRuleCard
              title="Tints for backgrounds"
              text="Use feedback-*-bg tints for status surfaces. Reserve the saturated feedback color for text and icons."
            />
          </div>
        </Section>

        <Section id="do-dont" title="Do · Don’t">
          <div className="space-y-3">
            <PrimitiveDoDont
              doText="Use one accent per screen. The accent is an event — a CTA, a live status, a selection."
              dontText="Use primary blue for headers, badges, links, and buttons all on the same screen."
            />
            <PrimitiveDoDont
              doText="Use semantic tokens like surfaceBackground and textPrimary. They resolve correctly in both modes."
              dontText="Reference palette values like grey-50 or #F9FAFB in component code. They do not adapt to dark mode."
            />
            <PrimitiveDoDont
              doText="Design both modes in parallel and test every screen in both."
              dontText="Build in light mode and invert for dark. The result always feels wrong."
            />
            <PrimitiveDoDont
              doText="Use feedback-*-bg tints for status backgrounds."
              dontText="Use feedback-error (saturated red) as a background fill. It is meant for text and icons."
            />
          </div>
        </Section>

        <section id="related" className="scroll-mt-10 pt-12">
          <h2 className="text-[24px] font-medium leading-tight text-ink">Related</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Tokens', 'Typography', 'Effects'].map((item) => (
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



type UtilitySemanticRow = {
  token: string;
  semanticKey: keyof typeof lightSemanticColors;
  palette: string;
  darkPalette: string;
  usage: string;
};

const utilitySemanticPalette: { section: string; rows: UtilitySemanticRow[] }[] = [
  {
    section: 'Surfaces & Backgrounds',
    rows: [
      {
        token: 'surface-background',
        semanticKey: 'surfaceBackground',
        palette: 'Grey-50',
        darkPalette: 'Zinc-950',
        usage: 'Main app background',
      },
      {
        token: 'surface-input',
        semanticKey: 'surfaceInput',
        palette: 'Grey-100',
        darkPalette: 'Zinc-900',
        usage: 'Input backgrounds',
      },
      {
        token: 'surface-elevated',
        semanticKey: 'surfaceElevated',
        palette: 'Base-White',
        darkPalette: 'Zinc-800',
        usage: 'Cards, sheets, modals (above background)',
      },
      {
        token: 'surface-overlay',
        semanticKey: 'surfaceOverlay',
        palette: 'Grey-900 @ 40%',
        darkPalette: 'Grey-900 @ 70%', // alphaRamp.black — shared with light
        usage: 'Overlays, backdrops, scrims',
      },
      {
        token: 'surface-inverse',
        semanticKey: 'surfaceInverse',
        palette: 'Grey-900',
        darkPalette: 'Zinc-50',
        usage: 'Dark surfaces, tooltips',
      },
      {
        token: 'surface-card',
        semanticKey: 'surfaceCard',
        palette: 'Grey-100',
        darkPalette: 'Zinc-900',
        usage: 'Card fills that sit on the background rather than above it',
      },
      {
        token: 'surface-input-active',
        semanticKey: 'surfaceInputActive',
        palette: 'Grey-200',
        darkPalette: 'Zinc-800',
        usage: 'An input while it is focused or being pressed',
      },
      {
        token: 'surface-bleed',
        semanticKey: 'surfaceBleed',
        palette: 'Grey-50 @ 50%',
        darkPalette: 'Zinc-950 @ 50%',
        usage: 'Half-opacity wash that lets a surface bleed over what it covers',
      },
    ],
  },
  {
    section: 'Text & Content',
    rows: [
      {
        token: 'text-primary',
        semanticKey: 'textPrimary',
        palette: 'Grey-900',
        darkPalette: 'Zinc-50',
        usage: 'Main content, headlines',
      },
      {
        token: 'text-secondary',
        semanticKey: 'textSecondary',
        palette: 'Grey-600',
        darkPalette: 'Zinc-400',
        usage: 'Supporting text, descriptions',
      },
      {
        token: 'text-tertiary',
        semanticKey: 'textTertiary',
        palette: 'Grey-400',
        darkPalette: 'Zinc-500',
        usage: 'Captions, metadata',
      },
      {
        token: 'text-disabled',
        semanticKey: 'textDisabled',
        palette: 'Grey-900 @ 5%',
        darkPalette: 'Zinc-50 @ 38%',
        usage: 'Disabled states',
      },
      {
        token: 'text-inverse',
        semanticKey: 'textInverse',
        palette: 'Base-White',
        darkPalette: 'Zinc-900',
        usage: 'Text on inverse backgrounds',
      },
      {
        token: 'text-placeholder',
        semanticKey: 'textPlaceholder',
        palette: 'Grey-300',
        darkPalette: 'Zinc-600',
        usage: 'Input placeholders',
      },
      {
        token: 'text-interactive-primary',
        semanticKey: 'textInteractivePrimary',
        palette: 'Base-White',
        darkPalette: 'Base-White',
        usage: 'Text on primary interactive elements',
      },
      {
        token: 'text-interactive-secondary',
        semanticKey: 'textInteractiveSecondary',
        palette: 'Grey-700',
        darkPalette: 'Zinc-200',
        usage: 'Text on secondary interactive elements',
      },
      {
        token: 'text-interactive-tertiary',
        semanticKey: 'textInteractiveTertiary',
        palette: 'Primary-600',
        darkPalette: 'Primary-400',
        usage: 'Text on tertiary interactive elements',
      },
      {
        token: 'text-interactive-error',
        semanticKey: 'textInteractiveError',
        palette: 'Error-600',
        darkPalette: 'Error-400',
        usage: 'Text for error states',
      },
    ],
  },
  {
    section: 'Interactive Elements',
    rows: [
      {
        token: 'interactive-primary',
        semanticKey: 'interactivePrimary',
        palette: 'Primary-600',
        darkPalette: 'Primary-500',
        usage: 'Main CTAs, primary buttons',
      },
      {
        token: 'interactive-primary-pressed',
        semanticKey: 'interactivePrimaryPressed',
        palette: 'Primary-700',
        darkPalette: 'Primary-600',
        usage: 'Pressed state',
      },
      {
        token: 'interactive-secondary',
        semanticKey: 'interactiveSecondary',
        palette: 'Grey-200 @ 70%',
        darkPalette: 'Zinc-800',
        usage: 'Secondary buttons, tabs',
      },
      {
        token: 'interactive-secondary-pressed',
        semanticKey: 'interactiveSecondaryPressed',
        palette: 'Grey-200',
        darkPalette: 'Zinc-700',
        usage: 'Secondary hover state',
      },
      {
        token: 'interactive-tertiary',
        semanticKey: 'interactiveTertiary',
        palette: 'Transparent',
        darkPalette: 'Transparent',
        usage: 'Ghost buttons, text links',
      },
      {
        token: 'interactive-tertiary-pressed',
        semanticKey: 'interactiveTertiaryPressed',
        palette: 'Grey-100 @ 40%',
        darkPalette: 'Zinc-800 @ 55%',
        usage: 'Tertiary hover state',
      },
      {
        token: 'interactive-disabled',
        semanticKey: 'interactiveDisabled',
        palette: 'Grey-100',
        darkPalette: 'Zinc-800',
        usage: 'Disabled button (or action) backgrounds',
      },
      {
        token: 'interactive-error',
        semanticKey: 'interactiveError',
        palette: 'Error-500',
        darkPalette: 'Error-500',
        usage: 'Error state backgrounds',
      },
      {
        token: 'focus-ring-main',
        semanticKey: 'focusRingMain',
        palette: 'Primary-400',
        darkPalette: 'Primary-400',
        usage: 'Accessibility focus indicators',
      },
      {
        token: 'focus-ring-error',
        semanticKey: 'focusRingError',
        palette: 'Error-300',
        darkPalette: 'Error-400',
        usage: 'Accessibility focus indicators for error states',
      },
      {
        token: 'touch-feedback-main',
        semanticKey: 'touchFeedbackMain',
        palette: 'Grey-900 @ 10%',
        darkPalette: 'Zinc-50 @ 8%',
        usage: 'Ripple, highlight, or haptic feedback overlays on saturated surfaces',
      },
      {
        token: 'touch-feedback-light',
        semanticKey: 'touchFeedbackLight',
        palette: 'Grey-100 @ 40%',
        darkPalette: 'Zinc-800 @ 50%',
        usage: 'Ripple, highlight, or haptic feedback overlays on main backgrounds',
      },
    ],
  },
  {
    section: 'Borders & Dividers',
    rows: [
      {
        token: 'border-primary',
        semanticKey: 'borderPrimary',
        palette: 'Grey-300',
        darkPalette: 'Zinc-700',
        usage: 'Input borders, strong dividers',
      },
      {
        token: 'border-secondary',
        semanticKey: 'borderSecondary',
        palette: 'Grey-200',
        darkPalette: 'Zinc-800',
        usage: 'Subtle separators',
      },
      {
        token: 'border-focus',
        semanticKey: 'borderFocus',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Active input borders',
      },
      {
        token: 'border-error',
        semanticKey: 'borderError',
        palette: 'Error-500',
        darkPalette: 'Error-500',
        usage: 'Error state borders',
      },
    ],
  },
  {
    section: 'Feedback States',
    rows: [
      {
        token: 'feedback-success',
        semanticKey: 'feedbackSuccess',
        palette: 'Success-500',
        darkPalette: 'Success-400',
        usage: 'Success messages, confirmations',
      },
      {
        token: 'feedback-success-bg',
        semanticKey: 'feedbackSuccessBg',
        palette: 'Success-50',
        darkPalette: 'Success-950',
        usage: 'Success background areas',
      },
      {
        token: 'feedback-warning',
        semanticKey: 'feedbackWarning',
        palette: 'Warning-600',
        darkPalette: 'Warning-400',
        usage: 'Warnings, important notices',
      },
      {
        token: 'feedback-warning-bg',
        semanticKey: 'feedbackWarningBg',
        palette: 'Warning-50',
        darkPalette: 'Warning-950',
        usage: 'Warning background areas',
      },
      {
        token: 'feedback-error',
        semanticKey: 'feedbackError',
        palette: 'Error-500',
        darkPalette: 'Error-500',
        usage: 'Errors, validation issues',
      },
      {
        token: 'feedback-error-bg',
        semanticKey: 'feedbackErrorBg',
        palette: 'Error-50',
        darkPalette: 'Error-950',
        usage: 'Error background areas',
      },
      {
        token: 'feedback-info',
        semanticKey: 'feedbackInfo',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Information, neutral notices',
      },
      {
        token: 'feedback-info-bg',
        semanticKey: 'feedbackInfoBg',
        palette: 'Primary-50',
        darkPalette: 'Primary-950',
        usage: 'Info background areas',
      },
    ],
  },
  {
    section: 'Navigation & UI Chrome',
    rows: [
      {
        token: 'nav-background',
        semanticKey: 'navBackground',
        palette: 'Base-White',
        darkPalette: 'Zinc-900',
        usage: 'Tab bars, nav bars',
      },
      {
        token: 'nav-border',
        semanticKey: 'navBorder',
        palette: 'Grey-200',
        darkPalette: 'Zinc-800',
        usage: 'Navigation separators',
      },
      {
        token: 'nav-active',
        semanticKey: 'navActive',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Active nav items',
      },
      {
        token: 'nav-inactive',
        semanticKey: 'navInactive',
        palette: 'Grey-400',
        darkPalette: 'Zinc-500',
        usage: 'Inactive nav items',
      },
      {
        token: 'nav-indicator',
        semanticKey: 'navIndicator',
        palette: 'Primary-500',
        darkPalette: 'Primary-400',
        usage: 'Tab indicators, progress',
      },
    ],
  },
  {
    section: 'Gestures',
    rows: [
      {
        token: 'pull-indicator',
        semanticKey: 'pullIndicator',
        palette: 'Grey-300',
        darkPalette: 'Zinc-600',
        usage: 'Pull-to-refresh indicators',
      },
    ],
  },
];

function MainPalette() {
  return (
    <PaletteBlock
      title="Main palette"
      description="Base, Grey, Primary, Success, Warning, and Error from @arloui/tokens paletteMain. Hover any step for its hex."
    >
      <TailwindPaletteGrid
        scales={mainScales}
        includeBase={{ white: paletteBase.white, black: paletteBase.black }}
      />
    </PaletteBlock>
  );
}

function SecondaryPalette() {
  return (
    <PaletteBlock
      title="Secondary palette"
      description="Extended Tailwind-aligned hues from @arloui/tokens paletteSecondary, reserved for data visualization and decoration."
    >
      <TailwindPaletteGrid scales={paletteSecondary} />
    </PaletteBlock>
  );
}

function AlphaRamps() {
  return (
    <PaletteBlock
      title="Alpha ramps"
      description="White and Black at 10% increments over a checkerboard, for overlays, scrims, and press feedback."
    >
      <TailwindAlphaRamp
        white={alphaRamp.white}
        black={alphaRamp.black}
        whiteBase={alphaRamp.whiteBase}
        blackBase={alphaRamp.blackBase}
      />
    </PaletteBlock>
  );
}

function SemanticTokenTable() {
  return (
    <PaletteBlock
      title="Utility semantic palette"
      description="Semantic roles mapped from the main palette. Swatches read from @arloui/tokens lightSemanticColors and darkSemanticColors; components consume these through theme.colors in camelCase."
    >
      <div className="overflow-hidden rounded-md border border-line">
          <div className="hidden border-b border-line bg-canvas px-3 py-2.5 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(112px,0.7fr)_minmax(112px,0.7fr)_minmax(0,1.2fr)] md:gap-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Token
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Color (light)
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Color (dark)
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
              Usage
            </div>
          </div>
          {utilitySemanticPalette.map((group) => (
            <div key={group.section}>
              <div className="border-b border-line bg-canvas px-3 py-2.5">
                <div className="text-[12px] font-medium text-ink">{group.section}</div>
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.token}
                  className="grid gap-2 border-b border-line px-3 py-3 last:border-b-0 md:grid-cols-[minmax(0,1.15fr)_minmax(112px,0.7fr)_minmax(112px,0.7fr)_minmax(0,1.2fr)] md:items-center md:gap-4"
                >
                  <div className="min-w-0 break-words font-mono text-[12px] leading-relaxed text-ink">
                    {row.token}
                  </div>
                  <PaletteRef
                    label="Light"
                    palette={row.palette}
                    swatch={lightSemanticColors[row.semanticKey]}
                  />
                  <PaletteRef
                    label="Dark"
                    palette={row.darkPalette}
                    swatch={darkSemanticColors[row.semanticKey]}
                  />
                  <div className="text-[13px] leading-relaxed text-ink-3">{row.usage}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </PaletteBlock>
  );
}

function PaletteBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="mb-4 flex flex-col gap-1">
        <div className="text-[14px] font-medium text-ink">{title}</div>
        <div className="text-[12.5px] leading-relaxed text-ink-3">{description}</div>
      </div>
      {children}
    </div>
  );
}

function PaletteRef({
  label,
  palette,
  swatch,
}: {
  label: string;
  palette: string;
  swatch: string;
}) {
  const isTransparent = swatch === 'transparent';
  const checkerboard = {
    backgroundImage:
      'linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%), linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%)',
    backgroundSize: '6px 6px',
    backgroundPosition: '0 0, 3px 3px',
  };

  return (
    <div className="group relative flex min-w-0 items-center gap-2">
      <span className="relative shrink-0">
        <span
          className="block size-4 rounded-full border border-line"
          style={isTransparent ? checkerboard : { backgroundColor: swatch }}
        />
        <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[10px] leading-none text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          {swatch}
        </span>
      </span>
      <div className="min-w-0">
        <span className="sr-only">{label}</span>
        <span className="text-[12.5px] text-ink-2">{palette}</span>
      </div>
    </div>
  );
}

