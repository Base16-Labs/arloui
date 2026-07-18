# Versioning and updates

Arlo UI has two delivery models, so components and npm packages update differently.

## Registry components: content hashes

Components copied by the CLI are source files owned by the consuming application. Each registry entry includes a deterministic content hash covering its published files. Registry components do not receive independent semantic versions and are never updated silently.

Check an owned copy against the registry with:

```bash
npx arloui diff button
```

When an update is available, inspect the upstream source and then intentionally replace the local files:

```bash
npx arloui add button --overwrite
```

Review the diff and reapply any local customizations before committing. A registry catalog version describes the registry format/catalog as a whole; it is not a component release number.

## npm packages: semantic versions and Changesets

Published `@arloui/*` packages use semantic versions. Changes to tokens, theme, icons, utilities, or other supporting public packages require a Changeset:

```bash
npm run changeset
```

The Changeset records the affected packages, bump type, and release note. Maintainers run the version and publish workflow when those packages are ready.

The unscoped `arloui` CLI is currently a documented exception: every validated push to `main` publishes a patch on its checked-in release line, using the GitHub Actions run number. Maintainers bump the checked-in minor or major version when beginning a new release line.

Consumers update npm packages with their package manager and should read the generated changelog or release notes before accepting major or minor changes.

## What contributors should include

- Registry-source-only changes: rebuild registry JSON; no Changeset is required unless an npm package also changed.
- Supporting public package changes: add a Changeset.
- CLI changes: do not manually choose the published patch version; the release workflow does that.
- Documentation, tests, and internal tooling: no Changeset unless they alter a published artifact.

During beta, maintainers may make breaking registry changes when necessary. Content hashes make drift visible, but consumers must still review overwrites and migrations.
