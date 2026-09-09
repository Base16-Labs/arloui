import { jest } from '@jest/globals';
import { Animated } from 'react-native';
import { Circle, G, Path, Rect } from 'react-native-svg';
import * as Reanimated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { ChartFill, ChartReveal, ChartSweep } from '../motion';
import { Chart } from '../index';
import { act, fireEvent, renderWithTheme, screen } from '../../../../test/render';
import { __setReduceMotionForTests } from '../../../foundation/reduce-motion';

const slices = [{ label: 'One', value: 60 }, { label: 'Two', value: 40 }];
const paths = () => screen.UNSAFE_getAllByType(Path).map((node) => node.props.d);
const settle = () => act(() => { jest.advanceTimersByTime(1000); });

beforeEach(() => {
  jest.useFakeTimers();
  __setReduceMotionForTests(false);
});
afterEach(() => {
  act(() => __setReduceMotionForTests(false));
  jest.useRealTimers();
});

it('draws the donut to the same final geometry as motion off, without replaying selection', () => {
  const timing = jest.spyOn(Reanimated, 'withTiming');
  const view = renderWithTheme(<Chart.Donut data={slices} />);
  const initial = paths();
  expect(timing).toHaveBeenCalledWith(1, expect.objectContaining({ duration: 400 }));
  timing.mockClear();
  view.rerender(<Chart.Donut data={slices} activeIndex={0} />);
  expect(paths()).toEqual(initial);
  expect(timing).not.toHaveBeenCalled();
  view.rerender(<Chart.Donut data={slices} animated={false} />);
  expect(paths()).toEqual(initial);
  timing.mockRestore();
});

it('restarts the donut entrance when loading finishes and when explicitly remounted', () => {
  const timing = jest.spyOn(Reanimated, 'withTiming');
  const view = renderWithTheme(<Chart.Donut data={slices} />);
  timing.mockClear();
  view.rerender(<Chart.Donut data={slices} loading />);
  view.rerender(<Chart.Donut data={slices} />);
  expect(timing).not.toHaveBeenCalled();
  settle();
  expect(timing).toHaveBeenCalledTimes(1);
  view.rerender(<Chart.Donut key="replay" data={slices} />);
  expect(timing).toHaveBeenCalledTimes(2);
  timing.mockRestore();
});

it('finishes immediately when motion is disabled mid-sweep', () => {
  const timing = jest.spyOn(Reanimated, 'withTiming');
  const cancel = jest.spyOn(Reanimated, 'cancelAnimation');
  const view = renderWithTheme(<Chart.Donut data={slices} animated={false} />);
  expect(timing).not.toHaveBeenCalled();
  view.rerender(<Chart.Donut data={slices} animated />);
  expect(timing).toHaveBeenCalledTimes(1);
  cancel.mockClear();
  act(() => __setReduceMotionForTests(true));
  expect(cancel).toHaveBeenCalled();
  expect(cancel.mock.calls.at(-1)?.[0].value).toBe(1);
  timing.mockRestore();
  cancel.mockRestore();
});

// The test runtime does not execute UI-thread animation frames. Sample the
// actual worklet props at explicit progress values instead of simulating FPS.
it.each([0, 0.5, 1])('maps progress %s to continuous SVG masks and supporting fill', (value) => {
  const progress = { value } as SharedValue<number>;
  renderWithTheme(<>
    <ChartReveal progress={progress} width={200} height={100} />
    <ChartSweep progress={progress} center={50} radius={40} thickness={20} />
    <ChartFill progress={progress}><Path d="M0 0 L20 20" /></ChartFill>
  </>);
  expect(screen.UNSAFE_getByType(Rect).props.width).toBe(value * 200);
  expect(screen.UNSAFE_getByType(Circle).props.strokeDashoffset).toBeCloseTo((1 - value) * 80 * Math.PI);
  expect(screen.UNSAFE_getByType(G).props.opacity).toBeCloseTo(Math.min(1, Math.max(0, (value - 0.3) / 0.7)));
});

it('retargets a meter from its displayed value without resetting to zero', () => {
  const view = renderWithTheme(<Chart.Meter value={53} />);
  settle();
  expect(screen.getByText('53%')).toBeTruthy();
  view.rerender(<Chart.Meter value={75} />);
  expect(screen.getByText('53%')).toBeTruthy();
  settle();
  expect(screen.getByText('75%')).toBeTruthy();
});

it('does not run a skeleton pulse for a loaded meter', () => {
  const loop = jest.spyOn(Animated, 'loop');
  renderWithTheme(<Chart.Meter value={53} />);
  expect(loop).not.toHaveBeenCalled();
  loop.mockRestore();
});

it.each(['line', 'sparkline'])('reveals %s only after measurement and renders fully with motion off', (kind) => {
  const timing = jest.spyOn(Reanimated, 'withTiming');
  const chart = (animated: boolean) => kind === 'line'
    ? <Chart data={[1, 4, 2]} animated={animated}><Chart.Plot /></Chart>
    : <Chart.Sparkline data={[1, 4, 2]} animated={animated} accessibilityLabel="Trend" />;
  const view = renderWithTheme(chart(true));
  expect(timing).not.toHaveBeenCalled();
  fireEvent(screen.getByRole('image'), 'layout', { nativeEvent: { layout: { width: 200, height: 180, x: 0, y: 0 } } });
  expect(timing).toHaveBeenCalledWith(1, expect.objectContaining({ duration: 400 }));
  view.rerender(chart(false));
  expect(screen.UNSAFE_getAllByType(Rect)[0].props.width).toBe(200);
  timing.mockRestore();
});

it.each(['line', 'bar', 'donut', 'meter', 'sparkline', 'heatmap'].flatMap((kind) => [
  { kind, system: true, animated: true },
  { kind, system: false, animated: false },
]))('$kind skips motion when system=$system and animated=$animated', ({ kind, system, animated }) => {
  __setReduceMotionForTests(system);
  const timing = jest.spyOn(Animated, 'timing');
  const workletTiming = jest.spyOn(Reanimated, 'withTiming');
  const charts = {
    line: <Chart data={[1, 3, 2]} animated={animated} />,
    bar: <Chart.Bar data={[1, 3, 2]} animated={animated} />,
    donut: <Chart.Donut data={slices} animated={animated} />,
    meter: <Chart.Meter value={53} animated={animated} />,
    sparkline: <Chart.Sparkline data={[1, 3, 2]} width={120} animated={animated} />,
    heatmap: <Chart.Heatmap data={[]} animated={animated} />,
  };
  renderWithTheme(charts[kind as keyof typeof charts]);
  expect(timing).not.toHaveBeenCalled();
  expect(workletTiming).not.toHaveBeenCalled();
  timing.mockRestore();
  workletTiming.mockRestore();
});
