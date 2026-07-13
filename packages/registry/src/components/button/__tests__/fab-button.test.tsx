import { jest } from '@jest/globals';

jest.mock('@arloui/utils', () => ({
  ...jest.requireActual('@arloui/utils'),
  haptic: jest.fn(),
}));

import { Text } from 'react-native';
import { FAB } from '../fab-button';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('FAB', () => {
  it('exposes the required accessibilityLabel as its accessible name', () => {
    renderWithTheme(<FAB icon={<Text>+</Text>} accessibilityLabel="Compose" />);
    expect(screen.getByRole('button', { name: 'Compose' })).toBeTruthy();
  });

  it('renders the provided icon', () => {
    renderWithTheme(<FAB icon={<Text>★</Text>} accessibilityLabel="Star" />);
    expect(screen.getByText('★')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    renderWithTheme(<FAB icon={<Text>+</Text>} accessibilityLabel="Add" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Add' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('supports both tones', () => {
    for (const tone of ['primary', 'neutral'] as const) {
      const { unmount } = renderWithTheme(
        <FAB tone={tone} icon={<Text>+</Text>} accessibilityLabel={`fab-${tone}`} />,
      );
      expect(screen.getByRole('button', { name: `fab-${tone}` })).toBeTruthy();
      unmount();
    }
  });
});
