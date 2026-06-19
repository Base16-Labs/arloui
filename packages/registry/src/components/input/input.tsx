/**
 * Arlo UI — Input
 *
 * Token-driven text input primitive matching the Figma text-input kit:
 * filled or plain background treatment, optional leading/trailing slots,
 * helper/error text, compact inner label mode, secure/password entry, disabled
 * state, and accessible text entry.
 */
import { forwardRef, useMemo } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

type InputSize = 'sm' | 'md';
type InputState = 'default' | 'error';
type InputAppearance = 'filled' | 'plain';

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
  /** `plain` removes the field surface, border, and horizontal inset. */
  appearance?: InputAppearance;
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

function InfoIcon({ color, size = 13 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fill={color}
        d="M12 2.253a9.76 9.76 0 0 0-5.417 1.64 9.74 9.74 0 0 0-4.146 10.01 9.74 9.74 0 0 0 2.67 4.99 9.8 9.8 0 0 0 4.991 2.67c1.891.37 3.852.18 5.633-.56a9.66 9.66 0 0 0 4.376-3.59 9.74 9.74 0 0 0-1.216-12.31 9.77 9.77 0 0 0-6.89-2.85m0 18a8.3 8.3 0 0 1-4.583-1.39 8.27 8.27 0 0 1-3.039-3.71 8.2 8.2 0 0 1-.469-4.76 8.3 8.3 0 0 1 2.257-4.23 8.3 8.3 0 0 1 4.225-2.26c1.6-.31 3.26-.15 4.766.47a8.33 8.33 0 0 1 3.703 3.04 8.26 8.26 0 0 1 1.39 4.59 8.27 8.27 0 0 1-2.419 5.83 8.32 8.32 0 0 1-5.83 2.42m1.5-3.75a.751.751 0 0 1-.75.75c-.398 0-.779-.16-1.06-.44a1.5 1.5 0 0 1-.44-1.06v-3.75a.751.751 0 0 1 0-1.5c.398 0 .78.15 1.061.44.281.28.44.66.44 1.06v3.75c.198 0 .39.07.53.22.14.14.22.33.22.53m-3-8.63c0-.22.066-.44.19-.62.123-.19.3-.33.504-.42.206-.08.432-.11.65-.06.22.04.42.15.576.31.158.15.265.35.308.57.044.22.022.45-.064.65-.085.21-.229.38-.414.51-.185.12-.402.19-.625.19a1.127 1.127 0 0 1-1.125-1.13"
      />
    </Svg>
  );
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    helperText,
    errorText,
    state,
    appearance = 'filled',
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
  const isDisabled = editable === false;
  const hasValue =
    value != null
      ? String(value).length > 0
      : defaultValue != null && String(defaultValue).length > 0;
  const hasError = state === 'error' || Boolean(errorText);
  const supportingText = errorText ?? helperText;
  const isPlain = appearance === 'plain';
  const stretches = fullWidth && !isPlain;

  const dims = useMemo(() => {
    if (isPlain) {
      if (size === 'md') {
        return {
          minHeight: 35,
          paddingX: 0,
          paddingY: 0,
          font: t.typography.displayMedium,
          label: t.typography.bodySm,
          gap: t.spacing[1],
          iconSize: t.sizing.icon.sm,
        };
      }
      return {
        minHeight: 26,
        paddingX: 0,
        paddingY: 0,
        font: t.typography.headingLarge,
        label: t.typography.label,
        gap: t.spacing[1],
        iconSize: t.sizing.icon.xs,
      };
    }

    if (size === 'md') {
      return {
        minHeight: 52,
        paddingX: t.spacing[3],
        paddingY: t.spacing[2],
        font: t.typography.body,
        label: t.typography.bodySm,
        gap: t.spacing[2],
        iconSize: t.sizing.icon.sm,
      };
    }
    return {
      minHeight: 36,
      paddingX: t.spacing[3],
      paddingY: t.spacing[1],
      font: t.typography.bodySm,
      label: t.typography.label,
      gap: t.spacing[2],
      iconSize: t.sizing.icon.xs,
    };
  }, [isPlain, size, t]);

  const borderColor = hasError
    ? t.colors.borderError
    : 'transparent';
  const textColor = hasError
    ? t.colors.textInteractiveError
    : isDisabled
      ? t.colors.textDisabled
      : isPlain
        ? t.colors.textSecondary
        : t.colors.textPrimary;
  const supportingTextColor = hasError
    ? t.colors.textInteractiveError
    : isDisabled
      ? t.colors.textDisabled
      : t.colors.textSecondary;
  const plainText = String(value || defaultValue || rest.placeholder || '');
  const plainInputWidth = isPlain
    ? Math.max(
        size === 'md' ? 132 : 88,
        Math.min(300, plainText.length * dims.font.fontSize * 0.68 + 12),
      )
    : undefined;

  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    onFocus?.(event);
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    onBlur?.(event);
  };

  return (
    <View
      style={[
        {
          gap: isPlain ? t.spacing[1] : t.spacing[2],
          alignSelf: stretches ? 'stretch' : 'flex-start',
        },
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
            borderRadius: isPlain ? 0 : t.radii.md,
            backgroundColor: isPlain ? 'transparent' : t.colors.surfaceInput,
            borderWidth: !isPlain && hasError ? 1 : 0,
            borderColor,
            paddingHorizontal: isPlain ? 0 : dims.paddingX,
            paddingVertical: dims.paddingY,
            flexDirection: 'row',
            alignItems: 'center',
            gap: dims.gap,
            alignSelf: stretches ? 'stretch' : 'flex-start',
            opacity: isDisabled ? 0.45 : 1,
          },
        ]}
      >
        {leadingAction ? (
          <View style={{ marginLeft: isPlain ? 0 : -dims.paddingX }}>{leadingAction}</View>
        ) : null}
        {!leadingAction && leadingIcon ? (
          <View
            style={{
              width: dims.iconSize + 4,
              height: dims.iconSize + 4,
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {leadingIcon}
          </View>
        ) : null}

        <View
          style={{
            flex: stretches ? 1 : undefined,
            minWidth: stretches ? 0 : undefined,
            justifyContent: 'center',
          }}
        >
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
                color: textColor,
                fontFamily: t.fontFamilies.sans,
                fontSize: dims.font.fontSize,
                lineHeight: dims.font.lineHeight,
                fontWeight: dims.font.fontWeight,
                minHeight: dims.font.lineHeight,
                width: plainInputWidth,
                textAlign: isPlain ? 'center' : 'left',
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
          <View
            style={{
              width: dims.iconSize + 4,
              height: dims.iconSize + 4,
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {trailingIcon}
          </View>
        ) : null}
      </View>

      {supportingText ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: isPlain ? 'center' : 'flex-start',
            gap: t.spacing[1],
            alignSelf: stretches ? 'stretch' : isPlain ? 'center' : 'flex-start',
          }}
        >
          <InfoIcon color={supportingTextColor} />
          <Text
            style={[
              {
                flexShrink: 1,
                color: supportingTextColor,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              },
              helperStyle,
            ]}
          >
            {supportingText}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

export type { InputAppearance, InputSize, InputState };
