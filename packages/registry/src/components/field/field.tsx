/**
 * Arlo UI — Field
 *
 * Composable text-field primitive. The pieces share state (size, appearance, error,
 * disabled, focus) through context, so you assemble exactly the layout you need
 * without a wall of props:
 *
 *   <Field error={!!errors.email}>
 *     <Field.Label>Email</Field.Label>
 *     <Field.Control>
 *       <Field.Icon><MailIcon /></Field.Icon>
 *       <Field.Input value={value} onChangeText={setValue} />
 *       <Field.Action accessibilityLabel="Clear" onPress={clear}><XIcon /></Field.Action>
 *     </Field.Control>
 *     <Field.Helper>{errors.email ?? 'We never share it.'}</Field.Helper>
 *   </Field>
 *
 * The high-level `Input` (see input.tsx) is a preset built from these parts.
 */
import { createContext, forwardRef, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

type Tokens = ReturnType<typeof useTokens>;

export type InputSize = 'sm' | 'md';
export type InputState = 'default' | 'error';
export type InputAppearance = 'filled' | 'plain';

type FieldContextValue = {
  size: InputSize;
  appearance: InputAppearance;
  hasError: boolean;
  disabled: boolean;
  fullWidth: boolean;
  /** Multiline (textarea) layout: column control, top-aligned input, bottom toolbar. */
  multiline: boolean;
  focused: boolean;
  setFocused: (value: boolean) => void;
};

const DEFAULT_CONTEXT: FieldContextValue = {
  size: 'md',
  appearance: 'filled',
  hasError: false,
  disabled: false,
  fullWidth: true,
  multiline: false,
  focused: false,
  setFocused: () => {},
};

const FieldContext = createContext<FieldContextValue>(DEFAULT_CONTEXT);

/** Read the surrounding Field's shared state. Falls back to sensible defaults if used standalone. */
function useField(): FieldContextValue {
  return useContext(FieldContext);
}

type FieldDims = {
  minHeight: number;
  paddingX: number;
  paddingY: number;
  font: { fontSize: number; lineHeight: number; fontWeight?: TextStyle['fontWeight'] };
  label: { fontSize: number; lineHeight: number; fontWeight?: TextStyle['fontWeight'] };
  gap: number;
  iconSize: number;
};

/** Single source of truth for field dimensions across the filled/plain × sm/md × single/multiline matrix. */
function fieldDims(t: Tokens, isPlain: boolean, size: InputSize, multiline: boolean): FieldDims {
  if (multiline) {
    if (isPlain) {
      return size === 'md'
        ? { minHeight: 118, paddingX: 0, paddingY: 0, font: t.typography.body, label: t.typography.bodySm, gap: t.spacing[1], iconSize: t.sizing.icon.sm }
        : { minHeight: 86, paddingX: 0, paddingY: 0, font: t.typography.bodySm, label: t.typography.label, gap: t.spacing[1], iconSize: t.sizing.icon.xs };
    }
    return size === 'md'
      ? { minHeight: 132, paddingX: t.spacing[3], paddingY: t.spacing[3], font: t.typography.body, label: t.typography.bodySm, gap: t.spacing[1], iconSize: t.sizing.icon.sm }
      : { minHeight: 112, paddingX: t.spacing[3], paddingY: t.spacing[2], font: t.typography.bodySm, label: t.typography.label, gap: t.spacing[1], iconSize: t.sizing.icon.xs };
  }
  if (isPlain) {
    return size === 'md'
      ? { minHeight: t.typography.displayMedium.lineHeight, paddingX: 0, paddingY: 0, font: t.typography.displayMedium, label: t.typography.bodySm, gap: t.spacing[1], iconSize: t.sizing.icon.sm }
      : { minHeight: t.typography.headingLarge.lineHeight, paddingX: 0, paddingY: 0, font: t.typography.headingLarge, label: t.typography.label, gap: t.spacing[1], iconSize: t.sizing.icon.xs };
  }
  return size === 'md'
    ? { minHeight: t.sizing.buttonHeight.xl, paddingX: t.spacing[3], paddingY: t.spacing[2], font: t.typography.body, label: t.typography.bodySm, gap: t.spacing[2], iconSize: t.sizing.icon.sm }
    : { minHeight: 36, paddingX: t.spacing[3], paddingY: t.spacing[1], font: t.typography.bodySm, label: t.typography.label, gap: t.spacing[2], iconSize: t.sizing.icon.xs };
}

function useFieldDims(): { dims: FieldDims; isPlain: boolean; multiline: boolean; stretches: boolean } {
  const t = useTokens();
  const { size, appearance, fullWidth, multiline } = useField();
  const isPlain = appearance === 'plain';
  const dims = useMemo(() => fieldDims(t, isPlain, size, multiline), [t, isPlain, size, multiline]);
  // A textarea keeps its full width even when plain; a single-line plain field hugs its content.
  const stretches = multiline ? fullWidth : fullWidth && !isPlain;
  return { dims, isPlain, multiline, stretches };
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

export type FieldProps = {
  children: ReactNode;
  size?: InputSize;
  appearance?: InputAppearance;
  /** Switches the field into its error palette. */
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Multiline (textarea) layout: column control, top-aligned input, bottom toolbar, optional count. */
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
};

function FieldRoot({
  children,
  size = 'md',
  appearance = 'filled',
  error = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  style,
}: FieldProps) {
  const t = useTokens();
  const [focused, setFocused] = useState(false);
  const isPlain = appearance === 'plain';
  const stretches = multiline ? fullWidth : fullWidth && !isPlain;

  const ctx = useMemo<FieldContextValue>(
    () => ({ size, appearance, hasError: error, disabled, fullWidth, multiline, focused, setFocused }),
    [size, appearance, error, disabled, fullWidth, multiline, focused],
  );

  return (
    <FieldContext.Provider value={ctx}>
      <View
        style={[
          {
            gap: multiline || isPlain ? t.spacing[1] : t.spacing[2],
            alignSelf: stretches ? 'stretch' : 'flex-start',
          },
          style,
        ]}
      >
        {children}
      </View>
    </FieldContext.Provider>
  );
}

/** Standalone label rendered above the control. */
function FieldLabel({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTokens();
  const { hasError } = useField();
  return (
    <Text
      style={[
        {
          color: hasError ? t.colors.textInteractiveError : t.colors.textPrimary,
          fontFamily: t.fontFamilies.sans,
          fontSize: t.typography.bodySm.fontSize,
          lineHeight: t.typography.bodySm.lineHeight,
          fontWeight: t.fontWeights.semibold,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** The field surface — the bordered/filled row that holds icons, the input, and actions. */
function FieldControl({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const { hasError, disabled, focused } = useField();
  const { dims, isPlain, multiline, stretches } = useFieldDims();
  return (
    <View
      style={[
        {
          minHeight: dims.minHeight,
          borderRadius: isPlain ? 0 : multiline ? t.radii.xl : t.radii.md,
          backgroundColor: isPlain
            ? 'transparent'
            : focused
              ? t.colors.surfaceInputActive
              : t.colors.surfaceInput,
          borderWidth: !isPlain && hasError ? 1 : 0,
          borderColor: hasError ? t.colors.borderError : 'transparent',
          paddingHorizontal: isPlain ? 0 : dims.paddingX,
          paddingVertical: dims.paddingY,
          flexDirection: multiline ? 'column' : 'row',
          alignItems: multiline ? 'stretch' : 'center',
          gap: dims.gap,
          alignSelf: stretches ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Non-interactive leading/trailing glyph slot. */
function FieldIcon({ children }: { children: ReactNode }) {
  const { dims } = useFieldDims();
  return (
    <View
      style={{
        width: dims.iconSize + 4,
        height: dims.iconSize + 4,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}

export type FieldActionProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

/** Interactive leading/trailing slot — a clear button, password toggle, copy, etc. */
function FieldAction({ children, accessibilityLabel, disabled, style, ...rest }: FieldActionProps) {
  const t = useTokens();
  const { disabled: fieldDisabled } = useField();
  const isDisabled = disabled ?? fieldDisabled;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={isDisabled}
      hitSlop={8}
      style={({ pressed }) => [
        {
          minWidth: t.sizing.icon.lg,
          minHeight: t.sizing.icon.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.35 : pressed ? 0.72 : 1,
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

export type FieldInputProps = Omit<TextInputProps, 'style' | 'editable'> & {
  /** Compact label shown inside the control, above the value. */
  insetLabel?: string;
  style?: StyleProp<TextStyle>;
};

/** The text entry itself. Reads color/size/focus from the surrounding Field. */
const FieldInput = forwardRef<TextInput, FieldInputProps>(function FieldInput(
  {
    insetLabel,
    style,
    onFocus,
    onBlur,
    placeholderTextColor,
    value,
    defaultValue,
    multiline: multilineProp,
    textAlignVertical,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const { size, hasError, disabled, setFocused } = useField();
  const { dims, isPlain, multiline: fieldMultiline, stretches } = useFieldDims();
  const multiline = multilineProp ?? fieldMultiline;

  const textColor = hasError
    ? t.colors.textInteractiveError
    : disabled
      ? t.colors.textDisabled
      : isPlain && !multiline
        ? t.colors.textSecondary
        : t.colors.textPrimary;

  const plainText = String(value || defaultValue || rest.placeholder || '');
  const plainInputWidth =
    isPlain && !multiline
      ? Math.max(size === 'md' ? 132 : 88, Math.min(300, plainText.length * dims.font.fontSize * 0.68 + 12))
      : undefined;

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View
      style={
        multiline
          ? { flex: 1, alignSelf: 'stretch' }
          : { flex: stretches ? 1 : undefined, minWidth: stretches ? 0 : undefined, justifyContent: 'center' }
      }
    >
      {insetLabel && !multiline ? (
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
          {insetLabel}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        editable={!disabled}
        multiline={multiline}
        textAlignVertical={textAlignVertical ?? (multiline ? 'top' : undefined)}
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
            flex: multiline ? 1 : undefined,
            alignSelf: multiline ? 'stretch' : undefined,
            width: plainInputWidth,
            textAlign: isPlain && !multiline ? 'center' : 'left',
            padding: t.spacing[0],
            margin: t.spacing[0],
          },
          Platform.OS === 'web'
            ? ({ outlineStyle: 'none', ...(multiline ? { resize: 'none' } : null) } as unknown as TextStyle)
            : null,
          style,
        ]}
        {...rest}
      />
    </View>
  );
});

/** Bottom row inside a multiline control that right-aligns its slots (mic, send, etc.). */
function FieldToolbar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { dims } = useFieldDims();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: dims.gap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Helper or error message rendered below the control. Renders nothing when there is
 * neither a message nor a count. Pass `count` to show a right-aligned character count.
 */
function FieldHelper({
  children,
  count,
  style,
}: {
  children?: ReactNode;
  count?: ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  const t = useTokens();
  const { hasError, disabled } = useField();
  const { isPlain, stretches } = useFieldDims();
  const hasHelper = !(children == null || children === '');
  const hasCount = count != null && count !== '';
  if (!hasHelper && !hasCount) return null;

  const color = hasError
    ? t.colors.textInteractiveError
    : disabled
      ? t.colors.textDisabled
      : t.colors.textSecondary;
  const font = {
    fontFamily: t.fontFamilies.sans,
    fontSize: t.typography.bodySm.fontSize,
    lineHeight: t.typography.bodySm.lineHeight,
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: hasCount ? 'space-between' : isPlain ? 'center' : 'flex-start',
        gap: t.spacing[2],
        alignSelf: stretches ? 'stretch' : isPlain ? 'center' : 'flex-start',
      }}
    >
      {hasHelper ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[1], minWidth: 0, flexShrink: 1 }}>
          <InfoIcon color={color} />
          <Text style={[{ flexShrink: 1, color, ...font }, style]}>{children}</Text>
        </View>
      ) : hasCount ? (
        <View />
      ) : null}
      {hasCount ? (
        <Text style={{ color: hasError ? t.colors.textInteractiveError : t.colors.textTertiary, ...font }}>
          {count}
        </Text>
      ) : null}
    </View>
  );
}

export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Control: FieldControl,
  Icon: FieldIcon,
  Action: FieldAction,
  Input: FieldInput,
  Toolbar: FieldToolbar,
  Helper: FieldHelper,
});
