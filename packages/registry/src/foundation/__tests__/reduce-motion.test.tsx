/**
 * Reduce Motion, as one answer for the whole app.
 *
 * The property worth pinning is not "the hook returns a boolean" — it is that
 * every consumer returns the *same* boolean in the same render. Ten components
 * used to own a `useState` and an async probe each, and independent probes
 * settle on independent schedules: for a frame or two a sheet could be
 * mid-spring while the toast it pushed in had already decided to hold still.
 */
import { Text, View } from 'react-native';
import { __setReduceMotionForTests, useReduceMotion } from '../reduce-motion';
import { act, renderWithTheme, screen } from '../../../test/render';

/** Two independent consumers, mounted at different depths. */
function Probe({ id }: { id: string }) {
  const reduceMotion = useReduceMotion();
  return <Text testID={id}>{String(reduceMotion)}</Text>;
}

afterEach(() => __setReduceMotionForTests(false));

describe('useReduceMotion', () => {
  it('defaults to motion allowed', () => {
    renderWithTheme(<Probe id="a" />);
    expect(screen.getByTestId('a').props.children).toBe('false');
  });

  it('gives every consumer the same answer', () => {
    renderWithTheme(
      <View>
        <Probe id="a" />
        <View>
          <Probe id="b" />
        </View>
      </View>,
    );

    expect(screen.getByTestId('a').props.children).toBe('false');
    expect(screen.getByTestId('b').props.children).toBe('false');

    act(() => __setReduceMotionForTests(true));

    // Both, not one — a setting that governs the whole system cannot be
    // answered differently in two places at once.
    expect(screen.getByTestId('a').props.children).toBe('true');
    expect(screen.getByTestId('b').props.children).toBe('true');
  });

  it('updates consumers mounted after the setting changed', () => {
    act(() => __setReduceMotionForTests(true));
    renderWithTheme(<Probe id="late" />);
    // No probe, no wait: the answer is already resolved for the process, so a
    // component mounting later never animates one frame under the wrong rule.
    expect(screen.getByTestId('late').props.children).toBe('true');
  });
});
