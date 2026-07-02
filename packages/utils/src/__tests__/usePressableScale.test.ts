import { renderHook, act } from '@testing-library/react-native';
import { usePressableScale } from '../usePressableScale';

describe('usePressableScale', () => {
  it('returns a style plus press handlers', () => {
    const { result } = renderHook(() => usePressableScale());
    expect(typeof result.current.onPressIn).toBe('function');
    expect(typeof result.current.onPressOut).toBe('function');
    expect(result.current.style).toHaveProperty('transform');
    expect(result.current.style).toHaveProperty('opacity');
  });

  it('keeps handler identity stable across renders', () => {
    const { result, rerender } = renderHook(() => usePressableScale());
    const first = result.current.onPressIn;
    rerender({});
    expect(result.current.onPressIn).toBe(first);
  });

  it('drives the animation without throwing on press in/out', () => {
    const { result } = renderHook(() => usePressableScale({ scale: 0.9, duration: 0 }));
    expect(() => {
      act(() => {
        result.current.onPressIn();
        result.current.onPressOut();
      });
    }).not.toThrow();
  });
});
