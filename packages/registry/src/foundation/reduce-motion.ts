/**
 * Arlo UI — Reduce Motion
 *
 * The user's "reduce motion" setting, as one answer for the whole app.
 *
 * This is deliberately **not** per-component state. Every animated component
 * used to own a `useState(false)` plus its own async
 * `AccessibilityInfo.isReduceMotionEnabled()` probe and its own listener — ten
 * of them across the registry, all resolving independently. Two consequences,
 * both real:
 *
 *   1. **They can disagree.** The probes settle on their own schedules, so for
 *      a frame or two a sheet can be mid-spring while the toast it pushed in has
 *      already decided to hold still. A setting that governs the whole system
 *      cannot be answered differently in two places at once.
 *   2. **They cost N subscriptions.** One listener per animated component
 *      mounted, each doing the same work to reach the same conclusion.
 *
 * A module-level store with a single subscription cannot do either: every
 * consumer reads the same value in the same render, and motion only changes when
 * the setting does.
 *
 * The OS subscription is intentionally never torn down. It is one listener for
 * the process, and dropping it when the last animated component unmounts would
 * just mean re-probing — and re-deciding mid-animation — the next time one
 * mounts.
 *
 * ## What "reduce motion" means here
 *
 * Fewer and gentler, not none. Opacity and colour changes that explain state
 * stay; translation, scale, and spring overshoot go. A component that renders
 * nothing at all under this setting has removed the explanation along with the
 * movement, which is worse for the person who asked for it.
 *
 *   const reduceMotion = useReduceMotion();
 *   const style = reduceMotion ? { opacity } : { transform: [{ scale }] };
 */
import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

let reduceMotion = false;
let subscribed = false;
const listeners = new Set<() => void>();

function set(next: boolean): void {
  if (next === reduceMotion) return;
  reduceMotion = next;
  for (const listener of listeners) listener();
}

function getSnapshot(): boolean {
  return reduceMotion;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!subscribed) {
    subscribed = true;
    // `?.` because the method is absent on some hosts (web, older RN); the
    // `catch` because a rejected probe must leave motion working, not throw.
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then(set)
      .catch(() => {});
    AccessibilityInfo.addEventListener('reduceMotionChanged', set);
  }
  return () => {
    listeners.delete(listener);
  };
}

/** Whether the user has asked the OS to cut down on motion. */
export function useReduceMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Test seam. Resets the shared answer so a suite can exercise both paths in one
 * process — nothing in an app should call it. The OS subscription is left in
 * place: it is a single process-lifetime listener by design, and re-establishing
 * it per test would only re-probe.
 */
export function __setReduceMotionForTests(value: boolean): void {
  set(value);
}
