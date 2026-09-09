import { Animated, Text } from 'react-native';
import { act, renderWithTheme, screen } from '../../../../test/render';
import { Chart } from '../index';
import { ChartLoading, ChartMotion } from '../hooks';
import { SkeletonBlock } from '../skeleton';
import { __setReduceMotionForTests } from '../../../foundation/reduce-motion';

beforeEach(() => {
  jest.useFakeTimers();
  __setReduceMotionForTests(false);
});
afterEach(() => {
  jest.useRealTimers();
  __setReduceMotionForTests(false);
});
const settle = () => act(() => jest.advanceTimersByTime(500));
const state = (loading: boolean, animated = true) => (
  <ChartMotion animated={animated}>
    <ChartLoading loading={loading}>
      {(pending) => <Text>{pending ? 'Placeholder' : 'Data'}</Text>}
    </ChartLoading>
  </ChartMotion>
);

it('finishes the placeholder exit before revealing data', () => {
  const view = renderWithTheme(state(true));
  view.rerender(state(false));
  expect(screen.queryByText('Data')).toBeNull();
  settle();
  expect(screen.getByText('Data')).toBeTruthy();
});

it('cancels an interrupted exit without exposing data', () => {
  const view = renderWithTheme(state(true));
  view.rerender(state(false));
  act(() => jest.advanceTimersByTime(50));
  view.rerender(state(true));
  settle();
  expect(screen.getByText('Placeholder')).toBeTruthy();
  view.rerender(state(false));
  settle();
  expect(screen.getByText('Data')).toBeTruthy();
});

it('skips the exit delay with motion off', () => {
  const view = renderWithTheme(state(true, false));
  view.rerender(state(false, false));
  expect(screen.getByText('Data')).toBeTruthy();
});

it('uses one pulse loop per placeholder and none with reduced motion', () => {
  const loop = jest.spyOn(Animated, 'loop');
  const view = renderWithTheme(<SkeletonBlock width={120} height={24} radius={4} />);
  expect(loop).toHaveBeenCalledTimes(1);
  view.unmount();
  loop.mockClear();
  __setReduceMotionForTests(true);
  renderWithTheme(<SkeletonBlock width={120} height={24} radius={4} />);
  expect(loop).not.toHaveBeenCalled();
  loop.mockRestore();
});

it.each(['line', 'bar', 'donut', 'meter', 'sparkline', 'heatmap'])(
  '%s retains its rendered data during refresh and exposes busy state',
  (kind) => {
    const renderChart = (refreshing: boolean) => {
      const props = { refreshing, loading: refreshing, animated: false };
      switch (kind) {
        case 'bar':
          return <Chart.Bar {...props} data={[2, 4]} />;
        case 'donut':
          return <Chart.Donut {...props} data={[{ label: 'Food', value: 40 }]} />;
        case 'meter':
          return <Chart.Meter {...props} value={53} />;
        case 'sparkline':
          return (
            <Chart.Sparkline {...props} data={[2, 4]} width={120} accessibilityLabel="Trend" />
          );
        case 'heatmap':
          return <Chart.Heatmap {...props} data={[{ date: '2026-09-01', value: 2 }]} />;
        default:
          return <Chart {...props} data={[2, 4]} />;
      }
    };
    const view = renderWithTheme(renderChart(false));
    const labels = screen.UNSAFE_root.findAll((node) => node.props.accessibilityLabel != null).map(
      (node) => node.props.accessibilityLabel,
    );
    view.rerender(renderChart(true));
    expect(
      screen.UNSAFE_root.findAll((node) => node.props.accessibilityLabel != null).map(
        (node) => node.props.accessibilityLabel,
      ),
    ).toEqual(labels);
    expect(
      screen.UNSAFE_root.findAll((node) => node.props.accessibilityState?.busy === true).length,
    ).toBeGreaterThan(0);
    expect(screen.UNSAFE_queryAllByType(SkeletonBlock)).toHaveLength(0);
  },
);
