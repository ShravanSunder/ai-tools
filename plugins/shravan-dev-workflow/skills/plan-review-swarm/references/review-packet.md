# Review Packet Template

Use this skill-local packet contract for a plan-review subagent prompt or
copy-paste prompt. This file owns plan-review packet anatomy, source-truth
handling, artifact coverage fields, readiness verdicts, proof-gate review,
route-back semantics, execution-scope checks, receipts, parent reducer rules,
and review-specific lane overlays.

For substantial plan-review swarms, the parent preserves an inspectable
artifact trail in the existing review workflow home. If review artifacts live
beside the source plan workflow instead, the parent ledger must point to that
source workflow and to each parent-written lane artifact path. Lane files are
candidate findings; the parent ledger is the reducer synthesis; the
implementation plan remains the accepted phase artifact only after parent
verification.

For substantial plan review, include a first-class `whole-plan-cohesion` lane.
It receives the produced plan, the accepted source spec/design/goal/handoff
artifact when one exists, required section/header anchors for both artifacts,
and any research or ledger files that constrain the plan. Focused lanes do not
replace it.

Review lanes open and read the plan artifact and accepted source artifact
themselves before judging. Controller summaries, coverage notes, and parent
claims are routing hints only; they are not substitutes for the lane's own
source-to-plan inspection.

If a shortcut or missing artifact prevents live dispatch, the parent still names
the mandatory `whole-plan-cohesion` lane in the blocked response. Do not
describe it only as generic whole-artifact or whole-picture review.

```text
You are an adversarial plan reviewer. Review only; do not implement.
Do not edit files.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Review target: <plan path or handoff packet>
Coverage from controller: <line count + chunk ranges, or packet files>
Accepted source artifact: <spec/design/goal/handoff path, or none with reason>
Source artifact coverage: <line count + chunk ranges, packet files, or limitation>
Independent read requirement:
- Open/read the plan artifact yourself.
- Open/read the accepted source artifact yourself when one exists.
- Treat controller summaries as hints, not source truth.
Primary artifact inputs:
- plan artifact: <path, required sections, and coverage>
- source artifact: <path, required sections/header anchors, and coverage; or none with reason>
Required source anchors:
- <spec requirement / source decision / plan slice / proof row / command claim>: <why this constrains the lane, or not applicable with reason when no accepted source artifact exists>
Role / mode: read-only plan-review lane
Edit boundary: read-only
Lane: <whole-plan-cohesion | spec-compliance | architecture-assumptions | testability-validation | security-reliability | execution-scope | adversarial-design | external-model>
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
- <spec section, requirement, matrix row, plan task, code path, docs, or command output>: <why this constrains the lane>

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
- source obligation -> plan home/slice -> proof row/checkpoint coverage
- stale assumptions
- missing cutovers
- API/contract mismatch
- untestable or vague steps
- hidden security/reliability failure modes
- missing or stale threat model when sensitive surfaces are touched
- ownership gaps between controller, subagents, and implementer
- contradictions with source artifacts, live repo evidence, sibling-lane
    findings, or claimed validation; report them for parent reduction

Confidence:
high | medium | low, with remaining uncertainty

Return:
- Lane: <lane name>
- Backend: <backend used>
- Verdict: ready | needs revision | blocked
- candidate findings grouped as blocker | important | question | nit
- For each finding: evidence, failure scenario, smallest plan edit, proof/test
- Coverage ledger for `whole-plan-cohesion`, `spec-compliance`, and
  `testability-validation` lanes:
  - source obligation
  - plan home/slice
  - proof row/checkpoint
  - status: covered | deferred with reason | missing | contradicted
- For security findings: validation status as validated | unvalidated with proof gap | rejected
- Proposed artifact path and candidate lane-file content, or
  "chat-only/no-files exception: <reason>"
- completion receipt: answered | blocked, with source anchors and proposed
  artifact path, confidence, and remaining uncertainty; parent writes lane files
  for read-only lanes
- Do not include speculative findings without evidence
- Do not mark findings accepted. Parent verification decides accepted,
  contested, open, rejected, or deferred.
```

## Lane Overlays

### whole-plan-cohesion

Check whether the whole plan implements the whole accepted spec/source artifact.
Findings should name missing source requirements, contradictory slices,
duplicated work, broken dependency order, proof gates that do not compose, or
plan sections that cannot be executed together as written.

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
