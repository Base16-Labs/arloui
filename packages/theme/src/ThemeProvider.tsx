import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import { themes, type Theme, type ThemeName } from '@arloui/tokens';

type ThemeContextValue = {
  theme: Theme;
  name: ThemeName;
  setName: (name: ThemeName | 'system') => void;
  isSystem: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
  /**
   * Initial theme. `'system'` follows the device color scheme and updates live.
   * Defaults to `'system'`.
   */
  defaultName?: ThemeName | 'system';
  /**
   * Override what the system reports — useful for Storybook, snapshot tests, or
   * forcing a theme on a specific screen.
   */
  forceName?: ThemeName;
};

export function ThemeProvider({
  children,
  defaultName = 'system',
  forceName,
}: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemeName | 'system'>(defaultName);
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() === 'light' ? 'light' : 'dark',
  );

  useEffect(() => {
    if (preference !== 'system') return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'light' ? 'light' : 'dark');
    });
    return () => sub.remove();
  }, [preference]);

  const value = useMemo<ThemeContextValue>(() => {
    const resolved: ThemeName = forceName
      ? forceName
      : preference === 'system'
        ? systemScheme
        : preference;
    return {
      theme: themes[resolved],
      name: resolved,
      setName: setPreference,
      isSystem: !forceName && preference === 'system',
    };
  }, [forceName, preference, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      '[arloui] useTheme() must be called inside <ThemeProvider>. Wrap your app root with it (see @arloui/theme).',
    );
  }
  return ctx;
}

/**
 * Read tokens without subscribing to theme changes — useful in `StyleSheet.create`
 * factories where you want to memoize styles per render of a component.
 */
export function useTokens() {
  return useTheme().theme;
}
