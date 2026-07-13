# Glossary

Vocabulary for judging great skills. Definitions only -- operational rules live in `SKILL.md` or the reference that owns them.

## Root Virtue

- Predictability: the agent follows the same process reliably, even when the output differs. The route is judged, not token-for-token sameness.
- Reusable behavior: the durable agent behavior the skill exists to stabilize.

## Invocation

- Trigger surface: YAML/frontmatter description plus any router wording that decides whether the skill loads.
- Description: the always-visible context pointer for a model-invocable skill. It names when to load and why, not how to run the workflow.
- Model-invocable: discoverable by the agent through its description. Pays context load.
- User-invocable: available for the human to name directly. Pays human cognitive load.
- Router skill: a user-invocable index that helps the human choose among other user-invocable skills.
- Context load: the token and attention cost of always-visible trigger text.
- Cognitive load: the human memory and choice cost of skills the model cannot discover alone.
- Granularity: how finely skills are split. More model-invocable skills spend context load; more user-invocable skills spend cognitive load.

## Information Hierarchy

- Steps: ordered actions the agent performs. They belong in `SKILL.md` when order changes behavior.
- Workflow topology: the route from trigger through all-run spine, branches, return shapes, and completion/proof.
- All-run spine: the part of the workflow every invocation needs. It belongs in `SKILL.md`.
- Reference: coherent mandatory or conditional detail consulted after the calling `SKILL.md` selects the work.
- Load mode: the caller-owned choice between all-run `MUST load` and conditional `IF <observable predicate>, load` consumption in the current workflow.
- Execution shape: the work's classification as an ordinary reference or a parallel-safe, handoff-ready lane.
- Mandatory reference: coherent all-run detail consumed through `MUST load` while its parent obligation and completion remain visible in `SKILL.md`.
- Context pointer: wording that names when to load a reference and what to do with it. Weak pointer wording is a variance bug.
- Progressive disclosure: moving coherent detailed procedure or branch-specific depth out of `SKILL.md` behind a complete caller.
- Co-location: keeping a concept's definition, rules, caveats, and examples near each other once their hierarchy level is chosen.
- Branch: a conditional route that changes the work performed by the skill.
- Branch predicate: the observable condition that selects a branch.
- Return shape: the concrete result a reference pass or branch brings back to the main path, such as a verdict, filled slots, proof result, route decision, or edit boundary.
- Lane: a parallel-safe work boundary that a subagent can execute from bounded context once declared prerequisites are satisfied, with an owned mission, context and source anchors, decisions and non-goals, dependency state, authority, shaped receipt, and parent-owned verification and reduction. Independence is semantic: a lane remains a lane when run locally or scheduled sequentially.
- Lane qualification: the complete parallel-safety, bounded-handoff, mission, context, decision, dependency, authority, receipt, and parent-reduction contract. Parallel execution or delegation alone does not qualify work as a lane.
- Readiness wave: a set of lanes whose prerequisites and required prior results are complete, making them semantically eligible to overlap.
- Lane receipt: a `complete`, `partial`, or `blocked` lane result carrying evidence and unresolved questions for parent verification.
- Parent reduction: the parent's verification, conflict handling, and integration of lane receipts into the overall workflow and final claim.
- Maximum authority: the stable upper bound on actions a lane reference permits.
- Instance authority: the actions permitted for one caller-supplied lane invocation within its reference's maximum authority.
- Schema: a reusable shape a downstream consumer can rely on.
- Lane-schema: stable input, context, route, or return fields shared by multiple lanes, including provisional receipt and parent-reduction semantics.
- Output-schema: stable readable result fields shared by multiple model-facing consumers without implying a lane.
- Tool-schema: stable structure machine-validated by a tool, test, CI check, or runtime without implying a lane.

## Steering

- Mental model: the lens the skill asks the agent to think with while working.
- Leading word: a compact concept that recruits useful model priors and anchors behavior, such as `root cause`, `vertical slice`, or `single source of truth`.
- Completion criterion: the checkable condition that tells the agent a step or reference pass is complete.
- Legwork: the work a completion criterion demands inside a step, such as reading files, checking examples, or proving a claim.
- Premature completion: ending a step before the completion criterion is actually met.
- Positive shape: wording that states the target shape or behavior directly, rather than describing what not to do.
- Negation: a prohibition that can pull the forbidden behavior into context.

## Pruning

- Single source of truth: one authoritative home for each meaning.
- Duplication: the same meaning stated in more than one home.
- Sediment: stale guidance kept because deleting it felt risky.
- Sprawl: live material that is too long for its place in the hierarchy.
- No-op: wording that does not change model behavior versus the default.
- Relevance: whether a line still bears on what the skill does.

## Proof

- Structural proof: evidence that files are valid, parse, package, or validate.
- Behavior proof: evidence that the skill changes what the agent does.
- RED/GREEN/REFACTOR: capture baseline failure or proof gap, revise the skill, then tighten the smallest wording that still leaks.
- Micro-test: a quick wording check with no-guidance control and fresh-context repetitions.
- Rationalization: the excuse an agent uses to skip the intended behavior under pressure.
