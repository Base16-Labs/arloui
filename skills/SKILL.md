---
name: arloui
description: Use this skill when the user asks for Arlo UI, a premium mobile-first UI kit or reusable component system, or wants help designing and refining Figma, React Native, or SwiftUI mobile interfaces with polished reusable patterns. Use it for mobile screen concepts, component specs, cross-platform translation, and tasteful experimentation. Do not use it for generic web-only UI tasks unless the user explicitly wants Arlo UI principles applied on the web.
version: 0.1.0
---

# Arlo UI

Arlo UI is an AI-first, mobile-first component library by Base16 Labs. Components are copy-paste primitives — like shadcn for mobile — designed to be readable by agents and shippable by humans. Output should feel like an Arlo UI app, not a re-skinned reference.

When invoked, work in this order:
1. Read this file to load the design language.
2. Pull tokens from `references/tokens.md`.
3. Pull primitives and screen recipes from `references/components.md`.
4. Translate to platform with `references/platform-mapping.md`.
5. If a block-level example is requested, consult `references/blocks.md`.

## The Five Facets

Every decision in Arlo UI must trace back to one of these. If a choice serves none of them, remove it.

1. **Craft.** Hierarchy, spacing, alignment, and typography do the heavy lifting. Decoration is a last resort.
2. **Fluidity.** Interactions feel alive because they obey a consistent sense of space, not because they bounce. The app is a single continuous surface.
3. **Opinionated.** Arlo has a point of view. Components ship with strong defaults so the average use is already good. Customization is permitted, abandonment of the system is not.
4. **Detailed.** A component is finished when its rare states — empty, error, long content, slow network, accessibility — are as considered as its happy path.
5. **Extensible.** Components are primitives, not products. They compose into anything from a banking dashboard to a journaling app without being rewritten.

---

## 1. Craft

> "Beauty is leverage." Most users will never name what feels right; they just feel it. Earn that feeling with restraint.

### 1.1 The hierarchy rule

Every screen has exactly three layers of importance. Decide them before you draw anything.

- **Hero** — the one thing the user came for. Oversized, set in display weight, given generous breathing room above and below.
- **Supporting** — context, secondary content, and primary actions. Sits in body sizes, grouped tightly to what it supports.
- **Metadata** — labels, timestamps, system chrome. Smallest, lightest weight, pushed to edges.

Squint test: if more than one element competes for hero, you have not made a hierarchy decision yet. Make one shrink, fade, or move.

### 1.2 Typography is the system

- Two type families maximum per screen. Default to a single neutral sans (system or a tasteful neogrotesque) and reach for a second face only for numerals or eyebrow labels.
- Three sizes per screen: hero, body, caption. Adding a fourth is almost always a spacing problem in disguise.
- Two weights per screen: a regular and one accent (medium or semibold). Bold is loud — earn it.
- Use `tabular-nums` for any number that changes (prices, counters, timers, balances). Aligned digits are non-negotiable in a financial or data view.
- Loosen letter-spacing on uppercase labels (`tracking: 0.04–0.08em`). Tight uppercase reads cramped.
- Use the `…` character, not three dots. Truncation must follow the container.

### 1.3 Spacing carries meaning

Spacing is the primary tool for showing relationships. Reach for a divider only after spacing has failed.

| Spacing | Meaning |
| --- | --- |
| 4–8pt | Belongs together (icon + label, value + unit) |
| 12–16pt | Same group, sibling items |
| 24–32pt | New group |
| 48–80pt | New context (hero → body, section break) |

If you find yourself adding a divider line, the surrounding spacing is probably wrong. Dividers are reserved for structurally identical rows in dense lists.

### 1.4 Color as hierarchy, not decoration

- Default to a calm neutral surface (deep ink in dark mode, warm off-white in light). Both modes are first-class — design them in parallel, not sequentially.
- Three text levels per screen: primary (~95% contrast), secondary (~65%), tertiary (~45%). Resist a fourth.
- One accent per screen. The accent is an event — a primary action, a live status, a selection. If everything is accented, nothing is.
- Encoded data colors (success, warning, danger) are exempt from the one-accent rule, but apply them to the value, not the row.
- Gradients and shadows are rare. When used, they have purpose: a fill on a CTA, a soft elevation on a sheet. Never decorative gradients on cards.

### 1.5 Surface strategy

Reach for the lightest container that works, in this order:

1. Spacing alone.
2. A subtle border (`1px` at low opacity).
3. A grouped surface (background tint; use **`radii.lg`–`radii.xl`** — see `references/tokens.md`).
4. A floating card with elevation.

Never box the hero. Let the most important thing breathe directly on the canvas.

### 1.6 The one expressive move

Per screen, allow exactly one moment of expression: an oversized number, a single bright accent, a custom illustration, a tactile control. The rest of the screen earns its restraint by making that one move powerful.

### 1.7 Composition checklist

Before drawing, answer all six. If any answer is "I don't know," stop and decide.

1. **Archetype** — which named pattern from §1.8 is this screen?
2. **Three layers** — write down the hero, the supporting set, and the metadata.
3. **One accent** — name the single accent color this screen earns.
4. **One expressive move** — name the screen's one moment of expression (or "none" — also valid).
5. **Surface ladder** — at what step on the ladder (§1.5) does this screen sit?
6. **Vertical rhythm** — how many beats top-to-bottom (target 3–5)?

### 1.8 Compositional archetypes

Most mobile screens are one of nine recognizable patterns. Name the pattern before drawing — it sets hierarchy, alignment, and where the CTA lives.

| Archetype | Hero | Composition | Examples |
| --- | --- | --- | --- |
| **Question** | The question itself, set as a display title at top-left | Title → optional helper → single input/selector → CTA pinned bottom | Cash App onboarding, Bump signup steps |
| **Result / Success** | A confirmation glyph + one-line affirmation, vertically centered | Center stack, no chrome | "Welcome to Cash App!", payment-sent toasts |
| **Stat / Hero number** | An oversized number with a one-line label | Top-aligned or centered hero, supporting list below, optional CTA | Cash App "$0.00" Pools, Flighty "13 MIN" delay, Bump "0530" |
| **List** | The first row | Inset-grouped (iOS) or edge-to-edge (Android), 44pt min row, optional sticky search/header | Family token list, Cash App offers, Bump friends |
| **Detail** | The named subject (avatar + name, hero card, or hero number) | Hero block → action row → metadata → secondary content | Family wallet detail, Luma event detail |
| **Sheet over content** | The sheet's title | Translucent or opaque sheet at a natural detent over a dimmed parent | Flighty "Add Flight", Luma event sheet over gradient |
| **Composer** | The empty input | Input expands to fill, tools dock to bottom edge, send is the one accent | Perplexity ask box, Family chat, Luma blast |
| **Paywall** | One value claim + one price | Hero claim → 3–4 supporting bullets → primary CTA → tertiary "maybe later" | Flighty Pro upsell |
| **Dashboard** | Asymmetric — the most actionable card sits top-left | Top: status. Middle: 2–4 modules. Bottom: tab bar. **Never centered.** | Cash App Money, Family wallets |

For each archetype, the hero/supporting/metadata layers from §1.1 are pre-decided. Use them.

### 1.9 Anti-patterns

Refuse these unless the user explicitly asks for them:

- Centered hero stacks on **data-rich dashboards**. Asymmetry reads as confidence when there's lots to show. (Centered composition is correct for single-decision screens, onboarding questions, success/result, and paywalls — see Archetypes, §1.8.)
- Decorative blur, parallax, or floating ornaments.
- Generic SaaS-mobile layouts: stacked CTAs over a hero illustration, oversized feature cards, web-style nav adapted to mobile.
- Filled multi-color icons or emoji used as UI elements.
- Skeleton screens longer than 1s — prefer instant content with progressive detail. (See §4.1 for the loading rule.)
- Border radius that fights the platform: phones are rounded — match them. Use **`radii.full`** for pills and primary buttons; **`radii.lg`–`radii.xl`** for cards and fields; **`radii['2xl']`** for sheets (canonical px in `references/tokens.md`).
- Cartoon mascots and decorative stock art. A *single* purposeful illustration in an empty state, hero, or paywall is welcome — it is the screen's one expressive move (§1.6).

---

## 2. Fluidity

> The user should never feel like they teleported. Movement explains where they came from and where they are going.

Fluidity is not "more animation." It is the rule that every transition should be explainable as movement through a coherent space.

### 2.1 The four jobs of motion

Every animation must do at least one of these. If none, remove it.

1. **Origin** — show where a thing came from (popover from its trigger, sheet from its row).
2. **State** — make a change in status legible (loading → loaded, idle → active, "Continue" → "Confirm").
3. **Feedback** — confirm the system heard the user (press, drag, dismiss).
4. **Continuity** — preserve elements that exist on both sides of a transition (shared cards, shared text, shared icons).

### 2.2 Easing

Never use `ease-in` for UI. Use stronger curves than the CSS defaults.

```css
--arlo-ease-out:    cubic-bezier(0.23, 1,    0.32, 1);
--arlo-ease-in-out: cubic-bezier(0.77, 0,    0.175, 1);
--arlo-ease-sheet:  cubic-bezier(0.32, 0.72, 0,    1); /* iOS drawer */
```

Picking a curve:

- Entering or exiting → `ease-out`
- Moving / morphing on screen → `ease-in-out`
- Hover or color change → `ease`
- Constant motion → `linear`
- Sheet/drawer drag → `ease-sheet`
- Default → `ease-out`


### 2.3 Duration

| Element | Duration |
| --- | --- |
| Press feedback, micro-interactions | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects, chips | 150–250ms |
| Sheets, drawers, modals | 220–360ms |
| Shared-element transitions | 320–480ms |
| Marketing / explanatory | unrestricted |

Rules: stay under 300ms for any frequent interaction. Exits are ~20% faster than entrances. Larger surfaces animate slower than smaller ones.

### 2.4 The Fluidity rules

These are non-negotiable. They are how Arlo apps feel like Arlo apps.

1. **Never animate from `scale(0)`.** Nothing in the real world appears from nothing. Start at `scale(0.94–0.97)` with `opacity: 0`.
2. **Pressables respond instantly.** Every tappable element scales to `0.97` and/or drops opacity to `0.85` on press, with a 120ms ease-out return. No exceptions, including list rows.
3. **Popovers, menus, and sheets scale from their origin.** Set `transform-origin` to the trigger. Modals — which have no trigger — keep `center`.
4. **Shared elements stay shared.** A card that exists on both screens of a transition must be the same view animating between positions, not a duplicate fading in. Use SwiftUI `matchedGeometryEffect` or React Native shared element transitions (Reanimated).
5. **Text morphs when it changes meaning.** "Continue" → "Confirm", "1 wallet" → "2 wallets", "Sending…" → "Sent". Crossfade shared characters when possible; otherwise crossfade the whole word with `2px` blur to mask the swap.
6. **Direction is information.** Tabs slide in the direction of travel. Back navigation reverses forward navigation. Breaking this is a bug.
7. **No animation on habitual actions.** Keyboard shortcuts, segmented control switches, tab toggles used dozens of times per session — instant. The Raycast principle.
8. **Gestures own velocity.** Swipe-to-dismiss commits on velocity (≥0.11 px/ms), not just distance. Boundaries dampen, never hard-stop. A drawer dragged past its top should resist with diminishing returns.
9. **Use transitions, not keyframes, for anything rapid.** Toasts, pressable states, list item enter/exit — transitions retarget mid-flight, keyframes restart from zero.
10. **`prefers-reduced-motion` reduces, not removes.** Replace position and scale changes with opacity. Keep state-clarifying motion (loaders, progress).

### 2.5 The fidget rule

For the one or two interactions a user performs most (the checkbox in a habit app, the send button in a wallet, the like button in a feed), invest disproportionately in feel. Combine animation, haptic, and (where appropriate) sound. Industrial designers call this "fidgetability" — Arlo UI calls it "earning the tap."

A pattern:
- Press: `scale(0.97)`, 120ms ease-out, light haptic on touch-down.
- Hold: progressive fill or charge animation, medium haptic at threshold.
- Release: snap-back at 200ms ease-out, success haptic + state morph.
- The same pattern at lower intensity is fine for everyday actions.

### 2.6 Sheets are first-class

Sheets are the primary navigation primitive on mobile in 2026. Every Arlo app should use them well.

- **Detents.** Default to a content-sized detent + full-screen detent. Never spring straight to full from a row tap.
- **Scrim.** Dim the parent to `40–55%` black under any sheet that takes focus. Translucent sheets over photographic content (maps, gradients, hero imagery) skip the scrim and rely on the sheet's own opacity (`80–92%`) plus a 12–24px backdrop blur.
- **Radius.** Top corners `24–32pt`, bottom flush. The radius reads as "the canvas folded back."
- **Drag.** Drag-to-dismiss commits on velocity (≥0.11 px/ms) or distance (≥35% of detent height). Resist past the top with diminishing returns.
- **Stacking.** Stacked sheets push the parent sheet back with a `0.94` scale and a dim layer on top of it — the same treatment a sheet uses on the root.
- **Transition origin.** Sheets enter from below with `--arlo-ease-sheet` over 280–360ms. Exits run ~20% faster.
- **Peek.** A sheet at its smallest detent should be tall enough that the title and primary action are visible without dragging.

### 2.7 Anti-patterns

- Decorative spring bounces on professional surfaces. Bounce belongs in playful contexts (drag-to-dismiss, success celebrations), not in dropdowns.
- Crossfading two visually distinct components without origin or shared elements. If the eye sees two objects, the transition has failed. Mask it with subtle blur (≤20px) only as a last resort.
- Animating CSS `width`, `height`, `padding`, `margin`. Use `transform` and `opacity` only — they skip layout and paint.
- Re-mounting an element that already exists on both screens. Carry it over.

---

## 3. Opinionated

> Arlo UI ships with a point of view. The defaults are the design.

### 3.1 Strong defaults

A component handed to a developer with no configuration must already be production-quality. Configuration is for variants, not for fixing the default.

- Buttons default to a filled primary, full-width on mobile, with platform-correct height (`52pt` iOS, `56dp` Android), pressable feedback built in, and `prefers-reduced-motion` handled.
- Inputs reserve the label, hint, and error slot at mount — switching states never causes layout shift. Three label patterns are first-class: **floating** (label rides into the input on focus), **stacked** (label sits above the field, fixed), **inline-grouped** (label on the left of the row, value on the right — typical inside grouped lists). Pick by archetype: floating for forms, stacked for question screens, inline-grouped for settings and review screens.
- Lists default to inset-grouped on iOS, edge-to-edge on Android, with a 44pt minimum row height.
- Sheets default to detents at the natural content height, then full. Never spring to full from nothing.

### 3.2 Density and pacing

Arlo prefers calm, content-forward density. A screen reads top-to-bottom in three to five "beats" — not seven. If a screen has more, split it.

### 3.3 Brand affordances

Arlo is mode-agnostic but tonally consistent: confident, quiet, technical. **Neither mode is the default — the brand picks.** Most consumer-grade Arlo apps will land on a warm off-white canvas; data-dense and "premium" verticals (flight, finance pro, AI) often land in dark. Whichever mode is chosen, the *other* mode must be engineered, not derived: design both in parallel, and run the hierarchy and contrast test against each. A dark mode that is "the light mode with inverted colors" is a bug.

### 3.4 The Sonner principles (applied)

Components Arlo ships should feel as inevitable as Sonner felt for toasts:

- **Trivial to adopt.** One import, one provider at most. No context gymnastics.
- **Defaults are beautiful.** Most users never customize. Make sure they don't need to.
- **Edge cases handled invisibly.** Hidden tabs pause timers. Stacked items fill gaps to maintain hover. The user never sees the seams.
- **Naming creates identity.** Component names are short, memorable, and not generic. `Tray`, `Sheet`, `Stack`, `Note`, `Stat`, not `BottomDrawerContainerV2`.

### 3.5 Primitive vocabulary

Arlo primitives have stable names. An agent reading this list should recognize what already exists before inventing a new component. (Full specs live in `references/components.md`.)

- **Layout & surface:** `Stack`, `Group`, `Card`, `Sheet`, `Tray`, `Scrim`, `SafeArea`.
- **Type & content:** `Title`, `Body`, `Caption`, `Stat` (hero number + label), `Note` (inline helper or callout), `Eyebrow`.
- **Controls:** `Button`, `Pill` (chip-shaped action), `Chip` (filter/segment), `Tab`, `Toggle`, `Stepper`, `Slider`, `Field` (input with label/hint/error slots), `Select`, `Picker`.
- **Lists & rows:** `List` (inset-grouped or edge-to-edge), `Row` (44pt min, lead/value/accessory slots), `Divider` (only inside dense lists).
- **Feedback:** `Toast`, `Banner`, `Spinner`, `Progress`, `Empty` (illustration + line + action), `Loader` (skeleton variant).
- **Navigation:** `Nav` (bottom tab bar), `Header` (large title or compact), `Breadcrumb`.

A component with more than five props is probably two components (§5.1). A new primitive needs justification — propose first, then build.

---

## 4. Detailed

> Polish is total, not local. A great hero with an unconsidered empty state is not a great component.

### 4.1 The state checklist

Every component must answer all of these before it ships:

- **Default** — the most common state, fully populated.
- **Empty** — no content yet. Includes a one-line explanation and a single primary action.
- **Loading** — instant skeleton or shimmer if expected to resolve in <1s; explicit indicator otherwise.
- **Error** — recoverable error with a clear next step. Never "Something went wrong" alone.
- **Disabled** — visually distinct, not just dimmed. `opacity: 0.4` is lazy; reduce contrast, remove affordance, optionally add explanatory hint.
- **Long content** — what happens at 3 lines, 30 lines, 300 lines? Truncation, scrolling, and pagination are design decisions, not engineering ones.
- **Pressed / focused / selected** — visible feedback within 16ms of touch.
- **Reduced motion** — verified.
- **RTL** — directional icons mirrored, layout flipped, motion direction reversed.
- **Dynamic type** — scales to the user's system size at least up to AX1; layout adapts without truncation at body+2.
- **Dark + Light** — both modes, neither derived.

### 4.2 Hit targets and tolerance

- Every interactive element has a minimum hit area of 44×44pt. If the visual is smaller, expand the hit area invisibly with padding or a pseudo-target.
- Sibling tap targets need ≥8pt of separation. Adjacent destructive actions need ≥16pt or a confirmation step.
- Accept fat-finger forgiveness: a swipe within 4° of horizontal is horizontal.

### 4.3 Numbers and copy

- Currency, counts, and timers: `tabular-nums`, with the unit as tertiary, never larger than the value.
- Abbreviate at thresholds, not arbitrarily: `999` then `1.2K`, `1M`, `1.2B`. Never `1,247`. Never `1.247K`.
- Never animate a counter from 0 unless the number is the hero of the screen and the animation under 600ms.
- Empty-state recipe: one purposeful illustration or icon (the screen's expressive move per §1.6), one short line of copy explaining what goes here, one primary action. Never a paragraph. Never a cartoon mascot. Never decorative stock art.

### 4.4 Sound and haptics

Sound is opt-in; haptics are default-on for tactile actions. Haptics map to meaning:

- Light — selection, scrubbing past a tick.
- Medium — primary press, threshold reached.
- Heavy — commit, send, delete confirm.
- Success / Warning / Error — only at moments matching the system meaning.

Never haptic on scroll, hover, or layout settle.

---

## 5. Extensible

> Arlo is primitives, not products. Any vertical — finance, AI, health, commerce, social, productivity — should compose cleanly.

### 5.1 Composition over configuration

A component with more than five props is probably two components. Prefer:

```tsx
<Card>
  <Card.Header />
  <Card.Body />
  <Card.Footer />
</Card>
```
over

```tsx
<Card
  title="…"
  subtitle="…"
  image="…"
  badge="…"
  cta="…"
  footer="…"
/>
```

Slots are tokens for layout: they let consumers extend without the library forecasting every use.

### 5.2 Tokens, not hardcoded values

Every spacing, radius, color, motion, and typography value referenced by a component must come from `references/tokens.md`. No magic numbers. A consumer who reskins the tokens reskins the entire library.

### 5.3 Platform fidelity

Behavior is portable; pixels are not. When translating across platforms, preserve hierarchy, motion intent, and interaction model — not exact dimensions.

- iOS: native sheet behavior, list density, large title, haptics.
- Android: edge-to-edge, predictive back, ripple, material density only where it does not fight the brand.
- React Native: prefer `Pressable`, `View`, `Text`, `FlatList`, and `Reanimated`. Reach for additional libraries only when the user has them installed.
- SwiftUI: small `View` structs, token-backed view modifiers, `matchedGeometryEffect` for shared elements.

See `references/platform-mapping.md` for specifics.

### 5.4 Variants are part of the contract

A component without documented variants is incomplete. Each primitive in `references/components.md` lists, at minimum:

- Sizes (sm / md / lg, with pixel values).
- Tones (neutral / accent / destructive, where applicable).
- States (default, pressed, focused, disabled, loading, error).
- Density (comfortable, compact).

### 5.5 The escape hatch

Every component exposes a `style` / `className` / modifier slot that overrides cleanly without `!important`. Extension is a feature, not a workaround.

---

## Workflow

When the user asks for an Arlo UI screen, component, or block:

1. **Pick the archetype.** From §1.8 — Question, Result, Stat, List, Detail, Sheet-over-content, Composer, Paywall, Dashboard. Name it before you draw it.
2. **Run the Composition checklist.** All six items in §1.7.
3. **Pull tokens.** From `references/tokens.md`. No hardcoded values.
4. **Pick or compose primitives.** From the §3.5 vocabulary and `references/components.md`. If a primitive does not exist, propose it before inventing a one-off.
5. **Apply Fluidity.** Walk through the four jobs of motion (§2.1) and the ten Fluidity rules (§2.4). Cite which apply.
6. **Run the State checklist.** All eleven items in §4.1.
7. **Translate to platform.** Per `references/platform-mapping.md`.
8. **If exploring, generate three named directions** before committing to one. Naming forces opinion.


## Review mode

When polishing existing UI, return a markdown table with `Area | Status | Before | After | Why`, where Status is one of `Keep`, `Improve`, `Fix`. Always lead with at least one `Keep` row — anchor in what is already strong.

## Reference files
- `references/tokens.md` — type, color, spacing, radius, motion curves, haptic mapping.
- `references/components.md` — primitives, variants, states, screen recipes.
- `references/platform-mapping.md` — Figma, SwiftUI, React Native conventions.
- `references/blocks.md` — full-screen and full-flow examples (onboarding, paywall, dashboards, composers).
- `references/troubleshooting.md` — common pitfalls and fixes (added as the system grows).
