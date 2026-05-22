/**
 * Arlo UI — Social auth button (Facebook, X)
 *
 * Pill-shaped OAuth rows matching Figma: brand solid / soft / outline and neutral solid / outline.
 * Icons are minimal Text glyphs (no extra deps); swap via `renderLeading` if you need brand SVGs.
 */
import { forwardRef, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
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

/** Meta brand blues/blacks — neutral fills still use theme semantic colors. */
const FACEBOOK_BLUE = '#1877F2';
const X_BLACK = '#000000';

export type SocialAuthProvider = 'facebook' | 'x';

export type SocialAuthAppearance =
  | 'brandSolid'
  | 'brandSoft'
  | 'brandOutline'
  | 'neutralSolid'
  | 'neutralOutline';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export type SocialAuthButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  provider: SocialAuthProvider;
  appearance: SocialAuthAppearance;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Replace the default “f” / “X” glyph (e.g. SVG asset). */
  renderLeading?: (color: string, iconPx: number) => ReactNode;
  style?: StyleProp<ViewStyle>;
};

const LABELS: Record<SocialAuthProvider, string> = {
  facebook: 'Sign in with Facebook',
  x: 'Sign in with X',
};

function socialPalette(
  t: ReturnType<typeof useTokens>,
  provider: SocialAuthProvider,
  appearance: SocialAuthAppearance,
): { bg: string; fg: string; border: string; borderWidth: number } {
  const brand = provider === 'facebook' ? FACEBOOK_BLUE : X_BLACK;

  switch (appearance) {
    case 'brandSolid':
      return { bg: brand, fg: '#FFFFFF', border: 'transparent', borderWidth: 0 };
    case 'brandSoft':
      return {
        bg: provider === 'facebook' ? t.colors.feedbackInfoBg : t.colors.interactiveSecondary,
        fg: brand,
        border: 'transparent',
        borderWidth: 0,
      };
    case 'brandOutline':
      return { bg: 'transparent', fg: brand, border: brand, borderWidth: 1 };
    case 'neutralSolid':
      return {
        bg: t.colors.textSecondary,
        fg: t.colors.textInverse,
        border: 'transparent',
        borderWidth: 0,
      };
    case 'neutralOutline':
      return {
        bg: 'transparent',
        fg: t.colors.textPrimary,
        border: t.colors.borderPrimary,
        borderWidth: 1,
      };
  }
}

function iconPxForSize(size: Size, t: ReturnType<typeof useTokens>): number {
  switch (size) {
    case 'sm':
      return t.sizing.icon.sm;
    case 'md':
      return t.sizing.icon.md;
    default:
      return t.sizing.icon.lg;
  }
}

function DefaultGlyph({ provider, color, iconPx }: { provider: SocialAuthProvider; color: string; iconPx: number }) {
  const fs = iconPx * (provider === 'facebook' ? 0.62 : 0.58);
  if (provider === 'facebook') {
    return (
      <Text style={{ color, fontSize: fs, fontWeight: '700', fontFamily: 'System' }} allowFontScaling={false}>
        f
      </Text>
    );
  }
  return (
    <Text
      style={{ color, fontSize: fs, fontWeight: '900', fontFamily: 'System', letterSpacing: -0.5 }}
      allowFontScaling={false}
    >
      X
    </Text>
  );
}

export const SocialAuthButton = forwardRef<View, SocialAuthButtonProps>(function SocialAuthButton(
  {
    provider,
    appearance,
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
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

  const palette = useMemo(() => socialPalette(t, provider, appearance), [t, provider, appearance]);

  const dims = useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          minHeight: t.sizing.buttonHeight.sm,
          paddingX: t.spacing[4],
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

  const ipx = iconPxForSize(size, t);
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

  const solidPressed =
    (appearance === 'brandSolid' || appearance === 'neutralSolid') && pressed && !disabled && !loading;

  const pressedElevation = useMemo(() => {
    if (!solidPressed) return t.shadows.none as unknown as ViewStyle;
    return t.shadows.md as unknown as ViewStyle;
  }, [solidPressed, t.shadows]);

  const focusWebStyle: ViewStyle | undefined = useMemo(() => {
    if (Platform.OS !== 'web' || !focused) return undefined;
    return { boxShadow: t.focusRing.main } as ViewStyle;
  }, [focused, t.focusRing.main]);

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
    opacity: press.interpolate({ inputRange: [0, 1], outputRange: [1, t.motion.pressed.opacity] }),
  };

  const isDisabled = disabled || loading;
  const label = LABELS[provider];

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
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
            paddingHorizontal: dims.paddingX,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: dims.gap,
            opacity: isDisabled ? 0.45 : 1,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
          },
          pressedElevation,
          focusWebStyle,
          animated,
          style,
        ]}
      >
        {loading ? (
          <View style={iconWrap}>
            <ActivityIndicator color={palette.fg} size={size === 'sm' || size === 'md' ? 'small' : 'large'} />
          </View>
        ) : (
          <View style={iconWrap}>
            {renderLeading ? (
              renderLeading(palette.fg, ipx)
            ) : (
              <DefaultGlyph provider={provider} color={palette.fg} iconPx={ipx} />
            )}
          </View>
        )}
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
      </Animated.View>
    </Pressable>
  );
});
