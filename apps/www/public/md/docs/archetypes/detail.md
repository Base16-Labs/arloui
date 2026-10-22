# Detail

> Deep view of a single entity. Profile, transaction receipt, flight info.

**Type:** Archetype
**Position:** 05 of 9

## Overview

Archetypes are compositional patterns, not components — each describes how
primitives, tokens, and motion wire together to make one shape of screen.

## Hierarchy

- A title for the entity, then grouped facts.
- Primary actions sit at the end of the first group, not in a floating bar, unless the screen is a flow.

## Primitives

Card or List, Button.

## Example

```tsx
<Card><Card.Title>Receipt</Card.Title><Card.Subtitle>Today</Card.Subtitle></Card>
```

## Related

Question · Decision · Status · Feed · Creation · Settings · Onboarding · Empty

---
Source: https://arloui.com/docs/archetypes#detail
