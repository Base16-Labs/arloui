import { jest } from '@jest/globals';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Stepper } from '../stepper';
import { act, fireEvent, renderWithTheme, screen } from '../../../../test/render';

/**
 * Resolve whatever shape the field's `style` is in. It is an array — the overlay
 * composes `StyleSheet.absoluteFill` with its own rules — and asserting on the
 * raw prop would tie these tests to that composition rather than to the resolved
 * style, which is the thing that actually reaches the platform.
 */
function styleOf(node: { props: { style: unknown } }) {
  return StyleSheet.flatten(node.props.style as never) as Record<string, unknown>;
}

/** Drives the stepper as a real consumer would, so repeat sees live values. */
function ControlledStepper({ initial = 0, holdToRepeat = true }) {
  const [value, setValue] = useState(initial);
  return <Stepper value={value} holdToRepeat={holdToRepeat} onValueChange={setValue} />;
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

  it('floors at min and disables the button that would undershoot', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Stepper value={0} min={0} onValueChange={onValueChange} />);

    expect(screen.getByRole('button', { name: 'Decrease' }).props.accessibilityState).toMatchObject(
      { disabled: true },
    );
    fireEvent.press(screen.getByRole('button', { name: 'Decrease' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  /**
   * There is no ceiling to disable at, so increment stays live however high the value
   * goes. This is the counterpart to the floor above: the asymmetry is the contract,
   * not an oversight.
   */
  it('never disables increment, however high the value', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Stepper value={Number.MAX_SAFE_INTEGER} min={0} onValueChange={onValueChange} />);

    expect(screen.getByRole('button', { name: 'Increase' }).props.accessibilityState).not.toMatchObject(
      { disabled: true },
    );
  });

  it('exposes an adjustable role with the current value and responds to a11y actions', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper value={2} min={1} label="Guests" onValueChange={onValueChange} />,
    );

    const control = screen.getByRole('adjustable', { name: 'Guests' });
    expect(control.props.accessibilityValue).toMatchObject({ min: 1, now: 2, text: '2' });
    expect(control.props.accessibilityValue.max).toBeUndefined();

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

  /**
   * The runaway. Press-in is not guaranteed to be paired with the press-out before
   * it — tapping fast, tapping with two fingers, or going plus-then-minus all deliver
   * a second press-in first. Each one used to overwrite the stored timer handle and
   * orphan the previous chain, which then rescheduled itself forever with nothing
   * holding its handle, so the value climbed on its own with no finger on the button
   * and every extra tap added another chain driving it.
   */
  it('stops dead on release however many press-ins arrived first', () => {
    jest.useFakeTimers();
    try {
      renderWithTheme(<ControlledStepper />);
      const increase = screen.getByRole('button', { name: 'Increase' });

      for (let i = 0; i < 5; i += 1) fireEvent(increase, 'pressIn');
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      fireEvent(increase, 'pressOut');
      const settled = Number(screen.getByRole('adjustable').props.accessibilityValue.now);
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(screen.getByRole('adjustable').props.accessibilityValue.now).toBe(settled);
    } finally {
      jest.useRealTimers();
    }
  });

  /** Same leak, reached by swapping direction mid-hold instead of by re-pressing. */
  it('does not leave the old direction running when the other button is pressed', () => {
    jest.useFakeTimers();
    try {
      renderWithTheme(<ControlledStepper initial={500} />);
      const increase = screen.getByRole('button', { name: 'Increase' });
      const decrease = screen.getByRole('button', { name: 'Decrease' });

      fireEvent(increase, 'pressIn');
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      // No press-out for `increase` — the second press-in is all that arrives.
      fireEvent(decrease, 'pressIn');
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      fireEvent(decrease, 'pressOut');

      const settled = Number(screen.getByRole('adjustable').props.accessibilityValue.now);
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(screen.getByRole('adjustable').props.accessibilityValue.now).toBe(settled);
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
  it('renders no text field unless allowTyping is set', () => {
    renderWithTheme(<Stepper controls="end" value={3} onValueChange={() => {}} />);
    expect(screen.queryByTestId('stepper-value')).toBeNull();
  });

  it('renders a focusable numeric field when allowTyping is on', () => {
    renderWithTheme(<Stepper controls="end" allowTyping value={3} onValueChange={() => {}} />);

    const input = screen.getByTestId('stepper-value');
    expect(input.props.value).toBe('3');
    expect(input.props.keyboardType).toBe('number-pad');
    expect(input.props.editable).toBe(true);
  });

  it('offers a decimal keypad when the step is fractional', () => {
    renderWithTheme(
      <Stepper controls="end" allowTyping step={0.5} value={1} onValueChange={() => {}} />,
    );
    expect(screen.getByTestId('stepper-value').props.keyboardType).toBe('decimal-pad');
  });

  it('shows the formatted value at rest and the raw number once focused', () => {
    renderWithTheme(
      <Stepper
        controls="end"
        allowTyping
        value={1200}
       
        onValueChange={() => {}}
        format={(v) => `$${v.toLocaleString('en-US')}`}
      />,
    );

    const input = screen.getByTestId('stepper-value');
    expect(input.props.value).toBe('$1,200');

    fireEvent(input, 'focus');
    expect(screen.getByTestId('stepper-value').props.value).toBe('1200');
  });

  /**
   * The whole point of dropping `max`: whatever is typed is what commits. A field
   * that quietly replaced 45 with a limit read as the stepper fighting the user.
   */
  it('commits a typed value as typed, however large', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper controls="end" allowTyping value={3} onValueChange={onValueChange} />,
    );

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '45');
    fireEvent(input, 'blur');

    expect(onValueChange).toHaveBeenCalledWith(45);
  });

  it('still floors a typed value at min', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper controls="end" allowTyping value={8} min={5} onValueChange={onValueChange} />,
    );

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '1');
    fireEvent(input, 'blur');

    expect(onValueChange).toHaveBeenCalledWith(5);
  });

  it('quantizes a typed value to the step precision', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Stepper controls="end" allowTyping value={1} step={0.1} onValueChange={onValueChange} />,
    );

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '2.25');
    fireEvent(input, 'blur');

    expect(onValueChange).toHaveBeenCalledWith(2.3);
  });

  /** Typing letters should simply not land, rather than being rejected at commit. */
  it('keeps the draft numeric as you type', () => {
    renderWithTheme(<Stepper controls="end" allowTyping value={1} onValueChange={() => {}} />);

    const input = screen.getByTestId('stepper-value');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '1a2b3');
    expect(screen.getByTestId('stepper-value').props.value).toBe('123');
  });

  it('allows one decimal point only, and only for fractional steps', () => {
    const { unmount } = renderWithTheme(
      <Stepper controls="end" allowTyping step={0.1} value={1} onValueChange={() => {}} />,
    );
    const decimal = screen.getByTestId('stepper-value');
    fireEvent(decimal, 'focus');
    fireEvent.changeText(decimal, '1.2.3');
    expect(screen.getByTestId('stepper-value').props.value).toBe('1.23');
    unmount();

    renderWithTheme(
      <Stepper controls="end" allowTyping value={1} onValueChange={() => {}} />,
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
      <Stepper controls="end" allowTyping value={7} min={1} onValueChange={onValueChange} />,
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
      <Stepper controls="end" allowTyping disabled value={3} onValueChange={() => {}} />,
    );
    expect(screen.getByTestId('stepper-value').props.editable).toBe(false);
  });

  /**
   * The regression this guards: `accessible` on the row collapses the subtree into
   * one element, and a TextInput inside a collapsed subtree never becomes first
   * responder — so tapping it raises no keyboard on a device. A typed stepper
   * has to expose its three children instead of merging them.
   */
  it('does not collapse into one accessibility element when typing is allowed', () => {
    renderWithTheme(<Stepper controls="end" allowTyping value={5} label="Guests" onValueChange={() => {}} />);

    expect(screen.queryByRole('adjustable')).toBeNull();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeTruthy();
    expect(screen.getByTestId('stepper-value').props.accessibilityLabel).toBe('Guests');
  });

  it('still collapses into one adjustable when typing is off', () => {
    renderWithTheme(<Stepper controls="end" value={5} label="Guests" onValueChange={() => {}} />);
    expect(screen.getByRole('adjustable', { name: 'Guests' })).toBeTruthy();
  });

  describe('controls="none"', () => {
    it('renders the value with no stepper buttons', () => {
      renderWithTheme(<Stepper controls="none" value={4} onValueChange={() => {}} />);
      expect(screen.queryByRole('button')).toBeNull();
      // The counter renders per character and hides itself from assistive tech.
      expect(screen.getByText('4', { includeHiddenElements: true })).toBeTruthy();
    });

    it('keeps both buttons for every other arrangement', () => {
      for (const controls of ['split', 'start', 'end'] as const) {
        const { unmount } = renderWithTheme(
          <Stepper controls={controls} value={4} onValueChange={() => {}} />,
        );
        expect(screen.getAllByRole('button')).toHaveLength(2);
        unmount();
      }
    });

    /**
     * Without buttons there is nothing to adjust by touch, so announcing it as an
     * adjustable would hand assistive tech an affordance no sighted user has.
     */
    it('announces itself as a readout rather than an adjustable', () => {
      renderWithTheme(
        <Stepper controls="none" value={4} label="Guests" onValueChange={() => {}} />,
      );
      expect(screen.queryByRole('adjustable')).toBeNull();
      expect(screen.getByLabelText('Guests').props.accessibilityValue).toMatchObject({ text: '4' });
    });

    it('still takes a typed value when typing is allowed', () => {
      const onValueChange = jest.fn();
      renderWithTheme(
        <Stepper controls="none" allowTyping value={4} onValueChange={onValueChange} />,
      );
      const input = screen.getByTestId('stepper-value');
      fireEvent(input, 'focus');
      fireEvent.changeText(input, '17');
      fireEvent(input, 'blur');
      expect(onValueChange).toHaveBeenCalledWith(17);
    });
  });

  describe('the rolling counter', () => {
    /**
     * The counter used to be swapped out for the text field whenever typing was
     * allowed, so those steppers snapped between values instead of rolling. It now
     * sits over a permanently mounted field and only yields once that field has
     * focus.
     */
    it('shows the counter over the field while it is blurred', () => {
      renderWithTheme(
        <Stepper controls="end" allowTyping value={12} onValueChange={() => {}} />,
      );
      // Both are present: the counter paints, the field underneath stays tappable.
      expect(screen.getByTestId('stepper-value')).toBeTruthy();
      // The counter stacks each digit's neighbours to roll between them, so a
      // glyph can legitimately appear more than once.
      expect(screen.getAllByText('1', { includeHiddenElements: true }).length).toBeGreaterThan(0);
      expect(screen.getAllByText('2', { includeHiddenElements: true }).length).toBeGreaterThan(0);
    });

    /**
     * The field never paints its own glyphs — blurred or focused, the counter is
     * what you see. Handing over to plain text on focus is what made a typed value
     * snap instead of roll.
     */
    it('keeps the field transparent so the counter draws every state', () => {
      renderWithTheme(<Stepper controls="end" allowTyping value={12} onValueChange={() => {}} />);
      const input = screen.getByTestId('stepper-value');
      expect(styleOf(input).color).toBe('transparent');

      fireEvent(input, 'focus');
      expect(styleOf(screen.getByTestId('stepper-value')).color).toBe('transparent');
    });

    /**
     * With the text invisible the caret is the only thing the field still draws,
     * and each platform sources it differently. `selectionColor` also tints the
     * selection highlight, so it has to be the accent — ink there gave the stepper
     * a dark selection band nothing else in the library has.
     */
    it('tints the caret and selection with the accent rather than the ink', () => {
      renderWithTheme(<Stepper controls="end" allowTyping value={12} onValueChange={() => {}} />);
      const input = screen.getByTestId('stepper-value');
      expect(input.props.selectionColor).toBeTruthy();
      expect(input.props.selectionColor).not.toBe('transparent');
      // iOS reads selectionColor, Android cursorColor — they must agree.
      expect(input.props.cursorColor).toBe(input.props.selectionColor);
    });

    /**
     * Selecting the whole value instead would highlight glyphs the field isn't
     * painting, and leave the caret at the left of a number about to be appended
     * to. The placement is released straight after so taps can move it freely.
     */
    /**
     * There is no ceiling at all — the prop is gone. A stepper must keep whatever is
     * typed into it; a cap anywhere in here would read as the field silently
     * rewriting your number.
     */
    it('keeps a large typed value', () => {
      const onValueChange = jest.fn();
      renderWithTheme(
        <Stepper controls="end" allowTyping value={2} onValueChange={onValueChange} min={0} />,
      );
      const input = screen.getByTestId('stepper-value');
      fireEvent(input, 'focus');
      fireEvent.changeText(input, '48250');
      fireEvent(input, 'blur');
      expect(onValueChange).toHaveBeenCalledWith(48250);
    });

    it('drops the caret at the end of the value on focus', () => {
      renderWithTheme(<Stepper controls="end" allowTyping value={247} onValueChange={() => {}} />);
      const input = screen.getByTestId('stepper-value');
      expect(input.props.selectTextOnFocus).toBeFalsy();

      fireEvent(input, 'focus');
      expect(screen.getByTestId('stepper-value').props.selection).toEqual({ start: 3, end: 3 });
    });

    /**
     * A plain stepper hugs its content. Forcing the field to the full slot width
     * pushed the buttons out to the screen edges the moment typing was allowed.
     */
    it('does not stretch a plain stepper to fill its row', () => {
      renderWithTheme(
        <Stepper appearance="plain" allowTyping value={2} onValueChange={() => {}} />,
      );
      const input = screen.getByTestId('stepper-value');
      // The field is laid over the counter, which is what sizes the value.
      expect(styleOf(input).width).toBeUndefined();
      expect(styleOf(input).position).toBe('absolute');
    });

    it('rolls the counter through the draft as digits are typed', () => {
      renderWithTheme(<Stepper controls="end" allowTyping value={1} onValueChange={() => {}} />);
      const input = screen.getByTestId('stepper-value');
      fireEvent(input, 'focus');
      fireEvent.changeText(input, '47');

      // The counter is showing the draft, not the committed value.
      const opts = { includeHiddenElements: true };
      expect(screen.getAllByText('4', opts).length).toBeGreaterThan(0);
      expect(screen.getAllByText('7', opts).length).toBeGreaterThan(0);
    });
  });
});
