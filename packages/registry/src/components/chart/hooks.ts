/**
 * Arlo UI — Chart hooks
 *
 * The behaviours every form shares. They live here rather than in `chart.tsx`
 * because `Chart` imports the other four forms to build its namespace — a form
 * reaching back into `chart.tsx` for a hook would close that loop.
 */
import { useCallback, useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Re-exported, not re-implemented. Reduce Motion is one answer for the whole
 * app and lives in `foundation/reduce-motion`; this keeps the import path the
 * chart files (and anyone who copied them) already use.
 */
export { useReduceMotion } from '../../foundation/reduce-motion';

// Imported as well as re-exported: `useSkeletonPulse` below reads it directly.
import { useReduceMotion } from '../../foundation/reduce-motion';

/**
 * Controlled-or-uncontrolled, one contract for the root's scrub and for `Bar` and
 * `Donut`'s selection. Passing the index hands you the state; leaving it off
 * keeps it inside while the callback still reports every change, so a chart is
 * useful before you have decided where selection lives.
 */
export function useControllableIndex(
  controlled: number | null | undefined,
  defaultValue: number | null = null,
): [number | null, (next: number | null) => void] {
  const [internal, setInternal] = useState<number | null>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const set = useCallback(
    (next: number | null) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value ?? null, set];
}

/**
 * Mirrors the user's Reduce Motion setting.
 *
 * Charts consult this for entrances and for the period morph. They deliberately
 * do **not** consult it for scrub: that is direct manipulation, and a crosshair
 * that stopped following the finger would read as broken rather than as calm.
 */

/**
 * The skeleton pulse every form loads with.
 *
 * One hook rather than a copy per form so all five breathe on the same clock —
 * a StatCard sparkline and the Bar chart under it loading out of phase reads as
 * two unrelated things failing, not as one screen filling in.
 *
 * Charts skeleton rather than spin: the silhouette holds the space the marks
 * will occupy, so nothing reflows when the data lands. Under Reduce Motion the
 * pulse resolves to a flat resting opacity — still visibly "not the data", with
 * no animation.
 */
export function useSkeletonPulse(durationMs: number): Animated.Value | number {
  const reduceMotion = useReduceMotion();
  const [pulse] = useState(() => new Animated.Value(SKELETON_MIN_OPACITY));

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: SKELETON_MAX_OPACITY,
          duration: durationMs,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: SKELETON_MIN_OPACITY,
          duration: durationMs,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion, durationMs]);

  return reduceMotion ? SKELETON_REST_OPACITY : pulse;
}

const SKELETON_MIN_OPACITY = 0.35;
const SKELETON_MAX_OPACITY = 0.75;
/** Reduce Motion resting value — the midpoint, so it reads the same weight. */
const SKELETON_REST_OPACITY = 0.55;
