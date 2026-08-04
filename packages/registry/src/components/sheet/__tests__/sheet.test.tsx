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

  it('supports independent width, height, and padding variants', () => {
    renderWithTheme(
      <Sheet visible onClose={() => {}} width="stack" height="half" padding="lg" handleHeight={3}>
        <Text>Stacked sheet</Text>
      </Sheet>,
    );
    expect(screen.getByText('Stacked sheet')).toBeTruthy();
  });

  it('accepts a motion override without changing content', () => {
    renderWithTheme(
      <Sheet
        visible
        onClose={() => {}}
        motion={{ openDuration: 120, closeDuration: 90, easing: [0.2, 0.8, 0.2, 1] }}
      >
        <Text>Tuned sheet</Text>
      </Sheet>,
    );
    expect(screen.getByText('Tuned sheet')).toBeTruthy();
  });

  it('accepts motion presets, gesture thresholds, and snap points', () => {
    renderWithTheme(
      <Sheet
        visible
        onClose={() => {}}
        motion="snappy"
        gesture={{ dismissDistance: 0.4, dismissVelocity: 1 }}
        snapPoints={[0.4, 0.9]}
      >
        <Text>Snap sheet</Text>
      </Sheet>,
    );
    expect(screen.getByText('Snap sheet')).toBeTruthy();
  });

  it('keeps the legacy presentation and detent props compatible', () => {
    renderWithTheme(
      <Sheet visible onClose={() => {}} presentation="inset" detent={0.5}>
        <Text>Legacy sheet</Text>
      </Sheet>,
    );
    expect(screen.getByText('Legacy sheet')).toBeTruthy();
  });
});
