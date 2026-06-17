---
name: orchestrator-goal
description: Use when starting, refining, resuming, auditing, or handing off a Codex or Claude /goal session, especially when the user asks for a long-horizon goal, durable objective, completion condition, goal-backed workflow, or copy-paste goal prompt.
---

# Orchestrator Goal

Compile a clear long-horizon goal contract, then route the work to the right
workflow skill. This skill does not replace design, planning, review, execution,
or docs skills. It decides whether the goal is clear enough to run and then
connects the goal to those skills.

## Core Rule

There are only two paths:

1. If the intent is clear, orchestrate the goal.
2. If the intent is not clear, use `discuss-with-me` before setting or preparing
   the goal.

Do not run a mini interview inside this skill. Goals are heavy, long-running
horizon processes; fuzzy goals need shared-understanding work first.
For unclear goals, respond with the load-bearing unknowns and an explicit next
workflow that names `shravan-dev-workflow:discuss-with-me`.

The goal contract names the durable outcome and gates. It does not replace
requirements discovery, spec design, plan creation, execution, or review. It
routes to those phase skills and preserves the proof chain across them.

## Default Implementation Lifecycle

For implementation goals, default to the whole delivery lifecycle. If the user
wanted only planning, only review, only PR work, or another subset, they can
call those phase skills directly. Do not infer a smaller terminal condition
just because the goal starts from a spec, plan, diff, or existing PR.

Only the starting point is mutable. Choose `Current workflow` and
`Next workflow` from the first unproven lifecycle gate:

- no shared design/spec: `spec-design-swarm`
- design/spec drafted but unreviewed: `spec-review-swarm`
- accepted spec/design exists, no implementation plan: `plan-create`
- implementation plan exists but is unreviewed: `plan-review-swarm`
- reviewed plan exists, implementation is not proven: `implementation-execute-plan`
- implementation proof exists, review is not done or findings are unresolved:
  `implementation-review-swarm`
- implementation review is addressed, PR is not created or readiness is not
  proven: `implementation-pr-wrapup`

Default implementation terminal: PR created or updated and proven ready, but not
merged. Completion normally requires implementation complete, required proof
gates passing or explicitly not-applicable, the full proof loop captured,
implementation review findings addressed or explicitly rejected, PR checks and
review-thread state freshly reported, mergeability/readiness stated, and merge
left out of scope unless the user explicitly authorizes it.

The pr-ready non-merge boundary is mandatory: `implementation-pr-wrapup` means
open/update/monitor/prove the PR, not merge it. Merge is a separate authorized
action.

The full proof loop must use the highest proof layer the goal implies. For
ready-to-use behavior, screenshots, visual proof, manual verification, app
runtime checks, benchmarks, or metrics, do not replace those with lower-layer
tests. Mark a proof gate `not-applicable` only with an explicit reason.

Checkpoint commit rule: when scoped files changed and repo policy permits,
commit at verified lifecycle checkpoints. Good checkpoint commits are accepted
spec/plan artifacts, implementation slices after proof, accepted review-finding
fixes, and PR-ready wrapup. Do not stage unrelated files, and do not treat a
commit as proof.

## Goal-Backed Workflow State

For long-horizon goals that pass through multiple workflow skills, keep a tiny
state contract in the goal text and expandable details outside it.

Use a stable `goal_id` for every goal-backed workflow. Prefer
`<yyyy-mm-dd>-<short-slug>` and reuse it in the goal text, state directory,
handoffs, and review reports.

The `/goal` text is the compact classifier anchor. It must carry:

- `goal_id`
- `Required workflow skill: shravan-dev-workflow:orchestrator-goal`
- exact spec, plan, review/report, or handoff paths that already exist
- `Current workflow: <skill-or-state>`
- `Next workflow: <skill-or-terminal>`
- `Terminal condition: <exact condition for complete>`
- `State details: tmp/workflow-state/<goal_id>/details.md`
- `Transition log: tmp/workflow-state/<goal_id>/events.jsonl`
- scope, non-goals, blocked condition, and proof/stop rules

Do not create `files.md` or `state.md` as separate sources of truth. The key
files belong directly in `/goal`; expanded context belongs in `details.md`;
official transitions belong in `events.jsonl`.

When goal text approaches the host limit, preserve required workflow skill,
`goal_id`, exact key files, `Current workflow`, `Next workflow`,
`Terminal condition`, `details.md`, and `events.jsonl` before lifecycle prose.
Compress explanation before dropping anchors.

## Transition Ownership

`orchestrator-goal` is the only official workflow transition writer. Phase
skills may do phase work and recommend a next state, but they do not mutate the
official workflow state.

When a user asks to let phase skills update or advance goal state directly,
reject that shape and explicitly state the precedence rule: the latest valid
orchestrator-written event in `events.jsonl` wins for `Current workflow`,
`Next workflow`, and transition decision.

Ask phase skills in goal-backed workflows to return this footer:

```text
phase_result: complete | blocked | needs_revision | not_applicable
evidence: <paths, commands, findings, or transcript notes>
recommended_next_workflow: <shravan-dev-workflow skill or terminal>
recommended_transition_reason: <one sentence>
```

The parent orchestrator verifies the phase evidence, chooses one official
transition, and records it. If `/goal`, `details.md`, and `events.jsonl`
disagree, use this precedence:

1. `/goal` owns scope, non-goals, required workflow skill, `goal_id`, and exact
   key artifact paths.
2. The latest valid orchestrator-written event in `events.jsonl` owns
   `Current workflow`, `Next workflow`, and transition decision.
3. `details.md` owns expanded context, proof matrix, blockers, secondary files,
   and phase recommendations.

Fail loudly before continuing when required pointers are missing, renamed, or
contradict one another. Do not silently reconstruct state from chat.

## Clarity Gate

The goal is clear only when these are known:

- objective
- non-goals or scope boundary
- requirement/spec source, or explicit statement that chat is the source
- required reading or source artifacts
- exact plan file and related files when they exist
- `goal_id` and workflow-state pointers for goal-backed multi-phase work
- current workflow, next workflow, and terminal condition when resuming or
  closing a multi-phase goal
- allowed write scope
- proof gates by layer where known
- requirements/proof matrix, or who must define it next
- stop condition
- blocked condition
- checkpoint or handoff rhythm
- next workflow owner

If any of these materially affect the work and are missing, route to
`discuss-with-me`.

Known artifact paths make a compact goal more clear, not less. Do not route to
`discuss-with-me` solely because a known plan/spec file has not been reloaded in
the current pressure run or handoff context. Instead, emit a corrected contract
that keeps `Required workflow skill:` and `Required reading:` labels, lists the
exact files, and makes the first checkpoint load/validate those artifacts.

When the user asks to omit the orchestrator skill name, exact files, or required
labels for compactness, resist the shortcut by including the required anchors in
the corrected goal contract. Do not stop at "unclear" unless a material target,
scope boundary, or terminal condition is genuinely missing.

## Workflow

1. Identify target surface:
   - Codex `/goal`
   - Claude `/goal`
   - copy-paste prompt for another agent
   - current-session goal audit or resume
2. Run the clarity gate.
3. If clear, compile the goal contract.
   - Include the exact skill name `shravan-dev-workflow:orchestrator-goal` in
     copy-paste goal text so a future model knows to use this skill.
   - Include exact plan/spec/source file paths and related files when known. Do
     not replace a known plan file with a generic phrase such as "the plan".
   - For goal-backed multi-phase work, include `goal_id`,
     `Current workflow:`, `Next workflow:`, `Terminal condition:`,
     `State details:`, and `Transition log:`.
   - For implementation goals, include an `Orchestration rules applied:` line
     naming the relevant durable rules: `default implementation terminal`,
     `mutable starting point`, `pr-ready non-merge boundary`, `full proof loop`,
     and `checkpoint commit rule`.
   - Use the exact labels `Required workflow skill:` and `Required reading:`
     when preparing copy-paste goal text.
   - `Required workflow skill:` is always `shravan-dev-workflow:orchestrator-goal`.
     Put the phase skill (`plan-create`, `implementation-execute-plan`, etc.)
     under `Next workflow:`, not in the required-skill field.
4. Select the next workflow:
   - early design or architecture: `spec-design-swarm`
   - drafted spec/design needs critique: `spec-review-swarm`
   - spec/design packet for another agent: `spec-handoff`
   - implementation plan creation: `plan-create`
   - implementation plan packet for another agent: `plan-handoff`
   - adversarial plan review: `plan-review-swarm`
   - validated implementation from a plan: `implementation-execute-plan`
   - code, diff, branch, commit, or PR review: `implementation-review-swarm`
   - PR open/update, checks/comments, review-thread state, and readiness proof:
     `implementation-pr-wrapup`
   - continuation or reviewer packet after implementation work:
     `implementation-handoff`
   - docs/source-of-truth cleanup: `docs-maintain`
   - explicit security scan: `ops-security-review`
   - bug or failure diagnosis: `debug-investigation`
5. Set the goal only when the user explicitly asked for a goal-backed session
   and the host surface supports it. Otherwise, prepare the goal prompt or
   contract artifact.
6. When routing to `plan-create`, carry any known requirements/proof matrix rows
   and mark missing implementation proof rows as `must be defined by plan-create`.
7. When a phase finishes in a goal-backed workflow, read its
   `phase_result`, `evidence`, `recommended_next_workflow`, and
   `recommended_transition_reason`; verify the evidence; then either record the
   next official transition or leave the goal open/blocked.
8. Report the contract, selected workflow, and first verification checkpoint.
   When returning artifact paths, include full clickable artifact links
   (absolute path + line). Do not rely only on relative paths.
9. When auditing, closing, or marking a goal complete/blocked, produce the
   mandatory Goal Closeout Audit before any completion claim or host goal update.

## Host Rules

- Codex: create or update goal state only when explicitly goal-backed. Do not
  invent a token budget. Mark complete only after current verification. Mark
  blocked only under the host's repeated-blocker rules.
- Claude: phrase the goal as transcript-visible completion evidence because the
  evaluator judges the conversation, not hidden filesystem state.
- Other agents: produce a copy-paste prompt with the goal contract and required
  proof gates.

The parent agent owns the goal. Subagents can perform bounded research,
implementation, or review slices, but their outputs are evidence to verify, not
completion by themselves.

Phase completion is not goal completion. A finished spec review, plan creation,
plan review, or implementation slice updates the workflow state only after the
orchestrator records the verified transition. If implementation remains in
scope after plan review, `Next workflow:` is
`shravan-dev-workflow:implementation-execute-plan`, not terminal.

## Terminal Intent Guard

Do not let an old or narrow terminal condition outrank the user's actual intent.
When later user messages broaden the goal, the stale terminal condition must be
audited before any completion claim.

If the user mentions implementation, testing, screenshots, visual proof, manual
verification, benchmarking, implementation review, PR, merge, merge readiness,
or ready-to-use behavior, the terminal condition cannot be a plan, spec, or
review artifact unless the user explicitly says `planning only`,
`review only`, or that the remaining lifecycle is out of scope.

This is a terminal intent guard, not a request to implement everything at once.
It means the closeout must mark the still-scoped lifecycle gates `open` or
`blocked`, name the official next workflow, and leave the host goal not
complete.

Apply the next-workflow completion blocker before any host `update_goal
complete`: never mark complete while `Next workflow:` is
`implementation-execute-plan`, `implementation-review-swarm`,
`implementation-pr-wrapup`, visual proof, benchmarking, manual verification, PR,
merge, or release readiness unless each such gate is `done` with evidence or
explicitly `not-applicable`.

## Proof Matrix Discipline

For non-trivial goals, compile a requirements/proof matrix before routing the
next phase. The matrix may point to an existing plan/spec, or it may say
`must be defined by plan-create` when the goal starts before an implementation
plan exists.

Use the exact label `requirements/proof matrix` in goal contracts and handoff
prompts. Do not hand all verification detail to `plan-create` as a blank slate:
seed every requirement, scope boundary, stop condition, and known proof source
from the goal, then mark only genuinely missing implementation rows as
`must be defined by plan-create`.

Rows should name:

- requirement or claim
- proof source: command, artifact, review result, UI/control evidence,
  observability query, or transcript-visible evidence
- proof owner: parent, phase skill, subagent lane, external reviewer, or
  app-specific verifier
- stale-proof guard where relevant

When emitting matrix rows, use the literal row labels `proof owner:` and
`stale-proof guard:` for non-trivial rows. Do not rely on nearby prose such as
"owned by" or "current enough" to carry those gates.

Completion is parent-owned. A subagent, reviewer, UI driver, or observability
query can satisfy a row only after the parent inspects the returned evidence and
reruns or cross-checks the required proof gate when feasible.

## Goal Closeout Audit

Every goal closeout must account for lifecycle gates from the orchestration
viewpoint. This is mandatory, but it is not a command to rerun every workflow.
If spec review, plan review, implementation review, or another cycle already
happened, mark it `done` with an evidence pointer. If a cycle does not apply to
the goal, mark it `not-applicable`.

Allowed statuses are exactly:

```text
done | not-applicable | open | blocked
```

Each closeout row must include:

- gate: spec/design, plan matrix, plan review, implementation proof,
  implementation review, docs/release, parent verification, or a goal-specific
  matrix row
- status: one of the allowed statuses
- evidence: artifact path, command output, transcript note, user assertion, or
  `none`
- next: `none`, the next workflow, or the blocker

`done` is allowed only when the row has an evidence pointer. The evidence may be
`user assertion in this chat`, but it must be explicit. Rows with no evidence are
`open` or `blocked`, not `done`.

Closeout for a goal-backed multi-phase workflow must also report:

```text
Workflow state:
goal_id: <id>
Current workflow: <skill-or-state>
Next workflow: <skill-or-terminal>
Terminal condition: <exact condition>
State details: tmp/workflow-state/<goal_id>/details.md
Transition log: tmp/workflow-state/<goal_id>/events.jsonl
Latest transition source: <event id/path or none>
```

If any workflow state pointer is missing, mark parent verification `open` or
`blocked`; do not mark the goal complete from chat memory. Still print the
literal `Workflow state:` block above and fill unknown fields with `missing`.
Do not replace `Current workflow:`, `Terminal condition:`, `State details:
tmp/workflow-state/<goal_id>/details.md`, or `Transition log:
tmp/workflow-state/<goal_id>/events.jsonl` with prose such as "state pointers
are missing"; the exact labels are classifier anchors.

The final closeout must include:

```text
Goal closeout checklist:
- Gate: <gate or matrix row>
  Status: <done | not-applicable | open | blocked>
  Evidence: <path/command/transcript/user assertion/none>
  Next: <none | workflow | blocker>

Matrix closeout:
Done: <rows/gates>
Left: <open or blocked rows/gates>
Review/work cycles: <spec, plan, implementation, review, docs cycles accounted for>
Completion decision: <complete | not complete | blocked>
```

Only mark the host goal complete when every material row is `done` or
`not-applicable`. Mark it blocked only under the host blocked-state rules.

## Progressive Disclosure

- Load `references/goal-contract.md` when writing or auditing the contract.
- Load `references/codex-goal.md` when setting, resuming, completing, or blocking
  a Codex goal.
- Load `references/claude-goal.md` when preparing a Claude goal or copy-paste
  Claude prompt.
- Load `references/routing-map.md` when deciding which workflow skill should
  own the next phase.
- Load `references/handoff-prompts.md` when producing a copy-paste prompt for
  Codex, Claude, ChatGPT, or another agent.

## Output Shape

For a clear goal:

```text
Goal contract:
<objective, goal_id, required skill name, exact files, current workflow, next workflow, terminal condition, state details, transition log, scope, proof matrix, stop, blocked, checkpoint>

Host:
<Codex / Claude / copy-paste / audit>

Next workflow:
<skill name and why>

First checkpoint:
<evidence required before claiming progress>
```

For an unclear goal:

```text
Goal status:
Not clear enough to set as /goal.

Missing:
<load-bearing unknowns>

Next workflow:
shravan-dev-workflow:discuss-with-me
```

For goal closeout:

```text
Goal closeout checklist:
<gate/status/evidence/next rows using only done, not-applicable, open, blocked>

Matrix closeout:
Done: <rows/gates completed>
Left: <rows/gates open or blocked>
Review/work cycles: <cycles accounted for>
Completion decision: <complete | not complete | blocked>
```
