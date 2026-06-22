# Shravan Dev Workflow Smoke

Use this after installing or refreshing `shravan-dev-workflow` and restarting
Codex. This is maintainer/release guidance, not human overview content.

## Post-Restart Smoke Test

1. Confirm the skills appear in the available skill list as `shravan-dev-workflow:implementation-review-swarm`, `shravan-dev-workflow:plan-handoff`, `shravan-dev-workflow:implementation-handoff`, `shravan-dev-workflow:spec-creation-swarm`, `shravan-dev-workflow:discuss-with-me`, `shravan-dev-workflow:orchestrator-goal`, `shravan-dev-workflow:docs-maintain`, `shravan-dev-workflow:spec-review-swarm`, `shravan-dev-workflow:spec-handoff`, `shravan-dev-workflow:plan-creation-swarm`, `shravan-dev-workflow:ops-security-review`, `shravan-dev-workflow:plan-review-swarm`, `shravan-dev-workflow:implementation-execute-plan`, `shravan-dev-workflow:debug-investigation`, `shravan-dev-workflow:skill-audit`, `shravan-dev-workflow:tui-presentation`, and `shravan-dev-workflow:ops-linear-tracking`.
2. Ask for a small local review: `Use implementation-review-swarm to review the last change.`
3. Confirm Codex builds a shared review packet, runs spec compliance when applicable, and dispatches read-only reviewer lanes, normally backed by Codex subagents.
4. Ask for a plan review: `Use plan-review-swarm on this plan and include Gemini/agy adversarial counsel.`
5. Confirm substantial plan reviews run bounded plan-review-swarm lanes and record skipped or completed external model lanes.
6. Ask for a spec creation pass: `Use spec-creation-swarm to shape this feature before writing a plan.`
7. Ask for lifecycle alignment: `Use discuss-with-me to talk through this design decision before editing files.`
8. Ask for a goal contract: `Use orchestrator-goal to turn the already-discussed plugin release into a verifiable /goal.`
9. Ask for a fuzzy goal: `Use orchestrator-goal to make my workflow better.`
10. Confirm the clear case compiles a goal contract and the fuzzy case routes to `discuss-with-me`.
11. Ask for docs maintenance: `Use docs-maintain to reconcile this README and AGENTS.md with current plugin state.`
12. Ask for a spec review swarm pass: `Use spec-review-swarm to attack this spec before planning.`
13. Ask for a spec handoff: `Use spec-handoff to package this design for another agent without creating the implementation plan.`
14. Ask for plan creation: `Use plan-creation-swarm to turn this spec into an implementation plan without editing code.`
15. Ask for scan routing: `Use ops-security-review for this authorized PR security scan.`
16. Ask for a read-only debug pass: `Use debug-investigation to investigate this failing test without editing files.`
17. Ask for an audit pass: `Use skill-audit to inspect shravan-dev-workflow and recommend only high-confidence skill updates.`
18. Confirm `agy` availability with `command -v agy`, `agy --version`, and `agy models` only before a user-requested Gemini/agy lane.
19. Confirm Claude Code harness availability with `claude --version` and a Haiku smoke only before a user-requested Claude lane.
20. Run one review request that includes an external adversarial model lane: `Use implementation-review-swarm and include Gemini/agy adversarial review.`
21. Run one review request that includes Claude explicitly: `Use implementation-review-swarm and include Claude adversarial review.`
22. Confirm the final report includes a verdict, swarm coverage, skipped inputs if any, candidate counts, artifact paths where expected, and only verified findings.

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
- Spec-creation-swarm does not implement code, writes an artifact for clear
  substantial spec/design work unless chat-only/no-files was requested, keeps
  product intent, requirements, and technical contract distinct when they are
  load-bearing, and records security context when sensitive surfaces are
  touched.
- Spec-handoff packages spec/design context only, keeps open questions visible, and does not create an implementation plan or call the spec complete.
- Plan-creation-swarm writes an implementation plan only, stays read-only,
  preserves accepted product intent, requirements, and spec contract as source
  context, and routes review/execution to `plan-review-swarm` or
  `implementation-execute-plan`.
- Plan-handoff packages existing implementation plans only; spec/design context
  routes to `spec-handoff` or `plan-creation-swarm`.
- Implementation-handoff requires implementation state and does not package no-diff planned work.
- Discuss-with-me triggers only when explicitly requested, stays scoped to design/spec/plan/implementation/docs decisions, and asks one question at a time when evidence cannot answer.
- Orchestrator-goal uses only two paths: clear goals become contracts; unclear goals route to discuss-with-me.
- docs-maintain identifies source-of-truth drift before editing, owns cleanup/promotion of existing workflow artifacts, and keeps detailed history in docs, not `AGENTS.md`.
- spec-review-swarm preserves accepted, contested, and open findings instead of
  forcing fake consensus, and accepted blocker/important findings route back to
  `spec-creation-swarm`.
- ops-security-review routes explicit scans to official Codex Security workflows and does not claim audit coverage from a normal review lane.
- Debug investigation does not implement fixes until the diagnosis is proven or uncertainty is explicitly accepted.
- Debug investigation writes a debug artifact for real debugging unless chat-only/no-files was requested.
- Skill audit recommends updates before new skills and cites evidence or upstream inspiration for every recommendation.
