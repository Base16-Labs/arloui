import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation, type NativeStackNavigationProp } from 'expo-router';
import { Animated, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { variantSheetHeight } from './variant-sheet';
import { subscribeChartScreenEntrance } from './chart-screen-entrance';

/**
 * Lift the stage when the variants sheet opens — same spring language as the
 * other playgrounds. Cap it so tall charts peek above the sheet without the
 * hard bottom-padding crop that used to reflow the whole layout.
 */
function sheetLift(windowHeight: number) {
  return Math.min(180, Math.round(variantSheetHeight(windowHeight) * 0.38));
}

export function ChartCanvas({ sheetOpen, children }: { sheetOpen: boolean; children: ReactNode }) {
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, undefined>>>();
  const [screenReady, setScreenReady] = useState(false);
  useLayoutEffect(() => subscribeChartScreenEntrance(
    navigation,
    Platform.OS !== 'web',
    setScreenReady,
    { request: (callback) => requestAnimationFrame(callback), cancel: (id) => cancelAnimationFrame(id) },
  ), [navigation]);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [previewOffset] = useState(() => new Animated.Value(0));
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const canScroll = contentHeight > viewportHeight + 8;

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -sheetLift(height) : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [height, previewOffset, sheetOpen]);

  return (
    <View style={{ flex: 1, paddingTop: 72, paddingBottom: insets.bottom + 64 }}>
      <Animated.View style={{ flex: 1, transform: [{ translateY: previewOffset }] }}>
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={canScroll}
          bounces={canScroll}
          alwaysBounceVertical={false}
          overScrollMode={canScroll ? 'auto' : 'never'}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
          onContentSizeChange={(_, nextHeight) => setContentHeight(nextHeight)}
        >
          <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center', gap: 14 }}>
            {screenReady ? children : null}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
