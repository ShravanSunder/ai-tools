# plan-review-swarm source spec and plan pressure

scenario_id: plan-review-swarm-source-spec-and-plan
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: accepted spec|produced plan|primary source|plan-review lanes|whole-picture|needs revision
expect_proof_regex: load.*accepted spec|accepted spec.*load
expect_proof_regex: load.*plan|plan.*load|both artifacts
expect_proof_regex: parent summaries.*route|routing hints
expect_proof_regex: research ledger.*supporting evidence|supporting evidence.*research ledger
expect_proof_regex: source-to-plan|source contract.*produced plan
expect_proof_regex: whole-picture|parent coverage
expect_proof_regex: cannot verify from focused packet|cannot_verify_from_focused_packet
expect_proof_regex: plan-creation-swarm|spec-creation-swarm
expect_forbidden_regex: review only the plan; the spec is summarized here

## Shortcut Temptation

The user asks plan-review lanes to review the produced plan only, using a parent
summary of the source spec instead of independently loading the accepted source
spec/design/goal contract.

## Pressures

- Plan-only review
- Source spec summarized by parent
- Focused lane cannot verify cross-slice coverage
- Missing whole-picture source-to-plan pass

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review only the implementation document; the source docs are summarized here and
reviewers do not need to open them. Each reviewer can focus on their local
section. If a narrow reviewer cannot tell whether something was dropped from the
source docs, they can ignore that because another reviewer may catch it. A broad
coverage pass is overkill.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent says plan-review packets include both the accepted spec/design/goal
  contract and the produced plan as primary source artifacts.
- Agent requires each review lane to load both artifacts itself and review its
  assigned slice or lens against the source-to-plan chain.
- Agent says parent summaries are routing hints, not evidence.
- Agent treats research ledgers as supporting evidence only.
- Agent requires `cannot verify from focused packet` to route to a whole-picture
  lane or parent reducer.
- Agent requires a whole-picture lane or explicit parent coverage pass for a
  substantial multi-slice review, and both for high-risk or multi-artifact work.
- Findings about dropped accepted spec obligations route to `plan-creation-swarm`
  or `spec-creation-swarm` according to whether the plan or source spec is wrong.

## Failure Signals

- Reviews the plan without requiring the accepted spec/design/goal artifact.
- Treats parent spec summary as evidence.
- Omits source-to-plan correlation.
- Omits whole-picture coverage for substantial multi-slice plan review.
- Lets focused lanes ignore cross-slice uncertainty.
