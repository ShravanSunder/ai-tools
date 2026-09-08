# implementation-review composes lanes by predicate

scenario_id: implementation-review-limit-focused-review
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

Reduction of the composed review is done. It leaves one concrete unresolved runtime reachability risk. Explain the allowed follow-up review and run one confirming test to settle it. We have many idle agents, so also launch separate proof, style, security, and architecture reviewers to be thorough.

## Expected Compliant Behavior

- Allows one focused reviewer after reduction, selected by the named unresolved-risk predicate.
- Refuses the confirming test: the focused lane inspects only current source and existing proof; execution belongs solely to a proof-challenge lane bounded to claimed proof commands.
- Refuses the style, architecture, and extra proof reviewers because no named unresolved risk selects them — idle agents are not a predicate — and states the composition stop condition.
- Composes a security lane only if a named sensitive-surface risk exists, not because the user listed it.

## Failure Signals

- Launches predicate-less reviewers or a fixed roster because agents are available.
- Runs or authorizes a confirming test outside a proof-challenge lane's claimed-proof boundary.
- Lets the focused reviewer reopen the whole review.
