---
name: plan-review
description: Use when adversarially reviewing a plan, design, spec, implementation proposal, or handoff before code changes, especially when the user asks to validate, poke holes, challenge assumptions, or review a plan without executing it.
---

# Plan Review

Run a read-only plan review swarm. Load the whole artifact, compare it to live code/docs, dispatch bounded reviewer lanes for substantial plans, and challenge assumptions before anyone implements.

Core pipeline:

```text
plan artifact
  -> whole-artifact coverage
  -> shared plan review packet
  -> Codex plan-review lanes
  -> optional external adversarial counsel
  -> parent verification and synthesis
  -> receive findings
  -> address accepted plan issues
  -> verdict, findings, and plan edits
```

## Core Rules

- Do not implement while reviewing.
- If a plan file exists, run `wc -l` and read every chunk before judging it.
- Treat the plan as a claim, not truth. Verify major claims against current code, docs, package metadata, tests, and branch state.
- Separate blocker, important, question, and nit findings.
- Include evidence: file path, symbol or section, failure scenario, smallest fix, and proof/test.
- For substantial plans, dispatch bounded read-only Codex subagent lanes by default. Skip subagents only for tiny plans, missing tool support, or explicit user request.
- Give subagents curated packets. Do not rely on inherited session context.
- Subagent packets must explicitly say "do not edit files"; check the diff after they return if the tool surface permits edits.
- Include Claude, Gemini, or extra `agy` adversarial counsel only when the user explicitly asks. Use the Claude Code CLI harness for Claude and `agy` for Gemini.
- Treat subagent and external counsel output as candidate findings only. The parent reviewer verifies and owns synthesis.
- After review, validate every candidate finding before accepting it. Do not blindly apply reviewer suggestions.
- When reviewing a plan the current agent authored or can edit, address accepted blocker and important findings by revising the plan unless the user explicitly asked for report-only review.
- If a finding is unclear, conflicts with user decisions, or would change code scope rather than plan text, stop and ask before changing the plan.
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
5. Build a shared plan review packet.
6. Dispatch Codex plan-review lanes for substantial plans.
7. Add optional external adversarial counsel when requested.
8. Verify, dedupe, and rank candidate findings.
9. Receive and address findings:
   - read all feedback before reacting
   - understand each finding in technical terms
   - verify it against plan text and repo reality
   - accept, reject, defer, or ask for clarification
   - revise the plan for accepted blocker/important findings when the plan artifact is writable
10. Re-check revised plan sections when edits were made.
11. Write a review report in chat. If useful or requested, also write it under the plan workflow temp directory.

## Codex Plan-Review Lanes

For substantial plans, spawn bounded read-only Codex subagents in parallel when the tool surface supports it.

Default lanes:

- `spec-compliance`: checks whether the plan satisfies the stated goal, user constraints, and source artifact.
- `architecture-assumptions`: challenges module boundaries, ownership, data flow, dependency direction, and hidden coupling.
- `testability-validation`: checks whether the proposed tests and commands actually prove behavior and catch likely failures.
- `security-reliability`: looks for trust-boundary, secret/token, race, cleanup, rollback, observability, and partial-failure gaps.
- `execution-scope`: checks ordering, cutovers, migration completeness, ambiguous task packets, and overbroad or under-specified work.
- `adversarial-design`: pokes holes in assumptions, contradictions, tradeoffs, and simpler alternatives.

For tiny plans, run at least one local adversarial pass and state why the full swarm was skipped.

Each subagent receives the same shared packet plus one lane focus. It must return:

- lane name
- verdict: ready, needs revision, or blocked
- findings grouped as blocker, important, question, or nit
- evidence, failure scenario, smallest plan edit, proof/test, and confidence

## External Counsel

Load `references/external-counsel.md` when the user asks to include Claude, Gemini, or `agy` in the plan review.

- `agy` / Gemini: optional external adversarial counsel when explicitly requested for plan review.
- Claude: optional external adversarial counsel only when explicitly requested; use `claude --print` / `claude -p`, not API calls.
- Oracle: excluded.

External counsel receives the shared plan review packet and produces candidate findings only. Parent verification still decides what is accepted.

## Reduction

After lanes return:

1. Read every lane output.
2. Verify each candidate against the plan text, live code, docs, package metadata, tests, or branch state.
3. Deduplicate by root cause.
4. Drop speculation without a concrete failure path.
5. Preserve disagreement as an open question only when it changes implementation.
6. Rank accepted findings by execution risk.
7. Produce smallest plan edits, not implementation patches.

## Addressing Accepted Findings

Plan review includes review reception. Reviewer output is not done when the swarm reports back.

If the current agent authored the plan, or the plan artifact is in the current writable workspace:

1. Validate each candidate finding before acting.
2. Reject technically incorrect or unsupported findings with a short reason.
3. Clarify ambiguous findings before editing when ambiguity changes the plan.
4. Apply accepted blocker and important findings to the plan one at a time.
5. Re-read the edited sections and verify the edit resolves the finding without changing implementation scope.
6. Report which findings were accepted, rejected, deferred, or need user decision.

If the user explicitly asked for read-only/report-only review, or the plan belongs to another agent and should not be changed, do not edit. Return exact plan edits for the owner to apply.

Never convert plan review into code implementation. Accepted findings change the plan; `plan-validate-execute` handles code execution.

## Progressive Disclosure

- Load `references/review-packet.md` before dispatching subagents or writing a copy-paste review prompt.
- Load `references/review-checklist.md` when the plan is large, risky, or implementation-facing.
- Load `references/external-counsel.md` when user-requested Claude, Gemini, or `agy` counsel is included.

## Output Shape

Return:

- Coverage evidence.
- Verdict: ready, needs revision, or blocked.
- Findings grouped by severity.
- Questions that must be answered before execution.
- Suggested smallest plan edits.
- Accepted/rejected/deferred findings and any plan edits applied.
- Swarm coverage: lanes run, lanes skipped, external counsel status, and verification notes.
- Explicit "do not implement code yet" note unless the user changes scope.
