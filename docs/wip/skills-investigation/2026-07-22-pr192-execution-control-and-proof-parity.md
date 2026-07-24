# 2026-07-22-pr192-execution-control-and-proof-parity

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: AgentStudio PR
  #192 implementation, runtime-debugging, review-remediation, CI, and PR-wrap-up
  session.
- Related repo or workflow: `agent-studio`; PR
  `ShravanSunder/agentstudio#192`; `implementation-execute-plan`,
  `debug-investigation`, `orchestrator-goal`, `implementation-pr-wrapup`, and
  `manage-agents`.
- Date observed: 2026-07-20 through 2026-07-22.
- Session anchors: final observed PR head `dc94ace2`; final observed CI run
  `29941909906`.

## Executive Finding

This was not primarily a missing-skill failure. The existing skills already
required diagnosis before fixes, parent verification, checkpoint commits,
scope control, and fresh proof instead of relying on CI. The failure was that
those rules were not compiled into one visible execution-control loop during a
long, interruption-heavy implementation session.

The smallest useful correction is to strengthen existing skills and their
pressure scenarios. Do not create a new `stay-focused`, `deadline`, or
all-purpose execution skill.

The missing operational loop was:

```text
latest user intent
  -> one live todo and current bounded action
  -> representative evidence or reproduction
  -> one scoped change
  -> local proof at CI parity
  -> checkpoint commit
  -> fresh status receipt
  -> next bounded action
```

When reality invalidates the model, this loop stops at evidence gathering. It
does not silently continue through speculative patches, fixture-only proof, or
CI-only debugging.

## What Went Wrong

### 1. Execution state was not visible or stable

- Observed behavior: The session accumulated many simultaneous concerns and a
  large dirty worktree without one durable, user-visible todo ledger. Status
  replies repeated narrative but did not consistently report the current
  failure, next bounded action, latest proof, dirty state, or remaining gates.
- Expected behavior: Every substantial execution run carries one live todo;
  new user input is classified as replacing the current action, adding an
  in-scope requirement, or deferring a follow-up. Repeated drift warnings force
  an immediate scope re-audit.
- Cost: Work moved among selection scheduling, demand loading, runtime crashes,
  review feedback, test infrastructure, and dependency upgrades without a
  reliably inspectable control surface.

### 2. Checkpoint commits did not bound the work

- Observed behavior: Dozens of modified and untracked files accumulated across
  multiple concerns even though the user repeatedly requested checkpoint
  commits and repo policy permitted them.
- Expected behavior: Commit every proven vertical slice before switching
  problem areas, and report `HEAD`, dirty path counts, proof, and remaining
  gates at the checkpoint.
- Cost: It became difficult to distinguish validated work from experiments,
  reconstruct what happened after a time boundary, or safely review/revert one
  concern.

### 3. Reproduction did not represent the failing product class

- Observed behavior: A one-review-file fixture was treated as meaningful proof
  while the reported failure involved a real Review pane with roughly 255
  changed files and sustained heavy scrolling.
- Expected behavior: Diagnose against the affected real worktree and preserve a
  deterministic heavy fixture for regression proof. A fixture must represent
  the scale and lifecycle that activate the suspected failure.
- Cost: Favorable fixture results created false confidence while real panes
  still showed `Waiting for content`, missing metadata, or intermittent
  lifecycle failures.

### 4. Live failure evidence was destroyed too early

- Observed behavior: A wedged pane or app was restarted, closed, or cleaned up
  before its process identity, marker, logs, metrics, sibling-pane behavior,
  and trigger sequence were fully captured.
- Expected behavior: A live-runtime evidence-preservation gate runs before any
  restart or cleanup unless safety requires immediate termination.
- Cost: The strongest opportunity to distinguish pane-local, worker-global,
  process-global, and data-specific failure modes was lost, forcing another
  reproduction cycle.

### 5. Native UI control ignored the available control boundary

- Observed behavior: Pointer control interfered with the user's computer while
  the app exposed debug IPC suitable for many of the required actions.
- Expected behavior: Prefer IPC or another headless product boundary. Pointer
  takeover requires explicit coordination, a bounded action, and immediate
  release.
- Cost: Manual collaboration became harder and the control method obscured
  whether events came from product IPC or UI automation.

### 6. CI became the primary debugger

- Observed behavior: Browser integration failures were repeatedly discovered
  in GitHub Actions while local runs did not initially match CI runtime,
  package-manager, browser, flags, workload, or normal parallelism. A
  single-worker experiment risked being mistaken for a solution.
- Expected behavior: After the first CI-only scheduling failure, capture a
  local CI-parity receipt and reproduce under normal concurrency before another
  speculative patch. A favorable local pass is evidence, not disproof of a
  flaky failure.
- Cost: Long CI cycles replaced fast local causal investigation, and toolchain
  modernization became entangled with the behavioral fix.

### 7. Subagent authority was not inherited by descendants

- Observed behavior: A nominally read-only advisor crossed into repository
  mutation, directly or through delegated work.
- Expected behavior: Read-only authority applies transitively. A read-only
  agent cannot edit, stage, commit, or spawn a mutation-capable descendant;
  its receipt includes before/after worktree state.
- Cost: Candidate evidence became contaminated by unauthorized mutation and
  required parent reconstruction.

### 8. Deadline pressure expanded instead of contracting scope

- Observed behavior: Optional investigations and toolchain upgrades entered the
  critical path while the user had set a hard PR-ready deadline.
- Expected behavior: A deadline contracts the active slice to the smallest
  proof-complete path. It does not weaken required proof, but optional cleanup,
  benchmarking, dependency modernization, and separate architecture work move
  out of the critical path unless explicitly promoted by the user.
- Cost: The session ran for hours while the PR-ready terminal remained
  unproven.

## Evidence And Existing Protections

The current workflow surface already contains important protections:

- `implementation-execute-plan` requires live-repo validation, proof
  preservation, parent verification, and split/replan when required proof
  cannot pass.
- `debug-investigation` requires diagnosis before fixes, a bug packet, ranked
  hypotheses, and a return to investigation after a failed fix.
- `orchestrator-goal` requires checkpoint commits, exact state pointers, a
  terminal condition, and a parent-owned closeout audit.
- `implementation-pr-wrapup` rejects readiness from green checks alone and
  requires fresh local/PR state.
- `manage-agents` says child output is candidate evidence and the parent owns
  decisions.
- AgentStudio instructions already require IPC-aware native debugging,
  representative proof layers, checkpoint commits, no wall-clock waits, and
  Victoria-backed runtime evidence.

These protections did not fail because they were conceptually wrong. They
failed because their outputs were distributed across skills and were not made
mandatory at the execution boundary where drift occurred.

## Initial Classification

### Update: `implementation-execute-plan` — P0

- Trigger and ownership fit: This skill owns long-running implementation
  control, integration, checkpoints, and proof. It is the correct owner for the
  missing execution loop.
- `SKILL.md`:
  - require one live user-visible todo for substantial execution;
  - classify material incoming instructions as `replace`, `add`, or `defer`;
  - after repeated `off track`, `overengineering`, or equivalent drift signals,
    stop edits and re-audit the current action against goal scope;
  - checkpoint after every proven slice and before changing problem areas;
  - status receipts report `HEAD`, dirty tracked/untracked counts, current
    failure, current bounded action, latest proof, remaining gates, and a
    qualified ETA or explicit uncertainty;
  - treat deadline pressure as scope contraction, never proof weakening.
- `references/`: Add a focused `live-execution-control.md` with the todo schema,
  input-classification rules, checkpoint receipt, drift re-audit, and deadline
  contraction examples. Keep the core loop in `SKILL.md`; do not bury it only
  in the reference.
- `scripts/`: Optional small read-only status-receipt helper that reports branch,
  HEAD, dirty tracked/untracked counts, and ahead/behind state. Do not encode
  arbitrary file-count or time thresholds in a script.
- Pressure coverage: New scenario needed. Simulate a long goal with rapid user
  additions, repeated drift warnings, a hard deadline, and dozens of dirty
  files. The compliant run must stop edits, rebuild one todo, checkpoint the
  proven slice, and report the receipt before continuing.

### Update: `debug-investigation` — P0

- Trigger and ownership fit: This skill owns crashes, wedged panes, flaky
  browser tests, runtime regressions, and evidence preservation before fixes.
- `SKILL.md`:
  - add a live-runtime evidence-preservation gate before restart, close, kill,
    or cleanup;
  - require process/pane identity, marker-scoped logs and metrics, sibling
    control-surface behavior, and trigger sequence when available;
  - require a representative-reproduction declaration covering data scale,
    lifecycle, concurrency, and product path;
  - distinguish real affected-worktree diagnosis from deterministic fixture
    regression proof;
  - prefer IPC/headless control; require explicit coordination and immediate
    release for pointer takeover;
  - require a CI-parity receipt for CI-only or scheduling-sensitive failures;
  - state that one favorable local run does not disprove a flaky failure.
- `references/`: Add `runtime-evidence-and-parity.md` containing the preservation
  checklist, real-data-versus-fixture roles, parity receipt fields, control
  hierarchy, and safe restart decision. This is detailed debugging method, not
  project-specific Victoria commands.
- `scripts/`: No generic script needed. Product repos should use their existing
  process, observability, IPC, and test harnesses; a generic script would hide
  authority and environment differences.
- Pressure coverage: Two new scenarios needed: preserve a wedged pane before
  restart, and reject a one-file fixture as proof of a hundreds-of-files Review
  failure. Extend one scenario with a CI-only concurrent browser failure whose
  local toolchain differs.

### Update: `orchestrator-goal` — P1

- Trigger and ownership fit: This skill owns goal start/resume authority and
  the current workflow transition, but should not duplicate the execution todo.
- `SKILL.md`:
  - on start or resume, reconcile the latest explicit user intent before using
    saved goal state;
  - when the user clears, replaces, or questions a goal, do not reconstruct it
    from stale state or chat narrative;
  - carry the next bounded action and current proof gate in the first
    checkpoint instead of repeatedly restating the full goal;
  - route repeated execution drift to the owning phase's re-audit without
    forcing a new full mental-model recital when scope is already clear.
- `references/`: Extend `goal-contract.md` with cleared-goal and rapid-correction
  resume examples. Reuse the existing transition/state model.
- `scripts/`: Not needed; this is authority and judgment, not deterministic
  mechanics.
- Pressure coverage: New scenario needed. Start from a cleared goal followed by
  rapid scope corrections; require current intent reconciliation and one next
  action without reviving stale artifacts.
- Related recurrence:
  `2026-07-16-orchestrator-goal-stale-artifact-authority.md`.

### Update: `implementation-pr-wrapup` — P1

- Trigger and ownership fit: This skill owns the transition from local proof to
  current GitHub readiness. It should reject CI-as-debugger loops.
- `SKILL.md`:
  - after the first CI-only scheduling or environment-sensitive failure,
    require a local CI-parity audit before another speculative patch;
  - preserve normal test concurrency unless reduced concurrency is explicitly
    labeled a diagnostic experiment;
  - separate dependency/toolchain modernization from the causal bug fix unless
    the user explicitly brings modernization into scope.
- `references/`: Add `local-ci-parity.md` with receipt fields for OS/runtime,
  Node/Swift toolchains, package manager, browser, flags, sharding/concurrency,
  selected tests, and test data. Describe when a parity mismatch is explanatory
  and when it is merely correlated.
- `scripts/`: Not needed initially. Prefer repo-local task runners and CI
  configuration as the executable source of truth.
- Pressure coverage: New scenario needed. CI fails under normal parallel
  browser execution, local passes use a different Node/package-manager stack,
  and the shortcut offered is `maxWorkers=1`. The compliant response must use
  the serial run only as diagnosis and restore parity before readiness.

### Update: `manage-agents` — P1

- Trigger and ownership fit: This skill owns subagent authority, packets,
  descendants, and receipts.
- `SKILL.md`: State that permission and mutation boundaries are transitive to
  all descendants. A read-only agent may not spawn a mutation-capable child.
  On breach, interrupt the lane, exclude contaminated evidence, and inspect the
  repository before resuming.
- `references/`: Extend `agent-job-packet.md` with an inherited-authority field
  and before/after worktree receipt. Keep workflow-specific review rules in the
  owning review skills.
- `scripts/`: Not needed; repository-state capture belongs in the packet and
  receipt, using normal Git inspection.
- Pressure coverage: New scenario needed. Have a read-only reviewer spawn a
  descendant that attempts a repository mutation; require the parent to stop
  the lane, reject contaminated evidence, and verify before/after worktree
  state.
- Related recurrence:
  `2026-07-16-manage-agents-review-authority-and-mutation.md`.

### Update: AgentStudio `AGENTS.md` — P2, narrow only

- Trigger and ownership fit: The repo has concrete IPC and observability
  facilities that generic skills cannot name.
- Smallest useful change: Near native UI debugging, add a short project rule:
  preserve a live failing process/pane and its marker-scoped Victoria evidence
  before restart; prefer AgentStudio IPC for control; coordinate any pointer
  takeover explicitly; and state whether a fixture represents the failing
  Review/File scale and lifecycle.
- Detail placement: Link to existing IPC and observability architecture docs.
  Do not copy the generic evidence-preservation or CI-parity runbook into
  `AGENTS.md`.
- Scripts: No new project script is implied by this intake.
- Pressure coverage: Covered primarily by the `debug-investigation` scenarios;
  add repo-specific proof only if the instruction is later implemented and has
  an AgentStudio instruction harness.

## Deliberate Skips

### Skip: new `stay-focused` or deadline skill

The behavior has no distinct phase boundary. It belongs in
`implementation-execute-plan` as controller discipline. A new skill would add
another routing choice precisely when the session needs fewer active owners.

### Skip: broad changes to `discuss-clarify-mental-models`

The user repeatedly signaled that alignment already existed and that repeated
restatement was itself costly. The missing behavior was retention of execution
state and scope, not another full reconvergence ritual. Use the discussion
skill only when evidence actually breaks the shared model.

### Skip: broad commit/status prose in AgentStudio `AGENTS.md`

Checkpoint commits, proof gates, and status expectations already exist in the
project and workflow instructions. Their detailed execution shape belongs in
`implementation-execute-plan`; duplicating it in every repo would drift.

### Skip: generic runtime automation

AgentStudio already owns IPC, debug launchers, Victoria verification, and test
runners. The generic workflow should teach the evidence gate and parity receipt,
then call the repo-local machinery.

### Skip: bundling dependency modernization into the failure fix

Vitest, Vite, Node, and pnpm upgrades may be valid work, but they are not
automatically causal. Unless parity evidence proves the old toolchain is the
root cause or the user explicitly requests the upgrade, modernization is a
separate scoped change with separate proof.

## Recommended Implementation Order

1. Update `implementation-execute-plan` and add its execution-control pressure
   scenario.
2. Update `debug-investigation`, add the runtime-evidence reference, and add the
   representative-reproduction/parity scenarios.
3. Update `manage-agents` descendant authority and receipt coverage.
4. Update `orchestrator-goal` resume reconciliation without duplicating the
   execution ledger.
5. Update `implementation-pr-wrapup` local CI-parity boundary.
6. Decide whether the narrow AgentStudio `AGENTS.md` addition is still needed
   after the generic debugging skill is pressure-proven.

Each accepted item should move through `skills-creation` independently. This
intake should remain until those changes are implemented and pressure-tested,
then be promoted to a workflow changelog or deleted according to
`docs-maintain`.

## Next Step

- What evidence is still missing: Exact private transcript/event pointers for
  each failure group. The behavioral evidence summarized here is sufficient to
  evaluate the proposed skill boundaries without publishing sensitive
  transcript excerpts.
- Who or what should inspect it next: `skills-creation`, one accepted skill at
  a time, beginning with `implementation-execute-plan`; each change must include
  its named pressure scenario before release.
