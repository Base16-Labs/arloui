import { jest } from '@jest/globals';
import { Toggle } from '../toggle';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('Toggle', () => {
  it('renders as a switch with checked false', () => {
    renderWithTheme(<Toggle value={false} accessibilityLabel="Notifications" />);
    const sw = screen.getByRole('switch');
    expect(sw).toBeTruthy();
    expect(sw.props.accessibilityState).toMatchObject({ checked: false });
  });

  it('renders checked true when value is true', () => {
    renderWithTheme(<Toggle value={true} accessibilityLabel="Notifications" />);
    expect(screen.getByRole('switch').props.accessibilityState).toMatchObject({ checked: true });
  });

  it('calls onValueChange with the opposite value on press', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Toggle value={false} onValueChange={onValueChange} accessibilityLabel="Notifications" />,
    );
    fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('toggles from true to false on press', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Toggle value={true} onValueChange={onValueChange} accessibilityLabel="Dark mode" />,
    );
    fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('does not call onValueChange when disabled', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Toggle value={false} onValueChange={onValueChange} disabled accessibilityLabel="Off" />,
    );
    fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('exposes disabled in accessibility state', () => {
    renderWithTheme(<Toggle value={false} disabled accessibilityLabel="Off" />);
    expect(screen.getByRole('switch').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('renders both sizes without crashing', () => {
    for (const size of ['sm', 'md'] as const) {
      const { unmount } = renderWithTheme(
        <Toggle value={false} size={size} accessibilityLabel={size} />,
      );
      expect(screen.getByRole('switch')).toBeTruthy();
      unmount();
    }
  });
});
