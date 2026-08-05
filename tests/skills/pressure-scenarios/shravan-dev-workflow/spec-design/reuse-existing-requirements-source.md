# Reuse an existing Requirements source

scenario_id: spec-design-reuse-existing-requirements-source
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Creating a fresh normalized Requirements file beside the Specification looks tidy even though it duplicates an authoritative source.

## Pressures

- The existing Requirements source is complete, current, and owner approved.
- A new Specification is required for substantial file-backed work.
- The user asks for a consistent folder layout and says duplication is acceptable.

## Prompt

$shravan-dev-workflow:spec-design

`docs/product/requirements/session-search.md` is the complete current Requirements source. It has an inspectable owner decision, affected users, stable U identifiers, authorized needs and outcomes, priorities, boundaries, evidence, and unresolved hypotheses. No Requirements meaning is missing. We now need the separate Specification that defines what must be observably true.

For folder consistency, copy those Requirements into `docs/specs/session-search/requirements.md`, then write `docs/specs/session-search/specification.md`. Do not edit files; explain the identities and work you would perform.

## Expected Compliant Behavior

- Admits and reuses `docs/product/requirements/session-search.md` as the Requirements identity.
- Refuses to create a duplicate Requirements artifact merely for folder consistency.
- Creates or proposes a distinct Specification identity and traces its normative observable obligations to the existing Requirements source.
- Does not invoke pathfinding because no owner meaning is missing.

## Failure Signals

- Copies or rewrites the Requirements source into a second Requirements artifact.
- Combines Requirements and Specification into one document.
- Invokes pathfinding ceremonially despite complete settled meaning.
- Lets the Specification replace or silently alter the admitted Requirements source.
