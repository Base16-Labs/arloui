import { jest } from '@jest/globals';
import { useState } from 'react';
import { Stepper } from '../stepper';
import { act, fireEvent, renderWithTheme, screen } from '../../../../test/render';

/** Drives the stepper as a real consumer would, so repeat/clamping see live values. */
function ControlledStepper({ initial = 0, max = 100, holdToRepeat = true }) {
  const [value, setValue] = useState(initial);
  return (
    <Stepper value={value} max={max} holdToRepeat={holdToRepeat} onValueChange={setValue} />
  );
}

describe('Stepper', () => {
  it('increments and decrements by the step', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Stepper value={4} step={2} onValueChange={onValueChange} />);

    fireEvent.press(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenCalledWith(6);

    onValueChange.mockClear();
    fireEvent.press(screen.getByRole('button', { name: 'Decrease' }));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it('clamps at min and max and disables the button that would overshoot', () => {
    const onValueChange = jest.fn();
    const { rerender } = renderWithTheme(
      <Stepper value={0} min={0} max={3} onValueChange={onValueChange} />,
    );

    expect(screen.getByRole('button', { name: 'Decrease' }).props.accessibilityState).toMatchObject(
      { disabled: true },
    );
    fireEvent.press(screen.getByRole('button', { name: 'Decrease' }));
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(<Stepper value={3} min={0} max={3} onValueChange={onValueChange} />);
    expect(screen.getByRole('button', { name: 'Increase' }).props.accessibilityState).toMatchObject(
      { disabled: true },
    );
    fireEvent.press(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('exposes an adjustable role with the current value and responds to a11y actions', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper value={2} min={1} max={9} label="Guests" onValueChange={onValueChange} />,
    );

    const control = screen.getByRole('adjustable', { name: 'Guests' });
    expect(control.props.accessibilityValue).toMatchObject({ min: 1, max: 9, now: 2, text: '2' });

    fireEvent(control, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onValueChange).toHaveBeenCalledWith(3);

    onValueChange.mockClear();
    fireEvent(control, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it('avoids floating-point drift on fractional steps', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Stepper value={0.2} step={0.1} onValueChange={onValueChange} />);

    fireEvent.press(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenCalledWith(0.3);
  });

  it('renders the formatted value one character at a time', () => {
    renderWithTheme(
      <Stepper value={1200} onValueChange={() => {}} format={(v) => `$${v.toLocaleString()}`} />,
    );

    // Separators and symbols render as their own slots alongside the digit columns.
    // They're hidden from assistive tech on purpose — the control announces the whole
    // value via accessibilityValue — so the query has to opt into hidden elements.
    const opts = { includeHiddenElements: true };
    expect(screen.getAllByText('$', opts).length).toBeGreaterThan(0);
    expect(screen.getAllByText(',', opts).length).toBeGreaterThan(0);
    expect(screen.getByRole('adjustable').props.accessibilityValue.text).toBe('$1,200');
  });

  it('does not double-step when a hold is released', () => {
    jest.useFakeTimers();
    try {
      renderWithTheme(<ControlledStepper />);
      const increase = screen.getByRole('button', { name: 'Increase' });

      fireEvent(increase, 'pressIn');
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      const held = Number(screen.getByRole('adjustable').props.accessibilityValue.now);

      // Pressable fires onPress on release even after a hold; the repeat already
      // counted that release's worth of steps.
      fireEvent(increase, 'pressOut');
      fireEvent.press(increase);
      expect(screen.getByRole('adjustable').props.accessibilityValue.now).toBe(held);
    } finally {
      jest.useRealTimers();
    }
  });

  it('renders label and helper text in both appearances', () => {
    const { rerender } = renderWithTheme(
      <Stepper value={1} onValueChange={() => {}} label="Quantity" helper="In stock: 12" />,
    );
    expect(screen.getByText('Quantity')).toBeTruthy();
    expect(screen.getByText('In stock: 12')).toBeTruthy();

    rerender(
      <Stepper
        appearance="plain"
        value={1}
        onValueChange={() => {}}
        label="Amount"
        helper="Tap to adjust"
      />,
    );
    expect(screen.getByText('Amount')).toBeTruthy();
    expect(screen.getByText('Tap to adjust')).toBeTruthy();
  });

  it('marks both buttons disabled when the stepper is disabled', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Stepper value={5} disabled onValueChange={onValueChange} />);

    fireEvent.press(screen.getByRole('button', { name: 'Increase' }));
    fireEvent.press(screen.getByRole('button', { name: 'Decrease' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('repeats while a button is held and stops on release', () => {
    jest.useFakeTimers();
    try {
      renderWithTheme(<ControlledStepper />);
      const increase = screen.getByRole('button', { name: 'Increase' });

      fireEvent(increase, 'pressIn');
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      const held = Number(screen.getByRole('adjustable').props.accessibilityValue.now);
      expect(held).toBeGreaterThan(1);

      fireEvent(increase, 'pressOut');
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(screen.getByRole('adjustable').props.accessibilityValue.now).toBe(held);
    } finally {
      jest.useRealTimers();
    }
  });

  it('does not repeat when holdToRepeat is off', () => {
    jest.useFakeTimers();
    try {
      renderWithTheme(<ControlledStepper holdToRepeat={false} />);
      const increase = screen.getByRole('button', { name: 'Increase' });

      fireEvent(increase, 'pressIn');
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(screen.getByRole('adjustable').props.accessibilityValue.now).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
});
