# Motion

> Registry motion tokens for press feedback, state transitions, sheet movement, easing, and restrained springs.

**Type:** Primitive

## Overview

- Before reaching for a token, answer two questions: how often does this interaction happen, and what is the animation for? Something a user does a hundred times a day should not animate at all; sheets and modals get standard motion; rare events have the delight budget. If you cannot name the purpose in one word — feedback, spatial consistency, state, explanation — do not build it.
- Default easing is easeOut; easeInOut morphs in place and easeSheet drives drawers.
- Springs (snappy, gentle, heavy) are reserved for gesture-driven or playful elements. If a finger was involved, use a spring: springs carry velocity through an interruption, timing curves restart.
- Pressed feedback combines scale and opacity so touch response feels immediate.
- Transform and opacity are free; width, height, margin, padding, and positioned offsets each trigger a layout pass. Where a value drives both a transform and a colour, split it in two — useNativeDriver is per-animation, not per-property, so one shared value drags the transform onto the JS thread with the colour.

## Rules

- Use duration.instant for tap acknowledgement.
- Use duration.fast / duration.base for toggles, popovers, and sheets.
- Avoid transition-all patterns and never animate from scale(0).
- Read the reduce-motion setting through useReduceMotion — one shared answer, never a probe per component.
- Reduced motion means fewer and gentler, not none: keep the opacity and colour changes that explain state, drop translation, scale, and spring overshoot.
- Judge feel in a release build on the slowest device you support. A simulator and a dev build both lie, in opposite directions.

## Specs

- `duration.instant` — 130 · Press feedback (100–160)
- `duration.fast` — 200 · Toggles, popovers (180–220)
- `duration.base` — 280 · Sheets, modals (220–320)
- `duration.slow` — 400 · Shared-element morphs (320–480)
- `easing.easeOut` — 0.23, 1, 0.32, 1 · Default cubic bezier
- `easing.easeSheet` — 0.32, 0.72, 0, 1 · Sheets and drawers
- `spring.snappy` — 400 / 30 / 1 · Stiffness, damping, mass
- `pressed.scale` — 0.97 · Pressed transform

## Code

```ts
<Pressable style={({ pressed }) => ({
  opacity: pressed ? theme.motion.pressed.opacity : 1,
  transform: [
    { scale: pressed ? theme.motion.pressed.scale : 1 },
  ],
})}>
  <Text>Button</Text>
</Pressable>
```

## Related

Spacing · Tokens · Color

---
Source: https://arloui.com
