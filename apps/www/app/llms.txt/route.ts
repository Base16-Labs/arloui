import { NextResponse } from "next/server";

const CONTENT = `# ArloUI

> A mobile-first React Native component library with copy-paste primitives — like shadcn for React Native.

## Docs

- [Getting started](/docs/getting-started)
- [Foundations](/docs/foundations)
- [Primitives](/docs/primitives)
- [Components](/docs/components)
- [Archetypes](/docs/archetypes)
- [Agents](/docs/agents)
- [Changelog](/docs/changelog)

## Key concepts

- 35 components across 6 groups: Layout & surface, Type & content, Controls, Lists & rows, Feedback, Navigation
- 4 foundations (facets): Craft, Fluidity, Opinionated, Detailed
- 7 primitives: Tokens, Typography, Color, Spacing, Motion, Effects, Icons
- Typography: font-agnostic type scale, 16 tokens across display/heading/body/label/button, Manrope default, one-line family swap
- Effects: 5 shadow levels (none/sm/md/lg/xl), 2 two-layer focus rings (main/error), 5 blur levels (4-40px), and experimental iOS 26 Liquid Glass fallbacks
- 9 archetypes: Question, Decision, Status, Feed, Detail, Creation, Settings, Onboarding, Empty
- AI-native: skill pack, MCP server, prompt cookbook

## Full docs

For complete documentation including all component APIs, see /llms-full.txt
`;

export function GET() {
  return new NextResponse(CONTENT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
