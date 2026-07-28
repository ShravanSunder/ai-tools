# Reference Lanes And Shared Shapes

This reference owns lane qualification, lane job-contract design, and stable shared-shape selection. Return the lane qualification and job contract, or the selected shape owner and validation route.

Use this as authoring guidance inside the `skills-creation` workflow. Each consuming skill owns its runtime packets, lane references, and shared shapes.

A lane is bounded work handed to a subagent. A lane reference defines that work. An optional lane schema defines the common fields shared by multiple lanes.

## Lane Qualification

Work is a qualified lane only when all nine properties are explicit:

1. **Parallel safety:** after its prerequisites are satisfied, it can run concurrently with other ready lanes or parent work without conflicting ownership or intermediate-state coupling.
2. **Bounded handoff:** a subagent can execute from a bounded packet without hidden session reasoning or live parent back-and-forth.
3. **Owned mission:** the work has a bounded mission and a reason separate ownership is useful.
4. **Sufficient context:** the packet supplies the context and source anchors needed to execute and verify the mission.
5. **Decision boundary:** owned decisions and explicit non-goals define what the lane may and may not decide.
6. **Dependency state:** prerequisites and completed prior results are named so readiness can be determined before execution or dispatch.
7. **Allowed authority:** allowed actions state whether the lane is read-only or may make scoped edits and name its exact authority boundary.
8. **Shaped receipt:** the lane returns `complete`, `partial`, or `blocked` with evidence and unresolved questions.
9. **Parent reduction:** the parent verifies evidence, handles conflicts, and reduces the receipt into the overall workflow before making the final claim.

Classify work as a lane after all nine qualification properties are explicit. Treat conditionality, provider specificity, length, complexity, separate documentation, concurrent scheduling, and delegation as context rather than qualification.

Dependencies create readiness waves. A lane may consume completed prerequisite results and then join a later wave of ready work. Keep work parent-owned while it depends on another lane's in-flight state or continuing parent decisions, then reshape it as a bounded later lane when its inputs settle. Preserve qualified-lane semantics when runtime scheduling is sequential, local, or single-lane.

## Ownership And Authority

Keep three owners distinct:

```text
calling SKILL.md or parent
  owns: execution mode and scheduling; bounded instance packet; prerequisites
        and dependency state; instance authority; receipt collection;
        evidence verification, conflict handling, and final reduction

lane reference
  owns: stable mission; local judgment and calibration; expected inputs;
        maximum allowed actions; non-goals; stop conditions; receipt detail;
        lane-specific additions to any shared shape

lane/output/tool schema
  owns: stable common fields, required slots, values, and ordering only
```

When a caller hands work to a subagent, the caller owns the mutually exclusive `MUST dispatch` or `IF <observable predicate>, dispatch` mode, named lane, bounded packet, lane-reference path, parallel-safety basis, instance authority, expected receipt, and parent reduction point. The lane reference owns local execution depth; the caller retains entry routing and instance scheduling.

The lane reference states a stable maximum authority. Each caller keeps instance authority equal to or narrower than that maximum. Treat evidence and review findings as candidate evidence, and verify scoped implementation against current source and requirements before a final cross-workflow claim.

## What a Lane Reference Contains

A lane reference should make the stable contract executable from bounded context:

```text
mission and reason for separate ownership
expected inputs and source anchors
prerequisites and dependency assumptions
owned decisions and non-goals
maximum allowed actions and edit scope
local judgment, calibration, and procedure
complete | partial | blocked receipt requirements
stop conditions
```

A `complete` receipt reports accomplished work, evidence, changed surfaces when applicable, and remaining verification. For review lanes, `review/lanes/lane-schema.md` owns the stricter status semantics. A `partial` receipt separates finished work from unresolved work and states what is still needed. A `blocked` receipt identifies the blocking condition, evidence, and the decision or state change required to continue. Treat every receipt as provisional until the parent verifies it, resolves contradictions or overlaps, and reduces it against the parent-owned requirements and completion boundary.

Use one parameterized lane reference when the mission, judgment, authority, and stop conditions stay stable and only bounded inputs differ. Use mission-specific lane references when mission, calibration, authority, non-goals, or stop conditions differ materially.

## What a Lane Schema Contains

Create a lane schema only when multiple lanes need the same stable input, context, route, or return fields.

A lane schema contains shared field names, required slots, allowed values, field semantics, ordering, and shape invariants. Each field has one clear meaning; required and optional slots are distinguishable; every enum value is defined; and every extracted shape names its consumers.

Place workflow sequencing, lane selection, dispatch procedure, and reviewer policy in the calling workflow. Place lane missions, rubrics, calibration, and lane-specific examples in the lane reference.

Keep a field in the lane reference when only that lane consumes it. Extract it into the schema only when multiple real consumers require the same contract.

## Shared Shape Families

Choose the family from the real consumer rather than from file location or formatting similarity; the canonical placement test in `reference-design.md` owns each family's final home.

```text
lane-schema
  predicate: multiple lanes share input, context, route, or return fields
  owns: common lane fields; lane-specific mission and judgment stay local
  authority: inherits provisional receipt and parent-reduction semantics

output-schema
  predicate: multiple model-facing consumers need the same readable result
  owns: shared model-readable output fields
  consumers: model-facing workflows
  authority: follows the authority of its consuming workflow

tool-schema
  predicate: a tool, test, CI check, or runtime validates the structure
  owns: machine-validated serialization and constraints
  consumers: tools, tests, CI checks, or runtimes
  authority: owns the validated representation while lane authority stays with
             the calling workflow and lane reference
```

Use these families to classify owned shapes. One result may satisfy more than one predicate. Compose overlap through links, nesting, or one declared authoritative owner:

```text
lane envelope       -> dependency state, instance authority, status, receipt, handoff
output payload      -> shared model-readable result consumed in multiple places
tool representation -> authoritative machine-validated serialization and constraints
```

Keep each shared field in one authoritative schema. Use a `tool-schema` when a tool, test, CI check, or runtime validates the structure itself. Keep lane authority with the calling workflow and lane reference.

Extract shared shapes consumer-first:

1. name the real consumers;
2. extract only fields that must remain stable across them;
3. keep mission, policy, examples, and calibration with the consuming reference;
4. link each consumer to the shared owner instead of copying fields;
5. keep single-use slots local;
6. use JSON Schema only when a machine validator exists.

Completion: the lane either satisfies all nine qualifications or stays ordinary/parent-owned; owner and authority boundaries are explicit; every receipt has a parent reduction point; and each extracted shape has a named consumer, one authoritative owner, and the validation form its consumer actually requires.
