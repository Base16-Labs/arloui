import { NextResponse } from "next/server";

const CONTENT = `# ArloUI — Full Documentation

> A mobile-first React Native component library with copy-paste primitives — like shadcn for React Native.

---

## Getting started

### Install
\`\`\`bash
npx arloui init
\`\`\`

Requires: React Native 0.76+, Expo SDK 52+, React 19.
Peer deps: react-native-reanimated, react-native-gesture-handler, react-native-svg.

### With AI
Drop the ArloUI skill pack into your editor (Claude Code, Cursor, Windsurf) and prompt naturally.

### First screen
Build a Question archetype — title, body, one or two actions — in five minutes.

---

## Foundations

### Craft (Facet 01)
Hierarchy, spacing, alignment, and typography do the heavy lifting.

### Fluidity (Facet 02)
The user should never feel like they teleported. Movement explains where they came from and where they are going.

### Opinionated (Facet 03)
Arlo has a point of view. The defaults are the design.

### Detailed (Facet 04)
A great hero with an unconsidered empty state is not a great component.

---

## Primitives

### Tokens
Raw values — radii, shadows, durations — that every component references.

### Typography
Font-agnostic type scale with 16 roles across display, heading, body, label, and button. Manrope is the default; swap \`fontFamilies.sans\` once and adjust \`fontWeights.emphasized\` when the replacement face needs a different bold weight.

### Color
Three-layer system: raw palette (Grey/Primary/Success/Warning/Error) → 45 semantic tokens → components. Components read \`theme.colors.*\` only and never raw palette values, so roles resolve correctly in both light and dark. Both modes are first-class — neither is derived from the other. One accent per screen; the accent is an event (CTA, live status, selection). Use \`feedback-*-bg\` tints for status surfaces and reserve saturated feedback colors for text and icons.

### Spacing
4px grid as the primary tool for showing relationships — reach for spacing before a divider. 14-step numeric scale keyed by suffix (\`spacing[4]\` = 16px) spanning 0–96px. Semantic heuristics: 4–8px belongs together, 12–16px siblings, 20–24px new group, 32–48px major blocks, 56–96px new context. 7-step radius (\`radii.none\`→\`radii.full\`, 0–9999px pill) and fixed component sizing (\`sizing.icon\` 16–32, \`sizing.avatar\` 16–40, \`sizing.buttonHeight\` 36–52, \`sizing.touchTarget\` 44/48). Keep a 44×44pt minimum hit area.

### Motion
Easing curves, durations, spring configs. Never animate from scale(0). Pressables respond instantly.

### Effects
Five shadow levels (none/sm/md/lg/xl), two focus rings (main/error with a two-layer spread), five blur levels (4–40 px), and experimental iOS 26 Liquid Glass with cross-platform fallbacks. Use the lightest elevation that works, drop shadows on press, and reserve live blur for functional layers.

### Icons
Phosphor-based set — 2,980 glyphs via react-native-svg.

---

## Components

### Layout & surface
Stack, Group, Card, Sheet, Tray, Scrim, SafeArea

### Type & content
Title, Body, Caption, Stat, Note, Eyebrow

### Controls
Button, Pill, Chip, Tab, Toggle, Stepper, Slider, Field, Select, Picker

### Lists & rows
List, Row, Divider

### Feedback
Toast, Banner, Spinner, Progress, Empty, Loader

### Navigation
Nav, Header, Breadcrumb

---

## Archetypes

01. Question — title, body, one or two actions
02. Decision — multiple options, comparison, selection
03. Status — real-time state of a process
04. Feed — chronological or ranked stream
05. Detail — deep view of a single entity
06. Creation — multi-step form or wizard
07. Settings — grouped toggles, pickers, navigation rows
08. Onboarding — first-run experience
09. Empty — zero-data state

---

## Agents

### Skill pack
Markdown document teaching AI assistants the full design system.

### MCP
Model Context Protocol server for programmatic token/component access.

### Prompt cookbook
Copy-paste prompts for common screen-building tasks.
`;

export function GET() {
  return new NextResponse(CONTENT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
