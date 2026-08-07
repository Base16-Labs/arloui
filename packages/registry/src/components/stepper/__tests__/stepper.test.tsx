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

/**
 * The grouped layouts and tap-to-type value are one variant in practice: grouping
 * is what gives the value an edge to itself, and that is what makes it read as a
 * field you can type in.
 */
describe('Stepper — grouped controls and editing', () => {
  it('keeps both buttons and the value reachable in every controls layout', () => {
    for (const controls of ['split', 'start', 'end'] as const) {
      const { unmount } = renderWithTheme(
        <Stepper controls={controls} value={3} onValueChange={() => {}} />,
      );
      expect(screen.getByRole('button', { name: 'Increase' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Decrease' })).toBeTruthy();
      expect(screen.getByRole('adjustable').props.accessibilityValue.now).toBe(3);
      unmount();
    }
  });

  it('still steps when the buttons are grouped', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper controls="end" value={4} step={2} onValueChange={onValueChange} />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenCalledWith(6);
  });

  /**
   * The field is mounted the whole time rather than swapped in on press — that is
   * what makes tapping it behave like tapping any other input.
   */
  it('renders no text field unless editable is set', () => {
    renderWithTheme(<Stepper controls="end" value={3} onValueChange={() => {}} />);
    expect(screen.queryByTestId('stepper-value')).toBeNull();
  });

  it('renders a focusable numeric field when editable', () => {
    renderWithTheme(<Stepper controls="end" editable value={3} onValueChange={() => {}} />);

    const input = screen.getByTestId('stepper-value');
    expect(input.props.value).toBe('3');
    expect(input.props.keyboardType).toBe('number-pad');
    expect(input.props.editable).toBe(true);
  });

  it('offers a decimal keypad when the step is fractional', () => {
    renderWithTheme(
      <Stepper controls="end" editable step={0.5} value={1} onValueChange={() => {}} />,
    );
    expect(screen.getByTestId('stepper-value').props.keyboardType).toBe('decimal-pad');
  });

  it('shows the formatted value at rest and the raw number once focused', () => {
    renderWithTheme(
      <Stepper
        controls="end"
        editable
        value={1200}
        max={100000}
        onValueChange={() => {}}
        format={(v) => `$${v.toLocaleString('en-US')}`}
      />,
    );

    const input = screen.getByTestId('stepper-value');
    expect(input.props.value).toBe('$1,200');

    fireEvent(input, 'focus');
    expect(screen.getByTestId('stepper-value').props.value).toBe('1200');
  });

  it('commits a typed value, clamped to max', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper controls="end" editable value={3} max={20} onValueChange={onValueChange} />,
    );

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '45');
    fireEvent(input, 'blur');

    expect(onValueChange).toHaveBeenCalledWith(20);
  });

  it('quantizes a typed value to the step precision', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper controls="end" editable value={1} step={0.1} max={10} onValueChange={onValueChange} />,
    );

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '2.25');
    fireEvent(input, 'blur');

    expect(onValueChange).toHaveBeenCalledWith(2.3);
  });

  /** Typing letters should simply not land, rather than being rejected at commit. */
  it('keeps the draft numeric as you type', () => {
    renderWithTheme(<Stepper controls="end" editable value={1} max={999} onValueChange={() => {}} />);

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '1a2b3');
    expect(screen.getByTestId('stepper-value').props.value).toBe('123');
  });

  it('allows one decimal point only, and only for fractional steps', () => {
    const { unmount } = renderWithTheme(
      <Stepper controls="end" editable step={0.1} value={1} max={99} onValueChange={() => {}} />,
    );
    const decimal = screen.getByTestId('stepper-value');
    fireEvent(decimal, 'focus');
    fireEvent.changeText(decimal, '1.2.3');
    expect(screen.getByTestId('stepper-value').props.value).toBe('1.23');
    unmount();

    renderWithTheme(
      <Stepper controls="end" editable value={1} max={99} onValueChange={() => {}} />,
    );
    const integer = screen.getByTestId('stepper-value');
    fireEvent(integer, 'focus');
    fireEvent.changeText(integer, '1.5');
    expect(screen.getByTestId('stepper-value').props.value).toBe('15');
  });

  /**
   * Clearing the field and tapping away should mean "never mind", not "minimum" —
   * an empty draft that clamped to `min` would silently rewrite the value.
   */
  it('reverts an empty draft instead of clamping to min', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper controls="end" editable value={7} min={1} onValueChange={onValueChange} />,
    );

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '');
    fireEvent(input, 'blur');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('stepper-value').props.value).toBe('7');
  });

  it('does not accept input while disabled', () => {
    renderWithTheme(
      <Stepper controls="end" editable disabled value={3} onValueChange={() => {}} />,
    );
    expect(screen.getByTestId('stepper-value').props.editable).toBe(false);
  });

  /**
   * The regression this guards: `accessible` on the row collapses the subtree into
   * one element, and a TextInput inside a collapsed subtree never becomes first
   * responder — so tapping it raises no keyboard on a device. An editable stepper
   * has to expose its three children instead of merging them.
   */
  it('does not collapse into one accessibility element when editable', () => {
    renderWithTheme(<Stepper controls="end" editable value={5} label="Guests" onValueChange={() => {}} />);

    expect(screen.queryByRole('adjustable')).toBeNull();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeTruthy();
    expect(screen.getByTestId('stepper-value').props.accessibilityLabel).toBe('Guests');
  });

  it('still collapses into one adjustable when not editable', () => {
    renderWithTheme(<Stepper controls="end" value={5} label="Guests" onValueChange={() => {}} />);
    expect(screen.getByRole('adjustable', { name: 'Guests' })).toBeTruthy();
  });
});
