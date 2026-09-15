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
  /**
   * Chart recipes. A chart animates two different things and they are not on the
   * same clock, so the split is a token rather than a number chosen per component.
   *
   * `control` is the period pill answering a tap — that is press feedback, so it
   * lands on the press tier. `data` is the series itself re-shaping under a period
   * change: a morph in place, so `easeInOut` on `base`. `enter` is a plot drawing
   * itself for the first time.
   *
   * Two rules are written into these values rather than left to memory:
   *
   * - **Bars never scale.** A bar's height *is* its datum, so growing one from
   *   zero animates the number rather than the mark. This is the documented
   *   exception to Rule 02 — bars cross-fade and re-anchor, they do not sweep up.
   *   `barSwap` is that cross-fade.
   * - **Scrub has no duration.** It is direct manipulation: the crosshair is under
   *   the finger at 1:1 or it is broken. Nothing here applies to it, and Reduce
   *   Motion does not touch it either — removing motion from a gesture the user is
   *   physically driving would make the chart feel dead, not calmer.
   */
  chart: {
    /** Period control answering a tap. Instant, then a spring settle. */
    control: { duration: 130, spring: { stiffness: 400, damping: 30, mass: 1 } },
    /** Series morphing between periods: resample to equal length, then interpolate. */
    data: { duration: 280, easing: [0.4, 0, 0.2, 1] as const },
    /** First paint of a plot: the path draws in rather than popping. */
    enter: { duration: 400, easing: [0.33, 1, 0.68, 1] as const },
    /** Bars re-anchoring on a data change. A cross-fade — never a height sweep. */
    barSwap: { duration: 200, easing: [0.23, 1, 0.32, 1] as const },
  },
} as const;

export type MotionTokens = typeof motion;
