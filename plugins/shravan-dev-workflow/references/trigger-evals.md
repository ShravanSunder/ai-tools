# Trigger Evals

Use this plugin-level eval sheet when changing skill descriptions, routing language,
lifecycle boundaries, or release smoke behavior.

## Gate Checks

These are objective gates, not soft rules. If the answer to the gate question is
"no", the skill has not cleared the scenario.

- Whole artifact gate: if a file artifact is reviewed, handed off, or executed,
  can the agent show line count plus chunk coverage?
- Parent ownership gate: if subagents or external models ran, did the parent
  verify claims before accepting them?
- Read-only gate: if the workflow is review, discussion, handoff, audit, or
  investigation, is the diff still clean unless the skill explicitly writes
  artifacts?
- Scope gate: if validation fails outside the approved work path, did the agent
  report the blocker instead of editing unrelated infrastructure?
- Runtime visibility gate: after a plugin release, does `codex plugin list`
  report the same installed version as source?
- Goal clarity gate: if objective, scope, proof, or stop condition is unclear,
  did `orchestrator-goal` route to `discuss-with-me` instead of setting a fuzzy
  long-horizon goal?
- Artifact gate: if clear spec/plan/debug work ran and the user did not ask for
  chat-only/no-files output, did the phase skill write its lane artifact?
- Artifact lifecycle gate: if cleanup, archival, promotion, or source-of-truth
  reconciliation is needed, did `docs-maintain` own that lifecycle decision
  instead of the phase skill?

## Review Trio Routing

### spec-review-swarm should trigger

- "Attack this drafted architecture spec before we plan the implementation."
- "Council-review this design doc for missing assumptions."
- "Pressure test this API contract spec before it turns into tasks."

### spec-review-swarm should not trigger

- "Review this implementation plan before I execute it." -> `plan-review-swarm`
- "Review this PR diff for bugs." -> `implementation-review-swarm`
- "Help me write the plan." -> normal agent planning work

### plan-review-swarm should trigger

- "Validate this implementation plan against the repo before coding."
- "Poke holes in this handoff packet before another agent runs it."
- "Read this plan and tell me if execution order or validation is wrong."

### plan-review-swarm should not trigger

- "Critique this pre-plan design proposal." -> `spec-review-swarm`
- "Run reviewers over this PR." -> `implementation-review-swarm`
- "Execute this validated plan." -> `implementation-execute-plan`

### implementation-review-swarm should trigger

- "Run a review swarm on my branch diff."
- "Review this PR with subagents before merge."
- "Adversarially review the implementation in these files."

### implementation-review-swarm should not trigger

- "Review this implementation plan before code." -> `plan-review-swarm`
- "Attack this spec before planning." -> `spec-review-swarm`
- "Discuss whether this should be a feature at all." -> `discuss-with-me`

## Boundary Invariants

- Specs/designs are reviewed before plans exist.
- Plans/handoffs are reviewed after a design/spec direction exists and before execution.
- Code/diffs/PRs/commits/files are reviewed by the implementation swarm.
- Plan authoring is normal agent work, not a dedicated skill.

## Full Suite Routing

### spec-design-swarm should trigger

- "Use subagents to research this architecture before we write a plan."
- "Brainstorm competing designs for this feature and pressure-test assumptions."

Gate: no implementation diff; parent synthesis names evidence, tradeoffs, security
context, and next workflow.

### discuss-with-me should trigger

- "Let's discuss only; reflect back the plan/spec boundary."
- "Talk through this design decision before editing files."

Gate: one material question at a time, with a recommended answer and no file
edits. When multiple credible branches exist, the opposing branch is
steelmanned and the boundary, tradeoff, or assumption under pressure is named
before asking the user to decide.

### orchestrator-goal should trigger

- "Use /goal for this already-discussed release and make the completion gates explicit."
- "Turn this clear migration objective into a Claude goal prompt with proof gates."
- "Audit the active goal and tell me which workflow should own the next phase."

Gate: clear goals compile a contract with objective, scope, required reading,
proof gates, stop condition, blocked condition, checkpoint rhythm, and next
workflow.

### orchestrator-goal should not trigger

- "Make my workflow better." -> `discuss-with-me`
- "Let's discuss whether this should be a long-running goal." -> `discuss-with-me`
- "Review this PR." -> `implementation-review-swarm`
- "Execute this plan." -> `implementation-execute-plan`

Gate: unclear goals route to `discuss-with-me`; there is no inline mini
interview path inside `orchestrator-goal`.

### docs-maintain should trigger

- "Clean up README and AGENTS so they match the current plugin state."
- "Audit stale plans and tell me what should be purged or preserved."

Gate: source of truth is named before edits; destructive cleanup is proposed
before applying. Existing specs, plans, debug notes, and handoffs are classified
for cleanup, archival, or promotion; active phase work remains with its phase skill.

### ops-security-review should trigger

- "Run an authorized security scan on this PR."
- "Route this repository-wide security audit to the right Codex Security skill."

Gate: official Codex Security route selected; normal review lanes are not claimed
as audit coverage.

### plan-handoff should trigger

- "Prepare a copy-paste prompt so another agent can review this plan."
- "Package this design/spec state for a fresh session."

Gate: writes a repo-local handoff file and prints the copy-paste prompt in chat.

### implementation-handoff should trigger

- "Package this in-progress implementation for Claude to review."
- "Give me a copy-paste handoff for another agent to continue or audit this work."

Gate: current branch, diff, changed files, validation, risks, and stage are
captured; prompt is printed and written to a file.

### implementation-execute-plan should trigger

- "Validate this plan and execute it."
- "Continue from this handoff and use subagents for bounded slices."

Gate: plan is validated against live repo before edits; subagent slices have
bounded write sets; final claim includes fresh verification.

### debug-investigation should trigger

- "Root-cause this flaky failure without fixing yet."
- "Investigate why this build started failing."

Gate: diagnosis is evidence-backed before fix phase; failed hypotheses do not
stack into blind patching. Real debugging writes a debug artifact unless
chat-only/no-files was requested or the bug packet is not clear enough yet.

### skill-audit should trigger

- "Audit these skills against session evidence and upstream inspirations."
- "Find stale or duplicated skill behavior before we create anything new."

Gate: recommendations classify update/create/merge/skip and cite evidence or
source inspiration.

### tui-presentation should trigger

- "Draw out this architecture."
- "Compare these designs in chat."

Gate: output is visually structured for monospace chat, while code and config
remain copyable.

### ops-linear-tracking should trigger

- "Create Linear milestones and issues from this architecture doc."
- "Show what tickets are blocked or unblocked."

Gate: docs remain the design source of truth; tickets track status and
dependencies without duplicating long design text.
