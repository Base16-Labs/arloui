import { jest } from '@jest/globals';

jest.mock('@arloui/utils', () => ({
  ...jest.requireActual('@arloui/utils'),
  haptic: jest.fn(),
}));

import { SocialAuthButton } from '../social-auth-button';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('SocialAuthButton', () => {
  it('renders the fixed label for each platform', () => {
    const cases = [
      ['google', 'Sign in with Google'],
      ['apple', 'Sign in with Apple'],
      ['facebook', 'Sign in with Facebook'],
      ['x', 'Sign in with X'],
    ] as const;
    for (const [platform, label] of cases) {
      const { unmount } = renderWithTheme(<SocialAuthButton platform={platform} />);
      expect(screen.getByText(label)).toBeTruthy();
      unmount();
    }
  });

  it('defaults to Google when no platform is given', () => {
    renderWithTheme(<SocialAuthButton />);
    expect(screen.getByText('Sign in with Google')).toBeTruthy();
  });

  it('calls onPress', () => {
    const onPress = jest.fn();
    renderWithTheme(<SocialAuthButton platform="apple" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders both fill and secondary types', () => {
    for (const type of ['fill', 'secondary'] as const) {
      const { unmount } = renderWithTheme(<SocialAuthButton platform="google" type={type} />);
      expect(screen.getByText('Sign in with Google')).toBeTruthy();
      unmount();
    }
  });
});
