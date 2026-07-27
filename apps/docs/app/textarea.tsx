import { OutlineArrowUp, OutlineMicrophone } from '@arloui/icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TextArea,
  useTokens,
  type TextAreaAppearance,
  type TextAreaSize,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type IconMode = 'none' | 'leading' | 'trailing' | 'both';
type ContentMode = 'empty' | 'filled' | 'long';
type FieldState = 'default' | 'helper' | 'error' | 'disabled';
type CounterMode = 'off' | 'on';

const APPEARANCES: TextAreaAppearance[] = ['filled', 'plain'];
const SIZES: TextAreaSize[] = ['sm', 'md'];
const ICONS: IconMode[] = ['none', 'leading', 'trailing', 'both'];
const CONTENT: ContentMode[] = ['empty', 'filled', 'long'];
const STATES: FieldState[] = ['default', 'helper', 'error', 'disabled'];
const COUNTER: CounterMode[] = ['off', 'on'];

export default function TextAreaCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [appearance, setAppearance] = useState<TextAreaAppearance>('filled');
  const [size, setSize] = useState<TextAreaSize>('md');
  const [icons, setIcons] = useState<IconMode>('none');
  const [content, setContent] = useState<ContentMode>('filled');
  const [state, setState] = useState<FieldState>('helper');
  const [counter, setCounter] = useState<CounterMode>('on');
  const [value, setValue] = useState('This is a calm place to write longer content.');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const previewOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -170 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [previewOffset, sheetOpen]);

  useEffect(() => {
    if (content === 'empty') {
      setValue('');
      return;
    }

    setValue(
      content === 'long'
        ? 'Arlo UI components should feel native, quiet, and easy to copy into a real app. This textarea is for longer form entries without making the screen feel heavy.'
        : 'This is a calm place to write longer content.',
    );
  }, [content]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
      // The variant sheet and the keyboard can't share the screen — focusing the
      // field while the sheet is open left it stuck behind the keyboard, so close it.
      setSheetOpen(false);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const iconColor = state === 'disabled' ? t.colors.textDisabled : t.colors.textSecondary;
  const showLeading = icons === 'leading' || icons === 'both';
  const showTrailing = icons === 'trailing' || icons === 'both';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
          style={{ flex: 1 }}
        >
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

          {keyboardOpen ? (
            <View
              style={{
                position: 'absolute',
                top: 62,
                right: 20,
                zIndex: 6,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Dismiss keyboard"
                onPress={Keyboard.dismiss}
                style={({ pressed }) => ({
                  minHeight: 32,
                  paddingHorizontal: 12,
                  borderRadius: t.radii.full,
                  borderWidth: 1,
                  borderColor: t.colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed ? t.colors.surfaceStrong : t.colors.surfaceRaised,
                })}
              >
                <Text
                  style={{
                    color: t.colors.textPrimary,
                    fontFamily: 'Manrope SemiBold',
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </View>
          ) : null}

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
                paddingVertical: 32,
                alignItems: appearance === 'plain' ? 'center' : 'stretch',
              }}
            >
              <TextArea
                value={value}
                onChangeText={setValue}
                appearance={appearance}
                size={size}
                label={appearance === 'filled' ? 'Message' : undefined}
                placeholder="Write a message"
                editable={state !== 'disabled'}
                state={state === 'error' ? 'error' : 'default'}
                helperText={state === 'helper' ? 'Helper text' : undefined}
                errorText={state === 'error' ? 'Message is required' : undefined}
                maxLength={200}
                showCount={counter === 'on'}
                leadingIcon={
                  showLeading ? (
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: t.radii.full,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: t.colors.surfaceStrong,
                      }}
                    >
                      <OutlineMicrophone width={16} height={16} color={iconColor} />
                    </View>
                  ) : undefined
                }
                trailingIcon={
                  showTrailing ? (
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: t.radii.full,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#155DFC',
                      }}
                    >
                      <OutlineArrowUp width={16} height={16} color="#FFFFFF" />
                    </View>
                  ) : undefined
                }
                containerStyle={appearance === 'plain' ? { width: '100%' } : { width: '100%' }}
                inputStyle={{ fontFamily: 'Manrope' }}
                helperStyle={{ fontFamily: 'Manrope' }}
              />
            </View>
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
                componentName="TextArea"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => {
                  Keyboard.dismiss();
                  setSheetOpen(true);
                }}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Input"
            next="Icons"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => {
              Keyboard.dismiss();
              router.replace('/input');
            }}
            onNext={() => {
              Keyboard.dismiss();
              router.replace('/icons');
            }}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Style">
                {APPEARANCES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option === 'plain' ? 'no bg' : option}
                    active={appearance === option}
                    onPress={() => setAppearance(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Size">
                {SIZES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={size === option}
                    onPress={() => setSize(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Icons">
                {ICONS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={icons === option}
                    onPress={() => setIcons(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Content">
                {CONTENT.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={content === option}
                    onPress={() => setContent(option)}
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
              <VariantControlRow label="Count">
                {COUNTER.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={counter === option}
                    onPress={() => setCounter(option)}
                  />
                ))}
              </VariantControlRow>
            </View>
          </VariantSheet>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
