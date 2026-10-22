/**
 * Arlo UI — FAB (Floating Action Button)
 *
 * Circular, 48×48px, single icon. Primary or neutral tone.
 * Shadow on rest, no shadow on press or on glass. Reduced opacity (~28%) when disabled.
 * Export `FAB` is the canonical name; `FabButton` kept for backward compatibility.
 */
import { forwardRef, useMemo, useState, type ComponentRef, type ReactNode } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassBackdrop, useGlassSurface } from '../../foundation/glass';
import { useTokens } from '../../foundation/theme-provider';
import { usePressFeedback, type ButtonHaptic } from './press-feedback';

type Tokens = ReturnType<typeof useTokens>;

export type FabTone = 'primary' | 'neutral';
export type FabSurface = 'default' | 'glass';

/** Single source of truth for the FAB's rest/pressed background per tone. */
function fabVariants(t: Tokens): Record<FabTone, { rest: string; pressed: string }> {
  return {
    primary: { rest: t.colors.interactivePrimary, pressed: t.colors.interactivePrimaryPressed },
    neutral: { rest: t.colors.surfaceElevated, pressed: t.colors.interactiveSecondaryPressed },
  };
}

export type FABProps = Omit<PressableProps, 'style' | 'children'> & {
  icon: ReactNode;
  /** @deprecated Use `icon` prop instead. */
  children?: ReactNode;
  tone?: FabTone;
  /**
   * `'glass'` is the Liquid Glass FAB: primary tints with `interactivePrimaryGlass`,
   * neutral with `interactiveSecondary`. Disabled stays on the opaque fill.
   * Glass draws no shadow — the material's edge is the whole depth cue.
   */
  surface?: FabSurface;
  /**
   * Optional blur layer behind a glass FAB. Ignored on the native glass path.
   */
  blurComponent?: ReactNode;
  disabled?: boolean;
  haptic?: ButtonHaptic;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

/** @deprecated Use `FABProps`. */
export type FabButtonProps = FABProps;

const FAB_SIZE = 48;
const FAB_ICON_SIZE = 24;

export const FAB = forwardRef<ComponentRef<typeof View>, FABProps>(function FAB(
  {
    icon,
    children,
    tone = 'primary',
    surface = 'default',
    blurComponent,
    disabled = false,
    haptic = 'medium',
    accessibilityLabel,
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
  const palette = useMemo(() => fabVariants(t)[tone], [t, tone]);
  const { pressed, animatedStyle, onPressIn: pressIn, onPressOut: pressOut } = usePressFeedback({
    haptic,
    onPressIn,
    onPressOut,
  });
  const [focused, setFocused] = useState(false);

  const content = icon ?? children;

  const isGlass = surface === 'glass' && !disabled;
  const glass = useGlassSurface('small');
  const glassLiteral = tone === 'neutral';
  const glassToneFill = tone !== 'neutral';
  const glassTint = tone === 'neutral' ? t.colors.interactiveSecondary : t.colors.interactivePrimaryGlass;
  const glassPressedTint = tone === 'neutral' ? t.colors.interactiveSecondaryPressed : undefined;

  const shadow = useMemo(() => {
    if (disabled || pressed || isGlass) return t.shadows.none as unknown as ViewStyle;
    return t.shadows.sm as unknown as ViewStyle;
  }, [disabled, pressed, isGlass, t.shadows]);

  const focusOutline = useMemo((): ViewStyle | undefined => {
    if (Platform.OS !== 'web' || !focused || disabled) return undefined;
    return {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: t.colors.focusRingMain,
      outlineOffset: 4,
    } as ViewStyle;
  }, [disabled, focused, t.colors.focusRingMain]);

  const bg = pressed ? palette.pressed : palette.rest;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      {...rest}
    >
      <Animated.View
        style={[
          {
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: t.radii.full,
            backgroundColor: isGlass ? 'transparent' : bg,
            borderColor: isGlass ? glass.borderColor : 'transparent',
            borderWidth: isGlass ? glass.borderWidth : 0,
            overflow: isGlass ? 'hidden' : undefined,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.28 : 1,
          },
          shadow,
          focusOutline,
          animatedStyle,
          style,
        ]}
      >
        {isGlass ? (
          <GlassBackdrop
            material="small"
            tintColor={glassTint}
            pressedTintColor={glassPressedTint}
            literalTint={glassLiteral}
            toneFill={glassToneFill}
            pressed={pressed}
            borderRadius={FAB_SIZE / 2}
          >
            {blurComponent}
          </GlassBackdrop>
        ) : null}
        <View style={{ width: FAB_ICON_SIZE, height: FAB_ICON_SIZE, alignItems: 'center', justifyContent: 'center' }}>
          {content}
        </View>
      </Animated.View>
    </Pressable>
  );
});

/** @deprecated Use `FAB`. */
export const FabButton = FAB;
