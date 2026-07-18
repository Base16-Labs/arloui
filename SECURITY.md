# Security policy

## Supported versions

Arlo UI is in beta. Security fixes target:

- the latest published `arloui` CLI release;
- the latest published versions of supported `@arloui/*` packages; and
- the current `main` branch and public component registry.

Older package releases and previously copied component source are not maintained as separate security release lines. Because registry components are copied into consumer repositories, consumers remain responsible for reviewing and updating their owned copies.

## Reporting a vulnerability

Do not open a public issue, discussion, or pull request for a suspected vulnerability.

Use [GitHub private vulnerability reporting](https://github.com/Base16-Labs/arloui/security/advisories/new) and include:

- the affected package, CLI command, registry component, or website route;
- the affected version or registry content hash;
- impact and realistic attack scenario;
- reproduction steps or a proof of concept; and
- any suggested mitigation, if known.

We aim to acknowledge reports within three business days and provide an initial assessment within seven business days. Timelines for a fix and disclosure depend on severity and coordination needs. Please allow maintainers a reasonable opportunity to investigate and release a fix before public disclosure.

## Scope

Reports about dependency vulnerabilities should explain how Arlo UI makes the vulnerable behavior reachable. General support questions, ordinary bugs, and feature requests belong in the public issue tracker.
