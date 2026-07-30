import { forwardRef, useMemo } from 'react';
import { Platform, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

type Tokens = ReturnType<typeof useTokens>;

export type BadgeSize = 'sm' | 'md';
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type BadgeAppearance = 'soft' | 'solid' | 'outline';

export type BadgeProps = {
  children?: string;
  size?: BadgeSize;
  tone?: BadgeTone;
  appearance?: BadgeAppearance;
  dot?: boolean;
  leadingIcon?: React.ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type Dims = {
  height: number;
  paddingX: number;
  type: { fontSize: number; lineHeight: number; fontWeight: string };
  dotSize: number;
  iconSize: number;
  gap: number;
  insetBorder: number;
};

function badgeDims(t: Tokens): Record<BadgeSize, Dims> {
  return {
    sm: {
      height: 20,
      paddingX: t.spacing[2],
      type: { fontSize: 11, lineHeight: 13.2, fontWeight: '400' },
      dotSize: 6,
      iconSize: t.sizing.icon.xs,
      gap: t.spacing[1],
      insetBorder: 1,
    },
    md: {
      height: 24,
      paddingX: t.spacing[2],
      type: { fontSize: 12, lineHeight: 16.8, fontWeight: '400' },
      dotSize: 8,
      iconSize: t.sizing.icon.xs,
      gap: t.spacing[1],
      insetBorder: 1.5,
    },
  };
}

type Palette = {
  bg: string;
  fg: string;
  border: string;
  borderWidth: number;
  dotColor: string;
  insetBorder: string;
};

function badgePalette(t: Tokens): Record<BadgeTone, Record<BadgeAppearance, Palette>> {
  const none = 'transparent';
  return {
    neutral: {
      soft: { bg: t.colors.surfaceInput, fg: t.colors.textSecondary, border: none, borderWidth: 0, dotColor: t.colors.textSecondary, insetBorder: none },
      solid: { bg: t.colors.textSecondary, fg: t.colors.textInteractivePrimary, border: none, borderWidth: 0, dotColor: t.colors.textInteractivePrimary, insetBorder: 'rgba(255,255,255,0.12)' },
      outline: { bg: none, fg: t.colors.textSecondary, border: t.colors.borderPrimary, borderWidth: 1, dotColor: t.colors.textSecondary, insetBorder: none },
    },
    info: {
      soft: { bg: t.colors.feedbackInfoBg, fg: t.colors.feedbackInfo, border: none, borderWidth: 0, dotColor: t.colors.feedbackInfo, insetBorder: none },
      solid: { bg: t.colors.feedbackInfo, fg: t.colors.textInteractivePrimary, border: none, borderWidth: 0, dotColor: t.colors.textInteractivePrimary, insetBorder: 'rgba(255,255,255,0.15)' },
      outline: { bg: none, fg: t.colors.feedbackInfo, border: t.colors.feedbackInfo, borderWidth: 1, dotColor: t.colors.feedbackInfo, insetBorder: none },
    },
    success: {
      soft: { bg: t.colors.feedbackSuccessBg, fg: t.colors.feedbackSuccess, border: none, borderWidth: 0, dotColor: t.colors.feedbackSuccess, insetBorder: none },
      solid: { bg: t.colors.feedbackSuccess, fg: t.colors.textInteractivePrimary, border: none, borderWidth: 0, dotColor: t.colors.textInteractivePrimary, insetBorder: 'rgba(255,255,255,0.15)' },
      outline: { bg: none, fg: t.colors.feedbackSuccess, border: t.colors.feedbackSuccess, borderWidth: 1, dotColor: t.colors.feedbackSuccess, insetBorder: none },
    },
    warning: {
      soft: { bg: t.colors.feedbackWarningBg, fg: t.colors.feedbackWarning, border: none, borderWidth: 0, dotColor: t.colors.feedbackWarning, insetBorder: none },
      solid: { bg: t.colors.feedbackWarning, fg: t.colors.textInteractivePrimary, border: none, borderWidth: 0, dotColor: t.colors.textInteractivePrimary, insetBorder: 'rgba(255,255,255,0.12)' },
      outline: { bg: none, fg: t.colors.feedbackWarning, border: t.colors.feedbackWarning, borderWidth: 1, dotColor: t.colors.feedbackWarning, insetBorder: none },
    },
    error: {
      soft: { bg: t.colors.feedbackErrorBg, fg: t.colors.feedbackError, border: none, borderWidth: 0, dotColor: t.colors.feedbackError, insetBorder: none },
      solid: { bg: t.colors.feedbackError, fg: t.colors.textInteractivePrimary, border: none, borderWidth: 0, dotColor: t.colors.textInteractivePrimary, insetBorder: 'rgba(255,255,255,0.15)' },
      outline: { bg: none, fg: t.colors.feedbackError, border: t.colors.feedbackError, borderWidth: 1, dotColor: t.colors.feedbackError, insetBorder: none },
    },
  };
}

export const Badge = forwardRef<View, BadgeProps>(function Badge(
  {
    children,
    size = 'md',
    tone = 'neutral',
    appearance = 'soft',
    dot = false,
    leadingIcon,
    accessibilityLabel,
    style,
  },
  ref,
) {
  const t = useTokens();
  const dims = useMemo(() => badgeDims(t)[size], [t, size]);
  const palette = useMemo(() => badgePalette(t)[tone][appearance], [t, tone, appearance]);

  const isSolid = appearance === 'solid';
  const hasInset = isSolid && palette.insetBorder !== 'transparent';

  const isIconOnly = !!leadingIcon && !children && !dot;

  return (
    <View
      ref={ref}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? children}
      style={[
        {
          height: dims.height,
          borderRadius: t.radii.full,
          backgroundColor: palette.bg,
          borderWidth: palette.borderWidth,
          borderColor: palette.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: dims.gap,
          overflow: 'hidden',
        },
        isIconOnly
          ? { width: dims.height, justifyContent: 'center' }
          : { paddingHorizontal: dims.paddingX },
        style,
      ]}
    >
      {hasInset ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: t.radii.full,
            borderWidth: dims.insetBorder,
            borderColor: palette.insetBorder,
          }}
        />
      ) : null}

      {dot ? (
        <View
          style={{
            width: dims.dotSize,
            height: dims.dotSize,
            borderRadius: dims.dotSize / 2,
            backgroundColor: palette.dotColor,
          }}
        />
      ) : null}

      {leadingIcon && !dot ? leadingIcon : null}

      {children ? (
        <Text
          numberOfLines={1}
          style={{
            fontFamily: t.fontFamilies.sans,
            fontSize: dims.type.fontSize,
            lineHeight: dims.type.lineHeight,
            fontWeight: dims.type.fontWeight as '400',
            color: palette.fg,
          }}
        >
          {children}
        </Text>
      ) : null}
    </View>
  );
});
