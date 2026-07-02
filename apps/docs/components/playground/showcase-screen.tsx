import { Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, Text, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTokens } from '@arloui/registry';
import { Eyebrow } from './eyebrow';
import { ThemeToggle } from './theme-toggle';

type ShowcaseScreenProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  stackTitle?: string;
  children: ReactNode;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
};

export function ShowcaseScreen({
  eyebrow = 'Components',
  title,
  subtitle,
  stackTitle,
  children,
  contentContainerStyle,
}: ShowcaseScreenProps) {
  const t = useTokens();

  return (
    <>
      <Stack.Screen
        options={{
          title: stackTitle ?? title,
          headerRight: () => <ThemeToggle />,
        }}
      />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            {
              paddingHorizontal: t.spacing[5],
              paddingTop: t.spacing[4],
              paddingBottom: t.spacing[10],
              gap: t.spacing[6],
            },
            contentContainerStyle,
          ]}
        >
          <View style={{ gap: t.spacing[3] }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Text
              style={{
                fontFamily: 'Space Grotesk SemiBold',
                fontSize: t.typography.displayLg.fontSize,
                lineHeight: t.typography.displayLg.lineHeight,
                letterSpacing: -0.3,
                color: t.colors.textPrimary,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.body.fontSize,
                  lineHeight: t.typography.body.lineHeight,
                  color: t.colors.textSecondary,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
          {children}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
