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
 *
 * Every visual decision lives in `buttonVariants` below — edit colors, sizes, and
 * spacing there in one place.
 */
import { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import { usePressFeedback, type ButtonHaptic } from './press-feedback';

type Tokens = ReturnType<typeof useTokens>;

export type ButtonTone = 'primary' | 'neutral' | 'danger';
export type ButtonAppearance = 'solid' | 'soft' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type { ButtonHaptic };

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

type Palette = { bg: string; fg: string; border: string; borderWidth: number };
type Dims = { minHeight: number; paddingX: number; type: { fontSize: number; lineHeight: number }; gap: number; iconSize: number };

/**
 * Single source of truth for the Button's looks. Each tone × appearance resolves to a
 * palette; each size resolves to its dimensions. Want a different primary fill or more
 * padding on `md`? It's all right here.
 */
function buttonVariants(t: Tokens): {
  tone: Record<ButtonTone, Record<ButtonAppearance, Palette>>;
  disabled: Record<ButtonAppearance, Palette>;
  size: Record<ButtonSize, Dims>;
} {
  const transparent = (fg: string): Palette => ({ bg: 'transparent', fg, border: 'transparent', borderWidth: 0 });
  return {
    tone: {
      primary: {
        solid: { bg: t.colors.interactivePrimary, fg: t.colors.textInteractivePrimary, border: 'transparent', borderWidth: 0 },
        soft: { bg: t.colors.feedbackInfoBg, fg: t.colors.interactivePrimary, border: 'transparent', borderWidth: 0 },
        ghost: transparent(t.colors.textInteractiveTertiary),
        outline: { bg: 'transparent', fg: t.colors.interactivePrimary, border: t.colors.borderPrimary, borderWidth: 1 },
      },
      neutral: {
        solid: { bg: t.colors.textSecondary, fg: t.colors.textInverse, border: 'transparent', borderWidth: 0 },
        soft: { bg: t.colors.surfaceInput, fg: t.colors.textPrimary, border: 'transparent', borderWidth: 0 },
        ghost: transparent(t.colors.textPrimary),
        outline: { bg: 'transparent', fg: t.colors.textPrimary, border: t.colors.borderPrimary, borderWidth: 1 },
      },
      danger: {
        solid: { bg: t.colors.feedbackError, fg: t.colors.textInteractivePrimary, border: 'transparent', borderWidth: 0 },
        soft: { bg: t.colors.feedbackErrorBg, fg: t.colors.textInteractiveError, border: 'transparent', borderWidth: 0 },
        ghost: transparent(t.colors.textInteractiveError),
        outline: { bg: 'transparent', fg: t.colors.feedbackError, border: t.colors.borderError, borderWidth: 1 },
      },
    },
    disabled: {
      solid: { bg: t.colors.interactiveDisabled, fg: t.colors.textTertiary, border: 'transparent', borderWidth: 0 },
      soft: { bg: t.colors.interactiveDisabled, fg: t.colors.textTertiary, border: 'transparent', borderWidth: 0 },
      ghost: transparent(t.colors.textTertiary),
      outline: { bg: 'transparent', fg: t.colors.textTertiary, border: t.colors.borderSecondary, borderWidth: 1 },
    },
    size: {
      sm: { minHeight: t.sizing.buttonHeight.sm, paddingX: t.spacing[3], type: t.typography.bodySm, gap: t.spacing[1], iconSize: t.sizing.icon.xs },
      md: { minHeight: t.sizing.buttonHeight.md, paddingX: t.spacing[4], type: t.typography.body, gap: t.spacing[2], iconSize: t.sizing.icon.sm },
      lg: { minHeight: t.sizing.buttonHeight.lg, paddingX: t.spacing[5], type: t.typography.title3, gap: t.spacing[2], iconSize: t.sizing.icon.sm },
      xl: { minHeight: t.sizing.buttonHeight.xl, paddingX: t.spacing[6], type: t.typography.title3, gap: t.spacing[3], iconSize: t.sizing.icon.md },
    },
  };
}

const LEGACY_VARIANT: Record<ButtonVariant, { tone: ButtonTone; appearance: ButtonAppearance }> = {
  primary: { tone: 'primary', appearance: 'solid' },
  secondary: { tone: 'neutral', appearance: 'soft' },
  ghost: { tone: 'neutral', appearance: 'ghost' },
  danger: { tone: 'danger', appearance: 'solid' },
};

function touchTargetInset(visualSize: number, minimumSize: number) {
  const inset = Math.max(0, Math.ceil((minimumSize - visualSize) / 2));
  return inset > 0 ? { top: inset, bottom: inset, left: inset, right: inset } : undefined;
}

function ButtonSpinner({
  color,
  size,
  reduceMotion,
}: {
  color: string;
  size: number;
  reduceMotion?: boolean;
}) {
  const [rotation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: reduceMotion ? 1600 : 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [rotation, reduceMotion]);

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
  const variants = useMemo(() => buttonVariants(t), [t]);
  const { pressed, reduceMotion, animatedStyle, onPressIn: pressIn, onPressOut: pressOut } =
    usePressFeedback({ haptic, onPressIn, onPressOut });
  const [focused, setFocused] = useState(false);

  const { tone, appearance } = useMemo(() => {
    if (variant != null) return LEGACY_VARIANT[variant];
    return {
      tone: toneProp ?? 'primary',
      appearance: appearanceProp ?? 'solid',
    };
  }, [variant, toneProp, appearanceProp]);

  const text = children ?? labelProp ?? '';
  const isPressDisabled = disabled || loading;
  const useDisabledVisual = disabled && !loading;

  const palette = useDisabledVisual ? variants.disabled[appearance] : variants.tone[tone][appearance];
  const dims = variants.size[size];

  const hitSlop = useMemo(
    () => touchTargetInset(dims.minHeight, t.sizing.touchTarget.minimum),
    [dims.minHeight, t.sizing.touchTarget.minimum],
  );

  const ipx = dims.iconSize;
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

  const a11yLabel = accessibilityLabel ?? (iconOnly ? undefined : text);

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ disabled: isPressDisabled, busy: loading }}
      disabled={isPressDisabled}
      onPressIn={pressIn}
      onPressOut={pressOut}
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
          animatedStyle,
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
              <ButtonSpinner color={palette.fg} size={ipx} reduceMotion={reduceMotion} />
            </View>
          ) : leadingIcon ? (
            <View style={iconWrap}>{leadingIcon}</View>
          ) : null}
          {!loading && !iconOnly ? (
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
