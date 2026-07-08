---
name: debug-investigation
description: Use when investigating bugs, failing tests, flaky behavior, crashes, regressions, build failures, unexpected behavior, long-running monitor/watch requests, or requests to debug/root-cause a problem before implementing fixes.
---

# Debug Investigation

Investigate before fixing. This is systematic debugging: build evidence, rank hypotheses, prove a likely root cause, then change code. The main agent owns that loop even when subagents inspect bounded slices.

## Core Rules

- No fixes before root-cause investigation.
- Treat logs, stack traces, failing tests, current code, recent diffs, and runtime state as evidence.
- Use hypothesis-driven debugging: each theory must name supporting evidence, missing evidence, and the smallest proof step.
- Use subagents only for bounded investigation slices. The main agent owns synthesis, evidence checking, and the final diagnosis.
- Use `manage-agents` only for model-agent call/session mechanics; keep
  root-cause method and deterministic watcher guidance here.
- Keep investigation read-only until the user explicitly asks to fix or a validated fix phase begins.
- If 3+ fix attempts already failed, stop and question the design or architecture before trying another patch.
- For real debugging work, write a repo-local debug artifact by default unless the user explicitly asked for chat-only/no-files output.
- If the symptom, target, or reproduction surface is unclear, do not create files yet; ask one material question or build the missing bug packet first.
- Debug artifacts are disposable investigation outputs. Later cleanup, preservation, or promotion belongs to `docs-maintain`.
- For long-running shell, service, or infra monitoring, load
  `references/background-monitoring.md` before proposing watcher shape,
  background jobs, JSONL/state files, helper agents, restarts, or secret
  handling.

## Workflow

1. Build the bug packet:
   - symptom
   - expected behavior
   - actual behavior
   - reproduction steps or why reproduction is not yet proven
   - scope of impact
   - evidence already available
   - artifact path, or why no artifact is being written yet
2. Create the debug artifact when appropriate:
   - Use `<repo-root>/tmp/debug-workflows/<yyyy-mm-dd>-<repo>-<branch>-<bug-slug>/debug-investigation.md`.
   - Keep it updated with evidence, hypotheses, proof steps, and commands.
   - Skip file creation only for chat-only/no-files requests or unclear debugging scope.
3. If a long-running monitor is needed, load
   `references/background-monitoring.md` and keep the watcher read-only,
   harness-visible, cancellable, stateful, and redacted.
4. Reproduce or bound the failure:
   - exact command, UI path, input, or event sequence
   - deterministic, flaky, environment-specific, or not yet reproduced
   - smallest known failing surface
5. Trace the code path:
   - read the failing boundary and callers
   - identify where expected and actual behavior diverge
   - separate source cause from downstream symptom
6. Check recent changes and working examples:
   - git diff, recent commits, changed config, dependency or schema drift
   - nearby working code that follows the intended pattern
7. Form ranked hypotheses:
   - state one concrete root-cause hypothesis at a time
   - list supporting evidence and missing evidence
   - name the smallest proof step
8. Recommend next action:
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

- create or identify a failing test/reproduction first when a durable proof
  fits the scope; otherwise use the smallest real proof and name why a durable
  reproduction does not fit, or split the fix into a provable slice
- make one root-cause fix at a time
- avoid unrelated cleanup
- run targeted verification, then broader relevant checks
- if the fix fails, return to investigation rather than stacking guesses

## Output Shape

Return:

- bug packet summary
- artifact path with a full clickable link (absolute path + line), or why no
  artifact was written
- reproduction/coverage evidence
- most likely root cause
- alternate hypotheses, if still plausible
- fastest proof step
- recommended fix path
- open questions or blockers
