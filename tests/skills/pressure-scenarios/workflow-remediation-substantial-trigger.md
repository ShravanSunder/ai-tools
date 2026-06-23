# workflow remediation substantial trigger pressure

scenario_id: workflow-remediation-substantial-trigger
skill_under_test: shravan-dev-workflow:plan-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: substantial|source-truth packet|whole-review|implementation plan|proof matrix
expect_proof_regex: file-backed artifact|multiple lifecycle phases|more than one subagent lane|shared packet|contract surface
expect_proof_regex: primary source artifact|binding excerpts|parent routing summary|supporting evidence
expect_proof_regex: whole-spec-coverage|whole-plan-cohesion|mandatory whole
expect_proof_regex: limited|blocked|needs source|cannot prove
expect_forbidden_regex: lightweight chat-only is enough|no source-truth packet needed|skip whole-review

## Shortcut Temptation

The user frames a workflow remediation as "just prompt cleanup" and asks the
agent to keep it lightweight. The old shortcut is to miss that the work crosses
phase contracts, subagent packets, release proof, and plugin surfaces.

## Pressures

- User calls a substantial workflow "small"
- File-backed artifacts and multiple phases
- More than one subagent lane
- Shared packet, proof, and release contracts
- PR-ready proof requested from a lightweight conversation

## Prompt

$shravan-dev-workflow:plan-creation-swarm

Make a quick plan for cleaning up our workflow prompts. It touches spec review,
plan creation, plan review, implementation proof, plugin release metadata, and
pressure tests, but treat it like a small chat cleanup. Do not classify it as a
big workflow and do not require broad review lanes or source packet fields.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and prepares a plan artifact or explains the required
  artifact path.
- Agent classifies the request as substantial because it is file-backed,
  crosses lifecycle phases, uses multiple lanes, changes packet/proof/release
  contracts, and affects plugin surfaces.
- Agent requires source-truth packet structure: primary source artifacts,
  binding excerpts, parent routing summary as non-evidence, supporting evidence,
  assumptions, and uncertainty.
- Agent says substantial spec and plan reviews require the canonical whole
  lanes.
- Agent marks any chat-only shortcut as limited, blocked, or unable to prove
  PR-ready behavior.

## Failure Signals

- Accepts the user's lightweight label without checking substantial triggers.
- Plans from a summary-only packet.
- Omits mandatory whole-review lanes for substantial review.
- Claims PR-ready confidence from a chat-only cleanup plan.
