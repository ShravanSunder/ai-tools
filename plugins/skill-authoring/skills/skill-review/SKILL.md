---
name: skill-review
description: "Use when reviewing a skill spec before its files change or a skill draft shown in the conversation, or changed or existing skill files before they ship, especially when the review must be independent of the author or a skill's quality is in question. Not for reviewing product code or deciding which skills should exist (skill-audit)."
---

# Skill Review

Review is independent inspection. Agents that did not write the change each hunt one family of defects, and one review lead verifies every candidate at its anchor before accepting it. A finding is a claim about a file: it is true only once someone opened that file in the current revision and saw it. Reviewers agreeing with each other is not verification.

The checks judge a skill against the craft in `skill-creation`. They load its references by path, so the standard lives in one place; `skill-creation`'s wording governs where a check restates it.

## Two Stages

| stage | when | artifact | reference |
| --- | --- | --- | --- |
| spec review | before any skill file is edited | the skill spec, or a skill draft shown in the conversation | `references/spec-review.md` |
| implementation review | after proof and assessment, before ship; or a source-only evaluation of an existing skill | changed or existing skill files | `references/implementation-review.md` |

Mechanical changes are not reviewed.

## Workflow

### 1. Admit the review

Name the stage, the target (spec path and revision, or the files), and who asked for the review. You are the review lead: if you wrote or edited the target, stop and have the review run in an agent that did not. Read the target whole. Completion: stage, target identity, requester, and your independence from the author are stated.

### 2. Run the stage

IF the stage is spec review, load `references/spec-review.md` and return its per-check statuses, findings, verdict, and implementation decision. IF the stage is implementation review or an evaluation of existing files, load `references/implementation-review.md` and return its per-check statuses, findings, verdict, and ship decision.

Start each reviewer agent the stage names in its own session with no authoring history. Give it the target, the check references it walks by path, and `references/checks/review-schema.md`, and ask for candidate findings with anchors only. Use the host's own way to start an agent. If the host cannot start a separate agent, stop and tell the user: a review without a second agent is not a review. When the selected checks fit one family, split them across two agents.

Completion: every selected check has a status from the agent that walked it.

### 3. Verify and reduce

Open the anchor of every candidate. MUST load `references/checks/review-schema.md` and return each candidate's state. An absence claim is verified only by opening the file where the item would be. Merge duplicates, settle conflicts by reading the artifact, rank, and name the first fix. Completion: every candidate has a state, and every accepted finding was verified at its anchor before acceptance.

### 4. Return

MUST load `references/checks/review-schema.md` and return the stage's report labels with its reduction block. Accepted findings carry their route.

## Correction Loop

Corrections return to the same review lead with its review history, which verifies corrected anchors. Both stages follow this convergence rule:

> After each correction pass, compare this review with the previous one using the existing finding identity (anchor plus failure form). Return `not-converging` when either holds:
> 1. **Recurrence.** A finding the review lead verified closed in an earlier review is accepted again. A finding whose correction never closed is still open, which is not a recurrence.
> 2. **No progress.** The count of open accepted findings did not drop in two adjacent comparisons in a row: it stayed equal or rose from review N−1 to N, and again from N to N+1.
>
> When earlier review history is unavailable, the current review sets the baseline, and both conditions count from there. A correction outside the accepted boundary is not a pass.

Worked example: open accepted findings go 4 → 3 → 3 → 4 over four reviews. 4 → 3 is progress; 3 → 3 and 3 → 4 are two adjacent comparisons without a drop, so the fourth review returns `not-converging` — the stop rule is already met there, not one round later.

The accepted boundary:

> A correction is inside the accepted boundary when it changes no design meaning, scope, contract, or user decision. Only those corrections get further review rounds automatically. A correction that changes, or might change, any of those goes to the user first. Once the user settles it, review continues under the convergence rule without a permission prompt.

IF a stage returns `not-converging` or a semantic change outside the accepted boundary, stop and bring the user the decision: what is open, the options with what each costs, and your recommendation. The review lead stays read-only.

## Completion Blockers

Do not return a clean result while any of these hold:

- a reviewer agent had authoring history for the target;
- fewer than two reviewer agents ran on a behavior-changing review;
- an accepted finding was not verified at its anchor before acceptance;
- a required check is missing, `partial`, or `blocked` without a recorded closure;
- reviewer agreement or reviewer count stood in for verification;
- a round ran after `not-converging`, or outside the accepted boundary without the user's decision.
