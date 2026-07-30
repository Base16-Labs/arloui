# Spacing

> A memorable base-4 scale for visual rhythm, component sizing, and accessible touch ergonomics.

**Type:** Primitive

## Overview

- ArloUI uses a base-4 spacing scale where spacing[4] equals 16 px.
- Keys are the suffix of the Figma token name, so space-4 maps to spacing[4].
- Sizing tokens keep components, icons, avatars, and containers consistent without magic numbers.
- A control may look smaller than 44 pt while hitSlop expands its interactive area.

## Rules

- Use spacing[4] to spacing[5] for common horizontal gutters.
- Use spacing[1] and spacing[2] for icon, label, and compact control gaps.
- Use sizing tokens for fixed component dimensions such as buttons and icons.
- Give every interactive element at least a 44 × 44 pt touch target; prefer 48 × 48 pt for comfortable primary actions.
- Keep enough separation between adjacent touch targets to prevent accidental activation.

## Specs

- `spacing.0` — 0 · No gap
- `spacing.1` — 4 · Small icon gap
- `spacing.2` — 8 · Control inner gap
- `spacing.4` — 16 · Common gutter
- `spacing.6` — 24 · Section rhythm
- `spacing.24` — 96 · Large screen spacing
- `sizing.icon.md` — 24 · Default icon size
- `sizing.buttonHeight.md` — 40 · Default visual button height
- `sizing.touchTarget.minimum` — 44 · Minimum interactive area
- `sizing.touchTarget.comfortable` — 48 · Preferred primary-action area

## Code

```ts
const touchInset =
  (theme.sizing.touchTarget.minimum - theme.sizing.buttonHeight.md) / 2;

<View style={{
  paddingHorizontal: theme.spacing[4],
  gap: theme.spacing[2],
}}>
  <Text>Label</Text>
  <Pressable hitSlop={touchInset}>
    <View style={{ height: theme.sizing.buttonHeight.md }}>
      <Text>Action</Text>
    </View>
  </Pressable>
</View>
```

## Related

Typography · Tokens · Motion

---
Source: https://arloui.com
