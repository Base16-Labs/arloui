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

/** Named spring recipes from motion tokens — shared vocabulary for overlay motion. */
export type SheetMotionPreset = 'gentle' | 'snappy' | 'heavy';

/**
 * Override the sheet's open/close/settle motion without forking the component.
 * Pass a preset name for token recipes, or an object for fine control.
 * Defaults come from motion tokens (`easeSheet`, `duration.base`, `spring.gentle`).
 */
export type SheetMotion =
  | SheetMotionPreset
  | {
      /** Entrance duration in ms. Defaults to `motion.duration.base` (280). */
      openDuration?: number;
      /** Exit duration in ms. Defaults to ~80% of open (exits run faster). */
      closeDuration?: number;
      /** Cubic-bezier control points. Defaults to `motion.easing.easeSheet`. */
      easing?: readonly [number, number, number, number];
      /** Spring used when settling after an incomplete drag. Defaults to `motion.spring.gentle`. */
      spring?: {
        damping: number;
        stiffness: number;
        mass?: number;
      };
      /** Use a token spring recipe instead of raw spring numbers. */
      springPreset?: SheetMotionPreset;
    };

/**
 * Tune drag-to-dismiss and overdrag without rewriting the gesture handler.
 * Defaults match the Fluidity rules (≈35% distance, velocity commit).
 */
export type SheetGesture = {
  /** Fraction of sheet height that must be dragged to dismiss (0–1). Default `0.35`. */
  dismissDistance?: number;
  /** Absolute pixel floor for dismiss distance. Default `80`. */
  dismissDistanceMin?: number;
  /** PanResponder `vy` above which release commits dismiss. Default `0.75`. */
  dismissVelocity?: number;
  /** Upward overdrag multiplier (0 = hard stop, 1 = free). Default `0.18`. */
  overdragResistance?: number;
};

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  /** `'scrim'` dims + blocks the background (modal); `'passthrough'` leaves it interactive. */
  backdrop?: SheetBackdrop;
  /** `'solid'` opaque fill or `'glass'` translucent Liquid-Glass material. */
  surface?: SheetSurface;
  /** `'default'` uses one surface; `'stack'` adds a second surface behind it. */
  width?: SheetWidth;
  /**
   * Controls how much vertical space the sheet occupies when `snapPoints` is not set.
   * A number is treated as a fraction of the window height (e.g. `0.4`).
   */
  height?: SheetHeight | number;
  /**
   * Multiple resting heights as fractions of available height (e.g. `[0.4, 0.92]`).
   * Drag snaps between them; dragging past the smallest commits dismiss when enabled.
   * When set, takes precedence over `height`.
   */
  snapPoints?: number[];
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
  /** Tune open/close timing, easing, and settle spring without rewriting Sheet. */
  motion?: SheetMotion;
  /** Tune drag-to-dismiss thresholds and overdrag resistance. */
  gesture?: SheetGesture;
  /** Fires when a drag ends — whether it dismissed or snapped/settled. */
  onDragEnd?: (info: {
    dismissed: boolean;
    dy: number;
    vy: number;
    snapIndex: number;
  }) => void;
  /** Optional blur layer (e.g. `expo-blur`'s BlurView) rendered behind a glass surface. */
  blurComponent?: ReactNode;
  /** Safe-area insets from the host app (e.g. `react-native-safe-area-context`'s `useSafeAreaInsets()`). */
  topInset?: number;
  bottomInset?: number;
  children: ReactNode;
  /** Style for the sheet surface. */
  style?: StyleProp<ViewStyle>;
};

type ResolvedMotion = {
  openDuration: number;
  closeDuration: number;
  easing: readonly [number, number, number, number];
  spring: { damping: number; stiffness: number; mass?: number };
};

function resolveMotion(
  tokens: ReturnType<typeof useTokens>['motion'],
  override?: SheetMotion,
): ResolvedMotion {
  const presetName: SheetMotionPreset | undefined =
    typeof override === 'string' ? override : override?.springPreset;

  const presetSpring = presetName ? tokens.spring[presetName] : tokens.spring.gentle;
  const objectOverride = typeof override === 'object' ? override : undefined;

  // Presets nudge duration too — snappy feels shorter, heavy a touch longer.
  const presetOpen =
    presetName === 'snappy'
      ? tokens.duration.fast
      : presetName === 'heavy'
        ? tokens.duration.slow
        : tokens.duration.base;

  const openDuration = objectOverride?.openDuration ?? presetOpen;
  const closeDuration =
    objectOverride?.closeDuration ?? Math.round(openDuration * 0.8);

  return {
    openDuration,
    closeDuration,
    easing: objectOverride?.easing ?? tokens.easing.easeSheet,
    spring: objectOverride?.spring ?? presetSpring,
  };
}

function resolveSnapHeights(snapPoints: number[] | undefined, maxHeight: number): number[] | null {
  if (!snapPoints?.length) return null;
  const heights = snapPoints
    .map((p) => {
      if (p <= 0) return 0;
      // Values ≤ 1 are fractions of available height; > 1 are absolute pixels.
      return Math.min(maxHeight, p <= 1 ? Math.round(maxHeight * p) : Math.round(p));
    })
    .filter((h) => h > 0)
    .sort((a, b) => a - b);
  return heights.length ? [...new Set(heights)] : null;
}

/** Safe indexed read — `noUncheckedIndexedAccess` treats `arr[i]` as possibly undefined. */
function detentAt(snaps: number[], index: number): number {
  const clamped = Math.max(0, Math.min(index, snaps.length - 1));
  return snaps[clamped] ?? 0;
}

function SheetRoot({
  visible,
  onClose,
  backdrop = 'scrim',
  surface = 'solid',
  width,
  height,
  snapPoints,
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
  motion: motionOverride,
  gesture: gestureOverride,
  onDragEnd,
  blurComponent,
  topInset = 0,
  bottomInset = 0,
  children,
  style,
}: SheetProps) {
  const t = useTokens();
  const dark = t.name === 'dark';
  const { height: windowHeight } = useWindowDimensions();
  const { openDuration, closeDuration, easing: easingPoints, spring: settleSpring } =
    resolveMotion(t.motion, motionOverride);
  const [x1, y1, x2, y2] = easingPoints;
  const sheetEasing = useMemo(() => Easing.bezier(x1, y1, x2, y2), [x1, y1, x2, y2]);

  const dismissDistance = gestureOverride?.dismissDistance ?? 0.35;
  const dismissDistanceMin = gestureOverride?.dismissDistanceMin ?? 80;
  const dismissVelocity = gestureOverride?.dismissVelocity ?? 0.75;
  const overdragResistance = gestureOverride?.overdragResistance ?? 0.18;

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
  const snaps = useMemo(
    () => resolveSnapHeights(snapPoints, maxHeight),
    [snapPoints, maxHeight],
  );

  const fixedHeight =
    snaps != null
      ? snaps[snaps.length - 1]
      : resolvedHeight === 'full'
        ? maxHeight
        : resolvedHeight === 'half'
          ? Math.min(maxHeight, Math.round(windowHeight * 0.54))
          : typeof resolvedHeight === 'number'
            ? Math.min(maxHeight, Math.round(windowHeight * resolvedHeight))
            : undefined;

  const [mounted, setMounted] = useState(visible);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);
  const snapIndexRef = useRef(0);

  // When the sheet re-opens, start on the smallest detent (React "adjust state
  // during render when props change" pattern — avoids setState-in-effect).
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setSnapIndex(0);
  }

  const sheetHeight = fixedHeight ?? measuredHeight;
  const restY =
    snaps != null && snaps.length > 0 ? sheetHeight - detentAt(snaps, snapIndex) : 0;
  const closedY =
    sheetHeight > 0 ? sheetHeight + resolvedBottomOffset + bottomInset + 48 : windowHeight;
  const [translateY] = useState(() => new Animated.Value(windowHeight));
  const dragOriginY = useRef(0);
  const closing = useRef(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    snapIndexRef.current = snapIndex;
  }, [snapIndex]);

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
      toValue: restY,
      duration: reduceMotion ? 0 : openDuration,
      easing: sheetEasing,
      useNativeDriver: true,
    }).start();
  };

  const settle = (index = snapIndexRef.current) => {
    const target =
      snaps != null && snaps.length > 0 ? sheetHeight - detentAt(snaps, index) : 0;
    closing.current = false;
    Animated.spring(translateY, {
      toValue: target,
      ...settleSpring,
      useNativeDriver: true,
    }).start();
  };

  const animateClose = (notify = true) => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(translateY, {
      toValue: closedY,
      duration: reduceMotion ? 0 : closeDuration,
      easing: sheetEasing,
      useNativeDriver: true,
    }).start();
    dismissTimer.current = setTimeout(
      () => {
        setMounted(false);
        closing.current = false;
        if (notify) onClose();
      },
      reduceMotion ? 0 : closeDuration,
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
  // Do not depend on restY — snap changes settle via spring, not a re-open.
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
      // Refs here are read inside gesture handlers, which run on touch rather than
      // during render. See eslint-config/index.js.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          dragToDismiss && Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderGrant: () => {
          dragOriginY.current = restY;
          translateY.stopAnimation((value) => {
            if (typeof value === 'number') dragOriginY.current = value;
          });
        },
        onPanResponderMove: (_, g) => {
          const next = dragOriginY.current + g.dy;
          // Rubber-band when dragged above the tallest resting position (translateY < 0).
          translateY.setValue(next < 0 ? next * overdragResistance : next);
        },
        onPanResponderRelease: (_, g) => {
          const currentY = Math.max(0, dragOriginY.current + g.dy);
          const dismissThreshold = Math.max(sheetHeight * dismissDistance, dismissDistanceMin);

          if (snaps != null && snaps.length > 0) {
            const smallestRest = sheetHeight - detentAt(snaps, 0);
            const shouldDismiss =
              dragToDismiss &&
              (currentY - smallestRest > dismissThreshold || g.vy > dismissVelocity);

            if (shouldDismiss) {
              onDragEnd?.({
                dismissed: true,
                dy: g.dy,
                vy: g.vy,
                snapIndex: snapIndexRef.current,
              });
              animateClose();
              return;
            }

            // Project a little with velocity, then snap to the nearest detent.
            const projected = currentY + g.vy * 80;
            let best = 0;
            let bestDist = Infinity;
            for (let i = 0; i < snaps.length; i++) {
              const rest = sheetHeight - detentAt(snaps, i);
              const dist = Math.abs(projected - rest);
              if (dist < bestDist) {
                bestDist = dist;
                best = i;
              }
            }
            setSnapIndex(best);
            snapIndexRef.current = best;
            onDragEnd?.({
              dismissed: false,
              dy: g.dy,
              vy: g.vy,
              snapIndex: best,
            });
            settle(best);
            return;
          }

          const shouldDismiss =
            currentY > dismissThreshold || g.vy > dismissVelocity;
          onDragEnd?.({
            dismissed: shouldDismiss,
            dy: g.dy,
            vy: g.vy,
            snapIndex: 0,
          });
          if (shouldDismiss) animateClose();
          else settle(0);
        },
        onPanResponderTerminate: () => settle(snapIndexRef.current),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dragToDismiss,
      sheetHeight,
      closedY,
      restY,
      snaps,
      dismissDistance,
      dismissDistanceMin,
      dismissVelocity,
      overdragResistance,
    ],
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
              fontWeight: t.fontWeights.semibold,
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
