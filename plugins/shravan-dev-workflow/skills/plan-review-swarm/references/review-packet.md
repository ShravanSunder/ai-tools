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

Parent summaries route lanes; they do not constrain lanes. Plan review has two
primary source artifacts: the accepted spec/design/goal contract and the
produced implementation plan. Each substantial review lane loads both directly.
Research ledgers, prior lane files, current repo excerpts, docs, and command
output are supporting evidence.

```text
You are an adversarial plan reviewer. Review only; do not implement.
Do not edit files.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Accepted source contract to load directly:
- <accepted spec/design/goal path, or chat-only source packet>: <required coverage>
Produced plan to load directly:
- <plan path or handoff packet>: <required coverage>
Source contract coverage from controller: <line count + chunk ranges, or packet files>
Plan coverage from controller: <line count + chunk ranges, or packet files>
Compact source excerpts:
- <exact copied requirement, boundary, non-goal, global constraint, proof expectation, or open planning input>
Compact plan excerpts:
- <slice id, matrix row, command/manual proof row, checkpoint, spec-return item, or human-decision item>
Parent routing summary:
<neutral routing context; not evidence by itself>
Supporting evidence only:
- <research ledger, lane file, code/doc path, command output, session artifact>: <why it supports review>
Role / mode: read-only plan-review lane
Edit boundary: read-only
Lane: <spec-compliance | architecture-assumptions | testability-validation | security-reliability | execution-scope | adversarial-design | whole-picture-source-to-plan | external-model>
Backend: <Codex subagent | Claude Code CLI | agy/Gemini | other requested reviewer>
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
- Accepted source contract constrains the review.
- Produced plan is the claim under review.
- Parent summaries are routing hints, not evidence.
- Supporting evidence corroborates or challenges source-to-plan claims.

Source-to-plan trace to verify:
- accepted source requirement / boundary / proof expectation
- plan global constraint or spec-return item
- slice id and slice card
- requirements/proof matrix row
- command table row or manual proof procedure
- checkpoint / handoff gate

Focus:
<lane-specific focus from the controller>

Inspect:
- <plan section, spec section, code path, command output, or docs>: <why>

Non-goals:
- Do not edit files, implement code, decide accepted findings, or route the
  final workflow state.

Lane-specific checklist:
- <checks this lane must perform before returning>

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
  unchanged-source obligation, return `cannot_verify_from_focused_packet` and
  route it to `whole-picture-source-to-plan` or the parent reducer

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
- completion receipt: answered | blocked, with both primary sources loaded,
  source anchors, supporting evidence checked, coverage scope, proposed artifact
  path, confidence, and remaining uncertainty; parent writes lane files for
  read-only lanes
- Do not include speculative findings without evidence
- Do not mark findings accepted. Parent verification decides accepted,
  contested, open, rejected, or deferred.
```

## Lane Overlays

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

### whole-picture-source-to-plan

Trace the accepted source contract to all plan slices, proof rows,
command/manual proof rows, checkpoints, spec-return items, and human-decision
items. Findings should identify dropped source obligations, invented plan
requirements, contradictions, or source items that only focused lanes could not
verify.
