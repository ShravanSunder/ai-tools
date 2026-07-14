---
schema_version: 2
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
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
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
