import { jest } from '@jest/globals';

jest.mock('@arloui/utils', () => ({
  ...jest.requireActual('@arloui/utils'),
  haptic: jest.fn(),
}));

import { GhostButton } from '../ghost-button';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('GhostButton', () => {
  it('renders its label as an accessible button', () => {
    renderWithTheme(<GhostButton>Skip</GhostButton>);
    expect(screen.getByRole('button', { name: 'Skip' })).toBeTruthy();
  });

  it('calls onPress', () => {
    const onPress = jest.fn();
    renderWithTheme(<GhostButton onPress={onPress}>Tap</GhostButton>);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled and reports a disabled state', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <GhostButton onPress={onPress} disabled>
        Nope
      </GhostButton>,
    );
    const button = screen.getByRole('button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('blocks press while loading', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <GhostButton onPress={onPress} loading>
        Saving
      </GhostButton>,
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ busy: true });
  });

  it('renders every tone', () => {
    for (const tone of ['primary', 'neutral', 'danger'] as const) {
      const { unmount } = renderWithTheme(<GhostButton tone={tone}>{tone}</GhostButton>);
      expect(screen.getByText(tone)).toBeTruthy();
      unmount();
    }
  });
});
