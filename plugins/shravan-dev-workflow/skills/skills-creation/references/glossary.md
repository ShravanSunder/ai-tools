# Glossary

Vocabulary for judging great skills. Definitions only — operational rules live in `SKILL.md` or the reference that owns them.

## Root Virtue

- Predictability: the agent follows the same process reliably, even when the output differs. The route is judged, not token-for-token sameness.
- Reusable behavior: the durable agent behavior the skill exists to stabilize.

## Invocation

Model-invocable, user-invocable, context load, cognitive load, and router skills are explained in `SKILL.md`.

- Trigger surface: YAML/frontmatter description plus any router wording that decides whether the skill loads.
- Description: the always-visible context pointer for a model-invocable skill. It names when to load and why, not how to run the workflow.

## Information Hierarchy

`SKILL.md` carries the compact hierarchy and call grammar. `reference-design.md` owns ordinary-reference rules, and `reference-lanes-design.md` owns lane and shared-shape rules.

- Load mode: the caller-owned choice between all-run `MUST load` and conditional `IF <observable predicate>, load`.
- Mandatory reference: coherent all-run detail consumed through `MUST load` while its parent obligation and completion stay visible in `SKILL.md`.

- Steps: ordered actions the agent performs. They belong in `SKILL.md` when order changes behavior.
- All-run spine: the part of the workflow every invocation needs. It belongs in `SKILL.md`.
- Reference: detail consulted after its caller selects the work.
- Ordinary reference: mandatory or conditional detail loaded by the same agent that follows the calling workflow.
- Lane: bounded, qualified work dispatched to a subagent and returned to the parent for verification and reduction. The lane is the work; its lane reference is the file contract.
- Lane reference: the file a dispatched subagent loads for the lane's stable mission, inputs, decisions, maximum authority, procedure, receipt requirements, and stop conditions.
- Execution shape: the work's classification as an ordinary reference or a parallel-safe, handoff-ready lane.
- Context pointer: wording that names when to load a reference and what to do with it. Weak pointer wording is a variance bug.
- Branch predicate: the observable condition that selects a branch.
- Return shape: the concrete result a reference pass or branch brings back to the main path, such as a verdict, filled slots, proof result, route decision, or edit boundary.
- Lane qualification: the complete parallel-safety, bounded-handoff, mission, context, decision, dependency, authority, receipt, and parent-reduction contract that earns work its lane classification.
- Readiness wave: a set of lanes whose prerequisites and required prior results are complete, making them semantically eligible to overlap.
- Lane receipt: a `complete`, `partial`, or `blocked` lane result carrying evidence and unresolved questions for parent verification.
- Parent reduction: the parent's verification, conflict handling, and integration of lane receipts into the overall workflow and final claim.
- Maximum authority: the stable upper bound on actions a lane reference permits.
- Instance authority: the actions permitted for one caller-supplied lane invocation within its reference's maximum authority.
- Schema: a reusable shape a downstream consumer can rely on.
- Lane schema: stable input, context, route, or return fields shared by multiple lanes. It makes each field's meaning, requirement, allowed values, and consumers clear. Lane references own missions; calling workflows own workflow policy.
- Output-schema: stable readable result fields shared by multiple model-facing consumers.
- Tool-schema: stable structure machine-validated by a tool, test, CI check, or runtime.

## Steering

- Mental model: the lens the skill asks the agent to think with while working.
- Leading word: a compact concept that recruits useful model priors and anchors behavior, such as `root cause`, `vertical slice`, or `single source of truth`.
- Completion criterion: the checkable condition that tells the agent a step or reference pass is complete.
- Legwork: the work a completion criterion demands inside a step, such as reading files, checking examples, or proving a claim.
- Positive shape: wording that states the target shape or behavior directly, rather than describing what not to do.

## Pruning

- Single source of truth: one authoritative home for each meaning.
- Duplication: the same meaning stated in more than one home.
- Sediment: stale guidance kept because deleting it felt risky.
- No-op: wording that does not change model behavior versus the default.

## Proof

- Structural proof: evidence that files are valid, parse, package, or validate.
- Behavior proof: evidence that the skill changes what the agent does.
- RED/GREEN/REFACTOR: capture baseline failure or proof gap, revise the skill, then tighten the smallest wording that still leaks.
- Micro-test: a quick wording check with no-guidance control and fresh-context repetitions.
- Rationalization: the excuse an agent uses to skip the intended behavior under pressure.
