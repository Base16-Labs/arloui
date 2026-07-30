# Typography

> A Manrope type system for display, headings, body copy, labels, and button text across Arlo UI.

**Type:** Primitive

## Overview

- The Figma foundation uses Manrope for every interface role.
- Normal styles use 400 weight; emphasized and button styles use 600.
- The registry exposes explicit display, heading, body, label, and button tokens from tokens.ts.

## Rules

- Use display styles for prominent screen-level content.
- Use heading styles to establish hierarchy inside screens and components.
- Use body, label, and button roles according to their intended interface context.

## Specs

- `fontFamilies.sans` — Manrope · All interface typography
- `displayLarge` — 34 / 125% / -2% · Normal and emphasized
- `displayMedium` — 28 / 125% / -2% · Normal and emphasized
- `displaySmall` — 24 / 125% / -2% · Normal and emphasized
- `headingLarge` — 20 / 130% / -1% · Normal and emphasized
- `headingMedium` — 17 / 130% / -1% · Normal and emphasized
- `headingSmall` — 14 / 130% / -1% · Normal and emphasized
- `bodyLarge` — 17 / 140% / 0% · Long-form and supporting copy
- `bodyMedium` — 14 / 140% / 0% · Default body copy
- `bodySmall` — 12 / 140% / 0% · Compact supporting copy
- `labelLarge` — 14 / 120% / 0% · Large interface label
- `labelMedium` — 12 / 120% / 0% · Default interface label
- `labelSmall` — 11 / 120% / 0% · Compact metadata
- `buttonLarge` — 20 / 110% / 0% · Large action label
- `buttonMedium` — 17 / 110% / 0% · Medium action label
- `buttonSmall` — 14 / 110% / 0% · Small action label
- `buttonLabel` — 12 / 110% / 0% · Compact button label

## Code

```ts
const styles = {
  heading: {
    ...theme.typography.headingLargeEmphasized,
    fontFamily: theme.fontFamilies.sans,
    color: theme.colors.textPrimary,
  },
};
```

## Related

Spacing · Tokens · Color

---
Source: https://arloui.com
