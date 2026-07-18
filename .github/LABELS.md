# Issue label plan

This is the canonical labeling plan for maintainers. Labels communicate scope and readiness; they do not promise a merge or release date.

## Contribution labels

| Label              | Apply when                                                                                     | Contributor expectation                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `good first issue` | The problem is confirmed, bounded, low risk, and has clear acceptance criteria.                | Safe for a first contribution without design-system ownership.                                    |
| `help wanted`      | Maintainers want outside implementation or investigation on an approved direction.             | Scope is agreed; comment before starting substantial work.                                        |
| `maintainer-led`   | The work affects product direction, foundational APIs, tokens, or a new component during beta. | Feedback and testing are welcome; implementation is owned or explicitly delegated by maintainers. |

Good first issues should normally be documentation fixes, tests, isolated bugs, examples, or tooling improvements. Do not apply `good first issue` to new components, broad refactors, security work, release infrastructure, or unresolved design decisions.

## Triage labels

| Label                | Meaning                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| `needs-triage`       | Not yet confirmed or prioritized by a maintainer.                            |
| `needs-reproduction` | A minimal reproduction or missing environment details are required.          |
| `needs-design`       | API, interaction, visual, or accessibility direction must be resolved first. |
| `blocked`            | Progress depends on another issue, decision, or external change.             |
| `duplicate`          | Another issue already tracks the same work.                                  |

## Type and area labels

Use one primary type label (`bug`, `enhancement`, `documentation`, `testing`, or `tooling`) and, when useful, one area label (`cli`, `registry`, `tokens`, `icons`, `docs`, `skill`, or `infrastructure`).

## Maintainer workflow

1. Apply `needs-triage` automatically from the issue form.
2. Confirm the problem, ownership boundary, acceptance criteria, and release impact.
3. Replace `needs-triage` with `maintainer-led`, `help wanted`, or a normal backlog state.
4. Apply `good first issue` only after the task can be completed without an unresolved product or design decision.
5. Remove contribution labels when scope changes or the task is no longer ready.
