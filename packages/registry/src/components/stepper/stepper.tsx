/**
 * Arlo UI — Stepper
 *
 * A numeric control with decrement/increment affordances and a value that rolls
 * between numbers instead of snapping (see `animated-counter.tsx`).
 *
 * It ships in both of the input appearances so it sits flush next to the rest of
 * the form vocabulary:
 *
 *   - `appearance="filled"` — the standard bordered row. Same fill, radius, and
 *     heights as a filled `Input`, so a stepper and a text field stack cleanly.
 *   - `appearance="plain"`  — the large, centered amount display. Same type ramp
 *     as a plain `Input`, for "how many" / "how much" screens where the number is
 *     the whole interface.
 *
 *   <Stepper value={qty} onValueChange={setQty} min={1} max={10} />
 *   <Stepper appearance="plain" value={amount} onValueChange={setAmount}
 *            step={5} format={(v) => `$${v.toLocaleString()}`} />
 *
 * Holding a button repeats the step and accelerates, which is what keeps the
 * control usable for ranges wider than a few taps.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import { AnimatedCounter } from './animated-counter';

type Tokens = ReturnType<typeof useTokens>;

export type StepperSize = 'sm' | 'md';
/** Mirrors `InputAppearance` — a stepper is a numeric input, and reads as one. */
export type StepperAppearance = 'filled' | 'plain';

export type StepperProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: StepperSize;
  appearance?: StepperAppearance;
  disabled?: boolean;
  /** Switches the stepper into its error palette, like `Field`'s `error`. */
  error?: boolean;
  /** Label rendered above the control. */
  label?: string;
  /** Helper or error text rendered below the control. */
  helper?: string;
  /**
   * Formats the value for display. Only digits roll — everything else (currency
   * symbols, separators, units) animates in when it appears.
   */
  format?: (value: number) => string;
  /** Haptic tick on each step. */
  haptics?: boolean;
  /** Hold a button to repeat the step. */
  holdToRepeat?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type StepperDims = {
  minHeight: number;
  paddingX: number;
  font: { fontSize: number; lineHeight: number };
  label: { fontSize: number; lineHeight: number };
  control: number;
  iconSize: number;
  gap: number;
};

/**
 * Dimensions mirror `fieldDims` in `field.tsx` so a stepper and an input of the
 * same size/appearance line up. Keep the two in step when either changes.
 */
function stepperDims(t: Tokens, isPlain: boolean, size: StepperSize): StepperDims {
  if (isPlain) {
    return size === 'md'
      ? {
          minHeight: 35,
          paddingX: 0,
          font: t.typography.displayMedium,
          label: t.typography.bodySm,
          control: 44,
          iconSize: t.sizing.icon.sm,
          gap: t.spacing[5],
        }
      : {
          minHeight: 26,
          paddingX: 0,
          font: t.typography.headingLarge,
          label: t.typography.label,
          control: 36,
          iconSize: t.sizing.icon.xs,
          gap: t.spacing[4],
        };
  }
  return size === 'md'
    ? {
        minHeight: 52,
        paddingX: t.spacing[2],
        font: t.typography.body,
        label: t.typography.bodySm,
        control: 40,
        iconSize: t.sizing.icon.sm,
        gap: t.spacing[2],
      }
    : {
        minHeight: 36,
        paddingX: t.spacing[1],
        font: t.typography.bodySm,
        label: t.typography.label,
        control: 28,
        iconSize: t.sizing.icon.xs,
        gap: t.spacing[1],
      };
}

function MinusIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PlusIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Repeat cadence while a button is held: a beat before the first repeat, then accelerating. */
const HOLD_DELAY = 450;
const HOLD_INTERVAL_MAX = 220;
const HOLD_INTERVAL_MIN = 55;
const HOLD_RAMP = 0.82;

/**
 * Rounds to the step's precision. Floating-point steps otherwise surface as
 * `0.30000000000000004` the moment you add 0.1 three times.
 */
function quantize(value: number, step: number): number {
  const decimals = (String(step).split('.')[1] ?? '').length;
  return decimals > 0 ? Number(value.toFixed(decimals)) : value;
}

export function Stepper({
  value,
  onValueChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  size = 'md',
  appearance = 'filled',
  disabled = false,
  error = false,
  label,
  helper,
  format,
  haptics = true,
  holdToRepeat = true,
  fullWidth,
  accessibilityLabel,
  style,
}: StepperProps) {
  const t = useTokens();
  const isPlain = appearance === 'plain';
  const dims = useMemo(() => stepperDims(t, isPlain, size), [t, isPlain, size]);
  const [reduceMotion, setReduceMotion] = useState(false);

  // A plain stepper hugs its content (it's a centered display); a filled one
  // stretches like a filled field unless told otherwise.
  const stretches = fullWidth ?? !isPlain;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => active && setReduceMotion(enabled));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  /**
   * Steps from an explicit base and reports the new value, or `null` when the step
   * would be a no-op (already clamped). Taking the base as an argument is what lets
   * a held repeat run off its own running total.
   */
  const applyStep = useCallback(
    (direction: 1 | -1, base: number) => {
      const next = quantize(Math.min(max, Math.max(min, base + direction * step)), step);
      if (next === base) return null;
      onValueChange(next);
      if (haptics) void haptic('selection');
      return next;
    },
    [max, min, step, onValueChange, haptics],
  );

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * The running total for an in-flight hold. A repeat can fire several times inside
   * one batch of React updates, so it can't read the prop back between ticks — it
   * would re-step from a stale value and stall after the first tick.
   */
  const holdValue = useRef<number | null>(null);
  /** Set once a hold has actually stepped, so the release's `onPress` doesn't add one more. */
  const didRepeat = useRef(false);

  const stopRepeat = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    holdValue.current = null;
  }, []);

  const startRepeat = useCallback(
    (direction: 1 | -1) => {
      didRepeat.current = false;
      if (!holdToRepeat) return;
      let interval = HOLD_INTERVAL_MAX;
      const tick = () => {
        // The first tick steps from the value as of press-in; later ticks run off the
      // hold's own total.
      const next = applyStep(direction, holdValue.current ?? value);
        if (next == null) {
          stopRepeat();
          return;
        }
        holdValue.current = next;
        didRepeat.current = true;
        interval = Math.max(HOLD_INTERVAL_MIN, interval * HOLD_RAMP);
        timer.current = setTimeout(tick, interval);
      };
      timer.current = setTimeout(tick, HOLD_DELAY);
    },
    [holdToRepeat, applyStep, stopRepeat, value],
  );

  /** Discrete tap. Skipped when a hold already stepped, since `onPress` also fires on release. */
  const handlePress = useCallback(
    (direction: 1 | -1) => {
      if (didRepeat.current) {
        didRepeat.current = false;
        return;
      }
      applyStep(direction, value);
    },
    [applyStep, value],
  );

  useEffect(() => stopRepeat, [stopRepeat]);

  const display = format ? format(value) : String(value);

  const valueColor = error
    ? t.colors.textInteractiveError
    : disabled
      ? t.colors.textDisabled
      : t.colors.textPrimary;

  const counterSpring = useMemo(() => ({ ...t.motion.spring.snappy }), [t.motion.spring.snappy]);

  const control = (
    <View
      // One accessibility element, like UIStepper: assistive tech gets a single
      // adjustable control it can swipe up/down, instead of two unlabelled buttons
      // either side of a number it has to correlate.
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityValue={{ min, max, now: value, text: display }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') applyStep(1, value);
        if (event.nativeEvent.actionName === 'decrement') applyStep(-1, value);
      }}
      style={{
        minHeight: dims.minHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: dims.gap,
        paddingHorizontal: isPlain ? 0 : dims.paddingX,
        borderRadius: isPlain ? 0 : t.radii.md,
        backgroundColor: isPlain ? 'transparent' : t.colors.surfaceInput,
        borderWidth: !isPlain && error ? 1 : 0,
        borderColor: error ? t.colors.borderError : 'transparent',
        alignSelf: stretches ? 'stretch' : 'center',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <StepperButton
        kind="decrement"
        isPlain={isPlain}
        dims={dims}
        enabled={canDecrement}
        error={error}
        onPress={() => handlePress(-1)}
        onHoldStart={() => startRepeat(-1)}
        onHoldEnd={stopRepeat}
      />

      <View
        style={{
          flex: stretches ? 1 : undefined,
          minWidth: isPlain ? undefined : 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatedCounter
          text={display}
          fontSize={dims.font.fontSize}
          lineHeight={dims.font.lineHeight}
          color={valueColor}
          fontFamily={t.fontFamilies.sans}
          fontWeight="600"
          reduceMotion={reduceMotion}
          spring={counterSpring}
          duration={t.motion.duration.fast}
        />
      </View>

      <StepperButton
        kind="increment"
        isPlain={isPlain}
        dims={dims}
        enabled={canIncrement}
        error={error}
        onPress={() => handlePress(1)}
        onHoldStart={() => startRepeat(1)}
        onHoldEnd={stopRepeat}
      />
    </View>
  );

  if (!label && !helper) {
    return <View style={[{ alignSelf: stretches ? 'stretch' : 'center' }, style]}>{control}</View>;
  }

  const helperColor = error
    ? t.colors.textInteractiveError
    : disabled
      ? t.colors.textDisabled
      : t.colors.textSecondary;

  return (
    <View
      style={[
        {
          gap: isPlain ? t.spacing[1] : t.spacing[2],
          alignSelf: stretches ? 'stretch' : 'center',
        },
        style,
      ]}
    >
      {label ? (
        <Text
          style={{
            color: error ? t.colors.textInteractiveError : t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight,
            fontWeight: '600',
            textAlign: isPlain ? 'center' : 'left',
          }}
        >
          {label}
        </Text>
      ) : null}
      {control}
      {helper ? (
        <Text
          style={{
            color: helperColor,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.bodySm.fontSize,
            lineHeight: t.typography.bodySm.lineHeight,
            textAlign: isPlain ? 'center' : 'left',
          }}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

function StepperButton({
  kind,
  isPlain,
  dims,
  enabled,
  error,
  onPress,
  onHoldStart,
  onHoldEnd,
}: {
  kind: 'increment' | 'decrement';
  isPlain: boolean;
  dims: StepperDims;
  enabled: boolean;
  error: boolean;
  onPress: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}) {
  const t = useTokens();
  const isIncrement = kind === 'increment';
  const Icon = isIncrement ? PlusIcon : MinusIcon;

  // Plain steppers get a visible circular affordance because there's no field
  // surface to anchor them; filled steppers sit inside one already.
  const surface = isPlain ? t.colors.surfaceInput : 'transparent';
  const iconColor = !enabled
    ? t.colors.textDisabled
    : error
      ? t.colors.textInteractiveError
      : t.colors.textPrimary;

  const hitSlop = Math.max(0, Math.ceil((t.sizing.touchTarget.minimum - dims.control) / 2));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isIncrement ? 'Increase' : 'Decrease'}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      onPressIn={onHoldStart}
      onPressOut={onHoldEnd}
      hitSlop={hitSlop > 0 ? hitSlop : undefined}
      style={({ pressed }) => ({
        width: dims.control,
        height: dims.control,
        borderRadius: t.radii.full,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: surface,
        opacity: !enabled ? 0.4 : pressed ? t.motion.pressed.opacity : 1,
        transform: [{ scale: pressed && enabled ? t.motion.pressed.scale : 1 }],
        cursor: Platform.OS === 'web' && enabled ? 'pointer' : undefined,
      })}
    >
      <Icon color={iconColor} size={dims.iconSize} />
    </Pressable>
  );
}
