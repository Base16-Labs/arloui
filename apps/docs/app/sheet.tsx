import { BlurView } from 'expo-blur';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sheet,
  useTokens,
  type SheetBackdrop,
  type SheetHeight,
  type SheetPadding,
  type SheetSurface,
  type SheetWidth,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type PreviewState = 'open' | 'closed' | 'no handle' | 'locked';

const BACKDROPS: SheetBackdrop[] = ['scrim', 'passthrough'];
const SURFACES: SheetSurface[] = ['solid', 'glass'];
const WIDTHS: SheetWidth[] = ['default', 'stack'];
const HEIGHTS: SheetHeight[] = ['auto', 'half', 'full'];
const PADDINGS: SheetPadding[] = ['none', 'md', 'lg'];
const STATES: PreviewState[] = ['open', 'closed', 'no handle', 'locked'];

export default function SheetCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [backdrop, setBackdrop] = useState<SheetBackdrop>('passthrough');
  const [surface, setSurface] = useState<SheetSurface>('glass');
  const [width, setWidth] = useState<SheetWidth>('stack');
  const [height, setHeight] = useState<SheetHeight>('auto');
  const [padding, setPadding] = useState<SheetPadding>('md');
  const [state, setState] = useState<PreviewState>('open');
  const [previewOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -155 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [previewOffset, sheetOpen]);

  useEffect(() => {
    setPreviewVisible(state !== 'closed');
  }, [state]);

  const showHandle = state !== 'no handle';
  const dragToDismiss = state !== 'locked';
  const previewHeight = height === 'full' ? 430 : height === 'half' ? 270 : undefined;

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
              paddingHorizontal: 20,
              transform: [{ translateY: previewOffset }],
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 350,
                height: 470,
                overflow: 'hidden',
                borderRadius: 34,
                borderWidth: 1,
                borderColor: t.colors.border,
                backgroundColor: t.colors.bg,
              }}
            >
              <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
                <Text
                  style={{
                    color: t.colors.textPrimary,
                    fontFamily: 'Manrope SemiBold',
                    fontSize: 15,
                    lineHeight: 20,
                  }}
                >
                  Library
                </Text>
                <View style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {['#155DFC', '#00C950', '#F54900', '#FB2C36'].map((color) => (
                    <View
                      key={color}
                      style={{
                        width: '48%',
                        height: 82,
                        borderRadius: 18,
                        backgroundColor: color,
                        opacity: t.name === 'dark' ? 0.38 : 0.22,
                      }}
                    />
                  ))}
                </View>
              </View>

              {previewVisible ? (
                <Sheet
                  visible={previewVisible}
                  onClose={() => setPreviewVisible(false)}
                  backdrop={backdrop}
                  surface={surface}
                  width={width}
                  height={height}
                  padding={padding}
                  handleHeight={3}
                  showHandle={showHandle}
                  dragToDismiss={dragToDismiss}
                  dismissOnBackdropPress={state !== 'locked'}
                  blurComponent={
                    surface === 'glass' ? (
                      <BlurView
                        intensity={34}
                        tint={t.name === 'dark' ? 'dark' : 'light'}
                        style={StyleSheet.absoluteFill}
                      />
                    ) : undefined
                  }
                  bottomInset={10}
                  style={{
                    position: 'absolute',
                    height: previewHeight,
                    maxHeight: 430,
                  }}
                >
                  <Sheet.Header title="Add to collection">
                    <Text
                      style={{
                        color: t.colors.textSecondary,
                        fontFamily: 'Manrope',
                        fontSize: 13,
                        lineHeight: 18,
                      }}
                    >
                      Save this item to a list without leaving the current screen.
                    </Text>
                  </Sheet.Header>
                  <Sheet.Body>
                    {['Recently added', 'Favorites', 'Shared with you'].map((label) => (
                      <Pressable
                        key={label}
                        style={({ pressed }) => ({
                          minHeight: 44,
                          justifyContent: 'center',
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          backgroundColor: pressed ? t.colors.surfaceStrong : t.colors.surfaceInput,
                        })}
                      >
                        <Text
                          style={{
                            color: t.colors.textPrimary,
                            fontFamily: 'Manrope Medium',
                            fontSize: 14,
                          }}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    ))}
                  </Sheet.Body>
                  <Sheet.Footer>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => undefined}
                      style={({ pressed }) => ({
                        minHeight: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: t.radii.full,
                        backgroundColor: pressed ? '#1447E6' : '#155DFC',
                      })}
                    >
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontFamily: 'Manrope SemiBold',
                          fontSize: 14,
                        }}
                      >
                        Done
                      </Text>
                    </Pressable>
                  </Sheet.Footer>
                </Sheet>
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    left: 0,
                    paddingHorizontal: 20,
                    paddingBottom: 24,
                    alignItems: 'center',
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setPreviewVisible(true)}
                    style={({ pressed }) => ({
                      minHeight: 40,
                      paddingHorizontal: 16,
                      borderRadius: t.radii.full,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: pressed ? t.colors.surfaceStrong : t.colors.surfaceRaised,
                      borderWidth: 1,
                      borderColor: t.colors.border,
                    })}
                  >
                    <Text
                      style={{
                        color: t.colors.textPrimary,
                        fontFamily: 'Manrope SemiBold',
                        fontSize: 13,
                      }}
                    >
                      Open sheet
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </Animated.View>

          {!sheetOpen ? (
            <View
              style={{
                position: 'absolute',
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                right: 0,
                zIndex: 10,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="Sheet"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Tab Bar"
            next="Icons"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/tab-bar')}
            onNext={() => router.replace('/icons')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Backdrop">
                {BACKDROPS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={backdrop === option}
                    onPress={() => {
                      setBackdrop(option);
                      setPreviewVisible(true);
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Surface">
                {SURFACES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={surface === option}
                    onPress={() => {
                      setSurface(option);
                      setPreviewVisible(true);
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Width">
                {WIDTHS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={width === option}
                    onPress={() => {
                      setWidth(option);
                      setPreviewVisible(true);
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Height">
                {HEIGHTS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={height === option}
                    onPress={() => {
                      setHeight(option);
                      setPreviewVisible(true);
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Padding">
                {PADDINGS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={padding === option}
                    onPress={() => {
                      setPadding(option);
                      setPreviewVisible(true);
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="State">
                {STATES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={state === option}
                    onPress={() => setState(option)}
                  />
                ))}
              </VariantControlRow>
            </View>
          </VariantSheet>
        </View>
      </SafeAreaView>
    </>
  );
}
