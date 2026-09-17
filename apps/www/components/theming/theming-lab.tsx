'use client';

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { DialRoot, useDialKit, type DialConfig } from 'dialkit';
import { Text, View, type TextStyle } from 'react-native';
import {
  AnimatedCounter,
  AnimatedIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  List,
  Sparkline,
  TabBar,
  Tabs,
  ThemeProvider as ArloThemeProvider,
  Toggle,
  themes as registryThemes,
  type Theme as RegistryTheme,
} from '@arloui/registry';
import {
  OutlineArrowLeft,
  OutlineArrowUpRight,
  OutlineBell,
  OutlineCalendarBlank,
  OutlineCards,
  OutlineChartBar,
  OutlineCreditCard,
  OutlineDotsThree,
  OutlineFileTsx,
  OutlineFlag,
  OutlineHouse,
  OutlineListChecks,
  OutlineMagnifyingGlass,
  OutlineMicrophone,
  OutlinePaperPlaneRight,
  OutlinePencilSimple,
  OutlinePlus,
  OutlineReceipt,
  OutlineRobot,
  OutlineSidebarSimple,
  OutlineUser,
} from '@arloui/icons';
import {
  createOklchRamp,
  hexToOklch,
  oklchToHex,
  shadeSteps,
  type ChromaRampSpec,
  type OklchRampSpec,
  type RuntimeRamp,
  type Shade,
} from '@arloui/tokens/oklch';
import {
  arloOklchRampSpecs,
  generateArloOklchTheme,
  type GeneratedOklchTheme,
  type RampName,
} from '@arloui/tokens/oklch-theme';
import { useTheme } from '@/lib/theme';

type PreviewKind = 'swatches' | 'ledger' | 'loop' | 'ora';
type RuntimeColors = GeneratedOklchTheme['colors']['light'];
type ColorControl = {
  color: string;
  chroma: number;
};
type DialValues = {
  preview: {
    screen: PreviewKind;
  };
  neutral: {
    tintAmount: number;
    surfaceDepth: number;
  };
  primary: {
    color: string;
    vividness: number;
  };
  status: {
    successColor: string;
    successVividness: number;
    warningColor: string;
    warningVividness: number;
    errorColor: string;
    errorVividness: number;
  };
  secondary: {
    chartShift: number;
    oneColor: string;
    oneVividness: number;
    twoColor: string;
    twoVividness: number;
    threeColor: string;
    threeVividness: number;
    fourColor: string;
    fourVividness: number;
  };
};

const rampNames = Object.keys(arloOklchRampSpecs) as RampName[];
const previewFontFamily = 'Manrope Variable, Manrope, system-ui, -apple-system, sans-serif';
const surfaceSemanticNames = [
  'surfaceBackground',
  'surfaceCard',
  'surfaceInput',
  'surfaceInputActive',
  'surfaceElevated',
  'borderSecondary',
];
const textSemanticNames = [
  'textPrimary',
  'textSecondary',
  'textTertiary',
  'textInverse',
  'textInteractivePrimary',
];
const actionSemanticNames = [
  'interactivePrimary',
  'interactivePrimaryPressed',
  'feedbackSuccess',
  'feedbackWarning',
  'feedbackError',
];
const recipePreviewNames = [
  'surfaceBackground',
  'surfaceCard',
  'surfaceInput',
  'surfaceInputActive',
  'surfaceElevated',
  'textPrimary',
  'textSecondary',
  'interactivePrimary',
  'interactivePrimaryPressed',
  'feedbackInfoBg',
  'feedbackSuccessBg',
  'feedbackWarningBg',
  'feedbackErrorBg',
];

type LabControls = {
  preview: {
    screen: PreviewKind;
  };
  neutral: {
    chroma: number;
    surfaceDepth: number;
  };
  primary: ColorControl;
  status: {
    success: ColorControl;
    warning: ColorControl;
    error: ColorControl;
  };
  secondary: {
    chartShift: number;
    one: ColorControl;
    two: ColorControl;
    three: ColorControl;
    four: ColorControl;
  };
};

const dialConfig = {
  preview: {
    screen: {
      type: 'select',
      options: [
        { value: 'swatches', label: 'Color swatches' },
        { value: 'ledger', label: 'Ledger' },
        { value: 'loop', label: 'Loop' },
        { value: 'ora', label: 'Ora' },
      ],
      default: 'ledger',
    },
  },
  neutral: {
    tintAmount: [0, 0, 1, 0.01],
    surfaceDepth: [1, 0.75, 1.35, 0.01],
  },
  primary: {
    color: { type: 'color', default: '#225BB9' },
    vividness: [1, 0.35, 1.7, 0.01],
  },
  status: {
    successColor: { type: 'color', default: '#009342' },
    successVividness: [1, 0.35, 1.7, 0.01],
    warningColor: { type: 'color', default: '#805800' },
    warningVividness: [1, 0.35, 1.7, 0.01],
    errorColor: { type: 'color', default: '#CF413D' },
    errorVividness: [1, 0.35, 1.7, 0.01],
  },
  secondary: {
    chartShift: [0, -48, 48, 1],
    oneColor: { type: 'color', default: '#4B6D00' },
    oneVividness: [1, 0.35, 1.7, 0.01],
    twoColor: { type: 'color', default: '#A42665' },
    twoVividness: [1, 0.35, 1.7, 0.01],
    threeColor: { type: 'color', default: '#755E00' },
    threeVividness: [1, 0.35, 1.7, 0.01],
    fourColor: { type: 'color', default: '#00707C' },
    fourVividness: [1, 0.35, 1.7, 0.01],
  },
} satisfies DialConfig;

export function ThemingLab() {
  const { resolved } = useTheme();
  const dialValues = useDialKit('Arlo theme', dialConfig, {
    id: 'arlo-oklch-theme-lab',
    persist: true,
  }) as unknown as DialValues;
  const controls = useMemo(() => controlsFromDialValues(dialValues), [dialValues]);
  const [mounted, setMounted] = useState(false);
  const scheme = mounted ? resolved : 'light';

  const generated = useMemo(() => {
    const specs = buildRampSpecs({
      neutralChroma: controls.neutral.chroma,
      surfaceDepth: controls.neutral.surfaceDepth,
      primary: controls.primary,
      status: controls.status,
      secondary: controls.secondary,
    });
    return generateArloOklchTheme(specs);
  }, [
    controls.neutral.chroma,
    controls.neutral.surfaceDepth,
    controls.primary,
    controls.secondary,
    controls.status,
  ]);

  const registryTheme = useMemo(
    () => makeRegistryTheme(generated, scheme),
    [generated, scheme],
  );
  const activeColors = generated.colors[scheme];
  const clipped = generated.audits.gamut.filter((item) => item.clipped);
  const maxChromaLoss = clipped.length
    ? Math.max(...clipped.map((item) => item.chromaLoss)).toFixed(3)
    : '0.000';

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas px-5 text-ink">
        <div className="text-[13px] text-ink-3">Loading theme lab...</div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-canvas">
      <div className="grid min-h-dvh lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
          <div className="border-b border-line px-5 py-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
              Theming
            </div>
            <h1 className="mt-2 text-[28px] font-medium leading-tight text-ink">Arlo OKLCH Lab</h1>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              Generated OKLCH ramps feed real ArloUI primitives. The site theme toggle controls
              light and dark mode.
            </p>
          </div>
          <div className="border-b border-line p-4 lg:h-[calc(100dvh-123px)] lg:overflow-y-auto lg:border-b-0">
            <div className="mb-4 space-y-2 rounded-lg border border-line bg-canvas p-3">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
                How ramps work
              </h2>
              <p className="text-[12px] leading-relaxed text-ink-2">
                Shade 50 is always lightest and 950 is always darkest. Users pick source
                colors; Arlo maps different stops for light and dark mode.
              </p>
            </div>
            <div className="mb-4 space-y-2 rounded-lg border border-line bg-canvas p-3">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
                Advanced knobs
              </h2>
              <p className="text-[12px] leading-relaxed text-ink-2">
                Surface depth changes how separated the neutral surface stops are. Chart shift
                rotates the four secondary/category hues together.
              </p>
            </div>
            <div className="theme-lab-dial">
              <DialRoot mode="inline" theme={scheme} productionEnabled />
            </div>
          </div>
        </aside>

        <section className="px-5 py-5 sm:px-8">
          <div className="mx-auto max-w-[1360px]">
            <LabHeader
              generated={generated}
              scheme={scheme}
              maxChromaLoss={maxChromaLoss}
              clippedCount={clipped.length}
            />
            <ArloThemeProvider theme={registryTheme}>
              <div className="mt-5">
                {controls.preview.screen === 'swatches' ? (
                  <SwatchesScreen generated={generated} scheme={scheme} />
                ) : controls.preview.screen === 'ledger' ? (
                  <LedgerPreview colors={activeColors} />
                ) : controls.preview.screen === 'loop' ? (
                  <LoopPreview colors={activeColors} />
                ) : (
                  <OraPreview colors={activeColors} />
                )}
              </div>
            </ArloThemeProvider>
          </div>
        </section>

      </div>
    </main>
  );
}

function LabHeader({
  generated,
  scheme,
  maxChromaLoss,
  clippedCount,
}: {
  generated: GeneratedOklchTheme;
  scheme: 'light' | 'dark';
  maxChromaLoss: string;
  clippedCount: number;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
            Active runtime: {scheme}
          </div>
          <div className="mt-2 text-[24px] font-medium leading-tight text-ink">
            {generated.audits.pass ? 'Recipe passes current audits' : 'Recipe needs review'}
          </div>
          <p className="mt-2 max-w-[600px] text-[13px] leading-relaxed text-ink-2">
            OKLCH is the authoring format. The previews receive generated hex and rgba values, the
            same shape React Native consumes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:min-w-[430px] sm:grid-cols-4">
          <AuditPill label="Contrast" pass={generated.audits.contrast.every((item) => item.pass)} />
          <AuditPill label="Surfaces" pass={generated.audits.surfaces.every((item) => item.pass)} />
          <AuditPill label="Charts" pass={generated.audits.charts.every((item) => item.pass)} />
          <AuditPill
            label={`${clippedCount} fit / ${maxChromaLoss}`}
            pass={generated.audits.gamut.every((item) => item.pass)}
          />
        </div>
      </div>
    </div>
  );
}

function AuditPill({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className="rounded-md border border-line bg-canvas px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink-3">
        {pass ? 'Pass' : 'Review'}
      </div>
      <div className="mt-1 truncate text-[12px] font-medium text-ink">{label}</div>
    </div>
  );
}

function SwatchesScreen({
  generated,
  scheme,
}: {
  generated: GeneratedOklchTheme;
  scheme: 'light' | 'dark';
}) {
  const orderedShades = scheme === 'dark' ? [...shadeSteps].reverse() : [...shadeSteps];

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-line bg-surface p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
              Color swatches
            </div>
            <h2 className="mt-2 text-[24px] font-medium leading-tight text-ink">
              {scheme === 'dark' ? 'Dark mode semantic order' : 'Light mode semantic order'}
            </h2>
          </div>
          <div className="rounded-md border border-line bg-canvas px-3 py-2 font-mono text-[11px] text-ink-2">
            {orderedShades[0]} {'->'} {orderedShades[orderedShades.length - 1]}
          </div>
        </div>
        <p className="mt-3 max-w-[720px] text-[13px] leading-relaxed text-ink-2">
          The canonical ramp always runs 50 light to 950 dark. This view flips the display in dark
          mode because the theme recipe flips usage: dark screens start from the darkest stops and
          pull lighter stops forward for text, borders, focus, and emphasis.
        </p>
      </div>

      <SemanticRecipeBoard generated={generated} />

      <div className="grid gap-4 xl:grid-cols-2">
        {rampNames.map((name) => (
          <SwatchRampCard
            key={name}
            name={name}
            ramp={generated.ramps[name]}
            shades={orderedShades}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SemanticSample title="Surfaces" values={surfaceSemanticNames} colors={generated.colors[scheme]} />
        <SemanticSample title="Text" values={textSemanticNames} colors={generated.colors[scheme]} />
        <SemanticSample title="Actions" values={actionSemanticNames} colors={generated.colors[scheme]} />
      </div>
    </div>
  );
}

function SemanticRecipeBoard({ generated }: { generated: GeneratedOklchTheme }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-[13px] font-medium text-ink">Semantic recipe</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-3">
            Users pick source colors. Arlo picks different stops from the same ramps for each mode.
          </p>
        </div>
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
          No dark hex picking
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-md border border-line">
        <div className="grid grid-cols-[minmax(130px,1fr)_minmax(100px,0.8fr)_minmax(100px,0.8fr)] border-b border-line bg-canvas px-3 py-2 text-[11px] font-medium text-ink-3">
          <div>Token</div>
          <div>Light recipe</div>
          <div>Dark recipe</div>
        </div>
        {recipePreviewNames.map((name) => (
          <div
            key={name}
            className="grid grid-cols-[minmax(130px,1fr)_minmax(100px,0.8fr)_minmax(100px,0.8fr)] border-b border-line px-3 py-2 last:border-b-0"
          >
            <div className="truncate font-mono text-[11px] text-ink-2">{name}</div>
            <RecipeSource color={generated.semantic.light[name]} />
            <RecipeSource color={generated.semantic.dark[name]} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RecipeSource({ color }: { color: GeneratedOklchTheme['semantic']['light'][string] }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-5 rounded border border-line"
        style={{ backgroundColor: color.value }}
      />
      <span className="truncate font-mono text-[11px] text-ink-3">{formatSource(color.source)}</span>
    </div>
  );
}

function SwatchRampCard({
  name,
  ramp,
  shades,
}: {
  name: RampName;
  ramp: RuntimeRamp;
  shades: Shade[];
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-[13px] font-medium capitalize text-ink">{displayRampName(name)}</h3>
        <span className="font-mono text-[11px] text-ink-3">{ramp[600].hex}</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${shades.length}, minmax(0, 1fr))` }}>
        {shades.map((shade) => (
          <div key={shade}>
            <div className="h-24" style={{ backgroundColor: ramp[shade].hex }} />
            <div className="border-t border-line bg-canvas px-2 py-2">
              <div className="font-mono text-[10px] text-ink-3">{shade}</div>
              <div className="mt-1 truncate font-mono text-[10px] text-ink-2">{ramp[shade].hex}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function displayRampName(name: RampName) {
  const labels = {
    neutral: 'Neutral gray',
    accent: 'Primary',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    lime: 'Secondary 1',
    pink: 'Secondary 2',
    yellow: 'Secondary 3',
    cyan: 'Secondary 4',
  } satisfies Record<RampName, string>;

  return labels[name];
}

function formatSource(source: GeneratedOklchTheme['semantic']['light'][string]['source']) {
  if ('value' in source) return source.value;
  if ('mode' in source) return `contrast(${source.background})`;
  return `${displayRampName(source.ramp)}.${source.shade}`;
}


function SemanticSample({
  title,
  values,
  colors,
}: {
  title: string;
  values: string[];
  colors: RuntimeColors;
}) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <h3 className="text-[13px] font-medium text-ink">{title}</h3>
      <div className="mt-3 space-y-2">
        {values.map((name) => (
          <div key={name} className="flex items-center justify-between gap-3">
            <span className="truncate font-mono text-[11px] text-ink-2">{name}</span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-6 rounded border border-line"
                style={{ backgroundColor: pick(colors, name) }}
              />
              <span className="font-mono text-[10px] text-ink-3">{pick(colors, name)}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LedgerPreview({ colors }: { colors: RuntimeColors }) {
  return (
    <PhonePreviewCard colors={colors} title="Ledger app pair">
      <PhoneShell colors={colors}>
        <LedgerHomeScreen colors={colors} />
      </PhoneShell>
      <PhoneShell colors={colors}>
        <LedgerTransactionScreen colors={colors} />
      </PhoneShell>
    </PhonePreviewCard>
  );
}

function LedgerHomeScreen({ colors }: { colors: RuntimeColors }) {
  const [tab, setTab] = useState('week');
  const [nav, setNav] = useState('home');

  return (
    <PhoneContent>
      <PhoneHeader
        colors={colors}
        left={<Avatar label="AB" colors={colors} tone="ink" size={30} />}
        right={
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <IconButton icon={OutlineMagnifyingGlass} colors={colors} label="Search" />
            <IconButton icon={OutlineBell} colors={colors} label="Alerts" />
          </View>
        }
      />

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={phoneMeta(colors)}>Total balance</Text>
          <IconGlyph icon={OutlineArrowUpRight} color={pick(colors, 'textTertiary')} size={13} />
        </View>
        <AnimatedCounter
          text="£12,847.20"
          fontSize={40}
          lineHeight={46}
          color={pick(colors, 'textPrimary')}
          fontFamily={previewFontFamily}
          fontWeight="800"
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Badge tone="success" appearance="soft">↗ £312.40</Badge>
          <Text style={phoneSmall(colors)}>2.4% vs July</Text>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs value={tab} onValueChange={setTab} appearance="segmented" layout="equal">
            <Tabs.Item value="day" label="1D" />
            <Tabs.Item value="week" label="1W" />
            <Tabs.Item value="month" label="1M" />
            <Tabs.Item value="year" label="1Y" />
          </Tabs>
        </View>
        <Sparkline
          data={[22, 21, 22, 25, 28, 34, 33, 39, 42, 49, 55, 57, 64]}
          tone="positive"
          height={92}
          fill
          showEndDot
          accessibilityLabel="Balance trending upward"
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MetricTile label="In" value="£3,410.00" color={pick(colors, 'chartPositive')} colors={colors} />
        <MetricTile label="Out" value="£1,986.80" color={pick(colors, 'chartNegative')} colors={colors} />
      </View>

      <Card radius="2xl" padding="none">
        <List density="compact">
          <List.Row title="Spotify" subtitle="Today · Subscriptions" value="-£10.99" valueTone="negative" leading={<Avatar label="S" colors={colors} tone="two" />} />
          <List.Row title="Transfer in" subtitle="Yesterday · Savings pot" value="+£450.00" valueTone="positive" leading={<Avatar label="↔" colors={colors} tone="info" />} />
          <List.Row title="Northlight Ltd" subtitle="27 Aug · Housing" value="-£184.20" valueTone="negative" leading={<Avatar label="N" colors={colors} tone="warning" />} />
        </List>
      </Card>

      <View style={{ marginTop: 'auto' }}>
        <TabBar value={nav} onValueChange={setNav} width="floating" surface="filled" selection="jelly" showLabels>
          <TabBar.Item value="home" label="Home" icon={(props) => <IconGlyph icon={OutlineHouse} {...props} />} />
          <TabBar.Item value="spend" label="Spend" icon={(props) => <IconGlyph icon={OutlineChartBar} {...props} />} />
          <TabBar.Item value="cards" label="Cards" icon={(props) => <IconGlyph icon={OutlineCards} {...props} />} />
          <TabBar.Item value="you" label="You" icon={(props) => <IconGlyph icon={OutlineUser} {...props} />} />
        </TabBar>
      </View>
    </PhoneContent>
  );
}

function LedgerTransactionScreen({ colors }: { colors: RuntimeColors }) {
  return (
    <PhoneContent>
      <PhoneHeader
        colors={colors}
        left={<IconButton icon={OutlineArrowLeft} colors={colors} label="Back" />}
        right={<IconButton icon={OutlineDotsThree} colors={colors} label="More" />}
      />

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar label="N" colors={colors} tone="warning" size={44} />
          <View>
            <Text style={phoneCardTitle(colors)}>Northlight Ltd</Text>
            <Text style={phoneSmall(colors)}>27 Aug 2026 · 14:02</Text>
          </View>
        </View>
        <Text style={phoneHero(colors)}>−£184.20</Text>
        <Badge tone="warning" appearance="soft" dot>Pending · authorised</Badge>
      </View>

      <Card radius="2xl" padding="none">
        <View style={{ padding: 14, flexDirection: 'row', gap: 10 }}>
          <IconGlyph icon={OutlineReceipt} color={pick(colors, 'feedbackInfo')} size={18} />
          <Text style={[phoneSmall(colors), { flex: 1 }]}>
            Funds are held until the merchant settles. This usually takes three working days.
          </Text>
        </View>
      </Card>

      <Card radius="2xl" padding="none">
        <List density="compact">
          <List.Row title="Paid with" value="Arlo card · 4419" leading={<IconGlyph icon={OutlineCreditCard} color={pick(colors, 'textSecondary')} size={18} />} />
          <List.Row title="Category" value="Housing" trailing={<Badge tone="warning" appearance="soft" dot>Home</Badge>} />
          <List.Row title="Reference" value="NL-2026-08-4471" />
        </List>
      </Card>

      <Card radius="2xl" padding="lg">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={phoneCardTitle(colors)}>Housing this month</Text>
          <Text style={phoneSmall(colors)}>£1,424.20</Text>
        </View>
        <StackedBar
          colors={[
            pick(colors, 'chartSeries4'),
            pick(colors, 'chartSeries1'),
            pick(colors, 'chartSeries2'),
            pick(colors, 'chartSeries3'),
          ]}
        />
        <View style={{ gap: 8 }}>
          <BudgetRow label="Rent" value="£655.00" color={pick(colors, 'chartSeries4')} colors={colors} />
          <BudgetRow label="Utilities" value="£342.00" color={pick(colors, 'chartSeries1')} colors={colors} />
          <BudgetRow label="Council tax" value="£256.20" color={pick(colors, 'chartSeries2')} colors={colors} />
          <BudgetRow label="Insurance" value="£171.00" color={pick(colors, 'chartSeries3')} colors={colors} />
        </View>
      </Card>

      <View style={{ marginTop: 'auto', flexDirection: 'row', gap: 10 }}>
        <Button tone="neutral" appearance="soft" fullWidth={false}>Get help</Button>
        <Button leadingIcon={<IconGlyph icon={OutlinePlus} color={pick(colors, 'textInteractivePrimary')} size={18} />}>Split bill</Button>
      </View>
    </PhoneContent>
  );
}

function LoopPreview({ colors }: { colors: RuntimeColors }) {
  return (
    <PhonePreviewCard colors={colors} title="Loop task app pair">
      <PhoneShell colors={colors}>
        <LoopTodayScreen colors={colors} />
      </PhoneShell>
      <PhoneShell colors={colors}>
        <LoopNewTaskScreen colors={colors} />
      </PhoneShell>
    </PhonePreviewCard>
  );
}

function LoopTodayScreen({ colors }: { colors: RuntimeColors }) {
  const [focus, setFocus] = useState(true);
  const [nav, setNav] = useState('today');

  return (
    <PhoneContent>
      <PhoneHeader
        colors={colors}
        left={<View />}
        right={<Avatar label="AB" colors={colors} tone="primary" size={32} />}
      />

      <View style={{ gap: 4 }}>
        <Text style={phoneTitle(colors)}>Today</Text>
        <Text style={phoneSmall(colors)}>Saturday, 29 August</Text>
      </View>

      <View
        style={{
          gap: 14,
          borderRadius: 26,
          backgroundColor: pick(colors, 'interactivePrimary'),
          padding: 18,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={phoneOnAccentMeta(colors)}>Nearly there</Text>
            <Text style={phoneOnAccentHero(colors)}>4 of 9 done</Text>
          </View>
          <AnimatedIcon
            name="star-fill"
            active
            color={pick(colors, 'textInteractivePrimary')}
            size={26}
            accessibilityLabel="Progress celebration"
          />
        </View>
        <MeterTrack value="44%" color={pick(colors, 'textInteractivePrimary')} track="rgba(0,0,0,0.18)" />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="neutral" appearance="solid">All</Badge>
        <Badge tone="info" appearance="soft" dot>Work</Badge>
        <Badge tone="success" appearance="soft" dot>Home</Badge>
        <Badge tone="error" appearance="soft" dot>Health</Badge>
      </View>

      <Card radius="2xl" padding="none">
        <List density="comfortable">
          <List.Row title="Send the Q3 invoice" subtitle="Work · done 09:12" leading={<Checkbox checked onCheckedChange={() => {}} accessibilityLabel="Q3 invoice done" />} trailing={<Badge tone="success" appearance="soft">Done</Badge>} />
          <List.Row title="Ship the colour audit" subtitle="Work · overdue" leading={<Checkbox checked={false} onCheckedChange={() => {}} accessibilityLabel="Ship colour audit todo" />} trailing={<IconGlyph icon={OutlineFlag} color={pick(colors, 'feedbackError')} size={18} />} />
          <List.Row title="Book the dentist" subtitle="Health · 14:30" leading={<Checkbox checked={false} onCheckedChange={() => {}} accessibilityLabel="Book dentist todo" />} trailing={<IconGlyph icon={OutlineBell} color={pick(colors, 'textTertiary')} size={18} />} />
          <List.Row title="Water the plants" subtitle="Home · every 3 days" leading={<Checkbox checked={false} onCheckedChange={() => {}} accessibilityLabel="Water plants todo" />} trailing={<AnimatedIcon name="arrow-right-down" active color={pick(colors, 'textTertiary')} size={18} accessibilityLabel="Repeating task" />} />
        </List>
      </Card>

      <Card surface="elevated" radius="2xl" padding="lg">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={phoneCardTitle(colors)}>Deep work mode</Text>
            <Text style={phoneSmall(colors)}>Silence non-urgent notifications.</Text>
          </View>
          <Toggle value={focus} onValueChange={setFocus} accessibilityLabel="Deep work mode" />
        </View>
      </Card>

      <View style={{ marginTop: 'auto' }}>
        <TabBar value={nav} onValueChange={setNav} width="floating" surface="filled" selection="jelly" showLabels>
          <TabBar.Item value="today" label="Today" icon={(props) => <IconGlyph icon={OutlineListChecks} {...props} />} />
          <TabBar.Item value="upcoming" label="Next" icon={(props) => <IconGlyph icon={OutlineCalendarBlank} {...props} />} />
          <TabBar.Item value="stats" label="Stats" icon={(props) => <IconGlyph icon={OutlineChartBar} {...props} />} />
          <TabBar.Item value="you" label="You" icon={(props) => <IconGlyph icon={OutlineUser} {...props} />} />
        </TabBar>
      </View>
    </PhoneContent>
  );
}

function LoopNewTaskScreen({ colors }: { colors: RuntimeColors }) {
  const [remind, setRemind] = useState(true);
  const [repeat, setRepeat] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ opacity: 0.45 }}>
        <PhoneContent>
          <PhoneHeader colors={colors} left={<View />} right={<Avatar label="AB" colors={colors} tone="primary" size={32} />} />
          <View style={{ gap: 4 }}>
            <Text style={phoneTitle(colors)}>Today</Text>
            <Text style={phoneSmall(colors)}>Saturday, 29 August</Text>
          </View>
          <View
            style={{
              borderRadius: 26,
              backgroundColor: pick(colors, 'interactivePrimary'),
              padding: 18,
            }}
          >
            <Text style={phoneOnAccentMeta(colors)}>Nearly there</Text>
            <Text style={phoneOnAccentHero(colors)}>4 of 9 done</Text>
          </View>
        </PhoneContent>
      </View>

      <View
        style={{
          marginTop: 'auto',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: pick(colors, 'surfaceElevated'),
          paddingHorizontal: 18,
          paddingBottom: 22,
          paddingTop: 10,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 5,
            borderRadius: 999,
            backgroundColor: pick(colors, 'borderPrimary'),
            marginBottom: 18,
          }}
        />
        <View style={{ gap: 14 }}>
          <PhoneHeader
            colors={colors}
            left={<Text style={phoneTitleSmall(colors)}>New task</Text>}
            right={<IconButton icon={OutlinePlus} colors={colors} label="Close" rotate />}
          />
          <Input label="Task" defaultValue="Draft the OKLCH ramp spec" />
          <Input label="Notes" placeholder="Add notes..." />

          <View style={{ gap: 8 }}>
            <Text style={phoneMeta(colors)}>List</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[pick(colors, 'interactivePrimary'), pick(colors, 'chartSeries1'), pick(colors, 'chartSeries2'), pick(colors, 'chartSeries3'), pick(colors, 'chartSeries4')].map((color, index) => (
                <View
                  key={`${color}-${index}`}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    borderWidth: index === 0 ? 3 : 0,
                    borderColor: pick(colors, 'surfaceElevated'),
                    backgroundColor: color,
                  }}
                />
              ))}
            </View>
          </View>

          <Card radius="2xl" padding="none">
            <List density="compact">
              <List.Row title="Remind me" value="09:00" leading={<IconGlyph icon={OutlineBell} color={pick(colors, 'textSecondary')} size={18} />} trailing={<Toggle value={remind} onValueChange={setRemind} />} />
              <List.Row title="Repeat" leading={<AnimatedIcon name="arrow-right-down" active={repeat} color={pick(colors, 'textSecondary')} size={18} accessibilityLabel="Repeat" />} trailing={<Toggle value={repeat} onValueChange={setRepeat} />} />
            </List>
          </Card>

          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="success" appearance="soft" dot>Low</Badge>
            <Badge tone="warning" appearance="outline" dot>Medium</Badge>
            <Badge tone="error" appearance="soft" dot>High</Badge>
          </View>

          <Button size="xl">Add task</Button>
        </View>
      </View>
    </View>
  );
}

function OraPreview({ colors }: { colors: RuntimeColors }) {
  return (
    <PhonePreviewCard colors={colors} title="Ora AI app pair">
      <PhoneShell colors={colors}>
        <OraThreadScreen colors={colors} />
      </PhoneShell>
      <PhoneShell colors={colors}>
        <OraGeneratingScreen colors={colors} />
      </PhoneShell>
    </PhonePreviewCard>
  );
}

function OraThreadScreen({ colors }: { colors: RuntimeColors }) {
  return (
    <PhoneContent>
      <PhoneHeader
        colors={colors}
        left={<IconButton icon={OutlineSidebarSimple} colors={colors} label="Threads" />}
        center={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderWidth: 1,
              borderColor: pick(colors, 'borderSecondary'),
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <IconGlyph icon={OutlineRobot} color={pick(colors, 'interactivePrimary')} size={16} />
            <Text style={phoneSmall(colors)}>Ora 2 Pro</Text>
          </View>
        }
        right={<IconButton icon={OutlinePencilSimple} colors={colors} label="New chat" />}
      />

      <View style={{ gap: 14 }}>
        <MessageBubble colors={colors} align="right">
          Why does my dark mode look heavier than light mode if both use the same ramp?
        </MessageBubble>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AnimatedIcon name="dot-pulse" active color={pick(colors, 'interactivePrimary')} size={18} accessibilityLabel="Thinking" />
          <Text style={phoneSmall(colors)}>Ora 2 Pro · thought for 2.4s</Text>
        </View>
        <Text style={phoneBody(colors)}>
          Because a shared ramp is not the same as a shared relationship. Your light surfaces sit
          close together; dark mode needs measured separation, not hand-picked hexes.
        </Text>
      </View>

      <Card radius="2xl" padding="lg">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={phoneMono(colors)}>tokens.ts</Text>
          <AnimatedIcon name="copy-check" active color={pick(colors, 'textSecondary')} size={18} accessibilityLabel="Copy snippet" />
        </View>
        <View style={{ marginTop: 12, gap: 5 }}>
          <Text style={phoneMono(colors)}>light.bg → card ΔL 0.02</Text>
          <Text style={phoneMono(colors)}>dark.bg → card ΔL 0.10</Text>
          <Text style={[phoneMono(colors), { color: pick(colors, 'feedbackError') }]}>ratio 5.0 — over tolerance</Text>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="info" appearance="soft">oklch.com</Badge>
        <Badge tone="neutral" appearance="soft">css-color-4</Badge>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <ComposerBar colors={colors} value="Reply to Ora..." sending={false} />
      </View>
    </PhoneContent>
  );
}

function OraGeneratingScreen({ colors }: { colors: RuntimeColors }) {
  return (
    <PhoneContent>
      <PhoneHeader
        colors={colors}
        left={<IconButton icon={OutlineSidebarSimple} colors={colors} label="Threads" />}
        center={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderWidth: 1,
              borderColor: pick(colors, 'borderSecondary'),
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <IconGlyph icon={OutlineRobot} color={pick(colors, 'interactivePrimary')} size={16} />
            <Text style={phoneSmall(colors)}>Ora 2 Pro</Text>
          </View>
        }
        right={<IconButton icon={OutlinePencilSimple} colors={colors} label="New chat" />}
      />

      <MessageBubble colors={colors} align="right">
        Audit my ramp specs and tell me which pairs need review.
      </MessageBubble>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AnimatedIcon name="dot-pulse" active color={pick(colors, 'interactivePrimary')} size={18} accessibilityLabel="Ora is working" />
        <Text style={phoneSmall(colors)}>Ora 2 Pro</Text>
      </View>

      <View style={{ gap: 10 }}>
        <ToolRunRow colors={colors} icon="spinner" title="Reading oklchTheme.ts" value="1.2s" />
        <ToolRunRow colors={colors} icon="check" title="Ran 46 surface audits" value="0.4s" />
      </View>

      <Card radius="2xl" padding="lg">
        <SkeletonLine colors={colors} width="42%" />
        <SkeletonLine colors={colors} width="100%" />
        <SkeletonLine colors={colors} width="82%" />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <PromptChip colors={colors} icon={OutlineFileTsx} label="Explain recipe" />
        <PromptChip colors={colors} icon={OutlineChartBar} label="Show deltas" />
      </View>

      <View style={{ marginTop: 'auto' }}>
        <ComposerBar colors={colors} value="Ora is replying..." sending />
      </View>
    </PhoneContent>
  );
}

function PhonePreviewCard({
  colors,
  title,
  children,
}: {
  colors: RuntimeColors;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-[28px] border p-3 sm:p-4"
      style={{
        backgroundColor: pick(colors, 'surfaceCard'),
        borderColor: pick(colors, 'borderSecondary'),
      }}
    >
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
        {title}
      </div>
      <div className="flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}

function PhoneShell({ colors, children }: { colors: RuntimeColors; children: ReactNode }) {
  return (
    <div
      className="w-full max-w-[342px] overflow-hidden rounded-[42px] border shadow-xl"
      style={{
        aspectRatio: '390 / 844',
        backgroundColor: pick(colors, 'surfaceBackground'),
        borderColor: pick(colors, 'borderPrimary'),
      }}
    >
      <View style={{ height: '100%', backgroundColor: pick(colors, 'surfaceBackground') }}>
        <PhoneStatus colors={colors} />
        {children}
      </View>
    </div>
  );
}

function PhoneStatus({ colors }: { colors: RuntimeColors }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 26, paddingTop: 16 }}>
      <Text style={phoneStatus(colors)}>9:41</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={phoneStatus(colors)}>5G</Text>
        <View
          style={{
            width: 20,
            height: 10,
            borderWidth: 1,
            borderColor: pick(colors, 'textSecondary'),
            borderRadius: 3,
            padding: 1,
          }}
        >
          <View
            style={{
              width: 13,
              height: '100%',
              borderRadius: 2,
              backgroundColor: pick(colors, 'textSecondary'),
            }}
          />
        </View>
      </View>
    </View>
  );
}

function PhoneContent({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1, gap: 16, paddingHorizontal: 18, paddingBottom: 16, paddingTop: 22 }}>
      {children}
    </View>
  );
}

function PhoneHeader({
  left,
  center,
  right,
}: {
  colors: RuntimeColors;
  left: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <View style={{ minHeight: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ minWidth: 48, alignItems: 'flex-start' }}>{left}</View>
      {center ? <View style={{ flex: 1, alignItems: 'center' }}>{center}</View> : null}
      <View style={{ minWidth: 48, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

type IconComponent = ComponentType<{
  color?: string;
  width?: number;
  height?: number;
}>;

function IconGlyph({
  icon: Icon,
  color,
  size,
}: {
  icon: IconComponent;
  color: string;
  size: number;
}) {
  return <Icon color={color} width={size} height={size} />;
}

function IconButton({
  icon,
  colors,
  label,
  rotate = false,
}: {
  icon: IconComponent;
  colors: RuntimeColors;
  label: string;
  rotate?: boolean;
}) {
  return (
    <View
      accessibilityLabel={label}
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pick(colors, 'surfaceInput'),
        transform: rotate ? [{ rotate: '45deg' }] : undefined,
      }}
    >
      <IconGlyph icon={icon} color={pick(colors, 'textSecondary')} size={18} />
    </View>
  );
}

function Avatar({
  label,
  colors,
  tone,
  size = 36,
}: {
  label: string;
  colors: RuntimeColors;
  tone: 'primary' | 'info' | 'warning' | 'one' | 'two' | 'success' | 'ink';
  size?: number;
}) {
  const palette = avatarPalette(colors, tone);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.bg,
      }}
    >
      <Text
        style={{
          color: palette.fg,
          fontFamily: previewFontFamily,
          fontSize: size > 40 ? 15 : 12,
          fontWeight: '800',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function avatarPalette(
  colors: RuntimeColors,
  tone: 'primary' | 'info' | 'warning' | 'one' | 'two' | 'success' | 'ink',
) {
  if (tone === 'primary') {
    return { bg: pick(colors, 'interactivePrimary'), fg: pick(colors, 'textInteractivePrimary') };
  }
  if (tone === 'success') {
    return { bg: pick(colors, 'feedbackSuccessBg'), fg: pick(colors, 'feedbackSuccess') };
  }
  if (tone === 'warning') {
    return { bg: pick(colors, 'feedbackWarningBg'), fg: pick(colors, 'feedbackWarning') };
  }
  if (tone === 'info' || tone === 'one') {
    return { bg: pick(colors, 'feedbackInfoBg'), fg: pick(colors, 'feedbackInfo') };
  }
  if (tone === 'two') {
    return { bg: pick(colors, 'feedbackErrorBg'), fg: pick(colors, 'feedbackError') };
  }
  return { bg: pick(colors, 'surfaceInverse'), fg: pick(colors, 'textInverse') };
}

function MetricTile({
  label,
  value,
  color,
  colors,
}: {
  label: string;
  value: string;
  color: string;
  colors: RuntimeColors;
}) {
  return (
    <Card radius="xl" padding="md" style={{ flex: 1 }}>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
          <Text style={phoneMeta(colors)}>{label}</Text>
        </View>
        <Text style={phoneCardNumber(colors)}>{value}</Text>
      </View>
    </Card>
  );
}

function StackedBar({ colors }: { colors: string[] }) {
  return (
    <View style={{ height: 10, flexDirection: 'row', gap: 4, marginVertical: 12 }}>
      {colors.map((color, index) => (
        <View
          key={`${color}-${index}`}
          style={{
            flex: [5, 3, 2, 1][index] ?? 1,
            borderRadius: 999,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}

function BudgetRow({
  label,
  value,
  color,
  colors,
}: {
  label: string;
  value: string;
  color: string;
  colors: RuntimeColors;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color, flexShrink: 0 }} />
      <Text style={[phoneSmall(colors), { flex: 1 }]}>{label}</Text>
      <Text style={phoneValue(colors)}>{value}</Text>
    </View>
  );
}

function MeterTrack({ value, color, track }: { value: `${number}%`; color: string; track: string }) {
  return (
    <View style={{ height: 7, overflow: 'hidden', borderRadius: 999, backgroundColor: track }}>
      <View style={{ width: value, height: '100%', borderRadius: 999, backgroundColor: color }} />
    </View>
  );
}

function MessageBubble({
  colors,
  align,
  children,
}: {
  colors: RuntimeColors;
  align: 'left' | 'right';
  children: ReactNode;
}) {
  return (
    <View
      style={{
        maxWidth: '82%',
        alignSelf: align === 'right' ? 'flex-end' : 'flex-start',
        borderRadius: 18,
        backgroundColor: align === 'right' ? pick(colors, 'surfaceInput') : pick(colors, 'surfaceCard'),
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <Text style={phoneBody(colors)}>{children}</Text>
    </View>
  );
}

function ToolRunRow({
  colors,
  icon,
  title,
  value,
}: {
  colors: RuntimeColors;
  icon: 'spinner' | 'check';
  title: string;
  value: string;
}) {
  return (
    <Card radius="xl" padding="md">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <AnimatedIcon
          name="circle-progress-check"
          active={icon === 'check'}
          color={icon === 'check' ? pick(colors, 'feedbackSuccess') : pick(colors, 'interactivePrimary')}
          size={18}
          accessibilityLabel={title}
        />
        <Text style={[phoneSmall(colors), { flex: 1, color: pick(colors, 'textPrimary') }]}>{title}</Text>
        <Text style={phoneSmall(colors)}>{value}</Text>
      </View>
    </Card>
  );
}

function SkeletonLine({
  colors,
  width,
}: {
  colors: RuntimeColors;
  width: `${number}%`;
}) {
  return (
    <View
      style={{
        width,
        height: 10,
        borderRadius: 999,
        backgroundColor: pick(colors, 'surfaceInputActive'),
        marginVertical: 5,
        opacity: 0.5,
      }}
    />
  );
}

function PromptChip({
  colors,
  icon,
  label,
}: {
  colors: RuntimeColors;
  icon: IconComponent;
  label: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        borderWidth: 1,
        borderColor: pick(colors, 'borderSecondary'),
        borderRadius: 999,
        backgroundColor: pick(colors, 'surfaceCard'),
        paddingHorizontal: 11,
        paddingVertical: 8,
      }}
    >
      <IconGlyph icon={icon} color={pick(colors, 'textSecondary')} size={15} />
      <Text style={phoneSmall(colors)}>{label}</Text>
    </View>
  );
}

function ComposerBar({
  colors,
  value,
  sending,
}: {
  colors: RuntimeColors;
  value: string;
  sending: boolean;
}) {
  return (
    <View
      style={{
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: pick(colors, 'borderSecondary'),
        borderRadius: 999,
        backgroundColor: pick(colors, 'surfaceElevated'),
        paddingHorizontal: 12,
      }}
    >
      <IconGlyph icon={OutlinePlus} color={pick(colors, 'textTertiary')} size={18} />
      <Text style={[phoneSmall(colors), { flex: 1 }]}>{value}</Text>
      <IconGlyph icon={OutlineMicrophone} color={pick(colors, 'textTertiary')} size={18} />
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pick(colors, 'interactivePrimary'),
        }}
      >
        {sending ? (
          <AnimatedIcon name="spinner-x" active={false} color={pick(colors, 'textInteractivePrimary')} size={18} accessibilityLabel="Sending" />
        ) : (
          <IconGlyph icon={OutlinePaperPlaneRight} color={pick(colors, 'textInteractivePrimary')} size={18} />
        )}
      </View>
    </View>
  );
}

function buildRampSpecs({
  neutralChroma,
  surfaceDepth,
  primary,
  status,
  secondary,
}: {
  neutralChroma: number;
  surfaceDepth: number;
  primary: ColorControl;
  status: LabControls['status'];
  secondary: LabControls['secondary'];
}) {
  const neutralLightness = {
    ...arloOklchRampSpecs.neutral.lightness,
    100: stepFromLightCeiling(0.985, 0.02, surfaceDepth),
    200: stepFromLightCeiling(0.985, 0.06, surfaceDepth),
    800: stepFromDarkFloor(0.14, 0.13, surfaceDepth),
    900: stepFromDarkFloor(0.14, 0.055, surfaceDepth),
  } satisfies Record<Shade, number>;

  return {
    neutral: {
      ...arloOklchRampSpecs.neutral,
      hue: 0,
      lightness: neutralLightness,
      chroma: scaleChroma(arloOklchRampSpecs.neutral.chroma, neutralChroma),
    },
    accent: rampSpecFromColor('accent', primary),
    success: rampSpecFromColor('success', status.success),
    warning: rampSpecFromColor('warning', status.warning),
    error: rampSpecFromColor('error', status.error),
    lime: rampSpecFromColor('lime', secondary.one, secondary.chartShift),
    pink: rampSpecFromColor('pink', secondary.two, secondary.chartShift),
    yellow: rampSpecFromColor('yellow', secondary.three, secondary.chartShift),
    cyan: rampSpecFromColor('cyan', secondary.four, secondary.chartShift),
  } satisfies Record<RampName, OklchRampSpec>;
}

function rampSpecFromColor(
  name: Exclude<RampName, 'neutral'>,
  control: ColorControl,
  hueShift = 0,
): OklchRampSpec {
  const source = safeHexToOklch(control.color);
  const base = arloOklchRampSpecs[name];
  const baseChroma = createOklchRamp(base)[600].c;
  const sourceMultiplier = source.c > 0 && baseChroma > 0 ? clamp(source.c / baseChroma, 0.45, 1.55) : 1;

  return {
    ...base,
    hue: source.h + hueShift,
    chroma: scaleChroma(base.chroma, control.chroma * sourceMultiplier),
  };
}

function makeRegistryTheme(generated: GeneratedOklchTheme, scheme: 'light' | 'dark'): RegistryTheme {
  const base = registryThemes[scheme];
  return {
    ...base,
    name: scheme,
    fontFamilies: {
      ...base.fontFamilies,
      display: previewFontFamily,
      sans: previewFontFamily,
    },
    colors: {
      ...base.colors,
      ...generated.colors[scheme],
    },
  };
}

function controlsFromDialValues(values: DialValues): LabControls {
  return {
    preview: {
      screen: toPreviewKind(values.preview?.screen),
    },
    neutral: {
      chroma: numberOr(values.neutral?.tintAmount, 0),
      surfaceDepth: numberOr(values.neutral?.surfaceDepth, 1),
    },
    primary: makeColorControl(values.primary?.color, values.primary?.vividness, '#225BB9'),
    status: {
      success: makeColorControl(values.status?.successColor, values.status?.successVividness, '#009342'),
      warning: makeColorControl(values.status?.warningColor, values.status?.warningVividness, '#805800'),
      error: makeColorControl(values.status?.errorColor, values.status?.errorVividness, '#CF413D'),
    },
    secondary: {
      chartShift: numberOr(values.secondary?.chartShift, 0),
      one: makeColorControl(values.secondary?.oneColor, values.secondary?.oneVividness, '#4B6D00'),
      two: makeColorControl(values.secondary?.twoColor, values.secondary?.twoVividness, '#A42665'),
      three: makeColorControl(values.secondary?.threeColor, values.secondary?.threeVividness, '#755E00'),
      four: makeColorControl(values.secondary?.fourColor, values.secondary?.fourVividness, '#00707C'),
    },
  };
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toPreviewKind(value: unknown): PreviewKind {
  if (value === 'finance') return 'ledger';
  if (value === 'todo' || value === 'sheet') return 'loop';
  if (value === 'stress') return 'ledger';
  return value === 'swatches' || value === 'ledger' || value === 'loop' || value === 'ora'
    ? value
    : 'ledger';
}

function makeColorControl(color: unknown, chroma: unknown, fallback: string): ColorControl {
  return {
    color: normalizeDialColor(color, fallback),
    chroma: numberOr(chroma, 1),
  };
}

function safeHexToOklch(hex: string) {
  try {
    return hexToOklch(hex);
  } catch {
    return hexToOklch('#225BB9');
  }
}

function normalizeDialColor(value: unknown, fallback: string) {
  const fallbackHex = normalizeHex(fallback) ?? '#225BB9';
  if (typeof value !== 'string') return fallbackHex;
  const normalized = normalizeHex(value);
  if (normalized) return normalized;

  const rgb = parseRgbString(value);
  if (rgb) {
    return `#${componentToHex(rgb.r)}${componentToHex(rgb.g)}${componentToHex(rgb.b)}`;
  }

  const oklch = parseOklchString(value);
  if (oklch) return oklchToHex(oklch);

  const displayP3 = parseDisplayP3String(value);
  if (displayP3) {
    return `#${componentToHex(displayP3.r)}${componentToHex(displayP3.g)}${componentToHex(displayP3.b)}`;
  }

  return fallbackHex;
}

function normalizeHex(value: unknown) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(normalized)) {
    const [, r, g, b] = normalized;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) return normalized.toUpperCase();
  if (/^#[0-9a-fA-F]{8}$/.test(normalized)) return normalized.slice(0, 7).toUpperCase();
  return null;
}

function parseRgbString(value: string) {
  const match = value.trim().match(/^rgba?\((.+)\)$/i);
  if (!match) return null;
  const parts = match[1]
    .replace(/\//g, ' ')
    .split(/[,\s]+/)
    .filter(Boolean)
    .slice(0, 3);
  if (parts.length !== 3) return null;
  const channels = parts.map((part) => parseChannel(part));
  if (channels.some((channel) => channel == null)) return null;
  return {
    r: channels[0] as number,
    g: channels[1] as number,
    b: channels[2] as number,
  };
}

function parseOklchString(value: string) {
  const match = value
    .trim()
    .match(/^oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+(-?[0-9.]+)(?:deg)?(?:\s*\/\s*[0-9.]+%?)?\s*\)$/i);
  if (!match) return null;
  const l = match[1].endsWith('%') ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);
  if (![l, c, h].every(Number.isFinite)) return null;
  return {
    l: clamp(l > 1 ? l / 100 : l, 0, 1),
    c: Math.max(0, c),
    h,
  };
}

function parseDisplayP3String(value: string) {
  const match = value.trim().match(/^color\(\s*display-p3\s+(.+)\)$/i);
  if (!match) return null;
  const parts = match[1]
    .replace(/\//g, ' ')
    .split(/[,\s]+/)
    .filter(Boolean)
    .slice(0, 3);
  if (parts.length !== 3) return null;
  const channels = parts.map((part) => {
    const parsed = part.endsWith('%') ? parseFloat(part) / 100 : parseFloat(part);
    return Number.isFinite(parsed) ? Math.round(clamp(parsed, 0, 1) * 255) : null;
  });
  if (channels.some((channel) => channel == null)) return null;
  return {
    r: channels[0] as number,
    g: channels[1] as number,
    b: channels[2] as number,
  };
}

function parseChannel(value: string) {
  const parsed = value.endsWith('%') ? (parseFloat(value) / 100) * 255 : parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(clamp(parsed, 0, 255)) : null;
}

function componentToHex(value: number) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0').toUpperCase();
}

function scaleChroma(
  chroma: ChromaRampSpec,
  multiplier: number,
): ChromaRampSpec {
  const values = 'mode' in chroma ? chroma.values : chroma;
  const scaled = Object.fromEntries(
    shadeSteps.map((shade) => [shade, Number((values[shade] * multiplier).toFixed(4))]),
  ) as Record<Shade, number>;

  if (!('mode' in chroma)) return scaled;

  const absolute = chroma.absolute
    ? (Object.fromEntries(
        Object.entries(chroma.absolute).map(([shade, value]) => [
          Number(shade),
          Number((value * multiplier).toFixed(4)),
        ]),
      ) as Partial<Record<Shade, number>>)
    : undefined;

  return absolute ? { ...chroma, values: scaled, absolute } : { ...chroma, values: scaled };
}

function stepFromLightCeiling(lightCeiling: number, distance: number, surfaceDepth: number) {
  return clamp(lightCeiling - distance * surfaceDepth, 0, 1);
}

function stepFromDarkFloor(darkFloor: number, distance: number, surfaceDepth: number) {
  return clamp(darkFloor + distance * surfaceDepth, 0, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pick(colors: RuntimeColors, name: string) {
  const value = colors[name];
  if (!value) throw new Error(`Missing runtime color "${name}".`);
  return value;
}

function phoneStatus(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textSecondary'),
    fontFamily: previewFontFamily,
    fontSize: 12,
    fontWeight: '600',
  };
}

function phoneMeta(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textSecondary'),
    fontFamily: previewFontFamily,
    fontSize: 13,
    fontWeight: '700',
  };
}

function phoneHero(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textPrimary'),
    fontFamily: previewFontFamily,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
  };
}

function phoneTitle(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textPrimary'),
    fontFamily: previewFontFamily,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  };
}

function phoneCardTitle(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textPrimary'),
    fontFamily: previewFontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  };
}

function phoneSmall(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textSecondary'),
    fontFamily: previewFontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  };
}

function phoneTitleSmall(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textPrimary'),
    fontFamily: previewFontFamily,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  };
}

function phoneCardNumber(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textPrimary'),
    fontFamily: previewFontFamily,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
  };
}

function phoneValue(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textPrimary'),
    fontFamily: previewFontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  };
}

function phoneBody(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textPrimary'),
    fontFamily: previewFontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  };
}

function phoneMono(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textSecondary'),
    fontFamily: 'Space Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '500',
  };
}

function phoneOnAccentMeta(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textInteractivePrimary'),
    fontFamily: previewFontFamily,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    opacity: 0.72,
  };
}

function phoneOnAccentHero(colors: RuntimeColors): TextStyle {
  return {
    color: pick(colors, 'textInteractivePrimary'),
    fontFamily: previewFontFamily,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  };
}
