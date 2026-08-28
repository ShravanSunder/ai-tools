# 2026-08-07 manage-agents dispatch discipline — proof notes

Spec: `docs/wip/skills-authoring/2026-08-07-manage-agents-dispatch-discipline.md` (accepted-to-implement r8). Plugin lands as `2.2.0 → 2.3.0` because master shipped 2.2.0 for goal-delivery-intent first.

## Runs

- Run 1: When-to-call-what table; Operator bright line for mechanical subagent work; Luna high/xhigh preferred; Terra removed from pattern tables; Delegate Mini/Luna max.
- Run 2: Trigger rewrite; two-level mental model (job graph then dispatch chain); step 0 + `references/job-planning.md`.
- Run 3: Slim aligned job packet (~10 fields, one `route:` line); session-ledger `return binding` vocabulary.
- Run 4: Capability Economics; reviewer history bright line; ACPX packet context; parallel-safety predicates and context conservation.

## Validation

- Spec-review lanes on r1, r3, r4+r5, r7; accepted findings folded in.
- Live pressure evals (legacy self-report JSON + deterministic regex, not an LLM judge): `operator-for-mechanical`, `pattern-selection-unnamed`, `job-decomposition-before-dispatch`, `capability-economics`, `session-ledger-reduction` — 5/5 pass when run serially with `vitest -t`.
- Hard-cutover: old packet keys (`assignment purpose`, `continuity reason`, `receipt scope`, `write scope`, `workspace access` as packet keys) do not survive in the skill tree. Session ledger keeps its own `continuity reason` row.
- `claude plugin validate .` passed. Codex/Claude cache refresh is post-merge.

## Deferred

Changeset C: Claude Code `PreToolUse` hook on `Task` plus the `my_agents.md` bright line in devfiles.
