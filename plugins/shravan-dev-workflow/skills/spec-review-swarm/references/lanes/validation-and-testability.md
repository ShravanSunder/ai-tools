# validation-and-testability

Status: mandatory

Mission / stance:
Pressure-test whether proof expectations can feed a later requirements/proof
matrix without forcing the plan to invent requirement meaning.

Trigger examples:
- Any substantial spec will become an implementation plan.
- The spec claims behavior without naming proof modality.

Why this lane matters:
It keeps validation from being invented too late in planning. The spec owns what
must be provable, why it matters, and the evidence shape that would count. The
plan owns selected pyramid layers, commands, gates, and execution sequencing.

Default scope:
Proof expectations, tests, manual UX/visual proof, data/DB/state checks, logs,
traces, metrics, smoke/e2e/CI/PR/release proof, and not-applicable rationale.

Parent packet requirements:
- requirements
- proof expectations
- validation constraints
- relevant existing tests/harnesses

Core responsibilities:
- Check requirement-to-proof trace.
- Flag unverifiable requirements.
- Ensure proof modalities/evidence shapes are named without exact command
  sequencing or rote all-layer pyramid checklists.
- Identify missing higher-layer proof when ready-to-use behavior is implied.
- Flag proof expectations that freeze implementation detail, deleted
  files/configs, or command shape unless the spec defines those as a contract or
  security invariant.

Evidence priority:
1. Requirements and proof expectations.
2. Technical contract surfaces that imply state, data, UI, observability, or
   runtime proof.
3. Existing proof patterns only where the spec cites them.

Analysis method:
For each material requirement, ask whether `plan-creation-swarm` could build a
proof matrix without redefining the spec:

```text
requirement
  -> failure/risk it guards
  -> why proof matters
  -> observable evidence shape
  -> plan-owned proof layer/command/gate later
```

Prioritized smells / failure signals:
- proof expectation is "run tests" with no modality;
- proof expectation is "use pyramid TDD" with no requirement-specific risk,
  value, or evidence shape;
- proof expectation says every requirement needs every proof layer, without a
  contract reason for those layers;
- observable state, log, trace, metric, screenshot, DB/data, or manual UX proof
  needed but unnamed;
- requirement cannot be mapped to a future proof row;
- higher proof layer is used to excuse missing lower-layer proof;
- proof belongs in plan commands, but spec omits what must be proven;
- proof expectation tests implementation absence or internal shape that is not
  a source contract.

Calibration bar:
Report missing proof intent, evidence shape, stale proof assumptions, or proof
layer mismatch.

Overlap boundary:
If the issue is mainly vague requirement language, route it to
`requirements-testability`. If it is mainly plan commands, worker order, or
checkpoint design, route it to `planning-readiness` or later
`plan-creation-swarm`. If it requires whole-spec proof coverage, route it to
`whole-spec-coverage`.

Cannot-verify boundary:
Mark unresolved when exact commands, worker sequencing,
runtime validation, whole-spec proof coverage, or source anchors missing from
the focused packet are required. Use generic unresolved/open output only for
substantive uncertainty after the packet is sufficient.

Output extras:
Include: requirement, proof modality, missing signal, future matrix implication,
non-useful proof to avoid when relevant, and smallest spec edit.

Advisory boundary:
This lane does not choose exact commands or execution sequence.

Parent handoff notes:
Accepted proof findings route to spec creation; plan creation operationalizes
them later.
