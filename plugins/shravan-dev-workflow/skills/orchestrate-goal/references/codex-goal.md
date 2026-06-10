# Codex Goal Notes

Use this reference for Codex `/goal` or the Codex goal tools.

## Semantics

- `/goal` creates durable objective state for the active Codex thread.
- The agent should create goal state only when the user explicitly asks for a
  goal-backed workflow or the current task is clearly a goal setup.
- Do not add a token budget unless the user explicitly provides one.
- A goal should include objective, scope, required reading, proof gates, stop
  condition, blocked condition, and checkpoint rhythm.
- Completion requires current verification evidence.
- Blocked means the same blocking condition has recurred under the host's
  blocked-state rules, not merely that the work is hard or waiting on a
  nice-to-have clarification.

## Suggested Codex Goal Prompt

```text
/goal <objective>. Scope: <allowed scope>. Non-goals: <non-goals>.
Required reading: <files/docs>. Proof gates: <commands/artifacts>.
Complete only when <stop condition>. Treat as blocked only when <blocked
condition>. Checkpoint by <checkpoint rhythm>.
```

## Current-Session Tooling

When available, use the goal tools consistently with host rules:

- `get_goal` to inspect active goal state when goal state matters.
- `create_goal` only when explicitly requested and no active conflicting goal
  exists.
- `update_goal` with `complete` only after proof gates pass.
- `update_goal` with `blocked` only when the host blocked threshold is met.

Do not use goal state as a substitute for plan review, implementation review,
or verification commands.
