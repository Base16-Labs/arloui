import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  type DimensionValue,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type SkeletonShape = 'rectangle' | 'text' | 'circle';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  shape?: SkeletonShape;
  animation?: SkeletonAnimation;
  borderRadius?: number;
  color?: string;
  highlightColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Skeleton({
  width = '100%',
  height,
  shape = 'rectangle',
  animation = 'shimmer',
  borderRadius,
  color,
  highlightColor,
  style,
  testID,
}: SkeletonProps) {
  const t = useTokens();
  const [progress] = useState(() => new Animated.Value(0));
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const circle = shape === 'circle';
  const resolvedWidth = circle && width === '100%' ? 40 : width;
  const resolvedHeight = height ?? (circle ? resolvedWidth : shape === 'text' ? 12 : 16);
  const resolvedRadius =
    borderRadius ?? (circle ? 999 : shape === 'text' ? t.radii.full : t.radii.md);
  const baseColor = color ?? t.colors.surfaceStrong;
  const sheenColor =
    highlightColor ?? (t.name === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.52)');

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => active && setReduceMotion(enabled));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (animation === 'none' || reduceMotion) return;

    const cycle =
      animation === 'pulse'
        ? Animated.sequence([
            Animated.timing(progress, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(progress, {
              toValue: 0,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        : Animated.timing(progress, {
            toValue: 1,
            duration: 1200,
            easing: Easing.linear,
            useNativeDriver: true,
          });
    const loop = Animated.loop(cycle);
    loop.start();
    return () => loop.stop();
  }, [animation, progress, reduceMotion]);

  function handleLayout(event: LayoutChangeEvent) {
    setLayoutWidth(event.nativeEvent.layout.width);
  }

  return (
    <Animated.View
      testID={testID}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={handleLayout}
      style={[
        {
          width: resolvedWidth,
          height: resolvedHeight,
          overflow: 'hidden',
          borderRadius: resolvedRadius,
          backgroundColor: baseColor,
          opacity:
            animation === 'pulse' && !reduceMotion
              ? progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.48] })
              : 1,
        },
        style,
      ]}
    >
      {animation === 'shimmer' && !reduceMotion && layoutWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: Math.max(28, layoutWidth * 0.38),
            borderRadius: resolvedRadius,
            backgroundColor: sheenColor,
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-layoutWidth, layoutWidth],
                }),
              },
            ],
          }}
        />
      ) : null}
    </Animated.View>
  );
}
