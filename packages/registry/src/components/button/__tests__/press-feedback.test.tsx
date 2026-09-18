import { jest } from '@jest/globals';

jest.mock('../../../foundation/haptics', () => ({
  haptic: jest.fn(),
}));

import { type ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { haptic } from '../../../foundation/haptics';
import { ThemeProvider } from '../../../foundation/theme-provider';
import { usePressFeedback, useReducedMotion } from '../press-feedback';
import {
  __setReduceMotionForTests,
  useReduceMotion,
} from '../../../foundation/reduce-motion';

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

beforeEach(() => jest.clearAllMocks());

afterEach(() => __setReduceMotionForTests(false));

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

  it('falls back to an opacity fade when reduce-motion is on', () => {
    /*
     * The seam, not a mock on `AccessibilityInfo`. Reduce Motion is one
     * process-wide store with a single subscription, so it probes the OS once
     * for the whole suite — a mock installed by a later spec is never consulted,
     * because an earlier one already resolved the answer.
     */
    __setReduceMotionForTests(true);
    const { result } = renderHook(() => usePressFeedback({}), { wrapper });
    expect(result.current.reduceMotion).toBe(true);
    expect(result.current.animatedStyle).toHaveProperty('opacity');
    expect(result.current.animatedStyle).not.toHaveProperty('transform');
  });
});

describe('useReducedMotion', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('reflects the OS reduce-motion setting when enabled', () => {
    __setReduceMotionForTests(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  /** The alias and the foundation hook must be the same answer, not two. */
  it('is the shared store, not a second one', () => {
    __setReduceMotionForTests(true);
    const alias = renderHook(() => useReducedMotion());
    const direct = renderHook(() => useReduceMotion());
    expect(alias.result.current).toBe(direct.result.current);
  });
});
