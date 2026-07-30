import { forwardRef, useCallback, useMemo } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import { usePressFeedback } from '../button/press-feedback';

type Tokens = ReturnType<typeof useTokens>;

export type ChipSize = 'sm' | 'md';
export type ChipType = 'filter' | 'input' | 'assist';
export type ChipStyle = 'fill' | 'outline';
export type ChipAccent = 'primary' | 'neutral';
export type ChipRadius = 'full' | 'lg';
export type ChipSelectionIndicator = 'check' | 'none';

export type ChipProps = Omit<PressableProps, 'style' | 'children'> & {
  children?: string;
  type?: ChipType;
  chipStyle?: ChipStyle;
  accent?: ChipAccent;
  radius?: ChipRadius;
  selectionIndicator?: ChipSelectionIndicator;
  size?: ChipSize;
  selected?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  onRemove?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

type Dims = {
  height: number;
  paddingX: number;
  type: { fontSize: number; lineHeight: number };
  iconSize: number;
  gap: number;
};

function chipDims(t: Tokens): Record<ChipSize, Dims> {
  return {
    sm: {
      height: 28,
      paddingX: t.spacing[3],
      type: { fontSize: 12, lineHeight: 16.8 },
      iconSize: t.sizing.icon.xs,
      gap: t.spacing[1],
    },
    md: {
      height: 32,
      paddingX: t.spacing[3],
      type: { fontSize: 14, lineHeight: 16.8 },
      iconSize: t.sizing.icon.sm,
      gap: t.spacing[2],
    },
  };
}

type Palette = { bg: string; fg: string; border: string; borderWidth: number };

function chipPalette(
  t: Tokens,
  chipStyle: ChipStyle,
  accent: ChipAccent,
  selected: boolean,
  disabled: boolean,
): Palette {
  if (disabled) {
    return {
      bg: t.colors.interactiveDisabled,
      fg: t.colors.textTertiary,
      border: t.colors.borderSecondary,
      borderWidth: 1,
    };
  }

  if (selected) {
    if (chipStyle === 'fill') {
      return accent === 'primary'
        ? { bg: t.colors.interactivePrimary, fg: t.colors.textInteractivePrimary, border: t.colors.interactivePrimary, borderWidth: 1 }
        : { bg: t.colors.textPrimary, fg: t.colors.textInverse, border: t.colors.textPrimary, borderWidth: 1 };
    }
    return accent === 'primary'
      ? { bg: t.colors.feedbackInfoBg, fg: t.colors.interactivePrimary, border: t.colors.interactivePrimary, borderWidth: 1 }
      : { bg: t.colors.surfaceInput, fg: t.colors.textPrimary, border: t.colors.textPrimary, borderWidth: 1 };
  }

  if (chipStyle === 'fill') {
    return accent === 'primary'
      ? { bg: t.colors.interactiveSecondary, fg: t.colors.textPrimary, border: 'transparent', borderWidth: 0 }
      : { bg: t.colors.surfaceInput, fg: t.colors.textPrimary, border: 'transparent', borderWidth: 0 };
  }

  return {
    bg: 'transparent',
    fg: t.colors.textPrimary,
    border: t.colors.borderSecondary,
    borderWidth: 1,
  };
}

function CheckIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M3 7.5L5.5 10L11 4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CloseIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M4 4L10 10M10 4L4 10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const Chip = forwardRef<View, ChipProps>(function Chip(
  {
    children,
    type = 'filter',
    chipStyle = 'outline',
    accent = 'primary',
    radius = 'full',
    selectionIndicator = 'check',
    size = 'md',
    selected = false,
    disabled = false,
    leadingIcon,
    onRemove,
    onPress,
    style,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const t = useTokens();
  const dims = useMemo(() => chipDims(t)[size], [t, size]);
  const palette = useMemo(
    () => chipPalette(t, chipStyle, accent, selected, disabled),
    [t, chipStyle, accent, selected, disabled],
  );

  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback({
    haptic: 'light',
    onPressIn: rest.onPressIn ?? null,
    onPressOut: rest.onPressOut ?? null,
  });

  const handleRemove = useCallback(() => {
    if (!disabled) onRemove?.();
  }, [disabled, onRemove]);

  const iconOnly = !children && !!leadingIcon;
  const isFilterSelected = type === 'filter' && selected;
  const showCheck = isFilterSelected && selectionIndicator === 'check' && !iconOnly;
  const showRemove = type === 'input' && !!onRemove && !iconOnly;
  const closeIconSize = size === 'sm' ? 12 : 14;

  return (
    <Animated.View style={[animatedStyle, { alignSelf: 'flex-start' }]}>
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? children}
        accessibilityState={{ selected: type === 'filter' ? selected : undefined, disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={Math.max(0, Math.ceil((t.sizing.touchTarget.minimum - dims.height) / 2))}
        {...rest}
      >
        <View
          style={[
            {
              height: dims.height,
              borderRadius: t.radii[radius],
              backgroundColor: palette.bg,
              borderWidth: palette.borderWidth,
              borderColor: palette.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: dims.gap,
            },
            iconOnly
              ? { width: dims.height, justifyContent: 'center' }
              : { paddingLeft: dims.paddingX, paddingRight: showRemove ? dims.gap : dims.paddingX },
            style,
          ]}
        >
          {showCheck ? (
            <CheckIcon size={dims.iconSize} color={palette.fg} />
          ) : leadingIcon ? (
            leadingIcon
          ) : null}

          {children ? (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: t.fontFamilies.sans,
                fontSize: dims.type.fontSize,
                lineHeight: dims.type.lineHeight,
                fontWeight: '400',
                color: palette.fg,
              }}
            >
              {children}
            </Text>
          ) : null}

          {showRemove ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${children}`}
              disabled={disabled}
              onPress={handleRemove}
              hitSlop={8}
              style={{
                width: dims.height - dims.gap * 2,
                height: dims.height - dims.gap * 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloseIcon size={closeIconSize} color={palette.fg} />
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
});
