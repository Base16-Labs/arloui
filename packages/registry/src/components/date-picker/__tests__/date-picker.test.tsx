import { jest } from '@jest/globals';
import { DatePicker } from '../date-picker';
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
    renderWithTheme(
      <DatePicker defaultDisplayedMonth={june} onValueChange={onValueChange} />,
    );
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
    expect(screen.getByRole('button', { name: 'Friday, June 5, 2026' }).props.accessibilityState)
      .toMatchObject({ disabled: true });
    expect(screen.getByRole('button', { name: 'Monday, June 15, 2026' }).props.accessibilityState)
      .toMatchObject({ disabled: false });
  });

  it('supports controlled selection', () => {
    renderWithTheme(<DatePicker displayedMonth={june} value={new Date(2026, 5, 15)} />);
    expect(screen.getByRole('button', { name: 'Monday, June 15, 2026' }).props.accessibilityState)
      .toMatchObject({ selected: true });
  });
});
