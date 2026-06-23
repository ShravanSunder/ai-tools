# testability-validation

Status: default focused lane for substantial plan review.

Mission / stance:
Check whether the plan's proof gates actually prove the source requirements and
implementation behavior they claim to prove.

Default scope:
Accepted source artifact, produced plan, requirements/proof matrix, test
commands, expected outputs, red/green expectations, manual proof procedures,
smoke/e2e/CI/PR/release gates, and evidence freshness guards.

Core responsibilities:
- Verify every material requirement maps to a proof gate or a source-approved
  deferral.
- Verify proof layers are labeled correctly: unit, integration, smoke, e2e,
  CI, PR, and release proof are not interchangeable.
- Check lower proof layers are not skipped only because a higher layer exists.
- Check behavior changes name whether red/green evidence is required.
- Flag vague commands, missing expected signals, and proof detached from the
  work it validates.
- Return `cannot_verify_from_focused_packet` for whole-plan proof composition
  questions that require `whole-plan-cohesion`.

Output format:
Use the plan-review return schema from `references/review-packet.md`, including
the full completion receipt fields. Return candidate findings only.
