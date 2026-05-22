import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTokens } from '@arloui/registry';
import { SectionLabel } from './section-label';

export function ShowcaseSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const t = useTokens();

  return (
    <View style={{ gap: t.spacing[3] }}>
      <View style={{ gap: t.spacing[1] }}>
        <SectionLabel>{title}</SectionLabel>
        {subtitle ? (
          <Text
            style={{
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.bodySm.fontSize,
              lineHeight: t.typography.bodySm.lineHeight,
              color: t.colors.textSecondary,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ gap: t.spacing[2] }}>{children}</View>
    </View>
  );
}
