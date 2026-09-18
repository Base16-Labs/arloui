import { Text, type TextStyle } from 'react-native';
import { useTokens } from '@arloui/registry';

export function SectionLabel({ children, style }: { children: string; style?: TextStyle }) {
  const t = useTokens();
  return (
    <Text
      style={[
        {
          color: t.colors.textTertiary,
          fontFamily: t.fontFamilies.sans,
          ...t.typography.overline,
          textTransform: 'uppercase',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
