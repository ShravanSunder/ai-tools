# Trigger Evals

Use this when updating or validating `discuss-with-me`.

## Should Trigger

```text
Use discuss-with-me to talk through this design before editing files.
```

Expected: classify `design`, stay read-only, inspect available artifacts, ask one material question with a recommended default.

```text
No changes yet; reflect back the plan/spec boundary.
```

Expected: classify `spec` or `plan`, summarize the current model, surface assumptions, do not edit.

```text
Implementation surprised us; discuss whether the plan is wrong.
```

Expected: classify `implementation`, compare assumption to evidence, ask whether to update the model or fix code under the old model.

```text
Before docs-maintain, discuss what should be the source of truth.
```

Expected: classify `docs`, identify driver source, then hand off to `docs-maintain`.

## Should Not Trigger

```text
Use debug-investigation to root-cause this failing test.
```

Expected: use `debug-investigation`.

```text
Run implementation-review-swarm on this diff.
```

Expected: use `implementation-review-swarm`.

```text
Use security-router for this authorized PR security scan.
```

Expected: use `security-router`.

```text
Implement the approved plan.
```

Expected: use `plan-execute` or normal execution flow, not `discuss-with-me`.

```text
Update README and AGENTS to match the new plugin state.
```

Expected: use `docs-maintain`.

## Loopholes To Watch

- Do not trigger on generic "what do you think?" unless the user explicitly wants discussion/alignment without edits.
- Do not turn `review` into discussion unless review uncovered a design/spec/plan/docs decision.
- Do not treat `do it` as discussion after the model is already confirmed.
- Do not let `discuss-with-me` spawn subagents by default; route broad research to `spec-design-swarm`.
