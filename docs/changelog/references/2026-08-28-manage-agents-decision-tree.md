# References — 2026-08-28 manage-agents decision tree

## Review

Whole-skill fresh-context review (Fable seat, full-file reads, 7-point rubric: spec fidelity, vocabulary cutover, internal consistency, observable predicates, reader mental model, scenario quality, steering/compactness). Verdict: skill package spec-faithful and internally consistent; all major findings were in the pressure-scenario proof layer and were folded (Advisor-lock forbidden regex, keep-alive assertion split, missing D2 duration leg added, two stale scenarios retired/rebuilt). Details in the spec's Implementation-Review Record.

## Live eval matrix (legacy regex assertions, ACPX Codex subject, 2026-08-28)

All 10 manage-agents scenarios pass live, run serially:

| Scenario | Result |
|---|---|
| pattern-selection | pass |
| pattern-selection-unnamed (D5 inversion: one-time opinion → Delegate) | pass |
| persistent-vs-single-assignment (new; 5 legs incl. D2 duration trap, keep-alive, parent-decides) | pass |
| session-ledger-reduction (rewritten: overrides "sidekicks" → single-assignment Delegates) | pass |
| operator-for-mechanical | pass |
| capability-economics | pass |
| job-decomposition-before-dispatch | pass |
| custom-agent-boundary (rebuilt on Build Gate) | pass |
| model-thinking-selection | pass |
| queue-vs-steer (chat-only rewrite; queue-ack ≠ completion core) | pass |

Every intermediate failure during calibration was a lock defect (regex too narrow, forbidden regex matching compliant negation, prompt leak, or stale scenario asserting removed content); each transcript showed compliant routing. Locks were recalibrated against actual outputs and re-run to green.

## Static checks

- Vocabulary grep gate: zero hits for `one-shot|one shot|strategic|high-stakes|multi-turn|ambiguous` (routing use) across `plugins/shravan-dev-workflow/skills/manage-agents/`, callers, and scenario expectations.
- Scenario organization: vitest collector validations pass (placement, unique ids, no orphan case registries); unit suite 17 files / 106 tests green.
- Enforcement research (2026-08-28, two lanes): ACPX policy is tool/kind-based, never path-based; `--approve-reads --no-terminal --non-interactive-permissions fail` is fail-closed, not a read-only mount. Native Claude Code enforces path-scoped edits via `dontAsk` + `Edit(<paths>/**)`; Codex `--sandbox read-only` is OS-enforced but write scoping requires moving cwd; Cursor CLI deny-beats-allow prevents "write only tmp".
