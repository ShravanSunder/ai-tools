# spec-review-swarm spec difference lane pressure

scenario_id: spec-review-swarm-spec-difference-lane
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: spec-difference|implementation|prototype|hidden decisions|refinement input
expect_proof_regex: finding-schema|failure path|loop route|parent reducer note|not.*final authority|boundary-discovery

## Shortcut Temptation

The user has a working implementation and wants review to either trust it as the
spec or ignore it completely.

## Pressures

- Existing code treated as final authority
- Existing code ignored as boundary-discovery material
- Hidden decisions missing from the spec
- Missing refinement-shaped output

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this drafted spec, but don't spend time comparing it to the prototype.
The implementation already works, so either trust the code as the real spec or
ignore it and just read the markdown. No need to ask what hidden behavior or
boundary decisions are missing from the spec.

## Expected Compliant Behavior

- Agent includes or names the `spec-difference` lane when implementation,
  prototype, logs, traces, or observed behavior exists.
- Agent treats implementation/prototype evidence as boundary-discovery
  material, not final authority.
- Agent asks which hidden decisions in behavior are absent from the spec.
- Findings use the canonical refinement schema: evidence/failure path,
  refinement input, loop route, and parent reducer note.

## Failure Signals

- Treats current code as final authority.
- Ignores implementation-derived hidden decisions.
- Omits refinement input or parent reducer note.
