/**
 * Arlo UI — Input
 *
 * Token-driven text input primitive matching the Figma text-input kit:
 * filled background, optional leading/trailing slots, helper/error text, compact
 * inner label mode, secure/password entry, disabled state, and web focus ring.
 */
import { forwardRef, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type PressableProps,
  type StyleProp,
  type TextInputFocusEventData,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

type InputSize = 'md' | 'lg';
type InputState = 'default' | 'error';

export type InputActionProps = Omit<PressableProps, 'children' | 'style'> & {
  children: React.ReactNode;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

export type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: InputState;
  size?: InputSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  leadingAction?: React.ReactNode;
  trailingAction?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  /** Shows a small label inside the input above the current value. */
  insetLabel?: boolean;
};

export function InputAction({
  children,
  accessibilityLabel,
  disabled,
  style,
  ...rest
}: InputActionProps) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        {
          minWidth: t.sizing.icon.lg,
          minHeight: t.sizing.icon.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.35 : pressed ? 0.72 : 1,
          cursor: Platform.OS === 'web' ? 'pointer' : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    helperText,
    errorText,
    state,
    size = 'md',
    leadingIcon,
    trailingIcon,
    leadingAction,
    trailingAction,
    containerStyle,
    inputStyle,
    helperStyle,
    fullWidth = true,
    insetLabel = false,
    editable = true,
    secureTextEntry,
    placeholderTextColor,
    onFocus,
    onBlur,
    value,
    defaultValue,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const [focused, setFocused] = useState(false);
  const isDisabled = editable === false;
  const hasValue =
    value != null
      ? String(value).length > 0
      : defaultValue != null && String(defaultValue).length > 0;
  const hasError = state === 'error' || Boolean(errorText);
  const supportingText = errorText ?? helperText;

  const dims = useMemo(() => {
    if (size === 'lg') {
      return {
        minHeight: insetLabel ? 60 : 52,
        paddingX: t.spacing[4],
        paddingY: insetLabel ? t.spacing[2] : 0,
        font: t.typography.body,
        label: t.typography.bodySm,
        gap: t.spacing[3],
      };
    }
    return {
      minHeight: insetLabel ? 52 : 44,
      paddingX: t.spacing[3],
      paddingY: insetLabel ? t.spacing[2] : 0,
      font: t.typography.bodySm,
      label: t.typography.label,
      gap: t.spacing[2],
    };
  }, [insetLabel, size, t]);

  const borderColor = hasError
    ? t.colors.borderError
    : focused
      ? t.colors.borderFocus
      : 'transparent';

  const focusWebStyle: ViewStyle | undefined = useMemo(() => {
    if (Platform.OS !== 'web' || !focused) return undefined;
    return { boxShadow: hasError ? t.focusRing.error : t.focusRing.main } as ViewStyle;
  }, [focused, hasError, t.focusRing.error, t.focusRing.main]);

  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View
      style={[
        { gap: t.spacing[2], alignSelf: fullWidth ? 'stretch' : 'flex-start' },
        containerStyle,
      ]}
    >
      {label && !insetLabel ? (
        <Text
          style={{
            color: hasError ? t.colors.textInteractiveError : t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight,
            fontWeight: '600',
          }}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          {
            minHeight: dims.minHeight,
            borderRadius: t.radii.md,
            backgroundColor: t.colors.surfaceInput,
            borderWidth: hasError || focused ? 1 : 0,
            borderColor,
            paddingHorizontal: dims.paddingX,
            paddingVertical: dims.paddingY,
            flexDirection: 'row',
            alignItems: 'center',
            gap: dims.gap,
            opacity: isDisabled ? 0.45 : 1,
          },
          focusWebStyle,
        ]}
      >
        {leadingAction ? <View style={{ marginLeft: -dims.paddingX }}>{leadingAction}</View> : null}
        {!leadingAction && leadingIcon ? (
          <View style={{ width: t.sizing.icon.md, alignItems: 'center', justifyContent: 'center' }}>
            {leadingIcon}
          </View>
        ) : null}

        <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
          {insetLabel && label ? (
            <Text
              numberOfLines={1}
              style={{
                color: hasError ? t.colors.textInteractiveError : t.colors.textTertiary,
                fontFamily: t.fontFamilies.sans,
                fontSize: dims.label.fontSize,
                lineHeight: dims.label.lineHeight,
                fontWeight: dims.label.fontWeight,
              }}
            >
              {label}
            </Text>
          ) : null}
          <TextInput
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            editable={editable}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={placeholderTextColor ?? t.colors.textTertiary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              {
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                fontSize: dims.font.fontSize,
                lineHeight: dims.font.lineHeight,
                fontWeight: dims.font.fontWeight,
                minHeight: insetLabel ? dims.font.lineHeight : dims.minHeight,
                padding: 0,
                margin: 0,
              },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null,
              inputStyle,
            ]}
            {...rest}
          />
        </View>

        {trailingAction ? (
          trailingAction
        ) : trailingIcon ? (
          <View style={{ width: t.sizing.icon.md, alignItems: 'center', justifyContent: 'center' }}>
            {trailingIcon}
          </View>
        ) : null}
      </View>

      {supportingText ? (
        <Text
          style={[
            {
              color: hasError ? t.colors.textInteractiveError : t.colors.textSecondary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.bodySm.fontSize,
              lineHeight: t.typography.bodySm.lineHeight,
            },
            helperStyle,
          ]}
        >
          {supportingText}
        </Text>
      ) : null}
    </View>
  );
});

export type { InputSize, InputState };
