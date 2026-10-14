import { StyleSheet } from 'react-native';
import { Input } from '../input';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';
import { lightSemanticColors, typography } from '../../../foundation/tokens';

describe('Input', () => {
  it('floats the label in the placeholder position while empty', () => {
    renderWithTheme(<Input label="Email" placeholder="you@example.com" />, { theme: 'light' });
    const label = screen.getByText('Email', { includeHiddenElements: true });
    const style = StyleSheet.flatten(label.props.style);
    expect(style).toEqual(
      expect.objectContaining({
        color: lightSemanticColors.textTertiary,
        fontSize: typography.labelMedium.fontSize,
        fontWeight: typography.labelMedium.fontWeight,
      }),
    );
    expect(screen.queryByPlaceholderText('you@example.com')).toBeNull();
  });

  it('lifts the label once the field is focused or filled', () => {
    const { rerender } = renderWithTheme(
      <Input label="Email" placeholder="you@example.com" />,
      { theme: 'light' },
    );
    fireEvent(screen.getByLabelText('Email'), 'focus');
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByText('Email', { includeHiddenElements: true })).toBeTruthy();

    rerender(<Input label="Email" placeholder="you@example.com" value="ada@x.com" onChangeText={() => {}} />);
    expect(screen.getByDisplayValue('ada@x.com')).toBeTruthy();
    expect(screen.getByText('Email', { includeHiddenElements: true })).toBeTruthy();
  });

  it('colors the floating label as an error', () => {
    renderWithTheme(<Input label="Email" errorText="Required field" />, { theme: 'light' });
    const style = StyleSheet.flatten(
      screen.getByText('Email', { includeHiddenElements: true }).props.style,
    );
    expect(style.color).toBe(lightSemanticColors.textInteractiveError);
  });

  it('renders the label above the field when insetLabel is false', () => {
    renderWithTheme(
      <Input label="Email" placeholder="you@example.com" insetLabel={false} />,
      { theme: 'light' },
    );
    const style = StyleSheet.flatten(screen.getByText('Email').props.style);
    expect(style.fontWeight).toBe('600');
    expect(style.color).toBe(lightSemanticColors.textPrimary);
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
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
