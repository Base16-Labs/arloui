/**
 * `surface="glass"` across the components that offer it.
 *
 * One file rather than one per component, because the contract being checked is a
 * cross-component one: glass has to mean the same thing everywhere, and the way
 * it goes wrong is one component quietly painting its own fill under the material
 * or keeping a treatment the material already provides.
 */
import { Platform } from 'react-native';
import { Button } from '../button/button';
import { TabBar } from '../tab-bar/tab-bar';
import { __resetGlassCacheForTests } from '../../foundation/glass';
import { fireEvent, renderWithTheme, screen } from '../../../test/render';

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

  it('leaves the press response to the system material', () => {
    glassEffect.__setLiquidGlassAvailable(true);
    renderWithTheme(<Button surface="glass">Continue</Button>);
    const button = screen.getByRole('button', { name: 'Continue' });

    fireEvent(button, 'pressIn');
    // Our press tint would stack a flat wash over a surface that is already
    // answering the touch, so the native path must not add one.
    expect(screen.getByTestId('native-glass-view')).toBeTruthy();
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
});
