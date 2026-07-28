import { jest } from '@jest/globals';
import { AccessibilityInfo, Text } from 'react-native';
import { Toast } from '../toast';
import { renderWithTheme, screen, fireEvent, act, waitFor } from '../../../../test/render';

describe('Toast', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('renders when visible', async () => {
    renderWithTheme(<Toast visible message="Saved" onDismiss={jest.fn()} />);
    await waitFor(() => expect(screen.getByText('Saved')).toBeTruthy());
  });

  it('does not render when not visible and never mounted', () => {
    renderWithTheme(<Toast visible={false} message="Hidden" onDismiss={jest.fn()} />);
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('uses assertive live region for screen readers', async () => {
    renderWithTheme(<Toast visible message="Alert" onDismiss={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Alert').props.accessibilityLiveRegion).toBe('assertive');
    });
  });

  it('uses custom accessibilityLabel when provided', async () => {
    renderWithTheme(
      <Toast visible message="Done" accessibilityLabel="Task complete" onDismiss={jest.fn()} />,
    );
    await waitFor(() => expect(screen.getByLabelText('Task complete')).toBeTruthy());
  });

  it('falls back to message as accessibilityLabel', async () => {
    renderWithTheme(<Toast visible message="Copied" onDismiss={jest.fn()} />);
    await waitFor(() => expect(screen.getByLabelText('Copied')).toBeTruthy());
  });

  it('renders an icon when provided', async () => {
    renderWithTheme(
      <Toast
        visible
        message="Success"
        icon={<Text testID="check-icon">✓</Text>}
        onDismiss={jest.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByTestId('check-icon')).toBeTruthy());
  });

  it('renders a dismiss button when showDismiss is true', async () => {
    renderWithTheme(
      <Toast visible message="Error" showDismiss onDismiss={jest.fn()} />,
    );
    await waitFor(() => expect(screen.getByLabelText('Dismiss')).toBeTruthy());
  });

  it('calls onDismiss when dismiss button is pressed', async () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    renderWithTheme(
      <Toast visible message="Error" showDismiss duration={0} onDismiss={onDismiss} />,
    );
    await waitFor(() => expect(screen.getByLabelText('Dismiss')).toBeTruthy());
    fireEvent.press(screen.getByLabelText('Dismiss'));
    act(() => { jest.runAllTimers(); });
    expect(onDismiss).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('auto-dismisses after the default duration', async () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    renderWithTheme(<Toast visible message="Auto" onDismiss={onDismiss} />);
    await waitFor(() => expect(screen.getByText('Auto')).toBeTruthy());
    act(() => { jest.advanceTimersByTime(5000); });
    act(() => { jest.runAllTimers(); });
    expect(onDismiss).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('does not auto-dismiss when duration is 0', async () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    renderWithTheme(<Toast visible message="Persist" duration={0} onDismiss={onDismiss} />);
    await waitFor(() => expect(screen.getByText('Persist')).toBeTruthy());
    act(() => { jest.advanceTimersByTime(10000); });
    expect(onDismiss).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('renders with top position', async () => {
    renderWithTheme(
      <Toast visible message="Top" position="top" onDismiss={jest.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('Top')).toBeTruthy());
  });

  it('renders with same colorStyle', async () => {
    renderWithTheme(
      <Toast visible message="Same" colorStyle="same" onDismiss={jest.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('Same')).toBeTruthy());
  });

  it('supports imperative dismiss via ref', async () => {
    jest.useFakeTimers();
    const ref = { current: null } as React.RefObject<{ dismiss: () => void } | null>;
    const onDismiss = jest.fn();
    renderWithTheme(
      <Toast ref={ref} visible message="Ref" duration={0} onDismiss={onDismiss} />,
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    act(() => { ref.current!.dismiss(); });
    act(() => { jest.runAllTimers(); });
    expect(onDismiss).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('unmounts when visible changes to false', async () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    const { rerender } = renderWithTheme(
      <Toast visible message="Going" duration={0} onDismiss={onDismiss} />,
    );
    await waitFor(() => expect(screen.getByText('Going')).toBeTruthy());
    rerender(<Toast visible={false} message="Going" duration={0} onDismiss={onDismiss} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.queryByText('Going')).toBeNull();
    jest.useRealTimers();
  });

  it('works with reduce-motion enabled', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as ReturnType<typeof AccessibilityInfo.addEventListener>);
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    renderWithTheme(
      <Toast visible message="Reduced" showDismiss duration={0} onDismiss={onDismiss} />,
    );
    await waitFor(() => expect(screen.getByText('Reduced')).toBeTruthy());
    fireEvent.press(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('applies custom style prop', async () => {
    renderWithTheme(
      <Toast visible message="Styled" style={{ marginTop: 10 }} onDismiss={jest.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('Styled')).toBeTruthy());
  });
});
