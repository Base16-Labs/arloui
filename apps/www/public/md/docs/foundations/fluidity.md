# Fluidity

> The user should never feel like they teleported. Movement explains where they came from and where they are going.

**Type:** Foundation · Facet 02

Fluidity is not "more animation." It is the rule that every transition should be explainable as movement through a coherent space. Most apps fail this not because they animate too little, but because they animate without intent — a sheet that drops in from nowhere, a button that flashes for no reason a person could name.

Arlo treats motion as a language with four words and a small grammar.

## The four jobs of motion

Every animation must do at least one of these. If none, remove it.

- **Origin** — show where a thing came from. A popover from its trigger; a sheet from its row.
- **State** — make a change in status legible. `Continue` → `Confirm`. Loading → loaded.
- **Feedback** — confirm the system heard the user. Press, drag, dismiss.
- **Continuity** — preserve elements that exist on both sides of a transition.

## Sheets are first-class

Sheets are the primary navigation primitive on mobile. Default to a content-sized detent plus a full-screen detent. Never spring straight to full from a row tap — it teleports the user.

The dim of the parent isn't decoration. Drag the sheet down past 35% of its detent, or release with a velocity above 0.11 px/ms, and it commits to dismiss. Boundaries dampen, never hard-stop.

## The ten Fluidity rules

1. Never animate from scale(0). Start at scale(0.94–0.97) with opacity: 0.
2. Pressables respond instantly — scale to 0.97 within 120 ms.
3. Popovers scale from their origin; modals use center.
4. Shared elements stay shared — one view animating, not a duplicate fading in.
5. Text morphs when meaning changes.
6. Direction is information — tabs slide in the direction of travel.
7. No animation on habitual actions.
8. Gestures own velocity (commit ≥ 0.11 px/ms); boundaries dampen.
9. Transitions, not keyframes, for rapid UI.
10. Reduced motion reduces, not removes — replace position and scale with opacity; keep loaders.

---
Related: Motion, Tokens, Sheet
