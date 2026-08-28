/**
 * Shared render helper for component tests: wraps the tree in the real
 * ThemeProvider so `useTokens()` resolves. Lives outside `src/__tests__` so Jest
 * doesn't try to collect it as a test suite.
 */
import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '../src/foundation/theme-provider';
import { type ThemeName } from '../src/foundation/tokens';

/**
 * `theme` pins the scheme for tests that assert on actual colour values.
 *
 * Left off, the provider resolves `system`, and under jest `Appearance` reports
 * no scheme — so the default is dark. That is fine for structural assertions and
 * a trap for colour ones, which read as testing the light palette while checking
 * the dark one.
 */
export function renderWithTheme(
  ui: ReactElement,
  { theme, ...options }: Omit<RenderOptions, 'wrapper'> & { theme?: ThemeName } = {},
) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider defaultName={theme ?? 'system'}>{children}</ThemeProvider>,
    ...options,
  });
}

export { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
