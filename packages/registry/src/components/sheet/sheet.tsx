/**
 * Arlo UI — Sheet (Bottom Drawer)
 *
 * A bottom-anchored surface with a grabber, drag-to-dismiss, safe-area padding,
 * and token-based width, height, and padding controls. Two composable axes drive the material treatment:
 *
 *   - `backdrop`: 'scrim' (modal — dims and blocks the background, default) or
 *     'passthrough' (iOS-style — the background stays visible and interactive).
 *   - `surface`:  'solid' (opaque elevated fill, default) or 'glass' (translucent
 *     Liquid-Glass material). Combine `backdrop="passthrough"` + `surface="glass"`
 *     for a floating glass sheet over live content.
 *
 * Motion, colors, radii, and the glass material all come from tokens. Gestures use
 * the RN `Animated` API + `PanResponder`, so there are no extra dependencies.
 *
 * Compound parts: `<Sheet.Handle>`, `<Sheet.Header>`, `<Sheet.Body>`, `<Sheet.Footer>`.
 *
 * The Sheet renders an absolutely-positioned, full-screen overlay, so place it near
 * the root of the screen it should cover (a `flex: 1` parent).
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Easing,
  PanResponder,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type SheetBackdrop = 'scrim' | 'passthrough';
export type SheetSurface = 'solid' | 'glass';
export type SheetWidth = 'default' | 'stack';
/** `'auto'` hugs the content, `'half'` uses half the screen, and `'full'` fills the available height. */
export type SheetHeight = 'auto' | 'half' | 'full';
/** Outer horizontal and bottom spacing around the sheet. */
export type SheetPadding = 'none' | 'md' | 'lg';
/** @deprecated Use `SheetWidth` and the `width` prop. */
export type SheetPresentation = 'edge' | 'inset' | 'stack';
/** @deprecated Use `SheetHeight` and the `height` prop. */
export type SheetDetent = 'auto' | 'full' | number;

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  /** `'scrim'` dims + blocks the background (modal); `'passthrough'` leaves it interactive. */
  backdrop?: SheetBackdrop;
  /** `'solid'` opaque fill or `'glass'` translucent Liquid-Glass material. */
  surface?: SheetSurface;
  /** `'default'` uses one surface; `'stack'` adds a second surface behind it. */
  width?: SheetWidth;
  /** Controls how much vertical space the sheet occupies. */
  height?: SheetHeight;
  /** Token-based outer gutter. This is independent of `width`. */
  padding?: SheetPadding;
  /** @deprecated Use `width` and `padding`. */
  presentation?: SheetPresentation;
  /** @deprecated Use `height`. Fractional numbers remain supported here for compatibility. */
  detent?: SheetDetent;
  showHandle?: boolean;
  /** @deprecated Use token-based `padding`. */
  horizontalInset?: number;
  /** Optional override for the outer bottom gutter. */
  bottomOffset?: number;
  /** Maximum visual width for tablet/large phones. */
  maxWidth?: number;
  /** Surface corner radius. Defaults to 24 for default and 20 for stack. */
  cornerRadius?: number;
  handleWidth?: number;
  handleHeight?: number;
  /** Tap the scrim to dismiss (scrim backdrop only). */
  dismissOnBackdropPress?: boolean;
  dragToDismiss?: boolean;
  /** Optional blur layer (e.g. `expo-blur`'s BlurView) rendered behind a glass surface. */
  blurComponent?: ReactNode;
  /** Safe-area insets from the host app (e.g. `react-native-safe-area-context`'s `useSafeAreaInsets()`). */
  topInset?: number;
  bottomInset?: number;
  children: ReactNode;
  /** Style for the sheet surface. */
  style?: StyleProp<ViewStyle>;
};

const OPEN_DURATION = 340;
const CLOSE_DURATION = 260;

function SheetRoot({
  visible,
  onClose,
  backdrop = 'scrim',
  surface = 'solid',
  width,
  height,
  padding,
  presentation,
  detent,
  showHandle = true,
  horizontalInset,
  bottomOffset,
  maxWidth,
  cornerRadius,
  handleWidth,
  handleHeight,
  dismissOnBackdropPress = true,
  dragToDismiss = true,
  blurComponent,
  topInset = 0,
  bottomInset = 0,
  children,
  style,
}: SheetProps) {
  const t = useTokens();
  const dark = t.name === 'dark';
  const { height: windowHeight } = useWindowDimensions();
  const [x1, y1, x2, y2] = t.motion.easing.easeSheet;
  const sheetEasing = useMemo(() => Easing.bezier(x1, y1, x2, y2), [x1, y1, x2, y2]);

  const isGlass = surface === 'glass';
  const isScrim = backdrop === 'scrim';
  const resolvedWidth: SheetWidth = width ?? (presentation === 'stack' ? 'stack' : 'default');
  const resolvedHeight: SheetHeight | number = height ?? detent ?? 'auto';
  const tokenPadding = padding === 'md' ? t.spacing[4] : padding === 'lg' ? t.spacing[6] : 0;
  const legacyInset = presentation === 'inset' || presentation === 'stack' ? t.spacing[4] : 0;
  const resolvedInset = horizontalInset ?? (padding == null ? legacyInset : tokenPadding);
  const isInset = resolvedInset > 0;
  const resolvedBottomOffset = bottomOffset ?? (isInset ? resolvedInset : 0);
  const resolvedRadius = cornerRadius ?? (resolvedWidth === 'stack' ? 20 : t.radii['2xl']);

  const maxHeight = windowHeight - Math.max(topInset, 24) - resolvedBottomOffset - 8;
  const fixedHeight =
    resolvedHeight === 'full'
      ? maxHeight
      : resolvedHeight === 'half'
        ? Math.min(maxHeight, Math.round(windowHeight * 0.54))
        : typeof resolvedHeight === 'number'
          ? Math.min(maxHeight, Math.round(windowHeight * resolvedHeight))
          : undefined;

  const [mounted, setMounted] = useState(visible);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const sheetHeight = fixedHeight ?? measuredHeight;
  const closedY =
    sheetHeight > 0 ? sheetHeight + resolvedBottomOffset + bottomInset + 48 : windowHeight;
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const closing = useRef(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => active && setReduceMotion(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  const animateOpen = () => {
    closing.current = false;
    translateY.setValue(closedY);
    Animated.timing(translateY, {
      toValue: 0,
      duration: reduceMotion ? 0 : OPEN_DURATION,
      easing: sheetEasing,
      useNativeDriver: true,
    }).start();
  };

  const settle = () => {
    Animated.spring(translateY, {
      toValue: 0,
      ...t.motion.spring.gentle,
      useNativeDriver: true,
    }).start();
  };

  const animateClose = (notify = true) => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(translateY, {
      toValue: closedY,
      duration: reduceMotion ? 0 : CLOSE_DURATION,
      easing: sheetEasing,
      useNativeDriver: true,
    }).start();
    dismissTimer.current = setTimeout(
      () => {
        setMounted(false);
        closing.current = false;
        if (notify) onClose();
      },
      reduceMotion ? 0 : CLOSE_DURATION,
    );
  };

  // Sync mount + animation to the `visible` prop.
  useEffect(() => {
    if (visible) {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      setMounted(true);
      return;
    }
    if (mounted && !closing.current) animateClose(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Run the open animation once the sheet is mounted and its height is known.
  useEffect(() => {
    if (mounted && visible && sheetHeight > 0) animateOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, sheetHeight > 0]);

  // Android hardware back closes a modal (scrim) sheet.
  useEffect(() => {
    if (!mounted || !isScrim) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      animateClose();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isScrim]);

  useEffect(
    () => () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    },
    [],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          dragToDismiss && Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderGrant: () => {
          translateY.stopAnimation();
        },
        onPanResponderMove: (_, g) => {
          // Rubber-band when dragged above the resting position.
          translateY.setValue(g.dy < 0 ? g.dy * 0.18 : g.dy);
        },
        onPanResponderRelease: (_, g) => {
          const shouldDismiss = g.dy > Math.max(sheetHeight * 0.28, 80) || g.vy > 0.75;
          if (shouldDismiss) animateClose();
          else settle();
        },
        onPanResponderTerminate: settle,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dragToDismiss, sheetHeight, closedY],
  );

  const scrimOpacity = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [0, Math.max(sheetHeight, 1)],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
    [translateY, sheetHeight],
  );

  if (!mounted) return null;

  const surfaceColor = isGlass
    ? dark
      ? t.materials.glassMedium.darkOverlay
      : t.materials.glassMedium.lightOverlay
    : t.colors.surfaceElevated;
  const surfaceBorder = isGlass
    ? dark
      ? t.materials.glassMedium.darkBorder
      : t.materials.glassMedium.lightBorder
    : t.colors.border;
  const shadow = dark ? t.shadows.none : t.shadows.xl;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
      }}
    >
      {isScrim ? (
        <Animated.View
          pointerEvents="auto"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: t.colors.surfaceOverlay,
            opacity: scrimOpacity,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={{ flex: 1 }}
            onPress={dismissOnBackdropPress ? () => animateClose() : undefined}
          />
        </Animated.View>
      ) : null}

      <Animated.View
        accessibilityViewIsModal={isScrim}
        onLayout={(e) => {
          if (fixedHeight == null) setMeasuredHeight(e.nativeEvent.layout.height);
        }}
        style={[
          {
            maxHeight,
            height: fixedHeight,
            alignSelf: maxWidth ? 'center' : 'stretch',
            width: maxWidth ? '100%' : undefined,
            maxWidth,
            marginHorizontal: resolvedInset,
            marginBottom: resolvedBottomOffset,
            overflow: 'visible',
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        {resolvedWidth === 'stack' ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: -12,
              right: t.spacing[3],
              left: t.spacing[3],
              height: 30,
              borderRadius: resolvedRadius,
              backgroundColor: dark ? t.colors.surfaceRaised : t.colors.surfaceElevated,
              borderWidth: 1,
              borderColor: surfaceBorder,
              opacity: dark ? 0.82 : 0.94,
              transform: [{ scaleX: 0.97 }],
            }}
          />
        ) : null}

        <View
          style={{
            flex: fixedHeight != null ? 1 : undefined,
            borderTopLeftRadius: resolvedRadius,
            borderTopRightRadius: resolvedRadius,
            borderBottomLeftRadius: isInset ? resolvedRadius : 0,
            borderBottomRightRadius: isInset ? resolvedRadius : 0,
            ...shadow,
            shadowOffset: { width: 0, height: -4 },
          }}
        >
          <View
            style={{
              flex: fixedHeight != null ? 1 : undefined,
              paddingBottom: Math.max(bottomInset, t.spacing[4]),
              borderTopLeftRadius: resolvedRadius,
              borderTopRightRadius: resolvedRadius,
              borderBottomLeftRadius: isInset ? resolvedRadius : 0,
              borderBottomRightRadius: isInset ? resolvedRadius : 0,
              borderTopWidth: 1,
              borderLeftWidth: isGlass ? 1 : 0,
              borderRightWidth: isGlass ? 1 : 0,
              borderBottomWidth: isInset && isGlass ? 1 : 0,
              borderColor: surfaceBorder,
              backgroundColor: surfaceColor,
              overflow: 'hidden',
            }}
          >
            {isGlass && blurComponent ? (
              <View
                pointerEvents="none"
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
              >
                {blurComponent}
              </View>
            ) : null}

            {showHandle ? (
              <View {...panResponder.panHandlers}>
                <SheetHandle width={handleWidth} height={handleHeight} />
              </View>
            ) : (
              <View {...panResponder.panHandlers} style={{ height: t.spacing[2] }} />
            )}

            {children}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

/** The grabber. Rendered by default; exported for custom header layouts. */
function SheetHandle({
  width = 44,
  height = 4,
  style,
}: {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  return (
    <View
      style={[
        { alignItems: 'center', paddingTop: t.spacing[2], paddingBottom: t.spacing[1] },
        style,
      ]}
    >
      <View
        style={{
          width,
          height,
          borderRadius: t.radii.full,
          backgroundColor: t.colors.borderStrong,
        }}
      />
    </View>
  );
}

function SheetHeader({
  children,
  title,
  style,
  titleStyle,
}: {
  children?: ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}) {
  const t = useTokens();
  return (
    <View
      style={[
        {
          paddingHorizontal: t.spacing[5],
          paddingTop: t.spacing[1],
          paddingBottom: t.spacing[3],
          gap: t.spacing[1],
        },
        style,
      ]}
    >
      {title ? (
        <Text
          style={[
            {
              color: t.colors.textPrimary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.headingLarge.fontSize,
              lineHeight: t.typography.headingLarge.lineHeight,
              fontWeight: '600',
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function SheetBody({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return (
    <View style={[{ paddingHorizontal: t.spacing[5], gap: t.spacing[3] }, style]}>{children}</View>
  );
}

function SheetFooter({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return (
    <View
      style={[
        {
          paddingHorizontal: t.spacing[5],
          paddingTop: t.spacing[4],
          marginTop: t.spacing[2],
          gap: t.spacing[2],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export const Sheet = Object.assign(SheetRoot, {
  Handle: SheetHandle,
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
});
