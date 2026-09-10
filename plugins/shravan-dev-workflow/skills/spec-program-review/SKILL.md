---
name: spec-program-review
description: Use when classifying whether a specification-only or program-only change semantically requires independent review, or when independently reviewing a Specification, Program Design, or complete Requirements, Specification, and Program Design set for authority, requirements, reader understanding or readability, architecture, failure, traceability, scope fidelity, crux, call-path, or planning-readiness gaps. Classification or review only; not for editing, remediation, acceptance, plan review or implementation review (implementation-review), creating/updating/evaluating one named runtime skill package, or a standalone security scan, audit, or threat model.
---

# Specification and Program Design Review

Review is independent reconstruction of the smallest system that satisfies the confirmed goal. It is not proofreading, design by committee, or a search for mechanisms to complete.

The reviewer rebuilds and challenges:

```text
Requirements: WHY, for whom, and within what boundary?
  -> Specification: WHAT must be observably true?
  -> Program Design: HOW will the internal system satisfy it?
  -> existing foundation and structural realization
  -> current/proposed calls, state, failure, and proof
  -> reader understanding and planning readiness
```

Requirements, Specification, and Program Design are separate authoritative concepts. Review reconstructs each one independently before judging their agreement; agreement inside a combined `Requirements/spec` document cannot substitute for a separately identifiable Requirements source and Specification.

Fresh context, read-only access, and candidate-only authority create independence. The parent is the review coordinator: it reads the complete target set and governing sources itself, chooses the lanes for this invocation — the mode-complete reviewer always, chunk lanes along the artifact seams when the set is large, dispel always, proof-challenge and focused lanes only for a named reason — then verifies every candidate against the rails (accepted requirements, Specification obligations, confirmed goal boundary), tests deletion before addition, and owns the coverage-bound result. This skill never edits artifacts, mutates their lifecycle, plans, or accepts a design.

Prefer one independent review-and-correction round. After parent verification, allow one second normal round only when a concrete source-backed substantive issue remains or was introduced within the agreed design; pedantic, stylistic, already-satisfied, confidence-only, and generic-freshness concerns do not qualify. Each round may span both semantic owners through the ordered `spec-design -> program-design` route, with each affected artifact corrected at most once in that round and every corrected anchor parent-verified. A third normal review requires explicit user permission given after the second result is visible.

Disposition comes before remediation. Reject pedantic, stylistic, already-satisfied, or otherwise non-semantic findings with source evidence and continue. Route each valid correction set inside the settled mental model to its semantic owner. If a finding disproves a load-bearing assumption or exposes unmade owner meaning, return the failed assumption, evidence, consequence, and exact owner as `decision-needed` or `blocked`; do not spend the remediation allowance to push through a mental-model break. When the same result also contains an accepted bounded correction, preserve it explicitly as one `spec-design -> program-design` remediation round after the owner decision, with each affected artifact corrected at most once and one parent verification against the original findings; the break still stops current continuation and no second reviewer is dispatched.

## Operations

```text
classify-review-requirement
  requested future mode: specification-only | program-only
  returns: review-required | non-substantial, or blocked input
  dispatches: no reviewer

review
  mode: specification-only | program-only | three-artifact-design
  three-artifact-design targets:
    Requirements identity
    Specification identity
    Program Design identity
  result: ready | needs-revision | blocked | decision-needed
  coverage: current meaning coverage for every target; uncertain semantic effect is stale
  lanes: mode-complete reviewer always; chunk reviewers along artifact seams when
    the set is large; dispel always after those receipts; proof-challenge when the
    design cites executable proof; focused lanes one per named unresolved risk
```

Review coverage follows meaning, not changed bytes. After each permitted correction round, the parent performs and records a semantic-change check before deciding whether review is complete:

- if meaning changed inside the accepted correction and every accepted finding is resolved, preserve the review as the independent finding source and add parent-verified correction anchors for every accepted finding;
- if the parent verifies that meaning did not change—for example, a formatting, link-repair, process-metadata, or typo-only edit—carry the existing semantic coverage forward and dispatch no model reviewer;
- after the first round, if a concrete source-backed substantive issue remains or was introduced within the agreed design, admit the one permitted second normal round; reject a rerun based only on pedantry, style, an already-satisfied finding, confidence, or generic freshness;
- after the second normal round, any third normal review stops `review-permission-required` until the user explicitly approves it.

Closure is established by the latest permitted review result plus parent-verified correction evidence for the current artifacts. Keep this call-scoped record out of durable design artifacts and do not add persistent review bookkeeping.

## 1. Guard the Skill-Authoring Boundary

Record `target classification: general-domain | runtime-skill-package`.

IF the target is one named runtime skill package, require the explicit `skills-creation` parent packet/result identity authorizing this review composition. Without it, return the `skills-creation` route and stop before classification or reviewer dispatch.

Completion: target classification and, when applicable, the `skills-creation` parent identity are recorded.

## 2. Classify Review Requirement

IF operation is `classify-review-requirement`, load `references/classifying-review-requirement.md` and return its `review-required | non-substantial` result or blocked missing-input result.

Dispatch no reviewer, select no lanes, and return no review verdict. `review-required` instructs the caller to make a separate fresh review invocation.

Completion: classification returns immediately with zero reviewer dispatches.

## 3. Prepare the Review

For operation `review`, require:

```text
target classification and skills-creation parent identity when applicable
mode and complete target identities: file paths or separately labeled in-chat records
governing sources, authority states, and coverage basis
confirmed goal boundary and accepted requirements set, or the exact authority gap
structural-realization confirmation for program-only or three-artifact-design, or the exact owner decision still needed
constraints and non-goals
risk predicates
claimed proof evidence or gaps
review question when narrower than readiness
prior review coverage and semantic-change record when coverage is being reused
bounded design-review status: no prior review | one prior round with a concrete source-backed substantive residual | explicit user permission for a third review | one orchestrator-authorized recovery request
```

One orchestrator-authorized recovery is admissible when the prior result is unavailable, the current target and governing sources were inspected, the missing evidence and reason were recorded, and no prior recovery is known. Preserve existing limits and unknown history; recovery does not reset them, add a correction round, replace an available result, or authorize another recovery. Reject repeated recovery and stale, wrong-source, or unverified inputs. If the remaining correction allowance is exhausted or unknown, report the findings and ask before correction. Route any material design break or newly exposed owner decision to its owner.

MUST load `../../shared-references/requirements-specification-program-design.md` and return the Requirements, Specification, and Program Design identity status for the selected mode. `specification-only` inspects separately identifiable Requirements and Specification sources. `program-only` and `three-artifact-design` inspect separately identifiable Requirements, Specification, and Program Design sources. Reuse resolvable file pointers for file-backed records. Separately labeled in-chat records are copied verbatim into the tmp review packet — a fresh reviewer cannot follow a pointer into a conversation — but never into a durable combined review artifact.

Use the owner-confirmed requirements record and confirmed goal boundary when available. Otherwise use the last inspectable owner-accepted governing source. If neither exists, or they conflict, return the authority gap. Mutually narrowed current files never establish the accepted requirements set by themselves.

A combined `Requirements/spec`, a Requirements-titled artifact that also stands in for the Specification, or an absent separate Requirements or Specification identity is a concrete blocker-level design finding, not permission for review to infer the missing identity. Record `needs-revision`, route the smallest correction to `spec-design`, and do not repair or create either artifact during review. Continue only with bounded findings that the available sources can support; never return `ready`.

`program-only` also requires the governing Specification. `three-artifact-design` requires the current Requirements, Specification, and Program Design. A missing confirmed goal boundary, or missing structural-realization confirmation for `program-only` or `three-artifact-design`, may produce `decision-needed`; review does not infer acceptance from silence or a status label.

Completion: the complete target set, governing sources, accepted requirements, boundaries, open authority decisions, and any prior-coverage semantic-change record are unambiguous; any recovery request is explicitly admitted or rejected with its reason.

If one normal review-and-correction round already ran, admit a second normal round only for the recorded concrete source-backed substantive residual above. If two normal rounds already ran, require explicit user permission granted after the second result before a third normal review. An admissible orchestrator-authorized recovery request follows the one-time exception above and never resets or adds normal review or correction allowance. Switching modes, lanes, target labels, caller skills, or unknown history does not reset either boundary.

## 4. Select the Mode

The selected mode reference owns its review judgment:

```text
specification-only -> references/reviewing-specification.md
program-only       -> references/reviewing-program-design.md
three-artifact-design -> references/reviewing-three-artifact-design.md
```

Specification review judges the governing Requirements authority and the Specification's observable What. Program review judges structural How and realization of the governing Specification. Three-artifact design review independently repeats both and judges traceability, integration, and planning readiness.

Completion: exactly one mode and its complete required artifact set are selected.

## 5. Resolve Reviewer Runtime and Authority

MUST use `manage-agents` before each reviewer dispatch and return the single-assignment `Delegate` pattern, model and reasoning, reviewer history `none` — on native runtimes fork = none (Codex `fork_turns="none"`, a new Claude or Cursor agent with no resume), never a self-fork; on ACPX, a new session — read-only workspace access, runtime, permissions, packet, and receipt mechanics. The one exception is `proof-challenge`: its packet records an execution grant naming exactly the proof commands the design cites, with output under project `tmp/` or system tmp; every lane may write there, none edits a tracked file. When a lane's seam touches auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, agent, or external-service surfaces, escalate that lane's reviewer to a Frontier Delegate through `manage-agents` (reviewer-only per its catalog) and note which model ran.

Every reviewer gets the complete targets and governing sources but no parent conversation history, author conclusion, expected verdict, prior praise, or hidden context, and reads every artifact it receives completely before substantive findings. Reviewer findings remain candidate-only. Silence is `no-receipt`, never a clean review.

Coverage from a receipt expires when a later semantic change outside the accepted correction affects the mode dimensions, focused-lane predicate, or finding coverage it supplied. Parent-verified correction inside a permitted round and parent-verified non-semantic edits preserve coverage. After normal round one, only a concrete source-backed substantive residual admits normal round two; after normal round two, expanded or uncertain meaning stops `review-permission-required` until the user explicitly approves a third normal review.

Completion: fresh-context, read-only, candidate-only dispatch mechanics are recorded before the reviewer runs.

## 6. Choose the Lanes and Dispatch the Artifact Reviewers

Read the complete target set and governing sources yourself first — every artifact whole — so the choices below come from your own reading, not a summary.

MUST load `references/coordination-and-chunking.md` and return the chunk plan (or the decision that the mode-complete reviewer alone covers the artifacts), the overlap seams, and the lanes to run with the reason for each; that reference owns design-chunk semantics, seam rules, and lane order.

MUST load `references/lanes/lane-schema.md` and return the filled shared packet for every dispatch below. Its `lane instructions` field carries the absolute paths of every reference the bullets below say the subagent loads, or their inlined text when the runtime cannot read the plugin cache — a reviewer dispatched into the reviewed repo cannot resolve this skill's relative paths; its goal-boundary field carries quoted statements with authority sources, and its constraints carry the authority that imposed them. Reviewers are never started from the coordinator's own conversation (no self-fork).

MUST dispatch `mode-complete-reviewer` to a fresh subagent using that packet. The subagent loads `references/lanes/lane-schema.md` and `references/lanes/mode-complete-reviewer.md`; that lane MUST load `references/reviewing-common-method.md` and the selected mode reference before inspection. Parallel-safe after the complete target and governing-source set exists. Instance authority is fresh-context, read-only, candidate-only, and equal to or narrower than the lane maximum. Return `complete | partial | blocked`, or parent-recorded `no-receipt` after explicit follow-up; the parent verifies and reduces it.

IF the chunk plan composes chunks, dispatch one `chunk-reviewer` per chunk using the shared packet plus that chunk's seam assignment and overlap seams. The subagent loads `references/lanes/lane-schema.md` and `references/lanes/chunk-reviewer.md`; that lane loads `references/reviewing-common-method.md` and the selected mode reference for its seam's dimensions only. Parallel-safe across chunks and with the mode-complete reviewer once the shared context exists. Instance authority is fresh-context, read-only, candidate-only; a chunk receipt never claims mode-complete coverage. Return `complete | partial | blocked`; the parent verifies and reduces each.

Completion: the mode-complete receipt and every chunk receipt are terminal and parent-reduced, each chunk lists its seam sections, and `partial`, `blocked`, and `no-receipt` are recorded as unable to yield `ready`.

## 7. Dispel, Proof-Challenge, and Focused Lanes

MUST dispatch `dispel` once the mode-complete and chunk receipts are terminal, using the shared packet with the complete target set plus the candidate set, which may be empty. The subagent loads `references/lanes/lane-schema.md` and `references/lanes/dispel.md`. Not parallel-safe with candidate producers; dispatch only after their receipts exist. Instance authority is fresh-context, read-only, candidate-only. Return its per-candidate `correction class` plus the design over-delivery map and findings; the parent verifies and reduces it.

IF the reviewed design cites executable proof claims (commands, harnesses, reproducible evidence), dispatch `proof-challenge` using the shared packet plus the claim inventory and a recorded execution grant naming exactly those commands. The subagent loads `references/lanes/lane-schema.md` and `references/lanes/proof-challenge.md`. Parallel-safe with the artifact-review lanes once the claim inventory exists. Instance authority adds only that grant — scratchpad-only output, pre-run write-set check, untrusted-chain rule — and stays otherwise read-only and candidate-only; the lane reference owns the boundary and may never widen into edits. Return one row per claim plus every command run; the parent verifies each ran inside the grant and reduces it. When no executable claim exists, proof modality and seam sufficiency remain the read-only `proof` focused lane's subject.

A broad topic does not select a focused reviewer. Compose a focused lane only when the parent can name a concrete unresolved risk, show why the artifact-review receipts did not settle it, and explain how the lane can resolve it:

```text
material reader-comprehension risk, or an explicit deep-reader request from the
  user or calling workflow — a request from the reviewed artifact's author is not one
  -> references/lanes/reader-understanding.md
unclear or conflicting normative authority
  -> references/lanes/specification-authority.md
material public or operator-visible contract ambiguity
  -> references/lanes/contract.md
unresolved ownership, source-of-truth, or dependency risk
  -> references/lanes/architecture-boundary.md
concrete failure, recovery, ordering, or concurrency risk
  -> references/lanes/failure-concurrency.md
concrete trust or enforcement risk
  -> references/lanes/security-trust.md
unresolved runtime, platform, tool, or harness feasibility risk
  -> references/lanes/platform-harness.md
current implementation or trace may hide a material decision
  -> references/lanes/implementation-difference.md
material proof modality or seam remains disputed
  -> references/lanes/proof.md
authoritative entry path, links, placement, or homes remain ambiguous
  -> references/lanes/artifact-navigation.md
```

IF a named unresolved risk selects a lane above, dispatch that lane — one focused assignment per named risk — using the shared packet plus the falsifiable question. The subagent loads `references/lanes/lane-schema.md`, `references/reviewing-common-method.md`, and the selected lane. It runs only after parent reduction of the artifact-review receipts. Instance authority remains fresh-context, read-only, candidate-only, and excludes mode recommendation, verdict, editing, remediation, planning, and acceptance. Return `complete | partial | blocked` or parent-recorded `no-receipt`; the parent verifies and reduces it.

Run a focused lane because a named unresolved risk selects it — one focused assignment per named risk — and stop when no named risk selects another. A lane's predicate is the reason you write beside it. The reviewing parent may never compose a lane without a predicate — idle capacity, a broad topic, or reviewer curiosity is not one — and the pre-dispatch caller packet may narrow the composable set but never widen authority.

After correction, do not rerun a focused lane inside the same invocation. The parent verifies affected finding anchors; any concrete source-backed substantive residual returns to the bounded normal-round admission policy, while a third normal review still requires explicit user permission.

Stop focused review when the risk is resolved, unsupported, outside the confirmed goal boundary, or needs an owner decision.

Completion: the dispel receipt is terminal; proof-challenge ran when the design cites executable proof and its receipt is terminal; every focused lane you ran has a terminal receipt and the risk that selected it written beside it; and any lane the caller, the artifact's author, or your own reduction proposed that you did not run has the reason it was not needed.

## 8. Verify Reviewer Independence

Confirm each receipt matches its assignment, reviewer history was empty, authority stayed candidate-only, and the reviewer did not mutate the reviewed targets. Ordinary lanes must show access remained read-only; the `proof-challenge` receipt instead must show every command it ran appears in the packet's recorded execution grant with scratchpad-only output — a granted command passes, an unlisted command or any worktree write fails. Compare the covered target text to the reviewed target text. A later permitted remediation is closed by parent verification against accepted findings; it never causes automatic redispatch.

Completion: each used receipt supplies semantically current coverage for the current target text, and no reviewer widened its authority beyond its lane maximum and recorded grant or mutated the worktree.

## 9. Verify and Reduce Findings

MUST load `references/finding-and-reduction-schema.md` and return its dispositions, merged duplicates/conflicts, coverage gaps, goal-relevance record, deletion-first decision, scope effect, and final coverage-bound result.

Re-anchor before accepting a finding: identify the confirmed requirement or goal-boundary field it serves, whether the existing foundation already satisfies it or can supply the correction, the concrete failure if unresolved, the smallest correction, whether the confirmed obligations still hold without the questioned mechanism, whether the proposed mechanism is the smallest change that serves the quoted clause or one of several, and whether the correction stays inside the confirmed goal boundary. Then return the existing `accepted | rejected | contested | unverified` disposition; do not create a second checkpoint status. When evidence is missing, follow that reference's evidence-lookup branch before accepting. Question whether a proposed mechanism is needed before accepting findings that merely complete its missing contracts.

Every finding uses the complete Finding shape from the loaded schema. For the caller-facing explanation, write every returned finding in ordinary language, whether it is an unreduced reviewer candidate or has the parent disposition `accepted | rejected | contested | unverified`. Each explanation includes:

- a title naming the concrete problem rather than a review method;
- what is wrong and where the evidence appears;
- the affected confirmed requirement or design relationship and concrete consequence;
- the smallest correction, followed by a separate `Route:` line naming `spec-design`, `program-design`, `caller`, or ordered `spec-design -> program-design`;
- the evidence or affected review coverage that would confirm the correction.

Do not leave the route implicit from the artifact or section named. Record parent disposition separately after reduction; unreduced candidate status does not waive the useful finding fields. A review label may summarize the explanation but may not replace any field.

For each material proof claim, compare the claimed outcome with the supplied evidence's actual observation boundary. State what the evidence proves, what it cannot observe, and the smallest missing proof modality or structural observation seam. Do not collapse distinct unsupported claims into generic “runtime proof”; match each claim with the smallest observation that could confirm or falsify it. For each applicable diagram, name the reader question it should answer and compare its visible owners, direction, state or effect, normal and error behavior, and changed edges with the written requirements and design. Rendering or repeated labels alone do not establish usefulness or agreement.

Classify each requested correction by the concept it affects: `Requirements`, `Specification`, `Program Design`, or a named combination. A Program Design-only correction preserves Requirements and the observable Specification unless the owner explicitly changes them.

Route accepted corrections by semantic owner:

- `Requirements` returns to `spec-design`, using `discuss-pathfinding` when owner meaning is missing;
- `Specification` returns to `spec-design`;
- `Program Design` returns to `program-design`;
- any correction spanning Requirements or Specification plus Program Design returns to `spec-design` first, then `program-design` after the observable contract is settled.
- `caller` returns the exact owner/caller decision; review does not resume until that decision is resolved.

Reject prose taste without reader or design effect. Missing evidence is `unverified`. Preserve real disagreement as contested. Two kinds of scope expansion get two different dispositions: a reviewer candidate that proposes adding scope with no rail anchor — new persistence, history, identity, governance, certification, control planes, external services, resilience layers — is `rejected: scope expansion` and listed for the owner as an observation, never `decision-needed`; anchoring it one altitude up does not rescue it when the mechanism is one of several ways to serve the quoted clause, and an accepted finding then names the unrealized obligation, never the reviewer's mechanism. A design element the artifacts already contain that dispel mapped `absent` is never rejected as harmless: it returns `decision-needed` with deletion as the default recommendation, or `needs-revision` routed to `program-design` when the owner has already declined it. When the parent's disposition contradicts dispel's correction class, record the quoted rail text that overrides it.

Completion: every candidate has a source-backed disposition; every finding uses the complete loaded Finding shape and contains each caller-facing field above regardless of disposition or final verdict; and no accepted finding silently changes the confirmed goal or accepted requirements.

## 10. Return the Coverage-Bound Result

Return every field in the `Coverage-Bound Result` owned by `references/finding-and-reduction-schema.md` for the current mode and targets.

`ready` means the reviewed artifact meaning satisfies the invoked mode. When accepted bounded findings are remediated, downstream callers may continue only with the original result plus complete parent-verified remediation evidence. Rejected non-semantic findings need no remediation. A mental-model break remains a stop until its owner supplies settled meaning. Durable artifacts remain about their subject matter and do not acquire review lifecycle or acceptance status.

After parent reduction, return either a stop or exactly one recommended next skill using the route and compact-handoff procedure in the loaded reference. Reviewer candidates never select this route. When validated findings span Requirements or Specification plus Program Design, recommend `spec-design` first and carry the complete accepted set; the later Specification result decides whether `program-design` follows. Recommend `discuss-pathfinding` only when complete review evidence establishes that the current model fails and replacement owner meaning is genuinely unmade, and include the review-selected return owner. A current authoritative correction routes directly to its semantic owner; missing evidence stops.

Completion: the result names the first required revision, coverage gaps, any owner decision, what a downstream program designer or planner would still have to invent, and one parent-selected compact continuation handoff or an exact stop reason.

## Completion Blockers

Do not return `ready` while any of these hold:

- target classification or required runtime-skill-package parent identity is missing;
- the current target identity or semantic scope is missing or ambiguous;
- Requirements and Specification are not separately identifiable in any review mode, or a combined `Requirements/spec` is being used as both;
- the complete target or governing-source set was not read;
- the confirmed goal boundary, accepted requirements, or applicable structural-realization confirmation is missing or conflicting without an explicit returned authority gap;
- no complete semantically current mode-complete receipt exists;
- a selected lane is silent without explicit follow-up;
- partial, blocked, or `no-receipt` coverage affects a required dimension;
- a finding lacks an accepted requirement identity or confirmed goal-boundary field, its plain-language meaning, the observable outcome that fails, source-backed evidence, deletion test, scope effect, semantic correction route, or disposition;
- specification, program, or three-artifact-design mode boundaries are conflated;
- `program-only` or `three-artifact-design` omits an applicable current/proposed call path, explicit no-predecessor case, added/removed/changed edge status, or a preservation-critical or contested unchanged edge;
- a material proof claim is accepted without evidence that can observe it at the required layer, or an applicable diagram is accepted without checking that it answers its reader question and agrees with the written meaning;
- three-artifact-design mode trusts author or local checks without independent reinspection;
- the coordinator did not read the complete target set and governing sources before choosing lanes, or a lane ran with no named reason beside it;
- a chunk plan split one requirement's trace to its obligation and realization, or one call-path delta with its owners and proof seam, across chunks with no overlap seam; or a chunk receipt was treated as mode-complete coverage;
- any reviewer judged an artifact it did not read completely, or the common method's coverage rows leave a target section neither covered nor excluded with a reason;
- the dispel receipt is missing, or a design element dispel mapped `absent` lacks either a `decision-needed` return or an accepted removal routed to `program-design` — "well drawn" is not a disposition;
- a reviewer candidate that adds unrequested scope was returned as `decision-needed` or accepted instead of rejected as scope expansion;
- a proof-challenge receipt lists a command outside the packet's recorded grant, or an executable proof claim was accepted without a proof-challenge receipt or a named proof gap;
- focused review began before parent reduction of the artifact-review receipts, a lane was composed without a named predicate, or a broad predicate was treated as sufficient selection;
- a second normal design review began without a concrete source-backed substantive residual from parent verification, or a third normal review began without explicit user permission granted after the second result;
- a recovery review began after a previous recovery, from stale or wrong-source inspection, without the missing-evidence reason, or by fabricating unknown review history as zero; or recovery findings were corrected without known available correction allowance or explicit user authority;
- the downstream consumer must invent meaning owned by the reviewed artifact;
- the result recommends no next skill, more than one next skill, or a route selected from an unreduced reviewer candidate when a validated continuation exists;
- a continuation omits the current boundary status or makes the destination choose among correction alternatives instead of carrying one smallest verified correction;
- a pathfinding recommendation omits the review-selected return owner, or complete current authority/evidence already settles the correction;
- a continuation copies artifact contents or unrelated history instead of returning the destination's compact pointer-based handoff;
- the result implies edit, remediation, lifecycle, planning, or acceptance authority.
