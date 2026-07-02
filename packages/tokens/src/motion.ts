/**
 * Arlo UI motion tokens.
 *
 * Motion is spatial information, not decoration. There are no motion "swatches" —
 * the curves and durations below *are* the tokens, applied through recipes.
 *
 * Default ease is `easeOut`. Never use `ease-in` for UI. Springs are reserved for
 * gesture-driven or playful elements. Avoid `transition: all`; never animate from
 * `scale(0)`.
 */

export const motion = {
  /** Cubic-bezier presets. `easeOut` is the default for entrances, exits, and pressable return. */
  easing: {
    easeOut: [0.23, 1, 0.32, 1] as const, // entrances, exits, pressable return
    easeInOut: [0.77, 0, 0.175, 1] as const, // moving or morphing in place
    easeSheet: [0.32, 0.72, 0, 1] as const, // sheet and drawer gestures
  },
  /**
   * Duration tiers (ms). Stay under 300ms for anything repeated each session;
   * exits run ~20% faster than entrances; larger surfaces animate slower.
   */
  duration: {
    instant: 130, // 100–160 — press feedback, micro-interactions
    fast: 200, // 180–220 — tooltips, small popovers, toggles
    base: 280, // 220–320 — sheets, drawers, modals, content swaps
    slow: 400, // 320–480 — shared-element transitions, complex morphs
  },
  /** Reanimated `withSpring` presets — for elements the user physically drags, or playful moments. */
  spring: {
    snappy: { stiffness: 400, damping: 30, mass: 1 }, // pressable snap-back, toggle bounce
    gentle: { stiffness: 150, damping: 20, mass: 1 }, // sheet settle, card reposition
    heavy: { stiffness: 300, damping: 40, mass: 1.2 }, // drag-to-dismiss commit, large surface settle
  },
  /** Press feedback recipe — scale to 0.97 (and/or fade to 0.85) over `duration.instant`. */
  pressed: {
    scale: 0.97,
    opacity: 0.85,
  },
} as const;

export type MotionTokens = typeof motion;
