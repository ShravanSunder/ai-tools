# 2026-10-07 skill-authoring recorded misses

`skill-authoring` 0.1.1. Fixes the six skill misses the last live scenario batch recorded. Each fix is one or two sentences at the decision point the subject misread, naming the rationalization it used.

- `skill-creation` step 5: a draft shown in chat still shows each file under its path; provider mechanics and long examples that the placement rules move out go to their own reference, with the load mode those rules choose. Showing a draft in chat is not a request to keep that depth inline.
- `skill-creation` step 6: an explicit skip names the spec review and declines it. Wanting speed, "just implement it", or "no extra review ceremony unless the skill requires it" is not a skip.
- `skill-orchestrator` steps 2 and 6: a stated route names `skill-review`'s spec and implementation stages as the reviewers; review "from agents who did not write the change" does not satisfy the step.
- `skill-review`: implementation review states the scoped-change selection before the surface table, which now applies to unscoped changes; a request for the full treatment does not widen it. The convergence rule gains a worked example: 3 → 2 → 2 → 3 is `not-converging` at the fourth review. Spec review is unchanged; it has no surface table.
- `skill-audit`: combining skills' packets into one shared runtime document because headings or wording repeat is rejected when their fields or meanings differ; the real-consumer or validating-tool exception is unchanged. An audit never implements a change it rejects.
- No new references, checks, scenarios, or criteria. Manifests: all three plugin manifests and the Claude and Cursor marketplace entries.
- Validation: `claude plugin validate .` passed; runner `lint` on the skill set found 0 findings; runner `validate` loads all 16 scenarios of the four skills; `tests/skills` 24 passed.
- Behavior proof: pending; the recorded-failure done bar (three fresh passing Runs per scenario) and regression Runs are separate.
- Codex and Claude cache refresh: not run.
