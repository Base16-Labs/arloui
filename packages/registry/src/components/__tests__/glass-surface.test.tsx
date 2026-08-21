/**
 * `surface="glass"` across the components that offer it.
 *
 * One file rather than one per component, because the contract being checked is a
 * cross-component one: glass has to mean the same thing everywhere, and the way
 * it goes wrong is one component quietly painting its own fill under the material
 * or keeping a treatment the material already provides.
 */
import { Platform, StyleSheet } from 'react-native';
import { Button } from '../button/button';
import { TabBar } from '../tab-bar/tab-bar';
import { __resetGlassCacheForTests, withAlpha } from '../../foundation/glass';
import { materials, themes } from '../../foundation/tokens';
import { fireEvent, renderWithTheme, screen } from '../../../test/render';

/**
 * Every `backgroundColor` anywhere in the rendered tree.
 *
 * The fills that matter here are on unlabelled `absoluteFill` overlays with no
 * role and no text, so there is nothing to query them by — and giving them
 * testIDs would put test scaffolding in the shipped surface. Walking the tree
 * also happens to be the right shape for the assertions: the bugs being pinned
 * are about how many fills there are and what they add up to, not about which
 * node any one of them sits on.
 */
function fills(tree: unknown): string[] {
  const found: string[] = [];
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    const element = node as { props?: { style?: unknown }; children?: unknown };
    const style = StyleSheet.flatten(element.props?.style as never) as
      | { backgroundColor?: string }
      | undefined;
    if (style?.backgroundColor) found.push(style.backgroundColor);
    walk(element.children);
  };
  walk(tree);
  return found;
}

/** A tone at the button material's resting or pressed tint strength. */
function tint(color: string, state: 'resting' | 'pressed' = 'resting') {
  const { tintOpacity, tintOpacityPressed } = materials.glassSmall;
  return withAlpha(color, state === 'pressed' ? tintOpacityPressed : tintOpacity);
}

// `require`, not `import`: the package is an optional peer that this workspace
// does not install, so the identifier only resolves through jest's
// moduleNameMapper at run time and TypeScript cannot see it statically.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const glassEffect = require('expo-glass-effect') as {
  __setLiquidGlassAvailable: (available: boolean) => void;
  __resetGlassEffectMock: () => void;
};

const originalOS = Platform.OS;

beforeEach(() => {
  __resetGlassCacheForTests();
  glassEffect.__resetGlassEffectMock();
  Platform.OS = 'ios';
});

afterEach(() => {
  Platform.OS = originalOS;
  __resetGlassCacheForTests();
  glassEffect.__resetGlassEffectMock();
});

describe('Button surface="glass"', () => {
  it('uses the system material when it is there', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<Button surface="glass">Continue</Button>);
    expect(screen.getByTestId('native-glass-view')).toBeTruthy();
  });

  it('falls back without it, and still renders a button', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    renderWithTheme(<Button surface="glass">Continue</Button>);
    expect(screen.queryByTestId('native-glass-view')).toBeNull();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  /**
   * The material's job is to look live. Disabled has to communicate the opposite,
   * and on the native path an interactive surface would keep reacting to touch on
   * a control that does nothing.
   */
  it('never goes to glass while disabled', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(
      <Button surface="glass" disabled>
        Continue
      </Button>,
    );
    expect(screen.queryByTestId('native-glass-view')).toBeNull();
  });

  /**
   * The demo complaint, pinned: a glass primary button that comes out colourless
   * is not a primary button. The tone's fill becomes the material's tint, so the
   * colour survives the surface swap on both paths.
   */
  it('keeps the tone colour as the material tint', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<Button surface="glass">Continue</Button>, { theme: 'light' });

    expect(screen.getByTestId('native-glass-view').props.tintColor).toBe(
      tint(themes.light.colors.interactivePrimary),
    );
  });

  it('tints the fallback with the same tone', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    const { toJSON } = renderWithTheme(<Button surface="glass">Continue</Button>, {
      theme: 'light',
    });

    expect(fills(toJSON())).toContain(tint(themes.light.colors.interactivePrimary));
  });

  it('tints a danger button with danger, not with primary', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    const { toJSON } = renderWithTheme(
      <Button surface="glass" tone="danger">
        Delete
      </Button>,
      { theme: 'light' },
    );

    const painted = fills(toJSON());
    expect(painted).toContain(tint(themes.light.colors.feedbackError));
    expect(painted).not.toContain(tint(themes.light.colors.interactivePrimary));
  });

  /**
   * `GlassBackdrop` paints the material. A `backgroundColor` on the container
   * too would stack the overlay on itself — 0.64 over 0.64 lands near 0.87,
   * which is an almost-opaque panel wearing a glass token.
   */
  it('paints the material exactly once', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    const { toJSON } = renderWithTheme(<Button surface="glass">Continue</Button>, {
      theme: 'light',
    });

    const overlay = materials.glassSmall.lightOverlay;
    expect(fills(toJSON()).filter((fill) => fill === overlay)).toHaveLength(1);
  });

  /**
   * Painting `touchFeedbackMain` across a glass button is what made a press look
   * like the glass going away — a flat neutral layer over the whole surface is
   * the one thing a material is not. The colour deepens instead.
   */
  it('answers a press by deepening the tint, not by washing the surface', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    const { toJSON } = renderWithTheme(<Button surface="glass">Continue</Button>, {
      theme: 'light',
    });
    fireEvent(screen.getByRole('button', { name: 'Continue' }), 'pressIn');

    const painted = fills(toJSON());
    expect(painted).toContain(tint(themes.light.colors.interactivePrimary, 'pressed'));
    expect(painted).not.toContain(themes.light.colors.touchFeedbackMain);
  });

  it('deepens the native tint above the material rather than through it', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    const { toJSON } = renderWithTheme(<Button surface="glass">Continue</Button>, {
      theme: 'light',
    });
    fireEvent(screen.getByRole('button', { name: 'Continue' }), 'pressIn');

    // Re-assigning `tintColor` makes `GlassView` rebuild its effect, which
    // flashes. The native material's props stay put and the press rides above.
    expect(screen.getByTestId('native-glass-view').props.tintColor).toBe(
      tint(themes.light.colors.interactivePrimary),
    );
    expect(fills(toJSON())).toContain(tint(themes.light.colors.interactivePrimary, 'pressed'));
  });

  /**
   * The material would be answering touches on a `pointerEvents: 'none'`
   * `absoluteFill` under the `Pressable` that owns the gesture, so it reacted on
   * its own schedule — sometimes to a press that landed on a neighbour.
   */
  it('never asks the system material to handle the touch itself', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<Button surface="glass">Continue</Button>);
    expect(screen.getByTestId('native-glass-view').props.isInteractive).toBe(false);
  });

  it('is opt-in — a default button has no glass at all', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<Button>Continue</Button>);
    expect(screen.queryByTestId('native-glass-view')).toBeNull();
  });
});

describe('TabBar surface="glass"', () => {
  function bar(surface: 'glass' | 'filled') {
    return (
      <TabBar value="home" onValueChange={() => {}} surface={surface}>
        <TabBar.Item value="home" label="Home" />
        <TabBar.Item value="search" label="Search" />
      </TabBar>
    );
  }

  it('uses the system material when it is there', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(bar('glass'));
    expect(screen.getByTestId('native-glass-view')).toBeTruthy();
  });

  it('falls back without it, and still renders its items', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    renderWithTheme(bar('glass'));
    expect(screen.queryByTestId('native-glass-view')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Home' })).toBeTruthy();
  });

  it('leaves a filled bar alone', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(bar('filled'));
    expect(screen.queryByTestId('native-glass-view')).toBeNull();
  });

  it('paints the material exactly once', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    const { toJSON } = renderWithTheme(bar('glass'), { theme: 'light' });

    const overlay = materials.glassMedium.lightOverlay;
    expect(fills(toJSON()).filter((fill) => fill === overlay)).toHaveLength(1);
  });

  /**
   * Button tints because it has a tone to keep. The bar does not: `navBackground`
   * is the same neutral the material already paints, and `navIndicator` would
   * turn a neutral nav surface accent-blue because a token happened to be to
   * hand. The bar's colour is the material.
   */
  it('takes no tint, because it has no colour of its own to keep', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(bar('glass'));
    expect(screen.getByTestId('native-glass-view').props.tintColor).toBeUndefined();
  });
});
