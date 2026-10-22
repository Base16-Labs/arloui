/**
 * Arlo UI — Input
 *
 * A ready-made text input: floating label, helper/error text, leading/trailing
 * icons and actions, plain/filled treatment, secure entry, and disabled state.
 *
 * The label floats inside the field (`typography.labelMedium`, `textTertiary`):
 * it occupies the placeholder position while the field is empty, and sits above
 * the value once the field is focused or filled. Pass `insetLabel={false}` to
 * render `Field.Label` above the control instead.
 *
 * `Input` is a preset assembled from the composable `Field` primitives. Reach for
 * `Field` directly (see field.tsx) when you need a custom layout; reach for `Input`
 * when you want the batteries-included field.
 */
import { forwardRef, type ComponentRef } from 'react';
import { TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import {
  Field,
  type FieldActionProps,
  type InputAppearance,
  type InputSize,
  type InputState,
} from '../field/field';

/** Interactive slot for the input (clear, password toggle, copy…). Alias of `Field.Action`. */
export const InputAction = Field.Action;
export type InputActionProps = FieldActionProps;

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
  /**
   * Floats `label` inside the field. Set `false` to render it above the control.
   * Defaults to `true`.
   */
  insetLabel?: boolean;
};

export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(function Input(
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
    insetLabel = true,
    editable = true,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const hasError = state === 'error' || Boolean(errorText);
  const isPlain = appearance === 'plain';
  const supportingText = errorText ?? helperText;

  return (
    <Field
      size={size}
      appearance={appearance}
      error={hasError}
      disabled={editable === false}
      fullWidth={fullWidth}
      style={containerStyle}
    >
      {label && !insetLabel ? <Field.Label>{label}</Field.Label> : null}

      <Field.Control>
        {leadingAction ? (
          <View style={{ marginLeft: isPlain ? 0 : -t.spacing[3] }}>{leadingAction}</View>
        ) : leadingIcon ? (
          <Field.Icon>{leadingIcon}</Field.Icon>
        ) : null}

        <Field.Input
          ref={ref}
          insetLabel={insetLabel && label ? label : undefined}
          style={inputStyle}
          {...rest}
        />

        {trailingAction ? trailingAction : trailingIcon ? <Field.Icon>{trailingIcon}</Field.Icon> : null}
      </Field.Control>

      <Field.Helper style={helperStyle}>{supportingText}</Field.Helper>
    </Field>
  );
});

export { Field } from '../field/field';
export type { FieldProps, FieldActionProps, InputAppearance, InputSize, InputState } from '../field/field';
