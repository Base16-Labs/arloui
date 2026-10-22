# Decision

> Multiple options, comparison, selection. Picking a plan, choosing a card.

**Type:** Archetype
**Position:** 02 of 9

## Overview

Archetypes are compositional patterns, not components — each describes how
primitives, tokens, and motion wire together to make one shape of screen.

## Hierarchy

- A title that names the choice.
- Two to six options, each a row or a card with a Radio.
- One primary Button that confirms the selected option.

## Primitives

Radio, Card or List.Item, Button.

## Example

```tsx
<Radio selected={plan === 'pro'} onSelect={() => setPlan('pro')} accessibilityLabel="Pro plan" />
```

## Related

Question · Status · Feed · Detail · Creation · Settings · Onboarding · Empty

---
Source: https://arloui.com/docs/archetypes#decision
