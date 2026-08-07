# Implementation debt

The skill (`SKILL.md` + `references/`) is the source of truth for Arlo UI's design.
The items below are places where the **shipped registry components have drifted from
the skill and should be corrected in code** — they are *not* license to weaken the
spec. Component work is deferred; this file tracks it so the design intent isn't
quietly redefined by whatever the implementation currently does.

> Direction of truth: the skill defines the target, the registry catches up to it.
> When code and skill disagree, fix the code — unless the drift is a deliberate
> design decision, in which case update the skill first, then the code.

## Badge

- Hardcodes font sizes (`11/13.2`, `12/16.8`) that happen to equal `labelSmall` /
  `bodySmall`. Reference `theme.typography` tokens instead so the type scale stays
  single-sourced.
- Offer a mono-label option — `references/components.md` calls for mono on
  status-like labels, and Badge is the status pill.

## Tab bar

- Does not honor the bottom safe-area inset. The skill requires the bar to anchor to
  the safe area (Navigation → Tab Bar). It should accept / apply bottom insets like
  `Sheet` already does.
- No guard on the 3–5 destination rule — consider a dev-time warning past five.

## Skeleton

- Base fill uses `surfaceStrong`; the skill specifies base = `surface-raised`,
  sheen = `surface-strong`.
- The shimmer sheen is a hardcoded `rgba(255,255,255,…)` — move it to a token.

## Toggle

- Knob (`#FFFFFF`) and shadow (`#101828`) are hardcoded. Route them through `theme`
  (surface + shadow tokens) so light/dark and any palette change carry through.

## Numeric / status surfaces

- Components that render changing numbers (Badge status text, `DatePicker` values)
  should adopt `Space Mono` and tabular figures per the typography rules in
  `references/tokens.md`.

## Not drift — intentionally deferred

The primitives listed under **Planned — not yet built** in `SKILL.md` §3.5
(`Stat`, `Row`, `List`, `Stack`, `Divider`, `Toast`, `Empty`, `Header`, …) are design
intent that the registry has not implemented yet. They stay in the skill as the
roadmap; agents compose from shipped primitives until they exist.
