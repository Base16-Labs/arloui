import type { ReactNode } from 'react';
import { Animated, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import { useSkeletonPulse } from './hooks';

export function ChartState({
  title,
  description,
  compact = false,
  children,
  style,
}: {
  title: string;
  description?: string;
  compact?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const iconSize = compact ? 30 : 38;

  return (
    <View
      style={[
        {
          flex: 1,
          minHeight: compact ? 88 : 132,
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? t.spacing[1] : t.spacing[2],
          paddingHorizontal: t.spacing[4],
        },
        style,
      ]}
    >
      <View
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: t.radii.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.surfaceInput,
        }}
      >
        <Svg width={compact ? 16 : 20} height={compact ? 16 : 20} viewBox="0 0 20 20">
          <Path
            d="M3 14.5 7.1 10l3 2.35L16.8 5.5"
            fill="none"
            stroke={t.colors.textTertiary}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="16.8" cy="5.5" r="1.35" fill={t.colors.textTertiary} />
        </Svg>
      </View>
      <Text
        style={{
          color: t.colors.textSecondary,
          fontFamily: t.fontFamilies.sans,
          fontSize: compact ? t.typography.bodySm.fontSize : t.typography.body.fontSize,
          lineHeight: compact ? t.typography.bodySm.lineHeight : t.typography.body.lineHeight,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {!compact && description ? (
        <Text
          style={{
            maxWidth: 260,
            color: t.colors.textTertiary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight,
            textAlign: 'center',
          }}
        >
          {description}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function ChartReadoutSkeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);

  return (
    <Animated.View
      accessibilityLabel="Chart loading"
      style={[{ gap: t.spacing[2], opacity: pulse }, style]}
    >
      <View
        style={{
          width: 148,
          height: t.typography.displayMedium.lineHeight,
          borderRadius: t.radii.md,
          backgroundColor: t.colors.surfaceInput,
        }}
      />
      <View
        style={{
          width: 92,
          height: t.typography.body.lineHeight,
          borderRadius: t.radii.sm,
          backgroundColor: t.colors.surfaceInput,
        }}
      />
    </Animated.View>
  );
}
