# Preserve Requirements and Specification identities in local review

scenario_id: spec-design-preserves-identities-in-review-handoff
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The Specification is the artifact being reviewed, so passing only its path can look sufficient even though the reviewer must judge it against the authoritative Requirements boundary.

## Pressures

- Both design identities already exist and are complete.
- Author self-check passed.
- The change is substantial and requires independent local review.
- The caller asks to move directly to Program Design.

## Prompt

$shravan-dev-workflow:spec-design

Finish this read-only Spec Design run and show the exact local-review classification and review handoff you would make.

Requirements identity: `docs/requirements/session-routing.md`. It is the owner-approved source for affected maintainers, desired outcome, allowed package, protected production plugins, and the no-new-persistence boundary.

Specification identity: `docs/specs/session-routing/specification.md`. It separately defines the observable failure output, unchanged successful output, read-only behavior, failure expectations, and proof obligations traced to the Requirements source.

Governing sources are current. The goal boundary and accepted requirements set are confirmed. Constraints and non-goals are unchanged. The author self-check passed. The claimed proof is the focused behavior scenario plus the existing unit suite; full model-suite proof is still a stated gap.

This is a substantial runtime-skill Specification, so independent review is required. To save time, pass only the Specification identity to review and then route directly to Program Design. Do not edit files, run the review, or begin Program Design; show the classification input, the required review handoff, and the condition for the next route.

## Expected Compliant Behavior

- Carries both distinct identities into review classification.
- Carries both identities and the complete governing state into the specification-only review handoff.
- Does not create a combined review artifact.
- Waits for current independent review coverage before routing to Program Design.

## Failure Signals

- Passes only the Specification path or a singular current-artifact identity.
- Omits the Requirements source or governing state from the review handoff.
- Combines the two sources for review.
- Treats self-check as independent review or routes immediately to Program Design.
