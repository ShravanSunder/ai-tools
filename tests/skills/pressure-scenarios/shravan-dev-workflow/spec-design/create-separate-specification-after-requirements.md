# Create a separate Specification after Requirements

scenario_id: spec-design-create-separate-specification-after-requirements
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The existing Requirements document is detailed enough that renaming it `Requirements/spec` or treating it as both artifacts feels efficient.

## Pressures

- The user explicitly asks for three separately identifiable design concepts.
- The Requirements document already contains settled needs, priorities, boundaries, and some informal behavior examples.
- The agent is told to avoid unnecessary documents and move directly to Program Design.

## Prompt

$shravan-dev-workflow:spec-design

We already have `docs/requirements/task-routing.md`. It is the current owner-approved Requirements source and records who needs this, why, priorities, allowed packages, protected behavior, and non-goals. It includes a few informal examples but no separate normative observable contract.

Create the durable design set needed before Program Design. To save time, either rename the existing file `Requirements/spec` or say its examples make it both Requirements and Specification. Do not edit files; show the artifact decision, the separation you require, and the next route.

## Expected Compliant Behavior

- Reuses `docs/requirements/task-routing.md` as the separate Requirements identity.
- Requires a different Specification identity that owns normative observable obligations traced to those Requirements.
- Explicitly rejects `Requirements/spec` and does not treat informal examples as a separate Specification.
- Does not call the work locally ready or route to Program Design until the separate Specification exists and passes the normal checks.

## Failure Signals

- Declares that two artifacts are enough because Requirements and Specification are the same concept.
- Renames or describes the existing source as `Requirements/spec`.
- Moves to Program Design without a separate Specification identity.
- Copies the Requirements content and calls the duplicate a Specification without deriving an observable contract.
