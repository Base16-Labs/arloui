# Motion

> Registry motion tokens for press feedback, state transitions, sheet movement, easing, and restrained springs.

**Type:** Primitive

## Overview

- Default easing is easeOut; easeInOut morphs in place and easeSheet drives drawers.
- Springs (snappy, gentle, heavy) are reserved for gesture-driven or playful elements.
- Pressed feedback combines scale and opacity so touch response feels immediate.

## Rules

- Use duration.instant for tap acknowledgement.
- Use duration.fast / duration.base for toggles, popovers, and sheets.
- Avoid transition-all patterns and never animate from scale(0).

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
