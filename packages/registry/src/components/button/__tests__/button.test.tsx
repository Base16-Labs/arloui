import { jest } from '@jest/globals';

// Spy on the haptics helper without pulling in the real expo-haptics native call.
jest.mock('@arloui/utils', () => ({
  ...jest.requireActual('@arloui/utils'),
  haptic: jest.fn(),
}));

import { Text } from 'react-native';
import { haptic } from '@arloui/utils';
import { Button } from '../button';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('Button', () => {
  it('renders its text label', () => {
    renderWithTheme(<Button>Continue</Button>);
    expect(screen.getByText('Continue')).toBeTruthy();
  });

  it('supports the legacy `label` prop', () => {
    renderWithTheme(<Button label="Legacy" />);
    expect(screen.getByText('Legacy')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button onPress={onPress}>Tap</Button>);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button onPress={onPress} disabled>
        Nope
      </Button>,
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress while loading and exposes a busy state', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button onPress={onPress} loading>
        Saving
      </Button>,
    );
    const button = screen.getByRole('button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button.props.accessibilityState).toMatchObject({ busy: true, disabled: true });
  });

  it('hides the label while loading and shows the loading spinner', () => {
    renderWithTheme(<Button loading>Saving</Button>);
    expect(screen.queryByText('Saving')).toBeNull();
    expect(screen.getByLabelText('Loading')).toBeTruthy();
  });

  it('exposes an accessible button role with the label as its name', () => {
    renderWithTheme(<Button>Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
  });

  it('fires a haptic on press-in by default', () => {
    renderWithTheme(<Button>Tap</Button>);
    fireEvent(screen.getByRole('button'), 'pressIn');
    expect(haptic).toHaveBeenCalledWith('light');
  });

  it('does not fire a haptic when haptic="none"', () => {
    renderWithTheme(<Button haptic="none">Quiet</Button>);
    fireEvent(screen.getByRole('button'), 'pressIn');
    expect(haptic).not.toHaveBeenCalled();
  });

  it('renders icon-only buttons using the accessibilityLabel as the name', () => {
    renderWithTheme(
      <Button iconOnly accessibilityLabel="Add" leadingIcon={<Text>+</Text>} />,
    );
    expect(screen.getByRole('button', { name: 'Add' })).toBeTruthy();
  });

  it('renders every tone × appearance combination without crashing', () => {
    const tones = ['primary', 'neutral', 'danger'] as const;
    const appearances = ['solid', 'soft', 'ghost', 'outline'] as const;
    for (const tone of tones) {
      for (const appearance of appearances) {
        const { unmount } = renderWithTheme(
          <Button tone={tone} appearance={appearance}>
            {tone}-{appearance}
          </Button>,
        );
        expect(screen.getByText(`${tone}-${appearance}`)).toBeTruthy();
        unmount();
      }
    }
  });
});
