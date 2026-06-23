# Review Packet Template

Use this for a subagent prompt or copy-paste prompt.

Consume `../../references/lane-contract.md` as the shared lane packet contract.
This file only adds plan-review lane overlays:
adversarial plan critique, readiness verdicts, proof-gate review, route-back
semantics, and execution-scope checks remain owned here.

For substantial plan-review swarms, the parent preserves an inspectable
artifact trail in the existing review workflow home. If review artifacts live
beside the source plan workflow instead, the parent ledger must point to that
source workflow and to each parent-written lane artifact path. Lane files are
candidate findings; the parent ledger is the reducer synthesis; the
implementation plan remains the accepted phase artifact only after parent
verification.

Substantial plan review has two primary artifacts: the accepted source artifact
and the produced implementation plan. Every substantial lane loads both
directly. Compact excerpts route attention, parent summaries are routing
hints, and supporting evidence corroborates or challenges claims; neither can
substitute for direct loading of the primary artifacts.

Substantial plan review always includes `whole-plan-cohesion`. Focused lanes
can find local defects, but they do not replace the canonical whole-plan lane
and parent-only coverage does not satisfy the lane requirement.

```text
You are an adversarial plan reviewer. Review only; do not implement.
Do not edit files.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Accepted source artifact to load directly:
- <accepted spec/design/requirement/goal/handoff path, or full anchored chat source packet>: <required coverage>
Produced plan to load directly:
- <plan path or handoff packet>: <required coverage>
Accepted source coverage from controller: <line count + chunk ranges, or packet files>
Produced plan coverage from controller: <line count + chunk ranges, or packet files>
Compact binding excerpts from source:
- <exact source requirement, boundary, non-goal, proof expectation, open decision, or source anchor>
Compact binding excerpts from plan:
- <slice id, matrix row, command/manual proof row, checkpoint, route-back item, or human-decision item>
Parent routing summary:
<neutral routing context only; not evidence>
Supporting evidence:
- <research ledger, lane file, code/doc path, command output, session artifact>: <why it supports review>
Role / mode: read-only plan-review lane
Edit boundary: read-only
Lane: <whole-plan-cohesion | spec-compliance | architecture-assumptions | testability-validation | security-reliability | execution-scope | adversarial-design>
Durable lane reference loaded:
- references/lanes/<lane>.md
Backend: <Codex subagent | Claude Code CLI | agy/Gemini | other requested reviewer>
External counsel:
- <not requested | requested; load references/external-counsel.md and use it as backend safety guidance>
Reasoning effort: medium | high
Bounded question: <the one review question this lane answers>
Decision target: <plan readiness decision, finding class, proof gate, or route-back decision this lane informs>

security context: <applicable | not applicable>
- If not applicable: <short reason>
- If applicable: <pointer to parent security context plus lane deltas, or
  assets/entry points/untrusted inputs/trust boundaries/sensitive data/
  privileged actions/security non-goals/required proof>

Plan summary:
<brief neutral summary>

Major claims to verify:
1. <claim>
2. <claim>

Relevant files/docs to inspect:
- <path>: <why>
- <path>: <why>

Source-of-truth inputs:
- Accepted source artifact constrains the review.
- Produced plan is the claim under review.
- Parent routing summaries are not evidence.
- Supporting evidence is secondary and must be distinguished from source truth.

Source anchors:
- <source requirement / boundary / proof expectation / plan slice / proof row>: <why this constrains the lane>

Source-to-plan trace to verify:
- accepted source requirement, boundary, non-goal, or proof expectation
- plan global constraint, slice, task packet, checkpoint, or route-back item
- requirements/proof matrix row
- command table row, manual proof procedure, smoke/e2e/CI/PR/release gate

Focus:
<lane-specific focus from the controller>

Inspect:
- <plan section, spec section, code path, command output, or docs>: <why>

Non-goals:
- Do not edit files, implement code, decide parent-verified findings, or route
  the final workflow state.

Lane-specific checklist:
- Load `references/lanes/<lane>.md`.
- Perform the lane-specific checklist from that durable reference.

Always check:
- source-to-plan correlation
- source requirements, boundaries, non-goals, global constraints, proof
  expectations, and open questions dropped by the plan
- plan obligations invented without source authority
- stale assumptions
- missing cutovers
- API/contract mismatch
- untestable or vague steps
- hidden security/reliability failure modes
- missing or stale threat model when sensitive surfaces are touched
- ownership gaps between controller, subagents, and implementer
- contradictions with source artifacts, live repo evidence, sibling-lane
    findings, or claimed validation; report them for parent reduction
- when a focused packet cannot verify a cross-slice, cross-artifact, or
  unchanged-source obligation, set `cannot_verify_from_focused_packet` and
  route the issue to `whole-plan-cohesion` or the parent reducer

Confidence:
high | medium | low, with remaining uncertainty

Return:
- Lane: <lane name>
- Backend: <backend used>
- Verdict: ready | needs revision | blocked
- primary_sources_loaded
- supporting_evidence_checked
- source_truth_distinction_checked
- coverage_scope
- cannot_verify_from_focused_packet
- candidate findings grouped as blocker | important | question | nit
- For each finding: evidence, failure scenario, smallest plan edit, proof/test
- For security findings: validation status as validated | unvalidated with proof gap | rejected
- Proposed artifact path and candidate lane-file content, or
  "chat-only/no-files exception: <reason>"
- completion receipt: answered | blocked, with primary_sources_loaded,
  supporting_evidence_checked, source_truth_distinction_checked,
  coverage_scope, cannot_verify_from_focused_packet, source anchors, proposed
  artifact path, confidence, and remaining uncertainty; parent writes lane
  files for read-only lanes
- proposed artifact path
- Do not include speculative findings without evidence
- Do not mark candidate findings as accepted. Parent verification decides final
  disposition: accepted, contested, open, rejected, or deferred.
```

## Lane Overlays

Inline overlays are compact summaries for packet assembly. Before dispatching a
selected lane, load its durable checklist from `references/lanes/<lane>.md`.

### whole-plan-cohesion

Mandatory for substantial plan review. Check whether the full plan implements
the accepted source artifact as one coherent executable plan: source
requirement to plan home, vertical slice composition, task order, parallel lane
consistency, proof gates attached to the work they prove, and missing,
duplicated, contradictory, too-broad, or unprovable plan units.

### spec-compliance

Check whether the plan satisfies the stated goal, user constraints, accepted
spec/design, and requirements. Findings should name the source row or section
that the plan misses or changes.

### architecture-assumptions

Challenge module boundaries, ownership, data flow, dependency direction, shared
state, and hidden coupling. Findings should show the failure or future change
that makes the assumption costly.

### testability-validation

Check whether proof gates prove the stated requirements. Verify source
requirement references, testing-pyramid layers, red/green requirements, proof
modalities, evidence sources, and freshness guards. Include manual UX, visual,
data/DB/state, logs, traces, metrics, OTel, smoke, e2e, CI, PR, and release
artifact proof where the plan surface calls for them.

### security-reliability

Review trust boundaries, secrets, permissions, rollback, cleanup, races,
observability, and partial-failure handling. Security findings need a misuse or
failure path through the planned work.

### execution-scope

Check ordering, parallelization, integration gates, task packet clarity,
allowed write scopes, migration completeness, and parent validation points.

### adversarial-design

Probe assumptions, contradictions, tradeoffs, and simpler alternatives that
would change the implementation plan or route back to spec creation.
