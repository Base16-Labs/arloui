/**
 * Arlo UI — GhostButton
 *
 * Chromeless action: no background container, no border, no horizontal padding.
 * Heights reflect text line-height only (sm/md: 24px, lg: 28px, xl: 40px).
 * The pressable area expands beyond the visible label to meet the minimum touch target.
 * Three tones (matching Button): primary (brand blue), neutral (grey text), danger (red text).
 *
 * Every visual decision lives in `ghostVariants` below.
 */
import { forwardRef, useMemo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import { usePressFeedback, type ButtonHaptic } from './press-feedback';

type Tokens = ReturnType<typeof useTokens>;

export type GhostButtonTone = 'primary' | 'neutral' | 'danger';
export type GhostButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/** @deprecated Use `GhostButtonTone` (`destructive` is now `danger`). */
export type GhostButtonType = 'primary' | 'neutral' | 'destructive';

export type GhostButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children: string;
  tone?: GhostButtonTone;
  /** @deprecated Use `tone`. `destructive` maps to `danger`. */
  type?: GhostButtonType;
  size?: GhostButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  haptic?: ButtonHaptic;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

type ToneStyle = { fg: string; pressedBg: string };
type GhostDims = { height: number; type: { fontSize: number; lineHeight: number }; gap: number; iconSize: number };

/** Single source of truth for the GhostButton's looks. */
function ghostVariants(t: Tokens): {
  tone: Record<GhostButtonTone, ToneStyle>;
  size: Record<GhostButtonSize, GhostDims>;
  disabledFg: string;
} {
  return {
    tone: {
      primary: { fg: t.colors.textInteractiveTertiary, pressedBg: t.colors.touchFeedbackMain },
      neutral: { fg: t.colors.textPrimary, pressedBg: t.colors.touchFeedbackMain },
      danger: { fg: t.colors.feedbackError, pressedBg: t.colors.feedbackErrorBg },
    },
    size: {
      sm: { height: 24, type: t.typography.bodySm, gap: t.spacing[1], iconSize: t.sizing.icon.xs },
      md: { height: 24, type: t.typography.body, gap: t.spacing[2], iconSize: t.sizing.icon.sm },
      lg: { height: 28, type: t.typography.title3, gap: t.spacing[2], iconSize: t.sizing.icon.sm },
      xl: { height: 40, type: t.typography.title2, gap: t.spacing[3], iconSize: t.sizing.icon.md },
    },
    disabledFg: t.colors.textTertiary,
  };
}

const LEGACY_TONE: Record<GhostButtonType, GhostButtonTone> = {
  primary: 'primary',
  neutral: 'neutral',
  destructive: 'danger',
};

function touchTargetInset(visualSize: number, minimumSize: number) {
  const vertical = Math.max(0, Math.ceil((minimumSize - visualSize) / 2));
  return { top: vertical, bottom: vertical, left: 12, right: 12 };
}

export const GhostButton = forwardRef<View, GhostButtonProps>(function GhostButton(
  {
    children,
    tone: toneProp,
    type,
    size = 'md',
    loading = false,
    disabled = false,
    leadingIcon,
    trailingIcon,
    haptic = 'light',
    onPressIn,
    onPressOut,
    style,
    labelStyle,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const variants = useMemo(() => ghostVariants(t), [t]);
  const { pressed, animatedStyle, onPressIn: pressIn, onPressOut: pressOut } = usePressFeedback({
    haptic,
    onPressIn,
    onPressOut,
  });

  const tone = toneProp ?? (type != null ? LEGACY_TONE[type] : 'neutral');
  const isPressDisabled = disabled || loading;
  const dims = variants.size[size];
  const hitSlop = useMemo(
    () => touchTargetInset(dims.height, t.sizing.touchTarget.minimum),
    [dims.height, t.sizing.touchTarget.minimum],
  );
  const textColor = disabled ? variants.disabledFg : variants.tone[tone].fg;
  const pressedBg = variants.tone[tone].pressedBg;

  const iconWrap = useMemo(
    () => ({ width: dims.iconSize, height: dims.iconSize, alignItems: 'center', justifyContent: 'center' }) as const,
    [dims.iconSize],
  );

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityState={{ disabled: isPressDisabled, busy: loading }}
      disabled={isPressDisabled}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={hitSlop}
      {...rest}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: dims.height,
            gap: dims.gap,
            borderRadius: t.radii.sm,
            backgroundColor: !disabled && pressed ? pressedBg : 'transparent',
          },
          animatedStyle,
          style,
        ]}
      >
        {loading ? (
          <View style={iconWrap}>
            <ActivityIndicator color={textColor} size="small" />
          </View>
        ) : leadingIcon ? (
          <View style={iconWrap}>{leadingIcon}</View>
        ) : null}
        {!loading ? (
          <Text
            numberOfLines={1}
            style={[
              {
                color: textColor,
                fontFamily: t.fontFamilies.sans,
                fontSize: dims.type.fontSize,
                lineHeight: dims.type.lineHeight,
                fontWeight: '600',
              },
              labelStyle,
            ]}
          >
            {children}
          </Text>
        ) : null}
        {!loading && trailingIcon ? <View style={iconWrap}>{trailingIcon}</View> : null}
      </Animated.View>
    </Pressable>
  );
});
