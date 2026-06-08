---
name: debug-investigation
description: Use when investigating bugs, failing tests, flaky behavior, crashes, regressions, build failures, unexpected behavior, or requests to debug/root-cause a problem before implementing fixes.
---

# Debug Investigation

Investigate before fixing. The main agent must find and prove the likely root cause before proposing code changes.

## Core Rules

- No fixes before root-cause investigation.
- Treat logs, stack traces, failing tests, current code, recent diffs, and runtime state as evidence.
- Use subagents only for bounded investigation slices. The main agent owns synthesis, evidence checking, and the final diagnosis.
- Keep investigation read-only until the user explicitly asks to fix or a validated fix phase begins.
- If 3+ fix attempts already failed, stop and question the design or architecture before trying another patch.

## Workflow

1. Build the bug packet:
   - symptom
   - expected behavior
   - actual behavior
   - reproduction steps or why reproduction is not yet proven
   - scope of impact
   - evidence already available
2. Reproduce or bound the failure:
   - exact command, UI path, input, or event sequence
   - deterministic, flaky, environment-specific, or not yet reproduced
   - smallest known failing surface
3. Trace the code path:
   - read the failing boundary and callers
   - identify where expected and actual behavior diverge
   - separate source cause from downstream symptom
4. Check recent changes and working examples:
   - git diff, recent commits, changed config, dependency or schema drift
   - nearby working code that follows the intended pattern
5. Form ranked hypotheses:
   - state one concrete root-cause hypothesis at a time
   - list supporting evidence and missing evidence
   - name the smallest proof step
6. Recommend next action:
   - prove now
   - fix next
   - follow up later

## Subagent Use

Use parallel read-only subagents when the bug is broad, ambiguous, or multi-layered. Give every subagent the same bug packet and a bounded assignment.

Suggested lanes:

- reproduction and scope
- code path and failure seam
- recent change and regression
- proof plan and observability

Every subagent packet must say:

> Review only. Do not edit files, apply patches, stage changes, commit, or perform state-mutating actions. Return hypotheses, evidence, missing evidence, smallest proof step, and confidence.

The main agent must discard weak speculation, merge duplicates, verify claims against the repo, and present only evidence-backed findings.

## Fix Phase

Only move from investigation to fixing when the root cause is sufficiently proven or the user explicitly accepts the remaining uncertainty.

When fixing:

- create or identify a failing test/reproduction first when practical
- make one root-cause fix at a time
- avoid unrelated cleanup
- run targeted verification, then broader relevant checks
- if the fix fails, return to investigation rather than stacking guesses

## Output Shape

Return:

- bug packet summary
- reproduction/coverage evidence
- most likely root cause
- alternate hypotheses, if still plausible
- fastest proof step
- recommended fix path
- open questions or blockers
