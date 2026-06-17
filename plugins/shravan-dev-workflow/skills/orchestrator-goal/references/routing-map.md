# Goal Routing Map

Use this reference to connect a clear goal to the workflow skill that should own
the next phase.

## Phase Routes

| Goal state | Next skill | Why |
| --- | --- | --- |
| Goal itself is unclear | `discuss-with-me` | Shared model must be clear before a long-running goal starts. |
| Need design direction before a plan exists | `spec-design-swarm` | Research and design lanes shape the architecture. |
| Drafted spec/design needs critique | `spec-review-swarm` | Adversarial review swarms pre-plan design. |
| Spec/design context needs a portable packet | `spec-handoff` | Packages pre-plan decisions, non-goals, open questions, and evidence. |
| Need to turn spec/design into an implementation plan | `plan-create` | Creates task sequence, write surfaces, validation gates, and risks without editing code. |
| Existing implementation plan needs a portable packet | `plan-handoff` | Writes temp artifacts and copy-paste prompt for the plan. |
| Implementation plan needs attack before coding | `plan-review-swarm` | Reads full plan, validates claims, and revises accepted plan issues. |
| Plan is validated and should be executed | `implementation-execute-plan` | Validates then implements with parent-owned subagent slices. |
| Code/diff/PR/commit needs review | `implementation-review-swarm` | Runs implementation reviewer lanes and verifies findings. |
| Implementation review is addressed, but PR is missing or readiness is unproven | `implementation-pr-wrapup` | Opens/updates the PR, checks CI/comments/review threads, proves readiness, and does not merge without user authorization. |
| Implementation state needs transfer or reviewer prompt | `implementation-handoff` | Packages current diff, validation, risks, and next task. |
| Docs/source of truth must be reconciled | `docs-maintain` | Updates docs with current code and decisions. |
| Explicit security audit or scan | `ops-security-review` | Routes to official Codex Security workflows. |
| Failure needs root cause before fixes | `debug-investigation` | Proves diagnosis before patching. |

## Routing Rule

`orchestrator-goal` owns the goal contract, not the phase work. Once the contract
is clear, hand off to the narrowest phase skill for the first unproven lifecycle
gate.

For implementation goals, the default lifecycle continues until the default
implementation terminal: PR created or updated and proven ready, but not merged.
Only the starting point is mutable. Existing spec, plan, code, review, or PR
artifacts move the route forward; they do not by themselves narrow the terminal
condition.

Use the full proof loop before terminal completion: scoped tests and quality
checks, app/runtime or visual/manual evidence where relevant, metrics or
benchmarks when requested, implementation review disposition, and fresh PR
checks/review-thread/mergeability state. Use checkpoint commit boundaries after
verified lifecycle checkpoints when scoped files changed and repo policy permits.

For goal-backed multi-phase work, the phase skill returns evidence and a
recommendation only:

```text
phase_result: complete | blocked | needs_revision | not_applicable
evidence: <paths, commands, findings, or transcript notes>
recommended_next_workflow: <shravan-dev-workflow skill or terminal>
recommended_transition_reason: <one sentence>
```

`orchestrator-goal` verifies that footer and writes the official transition. The
latest valid orchestrator-written event in `events.jsonl` is the transition
source of truth. Do not let phase skills directly mutate the official workflow
state. When rejecting direct phase-skill state mutation, say this precedence
rule explicitly so the next agent does not infer a multi-writer shortcut.
