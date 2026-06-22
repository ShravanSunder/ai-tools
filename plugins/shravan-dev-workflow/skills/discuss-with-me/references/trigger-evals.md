# Trigger Evals

Use this when updating or validating `discuss-with-me`.

## Should Trigger

```text
Use discuss-with-me to talk through this design before editing files.
```

Expected: classify `design`, stay read-only, inspect available artifacts, state what could be wrong with the current read, present the scoped map when more than one reading exists, and ask one forcing question with a recommended default.

```text
No changes yet; reflect back the plan/spec boundary.
```

Expected: classify `spec` or `plan`, summarize the current model, surface assumptions, do not edit.

```text
Grill me on this plan before we write it.
```

Expected: classify `plan`, use `grill-me`, deliver the full Grill Contract: the user's model as understood, the strongest countercase, what evidence would change the model, the load-bearing assumption, a recommended default, and one forcing question.

```text
Steelman my position, then tell me where it breaks.
```

Expected: use `steelman` or `stress-test`, state the strongest version of the user's position, name the strongest opposing case or failure mode, and ask one user-owned decision question.

```text
Stress-test the assumptions in this design.
```

Expected: classify `design` or `spec`, name a load-bearing assumption, describe what breaks if it is false, give a recommended default, and ask whether to keep, revise, or make it explicit.

```text
Reflect back the source-of-truth boundary.
```

Expected: use `source-of-truth` or `boundary-check`, compare candidate sources, recommend the driver source, and stay read-only.

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
Use ops-security-review for this authorized PR security scan.
```

Expected: use `ops-security-review`.

```text
Implement the approved plan.
```

Expected: use `implementation-execute-plan` or normal execution flow, not `discuss-with-me`.

```text
Update README and AGENTS to match the new plugin state.
```

Expected: use `docs-maintain`.

## Loopholes To Watch

- Do not trigger on generic "what do you think?" unless the user explicitly wants discussion/alignment without edits.
- Do not let a "Stage: design" declaration stand in for behavior: a build plan, architecture diagram, metrics table, or doc outline is execution-shaped output.
- Do not treat fact-finding plus a presented answer as discussion; the challenge and forcing question are still owed after evidence is read.
- Do not treat "if you understand, keep going" or "just confirm my read" as convergence while a material branch remains.
- Do not batch multiple questions into one turn or form widget; ask the single most load-bearing forcing question.
- Do not converge after presenting only one branch when multiple credible branches exist.
- Do not turn `review` into discussion unless review uncovered a design/spec/plan/docs decision.
- Do not treat `do it` as discussion after the model is already confirmed.
- Do not let `discuss-with-me` spawn subagents by default; route broad design creation to `spec-creation-swarm`.
