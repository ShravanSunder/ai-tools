# Codex Goal Notes

Use this reference for Codex `/goal` or the Codex goal tools.

## Semantics

- `/goal` creates durable objective state for the active Codex thread.
- The agent should create goal state only when the user explicitly asks for a
  goal-backed workflow or the current task is clearly a goal setup.
- Do not add a token budget unless the user explicitly provides one.
- A goal should include objective, scope, required workflow skill, exact required
  reading files, proof gates, stop condition, blocked condition, and checkpoint
  rhythm.
- For multi-phase goal-backed work, the goal should also include `goal_id`,
  `Current workflow`, `Next workflow`, `Terminal condition`, `State details:
  tmp/workflow-state/<goal_id>/details.md`, and `Transition log:
  tmp/workflow-state/<goal_id>/events.jsonl`.
- Keep exact spec, plan, review/report, and handoff paths in `/goal` when they
  are known. Do not move key paths to `details.md` only.
- `orchestrator-goal` is the only official transition writer. Phase skills
  return `phase_result`, `evidence`, `recommended_next_workflow`, and
  `recommended_transition_reason`; the orchestrator verifies evidence and
  records the transition.
- For implementation goals, only the starting point is mutable. Existing spec,
  plan, diff, or PR artifacts move `Current workflow` to the first unproven
  lifecycle gate; they do not shrink the terminal condition by themselves.
- The default implementation terminal is PR created or updated and proven ready,
  not merged. This pr-ready non-merge boundary requires implementation proof,
  the full proof loop, implementation review disposition, fresh PR
  checks/review-thread/mergeability state, and explicit no-merge handling unless
  the user authorizes merge.
- If `/goal`, `details.md`, and `events.jsonl` disagree, `/goal` owns scope and
  key artifact paths, the latest valid orchestrator event in `events.jsonl`
  owns workflow transition state, and `details.md` owns expanded context.
- Completion requires current verification evidence.
- Blocked means the same blocking condition has recurred under the host's
  blocked-state rules, not merely that the work is hard or waiting on a
  nice-to-have clarification.

## Suggested Codex Goal Prompt

```text
/goal <objective>. Goal id: <yyyy-mm-dd-slug>. Scope: <allowed scope>. Non-goals: <non-goals>.
Required workflow skill: use `shravan-dev-workflow:orchestrator-goal`.
Required reading: <exact plan/spec/handoff paths and related files>.
Current workflow: <skill-or-state>. Next workflow: <skill-or-terminal>.
Terminal condition: <exact complete condition>.
State details: tmp/workflow-state/<goal_id>/details.md.
Transition log: tmp/workflow-state/<goal_id>/events.jsonl.
Proof gates: <commands/artifacts>.
Complete only when <stop condition; for implementation goals, default to PR
created/updated and proven ready, not merged>. Treat as blocked only when
<blocked condition>. Checkpoint by <checkpoint rhythm, including checkpoint
commits when scoped files changed and repo policy permits>.
```

## Current-Session Tooling

When available, use the goal tools consistently with host rules:

- `get_goal` to inspect active goal state when goal state matters.
- `create_goal` only when explicitly requested and no active conflicting goal
  exists.
- `update_goal` with `complete` only after proof gates pass.
- `update_goal` with `blocked` only when the host blocked threshold is met.
- Before `update_goal` with `complete` or `blocked`, report the Goal Closeout
  Audit with gate/status/evidence/next rows. Use only `done`,
  `not-applicable`, `open`, or `blocked`. A `done` row requires an evidence
  pointer.
- Before `update_goal` with `complete`, include the workflow state block
  (`goal_id`, current workflow, next workflow, terminal condition, state
  details, transition log, latest transition source). If implementation remains
  in scope after plan review, the goal is not complete; route next to
  `implementation-execute-plan`.
- Before `update_goal` with `complete` for an implementation goal, prove the
  terminal is the default implementation terminal or an explicitly smaller user
  scope. If `implementation-execute-plan`, `implementation-review-swarm`,
  `implementation-pr-wrapup`, app/runtime proof, metrics, visual/manual proof,
  PR readiness, or review-thread/check state remains open, leave the goal not
  complete and name the next workflow.

Do not use goal state as a substitute for plan review, implementation review,
or verification commands.
