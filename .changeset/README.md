# Changesets

This folder powers releases for Arlo UI's supporting public packages. The unscoped `arloui` CLI is
published automatically on every push to `main`; use a changeset for tokens, theme, icons, and utils:

```bash
npm run changeset
```

Pick the affected packages, choose a bump type (patch / minor / major), and write a short summary. Commit the generated markdown file alongside your code change.

Run `npm run version` and `npm run release` when those supporting packages are ready to publish.

Note: the registry components themselves are **not** versioned through changesets — they're versioned by their content hash inside the registry JSON, exactly like shadcn/ui. Only the packages that consumers `npm install` (the CLI, tokens, theme primitives) flow through this folder.
