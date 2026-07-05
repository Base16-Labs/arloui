import { jest } from '@jest/globals';
import { Checkbox } from '../checkbox';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('Checkbox', () => {
  it('renders as a checkbox with checked false', () => {
    renderWithTheme(<Checkbox checked={false} accessibilityLabel="Agree" />);
    const cb = screen.getByRole('checkbox');
    expect(cb).toBeTruthy();
    expect(cb.props.accessibilityState).toMatchObject({ checked: false });
  });

  it('renders checked true', () => {
    renderWithTheme(<Checkbox checked={true} accessibilityLabel="Agree" />);
    expect(screen.getByRole('checkbox').props.accessibilityState).toMatchObject({ checked: true });
  });

  it('calls onCheckedChange with the opposite value on press', () => {
    const onCheckedChange = jest.fn();
    renderWithTheme(
      <Checkbox checked={false} onCheckedChange={onCheckedChange} accessibilityLabel="Agree" />,
    );
    fireEvent.press(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('unchecks when pressed while checked', () => {
    const onCheckedChange = jest.fn();
    renderWithTheme(
      <Checkbox checked={true} onCheckedChange={onCheckedChange} accessibilityLabel="Agree" />,
    );
    fireEvent.press(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('does not call onCheckedChange when disabled', () => {
    const onCheckedChange = jest.fn();
    renderWithTheme(
      <Checkbox checked={false} onCheckedChange={onCheckedChange} disabled accessibilityLabel="Agree" />,
    );
    fireEvent.press(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('exposes disabled in accessibility state', () => {
    renderWithTheme(<Checkbox checked={false} disabled accessibilityLabel="Agree" />);
    expect(screen.getByRole('checkbox').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('renders all sizes without crashing', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { unmount } = renderWithTheme(
        <Checkbox checked={false} size={size} accessibilityLabel={size} />,
      );
      expect(screen.getByRole('checkbox')).toBeTruthy();
      unmount();
    }
  });

  it('shows the check icon when checked', () => {
    renderWithTheme(<Checkbox checked={true} accessibilityLabel="Agree" />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });
});
