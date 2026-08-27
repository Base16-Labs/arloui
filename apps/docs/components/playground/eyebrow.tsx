import { Text, type TextStyle } from 'react-native';
import { useTokens } from '@arloui/registry';

/** Matches www `Eyebrow` — 11px uppercase, wide tracking. */
export function Eyebrow({ children, style }: { children: string; style?: TextStyle }) {
  const t = useTokens();
  return (
    <Text
      style={[
        {
          fontFamily: t.fontFamilies.sans,
          ...t.typography.overline,
          textTransform: 'uppercase',
          color: t.colors.textTertiary,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
