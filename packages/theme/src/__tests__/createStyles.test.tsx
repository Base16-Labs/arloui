import { type ReactNode } from 'react';
import { renderHook } from '@testing-library/react-native';
import { themes } from '@arloui/tokens';
import { ThemeProvider } from '../ThemeProvider';
import { createStyles } from '../createStyles';

const lightWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider forceName="light">{children}</ThemeProvider>
);

describe('createStyles', () => {
  it('builds styles from the active theme tokens', () => {
    const useStyles = createStyles((t) => ({
      root: { padding: t.spacing[4], backgroundColor: t.colors.surfaceInput },
    }));
    const { result } = renderHook(() => useStyles(), { wrapper: lightWrapper });
    expect(result.current.root.padding).toBe(themes.light.spacing[4]);
    expect(result.current.root.backgroundColor).toBe(themes.light.colors.surfaceInput);
  });

  it('returns a stable reference across renders within the same theme', () => {
    const useStyles = createStyles((t) => ({ root: { margin: t.spacing[2] } }));
    const { result, rerender } = renderHook(() => useStyles(), { wrapper: lightWrapper });
    const first = result.current;
    rerender({});
    expect(result.current).toBe(first);
  });

  it('produces different styles for different themes', () => {
    const useStyles = createStyles((t) => ({ root: { backgroundColor: t.colors.surfaceInput } }));
    const light = renderHook(() => useStyles(), { wrapper: lightWrapper }).result.current;
    const dark = renderHook(() => useStyles(), {
      wrapper: ({ children }) => <ThemeProvider forceName="dark">{children}</ThemeProvider>,
    }).result.current;
    expect(light.root.backgroundColor).toBe(themes.light.colors.surfaceInput);
    expect(dark.root.backgroundColor).toBe(themes.dark.colors.surfaceInput);
  });
});
