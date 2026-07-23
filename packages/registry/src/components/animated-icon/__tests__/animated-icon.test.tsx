import { jest } from '@jest/globals';
import { AnimatedIcon, type AnimatedIconName } from '../animated-icon';
import { renderWithTheme, screen, act } from '../../../../test/render';

const MORPHING: AnimatedIconName[] = [
  'menu-close',
  'plus-minus',
  'play-pause',
  'arrow-right-down',
  'chevron-right-down',
  'download-check',
  'grid-list',
  'sort-ascending-descending',
  'expand-collapse',
  'copy-check',
  'upload-check',
];

const SPECIAL: AnimatedIconName[] = [
  'heart-fill',
  'star-fill',
  'bookmark-fill',
  'bell-fill',
  'thumb-up-fill',
  'pin-fill',
  'spinner-x',
  'circle-progress-check',
  'bell-shake',
  'dot-pulse',
];

const ALL = [...MORPHING, ...SPECIAL];

describe('AnimatedIcon', () => {
  it('exposes 21 icons (11 morphing + 10 special)', () => {
    expect(MORPHING).toHaveLength(11);
    expect(SPECIAL).toHaveLength(10);
    expect(new Set(ALL).size).toBe(21);
  });

  it.each(ALL)('renders "%s" as an accessible image in the inactive state', (name) => {
    renderWithTheme(<AnimatedIcon name={name} active={false} />);
    expect(screen.getByLabelText(/ icon$/i)).toBeTruthy();
  });

  it.each(ALL)('renders "%s" in the active state', (name) => {
    renderWithTheme(<AnimatedIcon name={name} active />);
    expect(screen.getByLabelText(/ icon$/i)).toBeTruthy();
  });

  it('derives a default accessibility label that changes with state', () => {
    const inactive = renderWithTheme(<AnimatedIcon name="menu-close" active={false} />);
    expect(screen.getByLabelText('Menu icon')).toBeTruthy();
    inactive.unmount();

    renderWithTheme(<AnimatedIcon name="menu-close" active />);
    expect(screen.getByLabelText('Close icon')).toBeTruthy();
  });

  it('respects an explicit accessibilityLabel', () => {
    renderWithTheme(
      <AnimatedIcon name="menu-close" active accessibilityLabel="Toggle navigation" />,
    );
    expect(screen.getByLabelText('Toggle navigation')).toBeTruthy();
  });

  it('honors size / color / strokeWidth props without crashing', () => {
    renderWithTheme(
      <AnimatedIcon name="heart-fill" active size={48} color="#FF0000" strokeWidth={3} />,
    );
    expect(screen.getByLabelText(/ icon$/i)).toBeTruthy();
  });

  it('updates when toggled from inactive to active', () => {
    const view = renderWithTheme(<AnimatedIcon name="play-pause" active={false} />);
    expect(screen.getByLabelText('Play icon')).toBeTruthy();
    view.rerender(<AnimatedIcon name="play-pause" active />);
    expect(screen.getByLabelText('Pause icon')).toBeTruthy();
  });

  describe('auto-reset', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('auto-resets copy-check after the default 1500ms and calls onAutoReset', () => {
      const onAutoReset = jest.fn();
      renderWithTheme(<AnimatedIcon name="copy-check" active onAutoReset={onAutoReset} />);
      expect(onAutoReset).not.toHaveBeenCalled();
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      expect(onAutoReset).toHaveBeenCalledTimes(1);
    });

    it('honors a custom autoResetAfter', () => {
      const onAutoReset = jest.fn();
      renderWithTheme(
        <AnimatedIcon name="download-check" active autoResetAfter={300} onAutoReset={onAutoReset} />,
      );
      act(() => {
        jest.advanceTimersByTime(299);
      });
      expect(onAutoReset).not.toHaveBeenCalled();
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(onAutoReset).toHaveBeenCalledTimes(1);
    });

    it('does not auto-reset non-momentary icons', () => {
      const onAutoReset = jest.fn();
      renderWithTheme(<AnimatedIcon name="menu-close" active onAutoReset={onAutoReset} />);
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(onAutoReset).not.toHaveBeenCalled();
    });
  });
});
