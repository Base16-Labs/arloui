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
PP Neue Montreal. Book 400 for body, Medium 500 for headings.

### Color
Semantic palette with surface hierarchy. Full dark mode support.

### Spacing
4 px grid with named steps: xs (4), sm (8), md (12), lg (16), xl (24), 2xl (32), 3xl (48).

### Motion
Easing curves, durations, spring configs. Never animate from scale(0). Pressables respond instantly.

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
