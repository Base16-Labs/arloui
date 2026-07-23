import { jest } from '@jest/globals';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import { Spinner, type SpinnerAppearance } from '../spinner';
import { themes } from '../../../foundation/tokens';
import { renderWithTheme, screen, waitFor } from '../../../../test/render';

const APPEARANCES: SpinnerAppearance[] = ['spokes', 'arc', 'dots'];

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

  it('promotes a visible label to the accessibility label', () => {
    renderWithTheme(<Spinner label="Uploading photo" />);
    expect(screen.getByText('Uploading photo')).toBeTruthy();
    expect(screen.getByLabelText('Uploading photo')).toBeTruthy();
  });

  it('lets accessibilityLabel win over the visible label', () => {
    renderWithTheme(<Spinner label="Uploading" accessibilityLabel="Uploading photo, please wait" />);
    expect(screen.getByLabelText('Uploading photo, please wait')).toBeTruthy();
  });

  it('maps named sizes and accepts an exact diameter', () => {
    // The root is a column wrapper for the optional label; the ring below it is
    // the square that carries the diameter.
    const diameter = () => {
      const squares = styles()
        .filter((style) => style?.width !== undefined && style?.width === style?.height)
        .map((style) => style.width as number);
      return Math.max(...squares);
    };

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

  it('drops the transforms when reduce-motion is on', async () => {
    jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValueOnce(true);
    renderWithTheme(<Spinner appearance="spokes" size={24} testID="spinner" />);

    await waitFor(() => {
      const ring = styles().find((style) => style?.width === 24 && style?.height === 24);
      expect(ring?.transform).toBeUndefined();
    });
  });
});
