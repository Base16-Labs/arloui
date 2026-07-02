import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { playgroundFontAssets } from './playground-fonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

export function FontGate({ children }: { children: ReactNode }) {
  const [loaded, error] = useFonts(playgroundFontAssets);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#101828' }}>
        <ActivityIndicator color="#155DFC" />
      </View>
    );
  }

  return <>{children}</>;
}
