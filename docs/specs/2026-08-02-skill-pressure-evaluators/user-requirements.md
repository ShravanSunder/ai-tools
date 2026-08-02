# Skill pressure evaluator user requirements

## Goal boundary

Skill authors need a small, trustworthy way to run realistic pressure scenarios against `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review`, then distinguish objective failures from semantic failures without paying for repeated subject executions.

The existing Markdown scenarios, Vitest runner, and Vitest Evals integration remain the foundation. Subject and judge model execution share an injected ACPX runner with separate typed setups. The missing behavior is typed evaluator authoring, one cost-bounded semantic judgment, configurable model execution, and useful native eval reporting.

Allowed scope is the repository-local `tests/skills/` pressure system and the eight existing scenarios for the four named skills. The change may update the test-local Vitest dependencies. It must not create a reusable package, scheduler, run database, replay system, scenario lifecycle framework, target projection system, calibration system, or additional judge chain.

The complexity budget is one Markdown scenario fixture plus one declarative entry in its skill folder's typed registry, one subject execution, named evaluators over one normalized observation, and one native Vitest result row. Any cross-run state, multiple evaluator report rows, retries, weighted scoring, or Voyager-style lifecycle machinery requires a new decision.

## Authorized needs

| ID | Affected class | Need and outcome | Evidence and authority | Priority |
| --- | --- | --- | --- | --- |
| U1 | Skill author | Run each expensive Luna pressure scenario exactly once while applying every relevant evaluator to the same observation. | Authorized by the repository owner in the current design session. | Must, owner assigned |
| U2 | Skill author | Express objective obligations as deterministic evaluators and semantic obligations as a Terra evaluator, without brittle keyword tests standing in for understanding. | Authorized by the repository owner in the current design session. | Must, owner assigned |
| U3 | Skill author | Keep subject input separate from evaluation criteria so the subject cannot see the answer key. | Authorized by the repository owner in the current design session. | Must, owner assigned |
| U4 | Skill author | See named evaluator outcomes through the native Vitest Evals reporter and retain evaluator rationale in native task metadata or its linked artifact, without a second report format. | Authorized by the repository owner in the current design session. | Must, owner assigned |
| U5 | Owning agent | Treat an inconclusive Terra judgment as a failed evaluation, inspect the saved evidence, and decide or ask the user without launching another automatic judge. | Authorized by the repository owner in the current design session. | Must, owner assigned |
| U6 | Repository maintainer | Use native Vitest collection, concurrency, timeout, tags or name filtering, and reporting rather than maintaining parallel runner behavior. | Authorized by the repository owner in the current design session. | Must, owner assigned |

## Negative space

- No evaluation of skills outside the four named skills in this slice.
- No baseline-versus-treatment comparison.
- No evaluator-specific subject reruns or projected result rows.
- No exact trajectory matching unless a future scenario makes the trajectory itself contractual.
- No hashes, digests, weighted aggregate scores, calibration ceremony, automatic retries, or second model judge.
