/**
 * Arlo UI — Button
 *
 * Four appearances (solid · soft · ghost · outline) × three tones (primary · neutral · danger).
 * All main Button appearances use radii.full to match the Figma and WWW pill shape.
 * Visual sizes stay faithful to the design while sm/md expand to a ≥44pt touch target.
 *
 * **Preferred API:** `tone` + `appearance` + `children` as text label.
 *
 * **Legacy `variant`** (still supported):
 * - `primary` → tone primary + solid
 * - `secondary` → tone neutral + soft
 * - `ghost` → tone neutral + ghost
 * - `danger` → tone danger + solid
 */
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { haptic as triggerHaptic } from '@arloui/utils';
import {
  Animated,
  Easing,
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
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';

export type ButtonTone = 'primary' | 'neutral' | 'danger';
export type ButtonAppearance = 'solid' | 'soft' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonHaptic = 'light' | 'medium' | 'none';

/** @deprecated Prefer `tone` + `appearance`. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children?: string;
  /** @deprecated Use `children` prop instead. */
  label?: string;
  /** @deprecated Maps to `tone` + `appearance`. When set, overrides `tone` and `appearance`. */
  variant?: ButtonVariant;
  tone?: ButtonTone;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Renders as a square (height × height) with icon centered. Requires `accessibilityLabel`. */
  iconOnly?: boolean;
  /** Render the label with the monospace family — useful for prices, codes. */
  mono?: boolean;
  fullWidth?: boolean;
  haptic?: ButtonHaptic;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

function mapLegacyVariant(v: ButtonVariant): { tone: ButtonTone; appearance: ButtonAppearance } {
  switch (v) {
    case 'primary': return { tone: 'primary', appearance: 'solid' };
    case 'secondary': return { tone: 'neutral', appearance: 'soft' };
    case 'ghost': return { tone: 'neutral', appearance: 'ghost' };
    case 'danger': return { tone: 'danger', appearance: 'solid' };
  }
}

type Palette = { bg: string; fg: string; border: string; borderWidth: number };

function resolvePalette(
  t: ReturnType<typeof useTokens>,
  tone: ButtonTone,
  appearance: ButtonAppearance,
): Palette {
  if (tone === 'primary') {
    switch (appearance) {
      case 'solid':
        return { bg: t.colors.interactivePrimary, fg: t.colors.textInteractivePrimary, border: 'transparent', borderWidth: 0 };
      case 'soft':
        return { bg: t.colors.feedbackInfoBg, fg: t.colors.interactivePrimary, border: 'transparent', borderWidth: 0 };
      case 'ghost':
        return { bg: 'transparent', fg: t.colors.textInteractiveTertiary, border: 'transparent', borderWidth: 0 };
      case 'outline':
        return { bg: 'transparent', fg: t.colors.interactivePrimary, border: t.colors.borderPrimary, borderWidth: 1 };
    }
  }
  if (tone === 'neutral') {
    switch (appearance) {
      case 'solid':
        return { bg: t.colors.textSecondary, fg: t.colors.textInverse, border: 'transparent', borderWidth: 0 };
      case 'soft':
        return { bg: t.colors.surfaceInput, fg: t.colors.textPrimary, border: 'transparent', borderWidth: 0 };
      case 'ghost':
        return { bg: 'transparent', fg: t.colors.textPrimary, border: 'transparent', borderWidth: 0 };
      case 'outline':
        return { bg: 'transparent', fg: t.colors.interactivePrimary, border: t.colors.borderPrimary, borderWidth: 1 };
    }
  }
  // danger
  switch (appearance) {
    case 'solid':
      return { bg: t.colors.feedbackError, fg: t.colors.textInteractivePrimary, border: 'transparent', borderWidth: 0 };
    case 'soft':
      return { bg: t.colors.feedbackErrorBg, fg: t.colors.textInteractiveError, border: 'transparent', borderWidth: 0 };
    case 'ghost':
      return { bg: 'transparent', fg: t.colors.textInteractiveError, border: 'transparent', borderWidth: 0 };
    case 'outline':
      return { bg: 'transparent', fg: t.colors.feedbackError, border: t.colors.borderError, borderWidth: 1 };
  }
}

function resolveDisabledPalette(
  t: ReturnType<typeof useTokens>,
  appearance: ButtonAppearance,
): Palette {
  const fg = t.colors.textTertiary;
  if (appearance === 'outline') {
    return { bg: 'transparent', fg, border: t.colors.borderSecondary, borderWidth: 1 };
  }
  if (appearance === 'ghost') {
    return { bg: 'transparent', fg, border: 'transparent', borderWidth: 0 };
  }
  return { bg: t.colors.interactiveDisabled, fg, border: 'transparent', borderWidth: 0 };
}

function iconSizePx(size: ButtonSize, t: ReturnType<typeof useTokens>): number {
  switch (size) {
    case 'sm': return t.sizing.icon.xs;
    case 'md': return t.sizing.icon.sm;
    case 'lg': return t.sizing.icon.sm;
    case 'xl': return t.sizing.icon.md;
    default: return t.sizing.icon.sm;
  }
}

type ButtonDims = { minHeight: number; paddingX: number; type: { fontSize: number; lineHeight: number }; gap: number };

function touchTargetInset(visualSize: number, minimumSize: number) {
  const inset = Math.max(0, Math.ceil((minimumSize - visualSize) / 2));
  return inset > 0 ? { top: inset, bottom: inset, left: inset, right: inset } : undefined;
}

function ButtonSpinner({ color, size }: { color: string; size: number }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [rotation]);

  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={{
        width: size,
        height: size,
        transform: [
          {
            rotate: rotation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21.75 12C21.75 14.5859 20.7228 17.0659 18.8943 18.8943C17.0658 20.7228 14.5859 21.75 12 21.75C9.41414 21.75 6.93419 20.7228 5.10571 18.8943C3.27723 17.0659 2.25 14.5859 2.25 12C2.25 8.1563 4.48219 4.6538 7.93688 3.06849C8.02638 3.02737 8.12311 3.00428 8.22153 3.00054C8.31996 2.9968 8.41816 3.01249 8.51052 3.0467C8.60289 3.08091 8.68761 3.13298 8.75985 3.19994C8.8321 3.26689 8.89044 3.34742 8.93156 3.43692C8.97268 3.52643 8.99577 3.62316 8.99951 3.72158C9.00325 3.82001 8.98756 3.91821 8.95335 4.01057C8.91914 4.10294 8.86707 4.18766 8.80011 4.2599C8.73316 4.33215 8.65263 4.39049 8.56312 4.43161C5.63906 5.77411 3.75 8.74411 3.75 12C3.75 14.1881 4.61919 16.2865 6.16637 17.8337C7.71354 19.3809 9.81196 20.25 12 20.25C14.188 20.25 16.2865 19.3809 17.8336 17.8337C19.3808 16.2865 20.25 14.1881 20.25 12C20.25 8.74411 18.3609 5.77411 15.4369 4.43161C15.2561 4.34857 15.1157 4.19711 15.0466 4.01057C14.9776 3.82403 14.9854 3.61769 15.0684 3.43692C15.1515 3.25616 15.3029 3.1158 15.4895 3.0467C15.676 2.9776 15.8824 2.98544 16.0631 3.06849C19.5178 4.6538 21.75 8.1563 21.75 12Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
}

function resolveButtonDims(size: ButtonSize, t: ReturnType<typeof useTokens>): ButtonDims {
  switch (size) {
    case 'sm':
      return { minHeight: t.sizing.buttonHeight.sm, paddingX: t.spacing[3], type: t.typography.bodySm, gap: t.spacing[1] };
    case 'lg':
      return { minHeight: t.sizing.buttonHeight.lg, paddingX: t.spacing[5], type: t.typography.title3, gap: t.spacing[2] };
    case 'xl':
      return { minHeight: t.sizing.buttonHeight.xl, paddingX: t.spacing[6], type: t.typography.title3, gap: t.spacing[3] };
    default:
      return { minHeight: t.sizing.buttonHeight.md, paddingX: t.spacing[4], type: t.typography.body, gap: t.spacing[2] };
  }
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    children,
    label: labelProp,
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
    haptic = 'light',
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

  const text = children ?? labelProp ?? '';
  const isPressDisabled = disabled || loading;
  const useDisabledVisual = disabled && !loading;

  const palette = useMemo(() => {
    if (useDisabledVisual) return resolveDisabledPalette(t, appearance);
    return resolvePalette(t, tone, appearance);
  }, [t, tone, appearance, useDisabledVisual]);

  const dims = useMemo(() => resolveButtonDims(size, t), [size, t]);
  const hitSlop = useMemo(
    () => touchTargetInset(dims.minHeight, t.sizing.touchTarget.minimum),
    [dims.minHeight, t.sizing.touchTarget.minimum],
  );

  const ipx = iconSizePx(size, t);
  const iconWrap = useMemo(
    () => ({ width: ipx, height: ipx, alignItems: 'center', justifyContent: 'center' }) as const,
    [ipx],
  );

  const cornerRadius = t.radii.full;

  const feedbackOverlayColor =
    appearance === 'outline' || appearance === 'ghost'
      ? t.colors.interactiveTertiaryPressed
      : t.colors.touchFeedbackMain;

  const showFeedbackOverlay = !disabled && pressed;

  const focusWebStyle = useMemo((): ViewStyle | undefined => {
    if (Platform.OS !== 'web' || !focused) return undefined;
    const ring = tone === 'danger' ? t.focusRing.error : t.focusRing.main;
    return { boxShadow: ring } as ViewStyle;
  }, [focused, t.focusRing, tone]);

  const handleIn = (e: GestureResponderEvent) => {
    setPressed(true);
    if (haptic !== 'none') void triggerHaptic(haptic);
    Animated.timing(press, {
      toValue: 1,
      duration: 120,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };

  const handleOut = (e: GestureResponderEvent) => {
    setPressed(false);
    Animated.timing(press, {
      toValue: 0,
      duration: 200,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  const animated = {
    transform: [{ scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.97] }) }],
  };

  const a11yLabel = accessibilityLabel ?? (iconOnly ? undefined : text);

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ disabled: isPressDisabled, busy: loading }}
      disabled={isPressDisabled}
      onPressIn={handleIn}
      onPressOut={handleOut}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      hitSlop={hitSlop}
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
            minWidth: iconOnly ? dims.minHeight : 64,
            width: iconOnly ? dims.minHeight : undefined,
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
            style={[StyleSheet.absoluteFillObject, { borderRadius: cornerRadius, backgroundColor: feedbackOverlayColor }]}
          />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: iconOnly ? 0 : dims.gap,
            minHeight: dims.minHeight,
            paddingHorizontal: iconOnly ? 0 : dims.paddingX,
            width: fullWidth ? '100%' : undefined,
          }}
        >
          {loading ? (
            <View style={iconWrap}>
              <ButtonSpinner color={palette.fg} size={ipx} />
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
              {text}
            </Text>
          ) : null}
          {!loading && !iconOnly && trailingIcon ? <View style={iconWrap}>{trailingIcon}</View> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
});
