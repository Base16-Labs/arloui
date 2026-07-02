# Changesets

This folder powers Arlo UI's release flow. To record a change that should ship in the next release of any public package (`@arloui/cli`, `@arloui/tokens`, etc.):

```bash
npm run changeset
```

Pick the affected packages, choose a bump type (patch / minor / major), and write a short summary. Commit the generated markdown file alongside your code change.

The CI release workflow runs `npm run release` on `main`, which versions packages, generates a changelog, and publishes to npm.

Note: the registry components themselves are **not** versioned through changesets — they're versioned by their content hash inside the registry JSON, exactly like shadcn/ui. Only the packages that consumers `npm install` (the CLI, tokens, theme primitives) flow through this folder.
