# Arlo UI

Premium, copy-paste React Native components. Token-driven. No black boxes.

Arlo UI gives Expo and React Native projects an owned component layer: choose a component,
copy its source into your app with the CLI, and customize it like any other local code.

- Mobile-first components for Expo and bare React Native
- Light and dark themes powered by shared design tokens
- React Native `StyleSheet` source with no required styling DSL
- Accessible states, touch targets, motion, and native interaction patterns
- A registry workflow inspired by shadcn/ui

[Documentation](https://arloui.com) | [Browse components](https://arloui.com/docs/components)

## Requirements

- Node.js 20 or newer
- An Expo or bare React Native project

## Quick Start

Run the CLI from the root of your app:

```bash
npx arloui@latest init
```

`init` creates `arlo.json` and installs the Arlo UI tokens and theme provider. Then add one or
more components:

```bash
npx arloui@latest add button input
```

The default structure is:

```text
components/ui/       # component source owned by your app
lib/arloui/          # tokens and theme provider
arlo.json            # registry and output configuration
```

The CLI prints any npm or native dependencies required by the selected components. Install those
dependencies using the command shown after `add` completes.

## Set Up The Theme

Wrap the application with the generated `ThemeProvider`. With Expo Router:

```tsx
// app/_layout.tsx
import { Slot } from 'expo-router';
import { ThemeProvider } from '@/lib/arloui/theme-provider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
```

Use the copied components directly from your project:

```tsx
import { Button } from '@/components/ui/button';

export function ContinueButton() {
  return (
    <Button tone="primary" appearance="solid" onPress={() => console.log('Continue')}>
      Continue
    </Button>
  );
}
```

## Commands

| Command                       | Purpose                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| `npx arloui init`             | Create `arlo.json`, tokens, and the theme provider          |
| `npx arloui add`              | Select components interactively                             |
| `npx arloui add button input` | Add specific components and their registry dependencies     |
| `npx arloui list`             | List everything available in the registry                   |
| `npx arloui diff button`      | Compare a local component with the current registry version |

Use `--yes` to accept defaults in automated workflows:

```bash
npx arloui init --yes
npx arloui add button --yes
```

Use `--overwrite` when you intentionally want the registry source to replace local component
files:

```bash
npx arloui add button --overwrite
```

Review local changes before committing after an overwrite. Your copied components belong to your
application, and Arlo UI will not update them silently.

## Configuration

The generated `arlo.json` controls the registry and destination folders:

```json
{
  "$schema": "https://arloui.com/schemas/arlo-config-v1.json",
  "registry": "https://arloui.com/r",
  "aliases": {
    "components": "components/ui",
    "tokens": "lib/arloui",
    "theme": "lib/arloui",
    "lib": "lib/arloui"
  },
  "style": "default"
}
```

Run `npx arloui init` without `--yes` to choose different component and foundation directories.

## Copy-Paste, Not A Component Dependency

The `arloui` npm package is the registry CLI. Components are copied into your repository rather
than imported from this package at runtime. This means you can inspect, edit, test, and ship the
exact component source used by your app.

## License

MIT
