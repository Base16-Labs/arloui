import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { type Theme } from '@arloui/tokens';
import { useTokens } from './ThemeProvider';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Token-aware StyleSheet factory.
 *
 *   const useStyles = createStyles((t) => ({
 *     root: { backgroundColor: t.colors.bg, padding: t.spacing[4] },
 *   }));
 *
 *   const styles = useStyles();
 *
 * Memoizes per theme so style objects retain referential identity across renders
 * within the same theme. This keeps pressable / animated components from
 * needlessly recomputing styles.
 */
export function createStyles<T extends NamedStyles<T> | NamedStyles<unknown>>(
  factory: (theme: Theme) => T,
): () => T {
  const cache = new WeakMap<Theme, T>();
  return function useStyles(): T {
    const theme = useTokens();
    return useMemo(() => {
      const cached = cache.get(theme);
      if (cached) return cached;
      const styles = StyleSheet.create(factory(theme));
      cache.set(theme, styles);
      return styles;
    }, [theme]);
  };
}
