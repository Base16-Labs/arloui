import { type ReactNode } from 'react';
import { Appearance } from 'react-native';
import { renderHook, act } from '@testing-library/react-native';
import { themes } from '@arloui/tokens';
import { ThemeProvider, useTheme, useTokens } from '../ThemeProvider';

function wrapper(props: { defaultName?: 'light' | 'dark' | 'system'; forceName?: 'light' | 'dark' }) {
  return ({ children }: { children: ReactNode }) => (
    <ThemeProvider defaultName={props.defaultName} forceName={props.forceName}>
      {children}
    </ThemeProvider>
  );
}

describe('useTheme', () => {
  it('throws when used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(/must be called inside <ThemeProvider>/);
  });

  it('provides the dark theme by default in the test env (no system light scheme)', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper({}) });
    expect(result.current.name).toBe('dark');
    expect(result.current.theme).toBe(themes.dark);
    expect(result.current.isSystem).toBe(true);
  });

  it('honors forceName and reports isSystem=false', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper({ forceName: 'light' }) });
    expect(result.current.name).toBe('light');
    expect(result.current.theme).toBe(themes.light);
    expect(result.current.isSystem).toBe(false);
  });

  it('honors an explicit defaultName', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper({ defaultName: 'light' }) });
    expect(result.current.name).toBe('light');
    expect(result.current.isSystem).toBe(false);
  });

  it('follows the system color scheme when set to light', () => {
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper({ defaultName: 'system' }) });
    expect(result.current.name).toBe('light');
    expect(result.current.isSystem).toBe(true);
  });

  it('switches theme via setName', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper({ defaultName: 'dark' }) });
    expect(result.current.name).toBe('dark');
    act(() => result.current.setName('light'));
    expect(result.current.name).toBe('light');
    expect(result.current.theme).toBe(themes.light);
  });
});

describe('useTokens', () => {
  it('returns the resolved theme tokens', () => {
    const { result } = renderHook(() => useTokens(), { wrapper: wrapper({ forceName: 'light' }) });
    expect(result.current).toBe(themes.light);
    expect(result.current.colors).toBeDefined();
    expect(result.current.spacing).toBeDefined();
  });
});
