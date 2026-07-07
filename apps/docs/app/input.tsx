import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Input,
  InputAction,
  useTokens,
  type InputAppearance,
  type InputProps,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type InputType = 'text' | 'email' | 'password' | 'search';
type LabelMode = 'none' | 'inset';
type InputSize = 'sm' | 'md';
type IconMode = 'none' | 'leading' | 'trailing' | 'both';
type ContentMode = 'empty' | 'filled';
type FieldState = 'default' | 'helper' | 'error' | 'disabled';

const TYPES: InputType[] = ['text', 'email', 'password', 'search'];
const LABELS: LabelMode[] = ['none', 'inset'];
const SIZES: InputSize[] = ['sm', 'md'];
const ICONS: IconMode[] = ['none', 'leading', 'trailing', 'both'];
const CONTENT: ContentMode[] = ['empty', 'filled'];
const STATES: FieldState[] = ['default', 'helper', 'error', 'disabled'];
const APPEARANCES: InputAppearance[] = ['filled', 'plain'];

export default function InputCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [type, setType] = useState<InputType>('text');
  const [labelMode, setLabelMode] = useState<LabelMode>('none');
  const [size, setSize] = useState<InputSize>('md');
  const [icons, setIcons] = useState<IconMode>('trailing');
  const [content, setContent] = useState<ContentMode>('filled');
  const [state, setState] = useState<FieldState>('default');
  const [appearance, setAppearance] = useState<InputAppearance>('filled');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [value, setValue] = useState('Allan Thomas');
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
      type === 'email'
        ? 'allan.thomas@atstudio.com'
        : type === 'password'
          ? 'Password'
          : type === 'search'
            ? 'Query'
            : appearance === 'plain'
              ? 'Content'
              : 'Allan Thomas',
    );
  }, [appearance, content, type]);

  const iconColor = state === 'disabled' ? t.colors.textDisabled : t.colors.textSecondary;
  const iconSize = size === 'sm' ? 16 : 20;
  const leadingName =
    type === 'email' ? 'mail-outline' : type === 'search' ? 'search-outline' : 'person-outline';
  const inputLabel =
    type === 'email'
      ? 'Email'
      : type === 'password'
        ? 'Password'
        : type === 'search'
          ? 'Search'
          : 'Name';

  const trailingAction = useMemo(() => {
    if (icons !== 'trailing' && icons !== 'both') return undefined;

    if (type === 'password') {
      return (
        <InputAction
          accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          onPress={() => setPasswordVisible((visible) => !visible)}
        >
          <Ionicons
            name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
            size={iconSize}
            color={iconColor}
          />
        </InputAction>
      );
    }

    if (type === 'search' && value) {
      return (
        <InputAction accessibilityLabel="Clear input" onPress={() => setValue('')}>
          <Ionicons name="close" size={iconSize} color={iconColor} />
        </InputAction>
      );
    }

    return (
      <InputAction accessibilityLabel="Copy input value" onPress={() => undefined}>
        <Ionicons name="copy-outline" size={iconSize} color={iconColor} />
      </InputAction>
    );
  }, [iconColor, icons, passwordVisible, type, value]);

  const fieldProps: InputProps = {
    value,
    onChangeText: setValue,
    size,
    appearance,
    label: labelMode === 'none' ? undefined : inputLabel,
    insetLabel: labelMode === 'inset',
    placeholder: inputLabel,
    keyboardType: type === 'email' ? 'email-address' : 'default',
    autoCapitalize: type === 'email' || type === 'search' ? 'none' : 'words',
    secureTextEntry: type === 'password' && !passwordVisible,
    editable: state !== 'disabled',
    state: state === 'error' ? 'error' : 'default',
    helperText: state === 'helper' ? 'Helper text' : undefined,
    errorText: state === 'error' ? `${inputLabel} is invalid` : undefined,
    leadingIcon:
      icons === 'leading' || icons === 'both' ? (
        <Ionicons name={leadingName} size={iconSize} color={iconColor} />
      ) : undefined,
    trailingAction,
    containerStyle: appearance === 'plain' ? { alignSelf: 'center' } : { width: '100%' },
    inputStyle: { fontFamily: 'Manrope' },
    helperStyle: { fontFamily: 'Manrope' },
  };

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
            <LiveBadge />
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
                paddingVertical: 32,
                alignItems: appearance === 'plain' ? 'center' : 'stretch',
              }}
            >
              <Input {...fieldProps} />
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
                componentName="Input"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Button"
            next="TextArea"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/button')}
            onNext={() => router.replace('/textarea')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Type">
                {TYPES.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={type === option}
                    onPress={() => setType(option)}
                  />
                ))}
              </VariantControlRow>
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
              <VariantControlRow label="Label">
                {LABELS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={labelMode === option}
                    onPress={() => setLabelMode(option)}
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
            </View>
          </VariantSheet>
        </View>
      </SafeAreaView>
    </>
  );
}
