# Color

> Main palette, secondary palette, and utility semantic colors. Components should use semantic roles, not raw palette values.

**Type:** Primitive

## Overview

- Main palette contains Base, Grey, Primary, Success, Warning, and Error scales.
- Secondary palette contains extended Tailwind-aligned hue scales and alpha ramps.
- Utility semantic colors map those palettes into component-facing light and dark theme roles.

## Rules

- Use paletteMain and paletteSecondary as source material for theme roles.
- Use lightSemanticColors and darkSemanticColors inside components through theme.colors.
- Keep raw brand changes in tokens.ts so copied registry components inherit them automatically.

## Specs

- `paletteSecondary.zinc.950` — #09090B · Dark background
- `paletteMain.primary.600` — #155DFC · Light interactive primary
- `paletteMain.error.500` — #FB2C36 · Error fill and border
- `paletteSecondary.zinc.200` — #E4E4E7 · Neutral UI utility
- `alphaRamp.black.40` — rgba(16,24,40,0.4) · Light overlay
- `lightSemanticColors.surfaceInput` — #F3F4F6 · Input surface
- `darkSemanticColors.surfaceInput` — #18181B · Dark input surface
- `lightSemanticColors.interactivePrimary` — #155DFC · Primary action

## Code

```ts
import { useTheme } from "@/foundation/theme-provider";

const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.surfaceInput }}>
  <Text style={{ color: theme.colors.textPrimary }}>
    Label
  </Text>
</View>
```

## Related

Tokens · Typography · Icons

---
Source: https://arloui.com
