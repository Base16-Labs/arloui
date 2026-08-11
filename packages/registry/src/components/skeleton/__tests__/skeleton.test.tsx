import { StyleSheet } from 'react-native';
import { Skeleton } from '../skeleton';
import { radii, sizing, spacing } from '../../../foundation/tokens';
import { renderWithTheme, screen } from '../../../../test/render';

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

  it('stays out of the accessibility tree', () => {
    renderWithTheme(<Skeleton testID="skeleton" animation="none" />);
    const skeleton = screen.getByTestId('skeleton', { includeHiddenElements: true });
    expect(skeleton.props.accessible).toBe(false);
    expect(skeleton.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
