/**
 * How a glass surface decides what it is made of.
 *
 * The whole point of the foundation is that components never branch on platform —
 * they ask for a material and get an answer. These tests pin the answer, because
 * every one of the fallback cases is something a laptop cannot reproduce by
 * running the app: an iOS 26 beta without the API, a missing native module, a
 * user with Reduce Transparency on.
 */
import { Platform, View } from 'react-native';
import {
  GlassBackdrop,
  __resetGlassCacheForTests,
  isNativeGlassAvailable,
  useGlassSurface,
  withAlpha,
  type GlassMaterial,
} from '../glass';
import { materials } from '../tokens';
import { renderWithTheme, screen } from '../../../test/render';

// `require`, not `import`: the package is an optional peer that this workspace
// does not install, so the identifier only resolves through jest's
// moduleNameMapper at run time and TypeScript cannot see it statically.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const glassEffect = require('expo-glass-effect') as {
  __setLiquidGlassAvailable: (
    available: boolean,
    options?: { apiAvailable?: boolean; throws?: boolean },
  ) => void;
  __resetGlassEffectMock: () => void;
};

/** Reads the resolved surface out of a render, since the hook needs a theme. */
function Probe({ material }: { material?: GlassMaterial } = {}) {
  const surface = useGlassSurface(material);
  return (
    <View
      testID="probe"
      // Serialised rather than asserted through props one at a time — the point
      // is the whole surface agrees with itself.
      accessibilityLabel={JSON.stringify({
        native: surface.native,
        borderWidth: surface.borderWidth,
        transparentFill: surface.backgroundColor === 'transparent',
      })}
    />
  );
}

function readProbe() {
  return JSON.parse(screen.getByTestId('probe').props.accessibilityLabel) as {
    native: boolean;
    borderWidth: number;
    transparentFill: boolean;
  };
}

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

describe('isNativeGlassAvailable', () => {
  it('is true only when the design and the API are both there', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    expect(isNativeGlassAvailable()).toBe(true);
  });

  /**
   * Several iOS 26 betas ship the Liquid Glass design without the API behind it
   * and crash when you use it. Treating "the design is on" as sufficient would
   * hard-crash exactly those devices, so the second probe is not redundant.
   */
  it('is false when the design is on but the API is missing', () => {
    glassEffect.__setLiquidGlassAvailable(true, { apiAvailable: false });
    expect(isNativeGlassAvailable()).toBe(false);
  });

  /** Expo Go, or a project that added the package without rebuilding. */
  it('survives the native module being absent', () => {
    glassEffect.__setLiquidGlassAvailable(true, { throws: true });
    expect(() => isNativeGlassAvailable()).not.toThrow();
    expect(isNativeGlassAvailable()).toBe(false);
  });

  it('is false off iOS without consulting the module at all', () => {
    Platform.OS = 'android';
    glassEffect.__setLiquidGlassAvailable(true);
    expect(isNativeGlassAvailable()).toBe(false);
  });
});

describe('useGlassSurface', () => {
  it('paints nothing of its own when the OS is drawing the material', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<Probe />);

    // A component that spreads this stops painting without having to branch.
    expect(readProbe()).toEqual({ native: true, borderWidth: 0, transparentFill: true });
  });

  it('carries a real fill and a hairline edge on the fallback', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    renderWithTheme(<Probe />);

    const surface = readProbe();
    expect(surface.native).toBe(false);
    expect(surface.borderWidth).toBe(1);
    expect(surface.transparentFill).toBe(false);
  });

  /**
   * Carried over from staging's version of this file, which the branches wrote
   * independently. It sweeps every material rather than checking one, and it is
   * the only place the default is pinned.
   */
  it('resolves each material into a translucent surface', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    for (const material of ['small', 'medium', 'large'] as const) {
      const view = renderWithTheme(<Probe material={material} />);
      const surface = readProbe();
      expect(surface.native).toBe(false);
      expect(surface.borderWidth).toBe(1);
      expect(surface.transparentFill).toBe(false);
      view.unmount();
    }
  });

  it('defaults to the medium material', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    renderWithTheme(<Probe />);
    expect(readProbe().native).toBe(false);
  });
});

describe('GlassBackdrop', () => {
  it('hands the surface to the system material when it can', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<GlassBackdrop material="medium" />);
    expect(screen.getByTestId('native-glass-view')).toBeTruthy();
  });

  it('renders the host blur layer instead when it cannot', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    renderWithTheme(
      <GlassBackdrop material="medium">
        <View testID="host-blur" />
      </GlassBackdrop>,
    );
    expect(screen.queryByTestId('native-glass-view')).toBeNull();
    expect(screen.getByTestId('host-blur')).toBeTruthy();
  });

  /**
   * The native material blurs for itself. Mounting ours behind it would blur the
   * backdrop twice, and the second pass samples the first.
   */
  it('drops the host blur layer on the native path', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(
      <GlassBackdrop material="medium">
        <View testID="host-blur" />
      </GlassBackdrop>,
    );
    expect(screen.queryByTestId('host-blur')).toBeNull();
  });

  it('renders nothing at all with no material and no blur layer', () => {
    glassEffect.__setLiquidGlassAvailable(false);
    const { toJSON } = renderWithTheme(<GlassBackdrop />);
    expect(toJSON()).toBeNull();
  });

  /**
   * A tint is a component's own colour surviving the surface swap, so it has to
   * land on both paths — a tinted button that reads as primary on iOS 26 and as
   * colourless glass on Android is the same bug in a different place.
   */
  it('tints the system material at the material\'s resting opacity', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<GlassBackdrop material="medium" tintColor="#155DFC" />);

    expect(screen.getByTestId('native-glass-view').props.tintColor).toBe(
      `rgba(21,93,252,${materials.glassMedium.tintOpacity})`,
    );
  });

  it('leaves the material untinted when no tint is asked for', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<GlassBackdrop material="medium" />);
    expect(screen.getByTestId('native-glass-view').props.tintColor).toBeUndefined();
  });

  /**
   * `GlassView` re-assigns `glassEffectView.effect` whenever `tintColor` changes —
   * it has to, or the change does not take — and re-assigning the effect makes
   * `UIVisualEffectView` re-render the material, which is a flash on every press.
   * So the press delta rides on an overlay and the material's props stay put.
   */
  it('never moves the native tint to answer a press', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    const { rerender } = renderWithTheme(
      <GlassBackdrop material="medium" tintColor="#155DFC" pressed />,
    );
    const resting = `rgba(21,93,252,${materials.glassMedium.tintOpacity})`;

    expect(screen.getByTestId('native-glass-view').props.tintColor).toBe(resting);
    rerender(<GlassBackdrop material="medium" tintColor="#155DFC" />);
    expect(screen.getByTestId('native-glass-view').props.tintColor).toBe(resting);
  });

  /** Off by default: the gesture belongs to the `Pressable` ancestor. */
  it('does not hand the touch to the system material unless asked', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<GlassBackdrop material="medium" />);
    expect(screen.getByTestId('native-glass-view').props.isInteractive).toBe(false);
  });
});

describe('withAlpha', () => {
  it.each([
    ['#155DFC', 'rgba(21,93,252,0.5)'],
    ['#15D', 'rgba(17,85,221,0.5)'],
    ['#155DFCAA', 'rgba(21,93,252,0.5)'],
    ['rgb(21, 93, 252)', 'rgba(21,93,252,0.5)'],
    ['rgba(21,93,252,0.9)', 'rgba(21,93,252,0.5)'],
  ])('re-alphas %s', (input, expected) => {
    expect(withAlpha(input, 0.5)).toBe(expected);
  });

  /**
   * The material token is the authority on how strongly a tint reads. Honouring
   * a tone's own alpha instead would let a translucent tone — `interactiveSecondary`
   * is `rgba(229,231,235,0.7)` — quietly under-tint its surface.
   */
  it('replaces an existing alpha rather than multiplying it', () => {
    expect(withAlpha('rgba(229,231,235,0.7)', 0.5)).toBe('rgba(229,231,235,0.5)');
  });

  /**
   * A tint at full strength is a visible mistake someone fixes; a silently
   * dropped tint is not. So anything unparseable comes back untouched.
   */
  it.each(['transparent', 'rebeccapurple', '#12345'])('leaves %s alone', (input) => {
    expect(withAlpha(input, 0.5)).toBe(input);
  });

  it('clamps out-of-range alphas', () => {
    expect(withAlpha('#155DFC', 4)).toBe('rgba(21,93,252,1)');
    expect(withAlpha('#155DFC', -1)).toBe('rgba(21,93,252,0)');
  });
});
