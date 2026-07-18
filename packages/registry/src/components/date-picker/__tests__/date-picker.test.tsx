import { jest } from '@jest/globals';
import { DatePicker } from '../date-picker';
import { DateWheelPicker } from '../date-wheel-picker';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

describe('DatePicker', () => {
  const june = new Date(2026, 5, 1);

  it('renders a month and all seven weekday labels', () => {
    renderWithTheme(<DatePicker defaultDisplayedMonth={june} />);
    expect(screen.getByRole('header', { name: 'June 2026' })).toBeTruthy();
    expect(screen.getAllByText('S')).toHaveLength(2);
  });

  it('selects a date', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<DatePicker defaultDisplayedMonth={june} onValueChange={onValueChange} />);
    fireEvent.press(screen.getByRole('button', { name: 'Monday, June 15, 2026' }));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 15));
  });

  it('navigates between months', () => {
    renderWithTheme(<DatePicker defaultDisplayedMonth={june} />);
    fireEvent.press(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('header', { name: 'July 2026' })).toBeTruthy();
  });

  it('respects min and max dates', () => {
    renderWithTheme(
      <DatePicker
        defaultDisplayedMonth={june}
        minDate={new Date(2026, 5, 10)}
        maxDate={new Date(2026, 5, 20)}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Friday, June 5, 2026' }).props.accessibilityState,
    ).toMatchObject({ disabled: true });
    expect(
      screen.getByRole('button', { name: 'Monday, June 15, 2026' }).props.accessibilityState,
    ).toMatchObject({ disabled: false });
  });

  it('supports controlled selection', () => {
    renderWithTheme(<DatePicker displayedMonth={june} value={new Date(2026, 5, 15)} />);
    expect(
      screen.getByRole('button', { name: 'Monday, June 15, 2026' }).props.accessibilityState,
    ).toMatchObject({ selected: true });
  });
});

describe('DateWheelPicker', () => {
  it('renders the columns for each wheel mode', () => {
    const { rerender } = renderWithTheme(
      <DateWheelPicker mode="date-time" value={new Date(2026, 5, 15, 13, 10)} />,
    );
    expect(screen.getByLabelText('Date')).toBeTruthy();
    expect(screen.getByLabelText('Hour')).toBeTruthy();
    expect(screen.getByLabelText('Minute')).toBeTruthy();
    expect(screen.getByLabelText('Period')).toBeTruthy();

    rerender(<DateWheelPicker mode="month-year" value={new Date(2026, 5, 15)} />);
    expect(screen.getByLabelText('Month')).toBeTruthy();
    expect(screen.getByLabelText('Year')).toBeTruthy();
  });

  it('changes a value through screen-reader increment actions', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <DateWheelPicker
        mode="month-year"
        value={new Date(2026, 5, 15, 9, 30)}
        onValueChange={onValueChange}
      />,
    );

    fireEvent(screen.getByLabelText('Month'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 6, 15, 9, 30));
  });

  it('keeps year rows stable across consecutive scroll selections', () => {
    const onValueChange = jest.fn();
    const { rerender } = renderWithTheme(
      <DateWheelPicker
        mode="month-year"
        value={new Date(2026, 5, 15, 9, 30)}
        onValueChange={onValueChange}
      />,
    );

    fireEvent(screen.getByTestId('year-wheel'), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { y: 94 * 44 } },
    });
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2020, 5, 15, 9, 30));

    rerender(
      <DateWheelPicker
        mode="month-year"
        value={new Date(2020, 5, 15, 9, 30)}
        onValueChange={onValueChange}
      />,
    );
    fireEvent(screen.getByTestId('year-wheel'), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { y: 93 * 44 } },
    });
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2019, 5, 15, 9, 30));
  });

  it('keeps date rows stable across consecutive scroll selections', () => {
    const onValueChange = jest.fn();
    const { rerender } = renderWithTheme(
      <DateWheelPicker
        mode="date-time"
        value={new Date(2026, 5, 15, 13, 10)}
        onValueChange={onValueChange}
      />,
    );

    // The rolling range is anchored on the initial date (2026-06-15) at the
    // default 365-day radius, so index 365 is the 15th and 367 is the 17th.
    fireEvent(screen.getByTestId('date-wheel'), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { y: 367 * 44 } },
    });
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 5, 17, 13, 10, 0));

    rerender(
      <DateWheelPicker
        mode="date-time"
        value={new Date(2026, 5, 17, 13, 10)}
        onValueChange={onValueChange}
      />,
    );
    // Anchor stays on the 15th, so one more row lands on the 18th — not a
    // drifted date from a list that re-centered on the new selection.
    fireEvent(screen.getByTestId('date-wheel'), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { y: 368 * 44 } },
    });
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 5, 18, 13, 10, 0));
  });

  it('clamps emitted dates to the configured range', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <DateWheelPicker
        mode="date"
        value={new Date(2026, 5, 20, 9)}
        maxDate={new Date(2026, 5, 20, 23, 59)}
        onValueChange={onValueChange}
      />,
    );

    fireEvent(screen.getByLabelText('Month'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 20, 23, 59));
  });

  it('converts the period without losing minutes', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <DateWheelPicker
        mode="time"
        value={new Date(2026, 5, 15, 9, 30)}
        onValueChange={onValueChange}
      />,
    );

    fireEvent(screen.getByLabelText('Period'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 15, 21, 30));
  });
});
