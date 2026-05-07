import { ThemeProvider, useTokens } from '@arloui/registry';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider defaultName="system">
        <ThemedStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedStack() {
  const t = useTokens();
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: t.colors.bg },
          headerTintColor: t.colors.textPrimary,
          headerTitleStyle: {
            fontFamily: t.fontFamilies.sans,
            fontWeight: '600',
          },
          contentStyle: { flex: 1, minHeight: 0, backgroundColor: t.colors.bg },
          title:
            route.name === 'index'
              ? 'Arlo UI'
              : route.name === 'icons'
                ? 'Icons'
                : route.name === 'button'
                  ? 'Button'
                  : route.name === 'input'
                    ? 'Input'
                    : route.name === 'components/button'
                      ? 'Button'
                      : undefined,
        })}
      />
    </>
  );
}
