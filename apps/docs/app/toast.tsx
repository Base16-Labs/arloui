import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  Button,
  Toaster,
  useToast,
  useTokens,
  type ToastColorStyle,
  type ToastPosition,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

const POSITIONS: ToastPosition[] = ['top', 'bottom'];
const COLOR_STYLES: ToastColorStyle[] = ['contrast', 'same'];

// Cycled so repeated presses build a legible deck rather than three identical rows.
const MESSAGES: [string, ...string[]] = [
  'Changes saved successfully',
  'Draft autosaved',
  'Profile updated',
  'Invite sent to the team',
  'Copied to clipboard',
];

const messageAt = (index: number) => MESSAGES[index % MESSAGES.length] ?? MESSAGES[0];

function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM8.5 13.5L5 10L6.41 8.59L8.5 10.67L13.09 6.09L14.5 7.5L8.5 13.5Z"
        fill={color}
      />
    </Svg>
  );
}

export default function ToastCanvas() {
  const t = useTokens();
  const dark = t.name === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [position, setPosition] = useState<ToastPosition>('bottom');
  const [colorStyle, setColorStyle] = useState<ToastColorStyle>('contrast');
  const [showIcon, setShowIcon] = useState(false);
  const [showDismiss, setShowDismiss] = useState(false);
  const previewOffset = useRef(new Animated.Value(0)).current;
  const { toast } = useToast();
  const pressCount = useRef(0);

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -120 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [previewOffset, sheetOpen]);

  const isContrast = colorStyle === 'contrast';
  const iconColor = isContrast
    ? dark
      ? t.colors.surfaceBackground
      : t.colors.surfaceBackground
    : t.colors.feedbackSuccess;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 22,
              left: 20,
              right: 20,
              zIndex: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LiveBadge />
            </View>
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ translateY: previewOffset }],
            }}
          >
            <Button
              onPress={() =>
                toast(messageAt(pressCount.current++), {
                  colorStyle,
                  icon: showIcon ? <CheckIcon color={iconColor} /> : undefined,
                  showDismiss,
                })
              }
            >
              Show Toast
            </Button>
          </Animated.View>

          {!sheetOpen ? (
            <View
              style={{
                position: 'absolute',
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="Toast"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Gallery"
            next="Badge"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/gallery')}
            onNext={() => router.replace('/badge')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Position">
                {POSITIONS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={position === value}
                    onPress={() => setPosition(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Color">
                {COLOR_STYLES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={colorStyle === value}
                    onPress={() => setColorStyle(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Icon">
                {(['off', 'on'] as const).map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={showIcon === (value === 'on')}
                    onPress={() => setShowIcon(value === 'on')}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Dismiss">
                {(['off', 'on'] as const).map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={showDismiss === (value === 'on')}
                    onPress={() => setShowDismiss(value === 'on')}
                  />
                ))}
              </VariantControlRow>
            </View>
          </VariantSheet>

          <Toaster
            position={position}
            colorStyle={colorStyle}
            topInset={insets.top}
            bottomInset={insets.bottom + 60}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
