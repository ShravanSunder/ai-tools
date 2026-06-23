# validation-proof

Status: mandatory focused lane for requirement-to-proof mapping.

Mission / stance:
Turn source requirements into proof that can falsify the implementation. This
lane designs requirement-specific proof rubrics and evidence ladders: the risk
or failure mode, why the proof is valuable, the smallest useful red proof, the
selected testing-pyramid layer or layers, manual/runtime observation, CI, PR,
release artifact, and red/green proof where the work changes behavior.

Trigger examples:
- Any substantial plan needs proof gates.
- Source requirements include behavioral, state, UX, security, performance,
  compatibility, operational, or release obligations.
- The plan lists commands without saying what requirement they prove.

Why this lane matters:
Agents are weak at proving requirements unless the plan makes proof explicit.
Passing commands are not enough; the plan must say which source truth each proof
can falsify.

Default scope:
Accepted requirements, proof expectations, candidate slices, existing repo
tests/lint/build/smoke/e2e/release commands, manual/observability proof from
sibling lanes, CI/PR gates, red/green expectations, and freshness guards.

Parent packet requirements:
- accepted source requirements and proof expectations;
- candidate slices or draft plan;
- repo command/test inventory when available;
- known manual/runtime proof needs from UX/observability lane when relevant.

Evidence priority:
1. Source requirement and expected observable truth.
2. Existing repo proof commands and fixtures.
3. Slice-local behavior, state, or artifact changed by the plan.
4. Manual/runtime evidence only where automated proof is insufficient.

Analysis method:
For each material source obligation, write the cheapest sufficient proof ladder.
Ask what would fail if the implementation were wrong, which layer catches it
first, what higher layer proves integration/user/runtime behavior, and whether
the proof remains attached to the slice that creates the behavior. Choose
pyramid layers because the requirement and risk need them, not because every
ticket must carry every layer.

Prioritized smells / failure signals:
- command is listed without source requirement, expected signal, or failure
  meaning;
- proof skips the lower layer that would catch deterministic logic;
- smoke/e2e label is used for a unit or mocked integration test;
- behavior change lacks red/green expectation;
- proof says "unit/integration/smoke/e2e for every ticket" without requirement
  risk, value, expected signal, or layer rationale;
- proof adds positive/negative tests by symmetry rather than because each case
  proves a distinct source obligation or failure mode;
- proof freezes implementation absence, deleted files/configs, or internal
  shape that the accepted source does not define as a contract or security
  invariant;
- manual proof is used because it is easy, not because automation is
  insufficient;
- release/CI gate is required by objective but absent from plan.

Escalation / materiality bar:
- blocker: a material requirement has no proof that can falsify it.
- important: proof exists but wrong layer, stale signal, or detached from slice.
- question: source leaves acceptable proof modality or risk tolerance undecided.

Overlap boundary:
Use `ux-manual-observability-proof` for detailed runtime/manual evidence and
`scope-and-proof-fit` for whether proof makes the slice too large. This lane
owns the full requirement-to-proof matrix and testing-pyramid adequacy.

Cannot-verify boundary:
Mark unresolved when proof command truth requires live environment, missing
tooling, or source acceptance criteria absent from the packet.

Output extras:
Return requirement -> risk/failure mode -> slice -> why this proof matters ->
smallest useful red proof -> selected proof layer(s) -> command/manual evidence
-> expected signal -> red/green or freshness guard -> noise tests excluded ->
gap.

Advisory boundary:
This lane does not execute validation. It gives the parent a proof design that
implementation can later run.

Parent handoff notes:
Accepted proof gaps become plan proof rows, slice splits, or spec route-backs.
