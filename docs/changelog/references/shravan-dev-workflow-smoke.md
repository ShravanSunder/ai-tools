# Shravan Dev Workflow Smoke

Use this after installing or refreshing `shravan-dev-workflow` and restarting
Codex. This is maintainer/release guidance, not human overview content.

## 1.7.0 Execution Status

Not executed for the 2026-07-30 source update. Pressure testing was deferred by
user direction. No Codex or Claude refresh/reinstall was performed; installed
readback remains `1.6.72`. The checks below are future post-refresh behavior
proof, not evidence already obtained.

## Post-Restart Smoke Test

1. Confirm `spec-design`, `program-design`, and `spec-program-review` appear as the three primary spec/program skills. Confirm `spec-creation-swarm` and `spec-review-swarm` still appear with legacy display labels.
2. Ask: `Define the problem, requirements, observable contract, and proof obligations for this feature.` Confirm generic Why/What routes to `spec-design`, not a legacy swarm.
3. Ask: `Turn this settled specification into a component, ownership, state, failure, and proof-seam design.` Confirm structural How routes to `program-design`.
4. Ask: `For this exact specification digest, classify whether independent specification-only review is required.` Confirm `spec-program-review` returns the classifier result or a blocked missing-input result with zero reviewer dispatch and no review verdict.
5. Ask for specification-only, program-only, and pair review. Confirm each invocation binds exact digests, dispatches one fresh mode-complete reviewer plus only predicate-selected focused lanes, and returns a non-accepting coverage-bound verdict.
6. Ask generic `Grill me on requirements I have not decided.` Confirm it routes to `discuss-pathfinding`. Ask `Our previously agreed model drifted after this constraint changed; reconverge it.` Confirm only the explicit drift case routes to `discuss-clarify-mental-models`.
7. Ask: `Threat-model this service as a standalone security exercise.` Confirm it routes to `ops-security-review`, while security obligations inside broader specification/program-design work remain with the owning design/review skill.
8. Ask to create or evaluate each new skill as a runtime skill package. Confirm all three named-package requests route through `skills-creation`.
9. Ask for `spec-creation-swarm` and `spec-review-swarm` by exact name. Confirm explicit legacy invocation still works and generic design/review prompts never select them.
10. Ask `spec-handoff` to package a design whose How is missing, then one with complete but stale pair review, then one with a current exact-digest pair-mode `ready` result. Confirm next routes are `program-design`, `spec-program-review`, and `plan-creation-swarm`, respectively.
11. Ask plan creation from a specification alone, from a complete pair with stale review, and from a current pair-mode `ready` review bound to exact current digests. Confirm the first two route upstream and only the third admits design-bearing planning.
12. Ask plan creation for a claimed implementation-mechanics-only change. Confirm the planner inspects current sources and admits the bypass only after positively excluding every design-bearing category.
13. Ask for a plan review against a written implementation plan and then against a `plan-handoff` packet. Confirm both route to `plan-review-swarm`; a `spec-handoff` packet routes to `spec-program-review`.
14. Ask for a small implementation review. Confirm Codex builds a shared packet and dispatches read-only reviewer lanes; external model lanes run only when explicitly requested.
15. Ask `orchestrator-goal` for an already-clear goal, never-articulated intent, and a drifted existing goal. Confirm they route to goal compilation, `discuss-pathfinding`, and `discuss-clarify-mental-models`.
16. Exercise `docs-maintain`, `debug-investigation`, `skill-audit`, `implementation-execute-plan`, `implementation-pr-wrapup`, and both handoff skills with their normal true prompts.
17. Confirm final reports include coverage, terminal receipts or explicit gaps, artifact links where expected, and only parent-verified findings.

## Behavioral Pass Criteria

- Codex treats subagent, `agy`, Claude, and other reviewer-lane outputs as candidate findings, not final truth.
- Accepted reviewer findings are validated against repo reality before routing
  or tiny explicitly scoped same-session fixes.
- Current-session implementation reviews route accepted blocker/important
  findings back to `implementation-execute-plan` unless a tiny same-session
  review-fix is explicitly scoped.
- PR review threads are resolved only after they are proven stale or the real issue is fixed and verified.
- Claude is not invoked unless explicitly requested, and when invoked it uses `claude --print`, not Anthropic API calls.
- Gemini/agy is not invoked unless explicitly requested.
- Oracle is not mentioned or invoked.
- Failed or skipped external model lanes are reported without failing the whole review.
- Plan review uses bounded read-only subagents by default for substantial plans, and skips them only with a stated reason.
- Plan review writes a temp report for substantial reviews unless chat-only/no-files was requested.
- Plan review routes accepted blocker/important plan findings back to
  `plan-creation-swarm`; only tiny same-session plan copy edits are made when
  explicitly scoped, and it does not implement code.
- `spec-design` owns authoritative Why/What; `program-design` owns structural
  How; `spec-program-review` owns reviewer-free classification and fresh
  independent review. None is a fourth orchestration skill.
- Direct named-package creation/update/evaluation for any of those three routes
  through `skills-creation`.
- `spec-creation-swarm` and `spec-review-swarm` remain explicit-only legacy
  workflows and do not win generic spec/design/review prompts.
- Standalone threat-model prompts route to `ops-security-review`; ordinary
  security obligations and trust-boundary realization remain inside their
  broader specification/program-design/review context.
- Spec-handoff packages spec/design context only, keeps open questions visible,
  preserves exact digests and pair-review freshness, and does not create an
  implementation plan or call the pair complete.
- Plan-creation-swarm writes an implementation plan only, stays read-only,
  admits design-bearing work only from a current pair-mode `ready` result bound
  to the exact current specification/program-design digests, and admits the
  implementation-mechanics-only bypass only after positive classification.
- Plan-handoff packages existing implementation plans only; spec/design context
  routes to `spec-handoff` or `plan-creation-swarm`.
- Implementation-handoff requires implementation state and does not package no-diff planned work.
- Generic `grill me` and unmade decisions route to `discuss-pathfinding`;
  `discuss-clarify-mental-models` requires explicit drift or break in an
  existing shared model.
- Orchestrator-goal compiles clear goals, routes never-articulated intent to
  `discuss-pathfinding`, and routes drifted goal models to
  `discuss-clarify-mental-models`.
- docs-maintain identifies source-of-truth drift before editing, owns cleanup/promotion of existing workflow artifacts, and keeps detailed history in docs, not `AGENTS.md`.
- ops-security-review routes explicit scans to official Codex Security workflows and does not claim audit coverage from a normal review lane.
- Debug investigation does not implement fixes until the diagnosis is proven or uncertainty is explicitly accepted.
- Debug investigation writes a debug artifact for real debugging unless chat-only/no-files was requested.
- Skill audit recommends updates before new skills and cites evidence or upstream inspiration for every recommendation.
