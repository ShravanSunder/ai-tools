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
- Lane: retired as an execution shape for review and research. Their former missions are ordered checks loaded by the 🔎 Review Sidekick or researcher. Only prescribed 🔧 Operator procedures are dispatched by the Call Grammar.
- Execution shape: an agent-loaded step or prescribed 🔧 Operator procedure.
- Context pointer: wording that names when to load a reference and what to do with it. Weak pointer wording is a variance bug.
- Branch predicate: the observable condition that selects a branch.
- Return shape: the concrete result a reference pass or branch brings back to the main path, such as a verdict, filled slots, proof result, route decision, or edit boundary.
- Check status: `complete | partial | blocked` for a selected review check; an unselected optional check is `complete` with `not selected: <reason>`.
- Parent reduction: the 🔎 Review Sidekick verifies evidence, resolves conflicts, and returns one review result.
- Schema: a reusable shape a downstream consumer can rely on.
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
