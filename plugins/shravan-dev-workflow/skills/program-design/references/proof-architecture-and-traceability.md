# Proof Architecture and Traceability

This reference owns requirement realization, structural proof seams, real/fake boundaries, and enforcement classes.

Expected inputs: requirement/proof-modality inventory and complete target structure/flows/failure models.

Return: requirement-to-design-to-proof map, seam sufficiency, dependency proof classes, enforcement decisions, and gaps.

Build:

```text
requirement
  -> responsible component/owner
  -> interface/state/flow realization
  -> observable boundary
  -> unit/integration/smoke/e2e/manual/operational seam
  -> required state/log/trace/metric/artifact
  -> structural invariant and enforcement class
```

Classify each dependency:

```text
in-process
locally substitutable
remote but owned
true external
```

State what must be real, what may be replaced through the designed seam, and what observation proves the behavior. A mockable signature without a production-realistic observation path is not proof architecture.

Use a proof call graph when the test or operational harness follows materially different owners or boundaries than production. Show the driver/fixture, real versus replaced boundaries, observation point, and evidence returned; otherwise keep proof on the requirement/design/proof trace.

Choose enforcement class where appropriate:

```text
type or interface
schema
runtime guard
transaction/atomic boundary
lint/static rule
automated test
health check
operational alarm
```

Do not choose exact files, commands, TDD order, or evidence-capture mechanics.

Complete when: every material requirement has one structural realization and plausible proof seam, every material design element traces back to a legitimate need, and unprovable claims remain explicit.
