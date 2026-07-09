# Glossary

Vocabulary for judging great skills. Definitions only -- operational rules live
in `SKILL.md` or the branch reference that owns them.

## Root Virtue

- Predictability: the agent follows the same process reliably, even when the
  output differs. The route is judged, not token-for-token sameness.
- Reusable behavior: the durable agent behavior the skill exists to stabilize.

## Invocation

- Trigger surface: YAML/frontmatter description plus any router wording that
  decides whether the skill loads.
- Description: the always-visible context pointer for a model-invocable skill. It
  names when to load and why, not how to run the workflow.
- Model-invocable: discoverable by the agent through its description. Pays
  context load.
- User-invocable: available for the human to name directly. Pays human
  cognitive load.
- Router skill: a user-invocable index that helps the human choose among other
  user-invocable skills.
- Context load: the token and attention cost of always-visible trigger text.
- Cognitive load: the human memory and choice cost of skills the model cannot
  discover alone.
- Granularity: how finely skills are split. More model-invocable skills spend
  context load; more user-invocable skills spend cognitive load.

## Information Hierarchy

- Steps: ordered actions the agent performs. They belong in `SKILL.md` when
  order changes behavior.
- Workflow topology: the route from trigger through all-run spine, branches,
  return shapes, and completion/proof.
- All-run spine: the part of the workflow every invocation needs. It belongs in
  `SKILL.md`.
- Reference: definitions, facts, examples, rubrics, commands, or conditional
  details consulted while using the skill.
- Context pointer: wording that names when to load a reference and what to do
  with it. Weak pointer wording is a variance bug.
- Progressive disclosure: moving branch-specific or heavy reference out of
  `SKILL.md` behind a context pointer.
- Co-location: keeping a concept's definition, rules, caveats, and examples
  near each other once their hierarchy level is chosen.
- Branch: a distinct way the skill runs that needs different reference or proof.
- Branch predicate: the observable condition that sends the agent into a branch.
- Return shape: the concrete result a branch brings back to the main path, such
  as a verdict, filled slots, proof result, route decision, or edit boundary.
- Lane: a branch designed as an independent workflow step.
- Schema: a reusable shape a downstream consumer can rely on.
- Lane-schema: the shared route, input, or return shape used by independent
  lanes.
- Output-schema: the shared result shape multiple consumers need from model
  output.
- Tool-schema: the shape validated by a tool, test, CI check, or runtime.

## Steering

- Mental model: the lens the skill asks the agent to think with while working.
- Leading word: a compact concept that recruits useful model priors and anchors
  behavior, such as `root cause`, `vertical slice`, or `single source of truth`.
- Completion criterion: the checkable condition that tells the agent a step or
  reference pass is complete.
- Legwork: the work a completion criterion demands inside a step, such as
  reading files, checking examples, or proving a claim.
- Premature completion: ending a step before the completion criterion is
  actually met.
- Positive shape: wording that states the target shape or behavior directly,
  rather than describing what not to do.
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
- RED/GREEN/REFACTOR: capture baseline failure or proof gap, revise the skill,
  then tighten the smallest wording that still leaks.
- Micro-test: a quick wording check with no-guidance control and fresh-context
  repetitions.
- Rationalization: the excuse an agent uses to skip the intended behavior under
  pressure.
