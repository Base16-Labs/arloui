import { jest } from '@jest/globals';
import { Radio } from '../radio';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('Radio', () => {
  it('renders as a radio with selected false', () => {
    renderWithTheme(<Radio selected={false} accessibilityLabel="Option A" />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeTruthy();
    expect(radio.props.accessibilityState).toMatchObject({ selected: false });
  });

  it('renders selected true', () => {
    renderWithTheme(<Radio selected={true} accessibilityLabel="Option A" />);
    expect(screen.getByRole('radio').props.accessibilityState).toMatchObject({ selected: true });
  });

  it('calls onSelect on press when not selected', () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <Radio selected={false} onSelect={onSelect} accessibilityLabel="Option A" />,
    );
    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not call onSelect when already selected', () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <Radio selected={true} onSelect={onSelect} accessibilityLabel="Option A" />,
    );
    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <Radio selected={false} onSelect={onSelect} disabled accessibilityLabel="Option A" />,
    );
    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('exposes disabled in accessibility state', () => {
    renderWithTheme(<Radio selected={false} disabled accessibilityLabel="Option A" />);
    expect(screen.getByRole('radio').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('renders all sizes without crashing', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { unmount } = renderWithTheme(
        <Radio selected={false} size={size} accessibilityLabel={size} />,
      );
      expect(screen.getByRole('radio')).toBeTruthy();
      unmount();
    }
  });

  it('renders filled appearance unselected', () => {
    renderWithTheme(
      <Radio selected={false} appearance="filled" accessibilityLabel="Option A" />,
    );
    expect(screen.getByRole('radio').props.accessibilityState).toMatchObject({ selected: false });
  });

  it('renders filled appearance selected', () => {
    renderWithTheme(
      <Radio selected={true} appearance="filled" accessibilityLabel="Option A" />,
    );
    expect(screen.getByRole('radio').props.accessibilityState).toMatchObject({ selected: true });
  });

  it('calls onSelect in filled appearance', () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <Radio selected={false} appearance="filled" onSelect={onSelect} accessibilityLabel="Option A" />,
    );
    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
