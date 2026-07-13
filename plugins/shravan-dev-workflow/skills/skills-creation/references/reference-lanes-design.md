# Reference Lanes And Shared Shapes

This reference owns lane qualification, lane job-contract design, and stable shared-shape selection. Return the lane qualification and job contract, or the selected shape owner and validation route.

It is authoring guidance for the `skills-creation` workflow. It is not a universal runtime packet or schema for authored skills to import. Each consuming skill owns its actual packets, lane references, and shared shapes.

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

Parallel safety and bounded subagent handoff are necessary but insufficient. Conditional, provider-specific, long, complex, separately documented, concurrently scheduled, or delegated work is not a lane unless it satisfies the complete qualification test.

Dependencies create readiness waves. A lane may consume completed prerequisite results and then join a later wave of ready work. Work that needs another lane's in-flight state or continuing parent decisions is not ready as a lane; keep it parent-owned or reshape it as a bounded later lane. A qualified lane remains a lane when the runtime schedules it sequentially, locally, or without a ready peer.

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

When a caller hands work to a subagent, the caller owns the mutually exclusive `MUST dispatch` or `IF <observable predicate>, dispatch` mode, named lane, bounded packet, lane-reference path, parallel-safety basis, instance authority, expected receipt, and parent reduction point. The lane reference owns local execution depth, not its own entry route or an instance's scheduling decision.

The lane reference states a stable maximum authority. Each caller states the authority for that instance. Instance authority may equal or narrow the maximum; it must never widen it. A lane executing in a subagent gains no final cross-workflow authority: evidence and review findings remain candidate evidence, and scoped implementation remains subject to parent verification against current source and requirements.

## Lane Job Contract

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

A `complete` receipt reports accomplished work, evidence, changed surfaces when applicable, and remaining verification. A `partial` receipt separates finished work from unresolved work and states what is still needed. A `blocked` receipt identifies the blocking condition, evidence, and the decision or state change required to continue. None is a final workflow verdict until the parent verifies it, resolves contradictions or overlaps, and reduces it against the parent-owned requirements and completion boundary.

Use one parameterized lane reference when the mission, judgment, authority, and stop conditions stay stable and only bounded inputs differ. Use mission-specific lane references when mission, calibration, authority, non-goals, or stop conditions differ materially.

## Shared Shape Families

Choose the family from the real consumer rather than from file location or formatting similarity:

```text
lane input/context/receipt shape -> references/<name>-lane-schema.md
shared model-readable output     -> references/<name>-output-schema.md
machine-validated structure      -> schemas/<name>.schema.json
                                    or references/<name>-tool-schema.md
```

```text
lane-schema
  predicate: multiple lanes share input, context, route, or return fields
  owns: common lane fields; lane-specific mission and judgment stay local
  authority: inherits provisional receipt and parent-reduction semantics

output-schema
  predicate: multiple model-facing consumers need the same readable result
  owns: shared model-readable output fields; no lane is required
  authority: follows the authority of its consuming workflow

tool-schema
  predicate: a tool, test, CI check, or runtime validates the structure
  owns: machine-validated serialization and constraints; no lane is required
  authority: may be the authoritative validated runtime contract, but gains no
             lane dispatch or parent-reduction authority from validation alone
```

These families classify owned shapes, not entire workflows or files. One result may satisfy more than one predicate. Compose overlap through links, nesting, or one declared authoritative owner:

```text
lane envelope       -> dependency state, instance authority, status, receipt, handoff
output payload      -> shared model-readable result consumed in multiple places
tool representation -> authoritative machine-validated serialization and constraints
```

Do not copy the same fields into competing schemas. A behavior test or prose assertion does not create a `tool-schema`; the structure itself must be machine validated. Machine validation does not grant lane authority to an output or tool shape.

Extract shared shapes consumer-first:

1. name the real consumers;
2. extract only fields that must remain stable across them;
3. keep mission, policy, examples, and calibration with the consuming reference;
4. link each consumer to the shared owner instead of copying fields;
5. keep single-use slots local;
6. use JSON Schema only when a machine validator exists.

Completion: the lane either satisfies all nine qualifications or stays ordinary/parent-owned; owner and authority boundaries are explicit; every receipt has a parent reduction point; and each extracted shape has a named consumer, one authoritative owner, and the validation form its consumer actually requires.
