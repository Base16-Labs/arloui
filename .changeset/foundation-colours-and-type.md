---
'@arloui/tokens': minor
---

Fix three foundational token issues so code matches the Figma library.

- **Dark info backgrounds were invisible.** `primary[950]` duplicated `grey[950]` (`#09090B`), so `feedbackInfoBg` in dark mode was the page background. It is now Blue 950, `#162456`.
- **Inputs disappeared on cards.** `surfaceCard` and `surfaceInput` were identical in both modes. Two half-step primitives are added, `grey[150]` (`#ECEEF1`) and `zinc[925]` (`#111113`), and `surfaceCard` maps to them, so an input always reads a half step lighter than the card it sits on. `surfaceInput` and `surfaceElevated` are unchanged.
- **Type scale gains its Medium step.** `display*`, `heading*` and `label*` (the non-emphasized styles) move from weight 400 to 500, matching the Figma text styles. Body, button and emphasized styles are unchanged.
- **Dark secondary fill is solid.** `interactiveSecondary` in dark mode is now solid Zinc 800 (`#27272A`) instead of Zinc 800 at 70%, matching the Figma library.
