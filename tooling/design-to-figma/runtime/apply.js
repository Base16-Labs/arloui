/**
 * Executes a plan from `@arloui/design-to-figma` against the Figma Plugin API.
 *
 * Intentionally dumb. Every judgement call — the layout axis, folding animated
 * layers into paints, which Figma field a style property binds to — was already
 * made by the planner, which has tests. This walks the result and calls the
 * API, so the part that cannot be tested is also the part with no decisions in
 * it. If something looks wrong on the canvas, fix the planner and re-emit.
 *
 * Injected before this file: `const PLAN = [...]` and `const CONFIG = {...}`.
 */

async function applyPlan() {
  const fonts = new Set();
  const collectFonts = (n) => {
    if (n.kind === 'text') fonts.add(n.fontStyle || 'Regular');
    (n.children || []).forEach(collectFonts);
  };
  PLAN.forEach((cell) => collectFonts(cell.plan));
  for (const style of fonts) {
    await figma.loadFontAsync({ family: CONFIG.fontFamily, style });
  }

  const variables = await figma.variables.getLocalVariablesAsync();
  const byName = new Map();
  for (const v of variables) if (!byName.has(v.name)) byName.set(v.name, v);

  // Fail before drawing rather than silently hardcoding a fallback.
  const missing = [];
  for (const name of CONFIG.requiredVariables) if (!byName.has(name)) missing.push(name);
  if (missing.length) {
    throw new Error(
      'Missing Figma variables: ' + missing.join(', ') +
        '. Re-run the token import plugin with design/tokens.figma.json.',
    );
  }

  const solid = (css) => {
    const m = String(css).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?/);
    if (m) {
      const a = m[4] ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : Number(m[4])) : 1;
      return { type: 'SOLID', color: { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255 }, opacity: a };
    }
    let h = String(css).replace('#', '');
    if (h.length === 3) h = h.replace(/./g, (c) => c + c);
    return {
      type: 'SOLID',
      color: {
        r: parseInt(h.slice(0, 2), 16) / 255,
        g: parseInt(h.slice(2, 4), 16) / 255,
        b: parseInt(h.slice(4, 6), 16) / 255,
      },
    };
  };

  const boundPaint = (name) =>
    figma.variables.setBoundVariableForPaint(
      { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
      'color',
      byName.get(name),
    );

  let bindings = 0;

  function create(node) {
    const isText = node.kind === 'text';
    const el = isText
      ? figma.createText()
      : figma.createAutoLayout(node.set.layoutMode === 'HORIZONTAL' ? 'HORIZONTAL' : 'VERTICAL');

    if (isText) {
      el.fontName = { family: CONFIG.fontFamily, style: node.fontStyle || 'Regular' };
      el.characters = node.text || '';
      if (node.set.fontSize) el.fontSize = node.set.fontSize;
      if (node.set.lineHeight) el.lineHeight = { unit: 'PIXELS', value: node.set.lineHeight };
    } else {
      el.fills = [];
      for (const [field, value] of Object.entries(node.set)) {
        if (field === 'layoutMode') continue;
        if (field === 'alignItems') { el.counterAxisAlignItems = value === 'center' ? 'CENTER' : 'MIN'; continue; }
        if (field === 'justifyContent') {
          el.primaryAxisAlignItems = value === 'center' ? 'CENTER' : value === 'flex-end' ? 'MAX' : 'MIN';
          continue;
        }
        if (field === 'borderTopWidth') { el.strokeTopWeight = value; el.strokeBottomWeight = 0; el.strokeLeftWeight = 0; el.strokeRightWeight = 0; continue; }
        if (field === 'borderWidth') { el.strokeWeight = value; continue; }
        if (field === 'borderRadius') { el.cornerRadius = value; continue; }
        if (field.startsWith('border') && field.endsWith('Radius')) {
          const corner = field.replace('border', '');
          el[corner.charAt(0).toLowerCase() + corner.slice(1)] = value;
          continue;
        }
        try { el[field] = value; } catch { /* property not applicable to this node */ }
      }
    }

    if (node.fillBind) { el.fills = [boundPaint(node.fillBind)]; bindings++; }
    else if (node.fill) el.fills = [solid(node.fill)];
    if (node.strokeBind) { el.strokes = [boundPaint(node.strokeBind)]; bindings++; }
    else if (node.stroke) el.strokes = [solid(node.stroke)];

    for (const [field, name] of Object.entries(node.bind || {})) {
      el.setBoundVariable(field, byName.get(name));
      bindings++;
    }

    for (const child of node.children || []) {
      const c = create(child);
      el.appendChild(c);
      const p = child.placement || { mode: 'flow' };
      if (p.mode === 'fill') {
        c.layoutSizingHorizontal = 'FILL';
      } else if (p.mode === 'absolute') {
        c.layoutPositioning = 'ABSOLUTE';
        c.constraints = {
          horizontal: 'STRETCH',
          vertical: p.stretch === 'both' ? 'STRETCH' : 'MAX',
        };
        c.layoutSizingHorizontal = 'FIXED';
        c.layoutSizingVertical = 'FIXED';
        const w = Math.max(1, (p.stretch === 'both' ? el.width : el.width - p.x * 2));
        c.resize(w, p.height != null ? p.height : el.height);
        c.x = p.x;
        c.y = p.stretch === 'both' ? 0 : el.height - (p.height || 0) - p.y;
      }
    }
    return el;
  }

  let page = figma.root.children.find((p) => p.name === CONFIG.page);
  if (!page) { page = figma.createPage(); page.name = CONFIG.page; }
  await figma.setCurrentPageAsync(page);
  for (const child of [...page.children]) child.remove();

  const made = [];
  let y = 0;
  for (const cell of PLAN) {
    const comp = figma.createComponent();
    comp.name = cell.name;
    comp.fills = [];
    comp.layoutMode = 'HORIZONTAL';
    comp.primaryAxisSizingMode = 'FIXED';
    comp.counterAxisSizingMode = 'AUTO';
    page.appendChild(comp);
    comp.resize(CONFIG.width, CONFIG.height || 44);
    const root = create(cell.plan);
    comp.appendChild(root);
    root.layoutSizingHorizontal = 'FILL';
    comp.x = 0;
    comp.y = y;
    y += (CONFIG.height || 44) + 48;
    made.push(comp);
  }

  const set = figma.combineAsVariants(made, page);
  set.name = CONFIG.set;
  set.layoutMode = 'VERTICAL';
  set.itemSpacing = 16;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 24;
  set.primaryAxisSizingMode = 'AUTO';
  set.counterAxisSizingMode = 'AUTO';
  set.x = 0;
  set.y = 0;
  set.description = CONFIG.description;

  await set.screenshot();
  return { setId: set.id, variants: set.children.length, bindings };
}

return await applyPlan();
