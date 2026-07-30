# Icons

> A filled icon language for navigation, actions, empty states, and controls, exposed as React Native SVG components.

**Type:** Primitive

## Overview

- Icons should help recognition, not decorate the layout.
- Use a consistent 24 px view box and size down visually inside compact controls.
- Icon-only controls need a clear accessible label in app code.

## Rules

- Use icons in buttons when they make the action faster to recognize.
- Keep navigation icons visually equal even when the paths have different density.
- Prefer familiar symbols for search, copy, close, theme, and scan actions.

## Specs

- `viewBox` — 24 · Shared icon grid
- `control` — 16-20 · Inside buttons and inputs
- `nav` — 18-24 · Navigation and tab rows
- `color` — currentColor · Inherit from text role

## Code

```ts
import { Icon } from "@/components/ui/Icon";

<Icon name="magnifying-glass" size={18} />
```

## Related

Color · Tokens · Motion

---
Source: https://arloui.com
