/**
 * Arlo UI — TextArea
 *
 * A multiline text field for longer form content. Like `Input`, it is a preset
 * assembled from the composable `Field` primitives (see input/field.tsx) — it just
 * runs `Field` in `multiline` mode: a column control with top-aligned text, a
 * bottom `Field.Toolbar` for icon/action slots, and an optional character count in
 * the helper row.
 *
 * Reach for `TextArea` when you want the batteries-included multiline field; drop
 * down to `<Field multiline>…</Field>` when you need a custom layout.
 */
import { forwardRef, type ReactNode } from 'react';
import type {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Field,
  type InputAppearance,
  type InputSize,
  type InputState,
} from '../field/field';

export type TextAreaAppearance = InputAppearance;
export type TextAreaSize = InputSize;
export type TextAreaState = InputState;

export type TextAreaProps = Omit<TextInputProps, 'style' | 'multiline'> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: TextAreaState;
  appearance?: TextAreaAppearance;
  size?: TextAreaSize;
  /** Non-interactive glyph slot in the bottom toolbar. */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Interactive slot in the bottom toolbar (mic, send…). Takes priority over the matching icon. */
  leadingAction?: ReactNode;
  trailingAction?: ReactNode;
  /** Shows a right-aligned character count in the helper row. */
  showCount?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
};

export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
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
    showCount = false,
    containerStyle,
    inputStyle,
    helperStyle,
    fullWidth = true,
    editable = true,
    value,
    defaultValue,
    maxLength,
    ...rest
  },
  ref,
) {
  const hasError = state === 'error' || Boolean(errorText);
  const supportingText = errorText ?? helperText;
  const count = String(value ?? defaultValue ?? '').length;
  const countLabel = showCount ? `${count}${maxLength != null ? `/${maxLength}` : ''}` : undefined;

  const leading = leadingAction ?? leadingIcon;
  const trailing = trailingAction ?? trailingIcon;
  const hasToolbar = Boolean(leading || trailing);

  return (
    <Field
      multiline
      size={size}
      appearance={appearance}
      error={hasError}
      disabled={editable === false}
      fullWidth={fullWidth}
      style={containerStyle}
    >
      {label ? <Field.Label>{label}</Field.Label> : null}

      <Field.Control>
        <Field.Input
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          style={inputStyle}
          {...rest}
        />

        {hasToolbar ? (
          <Field.Toolbar>
            {leading ?? null}
            {trailing ?? null}
          </Field.Toolbar>
        ) : null}
      </Field.Control>

      <Field.Helper count={countLabel} style={helperStyle}>
        {supportingText}
      </Field.Helper>
    </Field>
  );
});

export { Field } from '../field/field';
