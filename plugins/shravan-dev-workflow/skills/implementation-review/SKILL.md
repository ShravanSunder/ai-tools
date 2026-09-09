---
name: implementation-review
description: Use when independently reviewing implemented code, proof, a branch diff, commit, PR head, or one bounded remediation before PR readiness, including when governing authority, ready plan, source, diff, proof, or remediation-limit evidence is missing or conflicting. Not for design review (spec-program-review), runtime-skill-package review (skills-creation), security scans or audits (ops-security-review), reviewer handoff packets (implementation-handoff), remediation, or PR monitoring (implementation-pr-wrapup).
---

# Implementation Review

The parent agent is the review coordinator. It reads every governing source and the complete diff itself, decides which reviewer lanes to run and in what order, hands each reviewer everything it needs — complete files, the quoted rails, deliberate overlap — and then verifies every candidate finding against those rails before accepting anything. Reviewers return candidates; the coordinator owns the verdict. The bounded delivery effort—an orchestrated goal or direct review loop—may remediate at most three times.

The rails are the confirmed requirements, Specification obligations, Program Design elements, and goal boundary. A finding that cannot be anchored to a quoted clause from them is not accepted, however well-argued or however many reviewers agree.

## Admit Review

1. Classify `general-domain | runtime-skill-package`; runtime skill packages route to the skill-package review stage of `skills-creation`.
2. Classify `meaningful-review-required | non-substantial | blocked-input`. Non-substantial is limited to fully inspected formatting, typo, link, or generated-metadata changes with no semantic consumer; a non-substantial return lists, per changed file, the path, the diff inspected, the consumer search performed, and the no-effect conclusion. A `blocked-input` return names each missing identity and who can restore it.
3. For meaningful review, MUST load `../../shared-references/canonical-implementation-plan.md` to validate the unchanged ready plan record, governing planning basis, delivery context, base/reviewed commits, diff range, instructions, proof claims/evidence, constraints, and known gaps, and return `admit | blocked-input | remediation-limit-reached`; take the remediation passes already consumed from the bounded delivery effort's caller, never from the plan. When prior review evidence is unavailable, admit exactly one bounded recovery review only if the orchestrator explicitly authorizes recovery, documents what evidence is unavailable and why another review is necessary, inspects the current source/proof boundary, and establishes no known prior recovery. Preserve the known remediation count, or record it as unknown; never turn unknown into zero or reset the allowance.
4. Admit reviewed-design and admitted-repository-improvement governing-basis variants through their canonical fields. Reject missing, stale, malformed, plan-only, mismatched, wrong-origin, or unproven authority without inference. With no plan record at all, review only when the user explicitly asked for a diff-only review with no risk trigger present, or when a risk trigger (runtime authority, security boundary, public capability, cross-module surface) forces review with the user's confirmed goal statement as the sole rail — and say plainly that source-backed readiness cannot be claimed. Never infer a plan or design from the PR description.
5. Reject recovery when three or more remediation passes are known, a prior recovery is known, the reviewed source or proof is stale, or the request fabricates a zero count. If three remediation passes already exist, return `remediation-limit-reached` unless the user explicitly authorized continuation after seeing that stop.

Completion: classification, governing sources, base and reviewed commits, diff and proof boundary, remediation-count evidence (or the recovery authorization and missing-evidence reason), and `admit | blocked-input | remediation-limit-reached` are stated.

## Read the Whole Map

Read the complete governing basis and the complete base-to-reviewed diff yourself before choosing any lanes — every file whole, never "enough to establish scope." Write the diff to a file in system tmp so every reviewer gets the same content, not a commit range it may not be able to expand. Gather what every reviewer will receive, in citable form: absolute paths to the governing artifacts, the goal boundary as quoted in/out statements with their source, obligations with section anchors, constraints with the authority that imposed them, proof claims, and any owner meaning that exists only in chat copied verbatim.

Completion: you have listed every changed file, obligation, and proof claim from your own reading, and the reviewer packet contains nothing a fresh agent could not open or quote.

## Choose the Lanes

MUST load `references/coordination-and-chunking.md` and return the chunk plan — which files and obligations each chunk reviewer gets, with overlap seams, or the decision that one chunk covers the whole diff — and which lanes run.

Order is forced only by data dependencies: `spec-compliance` first, because an intent failure bounds everything after it; chunk reviewers in parallel after it; `proof-challenge` alongside them once the proof claims are collected, feeding reduction directly; `dispel` once every chunk receipt is in; focused lanes only after reduction names a concrete unresolved risk. If spec-compliance returns `misread requirement` or `scope underdelivery`, skip the fan-out and return `needs-revision` to the semantic owner.

Spec-compliance, the chunk reviewers, and dispel always run. Every other lane runs because a named reason selects it — write that reason beside it — and you stop when no named unresolved risk selects another. Idle capacity, a broad topic, or reviewer curiosity is not a reason. Small changes use one chunk spanning the whole diff.

Completion: each chunk lists its complete file set and seams, and each optional lane kind in the reference's table — proof-challenge and focused lanes — either runs with its reason written beside it or is skipped with the reason it was not needed.

## Dispatch

MUST load `references/lanes/lane-schema.md` and return the filled packet for every dispatch below. Every reviewer runs through `manage-agents` as a fresh-context, single-assignment Delegate: no parent conversation history — on native runtimes that is fork = none (Codex `fork_turns="none"`, a new Claude or Cursor agent with no resume), never a self-fork; on ACPX, a new session — candidate-only authority, and read-only workspace access. Reviewers never edit and never spawn agents of their own. The packet's `lane instructions` carries the absolute paths of every reference the bullets below say the subagent loads (or their inlined text when the runtime cannot read the plugin cache); a reviewer dispatched into the reviewed repo cannot resolve this skill's relative paths.

- MUST dispatch `spec-compliance` using the packet. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/spec-compliance.md`. Return `complete | partial | blocked`; the coordinator verifies and reduces it.
- MUST dispatch one `chunk-reviewer` per chunk using the packet plus that chunk's files, obligations, and seams. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/chunk-reviewer.md`; that lane loads `references/reviewing-implementation.md` for the method. Return `complete | partial | blocked`; the coordinator verifies and reduces each.
- MUST dispatch `dispel` once every chunk receipt is in, using the packet with the whole diff plus the candidate set (which may be empty). Subagent loads `references/lanes/lane-schema.md` and `references/lanes/dispel.md`. Return its per-candidate correction class and its over-delivery map; the coordinator verifies and reduces it.
- IF the review carries proof claims, dispatch `proof-challenge` using the packet plus the claim inventory and an execution grant naming exactly the claimed commands and a scratchpad path outside the worktree. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/proof-challenge.md`. This is the one lane allowed to execute — only those commands, with the lane's pre-run write-set check — and it still never edits. Return one row per claim (preflight write-set class, command run or challenge, observed vs claimed, false-green check, exit status, rerun comparison) plus every command run; the coordinator confirms each ran inside the grant and that `git status --porcelain` in the worktree is unchanged, then reduces it.
- IF a chunk touches auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, agent, or external-service surfaces, escalate that lane's reviewer to a Frontier Delegate through `manage-agents` (reviewer-only per its catalog) and note which model ran.
- IF reduction names a concrete unresolved material risk, dispatch one `focused-reviewer` for that risk using the packet plus the falsifiable question. Subagent loads `references/lanes/lane-schema.md` and `references/lanes/focused-reviewer.md`; that lane loads `references/reviewing-implementation.md` for the method. Return the answer; the coordinator verifies and reduces it.

Silence is `no-receipt` after explicit follow-up, never a clean review. `partial`, `blocked`, and `no-receipt` cannot support `ready`.

## Reduce on the Rails

MUST load `references/finding-and-reduction.md` and return every candidate's disposition with its quoted rail anchor, merged duplicates, scope effects, and the review result.

Before accepting any finding, open the governing clause it claims to serve and quote it; ask whether the confirmed obligations still hold without the questioned mechanism, and whether the proposed mechanism is the smallest change that serves the clause or one of several. A reviewer proposal that adds unrequested scope is rejected as scope expansion — never escalated to the owner as if a decision were owed. An unrequested element the diff already delivers gets removal or an owner `decision-needed`, never "well built." A finding that breaks a load-bearing assumption of the governing design stops and returns to the user with the failed assumption, evidence, and consequence.

Return `ready | needs-revision | blocked-input | decision-needed | remediation-limit-reached` with the exact correction owner and affected coverage; `references/finding-and-reduction.md` owns these labels and their precedence.

## Remediation Boundary

- This skill never edits. Accepted implementation-owned findings route to `implement-plan`.
- After remediation one or two, the caller may invoke another review with fresh diff/proof; corrected source invalidates affected coverage.
- After remediation three, stop. Do not invoke review four or another correction without explicit user permission.
- A missing receipt never resets the limit. Do not persist counters, ledgers, hashes, or review state in the plan.
- If a bounded recovery review returns accepted implementation-owned findings and the remaining remediation budget cannot be established safely, report the findings and ask for explicit user permission before routing any correction.
- Design/spec/plan defects return to their semantic owner and follow that owner's bounded review policy; they do not consume implementation remediation authority.

## Completion Blockers

Do not return `ready` while any of these hold:

- you did not read the complete governing basis and diff yourself before choosing lanes;
- a chunk split a call path, a changed contract from its callers, or an obligation-to-proof chain with no overlap seam; or a chunk's file set omits a current consumer of a changed contract;
- any reviewer judged a file it did not read completely, or a coverage row spans less than the whole file it anchors;
- any lane you ran lacks a terminal, verified receipt, or a lane is silent without follow-up;
- a proof claim was accepted without a proof-challenge receipt (or a named proof gap), or a proof-challenge receipt lists a command outside the grant or left the worktree changed;
- an accepted finding lacks a quoted rail anchor, the deletion test, its scope effect, owner, or confirmation evidence;
- a reviewer proposal that adds unrequested scope was accepted or returned `decision-needed`; or a delivered element dispel mapped `absent` (or spec-compliance marked `extra` or `scope overreach`) has neither an accepted removal nor a `decision-needed` return;
- a mental-model break was pushed through remediation instead of returning to the user;
- the result edits, exceeds the three-remediation boundary, or persists review bookkeeping.
