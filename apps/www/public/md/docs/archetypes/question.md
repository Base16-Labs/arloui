# Question

> A title, a body, one or two actions. Confirmation, permission, single-input.

**Type:** Archetype
**Position:** 01 of 9

## Overview

Archetypes are compositional patterns, not components — each describes how
primitives, tokens, and motion wire together to make one shape of screen.

## Hierarchy

- Title — `typography.headingMediumEmphasized`, `textPrimary`.
- Body — `typography.bodyMedium`, `textSecondary`. One or two sentences.
- Actions — one primary solid Button, and a ghost or soft Button when there is a second choice.

## Primitives

Button, Text styled from the type scale, and `spacing[6]` around the stack with `spacing[3]` between the lines.

## Example

```tsx
const t = useTokens();

<View style={{ padding: t.spacing[6], gap: t.spacing[3] }}>
  <Text style={[t.typography.headingMediumEmphasized, { color: t.colors.textPrimary, fontFamily: t.fontFamilies.sans }]}>
    Confirm payment?
  </Text>
  <Text style={[t.typography.bodyMedium, { color: t.colors.textSecondary, fontFamily: t.fontFamilies.sans }]}>
    $12.00 will be charged to your card.
  </Text>
  <Button onPress={onConfirm}>Confirm</Button>
  <Button appearance="ghost" onPress={onCancel}>Cancel</Button>
</View>
```

## Related

Decision · Status · Feed · Detail · Creation · Settings · Onboarding · Empty

---
Source: https://arloui.com/docs/archetypes#question
