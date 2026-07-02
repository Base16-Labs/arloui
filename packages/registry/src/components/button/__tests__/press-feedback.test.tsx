import { jest } from '@jest/globals';

jest.mock('@arloui/utils', () => ({
  ...jest.requireActual('@arloui/utils'),
  haptic: jest.fn(),
}));

import { type ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { haptic } from '@arloui/utils';
import { ThemeProvider } from '../../../foundation/theme-provider';
import { usePressFeedback, useReducedMotion } from '../press-feedback';

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

beforeEach(() => jest.clearAllMocks());

describe('usePressFeedback', () => {
  it('uses a scale transform when reduce-motion is off (default)', () => {
    const { result } = renderHook(() => usePressFeedback({}), { wrapper });
    expect(result.current.animatedStyle).toHaveProperty('transform');
    expect(result.current.animatedStyle).not.toHaveProperty('opacity');
  });

  it('fires the configured haptic on press-in', () => {
    const { result } = renderHook(() => usePressFeedback({ haptic: 'medium' }), { wrapper });
    act(() => result.current.onPressIn({} as never));
    expect(haptic).toHaveBeenCalledWith('medium');
    expect(result.current.pressed).toBe(true);
  });

  it('does not fire a haptic when haptic="none"', () => {
    const { result } = renderHook(() => usePressFeedback({ haptic: 'none' }), { wrapper });
    act(() => result.current.onPressIn({} as never));
    expect(haptic).not.toHaveBeenCalled();
  });

  it('forwards onPressIn / onPressOut callbacks and clears pressed', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const { result } = renderHook(() => usePressFeedback({ onPressIn, onPressOut }), { wrapper });
    act(() => result.current.onPressIn({} as never));
    act(() => result.current.onPressOut({} as never));
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
    expect(result.current.pressed).toBe(false);
  });

  it('falls back to an opacity fade when reduce-motion is on', async () => {
    // Override the globally-pending mock with a resolved `true` for this test.
    jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValueOnce(true);
    const { result } = renderHook(() => usePressFeedback({}), { wrapper });
    await waitFor(() => {
      expect(result.current.reduceMotion).toBe(true);
    });
    expect(result.current.animatedStyle).toHaveProperty('opacity');
    expect(result.current.animatedStyle).not.toHaveProperty('transform');
  });
});

describe('useReducedMotion', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('reflects the OS reduce-motion setting when enabled', async () => {
    jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValueOnce(true);
    const { result } = renderHook(() => useReducedMotion());
    await waitFor(() => expect(result.current).toBe(true));
  });
});
