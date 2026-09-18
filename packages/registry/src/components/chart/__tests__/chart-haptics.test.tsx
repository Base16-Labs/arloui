import { jest } from '@jest/globals';

// Spy on the haptics helper without pulling in the real expo-haptics native call.
jest.mock('../../../foundation/haptics', () => ({
  haptic: jest.fn(),
}));

import { haptic } from '../../../foundation/haptics';
import { BarChart } from '../bar-chart';
import { Chart } from '../index';
import { DonutChart } from '../donut-chart';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

/**
 * Every chart uses `selection` rather than an impact style: picking a bar, a
 * slice, or a range is the same gesture as moving through a picker, and impact
 * would read as a heavier confirmation than any of these deserve.
 */
describe('chart haptics', () => {
  const week = [
    { label: 'M', value: 30 },
    { label: 'T', value: 12 },
  ];

  it('ticks when a bar is tapped', () => {
    renderWithTheme(<BarChart data={week} onSelect={() => {}} />);
    fireEvent.press(screen.getByRole('button', { name: 'T, 12' }));
    expect(haptic).toHaveBeenCalledWith('selection');
  });

  it('ticks when a donut legend entry is tapped', () => {
    renderWithTheme(<DonutChart data={[{ label: 'Rent', value: 100 }]} />);
    fireEvent.press(screen.getByRole('button', { name: 'Rent, 100, 100 percent' }));
    expect(haptic).toHaveBeenCalledWith('selection');
  });

  it('ticks when a period is chosen', () => {
    renderWithTheme(
      <Chart data={[1, 2, 3]} periods={['1D', '1W']} period="1D" onPeriodChange={() => {}}>
        <Chart.Periods />
      </Chart>,
    );
    fireEvent.press(screen.getByRole('tab', { name: '1W' }));
    expect(haptic).toHaveBeenCalledWith('selection');
  });

  it('ticks once per point crossed while scrubbing, not once per touch', () => {
    renderWithTheme(
      <Chart data={[10, 20, 30]}>
        <Chart.Plot />
      </Chart>,
    );
    const plot = screen.getByRole('image');
    fireEvent(plot, 'layout', {
      nativeEvent: { layout: { width: 212, height: 180, x: 0, y: 0 } },
    });

    /**
     * PanResponder drops any move whose `mostRecentTimeStamp` matches the one it
     * last accounted for, so a gesture built from repeated timestamps silently
     * delivers only its first move. Each synthetic event gets its own clock tick.
     */
    let clock = 0;
    const at = (locationX: number) => {
      clock += 1;
      const touch = {
        touchActive: true,
        startPageX: locationX,
        startPageY: 0,
        startTimeStamp: 0,
        currentPageX: locationX,
        currentPageY: 0,
        currentTimeStamp: clock,
        previousPageX: locationX,
        previousPageY: 0,
        previousTimeStamp: clock - 1,
      };
      return {
        nativeEvent: {
          locationX,
          pageX: locationX,
          pageY: 0,
          identifier: 1,
          touches: [touch],
          changedTouches: [touch],
        },
        touchHistory: {
          touchBank: [undefined, touch],
          numberActiveTouches: 1,
          indexOfSingleActiveTouch: 1,
          mostRecentTimeStamp: clock,
        },
      };
    };

    fireEvent(plot, 'responderGrant', at(6)); // index 0
    expect(haptic).toHaveBeenCalledTimes(1);

    // Two more moves that stay on index 0 must stay silent.
    fireEvent(plot, 'responderMove', at(10));
    fireEvent(plot, 'responderMove', at(20));
    expect(haptic).toHaveBeenCalledTimes(1);

    // Crossing to the next point ticks again.
    fireEvent(plot, 'responderMove', at(106)); // index 1
    expect(haptic).toHaveBeenCalledTimes(2);
  });
});
