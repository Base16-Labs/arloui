/**
 * Every case here is a bug that reached a Figma canvas before it reached a
 * test. They are written as fixtures rather than assertions about the Plugin
 * API so they run in Node, where the API does not exist.
 */
import { describe, expect, it } from 'vitest';
import {
  axisFor,
  bindableFields,
  flattenAnimatedLayers,
  fontStyleFor,
  planFor,
  requiredVariables,
  type ExportNode,
} from '../plan';

const frame = (style: ExportNode['style'], children: ExportNode[] = [], tokens?: ExportNode['tokens']): ExportNode => ({
  type: 'View',
  style,
  tokens,
  children,
});

describe('axis', () => {
  it('defaults to vertical, because React Native defaults flexDirection to column', () => {
    // Reading the absence of flexDirection as "row" transposed every layer of
    // Sheet; Tabs never caught it because Tabs always sets row explicitly.
    expect(axisFor({})).toBe('VERTICAL');
    expect(axisFor({ alignItems: 'center' })).toBe('VERTICAL');
    expect(axisFor({ flexDirection: 'row' })).toBe('HORIZONTAL');
    expect(axisFor({ flexDirection: 'column' })).toBe('VERTICAL');
  });
});

describe('font style', () => {
  it('maps numeric weights onto the styles Manrope actually ships', () => {
    expect(fontStyleFor('600')).toBe('SemiBold');
    expect(fontStyleFor(400)).toBe('Regular');
    // An unknown weight must not produce a style name that loadFontAsync rejects.
    expect(fontStyleFor('950')).toBe('Regular');
    expect(fontStyleFor(undefined)).toBe('Regular');
  });
});

describe('bindable fields', () => {
  it('fans shorthand properties out to the fields Figma actually exposes', () => {
    expect(bindableFields('paddingHorizontal')).toEqual(['paddingLeft', 'paddingRight']);
    expect(bindableFields('borderRadius')).toEqual([
      'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
    ]);
    expect(bindableFields('gap')).toEqual(['itemSpacing']);
    expect(bindableFields('borderTopLeftRadius')).toEqual(['topLeftRadius']);
  });

  it('has nothing to offer for properties Figma cannot bind', () => {
    expect(bindableFields('opacity')).toEqual([]);
    expect(bindableFields('flexDirection')).toEqual([]);
  });

  it('covers the remaining shorthand and per-corner forms', () => {
    expect(bindableFields('paddingVertical')).toEqual(['paddingTop', 'paddingBottom']);
    expect(bindableFields('padding')).toEqual([
      'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    ]);
    expect(bindableFields('borderBottomLeftRadius')).toEqual(['bottomLeftRadius']);
    expect(bindableFields('borderBottomRightRadius')).toEqual(['bottomRightRadius']);
    expect(bindableFields('minHeight')).toEqual(['minHeight']);
    expect(bindableFields('letterSpacing')).toEqual(['letterSpacing']);
  });
});

describe('animated selection layers', () => {
  const pill = (opacity: number): ExportNode =>
    frame(
      { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity },
      [],
      { backgroundColor: { figma: 'Interactive Elements/accent' } },
    );

  it('drops the hidden state', () => {
    const out = flattenAnimatedLayers(frame({}, [pill(0), { type: 'Text', text: 'Unread' }]));
    expect(out.children).toHaveLength(1);
    expect(out.children?.[0].type).toBe('Text');
  });

  it('folds the visible state into the parent as a paint', () => {
    // Kept as a child it would be an auto-layout frame with no children, which
    // hugs to zero — the pill rendered as a blank sliver on the real canvas.
    const out = flattenAnimatedLayers(frame({}, [pill(1), { type: 'Text', text: 'All' }]));
    expect(out.children).toHaveLength(1);
    expect(out.tokens?.backgroundColor?.figma).toBe('Interactive Elements/accent');
  });

  it('leaves edge-anchored indicators alone — they are not inset layers', () => {
    const underline = frame({ position: 'absolute', bottom: -1, left: 10, right: 10, height: 2.5, opacity: 1 });
    const out = flattenAnimatedLayers(frame({}, [underline]));
    expect(out.children).toHaveLength(1);
  });

  it('recurses, so a nested selection layer is flattened too', () => {
    const out = flattenAnimatedLayers(frame({}, [frame({}, [pill(0)])]));
    expect(out.children?.[0].children).toHaveLength(0);
  });
});

describe('planning', () => {
  it('binds a variable rather than copying its value', () => {
    const plan = planFor(
      frame(
        { backgroundColor: '#155DFC', paddingHorizontal: 12 },
        [],
        {
          backgroundColor: { figma: 'Interactive Elements/accent' },
          paddingHorizontal: { figma: 'space-3' },
        },
      ),
    );
    expect(plan.fillBind).toBe('Interactive Elements/accent');
    expect(plan.fill).toBeUndefined();
    expect(plan.bind).toEqual({ paddingLeft: 'space-3', paddingRight: 'space-3' });
    // A bound value must not also be written as a literal, or editing the
    // variable would leave a stale copy behind.
    expect(plan.set.paddingLeft).toBeUndefined();
  });

  it('keeps hardcoded values literal instead of inventing a token', () => {
    const plan = planFor(
      frame({ gap: 2, backgroundColor: '#E5E7EB' }, [], {
        gap: { hardcoded: true },
        backgroundColor: { hardcoded: true },
      }),
    );
    expect(plan.bind).toEqual({});
    expect(plan.set.gap).toBe(2);
    expect(plan.fill).toBe('#E5E7EB');
  });

  it('routes border colours to strokes, not fills', () => {
    const plan = planFor(
      frame({ borderBottomColor: '#E5E7EB', borderBottomWidth: 1 }, [], {
        borderBottomColor: { figma: 'Borders & Dividers/border' },
      }),
    );
    expect(plan.strokeBind).toBe('Borders & Dividers/border');
    expect(plan.fillBind).toBeUndefined();
  });

  it('marks flex:1 children as fill and everything else as flow', () => {
    const plan = planFor(frame({ flexDirection: 'row' }, [frame({ flex: 1 }), frame({})]));
    expect(plan.children[0].placement).toEqual({ mode: 'fill' });
    expect(plan.children[1].placement).toEqual({ mode: 'flow' });
  });

  it('places an edge-anchored indicator by its bottom inset', () => {
    const plan = planFor(
      frame({}, [frame({ position: 'absolute', bottom: -1, left: 10, right: 10, height: 2.5 })]),
    );
    expect(plan.children[0].placement).toEqual({
      mode: 'absolute', x: 10, y: 1, height: 2.5, stretch: 'bottom',
    });
  });

  it('carries text content, weight and its bound type tokens', () => {
    const plan = planFor({
      type: 'Text',
      text: 'Delivery options',
      style: { fontWeight: '600', fontSize: 20, lineHeight: 26, color: '#101828' },
      tokens: {
        fontSize: { figma: 'Font Size/heading-large' },
        lineHeight: { figma: 'Line Height/heading-large' },
        color: { figma: 'Text & Content/text-primary' },
      },
    });
    expect(plan.kind).toBe('text');
    expect(plan.text).toBe('Delivery options');
    expect(plan.fontStyle).toBe('SemiBold');
    expect(plan.fillBind).toBe('Text & Content/text-primary');
    expect(plan.bind).toEqual({
      fontSize: 'Font Size/heading-large',
      lineHeight: 'Line Height/heading-large',
    });
  });

  it('sets a layout axis on every frame', () => {
    const plan = planFor(frame({ alignItems: 'center' }, [frame({ flexDirection: 'row' })]));
    expect(plan.set.layoutMode).toBe('VERTICAL');
    expect(plan.children[0].set.layoutMode).toBe('HORIZONTAL');
  });

  it('survives a node with no style, tokens or children', () => {
    const plan = planFor({ type: 'View' });
    expect(plan.kind).toBe('frame');
    expect(plan.set.layoutMode).toBe('VERTICAL');
    expect(plan.children).toEqual([]);
  });

  it('expands a hardcoded shorthand into the per-side literals Figma needs', () => {
    // Figma has no paddingHorizontal, so an untokenised shorthand still has to
    // become two properties or the padding silently disappears.
    const plan = planFor(frame({ paddingHorizontal: 12, padding: 4 }));
    expect(plan.set.paddingLeft).toBe(12);
    expect(plan.set.paddingRight).toBe(12);
    expect(plan.set.paddingTop).toBe(4);
  });

  it('drops properties that mean nothing on a canvas', () => {
    const plan = planFor(frame({ flexGrow: 1, zIndex: 3, overflow: 'hidden', opacity: 0.5 }));
    expect(plan.set.flexGrow).toBeUndefined();
    expect(plan.set.zIndex).toBeUndefined();
    expect(plan.set.overflow).toBeUndefined();
    expect(plan.set.opacity).toBe(0.5);
  });

  it('ignores transparent colours rather than painting them', () => {
    const plan = planFor(frame({ backgroundColor: 'transparent' }));
    expect(plan.fill).toBeUndefined();
    expect(plan.fillBind).toBeUndefined();
  });

  it('keeps a literal border colour as a stroke', () => {
    const plan = planFor(frame({ borderColor: 'rgba(255,255,255,0.64)', borderWidth: 1 }));
    expect(plan.stroke).toBe('rgba(255,255,255,0.64)');
    expect(plan.strokeBind).toBeUndefined();
  });

  it('treats an absolute layer with no offsets as pinned to the origin', () => {
    const plan = planFor(frame({}, [frame({ position: 'absolute' })]));
    expect(plan.children[0].placement).toEqual({
      mode: 'absolute', x: 0, y: 0, height: undefined, stretch: 'bottom',
    });
  });
});

describe('requiredVariables', () => {
  it('lists every variable the plan depends on, so a build can fail before drawing', () => {
    const plan = planFor(
      frame({ backgroundColor: '#fff', gap: 8 }, [
        {
          type: 'Text',
          text: 'All',
          style: { color: '#101828' },
          tokens: { color: { figma: 'Text & Content/text-primary' } },
        },
      ], {
        backgroundColor: { figma: 'Surfaces & Backgrounds/surface-elevated' },
        gap: { figma: 'space-2' },
      }),
    );
    expect(requiredVariables(plan)).toEqual([
      'Surfaces & Backgrounds/surface-elevated',
      'Text & Content/text-primary',
      'space-2',
    ]);
  });
});
