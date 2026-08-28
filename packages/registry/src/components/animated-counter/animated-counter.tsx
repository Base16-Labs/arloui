/**
 * Arlo UI — AnimatedCounter
 *
 * A number that rolls rather than snaps. Each digit is its own column of 0–9
 * clipped to one line height; changing the value springs the column to the new
 * digit, so 3 → 4 rolls up and 4 → 3 rolls down. Characters that appear or
 * disappear as the number grows past a place (the extra digit in 99 → 100, the
 * separator in 999 → 1,000) fade and slide in rather than popping.
 *
 * Built on RN's `Animated` only — no Reanimated dependency — so it can be copied
 * into any project. Digits use `tabular-nums` so every column is the same width
 * and the number doesn't jitter as it counts.
 *
 * Rendering is right-aligned: the ones place is anchored and higher places grow
 * leftwards, which is what makes a counter read as a counter.
 */
import { memo, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View, type TextStyle } from 'react-native';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Module-level so the default identity is stable — the roll effect keys off this
 * object, and a fresh one each render would restart the spring mid-flight.
 * Callers passing their own must memoize it for the same reason.
 */
const DEFAULT_SPRING = { stiffness: 300, damping: 30, mass: 1 };

export type AnimatedCounterProps = {
  /** The formatted value to display, e.g. `"1,240.50"` or `"3"`. */
  text: string;
  fontSize: number;
  lineHeight: number;
  color: string;
  fontFamily?: string;
  fontWeight?: TextStyle['fontWeight'];
  /** Skip the roll and snap to the value. Mirror the user's reduce-motion setting. */
  reduceMotion?: boolean;
  /** Spring used for the digit roll. */
  spring?: { stiffness: number; damping: number; mass: number };
  /** Duration for characters entering or leaving as the number changes places. */
  duration?: number;
};

type CharSlot = {
  /**
   * Stable identity keyed by distance from the right, so the ones place stays the
   * ones place across renders and only the new leading places animate in.
   */
  key: string;
  char: string;
};

function toSlots(text: string): CharSlot[] {
  const chars = text.split('');
  return chars.map((char, index) => ({
    key: `p${chars.length - 1 - index}`,
    char,
  }));
}

/** One digit place: a 0–9 column translated so the active digit sits in the window. */
const DigitColumn = memo(function DigitColumn({
  digit,
  lineHeight,
  textStyle,
  reduceMotion,
  spring,
}: {
  digit: number;
  lineHeight: number;
  textStyle: TextStyle;
  reduceMotion: boolean;
  spring: { stiffness: number; damping: number; mass: number };
}) {
  // Lazy `useState` rather than `useRef(new Animated.Value())`: the ref form
  // allocates a throwaway Value on every render, and reading `.current` during
  // render is exactly what the refs lint rule is there to catch.
  const [position] = useState(() => new Animated.Value(digit));

  useEffect(() => {
    if (reduceMotion) {
      position.setValue(digit);
      return;
    }
    const animation = Animated.spring(position, {
      toValue: digit,
      ...spring,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [digit, position, reduceMotion, spring]);

  return (
    <View style={{ height: lineHeight, overflow: 'hidden' }}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: position.interpolate({
                inputRange: [0, 9],
                outputRange: [0, -9 * lineHeight],
              }),
            },
          ],
        }}
      >
        {DIGITS.map((d) => (
          <Text key={d} style={[textStyle, { height: lineHeight }]}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
});

/** A separator, currency symbol, or sign. Fades and slides in when it first appears. */
function StaticChar({
  char,
  lineHeight,
  textStyle,
  reduceMotion,
  duration,
  isNew,
}: {
  char: string;
  lineHeight: number;
  textStyle: TextStyle;
  reduceMotion: boolean;
  duration: number;
  isNew: boolean;
}) {
  const [enter] = useState(() => new Animated.Value(isNew && !reduceMotion ? 0 : 1));

  useEffect(() => {
    if (reduceMotion) {
      enter.setValue(1);
      return;
    }
    const animation = Animated.timing(enter, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [enter, reduceMotion, duration]);

  return (
    <Animated.View
      style={{
        height: lineHeight,
        opacity: enter,
        transform: [
          { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [lineHeight * 0.4, 0] }) },
        ],
      }}
    >
      <Text style={[textStyle, { height: lineHeight }]}>{char}</Text>
    </Animated.View>
  );
}

export function AnimatedCounter({
  text,
  fontSize,
  lineHeight,
  color,
  fontFamily,
  fontWeight = '600',
  reduceMotion = false,
  spring = DEFAULT_SPRING,
  duration = 200,
}: AnimatedCounterProps) {
  const slots = toSlots(text);
  // Track which slot keys existed last render so newly-added places can animate in
  // while the places that were already there stay put.
  const [seen, setSeen] = useState<string[]>(() => slots.map((slot) => slot.key));
  const previous = useRef<string[]>(seen);

  useEffect(() => {
    const keys = slots.map((slot) => slot.key);
    if (keys.join('|') !== previous.current.join('|')) {
      previous.current = keys;
      setSeen(keys);
    }
  }, [slots]);

  const textStyle: TextStyle = {
    color,
    fontFamily,
    fontSize,
    lineHeight,
    fontWeight,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  };

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: lineHeight,
      }}
    >
      {slots.map((slot) => {
        const digit = DIGITS.indexOf(slot.char);
        if (digit >= 0) {
          return (
            <DigitColumn
              key={slot.key}
              digit={digit}
              lineHeight={lineHeight}
              textStyle={textStyle}
              reduceMotion={reduceMotion}
              spring={spring}
            />
          );
        }
        return (
          <StaticChar
            key={slot.key}
            char={slot.char}
            lineHeight={lineHeight}
            textStyle={textStyle}
            reduceMotion={reduceMotion}
            duration={duration}
            isNew={!seen.includes(slot.key)}
          />
        );
      })}
    </View>
  );
}
