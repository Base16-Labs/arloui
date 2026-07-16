import 'react-native-gesture-handler';
import { ThemeProvider, useTokens } from '@arloui/registry';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontGate } from '@/providers/font-gate';

export default function RootLayout() {
  return (
    <FontGate>
      <SafeAreaProvider>
        <ThemeProvider defaultName="light">
          <ThemedStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </FontGate>
  );
}

function ThemedStack() {
  const t = useTokens();
  const isDark = t.name === 'dark';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.colors.bg },
          headerTintColor: t.colors.textPrimary,
          headerShadowVisible: false,
          headerBackTitle: 'Back',
          headerTitleStyle: {
            fontFamily: 'Manrope SemiBold',
            fontSize: 17,
          },
          contentStyle: { flex: 1, minHeight: 0, backgroundColor: t.colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="button" options={{ title: 'Button' }} />
        <Stack.Screen name="input" options={{ title: 'Input' }} />
        <Stack.Screen name="textarea" options={{ title: 'TextArea' }} />
        <Stack.Screen name="sheet" options={{ title: 'Sheet' }} />
        <Stack.Screen name="date-picker" options={{ title: 'Date Picker' }} />
        <Stack.Screen name="icons" options={{ title: 'Icons' }} />
        <Stack.Screen name="badge" options={{ title: 'Badge' }} />
        <Stack.Screen name="checkbox" options={{ title: 'Checkbox' }} />
        <Stack.Screen name="chip" options={{ title: 'Chip' }} />
        <Stack.Screen name="radio" options={{ title: 'Radio' }} />
        <Stack.Screen name="toggle" options={{ title: 'Toggle' }} />
        <Stack.Screen name="components/button" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
