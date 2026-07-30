import { jest } from '@jest/globals';
import { Text } from 'react-native';
import { Toaster, toast, dismissToast, resetToasts } from '../toaster';
import { renderWithTheme, screen, fireEvent, act, waitFor } from '../../../../test/render';

describe('Toaster', () => {
  beforeEach(() => {
    act(() => resetToasts());
  });

  afterEach(() => {
    act(() => resetToasts());
    jest.restoreAllMocks();
  });

  it('renders nothing until a toast is queued', () => {
    renderWithTheme(<Toaster />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('stacks multiple toasts instead of replacing the live one', async () => {
    renderWithTheme(<Toaster />);
    act(() => {
      toast('First');
      toast('Second');
      toast('Third');
    });
    await waitFor(() => expect(screen.getByText('First')).toBeTruthy());
    expect(screen.getByText('Second')).toBeTruthy();
    expect(screen.getByText('Third')).toBeTruthy();
  });

  it('keeps toasts past the visible window mounted so they can surface later', async () => {
    renderWithTheme(<Toaster visibleToasts={2} />);
    act(() => {
      toast('One');
      toast('Two');
      toast('Three');
    });
    await waitFor(() => expect(screen.getByText('One')).toBeTruthy());
    expect(screen.getByText('Three')).toBeTruthy();
  });

  it('returns an id and dismisses that toast only', async () => {
    jest.useFakeTimers();
    renderWithTheme(<Toaster />);
    let id = '';
    act(() => {
      id = toast('Doomed', { duration: 0 });
      toast('Survivor', { duration: 0 });
    });
    await waitFor(() => expect(screen.getByText('Doomed')).toBeTruthy());

    act(() => dismissToast(id));
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByText('Doomed')).toBeNull();
    expect(screen.getByText('Survivor')).toBeTruthy();
    jest.useRealTimers();
  });

  it('dismisses every toast when called without an id', async () => {
    jest.useFakeTimers();
    renderWithTheme(<Toaster />);
    act(() => {
      toast('A', { duration: 0 });
      toast('B', { duration: 0 });
    });
    await waitFor(() => expect(screen.getByText('A')).toBeTruthy());

    act(() => dismissToast());
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByText('A')).toBeNull();
    expect(screen.queryByText('B')).toBeNull();
    jest.useRealTimers();
  });

  it('replaces a toast in place when the same id is reused', async () => {
    renderWithTheme(<Toaster />);
    act(() => {
      toast('Uploading', { id: 'upload', duration: 0 });
    });
    await waitFor(() => expect(screen.getByText('Uploading')).toBeTruthy());

    act(() => {
      toast('Uploaded', { id: 'upload', duration: 0 });
    });

    await waitFor(() => expect(screen.getByText('Uploaded')).toBeTruthy());
    expect(screen.queryByText('Uploading')).toBeNull();
  });

  it('auto-dismisses each toast on its own timer', async () => {
    jest.useFakeTimers();
    renderWithTheme(<Toaster />);
    act(() => {
      toast('Fleeting', { duration: 1000 });
      toast('Lasting', { duration: 8000 });
    });
    await waitFor(() => expect(screen.getByText('Fleeting')).toBeTruthy());

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('Fleeting')).toBeNull();
    expect(screen.getByText('Lasting')).toBeTruthy();
    jest.useRealTimers();
  });

  it('holds the timer of a buried toast until it surfaces', async () => {
    jest.useFakeTimers();
    renderWithTheme(<Toaster visibleToasts={1} />);
    act(() => {
      toast('Buried', { duration: 1000 });
      toast('Front', { duration: 1000 });
    });
    await waitFor(() => expect(screen.getByText('Buried')).toBeTruthy());

    // Front expires; Buried has not started counting down yet.
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('Front')).toBeNull();
    expect(screen.getByText('Buried')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('Buried')).toBeNull();
    jest.useRealTimers();
  });

  it('passes per-toast options through', async () => {
    renderWithTheme(<Toaster />);
    act(() => {
      toast('Saved', {
        showDismiss: true,
        icon: <Text testID="toast-icon">✓</Text>,
        accessibilityLabel: 'Saved successfully',
      });
    });
    await waitFor(() => expect(screen.getByTestId('toast-icon')).toBeTruthy());
    expect(screen.getByLabelText('Saved successfully')).toBeTruthy();
    expect(screen.getByLabelText('Dismiss')).toBeTruthy();
  });

  it('removes a toast when its close button is pressed', async () => {
    jest.useFakeTimers();
    renderWithTheme(<Toaster />);
    act(() => {
      toast('Closable', { showDismiss: true, duration: 0 });
    });
    await waitFor(() => expect(screen.getByLabelText('Dismiss')).toBeTruthy());

    fireEvent.press(screen.getByLabelText('Dismiss'));
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByText('Closable')).toBeNull();
    jest.useRealTimers();
  });

  it('renders at the top edge when positioned there', async () => {
    renderWithTheme(<Toaster position="top" topInset={44} />);
    act(() => {
      toast('Up top');
    });
    await waitFor(() => expect(screen.getByText('Up top')).toBeTruthy());
  });
});
