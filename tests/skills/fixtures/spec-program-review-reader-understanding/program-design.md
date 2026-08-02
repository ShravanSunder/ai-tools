# Reader Understanding Fixture Program Design

This program design defines structural How. The requirements document owns accepted requirements; the specification owns Why/What.

## Purpose And Companion Roles

This program design defines structural How. The requirements document owns accepted requirements; the specification owns Why/What.

## Ownership, Calls, And Failure

The API owns submission and status. The worker owns execution and timeout classification. The existing path is:

```text
SDK -> API submit -> worker execution -> completion or timeout failure -> API status -> operator
```

The existing foundation is preserved. A scheduler and audit subsystem were rejected because neither R1 nor R2 requires them.

## Requirement Realization And Proof Seams

- R1 -> API submission owner -> submit call path -> SDK submission proof.
- R2 -> worker execution/failure owner -> result-to-status path -> operator completion/timeout proof.

## Architecture Documentation Impact

After implementation, update architecture documentation and include the change in the pull request description.

## Design Completion Boundary

Independent review must pass before planning. Planning and pull-request work happen later.

## Component Overview

```text
Purpose -> Ownership -> Calls -> Proof
```

This overview merely redraws section headings; it carries no component, direction, state, call, or failure semantics.
