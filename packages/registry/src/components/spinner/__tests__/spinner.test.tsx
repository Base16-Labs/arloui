import { jest } from '@jest/globals';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import { Spinner, type SpinnerAppearance } from '../spinner';
import { themes } from '../../../foundation/tokens';
import { renderWithTheme, screen, waitFor } from '../../../../test/render';
import { __setReduceMotionForTests } from '../../../foundation/reduce-motion';

afterEach(() => __setReduceMotionForTests(false));

const APPEARANCES: SpinnerAppearance[] = ['spokes', 'arc', 'dots', 'bars', 'pulse'];

/** Flattened styles of every View rendered under the spinner root. */
function styles() {
  return screen
    .getByTestId('spinner')
    .findAllByType('View' as never)
    .map((node) => StyleSheet.flatten(node.props.style))
    .filter(Boolean);
}

describe('Spinner', () => {
  it.each(APPEARANCES)('renders the "%s" appearance', (appearance) => {
    renderWithTheme(<Spinner appearance={appearance} testID="spinner" />);
    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('announces itself as busy with a default label', () => {
    renderWithTheme(<Spinner testID="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner.props.accessibilityRole).toBe('progressbar');
    expect(spinner.props.accessibilityState).toMatchObject({ busy: true });
    expect(screen.getByLabelText('Loading')).toBeTruthy();
  });

  it('names the specific work when given an accessibilityLabel', () => {
    renderWithTheme(<Spinner accessibilityLabel="Uploading photo" />);
    expect(screen.getByLabelText('Uploading photo')).toBeTruthy();
  });

  it('maps named sizes and accepts an exact diameter', () => {
    // The root is a centring wrapper; the glyph below it carries the diameter.
    const diameter = () =>
      Math.max(
        ...styles()
          .filter((style) => style?.width !== undefined && style?.width === style?.height)
          .map((style) => style.width as number),
      );

    const { rerender } = renderWithTheme(<Spinner appearance="arc" size="sm" testID="spinner" />);
    expect(diameter()).toBe(16);

    rerender(<Spinner appearance="arc" size="md" testID="spinner" />);
    expect(diameter()).toBe(24);

    rerender(<Spinner appearance="arc" size="lg" testID="spinner" />);
    expect(diameter()).toBe(32);

    rerender(<Spinner appearance="arc" size={44} testID="spinner" />);
    expect(diameter()).toBe(44);
  });

  it('draws 12 spokes with a descending opacity ramp', () => {
    renderWithTheme(<Spinner appearance="spokes" size={24} testID="spinner" />);
    const spokes = styles().filter(
      (style) => style?.position === 'absolute' && style?.backgroundColor,
    );

    expect(spokes).toHaveLength(12);
    expect(spokes[0].opacity).toBeCloseTo(1);
    expect(spokes[11].opacity).toBeLessThan(spokes[0].opacity);
  });

  it('tints from the tone, and lets an explicit color override it', () => {
    const backgrounds = () => styles().map((style) => style?.backgroundColor).filter(Boolean);

    const { rerender } = renderWithTheme(
      <Spinner appearance="dots" tone="accent" testID="spinner" />,
    );
    expect(backgrounds()).toContain(themes.dark.colors.accent);

    rerender(<Spinner appearance="dots" color="#FF00FF" testID="spinner" />);
    expect(backgrounds()).toContain('#FF00FF');
  });

  it.each(APPEARANCES)('holds "%s" still when reduce-motion is on', async (appearance) => {
    /*
     * The seam, not a mock on `AccessibilityInfo`. Reduce Motion is one
     * process-wide store with a single subscription, so it probes the OS once
     * for the whole suite — a mock installed by the eighth spec is never
     * consulted, because the first one already resolved the answer.
     */
    __setReduceMotionForTests(true);
    renderWithTheme(<Spinner appearance={appearance} size={24} testID="spinner" />);

    await waitFor(() => {
      // Depth-first, so [0] is the root wrapper and [1] the glyph container —
      // the only node that spins. Individual spokes keep their static layout
      // rotations, which are geometry rather than motion.
      const container = styles()[1];
      const spins = (container?.transform as { rotate?: string }[] | undefined)?.some(
        (entry) => entry?.rotate !== undefined,
      );
      expect(spins).toBeFalsy();
    });
  });
});
