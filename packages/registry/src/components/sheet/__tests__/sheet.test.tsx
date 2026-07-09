import { jest } from '@jest/globals';
import { Text } from 'react-native';
import { Sheet } from '../sheet';
import { renderWithTheme, screen, fireEvent, waitFor } from '../../../../test/render';

describe('Sheet', () => {
  it('renders its content when visible', () => {
    renderWithTheme(
      <Sheet visible onClose={() => {}}>
        <Text>Sheet body</Text>
      </Sheet>,
    );
    expect(screen.getByText('Sheet body')).toBeTruthy();
  });

  it('renders nothing when not visible', () => {
    renderWithTheme(
      <Sheet visible={false} onClose={() => {}}>
        <Text>Hidden body</Text>
      </Sheet>,
    );
    expect(screen.queryByText('Hidden body')).toBeNull();
  });

  it('shows a dismissable scrim for the default (scrim) backdrop', async () => {
    const onClose = jest.fn();
    renderWithTheme(
      <Sheet visible onClose={onClose}>
        <Text>Body</Text>
      </Sheet>,
    );
    // The scrim fades in from opacity 0, which RNTL treats as hidden until animated.
    const scrim = screen.getByLabelText('Close', { includeHiddenElements: true });
    expect(scrim).toBeTruthy();
    fireEvent.press(scrim);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('renders no scrim for the passthrough backdrop', () => {
    renderWithTheme(
      <Sheet visible onClose={() => {}} backdrop="passthrough">
        <Text>Body</Text>
      </Sheet>,
    );
    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  it('renders a header title via Sheet.Header', () => {
    renderWithTheme(
      <Sheet visible onClose={() => {}}>
        <Sheet.Header title="Filters" />
        <Sheet.Body>
          <Text>Options</Text>
        </Sheet.Body>
      </Sheet>,
    );
    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByText('Options')).toBeTruthy();
  });

  it('supports the glass surface without a scrim (passthrough + glass)', () => {
    renderWithTheme(
      <Sheet visible onClose={() => {}} surface="glass" backdrop="passthrough">
        <Text>Glass body</Text>
      </Sheet>,
    );
    expect(screen.getByText('Glass body')).toBeTruthy();
    expect(screen.queryByLabelText('Close')).toBeNull();
  });
});
