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

/** Numeric scales, scoped by the style property they can legitimately serve. */
export function buildNumericIndex(raw: {
  spacing: Record<string, number>;
  radii: Record<string, number>;
  sizing: Record<string, Record<string, number>>;
  typography: Record<string, { fontSize: number; lineHeight: number }>;
}) {
  const spacing = new Map<number, string>();
  for (const [k, v] of Object.entries(raw.spacing)) if (!spacing.has(v)) spacing.set(v, k);

  const radii = new Map<number, string>();
  for (const [k, v] of Object.entries(raw.radii)) if (!radii.has(v)) radii.set(v, k);

  const sizing = new Map<number, string>();
  for (const [group, scale] of Object.entries(raw.sizing)) {
    for (const [k, v] of Object.entries(scale)) if (!sizing.has(v)) sizing.set(v, `${group}.${k}`);
  }

  // Deliberately many-valued: several type ramp entries share a size.
  const fontSize = new Map<number, string[]>();
  const lineHeight = new Map<number, string[]>();
  for (const [k, spec] of Object.entries(raw.typography)) {
    if (!fontSize.has(spec.fontSize)) fontSize.set(spec.fontSize, []);
    fontSize.get(spec.fontSize)!.push(k);
    if (!lineHeight.has(spec.lineHeight)) lineHeight.set(spec.lineHeight, []);
    lineHeight.get(spec.lineHeight)!.push(k);
  }

  return { spacing, radii, sizing, fontSize, lineHeight };
}

export type NumericIndex = ReturnType<typeof buildNumericIndex>;

export type Attribution = {
  paper?: string;
  figma?: string;
  /** Several tokens share this value; the first is reported. */
  ambiguous?: boolean;
  /** No token carries this value — it is hardcoded in the component. */
  hardcoded?: boolean;
};

export function attributeNumber(
  property: string,
  value: number,
  idx: NumericIndex,
): Attribution | null {
  if (property.toLowerCase().includes('radius')) {
    const hit = idx.radii.get(value);
    return hit ? { paper: `--radius-${hit}`, figma: `radius-${hit}` } : { hardcoded: true };
  }
  if (/^(padding|margin|gap|rowGap|columnGap)/.test(property)) {
    const hit = idx.spacing.get(value);
    return hit ? { paper: `--spacing-${hit}`, figma: `space-${hit}` } : { hardcoded: true };
  }
  if (property === 'fontSize') {
    const hits = idx.fontSize.get(value);
    if (!hits) return { hardcoded: true };
    return { paper: `--text-${kebab(hits[0])}`, ambiguous: hits.length > 1 };
  }
  if (property === 'lineHeight') {
    const hits = idx.lineHeight.get(value);
    if (!hits) return { hardcoded: true };
    return { paper: `--leading-${kebab(hits[0])}`, ambiguous: hits.length > 1 };
  }
  // Sizing is deliberately NOT attributed. The scales overlap arbitrary layout
  // numbers — Tabs' 52px minimum width matched `buttonHeight.xl` purely by
  // coincidence, which would have bound a tab's width to the button ramp. Same
  // failure mode as inferring colours by value, so the same answer: refuse.
  // Recovering these needs numeric probing, which would perturb layout and
  // desynchronise the trees.
  return null;
}
