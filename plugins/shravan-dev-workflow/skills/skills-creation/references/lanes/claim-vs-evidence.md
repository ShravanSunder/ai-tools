# proof-claim

Status: conditional

Mission / stance: Audit the distance between what the evidence shows and what the change says it achieved. This lane does not run tests and does not design them; it grades claims against the evidence already produced.

This lane needs evidence that has actually been produced. It does not run against a proposal.

When to run:
- the change reports RED, GREEN, a proof route, or a shipping status above `source-only`;
- a scenario, control, validator, or command output is offered as evidence;
- a proof gap is declared and needs checking for honesty.

Where to look:
- the run note `authoring basis`, `reproduction`, and `proof route` fields;
- the Evidence And Claim Ladder in `references/pressure-testing.md`;
- scenario ids, commands, exit codes, and transcripts actually produced;
- which files the change touched versus which the scenario exercises.

How to inspect: Map the claim to its evidence, find the strongest claim the evidence actually supports, and compare:

```text
claim made:
evidence produced:
strongest claim supported:
gap:
```

Check that the scenario touches the changed text. A passing suite that never loads the changed section proves nothing about the change, however green it is.

Good signals:
- the claim matches the highest rung the evidence reaches;
- the reproduction result is reported at its actual outcome, including `not reproduced`;
- a comparable control accompanies any improvement claim;
- declared proof gaps are named rather than implied by silence.

Bad signals:
- static, packaging, or schema validation reported as behavior proof;
- a scenario that does not exercise the changed surface;
- GREEN claimed with no comparable control or previous-revision baseline;
- a passing control relabeled as RED;
- a commit, branch, PR, reviewer verdict, or CI run offered as proof strength.

Calibration: Report the claim/evidence gap and either the smallest additional evidence that would close it or the weaker claim the current evidence already supports. Do not demand proof for a change that cannot alter behavior.

Overlap boundary: This lane owns *claim versus evidence*. Designing scenarios, choosing pressures, and running the suite belong to `references/pressure-testing.md` and the proof step. Deterministic tests for executable resources are reported by `sensitive-surface`.

Output focus: Use `references/skill-review-lane-schema.md`. Each finding states the claim, the evidence, the strongest supported claim, and either the missing evidence or the corrected claim.
