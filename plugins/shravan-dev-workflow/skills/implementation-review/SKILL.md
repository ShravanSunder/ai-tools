---
name: implementation-review
description: "Use when independently reviewing implemented code, proof, a branch diff, commit, PR head, or one bounded remediation before PR readiness, including when governing inputs are missing or conflicting. Not for design review (spec-program-review)."
---

# Implementation Review

IF no work reference is in context and the task qualifies, open or resume the trace through `practices-show-me-your-work` before phase work.

The caller commissions a different-lineage persistent 🔎 Review Sidekick with no author or orchestrator history. That lead reads every governing source and the complete diff, walks the checks below in its own session, and reduces findings against the rails. The orchestrator disposes and routes the assessment. The bounded delivery effort may remediate at most three times.

The rails are the confirmed requirements, Specification obligations, Program Design elements, and goal boundary. A finding that cannot be anchored to a quoted clause from them is not accepted, however well-argued or however many reviewers agree.

## Admit Review

1. Classify `general-domain | runtime-skill-package`; runtime skill packages route to the skill-package review stage of `skills-creation`.
2. Classify `meaningful-review-required | non-substantial | blocked-input`. Non-substantial is limited to fully inspected formatting, typo, link, or generated-metadata changes with no semantic consumer; a non-substantial return lists, per changed file, the path, the diff inspected, the consumer search performed, and the no-effect conclusion. A `blocked-input` return names each missing identity and who can restore it.
3. For meaningful review, MUST load `../../shared-references/canonical-implementation-plan.md` to validate the unchanged ready plan record, governing planning basis, delivery context, base/reviewed commits, diff range, instructions, proof claims/evidence, constraints, and known gaps, and return `admit | blocked-input | remediation-limit-reached`; take the remediation passes already consumed from the bounded delivery effort's caller, never from the plan. When prior review evidence is unavailable, admit exactly one bounded recovery review only if the orchestrator explicitly authorizes recovery, documents what evidence is unavailable and why another review is necessary, inspects the current source/proof boundary, and establishes no known prior recovery. Preserve the known remediation count, or record it as unknown; never turn unknown into zero or reset the allowance.
4. Admit reviewed-design and admitted-repository-improvement governing-basis variants through their canonical fields. Reject missing, stale, malformed, plan-only, mismatched, wrong-origin, or unproven authority without inference. With no plan record at all, review only when the user explicitly asked for a diff-only review with no risk trigger present, or when a risk trigger (runtime authority, security boundary, public capability, cross-module surface) forces review with the user's confirmed goal statement as the sole rail — and say plainly that source-backed readiness cannot be claimed. Never infer a plan or design from the PR description.
5. Reject recovery when three or more remediation passes are known, a prior recovery is known, the reviewed source or proof is stale, or the request fabricates a zero count. If three remediation passes already exist, return `remediation-limit-reached` unless the user explicitly authorized continuation after seeing that stop.

Completion: classification, governing sources, base and reviewed commits, diff and proof boundary, remediation-count evidence (or the recovery authorization and missing-evidence reason), and `admit | blocked-input | remediation-limit-reached` are stated.

The caller completes admission. A non-substantial, blocked, or remediation-limit exit commissions no lead. For an admitted meaningful review, the caller uses `manage-agents` to commission or resume one persistent, different-lineage 🔎 Review Sidekick with no author or orchestrator history. The assigned lead executes this method and never commissions another lead.

## Read the Whole Map

Read the complete governing basis and the complete base-to-reviewed diff yourself before planning checks. Read every file whole. Gather citable governing artifacts, the quoted goal boundary, anchored obligations, authorized constraints, proof claims, and owner meaning that exists only in chat.

Completion: list every changed file, obligation, and proof claim from your own reading.

## Plan the Checks

MUST load `references/coordination-and-chunking.md` and return the sequential chunk-pass plan, including complete files, obligations, and overlap seams, or one pass covering the whole diff.

Run `spec-compliance` first. If it finds a misread requirement or scope underdelivery, return `needs-revision` to the semantic owner. Run chunk passes sequentially, then proof-challenge when proof claims exist, then dispel, then focused checks only for a named residual material risk.

Spec-compliance, chunk passes, and dispel always run. Record a reason for each optional check, including why it was not selected. Small changes use one pass spanning the whole diff.

Completion: each pass lists its complete file set and seams, and every optional check has a selection decision.

## Walk the Checks

MUST load `references/lanes/lane-schema.md` and record `complete | partial | blocked` for every check below. Return the per-check status block before the verdict. Record an unselected optional check as `complete` with `not selected: <reason>`. A missing, partial, or blocked check cannot support `ready`.

1. MUST load `references/lanes/spec-compliance.md` and compare asked-to-delivered and delivered-to-asked coverage across the whole diff.
2. MUST load `references/lanes/chunk-reviewer.md` and `references/reviewing-implementation.md`; walk each planned chunk pass sequentially. Reopen every complete file in that pass and inspect overlap seams from both sides. Record coverage and candidate findings per pass.
3. IF proof claims exist, load `references/lanes/proof-challenge.md` and challenge every claim. For prescribed commands, assign a 🔧 Operator under an exact execution grant. The 🔧 Operator performs the reference's write-set preflight and `git status --porcelain` comparison, executes only granted commands, and returns observed output and exit codes. The 🔎 Review Sidekick judges claimed against observed and records proof gaps. If there is no grant, inspect only and record the boundary.
4. MUST load `references/lanes/dispel.md` after all chunk passes. Classify every candidate and map every delivered item to a rail or `absent`, even when there are no candidates.
5. IF reduction leaves a named material risk, load `references/lanes/focused-reviewer.md` and answer one falsifiable question per risk. Stop when no named risk remains.
6. List every stand-in in the diff and receipts, and check that none is counted as proof of the real interaction; a claim that rests on a stand-in is a finding.

When the review includes auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, agent, or external-service surfaces, the caller selects a Frontier 🔎 Review Sidekick from a different author lineage at commission time through `manage-agents`.

## Reduce on the Rails

MUST load `references/finding-and-reduction.md` and return every candidate's disposition with its quoted rail anchor, merged duplicates, scope effects, and the review result. In that reference, `parent` means the 🔎 Review Sidekick, never the author or orchestrator.

Before accepting any finding, open the governing clause it claims to serve and quote it; ask whether the confirmed obligations still hold without the questioned mechanism, and whether the proposed mechanism is the smallest change that serves the clause or one of several. A reviewer proposal that adds unrequested scope is rejected as scope expansion — never escalated to the owner as if a decision were owed. An unrequested element the diff already delivers gets removal or an owner `decision-needed`, never "well built." A finding that breaks a load-bearing assumption of the governing design stops and returns to the user with the failed assumption, evidence, and consequence.

Return `ready | needs-revision | blocked-input | decision-needed | remediation-limit-reached` with the exact correction owner and affected coverage; `references/finding-and-reduction.md` owns these labels and their precedence. With it, answer: "What are the risks of merging this today, and what is the worst thing that could break?" and "List assumptions, environment details, or judgment calls you could not verify, and where you looked."

## Remediation Boundary

- This skill never edits. Accepted implementation-owned findings route to `implement-plan`.
- After remediation one or two, the caller may invoke another review with fresh diff/proof; corrected source invalidates affected coverage.
- After remediation three, stop. Do not invoke review four or another correction without explicit user permission.
- A missing receipt never resets the limit. Do not persist counters, ledgers, hashes, or review state in the plan.
- If a bounded recovery review returns accepted implementation-owned findings and the remaining remediation budget cannot be established safely, report the findings and ask for explicit user permission before routing any correction.
- Design/spec/plan defects return to their semantic owner and follow that owner's bounded review policy; they do not consume implementation remediation authority.

## Completion Blockers

Do not return `ready` while any of these hold:

- you did not read the complete governing basis and diff yourself before planning checks;
- a chunk split a call path, a changed contract from its callers, or an obligation-to-proof chain with no overlap seam; or a chunk's file set omits a current consumer of a changed contract;
- any reviewer judged a file it did not read completely, or a coverage row spans less than the whole file it anchors;
- a required check lacks `complete` status, or an optional check has no selection reason;
- a proof claim was accepted without a proof-challenge result (or a named proof gap), or a 🔧 Operator ran a command outside the grant or left the worktree changed;
- an accepted finding lacks a quoted rail anchor, the deletion test, its scope effect, owner, or confirmation evidence;
- a reviewer proposal that adds unrequested scope was accepted or returned `decision-needed`; or a delivered element dispel mapped `absent` (or spec-compliance marked `extra` or `scope overreach`) has neither an accepted removal nor a `decision-needed` return;
- a mental-model break was pushed through remediation instead of returning to the user;
- the result edits, exceeds the three-remediation boundary, or persists review bookkeeping.

IF a trace is open, at phase completion record the outcome, evidence, and next owner or return token as a checkpoint through `practices-show-me-your-work`.
