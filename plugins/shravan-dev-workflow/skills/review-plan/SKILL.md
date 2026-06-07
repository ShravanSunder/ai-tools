---
name: review-plan
description: Use when adversarially reviewing a plan, design, spec, implementation proposal, or handoff before code changes, especially when the user asks to validate, poke holes, challenge assumptions, or review a plan without executing it.
---

# Review Plan

Review plans read-only. Load the whole artifact, compare it to live code/docs, and challenge assumptions before anyone implements.

## Core Rules

- Do not implement while reviewing.
- If a plan file exists, run `wc -l` and read every chunk before judging it.
- Treat the plan as a claim, not truth. Verify major claims against current code, docs, package metadata, tests, and branch state.
- Separate blocker, important, question, and nit findings.
- Include evidence: file path, symbol or section, failure scenario, smallest fix, and proof/test.
- If using subagents, give them curated packets. Do not rely on inherited session context.
- Read-only subagent packets must explicitly say "do not edit files"; check the diff after they return if the tool surface permits edits.
- If this skill is itself running inside a subagent, stay shallow: do not spawn another swarm unless the parent explicitly asked for nested review.

## Workflow

1. Identify the review target and mode:
   - `plan-file`: source plan/spec path exists.
   - `handoff-packet`: reviewing a packet prepared by another agent.
   - `chat-plan`: reviewing a plan only present in the conversation.
2. Establish coverage:
   - For files: line count plus chunk ranges.
   - For packets: list packet files read.
   - For chat plans: state that no source file was available.
3. Extract major claims:
   - architecture
   - file/module boundaries
   - API contracts
   - execution order
   - tests and validation gates
   - risks and assumptions
4. Check claims against live repo evidence.
5. Run adversarial review:
   - stale branch or stale code assumptions
   - missing cutovers
   - untestable steps
   - vague placeholders
   - overbroad scope
   - hidden security/reliability failure modes
   - reviewer/implementer ownership gaps
6. Write a review report in chat. If useful or requested, also write it under the plan workflow temp directory.

## Subagent Use

Top-level reviewers may spawn bounded read-only lanes when the lanes can run independently:

- spec compliance
- architecture assumptions
- testability and validation
- security/reliability risks
- migration/cutover completeness

The parent reviewer owns synthesis and must verify candidate findings before presenting them as accepted.

## Progressive Disclosure

- Load `references/review-packet.md` when dispatching a subagent or writing a copy-paste review prompt.
- Load `references/review-checklist.md` when the plan is large, risky, or implementation-facing.

## Output Shape

Return:

- Coverage evidence.
- Verdict: ready, needs revision, or blocked.
- Findings grouped by severity.
- Questions that must be answered before execution.
- Suggested smallest plan edits.
- Explicit "do not implement yet" note unless the user changes scope.
