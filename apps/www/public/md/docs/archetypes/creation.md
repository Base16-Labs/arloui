# Creation

> Multi-step form or wizard. Onboarding flow, checkout, compose.

**Type:** Archetype
**Position:** 06 of 9

## Overview

Archetypes are compositional patterns, not components — each describes how
primitives, tokens, and motion wire together to make one shape of screen.

## Hierarchy

- One question per step.
- A field, then a primary Button that advances.
- Back is a ghost Button or the navigation bar, not a second solid.

## Primitives

Input, Button, Stepper when the value is a number.

## Example

```tsx
<Input label="Email" value={email} onChangeText={setEmail} />
```

## Related

Question · Decision · Status · Feed · Detail · Settings · Onboarding · Empty

---
Source: https://arloui.com/docs/archetypes#creation
