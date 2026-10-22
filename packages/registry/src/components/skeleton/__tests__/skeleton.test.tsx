import { StyleSheet } from 'react-native';
import { Skeleton } from '../skeleton';
import { radii, sizing, spacing, themes } from '../../../foundation/tokens';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

describe('Skeleton', () => {
  it('renders custom geometry', () => {
    renderWithTheme(<Skeleton testID="skeleton" width={180} height={24} animation="none" />);
    const style = StyleSheet.flatten(
      screen.getByTestId('skeleton', { includeHiddenElements: true }).props.style,
    );
    expect(style.width).toBe(180);
    expect(style.height).toBe(24);
  });

  it('provides useful defaults for text and circle shapes', () => {
    const { rerender } = renderWithTheme(
      <Skeleton testID="skeleton" shape="text" animation="none" />,
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId('skeleton', { includeHiddenElements: true }).props.style,
      ).height,
    ).toBe(spacing[3]);

    rerender(<Skeleton testID="skeleton" shape="circle" animation="none" />);
    const circle = StyleSheet.flatten(
      screen.getByTestId('skeleton', { includeHiddenElements: true }).props.style,
    );
    expect(circle.width).toBe(sizing.buttonHeight.md);
    expect(circle.height).toBe(sizing.buttonHeight.md);
    expect(circle.borderRadius).toBe(radii.full);
  });

  it('fills with the raised surface and sweeps the strong surface', () => {
    for (const name of ['light', 'dark'] as const) {
      const { unmount } = renderWithTheme(
        <Skeleton testID="skeleton" width={180} height={24} />,
        { theme: name },
      );
      const skeleton = screen.getByTestId('skeleton', { includeHiddenElements: true });
      expect(StyleSheet.flatten(skeleton.props.style).backgroundColor).toBe(
        themes[name].colors.surfaceRaised,
      );
      fireEvent(skeleton, 'layout', {
        nativeEvent: { layout: { width: 180, height: 24, x: 0, y: 0 } },
      });
      const sheen = skeleton.children[0];
      expect(sheen).toBeTruthy();
      expect(StyleSheet.flatten(sheen.props.style).backgroundColor).toBe(
        themes[name].colors.surfaceStrong,
      );
      unmount();
    }
  });

  it('stays out of the accessibility tree', () => {
    renderWithTheme(<Skeleton testID="skeleton" animation="none" />);
    const skeleton = screen.getByTestId('skeleton', { includeHiddenElements: true });
    expect(skeleton.props.accessible).toBe(false);
    expect(skeleton.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
