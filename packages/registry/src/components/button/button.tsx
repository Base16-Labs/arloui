/**
 * Arlo UI — Button
 *
 * Matches Figma **Buttons/Button** frame: tone × appearance × size, optional icons, icon-only circle, loading.
 * Default / pressed use semantic touch overlays (`touchFeedbackMain` filled, `interactiveTertiaryPressed` outline/ghost).
 * Disabled matches Figma: muted fill or outline stroke + `textDisabled` for label/icons.
 *
 * **Legacy `variant`** (still supported):
 * - `primary` → tone primary + solid
 * - `secondary` → tone neutral + outline
 * - `ghost` → tone primary + ghost
 * - `danger` → tone danger + solid
 *
 * **Preferred API:** `tone` + `appearance`
 * - `tone`: primary | neutral | danger
 * - `appearance`: solid | soft | ghost | outline
 *
 * Radii: stadium pill (`minHeight / 2`) for all default sizes; icon-only is a circle.
 */
import { forwardRef, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type ButtonTone = 'primary' | 'neutral' | 'danger';
export type ButtonAppearance = 'solid' | 'soft' | 'ghost' | 'outline';

/** @deprecated Prefer `tone` + `appearance`. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonSize = Size;

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  /** @deprecated Maps to `tone` + `appearance`. When set, overrides `tone` and `appearance`. */
  variant?: ButtonVariant;
  tone?: ButtonTone;
  appearance?: ButtonAppearance;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Circular icon button — pass `leadingIcon` (label kept for accessibility). */
  iconOnly?: boolean;
  /** Render the label with the monospace family — useful for prices, codes. */
  mono?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

function mapLegacyVariant(v: ButtonVariant): { tone: ButtonTone; appearance: ButtonAppearance } {
  switch (v) {
    case 'primary':
      return { tone: 'primary', appearance: 'solid' };
    case 'secondary':
      return { tone: 'neutral', appearance: 'outline' };
    case 'ghost':
      return { tone: 'primary', appearance: 'ghost' };
    case 'danger':
      return { tone: 'danger', appearance: 'solid' };
  }
}

function resolvePalette(
  t: ReturnType<typeof useTokens>,
  tone: ButtonTone,
  appearance: ButtonAppearance,
): { bg: string; fg: string; border: string; borderWidth: number } {
  if (tone === 'primary') {
    switch (appearance) {
      case 'solid':
        return {
          bg: t.colors.interactivePrimary,
          fg: t.colors.textInteractivePrimary,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'soft':
        return {
          bg: t.colors.feedbackInfoBg,
          fg: t.colors.interactivePrimary,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          fg: t.colors.textInteractiveTertiary,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'outline':
        return {
          bg: 'transparent',
          fg: t.colors.interactivePrimary,
          border: t.colors.interactivePrimary,
          borderWidth: 1,
        };
    }
  }
  if (tone === 'neutral') {
    switch (appearance) {
      case 'solid':
        return {
          bg: t.colors.textSecondary,
          fg: t.colors.textInverse,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'soft':
        return {
          bg: t.colors.interactiveSecondary,
          fg: t.colors.textInteractiveSecondary,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          fg: t.colors.textInteractiveSecondary,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'outline':
        return {
          bg: 'transparent',
          fg: t.colors.textPrimary,
          border: t.colors.borderPrimary,
          borderWidth: 1,
        };
    }
  }
  switch (appearance) {
    case 'solid':
      return {
        bg: t.colors.interactiveError,
        fg: t.colors.textInteractivePrimary,
        border: 'transparent',
        borderWidth: 0,
      };
    case 'soft':
      return {
        bg: t.colors.feedbackErrorBg,
        fg: t.colors.textInteractiveError,
        border: 'transparent',
        borderWidth: 0,
      };
    case 'ghost':
      return {
        bg: 'transparent',
        fg: t.colors.textInteractiveError,
        border: 'transparent',
        borderWidth: 0,
      };
    case 'outline':
      return {
        bg: 'transparent',
        fg: t.colors.interactiveError,
        border: t.colors.borderError,
        borderWidth: 1,
      };
  }
}

function resolveDisabledPalette(
  t: ReturnType<typeof useTokens>,
  appearance: ButtonAppearance,
): { bg: string; fg: string; border: string; borderWidth: number } {
  const fg = t.colors.textDisabled;
  if (appearance === 'outline') {
    return { bg: 'transparent', fg, border: fg, borderWidth: 1 };
  }
  if (appearance === 'ghost') {
    return { bg: 'transparent', fg, border: 'transparent', borderWidth: 0 };
  }
  return {
    bg: t.colors.interactiveDisabled,
    fg,
    border: 'transparent',
    borderWidth: 0,
  };
}

function iconSlotPx(size: Size, t: ReturnType<typeof useTokens>): number {
  switch (size) {
    case 'sm':
      return t.sizing.icon.sm;
    case 'md':
      return t.sizing.icon.md;
    default:
      return t.sizing.icon.lg;
  }
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    label,
    variant,
    tone: toneProp,
    appearance: appearanceProp,
    size = 'md',
    loading = false,
    disabled = false,
    leadingIcon,
    trailingIcon,
    iconOnly = false,
    mono = false,
    fullWidth = false,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
    style,
    labelStyle,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const press = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const { tone, appearance } = useMemo(() => {
    if (variant != null) return mapLegacyVariant(variant);
    return {
      tone: toneProp ?? 'primary',
      appearance: appearanceProp ?? 'solid',
    };
  }, [variant, toneProp, appearanceProp]);

  const isPressDisabled = disabled || loading;
  const useDisabledVisual = disabled && !loading;

  const palette = useMemo(() => {
    if (useDisabledVisual) return resolveDisabledPalette(t, appearance);
    return resolvePalette(t, tone, appearance);
  }, [t, tone, appearance, useDisabledVisual]);

  const dims = useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          minHeight: t.sizing.buttonHeight.sm,
          paddingX: t.spacing[3],
          type: t.typography.bodySm,
          gap: t.spacing[2],
        };
      case 'md':
        return {
          minHeight: t.sizing.buttonHeight.md,
          paddingX: t.spacing[5],
          type: t.typography.body,
          gap: t.spacing[2],
        };
      case 'lg':
        return {
          minHeight: t.sizing.buttonHeight.lg,
          paddingX: t.spacing[6],
          type: t.typography.title3,
          gap: t.spacing[3],
        };
      case 'xl':
        return {
          minHeight: t.sizing.buttonHeight.xl,
          paddingX: t.spacing[6],
          type: t.typography.title2,
          gap: t.spacing[3],
        };
    }
  }, [size, t]);

  const ipx = iconSlotPx(size, t);
  const iconWrap = useMemo(
    () =>
      ({
        width: ipx,
        height: ipx,
        alignItems: 'center',
        justifyContent: 'center',
      }) as const,
    [ipx],
  );

  const cornerRadius = useMemo(() => dims.minHeight / 2, [dims.minHeight]);

  const feedbackOverlayColor = useMemo(() => {
    if (appearance === 'outline' || appearance === 'ghost') return t.colors.interactiveTertiaryPressed;
    return t.colors.touchFeedbackMain;
  }, [appearance, t.colors.interactiveTertiaryPressed, t.colors.touchFeedbackMain]);

  const showFeedbackOverlay = !disabled && (loading || pressed);

  const focusWebStyle: ViewStyle | undefined = useMemo(() => {
    if (Platform.OS !== 'web' || !focused) return undefined;
    const ring = tone === 'danger' ? t.focusRing.error : t.focusRing.main;
    return { boxShadow: ring } as ViewStyle;
  }, [focused, t.focusRing.error, t.focusRing.main, tone]);

  const handleIn = (e: GestureResponderEvent) => {
    setPressed(true);
    Animated.timing(press, {
      toValue: 1,
      duration: t.motion.duration.press,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };
  const handleOut = (e: GestureResponderEvent) => {
    setPressed(false);
    Animated.timing(press, {
      toValue: 0,
      duration: t.motion.duration.press,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  const animated = {
    transform: [
      { scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, t.motion.pressed.scale] }) },
    ],
  };

  const a11yLabel = accessibilityLabel ?? label;

  const contentRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: iconOnly ? 0 : dims.gap,
    minHeight: dims.minHeight,
    paddingHorizontal: iconOnly ? 0 : dims.paddingX,
    width: fullWidth ? '100%' : undefined,
  };

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ disabled: isPressDisabled, busy: loading }}
      disabled={isPressDisabled}
      onPressIn={handleIn}
      onPressOut={handleOut}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      hitSlop={size === 'sm' ? { top: 6, bottom: 6, left: 4, right: 4 } : undefined}
      {...rest}
    >
      <Animated.View
        style={[
          {
            backgroundColor: palette.bg,
            borderColor: palette.border,
            borderWidth: palette.borderWidth,
            borderRadius: cornerRadius,
            minHeight: dims.minHeight,
            minWidth: iconOnly ? dims.minHeight : undefined,
            width: iconOnly ? dims.minHeight : undefined,
            paddingVertical: 0,
            overflow: 'hidden',
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
          },
          focusWebStyle,
          animated,
          style,
        ]}
      >
        {showFeedbackOverlay ? (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { borderRadius: cornerRadius, backgroundColor: feedbackOverlayColor },
            ]}
          />
        ) : null}
        <View style={contentRowStyle}>
          {loading ? (
            <View style={iconWrap}>
              <ActivityIndicator color={palette.fg} size={size === 'sm' || size === 'md' ? 'small' : 'large'} />
            </View>
          ) : leadingIcon ? (
            <View style={iconWrap}>{leadingIcon}</View>
          ) : null}
          {!iconOnly ? (
            <Text
              numberOfLines={1}
              style={[
                {
                  color: palette.fg,
                  fontFamily: mono ? t.fontFamilies.mono : t.fontFamilies.sans,
                  fontSize: dims.type.fontSize,
                  lineHeight: dims.type.lineHeight,
                  fontWeight: '600',
                },
                labelStyle,
              ]}
            >
              {label}
            </Text>
          ) : null}
          {!iconOnly && trailingIcon ? <View style={iconWrap}>{trailingIcon}</View> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
});
