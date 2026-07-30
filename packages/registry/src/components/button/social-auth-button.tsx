/**
 * Arlo UI — SocialAuthButton
 *
 * Fixed-label OAuth buttons for Google, Apple, Facebook, and X.
 * Two types: `fill` (brand background, white text) and `secondary` (outlined, brand icon, text-primary label).
 * Labels are not customizable per spec: "Sign in with {Platform}".
 */
import { forwardRef, useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import { usePressFeedback, type ButtonHaptic } from './press-feedback';

type Tokens = ReturnType<typeof useTokens>;

const BRAND_COLORS = {
  google: '#4285F4',
  apple: '#000000',
  facebook: '#1877F2',
  x: '#000000',
} as const;

const LABELS = {
  google: 'Sign in with Google',
  apple: 'Sign in with Apple',
  facebook: 'Sign in with Facebook',
  x: 'Sign in with X',
} as const;

export type SocialPlatform = 'google' | 'apple' | 'facebook' | 'x';
export type SocialAuthType = 'fill' | 'secondary';

/** @deprecated Use `SocialPlatform`. */
export type SocialAuthProvider = 'facebook' | 'x';

/** @deprecated Use `SocialAuthType`. */
export type SocialAuthAppearance = 'brandSolid' | 'brandSoft' | 'brandOutline' | 'neutralSolid' | 'neutralOutline';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export type SocialAuthButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  platform: SocialPlatform;
  /** @deprecated Use `platform`. */
  provider?: SocialAuthProvider;
  type?: SocialAuthType;
  /** @deprecated Use `type`. */
  appearance?: SocialAuthAppearance;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  haptic?: ButtonHaptic;
  /** Replace the default platform glyph (e.g. SVG asset). */
  renderLeading?: (color: string, iconPx: number) => ReactNode;
  style?: StyleProp<ViewStyle>;
};

type SocialPalette = { bg: string; fg: string; iconFg: string; border: string; borderWidth: number };
type SocialDims = { minHeight: number; paddingX: number; type: { fontSize: number; lineHeight: number }; gap: number; iconPx: number };

/**
 * Single source of truth for the SocialAuthButton's looks. The palette mixes the
 * per-platform brand color with the `fill`/`secondary` type; sizes are a flat map.
 */
function socialPalette(
  t: Tokens,
  platform: SocialPlatform,
  type: SocialAuthType,
  disabled: boolean,
): SocialPalette {
  if (disabled) {
    return { bg: t.colors.interactiveDisabled, fg: t.colors.textTertiary, iconFg: t.colors.textTertiary, border: 'transparent', borderWidth: 0 };
  }
  const brand = BRAND_COLORS[platform];
  if (type === 'fill') {
    return { bg: brand, fg: '#FFFFFF', iconFg: '#FFFFFF', border: 'transparent', borderWidth: 0 };
  }
  // secondary: outlined, brand icon, text-primary label
  return { bg: 'transparent', fg: t.colors.textPrimary, iconFg: brand, border: t.colors.borderPrimary, borderWidth: 1 };
}

function socialSizes(t: Tokens): Record<Size, SocialDims> {
  return {
    sm: { minHeight: t.sizing.buttonHeight.sm, paddingX: t.spacing[3], type: t.typography.bodySm, gap: t.spacing[1], iconPx: t.sizing.icon.xs },
    md: { minHeight: t.sizing.buttonHeight.md, paddingX: t.spacing[4], type: t.typography.body, gap: t.spacing[2], iconPx: t.sizing.icon.sm },
    lg: { minHeight: t.sizing.buttonHeight.lg, paddingX: t.spacing[5], type: t.typography.title3, gap: t.spacing[2], iconPx: t.sizing.icon.sm },
    xl: { minHeight: t.sizing.buttonHeight.xl, paddingX: t.spacing[6], type: t.typography.title3, gap: t.spacing[3], iconPx: t.sizing.icon.md },
  };
}

function touchTargetInset(visualSize: number, minimumSize: number) {
  const inset = Math.max(0, Math.ceil((minimumSize - visualSize) / 2));
  return inset > 0 ? { top: inset, bottom: inset, left: inset, right: inset } : undefined;
}

function mapLegacyAppearance(appearance: SocialAuthAppearance): SocialAuthType {
  return appearance === 'neutralOutline' ? 'secondary' : 'fill';
}

/**
 * Fallback brand letterforms, drawn in the system face on purpose — a brand mark
 * should not take on the app's typeface, and Apple's `` glyph exists only in the
 * system font. This is the one place `fontFamily` is intentionally not a token.
 */
function DefaultGlyph({ platform, color, iconPx }: { platform: SocialPlatform; color: string; iconPx: number }) {
  const fs = Math.round(iconPx * 0.62);
  switch (platform) {
    case 'google':
      return (
        <Text style={{ color, fontSize: fs, fontWeight: '700', fontFamily: 'System' }} allowFontScaling={false}>
          G
        </Text>
      );
    case 'apple':
      return (
        <Text style={{ color, fontSize: fs, fontWeight: '700', fontFamily: 'System' }} allowFontScaling={false}>

        </Text>
      );
    case 'facebook':
      return (
        <Text style={{ color, fontSize: fs, fontWeight: '700', fontFamily: 'System' }} allowFontScaling={false}>
          f
        </Text>
      );
    case 'x':
      return (
        <Text style={{ color, fontSize: Math.round(iconPx * 0.58), fontWeight: '900', fontFamily: 'System', letterSpacing: -0.5 }} allowFontScaling={false}>
          X
        </Text>
      );
  }
}

export const SocialAuthButton = forwardRef<View, SocialAuthButtonProps>(function SocialAuthButton(
  {
    platform: platformProp,
    provider,
    type: typeProp,
    appearance,
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    haptic = 'light',
    renderLeading,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
    style,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const { animatedStyle, onPressIn: pressIn, onPressOut: pressOut } = usePressFeedback({
    haptic,
    onPressIn,
    onPressOut,
  });
  const [focused, setFocused] = useState(false);

  const platform = platformProp ?? (provider as SocialPlatform) ?? 'google';
  const type: SocialAuthType = typeProp ?? (appearance ? mapLegacyAppearance(appearance) : 'fill');

  const isPressDisabled = disabled || loading;
  const useDisabledVisual = disabled && !loading;

  const palette = useMemo(
    () => socialPalette(t, platform, type, useDisabledVisual),
    [t, platform, type, useDisabledVisual],
  );

  const dims = useMemo(() => socialSizes(t)[size], [size, t]);
  const hitSlop = useMemo(
    () => touchTargetInset(dims.minHeight, t.sizing.touchTarget.minimum),
    [dims.minHeight, t.sizing.touchTarget.minimum],
  );

  const iconWrap = useMemo(
    () => ({ width: dims.iconPx, height: dims.iconPx, alignItems: 'center', justifyContent: 'center' }) as const,
    [dims.iconPx],
  );

  const focusWebStyle = useMemo((): ViewStyle | undefined => {
    if (Platform.OS !== 'web' || !focused) return undefined;
    return { boxShadow: t.focusRing.main } as ViewStyle;
  }, [focused, t.focusRing.main]);

  const label = LABELS[platform];

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
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
            borderRadius: t.radii.full,
            minHeight: dims.minHeight,
            minWidth: 64,
            paddingHorizontal: dims.paddingX,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: dims.gap,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
          },
          focusWebStyle,
          animatedStyle,
          style,
        ]}
      >
        <View style={iconWrap}>
          {loading ? (
            <ActivityIndicator color={palette.iconFg} size="small" />
          ) : renderLeading ? (
            renderLeading(palette.iconFg, dims.iconPx)
          ) : (
            <DefaultGlyph platform={platform} color={palette.iconFg} iconPx={dims.iconPx} />
          )}
        </View>
        {!loading ? (
          <Text
            numberOfLines={1}
            style={{
              color: palette.fg,
              fontFamily: t.fontFamilies.sans,
              fontSize: dims.type.fontSize,
              lineHeight: dims.type.lineHeight,
              fontWeight: '600',
            }}
          >
            {label}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
});
