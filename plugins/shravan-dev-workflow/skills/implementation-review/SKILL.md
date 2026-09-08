---
name: implementation-review
description: Use when independently reviewing implemented code, proof, a branch diff, commit, PR head, or one bounded remediation before PR readiness, including when governing authority, ready plan, source, diff, proof, or remediation-limit evidence is missing or conflicting. Not for design review (spec-program-review), runtime-skill-package review (skills-creation), security scans or audits (ops-security-review), reviewer handoff packets (implementation-handoff), remediation, or PR monitoring (implementation-pr-wrapup).
---

# Implementation Review

The parent agent is the review coordinator. It builds the whole map first — reading every governing source and the complete diff — then composes a review DAG for this specific change: dependent stages in sequence, parallel-safe stages fanned out, each reviewer holding a complete overlapping packet instead of partial information. Reviewers return candidate findings; the coordinator verifies everything against the rails — the confirmed requirements, Specification obligations, Program Design elements, and goal boundary — and owns the verdict. The bounded delivery effort—an orchestrated goal or direct review loop—may remediate at most three times.

## Admit Review

1. Classify `general-domain | runtime-skill-package`; runtime skill packages route to the skill-package review stage of `skills-creation`.
2. Classify `meaningful-review-required | non-substantial | blocked-input`. Non-substantial is limited to fully inspected formatting, typo, link, or generated-metadata changes with no semantic consumer; a non-substantial return lists, per changed file, the path, the exact diff inspected, the consumer search performed, and the evidence-backed no-effect conclusion. A `blocked-input` return names each missing identity and the owner who can restore it.
3. For meaningful review, MUST load `../../shared-references/canonical-implementation-plan.md` to validate the unchanged ready plan record, governing planning basis, delivery context, base/reviewed identities, diff range, instructions, proof claims/evidence, constraints, known gaps, and the inspectable remediation receipts already consumed by this bounded delivery effort, and return those validated records plus `admit | blocked-input | remediation-limit-reached`. When prior review evidence is unavailable, admit exactly one bounded recovery review with known-below-limit or unavailable remediation-count evidence only if the orchestrator explicitly authorizes recovery, documents what evidence is unavailable and why another review is necessary, inspects the current source/proof boundary, and establishes no known prior recovery. Preserve the known count, or record it as unknown when unavailable; never turn unknown into zero or reset the normal allowance.
4. Admit reviewed-design and admitted-repository-improvement governing-basis variants through their canonical fields. Reject missing, stale, malformed, plan-only, mismatched, wrong-origin, or unproven authority without inference.
5. Reject recovery when three or more remediation passes are known, a prior recovery review is known, the reviewed source or proof is stale/mismatched, or the request fabricates a zero count from unavailable evidence. If three remediation passes already exist and another review is requested, return `remediation-limit-reached` unless the user explicitly authorized continuation after seeing that stop.

Completion: classification, governing identities, unchanged plan/context, diff/proof boundary, remediation count evidence or the bounded recovery authorization and missing-evidence reason, current-source inspection, prior-recovery check, and `admit | blocked-input | remediation-limit-reached` are explicit.

## Build the Map

1. Classify the review, and let the class pick what reduction anchors to and which lanes composition must consider: `source-backed` (a reviewed design set exists; rails anchors cite it), `plan-backed` (an admitted plan basis without a full design set; rails anchors cite the plan record and its basis evidence), `risk-triggered` (runtime authority, security boundary, public capability, or cross-module surfaces force meaningful review, the sensitivity predicate, and proof-challenge consideration regardless of diff size), or `diff-only-limited` (only for explicit tiny diff-only work with no accepted source artifact and no risk trigger; it can never claim source-backed readiness).
2. Read the complete governing basis and the complete base-to-reviewed diff yourself before composing anything. Every target file the coordinator or any reviewer loads is read completely before substantive judgment — never "enough to establish scope."
3. Collect the shared conceptual context every reviewer will receive: the governing basis recorded by the canonical plan (the Requirements/Specification/Program Design set, or the admitted-finding basis evidence), the confirmed goal boundary, constraints, non-goals, proof claims, and steering anchors.

Completion: the review class is named, the whole-map read is done, and the shared context is explicit; the coordinator can name every changed file, obligation, and proof claim from its own reading. When a governing source cannot be read, return `blocked-input` in this exact shape — never a readiness verdict from code and tests alone:

```text
blocked-input
  review class: <source-backed | plan-backed | risk-triggered>
  unreadable or missing identities: <each exact artifact path or identity>
  restoring owner: <who can restore or re-admit each one>
  why diff-only-limited does not apply: <the accepted source artifact or risk trigger present>
```

## Compose the Review DAG

MUST load `references/coordination-and-chunking.md` and return the chunk plan, the composed node-and-edge route, and each lane's selection predicate; that reference owns chunk semantics, overlap seams, composition order, and the stop condition for adding lanes.

The route always respects these dependencies:

```text
spec-compliance -> chunk reviewers (parallel) -> dispel -> reduction
proof-challenge runs after proof claims are collected; its receipt feeds reduction
focused lanes run only after reduction names a concrete unresolved risk
```

Each composed lane must satisfy a named selection predicate; composition stops when no named unresolved risk selects another lane. A small change may compose one chunk spanning the whole diff — the map, rails, and reduction still run. Parallel-safety checking follows `manage-agents` job planning; do not restate it here.

Completion: the Composition Record from that reference is written out in full — review class, units, chunks, overlap seams, every node with its one-sentence predicate and ordering edges, the runtime line (`manage-agents` fresh-context read-only Delegate per lane, plus any recorded execution grant), the not-composed lanes with the predicate that failed, and the per-predicate stop record — plus the bad signals the coordinator will treat as chunking defects. A route described in prose without that record is not composed.

## Dispatch

MUST load `references/lanes/lane-schema.md` and return the filled shared packet and result envelope for every dispatch below. Every dispatch resolves its runtime through `manage-agents` as a fresh-context, single-assignment Delegate: no parent conversation history, candidate-only authority, and read-only workspace access — reviewers never edit. Reviewers may keep a tmp scratchpad outside the reviewed worktree as working state; the worktree stays untouched.

- MUST dispatch `spec-compliance` to a subagent using the shared packet, predicate `mandatory for meaningful review`. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/spec-compliance.md`. Parallel-safe after the shared context exists; it sequences before quality lanes. Return `complete | partial | blocked`; the coordinator verifies and reduces it.
- MUST dispatch one `chunk-reviewer` per chunk using the shared packet plus that chunk's assignment and overlap seams. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/chunk-reviewer.md`; that lane loads `references/reviewing-implementation.md` for the full method. Parallel-safe across chunks after spec-compliance returns. Return `complete | partial | blocked`; the coordinator verifies and reduces each.
- MUST dispatch `dispel` once every chunk receipt is terminal, using the shared packet with `chunk assignment: whole-diff` plus the candidate set, which may be empty. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/dispel.md`. Not parallel-safe with candidate producers; dispatch only after their receipts exist. Return its per-candidate `correction class` plus over-delivery findings; the coordinator verifies and reduces it.
- IF the review carries proof claims, dispatch `proof-challenge` using the shared packet plus the claim inventory. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/proof-challenge.md`. Parallel-safe with chunk reviewers once the claim inventory is collected. Instance authority adds one named grant recorded in the packet — executing exactly the proof commands listed there, output confined to its tmp scratchpad — and stays otherwise read-only and candidate-only; that lane reference owns the execution boundary, including its pre-run write-set check, and may never widen into edits. Return one row per claim in this exact shape, plus every command run verbatim; the coordinator accepts the receipt only when no row has an empty field, verifies each command ran inside the grant, and reduces it:

  ```text
  claim | preflight write-set: scratchpad-only|worktree|unknown | command run or challenge | observed vs claimed | false-green check: <how this could pass with the behavior absent> | exit status | rerun comparison: <both outcomes> or no failure
  ```
- IF a chunk or lane touches auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, agent, or external-service surfaces, route that lane's model selection to a security-specialized model class through `manage-agents` when the current catalog offers one, and write the packet's `model routing` field as exactly `security-specialized:<class from the manage-agents catalog>` or `fallback:<reason the catalog offers none>` — a bare "use a security model" is not a record.
- IF reduction names a concrete unresolved material risk, dispatch one `focused-reviewer` per named risk using the shared packet plus the falsifiable question; total count is governed by the composition stop condition, never by lane appetite. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/focused-reviewer.md`. Not parallel-safe with reduction; dispatch only after reduction names the question. Return the answer receipt; the coordinator verifies and reduces it.

Silence is `no-receipt` after explicit follow-up, never a clean review. `partial`, `blocked`, and `no-receipt` coverage cannot support `ready`.

## Reduce on the Rails

MUST load `references/finding-and-reduction.md` and return every candidate's disposition, the rails re-anchor evidence, merged duplicates, scope effects, and the coverage-bound result.

The rails are not optional context: before accepting any finding, the coordinator re-anchors it to a confirmed requirement, Specification obligation, Program Design element, or goal-boundary field, and tests whether deleting the questioned mechanism removes the failure. A finding that introduces an unrequested subsystem, expands scope, or weakens a requirement is rejected with evidence or returned `decision-needed` — reviewer agreement is not evidence, and rubber-stamping reviewer output is the failure this skill exists to prevent. A finding that breaks a load-bearing mental model stops and returns to the user with the failed assumption, evidence, and consequence.

Return `ready | needs-revision | blocked-input | decision-needed | remediation-limit-reached` with the exact correction owner and affected coverage; `references/finding-and-reduction.md` owns these result labels and their precedence.

## Remediation Boundary

- This skill never edits. Accepted implementation-owned findings route to `implement-plan`.
- After remediation one or two, the caller owning the bounded delivery effort may invoke another review with fresh diff/proof; corrected source invalidates affected coverage.
- After remediation three, stop. Do not invoke review four or another correction without explicit user permission.
- A missing receipt never resets the limit. Do not persist counters, ledgers, hashes, or review state in the plan.
- If a bounded recovery review returns accepted implementation-owned findings and the remaining remediation budget cannot be established safely, report the findings and ask for explicit user permission before routing any correction.
- Design/spec/plan defects return to their semantic owner and follow that owner's bounded review policy; they do not consume implementation remediation authority.

## Completion Blockers

Do not return `ready` while any of these hold:

- the coordinator did not read the complete governing basis and diff before composing the DAG;
- a chunk plan left a call path, a changed contract with its callers, or an obligation-to-proof chain split across chunks with no overlap seam;
- any reviewer judged a file it did not read completely, or a coverage row spans less than the whole file it anchors;
- any composed lane lacks a terminal verified receipt, or is silent without follow-up;
- a proof claim was accepted without the proof-challenge receipt or a named, user-visible proof gap, or a proof-challenge receipt lists a command outside the packet's recorded grant;
- an accepted finding lacks its rails anchor, deletion test, scope effect, disposition, semantic owner, or confirmation evidence;
- an accepted finding silently expands the confirmed goal, adds an unrequested subsystem, or weakens a requirement instead of returning `decision-needed`;
- a mental-model break was pushed through remediation instead of returning to the user;
- the result edits, exceeds the three-remediation boundary, or persists review bookkeeping.
