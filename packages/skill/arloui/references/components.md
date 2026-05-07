# Arlo UI Components

Use these patterns as the system baseline. They should be easy to express in Figma, React Native, and SwiftUI without depending on a large external component library.

## Core Primitives

### App Header

- Left side: screen title, context label, or profile.
- Right side: 1-2 utility actions maximum.
- Allow a hero title only when the first content block is visually lighter.

### Button Family

Registry **`Button`** uses **`tone`** (`primary` | `neutral` | `danger`) × **`appearance`** (`solid` | `soft` | `ghost` | `outline`), sizes **`sm`–`xl`**, optional **`leadingIcon`** / **`trailingIcon`**, **`iconOnly`** (circle), and **`loading`**. Legacy **`variant`** (`primary` | `secondary` | `ghost` | `danger`) still maps to tone + appearance.

**`SocialAuthButton`** — pill OAuth rows for **`facebook`** | **`x`** with **`appearance`**: `brandSolid`, `brandSoft`, `brandOutline`, `neutralSolid`, `neutralOutline`. Default leading marks are minimal Text glyphs; use **`renderLeading`** for official SVGs.

**`FabButton`** — circular FAB (`tone`: `primary` | `neutral`), diameter follows **`sizing.buttonHeight`**. Rest uses **`shadows.sm`**; pressed darkens the semantic fill; disabled opacity ~28%; on web, focus uses **`outline`** + offset and **`focusRingMain`**. **`accessibilityLabel`** is required.

Solid fills use rounded corners + pressed elevation; ghost & outline use pill radius (`radii.full`). See `references/tokens.md` for heights (`sizing.buttonHeight`).

### Text Field and Search

- Use quiet borders, strong cursor color, and generous vertical padding.
- Leading icons are fine when they clarify purpose; trailing clutter is not.
- Composer-style fields can stretch taller than standard inputs, but still need a clear resting state.

### Chips and Pills

- Best for filters, model selectors, tags, and small states.
- Mono labels work well for status-like information.
- A chip should read clearly with or without its icon.

### Segmented Control

- Keep labels short and obvious.
- Use strong container contrast and subtle selection motion.
- Best for toggling between comparable views, not unrelated destinations.

### Sheet and Bottom Action Bar

- Use sheets for secondary tasks, settings, or confirmation detail.
- Use bottom action bars for high-commitment actions that should stay thumb-reachable.

## Data-Rich Patterns

### Metric Hero

- Large value, compact descriptor, small delta or context label.
- Use for account summaries, fitness progress, delivery status, portfolio value, or any high-signal top-line number.
- Keep supporting text tight so the number owns the screen.

### Metric or Entity Row

- Left: entity label and supporting context.
- Right: latest value, state, or delta.
- Optional center or trailing sparkline only if it stays secondary to the number.

### Activity Row

- Event or item name first, then time or category, then the most important trailing value.
- Use color on the trailing value sparingly; typography should still do most of the work.

### Summary Card

- Good for grouped stats, account identity, profile summaries, or primary entry points.
- Avoid over-decorating; the card should feel like an instrument, not a poster.

### Goal or Progress Module

- Use segmented progress, stepped rings, or stacked bars only when the label and value remain obvious.
- Never let the visual hide the numeric truth.

## Assistant and Workflow Patterns

### Assistant Composer

- Expanding text area, attach action, optional voice action, send action.
- Must feel calm at rest and capable when active.
- Use one accent moment only: cursor, send button, or selected mode.

### Message Cluster

- Group adjacent messages to reduce visual noise.
- Differentiate user and assistant with spacing, fill, or alignment before adding extra chrome.

### Prompt Suggestion Card

- One clear prompt seed, one short explanation, one obvious tap target.
- Good for empty states and onboarding.

### Tool Run Row

- Show the tool name, status, and result summary.
- Keep the row readable even when there are several consecutive tool runs.

### Result Card

- Use for generated summaries, extracted data, or workflow outputs.
- Prefer structured sections over large unbroken paragraphs.

## Navigation

### Tab Bar

- 3–5 destinations maximum. More than five requires a different navigation model.
- Icons are primary; labels are secondary but should always be present for clarity.
- Active tab uses `--accent` or `--text-primary`; inactive tabs use `--text-tertiary`.
- Keep the bar anchored to the safe area bottom — never overlap content.
- Avoid badge-heavy tabs; one notification count is fine, multiple is noise.

## State Patterns

### Skeleton / Loading State

- Match the shape and scale of the real content as closely as possible.
- Use `--surface-raised` as the base fill and `--surface-strong` as the shimmer layer.
- Animate with a horizontal shimmer sweep (`180-280ms`, ease-in-out, looped) or a gentle opacity pulse.
- Do not skeleton-load interactive controls — disable or hide them instead.
- Show skeleton for the first data load; use inline spinners or optimistic updates for subsequent refreshes.

### Empty State

- One concise headline, one short supporting sentence, one optional CTA.
- Illustration or icon is acceptable but must not overpower the copy.
- Place the CTA where the first item in the list would appear — make the empty zone feel intentional.
- For filtered views, surface a clear "clear filters" action alongside the empty state.

### Error State

- Distinguish network errors, permission errors, and empty-result errors visually and in copy.
- Use `--danger` for critical errors; neutral surfaces for soft or recoverable states.
- Always offer a recovery action (retry, go back, contact support). Never dead-end the user.
- Inline field errors live below the field and use `--danger` text at `body-sm` scale.

### Toast / Snackbar

- Appear from the bottom edge, above the tab bar or safe area.
- Maximum one active toast at a time; queue additional messages.
- Auto-dismiss after `3–4s` for confirmations; persist until dismissed for errors.
- Keep copy under two lines. If more context is needed, use a sheet instead.
- Avoid using toasts for actions the user just took and can clearly see — they create noise.

## Shared Utilities

### Status Pill

- Tiny but high-signal. Good for `Live`, `Syncing`, `Profitable`, `Needs Review`, `Draft`.
- Works best with mono labels or compact icon-plus-label combos.

### Inline Metric Capsule

- Compact value with context label for dense dashboards or tool outputs.
- Use when a full card would waste space.

### Chart Strip

- Reserve for trend confirmation, not detailed analysis.
- Pair every chart with a visible value and timeframe selector.

## Screen Structures

### Summary Home

- App header with profile, context switch, or utility actions.
- Hero metric or top-level summary.
- Quick actions row.
- Key entities, collections, or categories.
- Recent activity, recommendations, or insights.

Use when the product needs a strong first-glance overview.

### Detail and Activity

- Detail header with title, context, and view controls.
- Hero value, state, or status summary.
- Primary visual, media, or chart area.
- Key metrics grid or capsules.
- Related updates, logs, items, or activity list.
- Persistent bottom action bar when the main task needs it.

Use when the product needs depth without losing action clarity.

### Conversation Workspace

- Lightweight top bar with workspace, mode, or filter switch.
- Scrollable message or result area.
- Suggestion cards or recent prompts in the empty state.
- Bottom composer anchored to the safe area.

Use when the product is chat, support, assistant, or guided workflow heavy.

### Result and Tooling Screen

- Task summary or hero question.
- Result card with structured sections.
- Tool run list or status timeline.
- Follow-up actions row.

Use when the app is more about execution and outputs than back-and-forth conversation.

### Guided Insight Screen

- Summary hero or key context block.
- Insight card pinned near the top.
- Supporting metrics, examples, or recent actions.
- Follow-up prompts, actions, or composer.

Use when the product mixes user data, recommendations, and next steps.

### Onboarding or Paywall

- Simple top affordance to close or continue.
- One strong headline.
- Compact visual proof point or component demo.
- Benefit list with restrained icons.
- Primary CTA and secondary reassurance.

Keep these screens cleaner than the product itself. They sell trust, not feature density.
