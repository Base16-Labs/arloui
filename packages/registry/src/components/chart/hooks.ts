/**
 * Arlo UI — Chart hooks
 *
 * The two behaviours every form shares. They live here rather than in `chart.tsx`
 * because `Chart` imports the other four forms to build its namespace — a form
 * reaching back into `chart.tsx` for a hook would close that loop.
 */
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

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
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => active && setReduceMotion(on));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduceMotion;
}
