/**
 * Turns a rendered component tree from `design/components.json` into a plan of
 * Figma nodes.
 *
 * This is deliberately pure. Every decision that has bitten us lives here —
 * React Native's column-by-default flex axis, folding opacity-animated layers
 * into paints, which style property maps to which bindable Figma field — and
 * none of it can be exercised inside `use_figma`, where the Plugin API only
 * exists at runtime and a mistake shows up as a screenshot that looks a bit
 * wrong. So the planner takes a tree and returns data, the executor walks the
 * plan and calls the API, and the interesting half has fixtures.
 */

/** A node as serialised by the design export. */
export type ExportNode = {
  type: string;
  text?: string;
  style?: Record<string, unknown>;
  tokens?: Record<string, { figma?: string; hardcoded?: boolean }>;
  children?: ExportNode[];
};

/** How a node sits inside its parent. */
export type Placement =
  | { mode: 'flow' }
  /** `flex: 1` — stretches along the parent's main axis. */
  | { mode: 'fill' }
  /** Absolutely positioned; `stretch` mirrors the RN inset that produced it. */
  | { mode: 'absolute'; x: number; y: number; height?: number; stretch: 'both' | 'bottom' };

export type PlanNode = {
  kind: 'frame' | 'text';
  /** Literal properties to assign directly. */
  set: Record<string, unknown>;
  /** Figma variable name per bindable field, already using Figma's field names. */
  bind: Record<string, string>;
  /** Solid fill: a variable name, or a literal CSS colour, or neither. */
  fillBind?: string;
  fill?: string;
  strokeBind?: string;
  stroke?: string;
  text?: string;
  fontStyle?: string;
  placement: Placement;
  children: PlanNode[];
};

/** Manrope ships these weights; anything else would throw on `loadFontAsync`. */
const FONT_STYLE: Record<string, string> = {
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
};

export const fontStyleFor = (weight: unknown): string =>
  FONT_STYLE[String(weight ?? '400')] ?? 'Regular';

/**
 * React Native defaults `flexDirection` to **column**; the web defaults to row.
 * Reading the absence of the property as "row" silently transposes every layer
 * of a column-based component, which is exactly what happened to Sheet.
 */
export const axisFor = (style: Record<string, unknown> = {}): 'HORIZONTAL' | 'VERTICAL' =>
  style.flexDirection === 'row' ? 'HORIZONTAL' : 'VERTICAL';

/**
 * RN style property → the Figma field(s) that accept a bound variable.
 * `paddingHorizontal` has no Figma equivalent, so it fans out to two fields;
 * a uniform `borderRadius` fans out to four corners.
 */
export function bindableFields(property: string): string[] {
  switch (property) {
    case 'paddingHorizontal':
      return ['paddingLeft', 'paddingRight'];
    case 'paddingVertical':
      return ['paddingTop', 'paddingBottom'];
    case 'padding':
      return ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
    case 'gap':
      return ['itemSpacing'];
    case 'borderRadius':
      return ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'];
    case 'borderTopLeftRadius':
      return ['topLeftRadius'];
    case 'borderTopRightRadius':
      return ['topRightRadius'];
    case 'borderBottomLeftRadius':
      return ['bottomLeftRadius'];
    case 'borderBottomRightRadius':
      return ['bottomRightRadius'];
    case 'paddingTop':
    case 'paddingBottom':
    case 'paddingLeft':
    case 'paddingRight':
    case 'minHeight':
    case 'minWidth':
    case 'maxHeight':
    case 'maxWidth':
    case 'width':
    case 'height':
    case 'fontSize':
    case 'lineHeight':
    case 'letterSpacing':
      return [property];
    default:
      return [];
  }
}

const isColourProperty = (k: string) => /color/i.test(k);

/**
 * Shorthands must be applied before the properties that refine them, or object
 * iteration order decides the winner: `{ paddingHorizontal: 12, padding: 4 }`
 * would leave 4 on the sides, where React Native resolves it to 12. Lower rank
 * is applied first.
 */
const SPECIFICITY: Array<[RegExp, number]> = [
  [/^(padding|margin)$/, 0],
  [/^(padding|margin)(Horizontal|Vertical)$/, 1],
  [/^borderRadius$/, 0],
  [/^border(Top|Bottom)(Left|Right)Radius$/, 1],
  [/^borderWidth$/, 0],
  [/^border(Top|Bottom|Left|Right)Width$/, 1],
];

const specificityOf = (property: string): number =>
  SPECIFICITY.find(([re]) => re.test(property))?.[1] ?? 2;

const bySpecificity = (a: [string, unknown], b: [string, unknown]) =>
  specificityOf(a[0]) - specificityOf(b[0]);

/** An absolutely-positioned layer pinned to all four edges. */
const isInsetLayer = (s: Record<string, unknown>) =>
  s.position === 'absolute' && s.top === 0 && s.bottom === 0 && s.left === 0 && s.right === 0;

/**
 * Components express selection as an absolutely-positioned layer whose opacity
 * animates between 0 and 1 — Tabs' filled pill and underline indicator both do
 * this. A Figma variant is a still frame and cannot hold an animation, so the
 * hidden state is dropped and the visible one becomes a paint on its parent.
 * Reproducing the layer literally renders as nothing, because an auto-layout
 * frame with no children hugs to zero.
 */
export function flattenAnimatedLayers(node: ExportNode): ExportNode {
  const children = node.children ?? [];
  if (!children.length) return node;

  let fillFrom: ExportNode | undefined;
  const kept: ExportNode[] = [];

  for (const child of children) {
    const s = child.style ?? {};
    if (isInsetLayer(s)) {
      if (s.opacity === 0) continue; // hidden state of an animation
      fillFrom = child; // visible state — becomes the parent's own paint
      continue;
    }
    kept.push(flattenAnimatedLayers(child));
  }

  if (!fillFrom) return { ...node, children: kept };

  const merged: ExportNode = {
    ...node,
    style: { ...node.style, backgroundColor: fillFrom.style?.backgroundColor },
    tokens: { ...node.tokens },
    children: kept,
  };
  const inherited = fillFrom.tokens?.backgroundColor;
  if (inherited) merged.tokens!.backgroundColor = inherited;
  return merged;
}

function placementFor(style: Record<string, unknown>): Placement {
  if (style.position === 'absolute') {
    const left = typeof style.left === 'number' ? style.left : 0;
    const height = typeof style.height === 'number' ? style.height : undefined;
    const bottom = typeof style.bottom === 'number' ? style.bottom : 0;
    return isInsetLayer(style)
      ? { mode: 'absolute', x: 0, y: 0, stretch: 'both' }
      : // `-0` is a real JavaScript value and leaks into snapshots and equality
        // checks; normalise it away.
        { mode: 'absolute', x: left, y: bottom === 0 ? 0 : -bottom, height, stretch: 'bottom' };
  }
  return style.flex === 1 ? { mode: 'fill' } : { mode: 'flow' };
}

/**
 * Properties the executor handles itself, or that mean nothing on a canvas.
 *
 * `paddingHorizontal`/`paddingVertical` are deliberately absent: they have no
 * Figma field, but they do have an expansion, and listing them here dropped an
 * untokenised horizontal padding on the floor. Margins stay — Figma frames have
 * no margin at all, so there is nothing to expand them into.
 */
const IGNORED = new Set([
  'position', 'top', 'bottom', 'left', 'right', 'flex', 'flexGrow', 'flexShrink',
  'elevation', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'shadowColor',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'marginHorizontal', 'marginVertical',
  'fontFamily', 'textAlign', 'zIndex', 'alignSelf', 'flexWrap', 'overflow',
]);

/** Build the plan for one node and its subtree. */
export function planNode(node: ExportNode): PlanNode {
  const style = node.style ?? {};
  const tokens = node.tokens ?? {};

  const set: Record<string, unknown> = {};
  const bind: Record<string, string> = {};
  let fill: string | undefined;
  let fillBind: string | undefined;
  let stroke: string | undefined;
  let strokeBind: string | undefined;

  for (const [property, value] of Object.entries(style).sort(bySpecificity)) {
    const attribution = tokens[property];
    const bound = attribution?.figma && !attribution.hardcoded ? attribution.figma : undefined;

    if (isColourProperty(property)) {
      const isStroke = property.startsWith('border');
      if (bound) {
        if (isStroke) strokeBind = bound;
        else fillBind = bound;
      } else if (typeof value === 'string' && value !== 'transparent') {
        if (isStroke) stroke = value;
        else fill = value;
      }
      continue;
    }

    if (bound) {
      for (const field of bindableFields(property)) bind[field] = bound;
      continue;
    }
    if (IGNORED.has(property)) continue;

    // paddingHorizontal/Vertical have no Figma field; expand the literal too.
    const fields = bindableFields(property);
    if (fields.length > 1) {
      for (const field of fields) set[field] = value;
    } else {
      set[property] = value;
    }
  }

  if (node.type === 'Text') {
    return {
      kind: 'text',
      set,
      bind,
      fill,
      fillBind,
      text: node.text ?? '',
      fontStyle: fontStyleFor(style.fontWeight),
      placement: placementFor(style),
      children: [],
    };
  }

  return {
    kind: 'frame',
    set: { ...set, layoutMode: axisFor(style) },
    bind,
    fill,
    fillBind,
    stroke,
    strokeBind,
    placement: placementFor(style),
    children: (node.children ?? []).map(planNode),
  };
}

/** Entry point: flatten animation layers, then plan. */
export const planFor = (node: ExportNode): PlanNode => planNode(flattenAnimatedLayers(node));

/** Every Figma variable a plan expects, so a build can fail before it draws. */
export function requiredVariables(plan: PlanNode): string[] {
  const names = new Set<string>();
  const walk = (n: PlanNode) => {
    Object.values(n.bind).forEach((v) => names.add(v));
    if (n.fillBind) names.add(n.fillBind);
    if (n.strokeBind) names.add(n.strokeBind);
    n.children.forEach(walk);
  };
  walk(plan);
  return [...names].sort();
}
