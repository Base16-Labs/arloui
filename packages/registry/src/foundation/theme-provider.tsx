/**
 * Registry source — copied into the consumer's project at `<alias>/theme-provider.tsx`.
 * Wrap your app root with `<ThemeProvider>` (typically in `_layout.tsx` or `App.tsx`).
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import { themes, type Theme, type ThemeName } from './tokens';

type Ctx = {
  theme: Theme;
  name: ThemeName;
  setName: (n: ThemeName | 'system') => void;
};

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({
  children,
  defaultName = 'system',
}: {
  children: ReactNode;
  defaultName?: ThemeName | 'system';
}) {
  const [pref, setPref] = useState<ThemeName | 'system'>(defaultName);
  const [system, setSystem] = useState<ColorSchemeName | null | undefined>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    if (pref !== 'system') return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => setSystem(colorScheme));
    return () => sub.remove();
  }, [pref]);

  const value = useMemo<Ctx>(() => {
    const resolved: ThemeName = pref === 'system' ? (system === 'light' ? 'light' : 'dark') : pref;
    return { theme: themes[resolved], name: resolved, setName: setPref };
  }, [pref, system]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme() must be used inside <ThemeProvider>');
  return ctx;
}

export const useTokens = () => useTheme().theme;
