import { Input } from '../input';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('Input', () => {
  it('renders a label', () => {
    renderWithTheme(<Input label="Email" placeholder="you@example.com" />);
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('renders helper text', () => {
    renderWithTheme(<Input label="Email" helperText="We never share it" />);
    expect(screen.getByText('We never share it')).toBeTruthy();
  });

  it('prefers error text over helper text', () => {
    renderWithTheme(
      <Input label="Email" helperText="Helper" errorText="Required field" />,
    );
    expect(screen.getByText('Required field')).toBeTruthy();
    expect(screen.queryByText('Helper')).toBeNull();
  });

  it('fires onChangeText as the user types', () => {
    const onChangeText = jest.fn();
    renderWithTheme(<Input placeholder="Name" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Name'), 'Ada');
    expect(onChangeText).toHaveBeenCalledWith('Ada');
  });

  it('reflects the controlled value', () => {
    renderWithTheme(<Input placeholder="Name" value="Grace" onChangeText={() => {}} />);
    expect(screen.getByDisplayValue('Grace')).toBeTruthy();
  });

  it('is not editable when editable={false}', () => {
    renderWithTheme(<Input placeholder="Locked" editable={false} />);
    expect(screen.getByPlaceholderText('Locked').props.editable).toBe(false);
  });

  it('renders in both filled and plain appearances', () => {
    for (const appearance of ['filled', 'plain'] as const) {
      const { unmount } = renderWithTheme(
        <Input appearance={appearance} placeholder={`p-${appearance}`} />,
      );
      expect(screen.getByPlaceholderText(`p-${appearance}`)).toBeTruthy();
      unmount();
    }
  });
});
