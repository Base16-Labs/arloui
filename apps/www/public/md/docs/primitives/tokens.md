# Tokens

> The registry source template for colors, type, spacing, radii, sizing, motion, shadows, and focus rings.

**Type:** Primitive

## Overview

- The consumer-owned copy lives at <alias>/tokens.ts after arloui init.
- The registry source is dependency-free so it works in Expo and bare React Native projects.
- Components read from themes.light and themes.dark through the foundation theme provider.

## Rules

- Edit tokens.ts in the consuming app when a product needs brand changes.
- Keep semantic color names stable so copied components continue to compile.
- Use raw palette values to define semantic roles, not directly inside components.

## Specs

- `radius.sm` — 4 · Inputs, small controls, menu rows
- `radius.md` — 8 · Buttons, repeated cards, compact surfaces
- `motion.duration.instant` — 130ms · Press feedback and micro-interactions
- `motion.pressed.scale` — 0.97 · Default pressed transform
- `spacing.4` — 16 · Common horizontal gutter
- `sizing.buttonHeight.md` — 40 · Default button height
- `shadowBaseColor` — #101828 · Grey-900 tint used by shadows
- `motion.duration.fast` — 200ms · Toggles and small popovers that need to be noticed

## Code

```ts
export const themes = {
  light: {
    colors: lightColors,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    focusRing: focusRing.light,
  },
};
```

## Related

Color · Spacing · Motion

---
Source: https://arloui.com
