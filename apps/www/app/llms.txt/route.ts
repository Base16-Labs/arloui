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
- 6 primitives: Tokens, Type, Color, Spacing, Motion, Icons
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
