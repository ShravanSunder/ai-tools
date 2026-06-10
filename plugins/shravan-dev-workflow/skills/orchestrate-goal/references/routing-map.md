# Goal Routing Map

Use this reference to connect a clear goal to the workflow skill that should own
the next phase.

## Phase Routes

| Goal state | Next skill | Why |
| --- | --- | --- |
| Goal itself is unclear | `discuss-with-me` | Shared model must be clear before a long-running goal starts. |
| Need design direction before a plan exists | `spec-design-swarm` | Research and design lanes shape the architecture. |
| Drafted spec/design needs critique | `spec-review-council` | Adversarial council reviews pre-plan design. |
| Need a portable packet for another agent | `plan-handoff` | Writes temp artifacts and copy-paste prompt. |
| Implementation plan needs attack before coding | `plan-review` | Reads full plan, validates claims, and revises accepted plan issues. |
| Plan is validated and should be executed | `plan-execute` | Validates then implements with parent-owned subagent slices. |
| Code/diff/PR/commit needs review | `implementation-review-swarm` | Runs implementation reviewer lanes and verifies findings. |
| Implementation state needs transfer or reviewer prompt | `implementation-handoff` | Packages current diff, validation, risks, and next task. |
| Docs/source of truth must be reconciled | `docs-maintain` | Updates docs with current code and decisions. |
| Explicit security audit or scan | `security-router` | Routes to official Codex Security workflows. |
| Failure needs root cause before fixes | `debug-investigation` | Proves diagnosis before patching. |

## Routing Rule

`orchestrate-goal` owns the goal contract, not the phase work. Once the contract
is clear, hand off to the narrowest phase skill.
