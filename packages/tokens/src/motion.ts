/**
 * Arlo UI motion tokens.
 *
 * Default ease is `easeOut`. Restrained springs are allowed for gesture-driven elements.
 * Avoid `transition: all` patterns. Never animate from `scale(0)`.
 */

export const motion = {
  duration: {
    press: 140,
    state: 200,
    sheet: 280,
  },
  easing: {
    easeOut: [0.16, 1, 0.3, 1] as const, // cubic-bezier
    easeInOut: [0.65, 0, 0.35, 1] as const,
  },
  spring: {
    soft: { stiffness: 180, damping: 22, mass: 0.9 },
    snappy: { stiffness: 260, damping: 24, mass: 0.9 },
  },
  pressed: {
    scale: 0.98,
    opacity: 0.92,
  },
} as const;

export type MotionTokens = typeof motion;
