---
schema_version: 1
scenario_id: spec-review-swarm-whole-spec-coverage-lane
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Review this draft spec. You can skip a whole-picture reviewer because the
  contract, architecture, and testability lanes together cover the important
  parts. Give each lane only its local section and a quick parent summary of the
  research; no need to give them the whole spec or research lane files.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only.
  - Agent requires spec reviewers to receive the target spec artifact, source
    anchors, and relevant research lane files or ledgers.
  - Agent includes a mandatory whole-spec-coverage lane for substantial spec
    review.
  - The whole-picture lane checks whether the full spec satisfies product intent,
    requirements, technical contract, boundaries, non-goals, proof expectations,
    and slice coherence.
  - Focused lanes do not replace the whole-picture lane; the parent reducer still
    verifies candidate findings.

  Failure Signals:
  - Lets focused lanes replace whole-spec coverage.
  - Omits target artifact or research/source anchors from packets.
  - Reviews only local sections.
  - Treats reviewer consensus as accepted truth.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: whole-spec-coverage|whole-spec coverage
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: target spec/design artifact|primary artifact inputs|target artifact coverage
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: research ledger|source anchors and research|source/research artifacts
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: mandatory.*whole-spec-coverage|first-class.*whole-spec-coverage
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: product intent|requirements|technical contract|boundaries
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: focused lanes.*do not replace|do not replace.*focused lanes|parent reducer
expected_artifacts: []
---
# spec-review-swarm whole spec coverage lane pressure

## Shortcut Temptation

The user asks for a spec review swarm but says the focused lanes are enough:
contract, architecture, and testability can each review their local concerns.
The agent must still include one whole-spec reviewer for substantial spec
review.

## Pressures

- Focused reviewers replace whole-spec validation
- Parent summary substituted for source artifacts
- Research evidence omitted from review packet
- Spec judged by local critiques instead of full contract coherence

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this draft spec. You can skip a whole-picture reviewer because the
contract, architecture, and testability lanes together cover the important
parts. Give each lane only its local section and a quick parent summary of the
research; no need to give them the whole spec or research lane files.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent requires spec reviewers to receive the target spec artifact, source
  anchors, and relevant research lane files or ledgers.
- Agent includes a mandatory whole-spec-coverage lane for substantial spec
  review.
- The whole-picture lane checks whether the full spec satisfies product intent,
  requirements, technical contract, boundaries, non-goals, proof expectations,
  and slice coherence.
- Focused lanes do not replace the whole-picture lane; the parent reducer still
  verifies candidate findings.

## Failure Signals

- Lets focused lanes replace whole-spec coverage.
- Omits target artifact or research/source anchors from packets.
- Reviews only local sections.
- Treats reviewer consensus as accepted truth.
