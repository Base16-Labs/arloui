/**
 * Arlo UI — Chart hooks
 *
 * The behaviours every form shares. They live here rather than in `chart.tsx`
 * because `Chart` imports the other four forms to build its namespace — a form
 * reaching back into `chart.tsx` for a hook would close that loop.
 */
import {
  Children,
  Fragment,
  createContext,
  createElement,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { Animated, Easing } from 'react-native';
import {
  cancelAnimation,
  Easing as WorkletEasing,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

/**
 * Re-exported, not re-implemented. Reduce Motion is one answer for the whole
 * app and lives in `foundation/reduce-motion`; this keeps the import path the
 * chart files (and anyone who copied them) already use.
 */

// Imported as well as re-exported: `useSkeletonPulse` below reads it directly.
import { useReduceMotion as useSystemReduceMotion } from '../../foundation/reduce-motion';
import { useTokens } from '../../foundation/theme-provider';

const MotionEnabled = createContext(true);

/** A local opt-out never overrides the device's accessibility preference. */
export function useReduceMotion(): boolean {
  const system = useSystemReduceMotion();
  const enabled = useContext(MotionEnabled);
  return system || !enabled;
}

export function ChartMotion({
  animated = true,
  children,
}: {
  animated?: boolean;
  children: ReactNode;
}) {
  const parentEnabled = useContext(MotionEnabled);
  return createElement(MotionEnabled.Provider, { value: parentEnabled && animated }, children);
}

const SkeletonExit = createContext<Animated.Value | number>(1);

/**
 * Finish the placeholder exit before starting the chart entrance.
 * Refreshing retains the supplied data; callers should keep their last result.
 * No wrapper view is added, so chart sizing and flex layouts stay unchanged.
 */
export function ChartLoading({
  loading = false,
  refreshing = false,
  children,
}: {
  loading?: boolean;
  refreshing?: boolean;
  children: (loading: boolean) => ReactNode;
}) {
  const reduced = useReduceMotion();
  const t = useTokens();
  const requested = loading && !refreshing;
  const [visible, setVisible] = useState(requested);
  const [opacity] = useState(() => new Animated.Value(1));
  const duration = t.motion.chart.control.duration;
  useEffect(() => {
    opacity.stopAnimation();
    if (requested || reduced || refreshing) {
      opacity.setValue(1);
      setVisible(requested);
      return;
    }
    if (!visible) return;
    let active = true;
    const animation = Animated.timing(opacity, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (active && finished) {
        setVisible(false);
        opacity.setValue(1);
      }
    });
    return () => {
      active = false;
      animation.stop();
    };
  }, [requested, reduced, refreshing, visible, opacity, duration]);
  return createElement(
    SkeletonExit.Provider,
    { value: opacity },
    children(reduced || refreshing ? requested : requested || visible),
  );
}

/** Run once when real, measured data becomes available, not on every selection. */
export function useChartEntrance(ready: boolean): SharedValue<number> {
  const t = useTokens();
  const reduced = useReduceMotion();
  const progress = useSharedValue(reduced ? 1 : 0);
  const recipe = t.motion.chart.enter;
  const [x1, y1, x2, y2] = recipe.easing;
  useEffect(() => {
    cancelAnimation(progress);
    if (reduced || !ready) {
      progress.value = reduced ? 1 : 0;
      return;
    }
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: recipe.duration,
      easing: WorkletEasing.bezier(x1, y1, x2, y2),
    });
    return () => cancelAnimation(progress);
  }, [ready, reduced, progress, recipe.duration, x1, y1, x2, y2]);
  return progress;
}

/** Opacity-only entrances stay off the React render loop. */
export function useChartFade(ready: boolean): Animated.Value | number {
  const t = useTokens();
  const reduced = useReduceMotion();
  const [opacity] = useState(() => new Animated.Value(0));
  const {
    duration,
    easing: [x1, y1, x2, y2],
  } = t.motion.chart.barSwap;
  useEffect(() => {
    opacity.stopAnimation();
    if (reduced || !ready) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0);
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [ready, reduced, opacity, duration, x1, y1, x2, y2]);
  return reduced || !ready ? 1 : opacity;
}

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

/** One restrained opacity pulse; reduced motion uses a static placeholder. */
export function useSkeletonPulse(
  durationMs: number,
  active = true,
): Animated.AnimatedMultiplication<number> | number {
  const exit = useContext(SkeletonExit);
  const reduceMotion = useReduceMotion();
  const [pulse] = useState(() => new Animated.Value(SKELETON_MIN_OPACITY));

  useEffect(() => {
    if (reduceMotion || !active) return;
    pulse.setValue(SKELETON_MIN_OPACITY);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: SKELETON_MAX_OPACITY,
          duration: durationMs * 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: SKELETON_MIN_OPACITY,
          duration: durationMs * 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion, durationMs, active]);

  const opacity = useMemo(() => Animated.multiply(pulse, exit), [pulse, exit]);
  return reduceMotion ? SKELETON_REST_OPACITY : opacity;
}

const SKELETON_MIN_OPACITY = 0.5;
const SKELETON_MAX_OPACITY = 0.65;
/** Reduce Motion resting value — the midpoint, so it reads the same weight. */
const SKELETON_REST_OPACITY = 0.575;

/* ------------------------------------------------------------------------- *
 * Composition
 *
 * Every form takes the same shape of children: parts that render nothing and
 * are read instead. A chart is one SVG plus absolutely positioned overlays, so
 * a part painting itself where it sits in the tree would land in the wrong
 * layer — values under the marks, the zero rule over them. Declaring presence
 * in the tree and centralising the painting keeps the layering and the single
 * pass over the scale, while still letting the call site say what exists.
 *
 * The rule the parts encode: a prop answering "does this element exist?"
 * belongs in the tree; one answering "how does the whole chart behave?"
 * (`density`, `layout`, `tone`, `size`) stays a prop.
 * ------------------------------------------------------------------------- */

/** What a form's children declared: part type → the props each was given. */
export type PartMap = Map<unknown, unknown[]>;

/** Read a form's children into a map. Non-elements and unknown parts are ignored. */
export function collectParts(children: ReactNode): PartMap {
  const found: PartMap = new Map();
  const visit = (nodes: ReactNode) => Children.forEach(nodes, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Fragment) {
      visit((child.props as { children?: ReactNode }).children);
      return;
    }
    const seen = found.get(child.type);
    if (seen) seen.push(child.props);
    else found.set(child.type, [child.props]);
  });
  visit(children);
  return found;
}

/** Was this part named at all? The presence switch. */
export function hasPart(parts: PartMap, type: unknown): boolean {
  return parts.has(type);
}

/** The first of this part, for the ones that appear at most once. */
export function partProps<T>(parts: PartMap, type: unknown): T | undefined {
  return parts.get(type)?.[0] as T | undefined;
}

/** Every one of this part, in tree order — for series, rings, and the like. */
export function allParts<T>(parts: PartMap, type: unknown): T[] {
  return (parts.get(type) ?? []) as T[];
}
