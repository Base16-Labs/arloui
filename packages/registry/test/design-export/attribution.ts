/**
 * Recovering *which token* produced a rendered value.
 *
 * The naive approach — index every token by value and look the value up — is
 * unsound, and quietly so. `interactivePrimary` and `textInteractiveTertiary`
 * are both `#155DFC`, so a lookup for the Tabs selection pill returns a *text*
 * token for a *background*. It renders correctly and validates clean, then
 * breaks the moment someone re-themes, which is the one moment it mattered.
 * Measured against `tabs.tsx`, three of five inferred bindings were wrong.
 *
 * So colours are not inferred, they are *observed*. Each variant renders twice:
 * once against the real theme, once against a probe theme where every colour is
 * replaced by a unique sentinel. The two trees are structurally identical —
 * colour cannot affect layout — so zipping them yields an exact
 * value → token-path map with no collisions and no role guessing.
 *
 * Numbers are still reverse-mapped, deliberately. Sentinel numbers *would*
 * change layout and desynchronise the trees, and the ambiguity there is far
 * lower: the property tells you which scale to consult (`padding` → spacing,
 * `borderRadius` → radii), and values are unique within a scale. Typography
 * sizes are the one place this stays ambiguous — `20` is `headingLarge`,
 * `title2` and `buttonLarge` — so those are reported with `ambiguous: true`
 * rather than silently picking one.
 */

/** A sentinel colour per token path: #1_00000 upward, never a real palette value. */
export function makeColorProbe(colors: Record<string, string>): {
  probe: Record<string, string>;
  bySentinel: Map<string, string>;
} {
  const probe: Record<string, string> = {};
  const bySentinel = new Map<string, string>();
  let i = 1;
  for (const key of Object.keys(colors)) {
    const sentinel = '#' + (0x100000 + i).toString(16).toUpperCase().slice(-6);
    probe[key] = sentinel;
    bySentinel.set(sentinel.toUpperCase(), key);
    i++;
  }
  return { probe, bySentinel };
}

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Figma group for a semantic colour. Mirrors `scripts/sync-design.ts` — both
 * have to agree or a binding will point at a variable that does not exist.
 */
const FIGMA_GROUPS: Array<[RegExp, string]> = [
  [/^(surface|bg)/, 'Surfaces & Backgrounds'],
  [/^text/, 'Text & Content'],
  [/^(interactive|focusRing|touchFeedback|accent)/, 'Interactive Elements'],
  [/^border/, 'Borders & Dividers'],
  [/^(feedback|success|warning|danger)/, 'Feedback States'],
  [/^nav/, 'Navigation & UI Chrome'],
  [/^pull/, 'Gestures'],
];

const FIGMA_LEAF: Record<string, string> = {
  focusRingMain: 'Focus-ring-main',
  focusRingError: 'Focus-ring-error',
};

export function colorTokenNames(key: string): { paper: string; figma: string } | null {
  const hit = FIGMA_GROUPS.find(([re]) => re.test(key));
  if (!hit) return null;
  return {
    paper: `--color-${kebab(key)}`,
    figma: `${hit[1]}/${FIGMA_LEAF[key] ?? kebab(key)}`,
  };
}

export type Attribution = {
  paper?: string;
  figma?: string;
  /** No token carries this value — it is hardcoded in the component. */
  hardcoded?: boolean;
};

/** Figma group + leaf naming for the sizing scales, mirroring sync-design.ts. */
const SIZING_GROUP: Record<string, [string, string]> = {
  icon: ['Icons', 'icon'],
  avatar: ['Avatars', 'avatar'],
  buttonHeight: ['Button Heights', 'button'],
  touchTarget: ['Touch Targets', 'touch-target'],
};

/**
 * Perturb every numeric token by a unique sub-pixel epsilon.
 *
 * Numbers cannot take sentinel *values* the way colours can — a spacing of
 * 900001 would wreck layout and desynchronise the probe tree from the real one.
 * But they can take a unique sub-pixel offset: 12 becomes 12.0007, which is
 * visually and structurally inert yet exactly identifiable on the way back out.
 * That buys the same exactness for spacing, radii, sizing and type that the
 * colour sentinels buy, so anything the code tokenises can be bound rather than
 * inferred — including the sizing scales, which were previously refused because
 * value-matching bound Tabs' 52px minimum to `buttonHeight.xl` by coincidence.
 *
 * A value derived from a token (`spacing[2] / 2`) carries a fractional epsilon
 * that matches nothing, so it is reported `hardcoded`. That is the honest
 * answer: it is not the token, it is arithmetic on it.
 */
export function makeNumericProbe(raw: {
  spacing: Record<string, number>;
  radii: Record<string, number>;
  sizing: Record<string, Record<string, number>>;
  typography: Record<string, { fontSize: number; lineHeight: number; letterSpacing?: number }>;
}) {
  const EPS = 1e-4;
  let i = 1;
  const byProbe = new Map<number, Attribution>();

  const spacing: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw.spacing)) {
    const p = v + i * EPS;
    spacing[k] = p;
    byProbe.set(p, { paper: `--spacing-${k}`, figma: `space-${k}` });
    i++;
  }

  const radii: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw.radii)) {
    const p = v + i * EPS;
    radii[k] = p;
    byProbe.set(p, { paper: `--radius-${k}`, figma: `radius-${k}` });
    i++;
  }

  const sizing: Record<string, Record<string, number>> = {};
  for (const [group, scale] of Object.entries(raw.sizing)) {
    sizing[group] = {};
    const [figmaGroup, leaf] = SIZING_GROUP[group] ?? [group, group];
    for (const [k, v] of Object.entries(scale)) {
      const p = v + i * EPS;
      sizing[group][k] = p;
      byProbe.set(p, { figma: `${figmaGroup}/${leaf}-${kebab(k)}` });
      i++;
    }
  }

  const typography: Record<string, unknown> = {};
  for (const [name, spec] of Object.entries(raw.typography)) {
    const leaf = kebab(name);
    const fontSize = spec.fontSize + i * EPS;
    byProbe.set(fontSize, { paper: `--text-${leaf}`, figma: `Font Size/${leaf}` });
    i++;
    const lineHeight = spec.lineHeight + i * EPS;
    byProbe.set(lineHeight, { paper: `--leading-${leaf}`, figma: `Line Height/${leaf}` });
    i++;
    typography[name] = { ...spec, fontSize, lineHeight };
  }

  return { probe: { spacing, radii, sizing, typography }, byProbe };
}
