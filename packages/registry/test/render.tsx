/**
 * Shared render helper for component tests: wraps the tree in the real
 * ThemeProvider so `useTokens()` resolves. Lives outside `src/__tests__` so Jest
 * doesn't try to collect it as a test suite.
 */
import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '../src/foundation/theme-provider';

export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  });
}

export { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
