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
- Proof-chain gate: if implementation is reviewed or called done, does the
  proof map back to requirements/spec/plan?
- Red/green gate: for behavior changes, did the proof include
  failing-before-passing evidence or a documented approved exception?
- Plan proof gate: before execution, does the plan map each material
  requirement to a proof layer?
- Split proof gate: if the required proof cannot pass at the current scope, does
  the workflow split or replan instead of weakening proof?
- Artifact-link gate: when a spec, plan, review report, changelog, handoff,
  debug artifact, or other human-openable file is reported, is there a full
  clickable artifact link (absolute path + line)?
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

Gate: treats the spec as claims, requires a threat model or explicit
non-sensitive rationale, and checks proof expectations or explicit deferral to
`plan-create`.

### spec-review-swarm should not trigger

- "Review this implementation plan before I execute it." -> `plan-review-swarm`
- "Review this PR diff for bugs." -> `implementation-review-swarm`
- "Help me write the plan from this spec." -> `plan-create`

### plan-review-swarm should trigger

- "Validate this implementation plan against the repo before coding."
- "Poke holes in this handoff packet before another agent runs it."
- "Read this plan and tell me if execution order or validation is wrong."

Gate: whole-artifact coverage; plans missing the requirements/proof matrix
(without a documented compact proof line) or with proof gates that cannot pass
at task size are `needs revision`.

### plan-review-swarm should not trigger

- "Critique this pre-plan design proposal." -> `spec-review-swarm`
- "Run reviewers over this PR." -> `implementation-review-swarm`
- "Execute this validated plan." -> `implementation-execute-plan`

### implementation-review-swarm should trigger

- "Run a review swarm on my branch diff."
- "Review this PR with subagents before merge."
- "Adversarially review the implementation in these files."

Gate: verifies candidate findings against artifacts; missing or unmapped
implementation proof yields `not_ready`.

### implementation-review-swarm should not trigger

- "Review this implementation plan before code." -> `plan-review-swarm`
- "Attack this spec before planning." -> `spec-review-swarm`
- "Discuss whether this should be a feature at all." -> `discuss-with-me`

## Boundary Invariants

- Specs/designs are reviewed before plans exist.
- Plans/handoffs are reviewed after a design/spec direction exists and before execution.
- Code/diffs/PRs/commits/files are reviewed by the implementation swarm.
- Spec/design handoff packages pre-plan context; it does not create the plan.
- Plan creation turns spec/design context into a written implementation plan; it
  does not execute code.
- Plan handoff packages an existing implementation plan; it does not package
  raw spec/design context as though a plan exists.
- Implementation handoff requires implementation state such as branch, diff,
  changed files, validation, failed commands, or blocker evidence.

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

Gate: broad evidence gathering, prior-art research, current docs/web research,
Reader research, memory mining, and session-log searches are routed to
`research-swarm` after the decision boundary is named.

### research-swarm should trigger

- "Research the prior art and write a tmp evidence ledger."
- "Use subagents to look through code, docs, DeepWiki, Reader, and session logs."
- "Find source-grounded evidence before we decide the design."

Gate: research questions are framed before lane dispatch; local re-anchor happens
before external comparison when a repo is involved; claims are labeled as direct
observation, cited source summary, user-memory evidence, inference, or
unresolved.

### research-swarm should not trigger

- "Grill my understanding before we decide." -> `discuss-with-me`
- "Shape the architecture from this evidence." -> `spec-design-swarm`
- "Review this implementation plan." -> `plan-review-swarm`

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
- "Package this existing implementation plan for a fresh session."

Gate: an implementation plan exists; writes a repo-local handoff file and prints
the copy-paste prompt in chat. The packet carries the requirements/proof matrix
and any open proof gaps.

### spec-handoff should trigger

- "Package this design/spec state for a fresh session."
- "Prepare a copy-paste handoff for this architecture proposal before planning."

Gate: packages spec/design context, decisions, non-goals, open questions, and
evidence without creating an implementation plan or calling the spec complete.
The packet carries spec proof expectations or explicitly defers proof definition
to `plan-create`.

### plan-create should trigger

- "Turn this reviewed spec into an implementation plan."
- "Create the task sequence and validation plan from this design."

Gate: stays read-only, creates a written implementation plan, and routes review
to `plan-review-swarm` or execution to `implementation-execute-plan`. The plan
maps material requirements to proof gates and splits work whose proof cannot
pass at the proposed scope.

### plan-improve-repo should trigger

- "Audit this repo and make plans for high-leverage improvements."
- "Find the next refactors worth doing, but do not code them."
- "Validate the improvement backlog and tell me what is ready to execute."

Gate: stays read-only against source, vets candidates against files, writes one
focused plan per accepted improvement, validates plan readiness, and routes
execution to `implementation-execute-plan`.

### plan-improve-repo should not trigger

- "Turn this spec into an implementation plan." -> `plan-create`
- "Execute this existing plan." -> `implementation-execute-plan`
- "Review this plan for holes." -> `plan-review-swarm`

### implementation-handoff should trigger

- "Package this in-progress implementation for Claude to review."
- "Give me a copy-paste handoff for another agent to continue or audit this work."

Gate: current branch, diff, changed files, validation, risks, and stage are
captured; implementation proof is included; prompt is printed and written to a
file.

### implementation-execute-plan should trigger

- "Validate this plan and execute it."
- "Continue from this handoff and use subagents for bounded slices."

Gate: plan is validated against live repo before edits; subagent slices have
bounded write sets; final claim includes fresh implementation proof. If proof
cannot pass inside the approved scope, split or replan.

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
