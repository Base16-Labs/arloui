# Settings

> Grouped toggles, pickers, navigation rows. App preferences, account.

**Type:** Archetype
**Position:** 07 of 9

## Overview

Archetypes are compositional patterns, not components — each describes how
primitives, tokens, and motion wire together to make one shape of screen.

## Hierarchy

- Groups — a short label, then a List of rows. Separate groups with `spacing[8]`.
- A row is a label, an optional value, and one trailing control.
- Instant settings use Toggle. Choices that need a submit use Checkbox. Navigation rows use a chevron and push a new screen.

## Primitives

List, List.Item, Toggle, and Button for a destructive row at the end of the account group.

## Example

```tsx
<List>
  <List.Item title="Notifications" trailing={<Toggle value={on} onValueChange={setOn} accessibilityLabel="Notifications" />} />
  <List.Item title="Appearance" value="System" onPress={openAppearance} />
</List>
```

## Related

Question · Decision · Status · Feed · Detail · Creation · Onboarding · Empty

---
Source: https://arloui.com/docs/archetypes#settings
