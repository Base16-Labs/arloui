import { StyleSheet } from 'react-native';
import { Skeleton } from '../skeleton';
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
    ).toBe(12);

    rerender(<Skeleton testID="skeleton" shape="circle" animation="none" />);
    const circle = StyleSheet.flatten(
      screen.getByTestId('skeleton', { includeHiddenElements: true }).props.style,
    );
    expect(circle.width).toBe(40);
    expect(circle.height).toBe(40);
    expect(circle.borderRadius).toBe(999);
  });

  it('stays out of the accessibility tree', () => {
    renderWithTheme(<Skeleton testID="skeleton" animation="none" />);
    const skeleton = screen.getByTestId('skeleton', { includeHiddenElements: true });
    expect(skeleton.props.accessible).toBe(false);
    expect(skeleton.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
