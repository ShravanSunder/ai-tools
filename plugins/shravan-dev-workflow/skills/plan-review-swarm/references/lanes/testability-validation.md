# testability-validation

Status: default focused lane for substantial plan review.

Mission / stance:
Disprove that the plan's proof gates actually prove the source requirements and
implementation behavior they claim to prove.

Trigger examples:
- The plan has test commands, proof gates, manual checks, screenshots, metrics,
  traces, release checks, or a requirements/proof matrix.
- Behavior changes need red/green evidence.
- The plan uses broad phrases like "run tests", "validate manually", or
  "CI will catch it".

Why this lane matters:
Proof theater makes a plan feel safe while no gate would catch the failure the
requirement cares about.

Default scope:
Accepted source artifact, produced plan, requirements/proof matrix, test
commands, expected outputs, red/green expectations, manual proof procedures,
smoke/e2e/CI/PR/release gates, and evidence freshness guards.

Parent packet requirements:
- accepted source proof expectations and requirements
- produced plan proof rows and validation commands
- expected signal for each proof gate when present
- known unavailable proof layers and reasons
- parent routing summary marked as non-evidence

Evidence priority:
1. Source requirements and proof expectations.
2. Plan proof matrix, validation gates, and command expected signals.
3. Repo-local test/validation docs only when the plan cites them.
4. Prior green results only with freshness guard; stale proof is not proof.

Analysis method:
For each material requirement, ask: what failure would violate it, which proof
gate would catch that failure, what signal would fail, and whether lower proof
layers are skipped without reason.

Prioritized smells / failure signals:
- command listed without expected pass/fail signal;
- proof gate not mapped to a source requirement;
- lower proof layer skipped because a higher layer exists;
- manual proof used where durable automated proof is appropriate;
- red/green evidence missing for behavior change;
- screenshot, log, trace, metric, DB/state, or UX proof missing where source
  expectations require it;
- PR/CI/release proof relabeled as unit/integration/smoke proof.

Escalation / materiality bar:
- blocker: a load-bearing requirement has no proof gate or the claimed gate
  would not catch its failure.
- important: proof gate may catch failure but lacks expected signal, freshness
  guard, or layer label.
- question: source requirement is too vague to define proof without revising the
  spec.

Overlap boundary:
If the issue is missing source obligation, route to `spec-compliance`. If proof
gaps come from task sizing or ordering, route to `execution-scope`. If the
issue is cross-slice proof composition, route to `whole-plan-cohesion`.

Cannot-verify boundary:
Return `cannot_verify_from_focused_packet` for final implementation readiness,
full PR/release readiness, or whole-plan proof composition.

Output extras:
Include a proof row: requirement -> failure mode -> proof gate -> expected
signal -> missing evidence or smallest proof step -> confidence.

Advisory boundary:
This lane does not run validation commands. It reviews whether the plan's proof
strategy is capable of proving the work.

Parent handoff notes:
Parent-accepted proof gaps route to `plan-creation-swarm`. If proof cannot be
defined because the requirement is vague, route to `spec-creation-swarm`.
