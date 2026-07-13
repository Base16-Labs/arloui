import { TextArea } from '../text-area';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

describe('TextArea', () => {
  it('renders a label', () => {
    renderWithTheme(<TextArea label="Bio" placeholder="Write a short bio" />);
    expect(screen.getByText('Bio')).toBeTruthy();
  });

  it('prefers error text over helper text', () => {
    renderWithTheme(<TextArea helperText="Helper" errorText="Required field" />);
    expect(screen.getByText('Required field')).toBeTruthy();
    expect(screen.queryByText('Helper')).toBeNull();
  });

  it('fires onChangeText as the user types', () => {
    const onChangeText = jest.fn();
    renderWithTheme(<TextArea placeholder="Message" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Message'), 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('is multiline and not editable when editable={false}', () => {
    renderWithTheme(<TextArea placeholder="Locked" editable={false} />);
    const input = screen.getByPlaceholderText('Locked');
    expect(input.props.multiline).toBe(true);
    expect(input.props.editable).toBe(false);
  });

  it('renders a character count when requested', () => {
    renderWithTheme(<TextArea value="Hello" onChangeText={() => {}} maxLength={120} showCount />);
    expect(screen.getByText('5/120')).toBeTruthy();
  });

  it('renders in both filled and plain appearances', () => {
    for (const appearance of ['filled', 'plain'] as const) {
      const { unmount } = renderWithTheme(
        <TextArea appearance={appearance} placeholder={`p-${appearance}`} />,
      );
      expect(screen.getByPlaceholderText(`p-${appearance}`)).toBeTruthy();
      unmount();
    }
  });
});
