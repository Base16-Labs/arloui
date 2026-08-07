import { jest } from '@jest/globals';

// Spy on the haptics helper without pulling in the real expo-haptics native call.
jest.mock('../../../foundation/haptics', () => ({
  haptic: jest.fn(),
}));

import { StyleSheet, Text, View } from 'react-native';
import { haptic } from '../../../foundation/haptics';
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

  describe('press feedback overlay', () => {
    /** The only non-null-styled `pointerEvents="none"` layer inside the button. */
    function findOverlay() {
      return screen.UNSAFE_root
        .findAll((node) => node.props?.pointerEvents === 'none' && node.props?.style != null)
        .at(0);
    }

    it('covers the button while pressed', () => {
      renderWithTheme(<Button>Continue</Button>);
      const button = screen.getByRole('button', { name: 'Continue' });

      // Nothing to see until the press starts.
      expect(findOverlay()).toBeUndefined();

      fireEvent(button, 'pressIn');
      const overlay = findOverlay();
      expect(overlay).toBeDefined();

      // The regression this guards: `StyleSheet.absoluteFillObject` was removed in
      // RN 0.86, and a missing style constant is `undefined`, which RN silently
      // drops from a style array. The overlay stayed mounted with a background
      // colour but no geometry, so it painted nothing and press feedback appeared
      // broken with no crash or warning. Assert it actually fills its parent.
      const style = StyleSheet.flatten(overlay?.props.style) as Record<string, unknown>;
      expect(style.position).toBe('absolute');
      expect(style.top).toBe(0);
      expect(style.right).toBe(0);
      expect(style.bottom).toBe(0);
      expect(style.left).toBe(0);
      expect(style.backgroundColor).toBeTruthy();
    });

    it('removes the overlay when the press ends', () => {
      renderWithTheme(<Button>Continue</Button>);
      const button = screen.getByRole('button', { name: 'Continue' });

      fireEvent(button, 'pressIn');
      expect(findOverlay()).toBeDefined();

      fireEvent(button, 'pressOut');
      expect(findOverlay()).toBeUndefined();
    });

    it('does not paint feedback on a disabled button', () => {
      renderWithTheme(<Button disabled>Continue</Button>);
      fireEvent(screen.getByRole('button', { name: 'Continue' }), 'pressIn');
      expect(findOverlay()).toBeUndefined();
    });
  });
});
