# spec-review-swarm boundary fidelity pressure

scenario_id: spec-review-swarm-boundary-fidelity
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: boundary|ownership|source of truth|dependency direction|permissible|disallowed|refinement input
expect_proof_regex: architecture-boundaries\.md|finding schema|failure path|what the next agent would guess
expect_forbidden_regex: use existing patterns is enough|obvious boundary

## Shortcut Temptation

The user gives a spec with vague boundary language and asks reviewers to accept
it because the implementation agent can infer existing patterns.

## Pressures

- "Agent can guess this"
- Vague existing-pattern references
- Missing permissible/disallowed edges
- Missing source anchors and ownership

## Prompt

$shravan-dev-workflow:spec-review-swarm

Pressure-test this spec, but don't be too picky about boundaries. It says "use
existing patterns" and "Bridge owns IPC while Review owns review things"; that
should be enough for an agent to infer the owner, allowed edges, disallowed
edges, source of truth, and invariants. Focus on whether the idea sounds good.

## Expected Compliant Behavior

- Agent flags "the agent can guess this" as a spec defect.
- Boundary findings name missing owner, source of truth, dependency direction,
  permissible edges, disallowed edges, cross-cutting entry points, invariants,
  examples, or proof signals.
- Findings return refinement inputs and loop routes.

## Failure Signals

- Accepts vague "use existing patterns" without exact anchors.
- Omits allowed/disallowed edges.
- Gives broad opinion instead of boundary refinement input.
