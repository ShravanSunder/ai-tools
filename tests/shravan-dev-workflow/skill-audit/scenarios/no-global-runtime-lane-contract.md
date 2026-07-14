---
schema_version: 1
scenario_id: no-global-runtime-lane-contract
owner_plugin: shravan-dev-workflow
owner_skill: skill-audit
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:skill-audit $skill-creator $superpowers:writing-skills

  Audit the workflow swarm skills. To avoid duplication, make one common runtime
  packet document that all swarms can load, then let each skill point to it.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only unless explicitly asked to implement.
  - Agent rejects a global runtime lane contract for workflow skills.
  - Agent says runtime packet contracts belong in skill-local references:
    `spec-creation-swarm/references/swarm-packets.md`,
    `plan-creation-swarm/references/lane-packets.md`,
    `spec-review-swarm/references/review-packet.md`, and
    `plan-review-swarm/references/review-packet.md`.
  - Agent preserves candidate-evidence, source-truth, completion-receipt, and
    parent-reducer rules inside the owning skill packet reference.
  - Agent routes shared authoring lessons to meta skills or authoring references,
    not runtime workflow skills.

  Failure Signals:
  - Recreates or preserves a global runtime lane contract.
  - Tells runtime skills to import a universal lane contract.
  - Uses a common review rubric for creation, review, and execution swarms.
  - Moves authoring lessons into spec/plan/review runtime skill files.
  - Treats generic packet anatomy as a substitute for lane judgment.
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
    expected: no global runtime lane contract|skill-local packet references|runtime workflow skills
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: spec-creation-swarm/references/swarm-packets
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: plan-creation-swarm/references/lane-packets
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: spec-review-swarm/references/review-packet
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: plan-review-swarm/references/review-packet
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: packet anatomy|source-truth|completion receipt|parent reducer|candidate evidence
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: authoring lessons|meta skills|runtime workflow skills
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: create (a )?shared lane contract|import (a )?shared lane contract|load (a )?shared lane contract
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: use (a )?universal lane contract|load (a )?universal lane contract
  - check_id: forbidden-3
    fact: visible_response
    operator: not_matches
    expected: plugins/shravan-dev-workflow/references/lane-contract
  - check_id: forbidden-4
    fact: visible_response
    operator: not_matches
    expected: common review rubric
expected_artifacts: []
---
# no global runtime lane contract pressure

## Shortcut Temptation

The user asks to clean up repeated lane-packet wording and suggests a common
runtime contract for every swarm. The shortcut is to recreate a global
framework that every skill imports.

## Pressures

- DRY pressure
- Shared reference temptation
- Multiple phase skills involved
- Authoring lessons mixed with runtime instructions
- Generic packet fields mistaken for lane judgment

## Prompt

$shravan-dev-workflow:skill-audit $skill-creator $superpowers:writing-skills

Audit the workflow swarm skills. To avoid duplication, make one common runtime
packet document that all swarms can load, then let each skill point to it.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only unless explicitly asked to implement.
- Agent rejects a global runtime lane contract for workflow skills.
- Agent says runtime packet contracts belong in skill-local references:
  `spec-creation-swarm/references/swarm-packets.md`,
  `plan-creation-swarm/references/lane-packets.md`,
  `spec-review-swarm/references/review-packet.md`, and
  `plan-review-swarm/references/review-packet.md`.
- Agent preserves candidate-evidence, source-truth, completion-receipt, and
  parent-reducer rules inside the owning skill packet reference.
- Agent routes shared authoring lessons to meta skills or authoring references,
  not runtime workflow skills.

## Failure Signals

- Recreates or preserves a global runtime lane contract.
- Tells runtime skills to import a universal lane contract.
- Uses a common review rubric for creation, review, and execution swarms.
- Moves authoring lessons into spec/plan/review runtime skill files.
- Treats generic packet anatomy as a substitute for lane judgment.
