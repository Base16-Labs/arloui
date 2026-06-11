/**
 * Arlo UI — SocialAuthButton
 *
 * Fixed-label OAuth buttons for Google, Apple, Facebook, and X.
 * Two types: `fill` (brand background, white text) and `secondary` (outlined, brand icon, text-primary label).
 * Labels are not customizable per spec: "Sign in with {Platform}".
 */
import { forwardRef, useMemo, useRef, useState, type ReactNode } from 'react';
import { haptic as triggerHaptic } from '@arloui/utils';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

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
  haptic?: 'light' | 'medium' | 'none';
  /** Replace the default platform glyph (e.g. SVG asset). */
  renderLeading?: (color: string, iconPx: number) => ReactNode;
  style?: StyleProp<ViewStyle>;
};

type SocialPalette = { bg: string; fg: string; iconFg: string; border: string; borderWidth: number };

function resolveSocialPalette(
  t: ReturnType<typeof useTokens>,
  platform: SocialPlatform,
  type: SocialAuthType,
): SocialPalette {
  const brand = BRAND_COLORS[platform];
  if (type === 'fill') {
    return { bg: brand, fg: '#FFFFFF', iconFg: '#FFFFFF', border: 'transparent', borderWidth: 0 };
  }
  // secondary: outlined, brand icon, text-primary label
  return {
    bg: 'transparent',
    fg: t.colors.textPrimary,
    iconFg: brand,
    border: t.colors.borderPrimary,
    borderWidth: 1,
  };
}

function resolveDisabledPalette(t: ReturnType<typeof useTokens>): SocialPalette {
  return {
    bg: t.colors.interactiveDisabled,
    fg: t.colors.textTertiary,
    iconFg: t.colors.textTertiary,
    border: 'transparent',
    borderWidth: 0,
  };
}

type SocialDims = { minHeight: number; paddingX: number; type: { fontSize: number; lineHeight: number }; gap: number; iconPx: number };

function resolveSocialDims(size: Size, t: ReturnType<typeof useTokens>): SocialDims {
  switch (size) {
    case 'sm':
      return { minHeight: t.sizing.buttonHeight.sm, paddingX: t.spacing[3], type: t.typography.bodySm, gap: t.spacing[1], iconPx: t.sizing.icon.xs };
    case 'lg':
      return { minHeight: t.sizing.buttonHeight.lg, paddingX: t.spacing[5], type: t.typography.title3, gap: t.spacing[2], iconPx: t.sizing.icon.sm };
    case 'xl':
      return { minHeight: t.sizing.buttonHeight.xl, paddingX: t.spacing[6], type: t.typography.title3, gap: t.spacing[3], iconPx: t.sizing.icon.md };
    default:
      return { minHeight: t.sizing.buttonHeight.md, paddingX: t.spacing[4], type: t.typography.body, gap: t.spacing[2], iconPx: t.sizing.icon.sm };
  }
}

function mapLegacyAppearance(appearance: SocialAuthAppearance): SocialAuthType {
  return appearance === 'neutralOutline' ? 'secondary' : 'fill';
}

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
  const press = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const platform = platformProp ?? (provider as SocialPlatform) ?? 'google';
  const type: SocialAuthType = typeProp ?? (appearance ? mapLegacyAppearance(appearance) : 'fill');

  const isPressDisabled = disabled || loading;
  const useDisabledVisual = disabled && !loading;

  const palette = useMemo(() => {
    if (useDisabledVisual) return resolveDisabledPalette(t);
    return resolveSocialPalette(t, platform, type);
  }, [t, platform, type, useDisabledVisual]);

  const dims = useMemo(() => resolveSocialDims(size, t), [size, t]);

  const iconWrap = useMemo(
    () => ({ width: dims.iconPx, height: dims.iconPx, alignItems: 'center', justifyContent: 'center' }) as const,
    [dims.iconPx],
  );

  const focusWebStyle = useMemo((): ViewStyle | undefined => {
    if (Platform.OS !== 'web' || !focused) return undefined;
    return { boxShadow: t.focusRing.main } as ViewStyle;
  }, [focused, t.focusRing.main]);

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

  const label = LABELS[platform];

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isPressDisabled, busy: loading }}
      disabled={isPressDisabled}
      onPressIn={handleIn}
      onPressOut={handleOut}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      hitSlop={size === 'sm' ? { top: 4, bottom: 4, left: 4, right: 4 } : undefined}
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
          animated,
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
