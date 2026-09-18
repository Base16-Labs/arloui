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
 *   <Stepper value={qty} onValueChange={setQty} min={1} />
 *   <Stepper appearance="plain" value={amount} onValueChange={setAmount}
 *            step={5} format={(v) => `$${v.toLocaleString()}`} />
 *
 * `controls` moves the two buttons. The default straddles the value; `'end'` and
 * `'start'` group them at one edge and push the value to the other, giving the
 * quantity-row shape; `'none'` drops them entirely, leaving the number as a
 * readout or a typed field. `allowTyping` makes the value a real numeric text
 * field, for ranges a user shouldn't have to reach by tapping:
 *
 *   <Stepper controls="end" allowTyping value={qty} onValueChange={setQty} />
 *   <Stepper controls="none" value={qty} onValueChange={setQty} />
 *
 * Holding a button repeats the step and accelerates, which is what keeps the
 * control usable for ranges wider than a few taps.
 *
 * The number always rolls between values through `AnimatedCounter` — stepped,
 * typed, blurred, or focused. With `allowTyping` the text field is mounted the
 * whole time for focus and caret handling, but it never paints its own glyphs:
 * the counter draws every state, following the draft as you type so digits roll
 * under the caret.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import { AnimatedCounter } from '../animated-counter/animated-counter';

type Tokens = ReturnType<typeof useTokens>;

export type StepperSize = 'sm' | 'md';
/** Mirrors `InputAppearance` — a stepper is a numeric input, and reads as one. */
export type StepperAppearance = 'filled' | 'plain';
/**
 * Where the two buttons sit.
 *
 * `'split'` straddles the value (the UIStepper arrangement). `'start'` and
 * `'end'` group them together at one edge and push the value to the other, which
 * is the quantity-row shape — value reading as the field's content, controls as
 * its trailing affordance. Grouping is what makes `allowTyping` legible: the
 * value gets a whole edge to itself, so it looks like something you can type in.
 *
 * `'none'` removes both buttons and centres the number on its own. Pair it with
 * `allowTyping` for a keyboard-only amount field, or leave typing off for a
 * read-only readout that still rolls as the value changes underneath it.
 */
export type StepperControls = 'split' | 'start' | 'end' | 'none';

export type StepperProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  step?: number;
  size?: StepperSize;
  appearance?: StepperAppearance;
  /** Where the buttons sit. Defaults to `'split'`, one either side of the value. */
  controls?: StepperControls;
  /**
   * Lets the value be typed as well as stepped. It is a real `TextInput` the whole
   * time, so tapping it focuses it like any other field. The draft commits on blur
   * or submit, floored at `min` and quantized to `step`; an empty or unparseable
   * one reverts. While focused it shows the raw number — `format`
   * output isn't something you can type back in.
   *
   * Named for what it grants rather than `editable`, which on a React Native
   * `TextInput` means "not disabled" — the opposite kind of meaning, and the two
   * would sit side by side in this file.
   */
  allowTyping?: boolean;
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
  step = 1,
  size = 'md',
  appearance = 'filled',
  controls = 'split',
  allowTyping = false,
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
  /**
   * There is no ceiling, so increment is only ever gated by `disabled`. A stepper
   * counts upward without a stated limit; a consumer that needs one enforces it
   * where the value is used, not by having the field rewrite what was typed.
   */
  const canIncrement = !disabled;

  /**
   * Steps from an explicit base and reports the new value, or `null` when the step
   * would be a no-op (already clamped). Taking the base as an argument is what lets
   * a held repeat run off its own running total.
   */
  const applyStep = useCallback(
    (direction: 1 | -1, base: number) => {
      const next = quantize(Math.max(min, base + direction * step), step);
      if (next === base) return null;
      onValueChange(next);
      if (haptics) void haptic('selection');
      return next;
    },
    [min, step, onValueChange, haptics],
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
  /**
   * Which hold the scheduled tick belongs to.
   *
   * `clearTimeout` is not enough on its own: once a tick's callback is queued, the
   * handle is already spent and clearing it does nothing, so the tick still runs and
   * still schedules its successor. Every start and stop bumps this, and a tick that
   * finds it moved on returns without stepping and without rescheduling — which is
   * what actually ends a chain.
   */
  const runId = useRef(0);

  const stopRepeat = useCallback(() => {
    runId.current += 1;
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
      /*
       * Cancel whatever was in flight before starting. Press-in is not guaranteed to
       * be paired with the press-out that preceded it: tapping fast, tapping with two
       * fingers, or going plus-then-minus all deliver a second press-in first. This
       * used to overwrite `timer.current` and orphan the previous chain, which then
       * rescheduled itself forever with nothing holding its handle — the stepper ran
       * away on its own, and every extra tap added another chain driving it.
       */
      stopRepeat();
      const run = runId.current;
      let interval = HOLD_INTERVAL_MAX;
      const tick = () => {
        if (run !== runId.current) return;
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

  /**
   * An editable stepper renders a real `TextInput` the whole time rather than
   * swapping one in on press. Tapping it then focuses a field the way tapping any
   * field does — no custom press target to miss, and nothing to go wrong on a
   * platform where a tap lands on the number instead of the wrapper.
   *
   * `draft` is the raw string so a half-typed "1." survives; the field shows it
   * while focused and the formatted value the rest of the time.
   */
  const inputRef = useRef<TextInput>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  /**
   * Set for one frame on focus to drop the caret at the end of the value, then
   * released so the field owns its own selection again — holding it would fight
   * every tap the user makes to reposition the caret.
   */
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>();

  useEffect(() => {
    if (!selection) return;
    const id = setTimeout(() => setSelection(undefined), 0);
    return () => clearTimeout(id);
  }, [selection]);

  const allowsDecimals = !Number.isInteger(step);
  const allowsNegative = min < 0;

  /** Keeps the field numeric as you type, rather than rejecting it all at commit. */
  const sanitize = useCallback(
    (raw: string) => {
      let next = raw.replace(',', '.').replace(allowsDecimals ? /[^0-9.-]/g : /[^0-9-]/g, '');
      // At most one leading minus, and only when the range actually goes negative.
      const negative = allowsNegative && next.startsWith('-');
      next = next.replace(/-/g, '');
      // At most one decimal point.
      const [whole, ...rest] = next.split('.');
      next = rest.length > 0 ? `${whole}.${rest.join('')}` : (whole ?? '');
      return negative ? `-${next}` : next;
    },
    [allowsDecimals, allowsNegative],
  );

  /** Runs from the field's own `onFocus`, so it must not call `focus()` again. */
  const beginEdit = useCallback(() => {
    if (!allowTyping || disabled) return;
    stopRepeat();
    const raw = String(value);
    setDraft(raw);
    setEditing(true);
    setSelection({ start: raw.length, end: raw.length });
  }, [allowTyping, disabled, stopRepeat, value]);

  /**
   * Commit on blur or submit. An unparseable draft reverts rather than clamping to
   * `min` — clearing the field and tapping away shouldn't silently mean "minimum".
   */
  const commitEdit = useCallback(() => {
    setEditing(false);
    const parsed = Number(draft.trim());
    if (draft.trim() === '' || !Number.isFinite(parsed)) return;
    const next = quantize(Math.max(min, parsed), step);
    if (next !== value) onValueChange(next);
  }, [draft, min, step, value, onValueChange]);

  const display = format ? format(value) : String(value);

  const valueColor = error
    ? t.colors.textInteractiveError
    : disabled
      ? t.colors.textDisabled
      : t.colors.textPrimary;

  const counterSpring = useMemo(() => ({ ...t.motion.spring.snappy }), [t.motion.spring.snappy]);

  /** Caret and selection tint. The accent, so the highlight matches every other field. */
  const caretColor = error ? t.colors.textInteractiveError : t.colors.interactivePrimary;

  const hasControls = controls !== 'none';
  /** Buttons pushed to one edge, so the value takes the other. */
  const grouped = controls === 'start' || controls === 'end';

  const decrementButton = (
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
  );

  const incrementButton = (
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
  );

  // Grouped buttons sit tighter to each other than to the value, so the pair
  // reads as one affordance rather than two things that drifted together.
  const buttonGroup = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: isPlain ? dims.gap : 0 }}>
      {decrementButton}
      {incrementButton}
    </View>
  );

  const textAlign: 'center' | 'left' | 'right' = !grouped
    ? 'center'
    : controls === 'end'
      ? 'left'
      : 'right';

  const valueSlot = (
    <View
      style={{
        flex: stretches ? 1 : undefined,
        minWidth: isPlain && !grouped ? undefined : 0,
        // Split centres the value between its buttons. Grouped pushes it to the
        // opposite edge, where it reads as the field's content.
        alignItems: !grouped ? 'center' : controls === 'end' ? 'flex-start' : 'flex-end',
        justifyContent: 'center',
      }}
    >
      {allowTyping ? (
        /*
         * The counter sits in the layout and the field is stretched over it, rather
         * than the other way round. The counter is the only thing that paints, so
         * it is what should decide how much room the value takes — a field forced
         * to `width: '100%'` here pushes a plain stepper's buttons out to the
         * screen edges, since a plain stepper hugs its content instead of
         * stretching. The field stays mounted underneath so tapping the number
         * focuses a real input rather than a press handler forwarding focus.
         */
        <View
          style={{
            width: stretches ? '100%' : undefined,
            justifyContent: 'center',
            // Shrink the counter to its glyphs and put them where the field's own
            // (invisible) text sits. Left to stretch, the counter right-aligns
            // inside the full width and the caret and selection band land
            // somewhere the number isn't.
            alignItems:
              textAlign === 'center' ? 'center' : textAlign === 'left' ? 'flex-start' : 'flex-end',
          }}
        >
          <AnimatedCounter
            // Follows the draft while typing, so digits roll under the caret as
            // they are entered instead of the counter handing over to plain text.
            text={editing ? draft : display}
            fontSize={dims.font.fontSize}
            lineHeight={dims.font.lineHeight}
            color={valueColor}
            fontFamily={t.fontFamilies.sans}
            fontWeight="600"
            // Typing doesn't roll. The counter anchors its columns to the ones
            // place, so an appended digit shifts every place left: typing "12"
            // rolls the "1" you just entered up to "2" and slides a fresh "1" in
            // beside it. Right for a value that counts, wrong for one you are
            // spelling out. Snapping while focused leaves each keystroke landing
            // where you put it, and the commit on blur still rolls — from the
            // draft to the clamped, quantized, formatted value.
            reduceMotion={reduceMotion || editing}
            spring={counterSpring}
            duration={t.motion.duration.fast}
          />
          <TextInput
            ref={inputRef}
            testID="stepper-value"
            // Focused: the raw number, which is what you can actually type over.
            // Blurred: the formatted value, so `format` still reads as intended.
            value={editing ? draft : display}
            onChangeText={(raw) => {
              setDraft(sanitize(raw));
              setSelection(undefined);
            }}
            onFocus={beginEdit}
            onBlur={() => {
              setSelection(undefined);
              commitEdit();
            }}
            onSubmitEditing={() => inputRef.current?.blur()}
            editable={!disabled}
            // Placed at the end of the value on focus rather than selecting it all:
            // a selection would highlight glyphs the field isn't painting, and the
            // caret would sit at the left of a number you are about to append to.
            selection={selection}
            keyboardType={allowsDecimals ? 'decimal-pad' : 'number-pad'}
            inputMode={allowsDecimals ? 'decimal' : 'numeric'}
            returnKeyType="done"
            accessibilityLabel={accessibilityLabel ?? label ?? 'Value'}
            /*
             * The field's own glyphs never paint — the counter draws every state,
             * typed or stepped. That leaves the caret, which each platform takes
             * from somewhere different, and all three default to the (transparent)
             * text colour if left alone: iOS reads `selectionColor`, Android
             * `cursorColor`, and the web the `caretColor` style.
             *
             * These stay on the accent rather than the ink: `selectionColor` tints
             * the selection highlight as well as the caret, and ink there gives the
             * stepper a dark selection nothing else in the library has.
             */
            selectionColor={caretColor}
            cursorColor={caretColor}
            // `absoluteFill`, not `absoluteFillObject`: RN 0.86 dropped the latter and
            // it fails silently — the lookup is `undefined`, so the invisible input
            // would collapse to zero size and stop taking taps entirely.
            style={[
              StyleSheet.absoluteFill,
              {
                // Clearing the platform's own input padding, not applying a spacing
                // step — the invisible field has to sit exactly over the digits it
                // stands in for.
                paddingVertical: 0, // token-ignore: a reset, not a spacing choice.
                color: 'transparent',
                fontFamily: t.fontFamilies.sans,
                fontSize: dims.font.fontSize,
                lineHeight: dims.font.lineHeight,
                fontWeight: '600',
                textAlign,
                // Matches AnimatedCounter's own figures. Proportional digits here
                // would advance at a different rate to the counter's columns, and
                // the caret and selection band would drift across the number.
                fontVariant: ['tabular-nums'],
                ...(Platform.OS === 'web' ? ({ caretColor } as unknown as TextStyle) : null),
              },
            ]}
          />
        </View>
      ) : (
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
      )}
    </View>
  );

  const control = (
    <View
      // One accessibility element, like UIStepper: assistive tech gets a single
      // adjustable control it can swipe up/down, instead of two unlabelled buttons
      // either side of a number it has to correlate. While typing, the row steps
      // aside so the text input itself is reachable.
      {...(allowTyping
        ? // A typed stepper is a field flanked by two buttons, and it has to be
          // exposed that way: `accessible` on the container collapses the subtree
          // into one element, and a TextInput inside a collapsed subtree never
          // becomes first responder — so tapping it raises no keyboard. The three
          // children are each labelled, so nothing is lost by not merging them.
          { accessible: false }
        : !hasControls
          ? // Nothing to adjust by touch, so it is announced as the readout it is.
            // Exposing increment/decrement actions here would hand assistive tech
            // an affordance no sighted user has.
            {
              accessible: true,
              accessibilityRole: 'text' as const,
              accessibilityLabel: accessibilityLabel ?? label,
              accessibilityValue: { text: display },
              accessibilityState: { disabled },
            }
          : // A read-only stepper stays one adjustable, like UIStepper: assistive tech
            // gets a single control it can swipe up/down instead of two unlabelled
            // buttons either side of a number it has to correlate.
            {
              accessible: true,
              accessibilityRole: 'adjustable' as const,
              accessibilityLabel: accessibilityLabel ?? label,
              accessibilityValue: { min, now: value, text: display },
              accessibilityState: { disabled },
              accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }],
              onAccessibilityAction: (event: { nativeEvent: { actionName: string } }) => {
                if (event.nativeEvent.actionName === 'increment') applyStep(1, value);
                if (event.nativeEvent.actionName === 'decrement') applyStep(-1, value);
              },
            })}
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
      {controls === 'start' ? buttonGroup : null}
      {controls === 'split' ? decrementButton : null}
      {valueSlot}
      {controls === 'split' ? incrementButton : null}
      {controls === 'end' ? buttonGroup : null}
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
        // Disabled reads off the icon's `textDisabled` ink alone. Dimming the
        // whole button on top of it multiplies the two alphas together, and the
        // glyph drops below the point where it's visible at all.
        opacity: pressed && enabled ? t.motion.pressed.opacity : 1,
        transform: [{ scale: pressed && enabled ? t.motion.pressed.scale : 1 }],
        cursor: Platform.OS === 'web' && enabled ? 'pointer' : undefined,
      })}
    >
      <Icon color={iconColor} size={dims.iconSize} />
    </Pressable>
  );
}
