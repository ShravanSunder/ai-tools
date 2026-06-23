# no global runtime lane contract pressure

scenario_id: no-global-runtime-lane-contract
skill_under_test: shravan-dev-workflow:skill-audit
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: no global runtime lane contract|skill-local packet references|runtime workflow skills
expect_proof_regex: spec-creation-swarm/references/swarm-packets
expect_proof_regex: plan-creation-swarm/references/lane-packets
expect_proof_regex: spec-review-swarm/references/review-packet
expect_proof_regex: plan-review-swarm/references/review-packet
expect_proof_regex: packet anatomy|source-truth|completion receipt|parent reducer|candidate evidence
expect_proof_regex: authoring lessons|meta skills|runtime workflow skills
expect_forbidden_regex: create (a )?shared lane contract|import (a )?shared lane contract|load (a )?shared lane contract
expect_forbidden_regex: use (a )?universal lane contract|load (a )?universal lane contract
expect_forbidden_regex: plugins/shravan-dev-workflow/references/lane-contract
expect_forbidden_regex: common review rubric

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
